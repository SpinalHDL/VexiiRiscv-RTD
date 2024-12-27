Debug support
=============

Architecture
------------
VexiiRiscv support hardware debugging by implementing the official RISC-V debug spec.

- Compatible with OpenOCD (and maybe some other closed vendor, but untested)
- Can be used through a regular JTAG interface
- Can be used via tunneling through a single JTAG TAP instruction (FPGA native jtag interface)
- Support for some hardware trigger (PC, Load/Store address)

Here is a diagram of a typical debug setup :

.. image:: /asset/picture/debug.png

The current implementation tends to provide the minimum required by the debug spec in order to reduce its area usage and complexity.
It mostly work the following :

- The RISC-V debug module can push RISC-V instructions for the VexiiRiscv to execute.
- VexiiRiscv implement a custom CSR used by the debug module to read/write data of the CPU. This CSR doesn't behave like a regular register.
- The Debug Module can update the value of that special CSR, which can then be read by the CPU via `csrr` instructions
- When the CPU write into the CSR via a `csrw`, it will sent the written value to the Debug Module.

So let's say the debug module want to read some memory, here is what it will do :

- Push instructions to set one register in the register file (let's say x1) to the address whe want to read: `li x1, 0x12345678`
- Push a memory load instruction: `lw x1, 0(x1)`
- Push a instruction to write the readed value into the special CSR (0x7B4): `csrw 0x7B4, x1`.
  Writing this CSR will automatically push the value to the debug module
- Provide that value to the JTAG

If you run a simulation (for instance : :ref:`simulation` with the --debug-jtag-tap argument), then you can connect to the simulated JTAG
via openocd and its TCP remote_bitbang bridge as if it was real hardware:

.. code:: shell

    openocd -f src/main/tcl/openocd/vexiiriscv_sim.tcl

But note that the speed will be quite low (as it is a hardware simulation)

EmbeddedRiscvJtag
-----------------

EmbeddedRiscvJtag is a plugin which can be used to integrate the RISC-V debug module and its JTAG TAP directly inside
the VexiiRiscv. This simplify its deployment, but can only be used in single core configs.

It is the plugin being used to implement the simulation jtag described in the previous chapter (--debug-jtag-tap)


