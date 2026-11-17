# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
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

566 | 70777289+20b7df96 | map.medieval_1.b | approved
566 | 29f15c87+fb977c70 | map.ancient_1.b | approved
566 | 49d2750c | map.tribal_sandbox.b | approved
566 | 1e5f5680+e6c89ac4 [R] | map.farmer_2.a | approved (CONFIRM passed)
566 | ae2ad902 | map.farmer_snow.a | approved
566 | 373e0c1c+c3ddcf73 | map.medieval_2.a | approved
566 | 13fa8e2a | map.ancient_2.b | approved
566 | 1e70afc3 | map.viking.b | approved
566 | 9358dcce | map.ancient_sandbox.a | approved
566 | b2df5dd6 | map.viking_sandbox.a | approved

567 | db48feef | map.tribal_sandbox.b | approved
567 | 03d00d50 | map.tribal_sandbox.a | approved
567 | 96d8ba1d | map.tribal_sandbox.a | approved
567 | d32c689e+cd4783d7 | map.farmer_snow.a | approved
567 | 0a2b80e6+254e73fa | map.medieval_1.a | approved
567 | 81b97c93 | map.ancient_1.a | approved
567 | e2665129 | map.viking_sandbox.a | approved
567 | 98b4b52f | map.ancient_2.b | approved
567 | b64c0a48 | map.medieval_2.a | approved
568 | 45084eee | map.tribal_sandbox.a | approved, struck a1
568 | ee8ea992 | map.tribal_sandbox.a | approved, struck a2
568 | d8ff6642 | map.tribal_sandbox.a | approved, struck a3
568 | 0c5f8a08 | map.farmer_snow.a | approved, struck a3
568 | a7c6dc9f | map.farmer_snow.a | approved, struck a4
568 | da540cdb | map.viking_sandbox.a | approved, struck a5
568 | 3da0c3ba | map.viking_sandbox.b | approved, struck b1
568 | 7b27f51b | map.medieval_1.a | approved, struck a4
568 | 6d892fbe | map.medieval_2.a | approved, struck a4

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
web/src/map/tabs/farmer_2.ts:farmer2Wheat colour | unlit heads (1.1,0.67,0.23), stems (0.88,0.51,0.14), out of glow; floor (0.94,0.58,0.17) x0.145 | 566 | approved | (1,0.8,0.3) self-lit 0.35 + straw floor (0.92,0.72,0.3) x0.3; (0.9,0.66,0.2) self-lit 0.3 (CONFIRM: dull ochre); (0.95,0.8,0.32) self-lit 0.4 (CONFIRM: too pale); (0.78,0.55,0.16) emissive (0.26,0.17,0.04)
web/src/map/tabs/farmer_2.ts:farmer2HousePlank / Frame / Roof | (0.88,0.74,0.52) x0.32, (0.56,0.43,0.28) x0.25, (0.74,0.65,0.5) x0.3 | 565 | approved | (0.6,0.44,0.26) x0.18, (0.26,0.15,0.08) x0.15, (0.36,0.23,0.13) x0.15
web/src/map/tabs/tribal_2.ts:tribal2Mountain colour | (0.6,0.5,0.4) emissive (0.1,0.075,0.05) | 564 | approved | (0.6,0.54,0.52) emissive (0.08,0.06,0.05)
web/src/map/tabs/tribal_sandbox.ts:spread | 1.45x horizontal geometry/nav/collisions | 566 | approved | 1x
web/src/map/tabs/viking_sandbox.ts:clearColor and fogColor | cyan (0.52,0.78,0.83) and (0.62,0.82,0.86) | 566 | approved | inherited beige (0.74,0.68,0.52)
web/src/map/tabs/tribal_sandbox.ts:CLIFFS | six staggered sectors with grove breaks; setbacks 2–6 m | 567 | approved | two near-contiguous arcs; 3 m setback
web/src/map/tabs/tribal_sandbox.ts:rockNooks profile and crowns | faceted masses and tilted slabs; five crowns per nook at several heights | 567 | approved (a failed CONFIRM) | stacked flat blocks; two high crowns per nook
web/src/map/tabs/farmer_snow.ts:SNOW_MILL tower and wheel | 5.4 × 5.8 m tower above 4.8 m balcony deck; 10 m wheel angled pi/7 | 567 | approved | full-width gables over 1.2 m plinth; 8 m wheel along river
web/src/map/tabs/medieval_1.ts:plateau cliff tiers | pale grey-lilac columns, shelf heights 6–12 m below turf | 567 | approved | continuous dark ribbon face
web/src/map/tabs/tribal_sandbox.ts:BIRCH_CROWNS and trunk stretch | stronger red, orange and yellow with 0.78 emissive scale; stretch varies 1.45–3 | 568 | approved | diffuse and emissive x0.55; constant 1.5
web/src/map/tabs/tribal_sandbox.ts:rimMesas fractures and openSky skyline | seven leaning polyhedra per crag; low outcrops along CLIFFS | 568 | approved | flat stacked mesas and five 17–26 m spires
web/src/map/tabs/farmer_snow.ts:fieldBoulder and snowyFurrows | boulder cluster (30,-28) with asymmetric caps; six paired ridges beside bridge | 568 | approved | absent
web/src/map/tabs/viking_sandbox.ts:ARENA_RADIUS and iceBody | 51 m circular floor and tiered shell to 28 m below with hanging shards | 568 | approved | 54 × 48 ellipse inside rectangular base slab
web/src/map/tabs/medieval_1.ts:rightBankRuins footprint | three crenellated runs and broken pillars on +x bank | 568 | approved | inherited meadow ruins
web/src/map/tabs/medieval_2.ts:cottagesAndFallenTower footprint | two broken gables and a collapsed tower at front-right | 568 | approved | absent
