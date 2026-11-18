# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
594 | 4612ee6b | map.dynasty.b1 | approve, struck b1
594 | a41b2f35, b4c03bd0 (+64abe9e0) | map.fantasy_evil.b3, a5 | approve; struck b3, a5 no strike (statue off the ground shot)
594 | b993ae0a, 7b828924 | map.fantasy_good.b3, a5 | approve, struck both
594 | 29222f58 | map.pirate.a2 | reject, reverted b4a3cdd9 (transom faces +-x, unseen)
594 | db5cd84b | map.spooky_2.b1 | approve, no strike (terraces clause cleared)
593 | 738ad5c3 (+evidence 5848b4ac) | map.high_ground.a1 | approve, struck a1 (a PASS); b2 wall-top clause struck; CONFIRM passed a, b
593 | 1f3aa7be, 4b047cbf (+9319c5b6) | map.fantasy_good.b4, a2 | approve, struck b4, a2, a6
593 | c6dfd275 (+0a50ce06) | map.pirate.a2 | approve, struck a1 (bow cleared; stern left)
593 | 18fff580, a0acf189 | map.fantasy_evil.b4, a3 | approve, struck both
593 | 0097f9bc, 84011b8a | map.dynasty.a2, map.spooky_2.a5 | approve; dyn no strike (side legs hidden), sp struck a5
592 | 52bed45f, 9dcd3891, 395d7f38 | map.low_ground.a1, map.defend_the_castle.b1, a1 | approve, struck all; CONFIRM -> both D
592 | af385087 | map.pirate.b3 | approve, struck b3; CONFIRM failed a (hulls, rim), b (ships per team)
592 | e1ab8d1b (+feb60ff9), 0ee4c12c | map.fantasy_good.b2, map.fantasy_evil.b1 | approve, struck fg b2+b6, fe b1
592 | 60051560 | map.high_ground.b2 | approve, no strike (attempt 2); CONFIRM failed a (gate block)
592 | 4bbcf13d, 66229760 | map.spooky_2.b1 (loop clause), map.dynasty.a2 | approve, struck sp b1 clause; dyn a2 no strike (trees on the loop)
591 | eadae3e9, dd6f6429 | map.hill.a4 (+5 kit maps a5), map.simulation.a3 | approve, struck all six a5/a4 and sim a3 (skies untoned)
591 | e417622a | map.defend_the_castle.b3 | approve, struck b3; CONFIRM failed a (merlons), b (chasms read as steps)
591 | 7abd9cdd (+evidence 336cbba3) | map.high_ground.b2 | approve, no strike
591 | 15ca3a31, 21913c7f | map.fantasy_evil.a2, map.fantasy_good.a1 | approve, struck both
591 | c8082cb0 (+51f659a2, f37f2aeb) | map.low_ground.a (bank tone) | dropped, reverted (unlit sheet rendered lighter than the flats)
590 | e8ee5a82, bbb9869d | map.hill.a3, map.high_ground.a4 | approve, struck both (simKit cloudBanks in the island band)
590 | 5f1ae860 | map.defend_the_castle.b2 | approve, struck b2
590 | b1715d8e | map.high_ground.b3 | approve, struck b3
590 | 19067a56 (+bb704a1c) | map.spooky_2.a6 | approve, struck a6
590 | 9bfb373f | map.fantasy_evil.a1 | approve, struck a1

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584): rows (outlines, rings, crops, cliffs, skies, set pieces) all approved; see git log `loop(5xx)` for values.
wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
web/src/map/tabs/dynasty.ts:PAGODA and sideBridges | (0,19) platform 15, 8-step stair to z 7 (north approach dropped), collider z 7..26.5; bridges x +-12.5 z 7..18.2 .97->2.52 m + .8 arch; back pool x -19.6..16, hazard cut under bridges | 594 | approve, struck b1 | 576: (17,37) platform 17
web/src/map/tabs/fantasy_evil.ts:shrine and chainedStatue | ring r 6.2 x 4.5 m, 16 segs (+-x open), dais .8, pillars+spikes; altar (0,12) blue disc/crystals; base voids + plank gone. Statue (8,26) 12 m winged, spire (36,40) 40 m lean .3, chains torus 1.3/.34 (.22,.24,.27); out of glow; seams bed unlit (.012,.018,.022) | 594 | approve (b3 struck; a5 no strike) | void disc r 10 + plank
web/src/map/tabs/fantasy_good.ts:gateTowers and heavenSky | towers (+-40,30) legs 6 m x 19 m, gap 6, arch 12.5-17.5, gold bands/merlons, glass (1,.9,.6), water (.3,.7,1.1) down outer face, spire+ring; sky paleSky (112,182,228)/(198,224,240) .3, 5 cloudBanks z 90-230 | 594 | approve, struck b3, a5 | base haze + range
web/src/map/tabs/spooky_2.ts:terraces | middle |z| .8..6.4 h .7, outer 18.6..29.5 h 1.6, x 9/4..27.6 + 32.4..41/40; stone (.17,.21,.31) self .35, turf (.09,.12,.21); .35 m treads inward; props lifted | 594 | approve, no strike | flat turf
web/src/map/tabs/pirate.ts:stern transom | 594 [S] raked .2 slab, gold frame, 2 window rows (.62,.8,1.05): rejected, reverted (faces +-x, unseen) | 594 | reject | 586 three box tiers kept
web/src/map/tabs/high_ground.ts:gateBlock | x 27..37 |z|<=5.5 from 4.5 to 11.5 m over the platform, crown .5 m proud; drawn only | 593 | approve, struck a1 | bar |z|<=5 4.5..7 m
web/src/map/tabs/fantasy_good.ts:openCentre and parapets | temple boxes + collider hidden; gold ring 8.5 m, star 2x4.2 m boxes; ring trunks + hazeTreeline hidden, wall .8x1.2 m, merlons 1.2x.7 m every 2.4 m, drawn only | 593 | approve, struck b4, a2, a6 | base temple, tree ring
web/src/map/tabs/fantasy_evil.ts:chasms and rockRing | crevices 4 m: front z -10..-6 |x|<=28 gaps |x| 10..14, sides |x| 24..28 z 8..44, void hazards, glow (.15,.9,.2) unlit out of glow; clumps 2-3 pentagonal prisms 4-10 m, every 4th a broken pillar, (.09,.12,.14) | 593 | approve, struck b4, a3 (columns read near-black) | tree ring
web/src/map/tabs/dynasty.ts:clearLoop | ring trunks within 4.6 m of the loop line set back to 4.6 m on their side, colliders moved | 593 | approve, no strike (side legs still hidden) | trees on the loop
web/src/map/tabs/spooky_2.ts:deadPropTrees | "_tree_canopy" + "_cyl" hidden, 7 m black dead tree (spooky2DeadBark) | 593 | approve, struck a5 | round crown tree
web/src/map/tabs/fantasy_good.ts:pits | x 6..30 z 9..30 mirrored, 10 m deep, white walls .6 m, floor (.24,.3,.42) self (.06,.08,.12), gold kerb .6 m, 2 teal trees + spire/halo each; deck top split, rim body 12 m; base pools, islandUnder/Shelf hidden | 592 | approve, struck b2, b6 (floors read bright) | flat deck
web/src/map/tabs/fantasy_evil.ts:plateau | |x|<=24 z -6..34 at 3 m, 0.75 m per 2 m block outward; height field fantasyEvilHeight; props seated | 592 | approve, struck b1 (even ziggurat) | flat
web/src/map/tabs/spooky_2.ts:cobbleLoop | ribbon 5.5 m on loop x+-44 z+-38 (notch), 3 Chaikin passes, cobbles (96,106,140) joints (28,32,50), self (.12,.13,.19) | 592 | approve, struck b1 loop clause (near-ellipse) | 578: 3.5 m boxes darkened to turf
web/src/map/tabs/fantasy_evil.ts:basaltFloor | 2 m blocks 1.85 m, tops .02-.22, superellipse 53x47 p3; diffuse (.13,.2,.22) self (.025,.04,.045), tone +-12%; seams (.02,.03,.035) | 591 | approve, struck a2 (seams read lilac) | base maroon lawn
web/src/map/tabs/fantasy_good.ts:marbleDeck | 104 x 80 deck 4 m deep, 1 x .5 m running-bond pavers (236,240,244), 7% teal, seams (196,208,220); gold kerb .7 x .35 (.78,.62,.1) self (.22,.17,.02) | 591 | approve, struck a1 (bond/teal not visible) | base sage lawn
web/src/map/tabs/pirate.ts:deckHeight and rails | deck y 3.6 inside |x|<=14.6, plank height 4.15 m falling over 12.5 m; hull box collider split into seaward/end rails and beach rails with 3.6 m mouths at u -9, 0, 9 | 587 | approve, struck b5 | one hull box collider
web/src/map/tabs/pirate.ts:hourglassBeach base hidden | sandSpit, sandWet, seaShore, fieldBlades_*, grassTuft, Pirate Cove_waterfall hidden; trunk/bush/prop roots past the outline + 1 m pruned | 587 | approve, no strike | base oval shown over the hourglass
web/src/map/tabs/spooky_2.ts:thornThickets | x +-44, 30 vines 7-10 m, 6 segments, root .95, tilt .05-.25 + .2-.38/joint, navy (.1,.11,.19) self .3; collider 3.5 x 7 | 587 | approve, no strike | absent
web/src/map/tabs/spooky_2.ts:darkTorii | (-40,33), posts 7.2 m 5.6 apart, kasagi 9.6 m swept, stone (.2,.21,.28) self .35, 6 m clearing | 587 | approve, struck a7 | absent
web/src/map/tabs/simKit.ts:cloudBanks (high_ground) | banks [x,y,z,w] at z 200-240, y -22..-12, w 120-190; puffs scale (1.2,.62,.45), crown row; 591: untoned (196,208,220) -> (246,248,250) (was code (.8,.87,.93) -> white, read grey), unlit, out of glow | 591 | approve, struck hill a3, high_ground a4 (read flat light grey) | 589: z 450-540 y 40-80 (out of frame)
web/src/map/tabs/high_ground.ts:wallRamps and wallTops | ramps x 48 -> 36 at |z| 8..17, rise 7 m; wall tops standable 19 m (strict 28<x<36, 5<|z|<20), sheet step 1 m; face colliders .8 m, ramp sides x 36..44; team-1 zones x 28..48 over right then left wall | 592 | approve, no strike (3 units on a wall at 5 s) | 591: zone x 28..36 right wall only; 590: ramps only
web/src/map/tabs/spooky_2.ts:rockSkirt | 4 courses icosphere boulders r 3-6.5 (x1.25 front corners), tops -0.3-6k, diffuse (.3,.34,.48) self (.07,.08,.11), out of glow; base underside hidden | 590 | approve, struck a6 (reads royal blue, even band) | base stalactite slab
web/src/map/tabs/fantasy_evil.ts:voidSky | dome, cloud*, mountain* hidden; clear/fog (.02,.012,.035) | 590 | approve, struck a1 | base mauve daylight sky
web/src/map/tabs/simKit.ts:paleSky + untoned (every kit map) | untoned sRGB targets: blue (186,207,210), haze (216,228,227), span .15; untoned() inverts exposure 1.05, ACES, gamma, contrast 1.1 (code^2.2 decode first) | 591 | [S] approve, struck a5 on hill (a4), bridge, corridor, low_ground, castle, high_ground | 589: code (.38,.68,.76) haze (.74,.93,.97) (rendered teal (82,156,172))
web/src/map/tabs/high_ground.ts:sheet and gate | sheet x -60..48 |z|<=22, ramp -24..10 to 12 m; walls x 28..36 |z| 5..20 +7 m, bar |z|<=5 +4.5..7 | 589 | approve, struck b1, a1-a3 | bare plane
web/src/map/tabs/simKit.ts:gridMaterial/gridBlock/voidAround | 1 m grid tile per 5 m uv, planar uvs per face; blocks 400 m deep; void box hazards x +-90 z +-60 | 588 | approve | bare plane
web/src/map/tabs/dynasty.ts:canalPools | water kept back x -19.6..3, 31..36.6, front -36.6..-31, -3..19.6; dry lawn blocks 0.85 m elsewhere | 588 | approve, struck b3 | two full 92 m canal sheets
web/src/map/tabs/dynasty.ts:columnCliffs | continuous 5-sided columns h7.5..12.5m, square/notched rim, green ledges | 582 | approve | hanging stalactite underside
web/src/map/tabs/dynasty.ts:canalSpurs | four 4.4 m spurs x34/-17 (back) -34/17 (front), |z|17.6..27, outer lawn and canal wall split, 3 m dry crossing | 583 | approve, no strike | absent
web/src/map/tabs/dynasty.ts:terraceBranches | side channels x+-42; flights x+-27: flat deck |z|7..13 at .97, ten .5 m treads to the outer lawn, stepped cheeks | 583 | approve, struck b5 | 582 (rejected-kept): twelve .046 m steps z7..18
web/src/map/tabs/dynasty.ts:lawnTerraces outer h | 2.4 m | 583 | approve (in scope of the stairs; no [P] re-tune) | 1.4 (581)
web/src/map/tabs/dynasty.ts:perimeterFlagstones | 5 m cobble ribbon, route x .88 (corners x+-40 z+-31), 3 Chaikin passes, rides terrace height; cobbles (176,180,182) joints (112,118,124) | 592 | approve, no strike (ring trees stand on it) | 582: three rows .82 m dark slate flags at x+-46 z+-35
web/src/map/tabs/pirate.ts:hourglassBeach | 12 stations, points (-61,3) and (61,2), +x half narrows 24@23 -> 20@38 -> 12@50; waist 21 at x9 | 592 | approve, struck b3 | 582: 10 stations, blunt ends (-58,7)/(56,10), +x swelled to 31
web/src/map/tabs/pirate.ts:goldenSand | beach diffuse (.82,.56,.2) self (.3,.18,.04) out of glow; ripple V strokes .22 m, kink .25-.8 m, lines 1.3-2.1 m apart, (.62,.44,.2) self (.2,.13,.05) | 586 | approve, struck a5 | 586.5: (.8,.6,.3)/(.3,.21,.09), regular 1.6 m chevron grid; earlier base ground material
web/src/map/tabs/pirate.ts:galleons | 593: hull lofted shell u -13..15 (superellipse 2.6, bow quarter-ellipse from u 3, keel rises forward, raked aft), bands for strakes/sheer/wale, hull (.24,.11,.04) self .14, two-sided lighting: approve, struck a1 (stern still boxes) | 593 | approve | 586: four tapered hull courses (.62..1 beam), hull (.36,.21,.1) self .45, strakes, gold sheer rails, forecastle, stern castle 8/6/4.2 m with windows, masts 19/23/17 with three yards 13/10.5/7.5 m, rolls 1.15 m, shrouds; dark solids in the glow pass | 586 | approve, struck a1 | 576: box hull (.45,.26,.13), full-width gold slabs, two yards, masts 17/20/15
web/src/map/tabs/pirate.ts:gangplanks | 3.2 m x 12.5 m run, fanned, cream deck mat | 585 | approve, struck b2 | 576: 1.6 m x 6.2 m planks into the water
web/src/map/tabs/pirate.ts:bellMountain | (34,38), 4 boulder tiers to 19 m, rock (.64,.5,.31), caps on every upper boulder, fall on -z face, 6 m bell in a 13 m A-frame | 584 | approve, struck a2 | 583: (60,0), rock (.5,.43,.32), 3.2 m bell
web/src/map/tabs/*:skies 585 | pirate tropicSky (.55,.84,.93): backdrop sphere, range hidden; pirate hazeTreeline hidden + 6 crates | 585 | approve, struck pir a4, a6 | dome + range
web/src/map/tabs/spooky_2.ts:channelBridges | stone 4.4 m at x +-30, half 7, rise 3, stone (.2,.21,.28) self .35, dark opening 3.2x2.4 m; timber 5 m at x 0, deck 1 m | 586 | approve, struck b2 | 585: x +-44, rise 1.4, stone (.4,.45,.6)
web/src/map/tabs/spooky_2.ts:blackTrees | every ring "trunk" hidden, 3 of 4 spots get a black tree 6-9.5 m (root 1.6), bark (.035,.035,.055), 32-bit merge | 586 | approve, no strike | base round-crowned ring trees
web/src/map/tabs/pirate.ts:pirateGalleonStern | hull (0.45,0.26,0.13) self 0.42 (kept) | 577 | rejected, reverted (P attempt 1: (0.2,0.11,0.055) self 0.3 did not show; gold cap slabs cover the tops) | -
web/src/map/tabs/pirate.ts:drainLagoon | z +-24 water hazards and sheets removed | 577 | approved | two water bands
web/src/map/tabs/spooky_2.ts:nightSky and nightTurf | navy (0.025,0.04,0.12), hemi 0.3 dir 0.65; turf (0.09,0.12,0.21), stone (0.17,0.21,0.31), cone tufts | 579 | approve | day sky, maroon/green floor, pale kerbs
web/src/map/tabs/spooky_2.ts:gratedCourt | 15 m flush court, 7 m ember plate (1.6,.5,.06) in the glow, 9 flat bars each way .22 m x 4 cm, kerb lanterns, no colliders | 584 | approve, struck b3 | 579: .2 m bars hid the bed (dropped)
web/src/map/tabs/dynasty.ts:gardenCanals | 92 x 10 m stone-lined turquoise sheets with lily pads | 579 | approve | grey-olive overlays
web/src/map/tabs/dynasty.ts:rimTorii | (-43,28), (40,-33), yaw 0, post colliders moved | 579 | approve | (-17,25), yaw 0.35
web/src/map/tabs/dynasty.ts:mintSky | clear (0.68,0.86,0.74), fog (0.76,0.9,0.8), mountain* hidden | 577 | approved | inherited (0.72,0.76,0.66) with range
web/src/map/tabs/dynasty.ts:squareIsland | superellipse 54 x 48 power 8, notch x < -36 and z < -30, zone slabs hidden | 577 | approved | power 3 rounded oval
web/src/map/tabs/dynasty.ts:lawnTerraces | eight green lawn blocks h.85/1.4 m, stone faces and offset flagstone edges, draw height | 581 | approve | olive-brown flat floor
web/src/map/tabs/dynasty.ts:courtApproaches | N/S spans7..17 E/W7..10, four curved decks and six-step approaches each end, draw height | 581 | approve | incomplete ring approaches
web/src/map/tabs/dynasty.ts:courtyard | court |x|,|z| <= 7, pave (0.4,0.41,0.4) self 0.2; pit box half 3; E/W moats |x| 7..10 water hazards | 578 | approved, no strike | pit cyl r 5; pave (0.62,0.62,0.58) self 0.4 (too white)
web/src/map/tabs/spooky_2.ts:squareIsland and fogChannels | power 8, notch x > 36 z > 30; fog z +-12 drawn only | 578 | approved, no strike, kerbs/path glow | base oval
web/src/map/tabs/spooky_2.ts:pumpkinShrine | (14,38), 16 m mound, trunks 1.7 m | 585 | approve, no strike (mound dark, trees thin) | 584: (-17,-38), 13 m mound
web/src/map/tabs/pirate.ts:sandIsland | sea ring 62 x 56 (0.2,0.8,0.75); drum 64 x 58, 6 m + belly 14 m (0.72,0.52,0.28) self 0.4, no fog | 578 | approved, struck a3, drum reads thin | stalactite underside
