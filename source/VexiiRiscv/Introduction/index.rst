Introduction
============

In a few words, VexiiRiscv :

- Is an project which implement an hardware CPU as well as a few SoC
- Follows the RISC-V instruction set
- Is free / open-source
- Should fit well on all FPGA families but also be portable to ASIC

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

On this date (07/01/2025) the status is :

- RISC-V 32/64 IMAFDCSU supported (Multiply / Atomic / Float / Double / Supervisor / User)
- Can run baremetal applications (2.50 dhrystone/MHz, 5.24 coremark/MHz)
- Can run linux/buildroot/debian on FPGA hardware (via litex)
- single/dual issue supported
- late-alu supported
- BTB/RAS/GShare branch prediction supported
- MMU SV32/SV39 supported
- PMP supported
- LSU store buffer supported
- Non-blocking I$ D$ supported
- Hardware/Software D$ prefetch supported
- Hardware I$ prefetch supported
- JTAG debug supported
- Hardware watchpoint supported

Here is a diagram with 2 issue / early+late alu / 6 stages configuration (note that the pipeline structure can vary a lot):

.. image:: /asset/picture/architecture_all_1.png

Navigating the code
-------------------

VexiiRiscv isn't implemented in Verilog nor VHDL. Instead it is written in scala and use the SpinalHDL API to generate hardware.
This allows to leverage an advanced elaboration time paradigm in order to generate hardware in a very flexible manner.

Here are a few key / typical code examples :

- Integer ALU plugin ; src/main/scala/vexiiriscv/execute/IntAluPlugin.scala
- A cpu configuration generator : dev/src/main/scala/vexiiriscv/Param.scala
- The CPU toplevel src/main/scala/vexiiriscv/VexiiRiscv.scala
- Some globally shared definitions : src/main/scala/vexiiriscv/Global.scala

Also due to the nested structure of the code base, a text editor / IDE which support curly brace folding can be very usefull.

About RISC-V
------------------

To help onboarding, here is a few thing about RISC-V :

- RISC-V isn't a CPU / CPU architecture
- RISC-V is a Instruction Set Architecture (ISA), which mean that from a CPU perspective, it mostly specify the instructions that need to be implemented, and their behaviour.

RISC-V has 4 main specification :

- `Unprivileged Specification` : Mainly specify the integer, floating point and load / store instructions
- `Privileged Specification` : Mainly specify all the special CPU registers which can be used to handle
  interruptions, exceptions, traps, virtual memory, memory protections, machine/supervisor/user privilege modes
- `RISC-V calling convention` : Mainly specify how the registers can be used by functions to pass parameters, aswell as providing an alternative name for each of the registers (ex : x2 become the stack pointer, named sp)
- `RISC-V External Debug Support` : Mainly specify how the CPU can support JTAG debug, hardware breakpoints and triggers

To figure out more about those specification, check https://riscv.org/technical/specifications/

Glossary
------------------

Here is a few acronyms commonly used across the documentation :

- **CPU** : Central Processing Unit
- **HART** : Hardware Thread. One CPU core can for instance implement multiple HART, meaning that it will execute multiple threads concurently.
  **For** instance, most modern PC CPUs implement 2 Hardware Thread per CPU core (this feature is called hyper-threading)
- **RF** : Register file
- **ALU** : Arithmetic Logical Unit
- **FPU** : Floating Point Unit
- **LSU** : Load Store Unit
- **AMO** : Atomic Memory Operation
- **MMU** : Memory Management Unit. Translate virtual addresses into pyhsical ones, aswell as check access permitions.
- **PMP** : Physical Memory Protection. Check physical address access permitions.
- **I$** : Instruction Cache
- **D$** : Data Cache
- **IO** : Input Output. Most of the time it mean LOAD/Store instruction which target peripherals (instead of general purpose memory)

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