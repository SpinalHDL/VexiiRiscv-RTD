Framework
============


Dependencies
------------------------------

VexRiscv is based on a few tools / API

- Scala : Which will take care of the elaboration
- SpinalHDL : Which provide a hardware description API
- Plugin : Which are used to inject hardware in the CPU
- Fiber : Which allows to define elaboration threads in the plugins
- Retainer : Which allows to block the execution of the elaboration threads waiting on it
- Database : Which specify a shared scope for all the plugins to share elaboration time stuff
- spinal.lib.misc.pipeline : Which allow to pipeline things in a very dynamic manner.
- spinal.lib.logic : Which provide Quine McCluskey to generate logic decoders from the elaboration time specifications


Scala / SpinalHDL
------------------------------

This combination alows to goes way behond what regular HDL alows in terms of hardware description capabilities.
You can find some documentation about SpinalHDL here : 

- https://spinalhdl.github.io/SpinalDoc-RTD/master/index.html

Plugin
-------------------------

One main design aspect of VexiiRiscv is that all its hardware is defined inside plugins. When you want to instanciate a VexiiRiscv CPU, you "only" need to provide a list of plugins as parameters. So, plugins can be seen as both parameters and hardware definition from a VexiiRiscv perspective.

So it is quite different from the regular HDL component/module paradigm. Here are the adventages of this aproache : 

- The CPU can be extended without modifying its core source code, just add a new plugin in the parameters
- You can swap a specific implementation for another just by swapping plugin in the parameter list. (ex branch prediction, mul/div, ...)
- It is decentralised by nature, you don't have a fat toplevel of doom, software interface between plugins can be used to negociate things durring elaboration time.

The plugins can fork elaboration threads which cover 2 phases : 

- setup phase : where plugins can aquire elaboration locks on each others
- build phase : where plugins can negociate between each others and generate hardware

Simple all-in-one example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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



Negociation example
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Here is a example where there a plugin which count the number of hardware event comming from other plugins : 

.. code-block:: scala

  import spinal.core._
  import spinal.core.fiber.Retainer
  import spinal.lib.misc.plugin._
  import spinal.lib.CountOne
  import vexiiriscv._
  import scala.collection.mutable.ArrayBuffer
  
  class EventCounterPlugin extends FiberPlugin{
    val lock = Retainer() // Will allow other plugins to block the elaboration of "logic" thread
    val events = ArrayBuffer[Bool]() // Will allow other plugins to add event sources
    val logic = during build new Area{
      lock.await() // Active blocking 
      val counter = Reg(UInt(32 bits)) init(0)
      counter := counter + CountOne(events)
    }
  }


  //For the demo we want to be able to instanciate this plugin multiple times, so we add a prefix parameter
  class EventSourcePlugin(prefix : String) extends FiberPlugin{
    withPrefix(prefix)

    // Create a thread starting from the setup phase (this allow to run some code before the build phase, and so lock some other plugins retainers)
    val logic = during setup new Area{
      val ecp = host[EventCounterPlugin] // Search for the single instance of EventCounterPlugin in the plugin pool
      // Generate a lock to prevent the EventCounterPlugin elaboration until we release it.
      // this will allow us to add our localEvent to the ecp.events list 
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

  object Gen extends App{  
    SpinalVerilog{
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
--------------------

Quite a few things behave kinda like variable specific for each VexiiRiscv instance. For instance XLEN, PC_WIDTH, INSTRUCTION_WIDTH, ...

So they are end up with things that we would like to share between plugins of a given VexiiRiscv instance with the minimum code possible to keep things slim. For that, a "database" was added.
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
  import spinal.lib.misc.database.Database.blocking
  import vexiiriscv._
  import scala.collection.mutable.ArrayBuffer

  object Global extends AreaObject{
    val VIRTUAL_WIDTH = blocking[Int] // If accessed while before being set, it will actively block (until set by another thread)
  }

  class LoadStorePlugin extends FiberPlugin{
    val logic = during build new Area{
      val register = Reg(UInt(Global.VIRTUAL_WIDTH bits))
    }
  }

  class MmuPlugin extends FiberPlugin{
    val logic = during build new Area{
      Global.VIRTUAL_WIDTH.set(39)
    }
  }
  
  object Gen extends App{  
    SpinalVerilog{
      val plugins = ArrayBuffer[FiberPlugin]()
      plugins += new LoadStorePlugin()
      plugins += new MmuPlugin()
      VexiiRiscv(plugins)
    }
  } 

Pipeline API
--------------------

In short the design use a pipeline API in order to : 

- Allow moving things around with no paine (retiming)
- Reduce boiler plate code

More documentation about it in https://github.com/SpinalHDL/SpinalDoc-RTD/pull/226

