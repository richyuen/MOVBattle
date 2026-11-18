# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
586 | f70a3686 [R] | map.wild_west.a1,a2 | approve, struck a1, a2; CONFIRM a PASS -> D
586 | 1932bf22 | map.ancient_2.a3 | approve, struck a3; CONFIRM -> D
586 | 531d6ed4, 36ee3119 | map.renaissance.a5, a3 | approve, struck a5, a3; CONFIRM a, b PASS -> D
586 | 05e50f52 (+bb77a558), f49048a8 (+f3ee1295) | map.pirate.a5, a1 | approve, struck a5, a1 (critic a PASS)
586 | 6afd6a09 | map.spooky_2.b2 | approve, struck b2
586 | 974a3c2d | map.spooky_2.a5 | approve, no strike (one round tree left)
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
584 | 5395195a | map.pirate.a2 | approve, struck a2
584 | 96f80159 | map.spooky_2.a4 | approve, no strike (near edge; TABS far edge)
583 | 8094db6e [R] | map.spooky_1.a1-3 | approve, struck a1, a3; added a4
583 | 4f1cb063 | map.dynasty.b3 | approve, no strike
583 | bf9994ed | map.dynasty.b5 | approve, struck b5
583 | 1bac6c2d, 36dabe6f | map.pirate.a2 | approve, no strike
582 | 229f9b4d | map.dynasty.a3 | approve, struck a3
582 | 5b6181bc | map.dynasty.b3 | rejected-kept, revert conflicted with later approved path; aborted
582 | 0c7d7a4e | map.dynasty.b4 | approve, struck b4
582 | fe776d2a | map.spooky_1.a1 | approve, struck a1; CONFIRM a FAIL
582 | 1c4f83cd | map.spooky_1.a2 | approve, struck a2; second failed a CONFIRM -> plateau
582 | ca76875d, 013ff74f | map.pirate.b3 | approve, no strike

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584): rows (outlines, rings, crops, cliffs, skies, set pieces) all approved; see git log `loop(5xx)` for values.
wild_west (576-586): town rows/storefronts/inner rank, sand street, round plaza, desert rim, mesas, arches, chapel, sandstone base, sunset backdrop sphere (peach (1,.55,.28) to cream (1,.9,.6)); town dark solids in the glow pass. ancient_2 (565-586): round rim, lawn, ring wall, drum, propylon, pavilions, terraced mound + six temple towers (dark stone (.58,.53,.44)). renaissance (576-586): palace + arcade, rectangular piazza, front terrace, canal, corner palazzo, covered bridge, plinth, haze sky, facade kit, flagstone checker (four shades ~(.72,.62,.45), pale bed). All approved and CONFIRMed.

