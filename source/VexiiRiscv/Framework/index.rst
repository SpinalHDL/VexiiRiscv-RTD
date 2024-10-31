Framework
=========


Tools and API
------------------------

VexRiscv is based on a few tools / API

- Scala : Which will take care of the elaboration
- SpinalHDL : Which provide a hardware description API
- Plugin : Which are used to inject hardware in the CPU. Plugins can discover each others.
- Fiber : Which allows to define elaboration threads (used in the plugins)
- Retainer : Which allows to block the execution of the elaboration threads waiting on it
- Database : Which specify a shared scope for all the plugins to share elaboration time stuff
- spinal.lib.misc.pipeline : Which allow to pipeline things in a very dynamic manner.
- spinal.lib.logic : Which provide the Quine McCluskey algorithm to generate logic decoders from the elaboration time specifications


Scala / SpinalHDL
-----------------

VexiiRiscv is implemented in Scala and the SpinalHDL API to generate hardware in a explicit manner.

Scala is a general purpose programming language (like C/C++/Java/Rust/...). Statically typed, with a garbage collector.
This combination allows to goes way beyond what regular HDL allows in terms of hardware elaboration time capabilities.

Here is a simple example of scala/SpinalHDL:

.. code-block:: scala

    // Lets define a Counter Component/Module, with a "width" parameter
    class Counter(width: Int) extends Component {
      // Lets define all its inputs/outputs in a io Bundle (Kinda similar to a SystemVerilog interface)
      val io = new Bundle {
        val clear = in Bool()
        val value = out UInt(width bits)
      }

      val accumulator = Reg(UInt(width bits)) init(0) // In SpinalHDL registers/flipflop are defined explicitly. Not inferred.
      accumulator := accumulator + 1 //Each cycle we increment the accumulator
      when(io.clear) {
        accumulator := 0 //But be override its value if io.clear is set (last assignment win)
      }

      // We connect the accumulator to the io.value.
      io.value := accumulator
    }


Here is another simple example, but which use an JtagTap tool built on the top of Scala/SpinalHDL :

.. code-block:: scala

    // Lets define a component which will provide access to a few input/outputs through JTAG
    class SimpleJtagTap extends Component {
      val io = new Bundle {
        val jtag    = slave(Jtag())
        val switches = in  Bits(8 bits)
        val keys    = in  Bits(4 bits)
        val leds    = out Bits(8 bits)
      }

      //The JtagTap tool allows to create the mapping between the JTAG bus and the hardware
      val tap = new JtagTap(io.jtag, 8)

      //JTAG taps need an idcode, lets add it !
      val idcodeArea   = tap.idcode(B"x87654321") (instructionId=4)

      // For instance here we specify that the jtag instruction id 5 will allow it to read the io.switches value
      val switchesArea = tap.read(io.switches)     (instructionId=5)

      //Lets add a few other jtag instructions to access the keys and leds hardware
      val keysArea     = tap.read(io.keys)         (instructionId=6)
      val ledsArea     = tap.write(io.leds)        (instructionId=7)
    }

The key thing about the example above is that the JtagTap tool itself is defined in regular Scala / SpinalHDL.
In other words, you can easily layer abstraction and tool on the top of the ecosystem.
Use feature like Scala classes, inheritance, function overloading, collections, ..., during the hardware elaboration time.

You can find more documentation about SpinalHDL here :

- https://spinalhdl.github.io/SpinalDoc-RTD/master/index.html

Plugin / Fiber / Retainer
----------------------------

One of the main aspect of VexiiRiscv is that all its hardware is defined inside plugins instead of a big toplevel.
When you want to instantiate a VexiiRiscv CPU, you "only" need to provide a list of plugins as parameters.
So, plugins can be seen as both parameters and hardware definition from a VexiiRiscv perspective.

It is quite different from the regular HDL component/module paradigm. Here are the advantages of this approach :

- The CPU can be extended without modifying its core source code, just add a new plugin in the parameters
- You can swap a specific implementation for another just by swapping plugin in the parameter list. (ex branch prediction, mul/div, ...)
- It is decentralized by nature, you don't have a endless toplevel of doom, software interface between plugins can be used to negotiate and connect things during elaboration time.

The plugins can fork elaboration threads which cover 2 phases :

- setup phase : where plugins can acquire elaboration locks on each others
- build phase : where plugins can negotiate between each others and generate hardware

Simple all-in-one example
^^^^^^^^^^^^^^^^^^^^^^^^^

Here is a simple example :

.. code-block:: scala

  import spinal.core._
  import spinal.lib.misc.plugin._
  import vexiiriscv._
  import scala.collection.mutable.ArrayBuffer

  // Define a new plugin kind
  class FixedOutputPlugin extends FiberPlugin{
    // Define a build phase elaboration thread
    val logic = during build new Area{
      val port = out UInt(8 bits)
      port := 42
    }
  }

  object Gen extends App{
    // Generate the verilog
    SpinalVerilog{
      val plugins = ArrayBuffer[FiberPlugin]()
      plugins += new FixedOutputPlugin()
      VexiiRiscv(plugins)
    }
  }


