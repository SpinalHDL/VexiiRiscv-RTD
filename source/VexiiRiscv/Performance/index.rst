Performance / Area / FMax
=========================

It is still very early in the development, but here are some metrics :

+---------------+----------------+
| Name          | Max IPC        |
+---------------+----------------+
| Issue         | 2              |
+---------------+----------------+
| Late ALU      | 2              |
+---------------+----------------+
| BTB / RAS     | 512 / 4        |
+---------------+----------------+
| GShare        | 4KB            |
+---------------+----------------+
| Drystone/MHz  | 2.50           |
+---------------+----------------+
| Coremark/MHz  | 5.24           |
+---------------+----------------+
| EmBench       | 1.62           |
+---------------+----------------+

It is too early for area / fmax metric, there is a lot of design space exploration to do which will trade IPC against FMax / Area.



Here are a few synthesis results : 

.. code-block:: 

    ! Note ! 
    Those results are with the best speed grade of each family
    In practice, depending what board/FPGA you use, it is common for them to have worst speed grade.
    Also, concerning the area usage, those numbers are a bit inflated because : 
    - The SDC constraint stress the timings => Synthesis use more logic to improve the timings
    - The inputs/outputs of the design are serialized/deserialized (ff+logic cost) to reduce the pin count

    rv32i_noBypass ->
    - 0.78 Dhrystone/MHz 0.60 Coremark/MHz
    - Artix 7    -> 210 MHz 1182 LUT 1759 FF 
    - Cyclone V  -> 159 MHz 1,015 ALMs
    - Cyclone IV -> 130 MHz 1,987 LUT 2,017 FF 
    - Trion      -> 94 MHz LUT 1847   FF 1990
    - Titanium   -> 320 MHz LUT 2005   FF 2030

    rv32i ->
    - 1.12 Dhrystone/MHz 0.87 Coremark/MHz
    - Artix 7    -> 206 MHz 1413 LUT 1761 FF 
    - Cyclone V  -> 138 MHz 1,244 ALMs
    - Cyclone IV -> 124 MHz 2,188 LUT 2,019 FF 
    - Trion      -> 78 MHz LUT 2252   FF 1962
    - Titanium   -> 300 MHz LUT 2347   FF 2000

    rv64i ->
    - 1.18 Dhrystone/MHz 0.77 Coremark/MHz
    - Artix 7    -> 186 MHz 2157 LUT 2332 FF 
    - Cyclone V  -> 117 MHz 1,760 ALMs
    - Cyclone IV -> 113 MHz 3,432 LUT 2,770 FF 
    - Trion      -> 83 MHz LUT 3883   FF 2681
    - Titanium   -> 278 MHz LUT 3909   FF 2783

    rv32im ->
    - 1.20 Dhrystone/MHz 2.70 Coremark/MHz
    - Artix 7    -> 190 MHz 1815 LUT 2078 FF 
    - Cyclone V  -> 131 MHz 1,474 ALMs
    - Cyclone IV -> 125 MHz 2,781 LUT 2,266 FF 
    - Trion      -> 83 MHz LUT 2643   FF 2209
    - Titanium   -> 324 MHz LUT 2685   FF 2279

    rv32im_branchPredict ->
    - 1.45 Dhrystone/MHz 2.99 Coremark/MHz
    - Artix 7    -> 195 MHz 2066 LUT 2438 FF 
    - Cyclone V  -> 136 MHz 1,648 ALMs
    - Cyclone IV -> 117 MHz 3,093 LUT 2,597 FF 
    - Trion      -> 86 MHz LUT 2963   FF 2568
    - Titanium   -> 327 MHz LUT 3015   FF 2636

    rv32im_branchPredict_cached8k8k ->
    - 1.45 Dhrystone/MHz 2.97 Coremark/MHz
    - Artix 7    -> 210 MHz 2721 LUT 3477 FF 
    - Cyclone V  -> 137 MHz 1,953 ALMs
    - Cyclone IV -> 127 MHz 3,648 LUT 3,153 FF 
    - Trion      -> 93 MHz LUT 3388   FF 3204
    - Titanium   -> 314 MHz LUT 3432   FF 3274

    rv32imasu_cached_branchPredict_cached8k8k_linux ->
    - 1.45 Dhrystone/MHz 2.96 Coremark/MHz
    - Artix 7    -> 199 MHz 3351 LUT 3833 FF 
    - Cyclone V  -> 131 MHz 2,612 ALMs
    - Cyclone IV -> 109 MHz 4,909 LUT 3,897 FF 
    - Trion      -> 73 MHz LUT 4367   FF 3613
    - Titanium   -> 270 MHz LUT 4409   FF 3724

    rv32im_branchPredictStressed_cached8k8k_ipcMax_lateAlu ->
    - 1.74 Dhrystone/MHz 3.41 Coremark/MHz
    - Artix 7    -> 140 MHz 3247 LUT 3755 FF 
    - Cyclone V  -> 99 MHz 2,477 ALMs
    - Cyclone IV -> 85 MHz 4,835 LUT 3,765 FF 
    - Trion      -> 60 MHz LUT 4438   FF 3832
    - Titanium   -> 228 MHz LUT 4459   FF 3963


