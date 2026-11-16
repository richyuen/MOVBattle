# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
560 | cb6fa15d | map.tribal_1.a | approved
560 | 57c3a0af | map.tribal_1.b | approved
560 | f66ba3a2+8c0b9641+8a89fc24 | map.tribal_1.b | approved
560 | 8105869f | map.farmer_1.a | approved
560 | 22e0ba71+ba8232f8 | map.farmer_1.b | approved
560 | d6119113 | map.farmer_1.a | approved
560 | 90fc230f | map.farmer_2.a | approved
560 | 7713f41b | map.farmer_2.b | approved
560 | 674aaca3+5a6c6bb4 | map.farmer_2.a | approved
561 | 037cd776+4b5e0fae | map.farmer_2.a | approved
561 | b382569f+ceafd4a0+0792aa93 | map.farmer_2.a | approved
561 | 5f83a159 | map.farmer_1.a | approved
561 | 37c2368f+dc06adf4 | map.farmer_1.a | approved
561 | b23c5f33+48c5b110 | map.farmer_1.a | approved
561 | 81facedd | map.tribal_2.a | approved
561 | 2a0f2cce | map.tribal_2.b | approved
561 | 6142c5b2 | map.tribal_sandbox.a | approved
561 | cb41584c | map.farmer_snow.b | approved
562 | 170c7a00 [R] | map.farmer_1.a | approved
562 | 317a5b85 | map.tribal_2.a | approved
562 | e9d95cfa | map.farmer_snow.b | approved
562 | d7b02859 | map.farmer_snow.a | approved
562 | 23817396+452f35d3 | map.farmer_snow.a | approved
562 | e08c4278 | map.tribal_2.b | approved
562 | 22bf0f3a | map.tribal_sandbox.b | approved
563 | e6641d5a | map.farmer_snow.b | approved
563 | 5ac61480 | map.farmer_snow.a | approved
563 | 3524fafd | map.tribal_2.b | approved
563 | 0b30e30a | map.tribal_2.b | approved
563 | 74f9cb20 | map.tribal_sandbox.b | approved
563 | 115b231d [R] | map.farmer_2.a | approved
563 | 632026ad | map.viking_sandbox.a | approved
563 | a295aa5a | map.ancient_sandbox.a | approved
564 | 617a5f5a | map.viking_sandbox.b | approved
564 | 78fc3163 | map.viking_sandbox.a | approved
564 | d4443b87 | map.ancient_sandbox.b | approved
564 | 288ca462 | map.ancient_sandbox.a | approved
564 | 79991c9b | map.farmer_snow.a | approved
564 | 140782a1 | map.farmer_snow.b | approved
564 | 6d29e353 | map.tribal_2.a | approved
564 | 140833c3 | map.tribal_2.a | approved
564 | 8992d360 [R] | map.farmer_2.a | approved (CONFIRM failed a)
565 | 6278850c | map.viking_sandbox.b | approved
565 | b149e156 | map.ancient_sandbox.b | approved
565 | e503d93f | map.tribal_2.a | approved
565 | ca008f0d | map.farmer_snow.b | approved
565 | 4d8db327 | map.viking.a | approved
565 | 61b2ec07+4e086afe | map.medieval_2.b | approved
565 | b364ac2a | map.ancient_2.a | approved
565 | b84ba5a1 [R] | map.farmer_2.a | approved (CONFIRM passed a; critic kept blocker 3)

## Tuned values
web/src/map/tabs/farmer_2.ts:wheatField stalk height, step | 0.65-0.8 m, 0.75 m | 564 | approved | 0.5-0.7 m, 0.9 m; 1.0-1.3 m
web/src/map/tabs/farmer_2.ts:SHEAVES z range, scale | z -36..-16, x1.5 | 558 | approved | z -44..-23, x1
web/src/map/tabs/tribal_sandbox.ts:NOOKS centres | 10 m further in ((25.8,18.2) (34.1,-4.7) (20.9,-20.9) (4.2,23.2)) | 559 | approved | (34,24) (44,-6) (28,-28) (6,33)
web/src/map/tabs/tribal_sandbox.ts:rockNooks boulder size | 4.5-7 m | 559 | approved | 3-5.5 m
web/src/map/tabs/tribal_sandbox.ts:redShrubs ball radius, spread | (0.45-0.8) x2.5, off x2 | 562 | approved | 0.45-0.8 m, off 0.6-1.0 m
web/src/map/tabs/tribal_1.ts:ISLAND round | 2 (ellipse) | 560 | approved | 3
web/src/map/tabs/farmer_1.ts:islandOutline power | 2 (ellipse) | 560 | approved | 3
web/src/map/tabs/farmer_2.ts:PATH.front | -32 | 560 | approved | -44
web/src/map/tabs/farmer_2.ts:WALLS front-right / back-right ends | x 40 / z 42.5 | 560 | approved | x 46 / z 44
web/src/map/tabs/farmer_2.ts:farmer2WallStone colour | (0.62,0.5,0.38) emissive (0.13,0.105,0.075) | 560 | approved | (0.62,0.62,0.6) emissive (0.07,0.07,0.08)
web/src/map/tabs/farmer_1.ts:RIVER bend, bendRate | 1.9, 0.1 | 561 | approved | 1.4, 0.075
web/src/map/tabs/farmer_1.ts:farmer1BankRock colour | (0.6,0.53,0.44) emissive (0.12,0.1,0.08) | 561 | approved | (0.5,0.47,0.44) emissive (0.07,0.065,0.06)
web/src/map/tabs/farmer_2.ts:farmer2UnderEarth colour | (0.5,0.4,0.27) self-lit 1.0 | 561 | approved | (0.44,0.36,0.25) self-lit 0.45
web/src/map/tabs/farmer_2.ts:farmer2OliveLeaf / Dark | (0.62,0.56,0.19) x0.6, (0.5,0.46,0.15) x0.55 (oliveGrove) | 563 | approved | (0.5,0.47,0.16) x0.6, (0.4,0.39,0.12) x0.55; (0.45,0.42,0.14) x0.25
web/src/map/tabs/farmer_2.ts:MEADOW | (0.6,0.54,0.18) | 563 | approved | (0.62,0.64,0.2)
web/src/map/tabs/farmer_2.ts:farmer2Wheat colour | (1,0.8,0.3) self-lit 0.35 + straw floor (0.92,0.72,0.3) x0.3 | 565 | approved (critic: cream from above, khaki at ground) | (0.9,0.66,0.2) self-lit 0.3 (CONFIRM: dull ochre); (0.95,0.8,0.32) self-lit 0.4 (CONFIRM: too pale); (0.78,0.55,0.16) emissive (0.26,0.17,0.04)
web/src/map/tabs/farmer_2.ts:farmer2HousePlank / Frame / Roof | (0.88,0.74,0.52) x0.32, (0.56,0.43,0.28) x0.25, (0.74,0.65,0.5) x0.3 | 565 | approved | (0.6,0.44,0.26) x0.18, (0.26,0.15,0.08) x0.15, (0.36,0.23,0.13) x0.15
web/src/map/tabs/tribal_2.ts:tribal2Mountain colour | (0.6,0.5,0.4) emissive (0.1,0.075,0.05) | 564 | approved | (0.6,0.54,0.52) emissive (0.08,0.06,0.05)
