Custom instruction
==================

There are multiple ways you can add custom instructions into VexiiRiscv. The following chapter will provide some demo.

SIMD add
--------

Let's define a plugin which will implement a SIMD add (4x8bits adder), working on the integer register file.

The plugin will be based on the ExecutionUnitElementSimple which makes implementing ALU plugins simpler. Such a plugin can then be used to compose a given execution lane layer

For instance the Plugin configuration could be :

.. code:: scala

    plugins += new SrcPlugin(early0, executeAt = 0, relaxedRs = relaxedSrc)
    plugins += new IntAluPlugin(early0, formatAt = 0)
    plugins += new BarrelShifterPlugin(early0, formatAt = relaxedShift.toInt)
    plugins += new IntFormatPlugin("lane0")
    plugins += new BranchPlugin(early0, aluAt = 0, jumpAt = relaxedBranch.toInt, wbAt = 0)
    plugins += new SimdAddPlugin(early0) // <- We will implement this plugin

.. _custom_plugin_impl:

Plugin implementation
^^^^^^^^^^^^^^^^^^^^^

Here is a example how this plugin could be implemented :

- https://github.com/SpinalHDL/VexiiRiscv/blob/dev/src/main/scala/vexiiriscv/execute/SimdAddPlugin.scala

.. code:: scala

    package vexiiriscv.execute

    import spinal.core._
    import spinal.lib._
    import spinal.lib.pipeline.Stageable
    import vexiiriscv.Generate.args
    import vexiiriscv.{Global, ParamSimple, VexiiRiscv}
    import vexiiriscv.compat.MultiPortWritesSymplifier
    import vexiiriscv.riscv.{IntRegFile, RS1, RS2, Riscv}

    // This plugin example will add a new instruction named SIMD_ADD which do the following :
    //
    // RD : Regfile Destination, RS : Regfile Source
    // RD( 7 downto  0) = RS1( 7 downto  0) + RS2( 7 downto  0)
    // RD(16 downto  8) = RS1(16 downto  8) + RS2(16 downto  8)
    // RD(23 downto 16) = RS1(23 downto 16) + RS2(23 downto 16)
    // RD(31 downto 24) = RS1(31 downto 24) + RS2(31 downto 24)
    //
    // Instruction encoding :
    // 0000000----------000-----0001011   <- Custom0 func3=0 func7=0
    //        |RS2||RS1|   |RD |
    //
    // Note :  RS1, RS2, RD positions follow the RISC-V spec and are common for all instruction of the ISA


    object SimdAddPlugin{
      // Define the instruction type and encoding that we wll use
      val ADD4 = IntRegFile.TypeR(M"0000000----------000-----0001011")
    }

    // ExecutionUnitElementSimple is a plugin base class which will integrate itself in a execute lane layer
    // It provide quite a few utilities to ease the implementation of custom instruction.
    // Here we will implement a plugin which provide SIMD add on the register file.
    class SimdAddPlugin(val layer : LaneLayer) extends ExecutionUnitElementSimple(layer) {

      // Here we create an elaboration thread. The Logic class is provided by ExecutionUnitElementSimple to provide functionalities
      val logic = during setup new Logic {
        // Here we could have lock the elaboration of some other plugins (ex CSR), but here we don't need any of that
        // as all is already sorted out in the Logic base class.
        // So we just wait for the build phase
        awaitBuild()

        // Let's assume we only support RV32 for now
        assert(Riscv.XLEN.get == 32)

        // Let's get the hardware interface that we will use to provide the result of our custom instruction
        val wb = newWriteback(ifp, 0)

        // Specify that the current plugin will implement the ADD4 instruction
        val add4 = add(SimdAddPlugin.ADD4).spec

        // We need to specify on which stage we start using the register file values
        add4.addRsSpec(RS1, executeAt = 0)
        add4.addRsSpec(RS2, executeAt = 0)

        // Now that we are done specifying everything about the instructions, we can release the Logic.uopRetainer
        // This will allow a few other plugins to continue their elaboration (ex : decoder, dispatcher, ...)
        uopRetainer.release()

        // Let's define some logic in the execute lane [0]
        val process = new el.Execute(id = 0) {
          // Get the RISC-V RS1/RS2 values from the register file
          val rs1 = el(IntRegFile, RS1).asUInt
          val rs2 = el(IntRegFile, RS2).asUInt

          // Do some computation
          val rd = UInt(32 bits)
          rd( 7 downto  0) := rs1( 7 downto  0) + rs2( 7 downto  0)
          rd(16 downto  8) := rs1(16 downto  8) + rs2(16 downto  8)
          rd(23 downto 16) := rs1(23 downto 16) + rs2(23 downto 16)
          rd(31 downto 24) := rs1(31 downto 24) + rs2(31 downto 24)

          // Provide the computation value for the writeback
          wb.valid := SEL
          wb.payload := rd.asBits
        }
      }
    }


