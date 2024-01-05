Search.setIndex({"docnames": ["VexiiRiscv/Decode/index", "VexiiRiscv/Execute/custom", "VexiiRiscv/Execute/index", "VexiiRiscv/Execute/plugins", "VexiiRiscv/Fetch/index", "VexiiRiscv/Framework/index", "VexiiRiscv/Introduction/VexiiRiscv", "VexiiRiscv/Introduction/index", "index"], "filenames": ["VexiiRiscv/Decode/index.rst", "VexiiRiscv/Execute/custom.rst", "VexiiRiscv/Execute/index.rst", "VexiiRiscv/Execute/plugins.rst", "VexiiRiscv/Fetch/index.rst", "VexiiRiscv/Framework/index.rst", "VexiiRiscv/Introduction/VexiiRiscv.rst", "VexiiRiscv/Introduction/index.rst", "index.rst"], "titles": ["Decode", "Custom instruction", "Execute", "Plugins", "Fetch", "Framework", "About VexiiRiscv", "Introduction", "VexiiRiscv"], "terms": {"A": [0, 4], "few": [0, 1, 3, 4, 5], "plugin": [0, 2, 4], "oper": [0, 3, 4], "fetch": [0, 3, 8], "stage": [0, 1, 3, 4], "provid": [0, 1, 3, 4, 5, 6], "pipelin": [0, 1, 3, 4], "framework": [0, 3, 4, 8], "all": [0, 1, 3, 4], "relat": [0, 3, 4], "hardwar": [0, 1, 3, 4, 5], "It": [0, 1, 3, 4, 5], "us": [0, 1, 3, 4, 5], "spinal": [0, 1, 3, 4, 5], "lib": [0, 1, 3, 4, 5], "misc": [0, 3, 4, 5], "api": [0, 3, 4], "implement": [0, 3, 4, 5, 6], "multipl": [0, 1, 3, 4, 5], "lane": [0, 1, 3], "word": [0, 4], "from": [0, 1, 5, 6], "align": [0, 4], "instruct": [0, 2], "Will": [0, 3, 4, 5], "gener": [0, 4, 5], "ileg": 0, "except": 0, "interrupt": 0, "The": [0, 1, 3, 5], "purpos": 0, "thi": [0, 1, 5, 6], "i": [0, 1, 3, 5, 6], "ensur": 0, "branch": [0, 3, 4, 5, 6], "jump": [0, 3, 4], "predict": [0, 3, 4, 5, 6], "wa": [0, 3, 5], "made": 0, "non": [0, 3], "In": [0, 5], "case": [0, 3, 5], "detect": 0, "just": [0, 1, 5], "flush": [0, 3, 4], "set": [0, 3, 5], "pc": [0, 3, 4], "redo": 0, "everyth": [0, 1, 5], "time": [0, 5], "first": [0, 4], "skip": [0, 3], "collect": [0, 3, 5], "end": [0, 5], "try": 0, "dispatch": [0, 1], "them": [0, 3], "asap": 0, "layer": [0, 1], "avail": 0, "here": [0, 1, 5], "explen": 0, "about": [0, 1, 5, 7], "execut": [0, 1, 3, 4, 5, 8], "repres": 0, "path": 0, "toward": 0, "which": [0, 1, 3, 4, 5], "an": [0, 1, 3], "can": [0, 1, 3, 5, 6], "have": [0, 1, 5], "one": [0, 3], "mani": [0, 3], "thing": [0, 1, 5], "earli": [0, 3], "alu": [0, 1, 6], "late": [0, 6], "each": [0, 5], "static": 0, "schedul": 0, "prioriti": 0, "doesn": 0, "t": [0, 1, 5], "requir": [0, 1], "symetr": 0, "ani": [0, 1, 4, 5], "wai": [0, 1, 3, 4, 5], "There": 1, "ar": [1, 3, 4, 5], "you": [1, 5], "follow": [1, 3, 5, 6], "chapter": 1, "some": [1, 3, 5], "demo": [1, 5], "let": 1, "": [1, 3, 4, 8], "defin": [1, 5], "4x8bit": 1, "adder": 1, "work": 1, "integ": [1, 3], "regist": [1, 3, 4, 5], "file": [1, 3], "base": [1, 3, 5], "executionunitelementsimpl": 1, "make": 1, "simpler": 1, "Such": 1, "compos": 1, "given": [1, 5], "For": [1, 3, 5], "instanc": [1, 5], "configur": 1, "could": [1, 6], "new": [1, 3, 5], "srcplugin": 1, "early0": 1, "executeat": 1, "0": [1, 3, 5], "relaxedr": 1, "relaxedsrc": 1, "intaluplugin": 1, "formatat": 1, "barrelshifterplugin": 1, "relaxedshift": 1, "toint": 1, "intformatplugin": 1, "lane0": [1, 5], "branchplugin": 1, "aluat": 1, "jumpat": 1, "relaxedbranch": 1, "wbat": 1, "simdaddplugin": 1, "we": [1, 5], "exampl": 1, "how": 1, "http": [1, 5], "github": [1, 5], "com": [1, 5], "spinalhdl": 1, "blob": 1, "dev": 1, "src": 1, "main": [1, 5], "scala": 1, "packag": 1, "import": [1, 5], "core": [1, 5], "_": [1, 5], "stageabl": 1, "arg": 1, "global": [1, 5], "paramsimpl": 1, "compat": [1, 4], "multiportwritessymplifi": 1, "riscv": [1, 3, 6], "intregfil": 1, "rs1": [1, 3], "rs2": [1, 3], "name": [1, 4], "simd_add": 1, "do": [1, 3, 4], "rd": [1, 3], "regfil": 1, "destin": 1, "r": 1, "sourc": [1, 5], "7": [1, 3, 5], "downto": 1, "16": 1, "8": [1, 5], "23": 1, "31": [1, 5], "24": [1, 6], "encod": 1, "0000000": 1, "000": 1, "0001011": 1, "custom0": 1, "func3": 1, "func7": 1, "note": 1, "posit": 1, "risc": [1, 3], "v": [1, 3], "spec": [1, 3], "common": 1, "isa": 1, "object": [1, 5], "type": 1, "wll": 1, "val": [1, 5], "add4": 1, "typer": 1, "m": 1, "class": [1, 5], "integr": 1, "itself": [1, 5], "quit": [1, 5], "util": 1, "eas": 1, "lanelay": 1, "extend": [1, 3, 5], "creat": [1, 3, 4, 5], "elabor": [1, 5], "thread": [1, 5, 6], "logic": [1, 5], "function": 1, "dure": [1, 5], "setup": [1, 5], "lock": [1, 5], "other": [1, 3, 4, 5], "ex": [1, 5], "csr": [1, 3], "don": [1, 5], "need": [1, 5], "alreadi": 1, "sort": 1, "out": [1, 4, 5], "so": [1, 5], "wait": [1, 5], "build": [1, 5], "phase": [1, 5], "awaitbuild": [1, 5], "assum": 1, "onli": [1, 3, 5], "support": [1, 6], "rv32": 1, "now": [1, 5], "assert": 1, "xlen": [1, 3, 5], "get": [1, 3, 6], "32": [1, 5, 6], "interfac": [1, 3, 4, 5], "result": [1, 3], "our": [1, 5], "wb": 1, "newwriteback": 1, "ifp": 1, "specifi": [1, 3, 5], "current": 1, "start": [1, 3, 5, 6], "valu": [1, 3, 4], "addrsspec": 1, "done": [1, 3, 5], "releas": [1, 5], "uopretain": 1, "allow": [1, 3, 4, 5], "continu": 1, "decod": [1, 5, 8], "process": 1, "el": 1, "id": 1, "asuint": 1, "comput": 1, "uint": [1, 5], "bit": [1, 3, 5, 6], "writeback": 1, "valid": [1, 3], "sel": 1, "payload": 1, "asbit": 1, "Then": 1, "run": [1, 5, 6], "app": [1, 5], "bottom": 1, "vexiisimdaddgen": 1, "param": 1, "sc": 1, "spinalconfig": 1, "scopt": 1, "optionpars": 1, "unit": 1, "help": 1, "text": 1, "print": 1, "usag": 1, "addopt": 1, "pars": 1, "nonempti": 1, "addtransformationphas": 1, "report": 1, "generateverilog": 1, "pa": 1, "pluginsarea": 1, "To": 1, "go": 1, "naxriscv": 1, "directori": 1, "sbt": 1, "runmain": 1, "write": [1, 3], "assembli": 1, "code": [1, 5], "naxsoftwar": 1, "tree": 1, "849679c70b238ceee021bdfd18eb2e9809e7bdd0": 1, "baremet": [1, 6], "simdadd": 1, "globl": 1, "_start": 1, "includ": 1, "driver": 1, "riscv_asm": 1, "h": 1, "sim_asm": 1, "custom_asm": 1, "1": [1, 5], "li": 1, "x1": 1, "0x01234567": 1, "x2": 1, "0x01ff01ff": 1, "opcode_r": 1, "0x0": 1, "0x00": 1, "x3": 1, "x4": 1, "put_hex": 1, "sw": 1, "check": 1, "x5": 1, "0x02224666": 1, "bne": 1, "fail": 1, "j": 1, "pass": 1, "compil": 1, "clean": 1, "rv32im": 1, "testbench": 1, "vexiisimdaddsim": 1, "testopt": 1, "genconfig": 1, "includesimul": 1, "simconfig": 1, "spinalsimconfig": 1, "withfstwav": 1, "withtestfold": 1, "withconfig": 1, "println": 1, "With": 1, "parm": 1, "n": 1, "getnam": 1, "load": [1, 3], "elf": 1, "ext": 1, "rv32ima": 1, "trace": 1, "rvl": 1, "output": [1, 5], "02224666": 1, "shell": 1, "show": 1, "simworkspac": 1, "d": 1, "spike": 1, "overal": 1, "didn": 1, "introduc": 1, "addit": 1, "nor": 1, "multi": [1, 6], "cycl": [1, 3], "todo": 1, "But": 1, "take": [1, 5], "look": 1, "shiftplugin": 1, "divplugin": 1, "mulplugin": 1, "those": 1, "same": [1, 4], "infrastructur": 2, "special": 2, "custom": 2, "simd": 2, "add": [2, 3, 5], "specif": [3, 5], "host": [3, 5], "flow": 3, "control": 3, "freez": 3, "whole": 3, "collaps": 3, "bubbl": 3, "empti": 3, "possibl": [3, 5], "read": 3, "port": [3, 5], "demand": 3, "mux": 3, "between": [3, 5], "liter": 3, "mul": [3, 5], "div": [3, 5], "order": [3, 4, 5], "unsign": 3, "alow": [3, 5], "back": 3, "through": 3, "option": [3, 6], "sign": 3, "backend": 3, "learn": [3, 4], "aggreg": 3, "singl": [3, 5, 6], "regular": [3, 5], "arithmet": 3, "binari": 3, "sub": 3, "AND": 3, "OR": 3, "lui": 3, "shift": 3, "block": [3, 5], "iter": [3, 6], "fast": 3, "heavi": 3, "correct": 3, "histori": [3, 4], "wrong": 3, "partial": 3, "sum": 3, "over": 3, "optionali": 3, "last": [3, 4], "buffer": [3, 4], "mulh": 3, "divis": 3, "remain": 3, "2": [3, 5, 6], "per": 3, "solv": 3, "when": [3, 5], "scan": 3, "numer": 3, "lead": 3, "divid": 3, "4": [3, 6], "store": 3, "cacheless": 3, "memori": [3, 4], "bu": [3, 4], "fork": [3, 5], "cmd": 3, "soon": 3, "handl": 3, "backpresur": 3, "littl": 3, "fifo": 3, "respons": [3, 4], "data": 3, "privileg": 3, "its": [3, 5], "map": 3, "share": [3, 5], "chip": 3, "ram": 3, "staticali": [3, 4], "alloc": 3, "space": 3, "variou": 3, "content": 3, "fpga": 3, "effici": 3, "trap": 3, "fsm": 3, "mtval": 3, "mtvec": 3, "mepc": 3, "mscratch": 3, "perform": [3, 6], "counter": [3, 4, 5], "veri": [3, 5], "most": 3, "dedic": 3, "onc": 3, "msb": 3, "mret": 3, "sret": 3, "ecal": 3, "ebreak": 3, "nativ": 4, "without": [4, 5], "restrict": 4, "program": 4, "inject": [4, 5], "overrid": 4, "impact": 4, "combinatori": 4, "manner": [4, 5], "reduc": [4, 5], "latenc": 4, "connect": 4, "maxim": 4, "alwai": [4, 5], "access": [4, 5], "target": 4, "return": 4, "address": 4, "stack": 4, "slice": 4, "\u0135ump": 4, "fetchconditionalpredict": 4, "know": 4, "should": 4, "taken": 4, "appli": 4, "updat": 4, "learnplugin": 4, "chunk": 4, "assign": [4, 5], "group": 4, "present": 4, "gshare": [4, 6], "flavor": 4, "via": 4, "chang": 4, "anoth": [4, 5], "vexriscv": [5, 6], "tool": 5, "care": 5, "descript": 5, "cpu": 5, "fiber": 5, "retain": 5, "scope": 5, "stuff": 5, "dynam": 5, "quin": 5, "mccluskei": 5, "combin": 5, "goe": 5, "behond": 5, "what": 5, "hdl": 5, "term": 5, "capabl": 5, "find": 5, "document": [5, 8], "io": 5, "spinaldoc": 5, "rtd": 5, "master": 5, "index": 5, "html": 5, "One": 5, "design": 5, "aspect": 5, "vexiiriscv": [5, 7], "insid": 5, "want": 5, "instanci": 5, "list": 5, "paramet": 5, "seen": 5, "both": 5, "definit": 5, "perspect": 5, "differ": 5, "compon": 5, "modul": 5, "paradigm": 5, "adventag": 5, "aproach": 5, "modifi": 5, "swap": 5, "decentralis": 5, "natur": 5, "fat": 5, "toplevel": 5, "doom": 5, "softwar": 5, "dur": 5, "cover": 5, "where": 5, "aquir": 5, "mutabl": 5, "arraybuff": 5, "kind": 5, "fixedoutputplugin": 5, "fiberplugin": 5, "area": 5, "42": 5, "gen": 5, "verilog": 5, "spinalverilog": 5, "wire": 5, "fixedoutputplugin_logic_port": 5, "h42": 5, "endmodul": 5, "count": 5, "number": 5, "event": 5, "counton": 5, "eventcounterplugin": 5, "bool": 5, "await": 5, "activ": 5, "reg": 5, "init": 5, "abl": 5, "prefix": 5, "eventsourceplugin": 5, "string": 5, "withprefix": 5, "befor": 5, "ecp": 5, "search": 5, "pool": 5, "prevent": 5, "until": 5, "u": 5, "localev": 5, "ecplock": 5, "local": 5, "input": 5, "As": 5, "lane1": 5, "lane0_eventsourceplugin_logic_localev": 5, "lane1_eventsourceplugin_logic_localev": 5, "clk": 5, "reset": 5, "_zz_eventcounterplugin_logic_count": 5, "_zz_eventcounterplugin_logic_counter_1": 5, "_zz_eventcounterplugin_logic_counter_2": 5, "eventcounterplugin_logic_count": 5, "30": 5, "d0": 5, "begin": 5, "b00": 5, "b01": 5, "b10": 5, "default": 5, "endcas": 5, "posedg": 5, "h00000000": 5, "els": 5, "behav": 5, "kinda": 5, "like": 5, "variabl": 5, "pc_width": 5, "instruction_width": 5, "thei": 5, "up": 5, "would": 5, "minimum": 5, "keep": 5, "slim": 5, "ad": 5, "see": 5, "pluginhost": 5, "doe": 5, "context": 5, "pattern": 5, "areaobject": 5, "virtual_width": 5, "int": 5, "If": 5, "while": 5, "being": 5, "loadstoreplugin": 5, "mmuplugin": 5, "39": 5, "short": 5, "move": 5, "around": [5, 6], "pain": 5, "retim": 5, "boiler": 5, "plate": 5, "more": 5, "pull": 5, "226": 5, "scratch": 6, "second": 6, "goal": 6, "64": 6, "imafdc": 6, "small": 6, "scale": 6, "further": 6, "issu": 6, "cleaner": 6, "ride": 6, "technic": 6, "debt": 6, "especi": 6, "frontend": 6, "proper": 6, "On": 6, "date": 6, "29": 6, "12": 6, "2023": 6, "statu": 6, "rv": 6, "im": 6, "benchmark": 6, "dhryston": 6, "mhz": 6, "62": 6, "coremark": 6, "dual": 6, "btb": 6, "ra": 6, "welcom": 8, "introduct": 8}, "objects": {}, "objtypes": {}, "objnames": {}, "titleterms": {"decod": 0, "decodepipelineplugin": 0, "alignerplugin": 0, "decoderplugin": 0, "decodepredictionplugin": 0, "dispatchplugin": 0, "custom": 1, "instruct": [1, 3], "simd": 1, "add": 1, "plugin": [1, 3, 5], "implement": 1, "vexiiriscv": [1, 6, 8], "gener": 1, "softwar": 1, "test": 1, "simul": 1, "conclus": 1, "execut": 2, "infrastructur": 3, "executepipelineplugin": 3, "executelaneplugin": 3, "regfileplugin": 3, "srcplugin": 3, "rsunsignedplugin": 3, "intformatplugin": 3, "writebackplugin": 3, "learnplugin": 3, "intaluplugin": 3, "barrelshifterplugin": 3, "branchplugin": 3, "mulplugin": 3, "divplugin": 3, "lsucachelessplugin": 3, "special": 3, "csraccessplugin": 3, "csrramplugin": 3, "privilegedplugin": 3, "performancecounterplugin": 3, "envplugin": 3, "fetch": 4, "fetchpipelineplugin": 4, "pcplugin": 4, "fetchcachelessplugin": 4, "btbplugin": 4, "gshareplugin": 4, "historyplugin": 4, "framework": 5, "depend": 5, "scala": 5, "spinalhdl": 5, "simpl": 5, "all": 5, "one": 5, "exampl": 5, "negoci": 5, "databas": 5, "pipelin": 5, "api": 5, "about": 6, "introduct": 7}, "envversion": {"sphinx.domains.c": 2, "sphinx.domains.changeset": 1, "sphinx.domains.citation": 1, "sphinx.domains.cpp": 8, "sphinx.domains.index": 1, "sphinx.domains.javascript": 2, "sphinx.domains.math": 2, "sphinx.domains.python": 3, "sphinx.domains.rst": 2, "sphinx.domains.std": 2, "sphinx": 57}, "alltitles": {"Decode": [[0, "decode"]], "DecodePipelinePlugin": [[0, "decodepipelineplugin"]], "AlignerPlugin": [[0, "alignerplugin"]], "DecoderPlugin": [[0, "decoderplugin"]], "DecodePredictionPlugin": [[0, "decodepredictionplugin"]], "DispatchPlugin": [[0, "dispatchplugin"]], "Custom instruction": [[1, "custom-instruction"]], "SIMD add": [[1, "simd-add"]], "Plugin implementation": [[1, "plugin-implementation"]], "VexiiRiscv generation": [[1, "vexiiriscv-generation"]], "Software test": [[1, "software-test"]], "Simulation": [[1, "simulation"]], "Conclusion": [[1, "conclusion"]], "Execute": [[2, "execute"]], "Plugins": [[3, "plugins"]], "infrastructures": [[3, "infrastructures"]], "ExecutePipelinePlugin": [[3, "executepipelineplugin"]], "ExecuteLanePlugin": [[3, "executelaneplugin"]], "RegFilePlugin": [[3, "regfileplugin"]], "SrcPlugin": [[3, "srcplugin"]], "RsUnsignedPlugin": [[3, "rsunsignedplugin"]], "IntFormatPlugin": [[3, "intformatplugin"]], "WriteBackPlugin": [[3, "writebackplugin"]], "LearnPlugin": [[3, "learnplugin"]], "Instructions": [[3, "instructions"]], "IntAluPlugin": [[3, "intaluplugin"]], "BarrelShifterPlugin": [[3, "barrelshifterplugin"]], "BranchPlugin": [[3, "branchplugin"]], "MulPlugin": [[3, "mulplugin"]], "DivPlugin": [[3, "divplugin"]], "LsuCachelessPlugin": [[3, "lsucachelessplugin"]], "Special": [[3, "special"]], "CsrAccessPlugin": [[3, "csraccessplugin"]], "CsrRamPlugin": [[3, "csrramplugin"]], "PrivilegedPlugin": [[3, "privilegedplugin"]], "PerformanceCounterPlugin": [[3, "performancecounterplugin"]], "EnvPlugin": [[3, "envplugin"]], "Fetch": [[4, "fetch"]], "FetchPipelinePlugin": [[4, "fetchpipelineplugin"]], "PcPlugin": [[4, "pcplugin"]], "FetchCachelessPlugin": [[4, "fetchcachelessplugin"]], "BtbPlugin": [[4, "btbplugin"]], "GSharePlugin": [[4, "gshareplugin"]], "HistoryPlugin": [[4, "historyplugin"]], "Framework": [[5, "framework"]], "Dependencies": [[5, "dependencies"]], "Scala / SpinalHDL": [[5, "scala-spinalhdl"]], "Plugin": [[5, "plugin"]], "Simple all-in-one example": [[5, "simple-all-in-one-example"]], "Negociation example": [[5, "negociation-example"]], "Database": [[5, "database"]], "Pipeline API": [[5, "pipeline-api"]], "About VexiiRiscv": [[6, "about-vexiiriscv"]], "Introduction": [[7, "introduction"]], "VexiiRiscv": [[8, "vexiiriscv"]]}, "indexentries": {}})