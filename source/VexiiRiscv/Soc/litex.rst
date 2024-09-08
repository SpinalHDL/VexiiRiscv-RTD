
Litex
-----

VexiiRiscv can also be deployed using Litex.

You can find some fully self contained example about how to generate the software and hardware files to run buildroot and debian here :

- https://github.com/SpinalHDL/VexiiRiscv/tree/dev/doc/litex

For instance, you can run the following litex command to generate a linux capable SoC on the digilent_nexys_video dev kit (RV32IMA):

.. code:: shell

    python3 -m litex_boards.targets.digilent_nexys_video --cpu-type=vexiiriscv --cpu-variant=linux --cpu-count=1 --build --load

Here is an example for a dual core, debian capable  (RV64GC) with L2 cache and a few other peripherals :

.. code:: shell

    python3 -m litex_boards.targets.digilent_nexys_video --cpu-type=vexiiriscv --cpu-variant=debian  --cpu-count=2 --with-video-framebuffer --with-sdcard --with-ethernet --with-coherent-dma --l2-byte=262144 --build --load

Additional arguments can be provided to customize the VexiiRiscv configuration, for instance the following will enable the PMU, 0 cycle latency register file, multiple outstanding D$ refill/writeback and store buffer:

.. code:: shell

    --vexii-args="--performance-counters 9 --regfile-async --lsu-l1-refill-count 2 --lsu-l1-writeback-count 2 --lsu-l1-store-buffer-ops=32 --lsu-l1-store-buffer-slots=2"

To generate a DTS, I recommend adding `--soc-json build/csr.json` to the command line, and then running :

.. code:: shell

    python3 -m litex.tools.litex_json2dts_linux build/csr.json > build/linux.dts

That linux.dts will miss the CLINT definition (used by opensbi), so you need to patch in (in the soc region, for instance for a quad core) :

.. code:: shell

    clint@f0010000 {
      compatible = "riscv,clint0";
          interrupts-extended = <
                &L0 3 &L0 7
                &L1 3 &L1 7
                &L2 3 &L2 7
                &L3 3 &L3 7>;
      reg = <0xf0010000 0x10000>;
    };


Then you can convert the linux.dts into linux.dtb via :

.. code:: shell

    dtc -O dtb -o build/linux.dtb build/linux.dts

To run debian, you would need to change the dts boot device to your block device, as well as removing the initrd from the dts. You can find more information about how to setup the debian images on https://github.com/SpinalHDL/NaxSoftware/tree/main/debian_litex

But note that for opensbi, use instead the following (official upstream opensbi using the generic platform, which will also contains the dtb):

.. code:: shell

    git clone https://github.com/riscv-software-src/opensbi.git
    cd opensbi
    make CROSS_COMPILE=riscv-none-embed- \
         PLATFORM=generic \
         FW_FDT_PATH=../build/linux.dtb \
         FW_JUMP_ADDR=0x41000000  \
         FW_JUMP_FDT_ADDR=0x46000000



