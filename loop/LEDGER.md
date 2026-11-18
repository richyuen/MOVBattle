# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
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
579 | 41ea07bb | map.spooky_1.a | approve, struck a4
579 | cf4fcec1 (revert 9957f674) | map.spooky_1.b | dropped: hidden by cliff
579 | d8e18d58, b20691d0 | map.spooky_2.a | approve, struck a2, a1
579 | ca88f7b3 (+6d6941ac, ac19ef0d; reverted fc6bf11f) | map.spooky_2.b | dropped: grate unlit after two follow-ups
579 | d888588d (+b326fec0) | map.dynasty.a | approve, struck a2
579 | 6fce1036 | map.dynasty.b | approve, struck b6
579 | 0167e0b6 | map.legacy.b | approve, struck b1, b4
579 | 2f5b6c6f | map.legacy.a | approve, struck a6
578 | 5adcb485, 486e6428 | map.legacy.b, map.legacy.a | approve (P 30f467e1 approve)
578 | 61f64ff8 (+d3dab59a) | map.dynasty.b | approve, no strike
578 | 43348d28 | map.spooky_2.b | approve, no strike
578 | b84e8a52, 47539e05 | map.spooky_1.a, map.spooky_1.b | approve
578 | bf7c4fb1 (+f692a7c9) | map.pirate.a | approve
578 | f0db546c | map.wild_west.a | approve
578 | 0de40749 | map.renaissance.b | approve

## Done maps (rows compacted at 577; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox: 556-576 rows (outlines, rings, crops, cliffs, skies, set pieces) all approved; see git log `loop(5xx)` for values.

