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

    rv32i_noBypass ->
    - 0.78 Dhrystone/MHz 0.60 Coremark/MHz
    - Artix 7    -> 210 Mhz 1182 LUT 1759 FF 
    - Cyclone V  -> 159 Mhz 1,015 ALMs
    - Cyclone IV -> 130 Mhz 1,987 LUT 2,017 FF 
    - Trion      -> 94 Mhz LUT 1847   FF 1990
    - Titanium   -> 320 Mhz LUT 2005   FF 2030

    rv32i ->
    - 1.12 Dhrystone/MHz 0.87 Coremark/MHz
    - Artix 7    -> 206 Mhz 1413 LUT 1761 FF 
    - Cyclone V  -> 138 Mhz 1,244 ALMs
    - Cyclone IV -> 124 Mhz 2,188 LUT 2,019 FF 
    - Trion      -> 78 Mhz LUT 2252   FF 1962
    - Titanium   -> 300 Mhz LUT 2347   FF 2000

    rv64i ->
    - 1.18 Dhrystone/MHz 0.77 Coremark/MHz
    - Artix 7    -> 186 Mhz 2157 LUT 2332 FF 
    - Cyclone V  -> 117 Mhz 1,760 ALMs
    - Cyclone IV -> 113 Mhz 3,432 LUT 2,770 FF 
    - Trion      -> 83 Mhz LUT 3883   FF 2681
    - Titanium   -> 278 Mhz LUT 3909   FF 2783

    rv32im ->
    - 1.20 Dhrystone/MHz 2.70 Coremark/MHz
    - Artix 7    -> 190 Mhz 1815 LUT 2078 FF 
    - Cyclone V  -> 131 Mhz 1,474 ALMs
    - Cyclone IV -> 125 Mhz 2,781 LUT 2,266 FF 
    - Trion      -> 83 Mhz LUT 2643   FF 2209
    - Titanium   -> 324 Mhz LUT 2685   FF 2279

    rv32im_branchPredict ->
    - 1.45 Dhrystone/MHz 2.99 Coremark/MHz
    - Artix 7    -> 195 Mhz 2066 LUT 2438 FF 
    - Cyclone V  -> 136 Mhz 1,648 ALMs
    - Cyclone IV -> 117 Mhz 3,093 LUT 2,597 FF 
    - Trion      -> 86 Mhz LUT 2963   FF 2568
    - Titanium   -> 327 Mhz LUT 3015   FF 2636

    rv32im_branchPredict_cached8k8k ->
    - 1.45 Dhrystone/MHz 2.97 Coremark/MHz
    - Artix 7    -> 210 Mhz 2721 LUT 3477 FF 
    - Cyclone V  -> 137 Mhz 1,953 ALMs
    - Cyclone IV -> 127 Mhz 3,648 LUT 3,153 FF 
    - Trion      -> 93 Mhz LUT 3388   FF 3204
    - Titanium   -> 314 Mhz LUT 3432   FF 3274

    rv32imasu_cached_branchPredict_cached8k8k_linux ->
    - 1.45 Dhrystone/MHz 2.96 Coremark/MHz
    - Artix 7    -> 199 Mhz 3351 LUT 3833 FF 
    - Cyclone V  -> 131 Mhz 2,612 ALMs
    - Cyclone IV -> 109 Mhz 4,909 LUT 3,897 FF 
    - Trion      -> 73 Mhz LUT 4367   FF 3613
    - Titanium   -> 270 Mhz LUT 4409   FF 3724

    rv32im_branchPredictStressed_cached8k8k_ipcMax_lateAlu ->
    - 1.74 Dhrystone/MHz 3.41 Coremark/MHz
    - Artix 7    -> 140 Mhz 3247 LUT 3755 FF 
    - Cyclone V  -> 99 Mhz 2,477 ALMs
    - Cyclone IV -> 85 Mhz 4,835 LUT 3,765 FF 
    - Trion      -> 60 Mhz LUT 4438   FF 3832
    - Titanium   -> 228 Mhz LUT 4459   FF 3963


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
