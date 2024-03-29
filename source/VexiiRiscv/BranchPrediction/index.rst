Branch Prediction
==================

The branch prediction is implemented as follow : 

- During fetch, a BTB, GShare, RAS memory is used to provide an early branch prediction (BtbPlugin / GSharePlugin)
- In Decode, the DecodePredictionPlugin will ensure that no "none jump/branch instruction"" predicted as a jump/branch continues down the pipeline.
- In Execute, the prediction made is checked and eventualy corrected. Also a stream of data is generated to feed the BTB / GShare memories with good data to learn.

Here is a diagram of the whole architecture : 

.. image:: /asset/picture/branch_prediction.png

While it would have been possible in the decode stage to correct some miss prediction from the BTB / RAS, it isn't done to improve timings and reduce Area.

BtbPlugin
-------------------------

Will :

- Implement a branch target buffer in the fetch pipeline
- Implement a return address stack buffer
- Predict which slices of the fetched word are the last slice of a branch/jump
- Predict the branch/ĵump target
- Use the FetchConditionalPrediction plugin (GSharePlugin) to  know if branch should be taken
- Apply the prediction (flush + pc update + history update)
- Learn using the LearnPlugin interface. Only learn on missprediction. To avoid write to read hazard, the fetch stage is blocked when it learn.
- Implement "ways" named chunks which are staticaly assigned to groups of word's slices, allowing to predict multiple branch/jump present in the same word

GSharePlugin
-------------------------

Will : 

- Implement a FetchConditionalPrediction (GShare flavor)
- Learn using the LearnPlugin interface. Write to read hazard are handled via a bypass
- Will not apply the prediction via flush / pc change, another plugin will do that

DecodePredictionPlugin
-------------------------

The purpose of this plugin is to ensure that no branch/jump prediction was made for non branch/jump instructions.
In case this is detected, the plugin will just flush the pipeline and set the fetch PC to redo everything, but this time with a "first prediction skip"

BranchPlugin
--------------

Placed in the execute pipeline, it will ensure that the branch prediction was correct, else it correct it. It also generate a learn interface.

LearnPlugin
--------------

This plugin will collect all the learn interface (generated by the BranchPlugin) and produce a single stream of learn interface for the BtbPlugin / GShare plugin to use.