## Tuned values
web/src/map/tabs/dynasty.ts:columnCliffs | continuous 5-sided columns h7.5..12.5m, square/notched rim, green ledges | 582 | approve | hanging stalactite underside
web/src/map/tabs/dynasty.ts:canalSpurs | four 4.4 m spurs x34/-17 (back) -34/17 (front), |z|17.6..27, outer lawn and canal wall split, 3 m dry crossing | 583 | approve, no strike | absent
web/src/map/tabs/dynasty.ts:terraceBranches | side channels x+-42; flights x+-27: flat deck |z|7..13 at .97, ten .5 m treads to the outer lawn, stepped cheeks | 583 | approve, struck b5 | 582 (rejected-kept): twelve .046 m steps z7..18
web/src/map/tabs/dynasty.ts:lawnTerraces outer h | 2.4 m | 583 | approve (in scope of the stairs; no [P] re-tune) | 1.4 (581)
web/src/map/tabs/dynasty.ts:perimeterFlagstones | three-course loop x+-46 z+-35 around notch and existing bridges | 582 | approve | no connected outer path
web/src/map/tabs/spooky_1.ts:duskyMeadow | flattened lumps .9-1.7 m x .14-.26 m, .95 m grid, ~half the cells in drifts, two tones; floor (.13,.16,.28) | 583 | approve, struck a3; lumps read as paving (a4) | 582: upright tufts h .32-.62 on .78 m grid
web/src/map/tabs/spooky_1.ts:deadTrees | 3 of 5 ring spots; root 1.7 m, 5.5-9 m, bark (.035,.035,.055); 32-bit merge | 583 | approve, struck a1 | 582: every spot, root 1.35, merge failed (white)
web/src/map/tabs/spooky_1.ts:rockCliffs | skirt wall to -20 m; 3 tiers of boulders/5-sided blocks per 4.2 m, stone (.22,.25,.4) self (.04,.046,.085) | 583 | approve, no strike on a2 (even band, level bottom) | hex columns, stone (.3,.33,.48) self .1
web/src/map/tabs/renaissance.ts:coveredBridge | x18..30 z34, deck7.3, broad lower arch, four upper bays, orange roof, pink house | 582 | approve | contiguous solid rear house row
web/src/map/tabs/legacy.ts:valleySkyBackdrop | own 1800 m unlit fog-free sphere, emissive (.65,.88,.95); shared dome restored on dispose | 582 | approve | shared grey-white dome over clearColor; initial (.2,.55,.65) too teal
web/src/map/tabs/wild_west.ts:sandstoneArches | three offset pier courses, three faceted crown boulders, segmented pointed spires | 582 | approve | 581: two straight-pier arches12/16m, box lintels, flat spires13..21m; previously absent
web/src/map/tabs/pirate.ts:hourglassBeach | 10 shore stations, halfwidth 7..32 m, waist at x9; two matching shore courses | 582 | approve, no strike | base rectangular field, oval drum
web/src/map/tabs/wild_west.ts:roundPlaza | 55 m circular floor, round drum (z scale1), guide slabs hidden | 581 | approve | power3 oval/rounded rectangle, drum zscale .91
web/src/map/tabs/dynasty.ts:lawnTerraces | eight green lawn blocks h.85/1.4 m, stone faces and offset flagstone edges, draw height | 581 | approve | olive-brown flat floor
web/src/map/tabs/dynasty.ts:courtApproaches | N/S spans7..17 E/W7..10, four curved decks and six-step approaches each end, draw height | 581 | approve | incomplete ring approaches
web/src/map/tabs/ancient_2.ts:frontPorticos | 4-column recesses, 2.8-4 m high, alternate small shrines, fronts stepped 0-2.8 m | 581 | approve, no strike | uniform terrace1 front
web/src/map/tabs/legacy.ts:paleBlueSky | clear (.52,.77,.88), fog (.67,.82,.88), restored on dispose | 581 | approve, no strike | inherited grey-white
web/src/map/tabs/legacy.ts:innerGlade | pine centres at radius >=52, colliders moved; 24 sparse low boulders at r37..46 | 581 | approve | pinched oval inner belt
web/src/map/tabs/spooky_1.ts:leftDescent | left cliff recessed to x-15, path x-10.5 z-23..0 y0..-6, broken room entrance | 581 | approve | absent
web/src/map/tabs/wild_west.ts:townRows | five rear + three front-right (z-38 x1..36) + inner rank of two at z-23.5 x2..23.4; 3.2 m alleys | 583 | approve, struck b1; rank too near the enemy line (b2) | 581: no inner rank
web/src/map/tabs/wild_west.ts:storefronts | h 7.6-10 m; board (.17,.21,.31), trim (.58,.56,.52), panes (.5,.68,.82) out of glow; framed 4-pane sashes, pilasters, .36 m posts; stepped/gabled/arched tops | 583 | approve, struck a1 | h 6-7.5, board (.36,.41,.53), glowing window bands
web/src/map/tabs/pirate.ts:bellMountain | (60,0), 4 boulder tiers to 19 m, 7 palms, fall on -x face, 3.2 m bell; rock (.5,.43,.32) self .6, no received shadows | 583 | approve, no strike (grey, off the island, small bell) | absent
web/src/map/tabs/wild_west.ts:chapel | (39,35), 7x11 m nave, 8 m wall, 18.5 m steeple | 580 | approve | absent
web/src/map/tabs/wild_west.ts:mesaRidge | five overlapping three-tier hexagonal terraces, x -43..-19, z 43..46.2 | 580 | approve | three isolated small mesas (kept)
web/src/map/tabs/wild_west.ts:sandstoneBase | 111/106 m diameters, 9 m deep, 20 facets, sandstone (.65,.46,.28) | 580 | approve | stalactite underside
web/src/map/tabs/legacy.ts:valleyFloor | 290 m diameter, top -0.25, muted green (.4,.46,.19) | 580 | approve | floating underside
web/src/map/tabs/legacy.ts:snowMountains | 22 overlapping five-sided peaks, r 98..110, h 27..49 m, snow caps upper 28% | 580 | approve | detached inherited mountain range
web/src/map/tabs/legacy.ts:sandstoneRuin | broken walls x33..43 z25..32, dead trees, pine clearing x28..51 z19..42 | 580 | approve | absent
web/src/map/tabs/renaissance.ts:frontCanal | 86x5 m green water at z -27.4, quays z -24.7/-30.1, crossings x +-26 | 580 | approve | pale paving behind front houses
web/src/map/tabs/renaissance.ts:creamPavement | 3 m close-set slabs, .035 m joints, three cream tones, zone slabs hidden | 580 | approve, no strike | base blue-grey paving with .28 m grout
web/src/map/tabs/renaissance.ts:openPiazza | fountain meshes and origin radius3.5 collider removed | 580 | approve | fountain at origin
web/src/map/tabs/spooky_1.ts:rimOfferings | 12 lantern clusters, 6 candles each; orange (0.45,0.09,0.008), flame (1,0.42,0.1) self 2 | 579 | approve | absent
web/src/map/tabs/spooky_2.ts:nightSky and nightTurf | navy (0.025,0.04,0.12), hemi 0.3 dir 0.65; turf (0.09,0.12,0.21), stone (0.17,0.21,0.31), cone tufts | 579 | approve | day sky, maroon/green floor, pale kerbs
web/src/map/tabs/spooky_2.ts:gratedCourt | absent (reverted) | 579 | dropped, ember bed stayed black | 14 m court, 7 m grate, 30 bars, four flights
web/src/map/tabs/dynasty.ts:gardenCanals | 92 x 10 m stone-lined turquoise sheets with lily pads | 579 | approve | grey-olive overlays
web/src/map/tabs/dynasty.ts:rimTorii | (-43,28), (40,-33), yaw 0, post colliders moved | 579 | approve | (-17,25), yaw 0.35
web/src/map/tabs/legacy.ts:churchyard | 30 headstones x +-(13..24.2), z 24/28/32, winding 2.4 m approach | 579 | approve | absent
web/src/map/tabs/legacy.ts:tentCamps | six 3.8 m ridge tents per side x +-(35/41), z -14/-4/6 | 579 | approve | absent
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
web/src/map/tabs/spooky_1.ts:fogChasm | Medieval 1 SHORE plateaus, cliff stone (0.3,0.33,0.48), 3 fog sheets alpha 0.32 at -1.5/-4.5/-8, bridge z 1, void hazards | 577 | approved | flat disc, void band z -26
web/src/map/tabs/legacy.ts:meadow | floor (0.56,0.64,0.2); clumps 0.8-1.4 x 0.35-0.6 m on 1.1 m grid, (0.62,0.72,0.2)/(0.48,0.6,0.15); zone slabs hidden | 577 | approved | lilac-grey floor
web/src/map/tabs/wild_west.ts:openStreet | centre barricade and collider removed | 577 | approved | dark box at (0,0)
web/src/map/tabs/wild_west.ts:desertRim | ~60% saguaro 3-5.5 m, else dead tree 4-6 m; mesas (-36,32) (-30,-36) (38,-32), tiers r 4.5/3.4/2.2, (0.72,0.33,0.18) | 577 | approved | pale leafy ring
web/src/map/tabs/pirate.ts:galleons | 30 m hulls at z +-37 along x, 3 gangplanks each | 576 | approved, sterns cream | base ships at (+-20,20)
web/src/map/tabs/pirate.ts:pirateGalleonStern | hull (0.45,0.26,0.13) self 0.42 (kept) | 577 | rejected, reverted (P attempt 1: (0.2,0.11,0.055) self 0.3 did not show; gold cap slabs cover the tops) | -
web/src/map/tabs/pirate.ts:drainLagoon | z +-24 water hazards and sheets removed | 577 | approved | two water bands
web/src/map/tabs/renaissance.ts:dogesPalace | 36 x 21 m facade, front z 31 | 576 | approved | absent
web/src/map/tabs/renaissance.ts:rectangularPiazza | rows x +-44 (6 m deep, z -28..24), z 31 (|x| 18..40), corners (+-44.5,28); front terrace z -30.5, 5.5 m deep, 2-3 storeys (578); zones |x| <= 43 | 578 | approved, struck b4 | oval townRing; low front wall (577)
web/src/map/tabs/legacy.ts:meadow tufts | six-blade fans .2-.38 m, .8 m grid, ~2/3 of cells | 583 | approve, struck a1 | ico clumps w .35-.6 h .7-1.1 (578)
web/src/map/tabs/legacy.ts:pineForest ranks | ring tree 5-15 m + one beside + outer rank on 2/3 + sapling on 1/4; width .3-.46 h | 583 | approve, no strike (still a wall) | three 9-14 m pines per spot
web/src/map/tabs/legacy.ts:church ruin | nave in 3 pieces with a 2.5 m breach, 4 open roof bays with rafters, open transept quarter, eave teeth, 16 rubble blocks | 583 | approve, struck a3 | intact nave and roof
web/src/map/tabs/legacy.ts:openGlade and church | barricade (22,0) gone; nave x -4..10 z 28.5..35.5, tower x -6.5 14 m + spire 9 m | 578 | approved | base box (-20,20)
web/src/map/tabs/dynasty.ts:courtyard | court |x|,|z| <= 7, pave (0.4,0.41,0.4) self 0.2; pit box half 3; E/W moats |x| 7..10 water hazards | 578 | approved, no strike | pit cyl r 5; pave (0.62,0.62,0.58) self 0.4 (too white)
web/src/map/tabs/spooky_2.ts:squareIsland and fogChannels | power 8, notch x > 36 z > 30; fog z +-12 drawn only; loop path x +-44 z +-38 | 578 | approved, no strike, kerbs/path glow | base oval
web/src/map/tabs/spooky_1.ts:graveyard | plot x 13..31 z 13..29, 24 stones | 578 | approved, struck b2 | base tombs both halves
web/src/map/tabs/pirate.ts:sandIsland | sea ring 62 x 56 (0.2,0.8,0.75); drum 64 x 58, 6 m + belly 14 m (0.72,0.52,0.28) self 0.4, no fog | 578 | approved, struck a3, drum reads thin | stalactite underside
web/src/map/tabs/wild_west.ts:sunsetSky | clear (0.95,0.66,0.44), fog (0.97,0.72,0.5); dir (-0.9,-0.3,0.32) 1.1 warm; sun disc 22 m | 578 | approved, struck a4 | beige-grey with range