VexiiRiscv generation
^^^^^^^^^^^^^^^^^^^^^

Then, to generate a VexiiRiscv with this new plugin, we could run the following App :

- Bottom of https://github.com/SpinalHDL/VexiiRiscv/blob/dev/src/main/scala/vexiiriscv/execute/SimdAddPlugin.scala

.. code:: scala

    object VexiiSimdAddGen extends App {
      val param = new ParamSimple()
      val sc = SpinalConfig()

      assert(new scopt.OptionParser[Unit]("VexiiRiscv") {
        help("help").text("prints this usage text")
        param.addOptions(this)
      }.parse(args, Unit).nonEmpty)

      sc.addTransformationPhase(new MultiPortWritesSymplifier)
      val report = sc.generateVerilog {
        val pa = param.pluginsArea()
        pa.plugins += new SimdAddPlugin(pa.early0)
        VexiiRiscv(pa.plugins)
      }
    }


To run this App, you can go to the NaxRiscv directory and run :

.. code:: shell

    sbt "runMain vexiiriscv.execute.VexiiSimdAddGen"

Software test
^^^^^^^^^^^^^

Then let's write some assembly test code : (https://github.com/SpinalHDL/NaxSoftware/tree/849679c70b238ceee021bdfd18eb2e9809e7bdd0/baremetal/simdAdd)

.. code:: shell

    .globl _start
    _start:

    #include "../../driver/riscv_asm.h"
    #include "../../driver/sim_asm.h"
    #include "../../driver/custom_asm.h"

        // Test 1
        li x1, 0x01234567
        li x2, 0x01FF01FF
        opcode_R(CUSTOM0, 0x0, 0x00, x3, x1, x2) // x3 = ADD4(x1, x2)

        // Print result value
        li x4, PUT_HEX
        sw x3, 0(x4)

        // Check result
        li x5, 0x02224666
        bne x3, x5, fail

        j pass

    pass:
        j pass
    fail:
        j fail

Compile it with

.. code:: shell

    make clean rv32im

Simulation
^^^^^^^^^^

You could run a simulation using this testbench :

- Bottom of https://github.com/SpinalHDL/VexiiRiscv/blob/dev/src/main/scala/vexiiriscv/execute/SimdAddPlugin.scala

.. code:: scala

    object VexiiSimdAddSim extends App {
      val param = new ParamSimple()
      val testOpt = new TestOptions()

      val genConfig = SpinalConfig()
      genConfig.includeSimulation

      val simConfig = SpinalSimConfig()
      simConfig.withFstWave
      simConfig.withTestFolder
      simConfig.withConfig(genConfig)

      assert(new scopt.OptionParser[Unit]("VexiiRiscv") {
        help("help").text("prints this usage text")
        testOpt.addOptions(this)
        param.addOptions(this)
      }.parse(args, Unit).nonEmpty)

      println(s"With Vexiiriscv parm :\n - ${param.getName()}")
      val compiled = simConfig.compile {
        val pa = param.pluginsArea()
        pa.plugins += new SimdAddPlugin(pa.early0)
        VexiiRiscv(pa.plugins)
      }
      testOpt.test(compiled)
    }

Which can be run with :

.. code:: shell

    sbt "runMain vexiiriscv.execute.VexiiSimdAddSim --load-elf ext/NaxSoftware/baremetal/simdAdd/build/rv32ima/simdAdd.elf --trace-all --no-rvls-check"


Which will output the value 02224666 in the shell and show traces in simWorkspace/VexiiRiscv/test :D

Note that --no-rvls-check is required as spike do not implement that custom simdAdd.

Conclusion
^^^^^^^^^^

So overall this example didn't introduce how to specify some additional decoding, nor how to define multi-cycle ALU. (TODO).
But you can take a look in the IntAluPlugin, ShiftPlugin, DivPlugin, MulPlugin and BranchPlugin which are doing those things using the same ExecutionUnitElementSimple base class.


