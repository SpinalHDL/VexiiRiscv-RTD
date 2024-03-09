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

On this date (08/03/2024) the status is : 

- rv 32/64 imacsu supported 
- Can run baremetal benchmarks (2.50 dhrystone/mhz, 5.24 coremark/mhz)
- single/dual issue supported
- late-alu supported
- BTB/RAS/GShare branch prediction supported
- MMU SV32/SV39 supported
- can run linux/buildroot in simulation
- LSU store buffer supported

Here is a diagram with 2 issue / early+late alu / 6 stages configuration (note that the pipeline structure can vary a lot):

.. image:: /asset/picture/architecture_all_1.png

Navigating the code
----------------------------------

Here are a few key / typical code examples : 

- The CPU toplevel src/main/scala/vexiiriscv/VexiiRiscv.scala
- A cpu configuration generator : dev/src/main/scala/vexiiriscv/Param.scala
- Some globaly shared definitions : src/main/scala/vexiiriscv/Global.scala
- Integer ALU plugin ; src/main/scala/vexiiriscv/execute/IntAluPlugin.scala

Also on quite important one is to use a text editor / IDE which support curly brace folding and to start with them fully folded, as the code extensively used nested structures.

Check list
-----------------------

Here is a list of important assumptions and things to know about : 

- trap/flush/pc request from the pipeline, once asserted one cycle can not be undone. This also mean that while a given instruction is stuck somewere, if that instruction did raised on of those request, nothing should change the execution path. For instance, a sudden cache line refill completion should not lift the request from the LSU asking a redo (due to cache refill hazard).
- In the execute pipeline, stage.up(RS1/RS2) is the value to be used, while stage.down(RS1/RS2) should not be used, as it implement the bypassing for the next stage
- Fetch.ctrl(0) isn't persistant.

Why are we developing VexiiRiscv?
------------------------------------

The original VexRiscv was an award winning software abstraction for Risc-V chips.  But we have 
reached the limits of what it can accomplish, and we now have a newer and better abstraction.  
Specificaly the new VexiiRiscv abstractions 

- Can support higher frequencies than the existing write through data cache. 
- Supports more parallelism with multiple issues and an early and late alu.  
- Has a much cleaner frontend / branch prediction design.
- Has a more flexible plugin system.
- Has a much better verificaton approach. 

Really almost the whole VexRiscv system would need to rewritten, so it is better to start from scratch.  This approach is not only a lot more fun, it is also be completed faster, which is better for the customers. 
