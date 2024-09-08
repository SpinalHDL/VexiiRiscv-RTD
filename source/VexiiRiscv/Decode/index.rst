Decode
======

A few plugins operate in the fetch stage :

- DecodePipelinePlugin
- AlignerPlugin
- DecoderPlugin
- DispatchPlugin
- DecodePredictionPlugin


DecodePipelinePlugin
--------------------

Provide the pipeline framework for all the decode related hardware.
It use the spinal.lib.misc.pipeline API but implement multiple "lanes" in it.


AlignerPlugin
-------------

Decode the words from the fetch pipeline into aligned instructions in the decode pipeline. Its complexity mostly come from the necessity to support having RVC [and BTB], mostly by adding additional cases to handle.

1) RVC allows 32 bits instruction to be unaligned, meaning they can cross between 2 fetched words, so it need to have some internal buffer / states to work.

2) The BTB may have predicted (falsely) a jump instruction where there is none, which may cut the fetch of an 32 bits instruction in the middle.

The AlignerPlugin is designed as following :

- Has a internal fetch word buffer in oder to support 32 bits instruction with RVC
- First it scan at every possible instruction position, ex : RVC with 64 bits fetch words => 2x64/16 scanners. Extracting the instruction length, presence of all the instruction data (slices) and necessity to redo the fetch because of a bad BTB prediction.
- Then it has one extractor per decoding lane. They will check the scanner for the firsts valid instructions.
- Then each extractor is fed into the decoder pipeline.

.. image:: /asset/picture/aligner.png

DecoderPlugin
-------------

Will :

- Decode instruction
- Generate illegal instruction exception
- Generate "interrupt" instruction

DecodePredictionPlugin
----------------------

The purpose of this plugin is to ensure that no branch/jump prediction was made for non branch/jump instructions.
In case this is detected, the plugin will just flush the pipeline and set the fetch PC to redo everything, but this time with a "first prediction skip"

See more in the Branch prediction chapter

DispatchPlugin
--------------

Will :

- Collect instruction from the end of the decode pipeline
- Try to dispatch them ASAP on the multiple "layers" available

Here is a few explanation about execute lanes and layers :

- A execute lane represent a path toward which an instruction can be executed.
- A execute lane can have one or many layers, which can be used to implement things as early ALU / late ALU
- Each layer will have static a scheduling priority

The DispatchPlugin doesn't require lanes or layers to be symmetric in any way.




