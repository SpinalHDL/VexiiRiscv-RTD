Fetch
============

A few plugins operate in the fetch stage : 

- FetchPipelinePlugin
- PcPlugin
- FetchCachelessPlugin
- BtbPlugin
- GSharePlugin
- HistoryPlugin

FetchPipelinePlugin
-------------------------

Provide the pipeline framework for all the fetch related hardware. It use the native spinal.lib.misc.pipeline API without any restriction.

PcPlugin
-------------------------

Will :

- implement the fetch program counter register
- inject the program counter in the first fetch stage
- allow other plugin to create "jump" interface allowing to override the PC value

Jump interfaces will impact the PC value injected in the fetch stage in a combinatorial manner to reduce latency.

FetchCachelessPlugin
-------------------------

Will : 

- Generate a fetch memory bus
- Connect that memory bus to the fetch pipeline with a response buffer
- Allow out of order memory bus responses (for maximal compatibility)
- Always generate aligned memory accesses


BtbPlugin
-------------------------

Will :

- Implement a branch target buffer in the fetch pipeline
- Implement a return address stack buffer
- Predict which slices of the fetched word are the last slice of a branch/jump
- Predict the branch/ĵump target
- Use the FetchConditionalPrediction plugin (GSharePlugin) to  know if branch should be taken
- Apply the prediction (flush + pc update + history update)
- Learn using the LearnPlugin interface
- Implement "ways" named chunks which are staticaly assigned to groups of word's slices, allowing to predict multiple branch/jump present in the same word

GSharePlugin
-------------------------

Will : 

- Implement a FetchConditionalPrediction (GShare flavor)
- Learn using the LearnPlugin interface
- Will not apply the prediction via flush / pc change, another plugin will do that

HistoryPlugin
-------------------------

Will : 

- implement the branch history register
- inject the branch history in the first fetch stage
- allow other plugin to create interface to override the branch history value (on branch prediction / execution)

branch history interfaces will impact the branch history value injected in the fetch stage in a combinatorial manner to reduce latency.