Tuning
------

VexiiRiscv can scale a lot in function of its plugins/parameters. It can scale from simple microcontroller
(ex M0) up to an application processor (A53),

On FPGA there is a few options which can be key in order to scale up the IPC while preserving the FMax :

- --relaxed-btb : When the BTB is enabled, by default it is implemented as a single cycle predictor,
  This can be easily be the first critical path to appear.
  This option make the BTB implementation spread over 2 cycles,
  which relax the timings at the cost of 1 cycle penalty on every successful branch predictions.
- --relaxed-branch : By default, the BranchPlugin will flush/setPc in the same stage
  than its own ALU. This is good for IPC but can easily be a critical path.
  This option will add one cycle latency between the ALU and the side effects (flush/setPc)
  in order to improve timings.
  If you enabled the branch prediction, then the impact on the IPC should be quite low.
- --fma-reduced-accuracy and --fpu-ignore-subnormal both reduce and can improve the fmax
  at the cost of accuracy
- --fetch-fork-at=1 : If you don't have a instruction cache, this option will significantly relax the
  timings of the instruction fetch bus. With this option, instead of connecting the fetch bus to the first stage of the
  fetch pipeline (address generation stage), it will connect it to the stage after.
- --lsu-fork-at=1 --lsu-pma-at : If you don't have a data cache, this option will relax the LSU memory bus command channel
  by pushing everything down one stage before forking requests to the memory system.


Critical paths tool
-------------------

At the end of your synthesis/place/route tools, you get a critical path report where hopefully, the source and destination registers are well named.
The issue is that in between, all the combinatorial logic and signals names become unrecognizable or misleading most of the time.
Also, in CPU design, it can quite easily happen that some combinatorial path "leak" through the pipeline, degrading the FMax quite a bit !

So there is a tool you can use in SpinalHDL to provide you a "clean" combinatorial path report between 2 signals of a design.
Here is an example how you can use it in VexiiRiscv :

.. code-block:: bash

    sbt "Test/runMain vexiiriscv.Generate --stressed-src --allow-bypass-from=0 --analyse-path from=execute_ctrl2_up_integer_RS1_lane0,to=execute_ctrl1_down_integer_RS1_lane0"

This will report you the various paths from execute_ctrl2_up_integer_RS1_lane0 to execute_ctrl1_down_integer_RS1_lane0.

Here is one of the path reported, which goes through RS1 -> SrcPlugin -> BarrelShifterPlugin -> IntFormatPlugin -> WriteBackPlugin -> RS1 bypass -> RS1 :

