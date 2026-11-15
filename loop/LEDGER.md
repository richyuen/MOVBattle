# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
556 | 197aec95 | map.tribal_1.a | approved
556 | 21889d91 | map.farmer_snow.a | approved
556 | 0653fc87 | map.farmer_2.a | approved
556 | 70cdfa92 | map.tribal_sandbox.a | approved
556 | 781d89bf | map.farmer_1.a | approved
556 | 5d00d620 | map.farmer_snow.b | approved
556 | ffe9661a | map.farmer_1.b | approved
556 | 6b645833 | map.tribal_2.b | approved
556 | 4d116cbc | map.farmer_2.b | approved
557 | d588c550 | map.farmer_snow.a | approved
557 | 2a626789 | map.farmer_1.b | approved
557 | 41e533fa | map.tribal_1.a | approved
557 | dd302114 | map.farmer_1.a | approved
557 | bbba2e12 | map.farmer_2.b | approved
557 | 748358f1 | map.farmer_2.a | approved
557 | b4f7e9e0 | map.tribal_2.a | approved
557 | 5ef24499 | map.tribal_sandbox.b | approved
557 | d88bbd91 | map.tribal_sandbox.a | approved
558 | cce131b2 | map.tribal_1.a | approved
558 | 78418c38 | map.tribal_2.a | approved
558 | 2394adb1+f9f9f72a | map.tribal_sandbox.a | approved
558 | 2d04d016+2acd436e | map.farmer_1.b | approved
558 | 84bfd3eb | map.farmer_1.a | approved
558 | d9949729 | map.farmer_2.a | approved
558 | 2ec1ca47 | map.farmer_snow.b | approved
558 | 5e406f86 | map.tribal_sandbox.b | approved
558 | 110fbe0a | map.farmer_2.b | approved
559 | be5d20e9+ecbd58a9 | map.tribal_1.a | approved
559 | 8dfa1e8d | map.tribal_2.a | approved
559 | 688e5790 | map.tribal_2.b | approved
559 | 74f42750 | map.farmer_1.a | approved
559 | 62c765fa | map.farmer_2.a | approved
559 | 4cf35a90 | map.farmer_2.b | approved
559 | 398e8db4+29cc3e5a | map.farmer_snow.a | approved
559 | a566456e | map.tribal_sandbox.a | approved
560 | cb6fa15d | map.tribal_1.a | approved
560 | 57c3a0af | map.tribal_1.b | approved
560 | f66ba3a2+8c0b9641+8a89fc24 | map.tribal_1.b | approved
560 | 8105869f | map.farmer_1.a | approved
560 | 22e0ba71+ba8232f8 | map.farmer_1.b | approved
560 | d6119113 | map.farmer_1.a | approved
560 | 90fc230f | map.farmer_2.a | approved
560 | 7713f41b | map.farmer_2.b | approved
560 | 674aaca3+5a6c6bb4 | map.farmer_2.a | approved

## Tuned values
web/src/map/tabs/farmer_2.ts:wheatField stalk height | 0.5-0.7 m | 557 | approved | 1.0-1.3 m
web/src/map/tabs/farmer_2.ts:SHEAVES z range, scale | z -36..-16, x1.5 | 558 | approved | z -44..-23, x1
web/src/map/tabs/tribal_sandbox.ts:NOOKS centres | 10 m further in ((25.8,18.2) (34.1,-4.7) (20.9,-20.9) (4.2,23.2)) | 559 | approved | (34,24) (44,-6) (28,-28) (6,33)
web/src/map/tabs/tribal_sandbox.ts:rockNooks boulder size | 4.5-7 m | 559 | approved | 3-5.5 m
web/src/map/tabs/tribal_1.ts:ISLAND round | 2 (ellipse) | 560 | approved | 3
web/src/map/tabs/farmer_1.ts:islandOutline power | 2 (ellipse) | 560 | approved | 3
web/src/map/tabs/farmer_2.ts:PATH.front | -32 | 560 | approved | -44
web/src/map/tabs/farmer_2.ts:WALLS front-right / back-right ends | x 40 / z 42.5 | 560 | approved | x 46 / z 44
web/src/map/tabs/farmer_2.ts:farmer2WallStone colour | (0.62,0.5,0.38) emissive (0.13,0.105,0.075) | 560 | approved | (0.62,0.62,0.6) emissive (0.07,0.07,0.08)
