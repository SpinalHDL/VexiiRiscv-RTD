MicroSoc
--------

MicroSoC is a little SoC based on VexiiRiscv and a tilelink interconnect.

Its goals are :

- To provide a simple reference design
- To be a simple and light FPGA SoC
- Target a high frequency of operation, but not a high IPC (by default)

Here is a architecture diagram :

.. image:: /asset/picture/microsoc.png


Here you can see the default vexiiriscv architecture for this SoC :

.. image:: /asset/picture/microsoc_vexii.png



You can find its implementation here https://github.com/SpinalHDL/VexiiRiscv/blob/dev/src/main/scala/vexiiriscv/soc/micro

- MicroSoc.scala : Contains the SoC toplevel
- MicroSocGen.scala : Contains the scala main which can be used to generate the SoC verilog
- MicroSocSim.scala : Contains a simple SpinalSim testbench for the SoC

Verilog generation
^^^^^^^^^^^^^^^^^^^

To generate the SoC verilog, you can run :

.. code:: shell

    # Default configuration
    sbt "runMain vexiiriscv.soc.micro.MicroSocGen"
    # SoC with 32 KB + RV32IMC running at 50 Mhz:
    sbt "runMain vexiiriscv.soc.micro.MicroSocGen --ram-bytes=32768 --with-rvm --with-rvc --system-frequency=50000000"
    # List all the parameters available
    sbt "runMain vexiiriscv.soc.micro.MicroSocGen --help"

Simulation (SpinalSim / Verilator)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you have Verilator installed, you can run a simulation by doing :

.. code:: shell

    # Default configuration
    sbt "runMain vexiiriscv.soc.micro.MicroSocSim"
    # List all the parameters available
    sbt "runMain vexiiriscv.soc.micro.MicroSocSim --help"

While the simulation is running you can connect to it using openocd as if it was real hardware :

.. code:: shell

    openocd -f src/main/tcl/openocd/vexiiriscv_sim.tcl