.. code-block::

    - (toplevel/execute_ctrl2_up_integer_RS1_lane0 :  Bits[32 bits])
    - (Bits -> SInt of 32 bits)
    - (toplevel/_zz_execute_ctrl2_down_early0_SrcPlugin_SRC1_lane0 :  SInt[32 bits])
    - (toplevel/execute_ctrl2_down_early0_SrcPlugin_SRC1_lane0 :  SInt[32 bits])
    - (Bool ? Bits | Bits)[32 bits]
    - (toplevel/early0_BarrelShifterPlugin_logic_shift_reversed :  SInt[32 bits])
    - (SInt -> Bits of 32 bits)
    - Bits ## Bits
    - (Bits -> SInt of 33 bits)
    - (SInt >> UInt)[33 bits]
    - resize(SInt,32 bits)
    - (toplevel/early0_BarrelShifterPlugin_logic_shift_shifted :  SInt[32 bits])
    - (Bool ? Bits | Bits)[32 bits]
    - (toplevel/early0_BarrelShifterPlugin_logic_shift_patched :  SInt[32 bits])
    - (SInt -> Bits of 32 bits)
    - (toplevel/execute_ctrl2_down_early0_BarrelShifterPlugin_SHIFT_RESULT_lane0 :  Bits[32 bits])
    - (toplevel/early0_BarrelShifterPlugin_logic_wb_payload :  Bits[32 bits])
    - (Bool ? Bits | Bits)[32 bits]
    - (Bits | Bits)[32 bits]
    - (toplevel/lane0_IntFormatPlugin_logic_stages_0_raw :  Bits[32 bits])
    - (toplevel/lane0_IntFormatPlugin_logic_stages_0_wb_payload :  Bits[32 bits])
    - (Bool ? Bits | Bits)[32 bits]
    - (Bits | Bits)[32 bits]
    - (toplevel/lane0_integer_WriteBackPlugin_logic_stages_0_muxed :  Bits[32 bits])
    - (toplevel/execute_ctrl2_lane0_integer_WriteBackPlugin_logic_DATA_lane0_bypass :  Bits[32 bits])
    - (toplevel/execute_ctrl2_down_lane0_integer_WriteBackPlugin_logic_DATA_lane0 :  Bits[32 bits])
    - (toplevel/_zz_execute_ctrl1_down_integer_RS1_lane0_1 :  Bits[32 bits])
    - (toplevel/execute_ctrl1_down_integer_RS1_lane0 :  Bits[32 bits])

And there is the reported list of all named signal used by any of the paths :

.. code-block::

    - (toplevel/_zz_execute_ctrl1_down_integer_RS1_lane0_1 :  Bits[32 bits])
    - (toplevel/_zz_execute_ctrl2_down_early0_SrcPlugin_SRC1_lane0 :  SInt[32 bits])
    - (toplevel/early0_BarrelShifterPlugin_logic_shift_patched :  SInt[32 bits])
    - (toplevel/early0_BarrelShifterPlugin_logic_shift_reversed :  SInt[32 bits])
    - (toplevel/early0_BarrelShifterPlugin_logic_shift_shifted :  SInt[32 bits])
    - (toplevel/early0_BarrelShifterPlugin_logic_wb_payload :  Bits[32 bits])
    - (toplevel/early0_IntAluPlugin_logic_alu_bitwise :  SInt[32 bits])
    - (toplevel/early0_IntAluPlugin_logic_alu_result :  SInt[32 bits])
    - (toplevel/early0_IntAluPlugin_logic_wb_payload :  Bits[32 bits])
    - (toplevel/execute_ctrl1_down_integer_RS1_lane0 :  Bits[32 bits])
    - (toplevel/execute_ctrl2_down_early0_BarrelShifterPlugin_SHIFT_RESULT_lane0 :  Bits[32 bits])
    - (toplevel/execute_ctrl2_down_early0_IntAluPlugin_ALU_RESULT_lane0 :  Bits[32 bits])
    - (toplevel/execute_ctrl2_down_early0_SrcPlugin_ADD_SUB_lane0 :  SInt[32 bits])
    - (toplevel/execute_ctrl2_down_early0_SrcPlugin_LESS_lane0 :  Bool)
    - (toplevel/execute_ctrl2_down_early0_SrcPlugin_SRC1_lane0 :  SInt[32 bits])
    - (toplevel/execute_ctrl2_down_lane0_integer_WriteBackPlugin_logic_DATA_lane0 :  Bits[32 bits])
    - (toplevel/execute_ctrl2_lane0_integer_WriteBackPlugin_logic_DATA_lane0_bypass :  Bits[32 bits])
    - (toplevel/execute_ctrl2_up_integer_RS1_lane0 :  Bits[32 bits])
    - (toplevel/lane0_IntFormatPlugin_logic_stages_0_raw :  Bits[32 bits])
    - (toplevel/lane0_IntFormatPlugin_logic_stages_0_wb_payload :  Bits[32 bits])
    - (toplevel/lane0_integer_WriteBackPlugin_logic_stages_0_muxed :  Bits[32 bits])
