How to use
==============

For getting started you have two options.

Either you compile it from scratch or you use our Docker container which provides all the dependencies readily installed.

Docker Container
----------------

Probably the easiest way to get started:

Simply run

.. code-block:: bash

    docker pull leviathanch/vexiiriscv

and fetch the Docker image with the RISC-V tools, sbt and all the other essentials installed.

After than clone the repository, checkout its submodules and start the docker container

.. code-block:: bash

    git clone --recursive https://github.com/SpinalHDL/VexiiRiscv.git
    cd VexiiRiscv
    docker run -v `pwd`:/work -it leviathanch/vexiiriscv

Now you should be able to run all the commands listed below, after the compile chapter

Compilation
---------------

**Dependencies**

You will need :

- A java JDK
- SBT (Scala build tool)
- Verilator (optional, for simulations)
- RVLS / Spike dependencies (optional, if you want to have lock-step simulations checking)
- GCC for RISC-V (optional, if you want to compile some code)


On debian :

.. code-block:: bash

    # JAVA JDK
    sudo add-apt-repository -y ppa:openjdk-r/ppa
    sudo apt-get update
    sudo apt-get install openjdk-19-jdk -y # You don't exactly need that version
    sudo update-alternatives --config java
    sudo update-alternatives --config javac

    # Install SBT - https://www.scala-sbt.org/
    echo "deb https://repo.scala-sbt.org/scalasbt/debian all main" | sudo tee /etc/apt/sources.list.d/sbt.list
    echo "deb https://repo.scala-sbt.org/scalasbt/debian /" | sudo tee /etc/apt/sources.list.d/sbt_old.list
    curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
    sudo apt-get update
    sudo apt-get install sbt

    # Verilator (optional, for simulations)
    sudo apt-get install git make autoconf g++ flex bison help2man
    git clone https://github.com/verilator/verilator
    unsetenv VERILATOR_ROOT  # For csh; ignore error if on bash
    unset VERILATOR_ROOT  # For bash
    cd verilator
    git pull        # Make sure we're up-to-date
    git checkout v4.216 # You don't exactly need that version
    autoconf        # Create ./configure script
    ./configure
    make
    sudo make install

    # RVLS / Spike dependencies (optional, for simulations)
    sudo apt-get install device-tree-compiler libboost-all-dev
    # Install ELFIO, used to load elf file in the sim
    git clone https://github.com/serge1/ELFIO.git
    cd ELFIO
    git checkout d251da09a07dff40af0b63b8f6c8ae71d2d1938d # Avoid C++17
    sudo cp -R elfio /usr/include
    cd .. && rm -rf ELFIO

    # Getting a RISC-V toolchain (optional, if you want to compile RISC-V software)
    version=riscv64-unknown-elf-gcc-8.3.0-2019.08.0-x86_64-linux-ubuntu14
    wget -O riscv64-unknown-elf-gcc.tar.gz riscv https://static.dev.sifive.com/dev-tools/$version.tar.gz
    tar -xzvf riscv64-unknown-elf-gcc.tar.gz
    sudo mv $version /opt/riscv
    echo 'export PATH=/opt/riscv/bin:$PATH' >> ~/.bashrc


**Repo setup**

After installing the dependencies (see above) :

.. code-block:: bash

    git clone --recursive https://github.com/SpinalHDL/VexiiRiscv.git
    cd VexiiRiscv

    # (optional) Compile riscv-isa-sim (spike), used as a golden model during the sim to check the dut behaviour (lock-step)
    cd ext/riscv-isa-sim
    mkdir build
    cd build
    ../configure --prefix=$RISCV --enable-commitlog  --without-boost --without-boost-asio --without-boost-regex
    make -j$(nproc)
    cd ../../..

    # (optional) Compile RVLS, (need riscv-isa-sim (spike)
    cd ext/rvls
    make -j$(nproc)
    cd ../..

Generate verilog
-----------------

.. code-block:: bash

    sbt "Test/runMain vexiiriscv.Generate"

You can get a list of the supported parameters via :

.. code-block:: bash

    sbt "Test/runMain vexiiriscv.Generate --help"
     --help                   prints this usage text
     --xlen <value>
     --decoders <value>
     --lanes <value>
     --relaxed-branch
     --relaxed-shift
     --relaxed-src
     --with-mul
     --with-div
     --with-rva
     --with-rvc
     --with-supervisor
     ...

Here is a list of the important parameters :