Will generate

.. code-block:: verilog

    module VexiiRiscv (
      output wire [7:0]    FixedOutputPlugin_logic_port
    );

      assign FixedOutputPlugin_logic_port = 8'h42;

    endmodule



Negotiation example
^^^^^^^^^^^^^^^^^^^

Here is a example where there a plugin which count the number of hardware event coming from other plugins :

.. code-block:: scala

  import spinal.core._
  import spinal.core.fiber.Retainer
  import spinal.lib.misc.plugin._
  import spinal.lib.CountOne
  import vexiiriscv._
  import scala.collection.mutable.ArrayBuffer

  class EventCounterPlugin extends FiberPlugin{
    val retainer = Retainer() // Will allow other plugins to block the elaboration of "logic" thread
    val events = ArrayBuffer[Bool]() // Will allow other plugins to add event sources
    val logic = during build new Area {
      // Prevent executing this thread until the retainer is locked by other plugins
      retainer.await()

      // Now that all the other plugins are done adding event sources, we can generate the actual hardware
      val counter = Reg(UInt(32 bits)) init(0)
      counter := counter + CountOne(events) // CountOne will take each bits of events, add sum all them all. ex : 0b1011 => 3
    }
  }


  // For the demo we want to be able to instantiate this plugin multiple times, so we add a prefix parameter to name the specific instance
  class EventSourcePlugin(prefix : String) extends FiberPlugin{
    withPrefix(prefix)

    // Create a thread starting from the setup phase (this allow to run some code before the build phase,
    // this allows to lock some other plugins retainers before their build phase
    val logic = during setup new Area {
      // Search for the single instance of EventCounterPlugin in the plugin pool
      val ecp = host[EventCounterPlugin]

      // Generate a lock to prevent the EventCounterPlugin elaboration (until we release it).
      // This will allow us to add our localEvent to the ecp.events list
      val ecpLocker = ecp.lock()

      // Wait for the build phase before generating any hardware
      awaitBuild()

      // Here the local event is a input of the VexiiRiscv toplevel (just for the demo)
      val localEvent = in Bool()
      ecp.events += localEvent

      // As everything is done, we now allow the ecp to elaborate itself
      ecpLocker.release()
    }
  }

  object Gen extends App {
    SpinalVerilog {
      val plugins = ArrayBuffer[FiberPlugin]()
      plugins += new EventCounterPlugin()
      plugins += new EventSourcePlugin("lane0")
      plugins += new EventSourcePlugin("lane1")
      VexiiRiscv(plugins)
    }
  }