## Tuned values
web/src/map/tabs/dynasty.ts:columnCliffs | continuous 5-sided columns h7.5..12.5m, square/notched rim, green ledges | 582 | approve | hanging stalactite underside
web/src/map/tabs/dynasty.ts:canalSpurs | four 4.4 m spurs x34/-17 (back) -34/17 (front), |z|17.6..27, outer lawn and canal wall split, 3 m dry crossing | 583 | approve, no strike | absent
web/src/map/tabs/dynasty.ts:terraceBranches | side channels x+-42; flights x+-27: flat deck |z|7..13 at .97, ten .5 m treads to the outer lawn, stepped cheeks | 583 | approve, struck b5 | 582 (rejected-kept): twelve .046 m steps z7..18
web/src/map/tabs/dynasty.ts:lawnTerraces outer h | 2.4 m | 583 | approve (in scope of the stairs; no [P] re-tune) | 1.4 (581)
web/src/map/tabs/dynasty.ts:perimeterFlagstones | three-course loop x+-46 z+-35 around notch and existing bridges | 582 | approve | no connected outer path
web/src/map/tabs/spooky_1.ts:duskyMeadow | six-blade fans h .28-.5 m, .8 m grid, 7 cells in 10, tones (.19,.24,.4)/(.25,.31,.5); floor (.13,.16,.28) | 584 | approve, struck a4 | 583: flattened lumps (read as paving)
web/src/map/tabs/spooky_1.ts:deadTrees | 3 of 5 ring spots; root 1.7 m, 5.5-9 m, bark (.035,.035,.055); 32-bit merge | 583 | approve, struck a1 | 582: every spot, root 1.35, merge failed (white)
web/src/map/tabs/spooky_1.ts:rockCliffs | skirt inset 5 m at .45 light; upper masses 4.5-7.5 m alternating out 1.6-3.8 / in -.6..+.6; descent face 1.2 m proud | 585 | approve, struck a2 | 584: blocks 7-12 m, skirt on the outline (flat band)
web/src/map/tabs/pirate.ts:hourglassBeach | 10 shore stations, halfwidth 7..32 m, waist at x9; two matching shore courses | 582 | approve, no strike | base rectangular field, oval drum
web/src/map/tabs/pirate.ts:goldenSand | beach diffuse (.82,.56,.2) self (.3,.18,.04) out of glow; ripple V strokes .22 m, kink .25-.8 m, lines 1.3-2.1 m apart, (.62,.44,.2) self (.2,.13,.05) | 586 | approve, struck a5 | 586.5: (.8,.6,.3)/(.3,.21,.09), regular 1.6 m chevron grid; earlier base ground material
web/src/map/tabs/pirate.ts:galleons | four tapered hull courses (.62..1 beam), hull (.36,.21,.1) self .45, strakes, gold sheer rails, forecastle, stern castle 8/6/4.2 m with windows, masts 19/23/17 with three yards 13/10.5/7.5 m, rolls 1.15 m, shrouds; dark solids in the glow pass | 586 | approve, struck a1 | 576: box hull (.45,.26,.13), full-width gold slabs, two yards, masts 17/20/15
web/src/map/tabs/pirate.ts:gangplanks | 3.2 m x 12.5 m run, fanned, cream deck mat | 585 | approve, struck b2 | 576: 1.6 m x 6.2 m planks into the water
web/src/map/tabs/pirate.ts:bellMountain | (34,38), 4 boulder tiers to 19 m, rock (.64,.5,.31), caps on every upper boulder, fall on -z face, 6 m bell in a 13 m A-frame | 584 | approve, struck a2 | 583: (60,0), rock (.5,.43,.32), 3.2 m bell
web/src/map/tabs/*:skies 585 | pirate tropicSky (.55,.84,.93): backdrop sphere, range hidden; pirate hazeTreeline hidden + 6 crates | 585 | approve, struck pir a4, a6 | dome + range
web/src/map/tabs/spooky_2.ts:channelBridges | stone 4.4 m at x +-30, half 7, rise 3, stone (.2,.21,.28) self .35, dark opening 3.2x2.4 m; timber 5 m at x 0, deck 1 m | 586 | approve, struck b2 | 585: x +-44, rise 1.4, stone (.4,.45,.6)
web/src/map/tabs/spooky_2.ts:blackTrees | every ring "trunk" hidden, 3 of 4 spots get a black tree 6-9.5 m (root 1.6), bark (.035,.035,.055), 32-bit merge | 586 | approve, no strike | base round-crowned ring trees
web/src/map/tabs/pirate.ts:pirateGalleonStern | hull (0.45,0.26,0.13) self 0.42 (kept) | 577 | rejected, reverted (P attempt 1: (0.2,0.11,0.055) self 0.3 did not show; gold cap slabs cover the tops) | -
web/src/map/tabs/pirate.ts:drainLagoon | z +-24 water hazards and sheets removed | 577 | approved | two water bands
web/src/map/tabs/spooky_1.ts:rimOfferings | 12 lantern clusters, 6 candles each; orange (0.45,0.09,0.008), flame (1,0.42,0.1) self 2 | 579 | approve | absent
web/src/map/tabs/spooky_2.ts:nightSky and nightTurf | navy (0.025,0.04,0.12), hemi 0.3 dir 0.65; turf (0.09,0.12,0.21), stone (0.17,0.21,0.31), cone tufts | 579 | approve | day sky, maroon/green floor, pale kerbs
web/src/map/tabs/spooky_2.ts:gratedCourt | 15 m flush court, 7 m ember plate (1.6,.5,.06) in the glow, 9 flat bars each way .22 m x 4 cm, kerb lanterns, no colliders | 584 | approve, struck b3 | 579: .2 m bars hid the bed (dropped)
web/src/map/tabs/dynasty.ts:gardenCanals | 92 x 10 m stone-lined turquoise sheets with lily pads | 579 | approve | grey-olive overlays
web/src/map/tabs/dynasty.ts:rimTorii | (-43,28), (40,-33), yaw 0, post colliders moved | 579 | approve | (-17,25), yaw 0.35
web/src/map/tabs/dynasty.ts:pagoda | (17,37), platform 17x17x3, storeys 11/7.5 m, roofs 19/13 m frustums | 576 | approved | base pagoda (0,29) scale 0.9
web/src/map/tabs/dynasty.ts:mintSky | clear (0.68,0.86,0.74), fog (0.76,0.9,0.8), mountain* hidden | 577 | approved | inherited (0.72,0.76,0.66) with range
web/src/map/tabs/dynasty.ts:squareIsland | superellipse 54 x 48 power 8, notch x < -36 and z < -30, zone slabs hidden | 577 | approved | power 3 rounded oval
web/src/map/tabs/dynasty.ts:lawnTerraces | eight green lawn blocks h.85/1.4 m, stone faces and offset flagstone edges, draw height | 581 | approve | olive-brown flat floor
web/src/map/tabs/dynasty.ts:courtApproaches | N/S spans7..17 E/W7..10, four curved decks and six-step approaches each end, draw height | 581 | approve | incomplete ring approaches
web/src/map/tabs/dynasty.ts:courtyard | court |x|,|z| <= 7, pave (0.4,0.41,0.4) self 0.2; pit box half 3; E/W moats |x| 7..10 water hazards | 578 | approved, no strike | pit cyl r 5; pave (0.62,0.62,0.58) self 0.4 (too white)
web/src/map/tabs/spooky_1.ts:nightSky | clear/fog (0.035,0.05,0.13); hemi 0.3, dir 0.65; moon, 300 stars | 576 | approved | grey day sky, mountains
web/src/map/tabs/spooky_1.ts:nightGrass | floor (0.2,0.24,0.38) self (0.05,0.06,0.11); blades (0.26,0.31,0.46); zone slabs hidden | 577 | approved | inherited dark green under maroon/blue slabs
web/src/map/tabs/spooky_1.ts:fogChasm | Medieval 1 SHORE plateaus, 3 fog sheets (.1,.125,.26) alpha .34 at -1.5/-4.5/-8, bridge z 1, void hazards | 584 | approve | fog (.42,.48,.78) alpha .32 (brightest band)
web/src/map/tabs/spooky_1.ts:leftDescent | left cliff recessed to x-15, path x-10.5 z-23..0 y0..-6, broken room entrance | 581 | approve | absent
web/src/map/tabs/spooky_1.ts:graveyard | plot x 13..31 z 13..29, 24 stones | 578 | approved, struck b2 | base tombs both halves
web/src/map/tabs/spooky_2.ts:squareIsland and fogChannels | power 8, notch x > 36 z > 30; fog z +-12 drawn only; loop path x +-44 z +-38 | 578 | approved, no strike, kerbs/path glow | base oval
web/src/map/tabs/spooky_2.ts:pumpkinShrine | (14,38), 16 m mound, trunks 1.7 m | 585 | approve, no strike (mound dark, trees thin) | 584: (-17,-38), 13 m mound
web/src/map/tabs/pirate.ts:sandIsland | sea ring 62 x 56 (0.2,0.8,0.75); drum 64 x 58, 6 m + belly 14 m (0.72,0.52,0.28) self 0.4, no fog | 578 | approved, struck a3, drum reads thin | stalactite underside
