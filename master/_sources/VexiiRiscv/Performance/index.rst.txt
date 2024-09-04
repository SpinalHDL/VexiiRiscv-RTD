Performance / Area / FMax
=========================

It is still very early in the developement, but here are some metrics :

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
| Dhrystone/MHz | 2.50           |
+---------------+----------------+
| Coremark/MHz  | 5.24           |
+---------------+----------------+
| EmBench       | 1.62           |
+---------------+----------------+

It is too early for area / fmax metric, there is a lot of design space exploration to do which will trade IPC against FMax / Area.




Tuning
-------------

VexiiRiscv can scale a lot in function of its plugins/parameters. It can scale from simple microcontroller
(ex M0) up to an application processor (A53),

On FPGA there is a few options which can be key in order to scale up the IPC while preserving the FMax : 

- --relaxed-btb : When the BTB is enabled, by default it is implemented as a single cycle predictor, 
  This can be easily be the first critical path to appear. 
  This option make the BTB implementation spread over 2 cycles, 
  which relax the timings at the cost of 1 cycle penality on every successfull branch predictions.

- --relaxed-branch : By default, the BranchPlugin will flush/setPc in the same stage 
  than its own ALU. This is good for IPC but can easily be a critical path. 
  This option will add one cycle latency between the ALU and the side effects (flush/setPc) 
  in order to improve timings.
  If you enabled the branch prediction, then the impact on the IPC should be quite low.

- --fma-reduced-accuracy and --fpu-ignore-subnormal both reduce and can improve the fmax 
  at the cost of accuracy
