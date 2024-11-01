Plugins
=======


infrastructures
---------------

Many plugins operate in the fetch stage. Some provide infrastructures :

ExecutePipelinePlugin
^^^^^^^^^^^^^^^^^^^^^

Provide the pipeline framework for all the execute related hardware with the following specificities :

- It is based on the spinal.lib.misc.pipeline API and can host multiple "lanes" in it.
- For flow control, the lanes can only freeze the whole pipeline
- The pipeline do not collapse bubbles (empty stages)


ExecuteLanePlugin
^^^^^^^^^^^^^^^^^

Implement an execution lane in the ExecutePipelinePlugin

RegFilePlugin
^^^^^^^^^^^^^

Implement one register file, with the possibility to create new read / write port on demand

SrcPlugin
^^^^^^^^^

Provide some early integer values which can mux between RS1/RS2 and multiple RISC-V instruction's literal values

RsUnsignedPlugin
^^^^^^^^^^^^^^^^

Used by mul/div in order to get an unsigned RS1/RS2 value early in the pipeline

IntFormatPlugin
^^^^^^^^^^^^^^^

Allows plugins to write integer values back to the register file through a optional sign extender.
It uses WriteBackPlugin as value backend.

WriteBackPlugin
^^^^^^^^^^^^^^^

Used by plugins to provide the RD value to write back to the register file

LearnPlugin
^^^^^^^^^^^

Will collect all interface which provide jump/branch learning interfaces to aggregate them into a single one, which will then be used by branch prediction plugins to learn.

Instructions
------------

Some implement regular instructions

IntAluPlugin
^^^^^^^^^^^^

Implement the arithmetic, binary and literal instructions (ADD, SUB, AND, OR, LUI, ...)

BarrelShifterPlugin
^^^^^^^^^^^^^^^^^^^

Implement the shift instructions in a non-blocking way (no iterations). Fast but "heavy".

BranchPlugin
^^^^^^^^^^^^

Will :

- Implement branch/jump instruction
- Correct the PC / History in the case the branch prediction was wrong
- Provide a learn interface to the LearnPlugin


MulPlugin
^^^^^^^^^

- Implement multiplication operation using partial multiplications and then summing their result
- Done over multiple stage
- Can optionally extends the last stage for one cycle in order to buffer the MULH bits

DivPlugin
^^^^^^^^^

- Implement the division/remain
- 2 bits per cycle are solved.
- When it start, it scan for the numerator leading bits for 0, and can skip dividing them (can skip blocks of XLEN/4)

LsuCachelessPlugin
^^^^^^^^^^^^^^^^^^

- Implement load / store through a cacheless memory bus
- Will fork the cmd as soon as fork stage is valid (with no flush)
- Handle backpressure by using a little fifo on the response data

Special
-------

Some implement CSR, privileges and special instructions

CsrAccessPlugin
^^^^^^^^^^^^^^^

- Implement the CSR instruction
- Provide an API for other plugins to specify its hardware mapping

CsrRamPlugin
^^^^^^^^^^^^

- Implement a shared on chip ram
- Provide an API which allows to statically allocate space on it
- Provide an API to create read / write ports on it
- Used by various plugins to store the CSR contents in a FPGA efficient way

PrivilegedPlugin
^^^^^^^^^^^^^^^^

- Implement the RISCV privileged spec
- Implement the trap buffer / FSM
- Use the CsrRamPlugin to implement various CSR as MTVAL, MTVEC, MEPC, MSCRATCH, ...

PerformanceCounterPlugin
^^^^^^^^^^^^^^^^^^^^^^^^

- Implement the privileged performance counters in a very FPGA way
- Use the CsrRamPlugin to store most of the counter bits
- Use a dedicated 7 bits hardware register per counter
- Once that 7 bits register MSB is set, a FSM will flush it into the CsrRamPlugin


EnvPlugin
^^^^^^^^^

- Implement a few instructions as MRET, SRET, ECALL, EBREAK
