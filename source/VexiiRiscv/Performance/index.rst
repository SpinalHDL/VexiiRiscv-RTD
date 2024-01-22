Performance / Area / FMax
=========================

It is still very early in the developement, but here are some metrics :

Note those are done without data cache. A data cache would likely improve the performance quite a bit by allowing more speculative load/store (not talking about data miss / hit, but realy execution hazard / interlock)

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
| Dhrystone/MHz | 2.24           |
+---------------+----------------+
| Coremark/MHz  | 4.66           |
+---------------+----------------+
| EmBench       | 1.47           |
+---------------+----------------+

It is too early for area / fmax metric, there is a lot of design space exploration to do which will trade IPC against FMax / Area.
