Introduction
============


About VexiiRiscv
------------------------------

VexiiRiscv is a from scratch second iteration of VexRiscv, with the following goals : 

- RISCV 32/64 bits IMAFDC
- Could start around as small as VexRiscv, but could scale further in performance
- Optional late-alu
- Optional multi issue
- Optional multi threading
- Providing a cleaner implementation, getting ride of the technical debt, especially the frontend
- Proper branch prediction
- ...

On this date (22/01/2024) the status is : 

- rv 32/64 imacsu supported
- Can run baremetal benchmarks (2.24 dhrystone/mhz, 4.66 coremark/mhz)
- single/dual issue supported
- late-alu supported
- BTB/RAS/GShare branch prediction supported
- MMU SV32/SV39 supported
- can run linux/buildroot in simulation

Navigating the code
----------------------------------

Here are a few key / typical code examples : 

- The CPU toplevel src/main/scala/vexiiriscv/VexiiRiscv.scala
- A cpu configuration generator : dev/src/main/scala/vexiiriscv/Param.scala
- Some globaly shared definitions : src/main/scala/vexiiriscv/Global.scala
- Integer ALU plugin ; src/main/scala/vexiiriscv/execute/IntAluPlugin.scala
