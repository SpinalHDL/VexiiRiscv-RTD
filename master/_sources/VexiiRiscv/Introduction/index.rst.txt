Introduction
============

In a few words, VexiiRiscv :

- Is an project which implement an hardware CPU
- Follows the RISC-V instruction set
- Is free / open-source
- Should fit well on FPGA but also be portable to ASIC

Other doc / media / talks
-------------------------

Here is a list of links to resources which present or document VexiiRiscv :

- FSiC 2024   : https://wiki.f-si.org/index.php?title=Moving_toward_VexiiRiscv
- COSCUP 2024 : https://coscup.org/2024/en/session/PVAHAS
- ORConf 2024 : https://fossi-foundation.org/orconf/2024#vexiiriscv--a-debian-demonstration


Technicalities
------------------------------

VexiiRiscv is a from scratch second iteration of VexRiscv, with the following goals :

- To implement RISC-V 32/64 bits IMAFDCSU
- Could start around as small as VexRiscv, but could scale further in performance
- Optional late-alu
- Optional multi issue
- Providing a cleaner implementation, getting ride of the technical debt, especially the frontend
- Scale well at higher frequencies via its hardware prefetching and non blocking write-back D$
- Proper branch prediction
- ...

On this date (09/08/2024) the status is :

- RISC-V 32/64 IMAFDCSU supported (Multiply / Atomic / Float / Double / Supervisor / User)
- Can run baremetal applications (2.50 dhrystone/MHz, 5.24 coremark/MHz)
- Can run linux/buildroot/debian on FPGA hardware (via litex)
- single/dual issue supported
- late-alu supported
- BTB/RAS/GShare branch prediction supported
- MMU SV32/SV39 supported
- LSU store buffer supported
- Non-blocking I$ D$ supported
- Hardware/Software D$ prefetcher supported
- Hardware I$ prefetcher supported

Here is a diagram with 2 issue / early+late alu / 6 stages configuration (note that the pipeline structure can vary a lot):

.. image:: /asset/picture/architecture_all_1.png

Navigating the code
-------------------

VexiiRiscv isn't implmeneted in Verilog nor VHDL. Instead it is written in scala and use the SpinalHDL API to generate hardware.
This allows to leverage an advanced elaboration time paradigme in order to generate hardware in a very flexible manner.

Here are a few key / typical code examples :

- Integer ALU plugin ; src/main/scala/vexiiriscv/execute/IntAluPlugin.scala
- A cpu configuration generator : dev/src/main/scala/vexiiriscv/Param.scala
- The CPU toplevel src/main/scala/vexiiriscv/VexiiRiscv.scala
- Some globally shared definitions : src/main/scala/vexiiriscv/Global.scala

Also due to the nested structure of the code base, a text editor / IDE which support curly brace folding can be very usefull.


About VexRiscv (not VexiiRiscv)
-------------------------------

There is few reasons why VexiiRiscv exists instead of doing incremental upgrade on VexRiscv

- Mostly, all the VexRiscv parts could be subject for upgrades
- VexRiscv frontend / branch prediction is quite messy
- The whole VexRiscv pipeline would have need a complete overhaul in oder to support multiple issue / late-alu
- The VexRiscv plugin system has hits some limits
- VexRiscv accumulated quite a bit of technical debt over time (2017)
- The VexRiscv data cache being write though start to create issues the faster the frequency goes (DRAM can't follow)
- The VexRiscv verification infrastructure based on its own golden model isn't great.

So, enough is enough, it was time to start fresh :D

Check list
----------

Here is a list of important design assumptions and things to know about :

- trap/flush/pc request from the pipeline, once asserted one cycle can not be undone. This also mean that while a given instruction is stuck somewhere, if that instruction did raised on of those request, nothing should change the execution path. For instance, a sudden cache line refill completion should not lift the request from the LSU asking a redo (due to cache refill hazard).
- In the execute pipeline, stage.up(RS1/RS2) is the value to be used, while stage.down(RS1/RS2) should not be used, as it implement the bypassing for the next stage
- Fetch.ctrl(0) isn't persistent (meaning the PC requested can change at any time)

