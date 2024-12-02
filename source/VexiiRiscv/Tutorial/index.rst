Self Contained Tutorial
=======================

This self contained tutorial will show you how to pull a Docker container with all the
dependencies preinstalled so that you can start right away without having to compile any
of the dependencies from scratch.

Simply pull the Docker image from the Docker hub and get started:

The scope of this tutorial is:

* Fetching the Docker image
* Generating the verilog
* Running a simulation
* Opening the traces (gtkwave + konata)

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
    docker run -e DISPLAY=$DISPLAY -v /tmp/.X11-unix:/tmp/.X11-unix -v `pwd`:/work -it leviathanch/vexiiriscv

Now you should be ready to proceed with running the below example.

The parameters:

* Enabling to start X applications from within Docker
    * The -e parameter passes your display info to the container environment
    * The -v /tmp/.X11-unix:/tmp/.X11-unix instruction maps your X socket to the container
* The -v \`pwd\`:/work -it leviathanch/vexiiriscv parameter tells docker what image to start


Generating the verilog
----------------------

As soon as you've started the Docker container as shown above you can obtain the Verilog
code by simply running the following command from within the Docker container shell.

Just make sure that you're indeed in the /work directory where the GIT repository is mounted
into the Docker container

.. code-block:: bash

    sbt "Test/runMain vexiiriscv.Generate"

You should now have a file called "VexiiRiscv.v" right there in your source folder


Running a simulation
--------------------

Running a simulation also is straight forward, in the same shell run the command below.

Just make sure that you're indeed in the /work directory where the GIT repository is mounted
into the Docker container

.. code-block:: bash

    sbt "Test/runMain vexiiriscv.tester.TestBench --with-mul --with-div --load-elf ext/NaxSoftware/baremetal/dhrystone/build/rv32ima/dhrystone.elf --trace-all"

This will run through for a moment


Opening the traces (gtkwave + konata)
-------------------------------------

You can convert the wave file from the simulation into the VCD format and view it by opening
it with GTKWve, which is already installed in the Docker image.

To do so, simply run

.. code-block:: bash

    fst2vcd simWorkspace/VexiiRiscv/test/wave.fst -o simWorkspace/VexiiRiscv/test/wave.vcd
    gtkwave -g simWorkspace/VexiiRiscv/test/wave.vcd

This will start GTKWave.

**Important Notes**

* Loading will take a while because the wave file is giant
* Be **careful** and only add one signal at a time from the list or your GTKWave might hang
  or even crash your system!