.. list-table:: Generation parameters
   :widths: 30 70
   :header-rows: 1

   * - Parameter
     - Description
   * - --xlen=32/64
     - Specify the CPU data width (RISC-V XLEN). 32 bits by default, can be set to 64 bits
   * - --with-rvm
     - Enable RISC-V mul/div instruction
   * - --with-rvc
     - Enable RISC-V compressed instruction set
   * - --with-rva
     - Enable atomic instruction support
   * - --with-rvf
     - Enable 32 bits floating point support
   * - --with-rvd
     - Enable 32/64 bits floating point support
   * - --with-supervisor
     - Enable privileged supervisor, user and MMU
   * - --allow-bypass-from=Int
     - Specify from which execute stage the integer result bypassing is allowed. Default disabled. For performance set it to 0
   * - --with-btb
     - Enable Branch Target Buffer prediction
   * - --with-gshare
     - Enable GShare conditional branch prediction. (Require the BTB to be enabled)
   * - --with-ras
     - Enable Return Address Stack prediction. (Require the BTB to be enabled)
   * - --regfile-async
     - The register read ports become asynchronous, shaving one stage in the pipeline, but not all FPGA support this kind of memories.
   * - --mmu-sync-read
     - The MMU TLB memories will be implemented using memories with synchronous read ports. This allows to keep it small on FPGA which doesn't support asynchronous read ports
   * - --fetch-l1
     - Enable the L1 instruction cache
   * - --fetch-l1-ways=Int
     - Set the number of instruction cache ways (4KB per way by default)
   * - --lsu-l1
     - Enable the L1 data cache
   * - --lsu-l1-ways=Int
     - Set the number of data cache ways (4KB per way by default)
   * - --with-jtag-tap
     - Enable the RISC-V JTAG debugging.

There is a lot more parameters which can be turned.

.. _simulation:

Run a simulation
----------------

.. important::
   If you take a VexiiRiscv core and use it with a simulator which does x-prop (not verilator), you will need to add the following option : --with-boot-mem-init.
   By default this isn't enabled, as it can degrade timings and area while not being necessary for a fully functional hardware.

Here is how you can run a Verilator based simulation, note that Vexiiriscv use mostly an opt-in configuration. So, most performance related configuration are disabled by default.

.. code-block:: bash

    sbt
    compile
    Test/runMain vexiiriscv.tester.TestBench --with-mul --with-div --load-elf ext/NaxSoftware/baremetal/dhrystone/build/rv32ima/dhrystone.elf --trace-all


This will generate a simWorkspace/VexiiRiscv/test folder which contains :

- test.fst : A wave file which can be open with gtkwave. It shows all the CPU signals
- konata.log : A wave file which can be open with https://github.com/shioyadan/Konata, it shows the pipeline behavior of the CPU
- spike.log : The execution logs of Spike (golden model)
- tracer.log : The execution logs of VexRiscv (Simulation model)

Here is an example of the additional argument you can use to improve the IPC :

.. code-block:: bash

   --with-btb --with-gshare --with-ras --decoders 2 --lanes 2 --with-aligner-buffer --with-dispatcher-buffer --with-late-alu --regfile-async --allow-bypass-from 0 --div-radix 4


Here is a screen shot of a cache-less VexiiRiscv booting linux :

.. image:: /asset/picture/konata.png


Synthesis
-----------------------

VexiiRiscv is designed in a way which should make it easy to deploy on all FPGA.
including the ones without support for asynchronous memory read
(LUT ram / distributed ram / MLAB).
The one exception is the MMU, but if configured to only read the memory on cycle 0
(no tag hit), then the synthesis tool should be capable of inferring that asynchronous
read into a synchronous one (RAM block, work on Efinix FPGA)

By default SpinalHDL will generate memories in a Verilog/VHDL synthetisable way.
Otherwise, for ASIC, you likely want to enable the automatic memory blackboxing,
which will instead replace all memories defined in the design by a consistent blackbox
module/component, the user having then to provide those blackbox implementation.

Currently all memories used are "simple dual port ram". While this is the best for FPGA usages,
on ASIC maybe some of those could be redesigned to be single port rams instead (todo).

Other resources
------------------

There a few other ways to start using VexiiRiscv :

- Trough the MicroSoc reference design, a little microcontroller for FPGA (:ref:`microsoc`)
- Through Litex, a tool to build SoC w(:ref:`litex`)

Using IntelliJ IDEA
-------------------------

IntelliJ IDEA is a Java/Scala IDE which can help a lot navigating the codebase. You can get its community edition for free.
Then you just need to install the scala plugin (asked the first time you run the IDE), and open the VexiiRiscv folder with it.

The one issue is that it has a bug, and will give you a :

.. code-block::

    object Info is not a member of package spinal.core

The workaround is that you need to run the "sbt compile" command in a terminal in the VexiiRiscv folder once.
