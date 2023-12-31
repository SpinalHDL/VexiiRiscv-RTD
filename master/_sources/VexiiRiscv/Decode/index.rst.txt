Decode
============

A few plugins operate in the fetch stage : 

- DecodePipelinePlugin
- AlignerPlugin
- DecoderPlugin
- DispatchPlugin
- DecodePredictionPlugin


DecodePipelinePlugin
-------------------------

Provide the pipeline framework for all the decode related hardware.
It use the spinal.lib.misc.pipeline API but implement multiple "lanes" in it.


AlignerPlugin
-------------------------

Decode the words froms the fetch pipeline into aligned instructions in the decode pipeline

DecoderPlugin
-------------------------

Will :

- Decode instruction
- Generate ilegal instruction exception
- Generate "interrupt" instruction

DecodePredictionPlugin
-------------------------

The purpose of this plugin is to ensure that no branch/jump prediction was made for non branch/jump instructions.
In case this is detected, the plugin will just flush the pipeline and set the fetch PC to redo everything, but this time with a "first prediction skip"

DispatchPlugin
-------------------------

Will : 

- Collect instruction from the end of the decode pipeline
- Try to dispatch them ASAP on the multiple "layers" available

Here is a few explenation about execute lanes and layers : 

- A execute lane represent a path toward which an instruction can be executed.
- A execute lane can have one or many layers, which can be used to implement things as early ALU / late ALU
- Each layer will have static a scheduling priority

The DispatchPlugin doesn't require lanes or layers to be symetric in any way.




