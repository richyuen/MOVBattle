# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
585 | d6e6dbce [R] | map.spooky_1.a2 | approve, struck a2 (critic a PASS); CONFIRM a FAIL, fresh list -> plateau
585 | 7325dec5, 2cfb1cf0 | map.renaissance.a6, a4 | approve, struck a6, a4; a67a7d56 [E] struck b6 (b PASS)
585 | 07e0b708 | map.pirate.b2 | approve, struck b2
585 | 26b8a6d7, 8f023e21 | map.pirate.a6, a4 | approve, struck a6, a4
585 | 6ad3b2cd | map.spooky_2.a4 | approve, no strike (mound lost in dark)
585 | 45cc5ae9 | map.spooky_2.b2 | approve, stair clause struck
584 | 40f76430 | map.wild_west.b2 | approve, struck b2; CONFIRM b PASS
584 | 397ce937, 5deb40d9, 86d685ef | map.wild_west.a2 | approve, struck a2; CONFIRM a FAIL (second) -> plateau
584 | 09c46949, 83d01f33 | map.spooky_2.b3 | approve, struck b3
584 | 9944d480 | map.legacy.a2 | approve, struck a2; CONFIRM a PASS -> D
584 | 012614f9 [R] | map.spooky_1.a2,4 | approve, struck a4; CONFIRM a PASS, critic a FAIL
584 | 89c01adc | map.renaissance.a1 | approve, struck a1
584 | 7813a271 | map.renaissance.b6 | approve, no strike (hollow not shown)
584 | 5395195a | map.pirate.a2 | approve, struck a2
584 | 96f80159 | map.spooky_2.a4 | approve, no strike (near edge; TABS far edge)
583 | 8094db6e [R] | map.spooky_1.a1-3 | approve, struck a1, a3; added a4
583 | 4f1cb063 | map.dynasty.b3 | approve, no strike
583 | bf9994ed | map.dynasty.b5 | approve, struck b5
583 | 92ad5b14 | map.legacy.a1 | approve, struck a1
583 | 414198c9 | map.legacy.a2 | approve, no strike
583 | f8143bfb | map.legacy.a3 | approve, struck a3
583 | 17a180c4, b25c16e2 | map.wild_west.a1 | approve, struck a1
583 | 35137805 | map.wild_west.b1 | approve, struck b1; added b2
583 | 1bac6c2d, 36dabe6f | map.pirate.a2 | approve, no strike
582 | 229f9b4d | map.dynasty.a3 | approve, struck a3
582 | 5b6181bc | map.dynasty.b3 | rejected-kept, revert conflicted with later approved path; aborted
582 | 0c7d7a4e | map.dynasty.b4 | approve, struck b4
582 | b0840e69 | map.renaissance.b3 | approve, struck b3
582 | fe776d2a | map.spooky_1.a1 | approve, struck a1; CONFIRM a FAIL
582 | 1c4f83cd | map.spooky_1.a2 | approve, struck a2; second failed a CONFIRM -> plateau
582 | bf604f4a, cd5ed429 | map.legacy.a7 | approve, struck a7; CONFIRM a FAIL, b PASS
582 | 61cfb0a4 | map.wild_west.a3 | approve, struck a3; CONFIRM a,b FAIL
582 | ca76875d, 013ff74f | map.pirate.b3 | approve, no strike
581 | 7ced1c3e | map.ancient_2.a3 | approve, no strike
581 | 4ca22ba3 | map.legacy.a7 | approve, no strike
581 | 5a649e0c | map.legacy.b3 | approve, struck b3
581 | 8b37b4e3, b0f7dd32, 8800d66d | map.spooky_1.b5 | approve, struck b5; CONFIRM b PASS, a FAIL
581 | dc051619 | map.wild_west.a3 | approve, no strike
581 | c305d702 | map.wild_west.b1 | approve, struck b1
581 | 1f0d6c88 | map.wild_west.b4 | approve, struck b4
581 | 9a58d04e | map.dynasty.a4 | approve, struck a4
581 | 63de26e1 | map.dynasty.b2 | approve, struck b2, collateral a6
580 | 07b08bd1 | map.wild_west.a5 | approve, struck a5
580 | 514d0cf8 | map.wild_west.b2 | approve, struck b2
580 | cd907413 | map.wild_west.a6 | approve, struck a6
580 | f5d5ce85 | map.legacy.b2 | approve, struck b2
580 | bfb1c703 | map.legacy.a4 | approve, struck a4
580 | 9a3f5024, 2fc231cb | map.legacy.a5 | approve, struck a5
580 | eae680b0 | map.renaissance.b2 | approve, struck b2
580 | 304cb24f | map.renaissance.a3 | approve, no strike
580 | 19ca5178 | map.renaissance.b5 | approve, struck b5

