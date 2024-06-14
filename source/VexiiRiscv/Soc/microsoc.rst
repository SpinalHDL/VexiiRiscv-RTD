
This is currently WIP.

MicroSoc
------------------------------

MicroSoC is a little SoC based on VexiiRiscv and a tilelink interconnect.

.. image:: /asset/picture/microsoc.png


Here you can see the default vexiiriscv architecture for this SoC : 

.. image:: /asset/picture/microsoc_vexii.png

Its goals are : 

- Provide a simple reference design
- To be a simple and light FPGA SoC
- Target a high frequency of operation, but not a high IPC (by default)

You can find its implementation here https://github.com/SpinalHDL/VexiiRiscv/blob/dev/src/main/scala/vexiiriscv/soc/demo/MicroSoc.scala

- `class MicroSoc` is the SoC toplevel
- `object MicroSocGen` is a scala main which can be used to generate the hardware
- `object MicroSocSim` is a simple testbench which integrate the UART, konata tracer, rvls CPU checker.


This SoC is WIP, mainly it need more stuff as a rom, jtag, software and a lot more doc.