.. code-block:: verilog

    module VexiiRiscv (
      input  wire          lane0_EventSourcePlugin_logic_localEvent,
      input  wire          lane1_EventSourcePlugin_logic_localEvent,
      input  wire          clk,
      input  wire          reset
    );

      wire       [31:0]   _zz_EventCounterPlugin_logic_counter;
      reg        [1:0]    _zz_EventCounterPlugin_logic_counter_1;
      wire       [1:0]    _zz_EventCounterPlugin_logic_counter_2;
      reg        [31:0]   EventCounterPlugin_logic_counter;

      assign _zz_EventCounterPlugin_logic_counter = {30'd0, _zz_EventCounterPlugin_logic_counter_1};
      assign _zz_EventCounterPlugin_logic_counter_2 = {lane1_EventSourcePlugin_logic_localEvent,lane0_EventSourcePlugin_logic_localEvent};
      always @(*) begin
        case(_zz_EventCounterPlugin_logic_counter_2)
          2'b00 : _zz_EventCounterPlugin_logic_counter_1 = 2'b00;
          2'b01 : _zz_EventCounterPlugin_logic_counter_1 = 2'b01;
          2'b10 : _zz_EventCounterPlugin_logic_counter_1 = 2'b01;
          default : _zz_EventCounterPlugin_logic_counter_1 = 2'b10;
        endcase
      end

      always @(posedge clk or posedge reset) begin
        if(reset) begin
          EventCounterPlugin_logic_counter <= 32'h00000000;
        end else begin
          EventCounterPlugin_logic_counter <= (EventCounterPlugin_logic_counter + _zz_EventCounterPlugin_logic_counter);
        end
      end


    endmodule


Database
--------

In VexiiRiscv, there is the possibility to define elaboration time variable which are unique to each VexiiRiscv instance while being easily accessible as if they were global variable.
For instance XLEN, PC_WIDTH, INSTRUCTION_WIDTH, ...

Those variable are handled through the VexiiRiscv "database".
You can see it in the VexRiscv toplevel :

.. code-block:: scala

  class VexiiRiscv extends Component{
    val database = new Database
    val host = database on (new PluginHost)
  }

What it does is that all the plugin thread will run in the context of that database. Allowing the following patterns :

.. code-block:: scala

  import spinal.core._
  import spinal.lib.misc.plugin._
  import spinal.lib.misc.database.Database
  import vexiiriscv._
  import scala.collection.mutable.ArrayBuffer

  // In Scala, an object define a singleton / static thing.
  object Global extends AreaObject{
    // Lets define VIRTUAL_WIDTH as a variable in the data base.
    // VIRTUAL_WIDTH will act as the "key" to access the variable value in the current context.
   // If accessed before being set, it will block the current thread execution (until it is set by another thread)
    val VIRTUAL_WIDTH = Database.blocking[Int]
  }

  // Lets define a plugin which will use the VIRTUAL_WIDTH value.
  class LoadStorePlugin extends FiberPlugin{
    val logic = during build new Area{
      val address = Reg(UInt(Global.VIRTUAL_WIDTH.get bits))
    }
  }

  // Lets define a plugin which will set the VIRTUAL_WIDTH value
  class MmuPlugin extends FiberPlugin{
    val logic = during build new Area{
      Global.VIRTUAL_WIDTH.set(39)
    }
  }

  // Lets define the scala application which can generate the VexiiRiscv hardware using those two plugins.
  object Gen extends App{
    SpinalVerilog{
      val plugins = ArrayBuffer[FiberPlugin]()
      plugins += new LoadStorePlugin()
      plugins += new MmuPlugin()
      VexiiRiscv(plugins)
    }
  }

This will generate the following hardware :

.. code-block:: scala

    module VexiiRiscv (
      input  wire          clk,
      input  wire          reset
    );

      reg        [38:0]   LoadStorePlugin_logic_address;
    endmodule

Keep in mind that if our toplevel had to instantiate two VexiiRiscv, each of them would have it own dedicated VIRTUAL_WIDTH.get value, while using the same VIRTUAL_WIDTH key to access it.

Pipeline API
------------

In short, the design use a pipeline API in order to :

- Propagate data into the pipeline automatically
- Allow design space exploration with less paine (retiming, moving around the architecture)
- Handle the valid/ready arbitration
- Reduce boiler plate code

This is one of the main pillar on which VexiiRiscv is based, as it allows to define pipelines in a very distributed manner,
meaning that each Plugin can very easily add and extract things on pipeline.

For instance, the plugin A can insert a given value into the pipeline at stage 1, and another plugin can ask that given value at stage 4, and that's it, it just work.

Here is an example which expose a simple usage of the pipelining API (not related to VexiiRiscv):

- Take the input at stage 0
- Sum the input at stage 1
- Square the sum at stage 2
- Provide the result at stage 3

.. code-block:: scala

  import spinal.core._
  import spinal.lib.misc.pipeline._

  class PipelineExample extends Component{
    // Lets define a few inputs/outputs
    val a,b = in UInt(8 bits)
    val result = out(UInt(16 bits))

    // Lets create the pipelining tool.
    val pip = new StagePipeline

    // Lets insert a and b into the pipeline at stage 0
    val A = pip(0).insert(a)
    val B = pip(0).insert(b)

    // Lets insert the sum of A and B into the stage 1 of our pipeline
    val SUM = pip(1).insert(pip(1)(A) + pip(1)(B))

    // Clearly, i don't want to say pip(x)(y) on every pipelined thing.
    // So instead we can create a pip.Area(x) which will provide a scope which work in stage "x"
    val onSquare = new pip.Area(2){
      val VALUE = insert(SUM * SUM)
    }

    // Lets assign our output result from stage 3
    result := pip(3)(onSquare.VALUE)

    // Now that everything is specified, we can build the pipeline
    pip.build()
  }

  object PipelineExampleGen extends App{
    SpinalVerilog(new PipelineExample)
  }

This will generate the following verilog :

.. code-block:: verilog

    module PipelineExample (
      input  wire [7:0]    a,
      input  wire [7:0]    b,
      output wire [15:0]   result,
      input  wire          clk,
      input  wire          reset
    );

      reg        [15:0]   pip_node_3_onSquare_VALUE;
      wire       [15:0]   pip_node_2_onSquare_VALUE;
      reg        [7:0]    pip_node_2_SUM;
      wire       [7:0]    pip_node_1_SUM;
      reg        [7:0]    pip_node_1_B;
      reg        [7:0]    pip_node_1_A;
      wire       [7:0]    pip_node_0_B;
      wire       [7:0]    pip_node_0_A;

      assign pip_node_0_A = a;
      assign pip_node_0_B = b;
      assign pip_node_1_SUM = (pip_node_1_A + pip_node_1_B);
      assign pip_node_2_onSquare_VALUE = (pip_node_2_SUM * pip_node_2_SUM);
      assign result = pip_node_3_onSquare_VALUE;
      always @(posedge clk) begin
        pip_node_1_A <= pip_node_0_A;
        pip_node_1_B <= pip_node_0_B;
        pip_node_2_SUM <= pip_node_1_SUM;
        pip_node_3_onSquare_VALUE <= pip_node_2_onSquare_VALUE;
      end
    endmodule


More documentation about it in :

- https://spinalhdl.github.io/SpinalDoc-RTD/master/SpinalHDL/Libraries/Pipeline/index.html