## Done maps (rows compacted at 577; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584): rows (outlines, rings, crops, cliffs, skies, set pieces) all approved; see git log `loop(5xx)` for values.

## Tuned values
web/src/map/tabs/dynasty.ts:columnCliffs | continuous 5-sided columns h7.5..12.5m, square/notched rim, green ledges | 582 | approve | hanging stalactite underside
web/src/map/tabs/dynasty.ts:canalSpurs | four 4.4 m spurs x34/-17 (back) -34/17 (front), |z|17.6..27, outer lawn and canal wall split, 3 m dry crossing | 583 | approve, no strike | absent
web/src/map/tabs/dynasty.ts:terraceBranches | side channels x+-42; flights x+-27: flat deck |z|7..13 at .97, ten .5 m treads to the outer lawn, stepped cheeks | 583 | approve, struck b5 | 582 (rejected-kept): twelve .046 m steps z7..18
web/src/map/tabs/dynasty.ts:lawnTerraces outer h | 2.4 m | 583 | approve (in scope of the stairs; no [P] re-tune) | 1.4 (581)
web/src/map/tabs/dynasty.ts:perimeterFlagstones | three-course loop x+-46 z+-35 around notch and existing bridges | 582 | approve | no connected outer path
web/src/map/tabs/spooky_1.ts:duskyMeadow | six-blade fans h .28-.5 m, .8 m grid, 7 cells in 10, tones (.19,.24,.4)/(.25,.31,.5); floor (.13,.16,.28) | 584 | approve, struck a4 | 583: flattened lumps (read as paving)
web/src/map/tabs/spooky_1.ts:deadTrees | 3 of 5 ring spots; root 1.7 m, 5.5-9 m, bark (.035,.035,.055); 32-bit merge | 583 | approve, struck a1 | 582: every spot, root 1.35, merge failed (white)
web/src/map/tabs/spooky_1.ts:rockCliffs | skirt inset 5 m at .45 light; upper masses 4.5-7.5 m alternating out 1.6-3.8 / in -.6..+.6; descent face 1.2 m proud | 585 | approve, struck a2 | 584: blocks 7-12 m, skirt on the outline (flat band)
web/src/map/tabs/renaissance.ts:coveredBridge | x18..30 z34, deck7.3, broad lower arch, four upper bays, orange roof, pink house | 582 | approve | contiguous solid rear house row
web/src/map/tabs/wild_west.ts:sandstoneArches | three offset pier courses, three faceted crown boulders, segmented pointed spires | 582 | approve | 581: two straight-pier arches12/16m, box lintels, flat spires13..21m; previously absent
web/src/map/tabs/pirate.ts:hourglassBeach | 10 shore stations, halfwidth 7..32 m, waist at x9; two matching shore courses | 582 | approve, no strike | base rectangular field, oval drum
web/src/map/tabs/wild_west.ts:roundPlaza | 55 m circular floor, round drum (z scale1), guide slabs hidden | 581 | approve | power3 oval/rounded rectangle, drum zscale .91
web/src/map/tabs/dynasty.ts:lawnTerraces | eight green lawn blocks h.85/1.4 m, stone faces and offset flagstone edges, draw height | 581 | approve | olive-brown flat floor
web/src/map/tabs/dynasty.ts:courtApproaches | N/S spans7..17 E/W7..10, four curved decks and six-step approaches each end, draw height | 581 | approve | incomplete ring approaches
web/src/map/tabs/ancient_2.ts:frontPorticos | 4-column recesses, 2.8-4 m high, alternate small shrines, fronts stepped 0-2.8 m | 581 | approve, no strike | uniform terrace1 front
web/src/map/tabs/spooky_1.ts:leftDescent | left cliff recessed to x-15, path x-10.5 z-23..0 y0..-6, broken room entrance | 581 | approve | absent
web/src/map/tabs/wild_west.ts:townRows | five rear + three front-right (z-38 x1..36) + inner rank of two at z-23.5 x-22..-0.6; 3.2 m alleys | 584 | approve, struck b2 | 583: inner rank x2..23.4 (hid the stage armies)
web/src/map/tabs/wild_west.ts:storefronts | h 7.6-10 m; board (.17,.21,.31), trim (.58,.56,.52), panes (.5,.68,.82) out of glow; framed 4-pane sashes, pilasters, .36 m posts; stepped/gabled/arched tops | 583 | approve, struck a1 | h 6-7.5, board (.36,.41,.53), glowing window bands
web/src/map/tabs/pirate.ts:bellMountain | (34,38), 4 boulder tiers to 19 m, rock (.64,.5,.31), caps on every upper boulder, fall on -z face, 6 m bell in a 13 m A-frame | 584 | approve, struck a2 | 583: (60,0), rock (.5,.43,.32), 3.2 m bell
web/src/map/tabs/wild_west.ts:chapel | (39,35), 7x11 m nave, 8 m wall, 18.5 m steeple | 580 | approve | absent
web/src/map/tabs/wild_west.ts:mesaRidge | five overlapping three-tier hexagonal terraces, x -43..-19, z 43..46.2 | 580 | approve | three isolated small mesas (kept)
web/src/map/tabs/wild_west.ts:sandstoneBase | 111/106 m diameters, 9 m deep, 20 facets, sandstone (.65,.46,.28) | 580 | approve | stalactite underside
web/src/map/tabs/renaissance.ts:frontCanal | 86x5 m green water at z -27.4, quays z -24.7/-30.1, crossings x +-26 | 580 | approve | pale paving behind front houses
web/src/map/tabs/renaissance.ts:creamPavement | 3 m close-set slabs, .035 m joints, three cream tones, zone slabs hidden | 580 | approve, no strike | base blue-grey paving with .28 m grout
web/src/map/tabs/renaissance.ts:openPiazza | fountain meshes and origin radius3.5 collider removed | 580 | approve | fountain at origin
web/src/map/tabs/spooky_1.ts:rimOfferings | 12 lantern clusters, 6 candles each; orange (0.45,0.09,0.008), flame (1,0.42,0.1) self 2 | 579 | approve | absent
web/src/map/tabs/spooky_2.ts:nightSky and nightTurf | navy (0.025,0.04,0.12), hemi 0.3 dir 0.65; turf (0.09,0.12,0.21), stone (0.17,0.21,0.31), cone tufts | 579 | approve | day sky, maroon/green floor, pale kerbs
web/src/map/tabs/spooky_2.ts:gratedCourt | 15 m flush court, 7 m ember plate (1.6,.5,.06) in the glow, 9 flat bars each way .22 m x 4 cm, kerb lanterns, no colliders | 584 | approve, struck b3 | 579: .2 m bars hid the bed (dropped)
web/src/map/tabs/dynasty.ts:gardenCanals | 92 x 10 m stone-lined turquoise sheets with lily pads | 579 | approve | grey-olive overlays
web/src/map/tabs/dynasty.ts:rimTorii | (-43,28), (40,-33), yaw 0, post colliders moved | 579 | approve | (-17,25), yaw 0.35
web/src/map/tabs/ancient_2.ts:RIM | 51 m circle, power 2 | 570 | approved, projecting shelf still visible | superellipse 54 by 48 m, power 3
web/src/map/tabs/ancient_2.ts:greenLawn | floor (0.6,0.63,0.22); clumps on 1.1 m grid, olives (0.58,0.62,0.21)/(0.46,0.52,0.16) in sine swathes; 70 flower drifts | 576 | approved | (0.55,0.69,0.21) + 2600 random lime clumps; orange autumn floor
web/src/map/tabs/ancient_2.ts:ringWall | 72 segments r 49.6, 1.5 m high, beige (0.78,0.68,0.5), 6 cypress clusters; ring trees removed | 572 | approved, struck a3 | autumn tree ring
web/src/map/tabs/ancient_2.ts:crispRim and frontPropylon | floor trimmed to r 50.3 via setVerticesData, lawn out of glow; propylon 8.4 x 5.4 m at 250 deg, r 49 | 574 | approved, b PASS | apron; solid gabled box
web/src/map/tabs/ancient_2.ts:clearSky, openSkyline, TERRACES | clear (0.3,0.6,0.88); mountain* and campaign_zone_* hidden (P 576); 4 terraces of 3.5-9 m blocks, fronts +-1.75 m, tops +-1.5 m, side flights; walls self-lit 0.72 | 576 | approved | beige; range shown; mirrored 6 m strips self-lit 0.3 (575); 3 terraces to 10 m
web/src/map/tabs/ancient_2.ts:earthDrum and PAVILIONS | drum r 51 to -17 m, 110 stones; pavilions at 188/250/320 deg | 573 | approved, a PASS | navy slab; absent
web/src/map/tabs/dynasty.ts:pagoda | (17,37), platform 17x17x3, storeys 11/7.5 m, roofs 19/13 m frustums | 576 | approved | base pagoda (0,29) scale 0.9
web/src/map/tabs/dynasty.ts:mintSky | clear (0.68,0.86,0.74), fog (0.76,0.9,0.8), mountain* hidden | 577 | approved | inherited (0.72,0.76,0.66) with range
web/src/map/tabs/dynasty.ts:squareIsland | superellipse 54 x 48 power 8, notch x < -36 and z < -30, zone slabs hidden | 577 | approved | power 3 rounded oval
web/src/map/tabs/spooky_1.ts:nightSky | clear/fog (0.035,0.05,0.13); hemi 0.3, dir 0.65; moon, 300 stars | 576 | approved | grey day sky, mountains
web/src/map/tabs/spooky_1.ts:nightGrass | floor (0.2,0.24,0.38) self (0.05,0.06,0.11); blades (0.26,0.31,0.46); zone slabs hidden | 577 | approved | inherited dark green under maroon/blue slabs
web/src/map/tabs/spooky_1.ts:fogChasm | Medieval 1 SHORE plateaus, 3 fog sheets (.1,.125,.26) alpha .34 at -1.5/-4.5/-8, bridge z 1, void hazards | 584 | approve | fog (.42,.48,.78) alpha .32 (brightest band)
web/src/map/tabs/wild_west.ts:openStreet | centre barricade and collider removed | 577 | approved | dark box at (0,0)
web/src/map/tabs/wild_west.ts:desertRim | ~60% saguaro 3-5.5 m, else dead tree 4-6 m; mesas (-36,32) (-30,-36) (38,-32), tiers r 4.5/3.4/2.2, (0.72,0.33,0.18) | 577 | approved | pale leafy ring
web/src/map/tabs/pirate.ts:galleons | 30 m hulls at z +-37; gangplanks 3.2 m x 12.5 m run, fanned, cream deck mat | 585 | approve, struck b2 | 576: 1.6 m x 6.2 m planks into the water
web/src/map/tabs/*:skies 585 | renaissance hazeSky (.8,.9,.95), pirate tropicSky (.55,.84,.93): backdrop spheres, range hidden; pirate hazeTreeline hidden + 6 crates | 585 | approve, struck ren a6, pir a4, a6 | dome + range
web/src/map/tabs/renaissance.ts:stoneBase | 106 x 98 x 9 m cream plinth, steps 3/7 m in | 585 | approve, struck a4 | stalactite underside
web/src/map/tabs/spooky_2.ts:channelBridges | stone 4.4 m at x +-44, rise 1.4; timber 5 m at x 0, deck 1 m | 585 | approve, stair clause struck | absent
web/src/map/tabs/pirate.ts:pirateGalleonStern | hull (0.45,0.26,0.13) self 0.42 (kept) | 577 | rejected, reverted (P attempt 1: (0.2,0.11,0.055) self 0.3 did not show; gold cap slabs cover the tops) | -
web/src/map/tabs/pirate.ts:drainLagoon | z +-24 water hazards and sheets removed | 577 | approved | two water bands
web/src/map/tabs/renaissance.ts:dogesPalace | 36 x 21 m facade, front z 31 | 576 | approved | absent
web/src/map/tabs/renaissance.ts:rectangularPiazza | rows x +-44 (6 m deep, z -28..24), z 31 (|x| 18..40), corners (+-44.5,28); front terrace z -30.5, 5.5 m deep, 2-3 storeys (578); zones |x| <= 43 | 578 | approved, struck b4 | oval townRing; low front wall (577)
web/src/map/tabs/dynasty.ts:courtyard | court |x|,|z| <= 7, pave (0.4,0.41,0.4) self 0.2; pit box half 3; E/W moats |x| 7..10 water hazards | 578 | approved, no strike | pit cyl r 5; pave (0.62,0.62,0.58) self 0.4 (too white)
web/src/map/tabs/spooky_2.ts:squareIsland and fogChannels | power 8, notch x > 36 z > 30; fog z +-12 drawn only; loop path x +-44 z +-38 | 578 | approved, no strike, kerbs/path glow | base oval
web/src/map/tabs/spooky_1.ts:graveyard | plot x 13..31 z 13..29, 24 stones | 578 | approved, struck b2 | base tombs both halves
web/src/map/tabs/pirate.ts:sandIsland | sea ring 62 x 56 (0.2,0.8,0.75); drum 64 x 58, 6 m + belly 14 m (0.72,0.52,0.28) self 0.4, no fog | 578 | approved, struck a3, drum reads thin | stalactite underside
web/src/map/tabs/wild_west.ts:sunsetSky | clear (0.95,0.66,0.44), fog (0.97,0.72,0.5); dir (-0.9,-0.3,0.32) 1.1 warm; sun disc 22 m | 578 | approved, struck a4 | beige-grey with range

web/src/map/tabs/wild_west.ts:sandStreet | floor diffuse (.6,.55,.53) self (.5,.3,.2), out of the glow; 520 ripples 1.3 m x 2 cm | 584 | approve, struck a2 (a shade pale) | diffuse (.72,.56,.48) self (.13,.08,.055) rust; (.5,.55,.6)/(.44,.3,.21) in the glow bloomed white
web/src/map/tabs/spooky_2.ts:pumpkinShrine | (14,38), 16 m mound, trunks 1.7 m | 585 | approve, no strike (mound dark, trees thin) | 584: (-17,-38), 13 m mound
web/src/map/tabs/renaissance.ts:cornerPalazzo | back wing x-44..-18.5 z31 (6 m), side wing x-44 from the left row's end to z31 (5 m), 2 storeys 5.4 m, loggias 2.6 m deep | 584 | approve, struck a1 | house rows
web/src/map/tabs/renaissance.ts:palaceArcade | ground storey hollow 3.2 m, diamonds over columns, collider on the back wall only | 584 | approve, no strike (not shown) | solid body with shade panels