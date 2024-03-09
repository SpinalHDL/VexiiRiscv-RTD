Introduction
============

VexiiRiscv is the next generation of VexRiscv, enabling things which are not possible with the current VexRisc framework.  The new VexiiRiscv framework: 

- Supports both the 32 bit and the 64 bit Risc-V Instruction sets. 
- Supports more parallelism with optional: 
         - multithreading, 
         - multiple issues and 
         - multiple early and late alus.  
- Has a much cleaner frontend / branch prediction design.
- Has a more flexible plugin system.
- Has a much better verification approach. 
- Works better with DRAM at higher frequencies.  
- Could be as small as VexRiscv, but could scale further in performance.

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

Why VexiiRiscv? 
------------------------------------

The original VexRiscv is a successful design.  But we have reached the limits of what it can accomplish, and in the process of improving it, we added too much complexity.   We now have a newer and better framework.   Specifically the new VexiiRiscv framework: 

- Supports more parallelism with optionally multiple issues and multiple early and late alus.  
- Has a much cleaner frontend / branch prediction design.
- Has a more flexible plugin system.
- Has a much better verification approach. 
- Works better with DRAM at higher frequencies.   

Really almost the whole VexRiscv system would need to rewritten, so it is better to start anew.  This can be done faster than carrying around the old baggage. 

What was Wrong with VexRiscv?
------------------------------------

There are a few reasons why we are creating a new VexiiRiscv instead of doing incremental upgrade on VexRiscv:

- Almost all of the VexRiscv parts need to be migrated to the new framework.
- VexRiscv front end amd branch prediction is quite messy.
- The whole VexRiscv pipeline would have need a complete overhaul in oder to support multiple issue / late-alu.
- The VexRiscv plugin system has hits some limits.
- VexRiscv accumulated quite a bit of technical debt since it was introduced in 2017.
- The VexRiscv data cache being write though starts to have issues as frequency increases (DRAM can't follow).
- The VexRiscv verification infrastructure being based on its own golden model isn't great.

So, enough is enough, it was time to start fresh :D

