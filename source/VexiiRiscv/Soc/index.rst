SoC
===



There is currently 2 reference SoCs. One which is Linux capable and target Litex (a python framework to create SoC),
aswell as one which target simple micro-controller usages. They are both based on Tilelink for their memory interconnect.

If you want to integrate VexiiRiscv in your own SoC, VexiiRiscv supports AXI4 and Wishbone interface aswell.

Those can be enabled via :

- Instruction fetch bus : --fetch-axi4 --fetch-wishbone
- Uncached load/store bus : --lsu-axi4 --lsu-wishbone
- Cache load/store bus : --lsu-l1-axi4 --lsu-l1-wishbone

Note that RVA has some restriction in the following configs :

- Without L1 => RVA unsuported.
- With L1 => RVA only supported on cached memory accesses.
- With L1, without memory coherency => Single core support.
- With L1, with memory coherency => Only supported with tilelink.

Also note that you can customize the static Physical Memory Access (PMA) layout of the CPU to fit your needs.
The PMA currently specifies :

- Which memory region can be executed (exe)
- Which memory region can be cached by the LSU (main)

Here is an example how you can specify :

- From 0x80000000 to 0xFFFFFFFF can be cached and executed ``--region base=80000000,size=80000000,main=1,exe=1``
- From 0x10000000 to 0x1FFFFFFF can be only be read by the uncached LSU ``--region base=10000000,size=10000000,main=0,exe=0``

.. toctree::
   :maxdepth: 2

   microsoc
   litex