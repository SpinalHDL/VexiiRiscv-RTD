

About VexiiRiscv
------------------------------

VexiiRiscv is a from scratch second iteration of VexRiscv, with the following goals : 

- RISCV 32/64 bits IMAFDC
- Could start around as small as VexRiscv, but could scale further in performance
- Optional late-alu
- Optional multi issue
- Optional multi threading
- Providing a cleaner implementation, getting ride of the technical debt, especially the frontend
- Proper branch prediction
- ...

On this date (29/12/2023) the status is : 

- rv 32/64 im supported
- Can run baremetal benchmarks (2.24 dhrystone/mhz, 4.62 coremark/mhz)
- single/dual issue supported
- late-alu supported
- BTB/RAS/GShare branch prediction supported
