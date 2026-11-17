# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
568 | 45084eee | map.tribal_sandbox.a | approved, struck a1
568 | ee8ea992 | map.tribal_sandbox.a | approved, struck a2
568 | d8ff6642 | map.tribal_sandbox.a | approved, struck a3
568 | 0c5f8a08 | map.farmer_snow.a | approved, struck a3
568 | a7c6dc9f | map.farmer_snow.a | approved, struck a4
568 | da540cdb | map.viking_sandbox.a | approved, struck a5
568 | 3da0c3ba | map.viking_sandbox.b | approved, struck b1
568 | 7b27f51b | map.medieval_1.a | approved, struck a4
568 | 6d892fbe | map.medieval_2.a | approved, struck a4
569 | 6ddcdd19 | map.farmer_snow.a | approve, struck a5
569 | eb3c33ae+16dc5699 | map.viking_sandbox.a | approve, struck a1
569 | b5799593 | map.viking_sandbox.a | approve, struck a2
569 | 2be8528a | map.viking_sandbox.a | approve, struck a3
569 | 489d2940 | map.medieval_2.a | approve, struck a3
569 | 41c29446 | map.medieval_2.b | approve, struck b4
569 | 8c56cdf8 | map.medieval_2.a | approve, struck a5
569 | 18cc0f35 | map.medieval_1.b | approve, struck b4
569 | cdefcfc1 | map.medieval_1.a | approve, struck a3
570 | 1371524f+24937b53 [R] | map.farmer_snow.a | approve, struck a2
570 | 48dacf98+59b30f57 | map.medieval_1.a | approve, struck a5
570 | 9767224d+8b7cf263+7094ea34 | map.medieval_1.b | approve, struck b5
570 | 2980c8ce+ca101d74 | map.medieval_1.a | approve
570 | 4e079a16 | map.medieval_2.b | approve, struck b1
570 | 4df6e5f8 | map.medieval_2.a | approve, struck a2
570 | 1a2024e4 | map.ancient_1.a | approve, struck a3
570 | 18a7b03b | map.ancient_2.b | approve
570 | c8566daa | map.ancient_sandbox.b | approve, struck b2
570 | 23af4ed0 | map.viking.a | approve, struck a2
571 | 2c30c0f9 | map.medieval_1.a | approve, struck a6 (a PASS; CONFIRM passed)
571 | b3ebd6d4 | map.medieval_2.a | approve, struck a1
571 | c12b2649 | map.medieval_2.a | approve
571 | a1735190 | map.medieval_2.a | approve, struck a4
571 | b70ca30a | map.ancient_2.a | approve, struck a1
571 | f162a716 | map.ancient_1.b | approve, struck b4
571 | 11ef65f1 | map.ancient_1.a | approve, struck a5
571 | 8699ce12 | map.ancient_sandbox.a | approve, struck a6
571 | d5caaf8b | map.viking.b | approve, struck b3 and a4
571 | c47c5fef [R] | map.viking_sandbox.a | approve, struck a1, a2; added a3
572 | 2cf0d365 [R] | map.farmer_snow.a | approve, struck a1, a3 (CONFIRM failed a)
572 | afbebfe0 | map.medieval_2.a | approve, struck a3 (CONFIRM failed a)
572 | 17023fc0 | map.viking_sandbox.a | approve, struck a3 (CONFIRM failed a)
572 | b49c9e06 | map.ancient_1.a | approve, struck a6
572 | 86b2096b | map.ancient_1.b | approve, struck b2 (CONFIRM failed b)
572 | 650af264 | map.ancient_1.a | approve, struck a4 (CONFIRM failed a)
572 | ed751363 | map.ancient_2.a | approve, struck a3
572 | 72b505d7 | map.ancient_sandbox.b | approve, struck b3 and a3
572 | 30beeb4b+b35b008f | map.viking.a | approve, struck a3
572 | 686f2456 | map.ancient_sandbox.a | approve, struck a2
573 | 94ecffc7+cd93dfb2 [R] | map.farmer_snow.a | approve, struck a1-a3 (CONFIRM passed: D)
573 | 264fb953 | map.viking.b | approve, no strike
573 | c44dc74a | map.viking.a | approve, struck a5
573 | f74d311d | map.viking.a | approve, struck a6 (CONFIRM passed a)
573 | d11426f4 | map.ancient_sandbox.b | approve, struck b1
573 | b82dd7b7 | map.ancient_sandbox.b | approve, struck b4 (CONFIRM passed b, failed a)
573 | f5374621 | map.ancient_2.b | dropped (no visible change; reverted)
573 | cc91f4d4 | map.ancient_2.a | approve, struck a4
573 | 0f5ada56 | map.ancient_2.a | approve, struck a5
573 | 61adfc2c | map.ancient_1.a | approve, struck a1

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
web/src/map/tabs/farmer_snow.ts:winterCarts footprints | two carts at (11,-20), (22,-12) and log pile at (17,-29) | 569 | approved | absent
web/src/map/tabs/viking_sandbox.ts:iceWall shelves | irregular joined shelves with backing to the preceding tier | 569 | approved (CONFIRM failed a) | individual flat caps
web/src/map/tabs/viking_sandbox.ts:snowAndIce floor | connected 0.72-radius sheet with lobed edge and branching cracks | 569 | approved (CONFIRM failed a) | scattered slabs
web/src/map/tabs/viking_sandbox.ts:rimPeaks | five groups rooted at outer tier | 569 | approved | detached inherited range
web/src/map/tabs/medieval_2.ts:earthenBowl profile | six rings to 23 m depth | 569 | approved | navy slab and stalactites
web/src/map/tabs/medieval_2.ts:facingHalves | centres x ±24 with 48 × 64 m halves | 569 | approved | four 40 × 28 m pads
web/src/map/tabs/medieval_2.ts:meadowGrass palette and blades | ico clump swathes on 0.85 m grid, 2.4 m lawn lanes by paths, glades | 571 | approved, struck a4 | 6100 blade tufts (569); inherited olive floor and blades
web/src/map/tabs/medieval_2.ts:castleFront silhouette | stepped curtain runs between drum towers at gate offsets 6.5/18/29/37, round keep 23 m + spire to ~41 m | 571 | approved, struck a1 | four straight 12 m curtain boxes
web/src/map/tabs/medieval_2.ts:castleOaks groves | 17 oaks with scale 0.7-1.5, 3-7 lobes, wall-foot band z 17-21 | 571 | approved, blocker 3 stands | 11 equal 4-lobe oaks
web/src/map/tabs/medieval_1.ts:rightBankBreak | west ring retained, only outer corner groups remain on east | 569 | approved | tree ring on both banks
web/src/map/tabs/medieval_1.ts:gnarledOaks profile | kinked tapering trunks with four irregular crown lobes | 569 | approved | inherited trunks and crowns
web/src/map/tabs/farmer_snow.ts:SNOW and SNOW_SHADE (R) | warm diffuse (0.72,0.66,0.58), self-light (0.23,0.26,0.47), field+lip out of glow; band (0.085,0.115,0.29), 150 stones; 6 corner trees | 573 | approved, D | (0.57,0.68,0.96)/(0.035,0.065,0.17) cobalt; (0.8,0.85,0.96)/(0.3,0.34,0.45)
web/src/map/tabs/farmer_snow.ts:nightSky hemi and dir | intensities 0.22 and 0.78, diagonal directional light (0.62,-0.55,-0.48) | 570 | approved, localized shadows still too narrow | 0.35 and 0.55, inherited direction
web/src/map/tabs/medieval_1.ts:landfallRamp | 3.25 m wide, (-7.4,-0.18,-18) to (-1.9,-5.8,-4) | 570 | approved | absent
web/src/map/tabs/medieval_1.ts:meadowDressing | flattened ico clumps 1.1-2 m, two greens (0.5,0.74,0.22)/(0.33,0.56,0.16), 0.8 m grid in swathes, orange heads | 571 | approved, a PASS | two crossed leaf cards per tuft, 0.95 m grid; flat grass
web/src/map/tabs/medieval_2.ts:POND frontage | radii 31 by 10 m clipped to rim, seven hazards | 570 | approved | radii 19 by 7 m, three hazards
web/src/map/tabs/medieval_2.ts:clearColor and fogColor | (0.66,0.84,0.87) and (0.68,0.84,0.87), mountains hidden | 570 | approved | inherited sky and backdrop
web/src/map/tabs/ancient_1.ts:city wall and cypress planters | 1.34 m plaster perimeter, eight planters | 570 | approved | absent
web/src/map/tabs/ancient_2.ts:RIM | 51 m circle, power 2 | 570 | approved, projecting shelf still visible | superellipse 54 by 48 m, power 3
web/src/map/tabs/ancient_sandbox.ts:hillsideTerraces | two three-tier hills at (-24,36) and (23,36), 10 and 13 m high | 570 | approved | absent
web/src/map/tabs/viking.ts:snowPines | four tiers, heights 4.8–9 m | 570 | approved | inherited broadleaf ring
web/src/map/tabs/viking.ts:frozenShip | 22 m hull at (-39,13) yaw 0.18, list 0.1, 13 m mast, ice collar | 571 | approved, small and half hidden | absent
web/src/map/tabs/ancient_2.ts:greenLawn | floor (0.55,0.69,0.21), 2600 lawn clumps, 70 flower drifts mostly by the rim | 571 | approved | orange autumn floor
web/src/map/tabs/ancient_1.ts:bayHeadland and hopliteStatue | 44 x 21 m shelf at (-22,46.5), bay 32 x 10 m, outcrop (-21,49), statue 13 m + 21 m spear | 571 | approved, headland a box pad, statue small | absent
web/src/map/tabs/ancient_sandbox.ts:ruins | 5 broken columns, 3 fallen with drums, 2 gateways, 12 fragments | 571 | approved, pieces slender | absent
web/src/map/tabs/viking_sandbox.ts:snowAndIce floor (R) | ice to 0.8 R, 9.5 m plate crack grid, 9 snow tongues + 7 islands | 571 | approved, snow ~1/5 of ice (CONFIRM wants ~1/2) | 0.72 R sheet with 60 random cracks
web/src/map/tabs/viking_sandbox.ts:iceWall ledges (R) | broken ledges 9-24 deg, depth 1.5-9 m, lift -2..+1.2, jutting columns in 3-7 deg breaks | 571 | approved, ledges thin floating plates | continuous shelves per tier
web/src/map/tabs/farmer_snow.ts:snowRocksAndShade (R) | 9 slate clusters with pale caps (0.82,0.88,1.0) self-lit (0.36,0.42,0.62); drift blobs removed; navy shade plates 17x14 / 11x9 at (17,-33) alpha 0.35/0.3 | 572 | approved (CONFIRM failed a: field cobalt, no corner trees, black side band) | 70 flattened snow drift spheres
web/src/map/tabs/medieval_2.ts:castleFootThicket | hedge domes every 2.3 m at z 22.5-23.7, oaks 7-10 m every 6.5 m at z 20-21.5, 5 subdiv-2 lobes | 572 | approved, struck a3 | absent
web/src/map/tabs/viking_sandbox.ts:iceWall ledge caps | lip 2-3.2 m, ice body from lip down to tier below | 572 | approved, struck a3 | 1.4 m lip, no body
web/src/map/tabs/viking.ts:winterHaze | clear (0.58,0.86,0.91), 320 flakes, mist walls r 46/53 alpha 0.22/0.4 | 572 | approved, struck a3; sky still dull, mist top edge hard | inherited beige sky
web/src/map/tabs/ancient_1.ts:BANDS and STREETS | three bands x -24..24 (z -19/0/19, depth 14/16/14), streets z +-10 4 m wide | 572 | approved (CONFIRM failed b: reads as fused slab) | 2x3 blocks at x +-15
web/src/map/tabs/ancient_1.ts:lighthouse and pebbledUnderside | 14 m octagonal tower at (-42,46); two slabs 7 m + 6 m inset, pebbles every 3.5 m | 572 | approved | absent; 11 m box slab
web/src/map/tabs/ancient_2.ts:ringWall | 72 segments r 49.6, 1.5 m high, beige (0.78,0.68,0.5), 6 cypress clusters; ring trees removed | 572 | approved, struck a3 | autumn tree ring
web/src/map/tabs/viking.ts:BANK, UNDER, FALL | bank 2.4 m smoothstep over 5 m past lake edge (height field); ice bowl to -26 m; crag+cascade at (0,44) | 573 | approved; bank unseen from top | absent
web/src/map/tabs/ancient_sandbox.ts:SHELVES and ISLETS | 10 lobes 9-25 m out, tops -2.5..-7; 5 islets 75-150 m out | 573 | approved, b PASS | absent
web/src/map/tabs/ancient_2.ts:earthDrum and PAVILIONS | drum r 51 to -17 m, 110 stones; pavilions at 188/250/320 deg | 573 | approved, a PASS | navy slab; absent
web/src/map/tabs/ancient_1.ts:clearSky | clear (0.3,0.6,0.88), fog (0.66,0.8,0.93) | 573 | approved | inherited beige
web/src/map/tabs/ancient_sandbox.ts:spiralMountain and edgeVillage | 32 m tower at (0,41) r 9-4.5, 2.5-turn ledge; 5 hamlets, 8 rim cypress clusters, ring trees removed | 572 | approved, struck a2, a3, b3 | absent; autumn ring
