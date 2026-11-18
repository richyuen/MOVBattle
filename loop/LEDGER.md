# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
588 | 334b790d | map.dynasty.b3 | approve, struck b3 (critic b PASS); CONFIRM failed a, b (new lists)
588 | fded3015, fdee4e69 | map.bridge.b1, a3 | approve, struck b1, b3, a1, a2, a4
588 | c20c50bb, 5e870bb6 | map.corridor.b2, a4 | approve, struck b1-b3 (b PASS), a1-a3
588 | ae6ad36b, 98ebf959 | map.low_ground.b1, a4 | approve, struck b1-b3 (b PASS), a1-a3
588 | ec25b08c, 1eb72e07 (+cfd5d291) | map.hill.b2, a1 | approve, struck b2, b3, a2
587 | 7542093c (+80297d4f) [R] | map.spooky_1.a1-3 | approve, struck a1, a2, a3; CONFIRM a PASS -> D
587 | 22ba62eb (+evidence fc94485f), 4ace43d4 | map.pirate.b5, b3 | approve, struck b5; b3 no strike; early CONFIRM unused (b FAIL)
587 | cb026095 (+858d6a2e, 95f26b5d) | map.spooky_2.a3 | approve, no strike (thickets not legible from the top)
587 | 76101bad (+7189ff78, 9ad673bd) | map.spooky_2.a7 | approve, struck a7
587 | b23e942c, 9fed27e5 (+40c4de96), bafe8f20 | map.simulation.a1, a2, a3 | approve, struck a1, a4, a2, a5
586 | f70a3686 [R] | map.wild_west.a1,a2 | approve, struck a1, a2; CONFIRM a PASS -> D
586 | 1932bf22 | map.ancient_2.a3 | approve, struck a3; CONFIRM -> D
586 | 531d6ed4, 36ee3119 | map.renaissance.a5, a3 | approve, struck a5, a3; CONFIRM a, b PASS -> D
586 | 05e50f52 (+bb77a558), f49048a8 (+f3ee1295) | map.pirate.a5, a1 | approve, struck a5, a1 (critic a PASS)
586 | 6afd6a09 | map.spooky_2.b2 | approve, struck b2
586 | 974a3c2d | map.spooky_2.a5 | approve, no strike (one round tree left)
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

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584): rows (outlines, rings, crops, cliffs, skies, set pieces) all approved; see git log `loop(5xx)` for values.
wild_west (576-586): town rows/storefronts/inner rank, sand street, round plaza, desert rim, mesas, arches, chapel, sandstone base, sunset backdrop sphere (peach (1,.55,.28) to cream (1,.9,.6)); town dark solids in the glow pass. ancient_2 (565-586): round rim, lawn, ring wall, drum, propylon, pavilions, terraced mound + six temple towers (dark stone (.58,.53,.44)). renaissance (576-586): palace + arcade, rectangular piazza, front terrace, canal, corner palazzo, covered bridge, plinth, haze sky, facade kit, flagstone checker (four shades ~(.72,.62,.45), pale bed). All approved and CONFIRMed. spooky_1 (576-587): night sky, night grass/dusky meadow blades, fog chasm, dead trees, rock cliffs (inset skirt, stepped masses), graveyard, rim offerings, left descent, rim set pieces (watchtower (33,33.5) 13 m dark stone with 11 lit windows; broken grey pillar (47,7) 10.5 m; base "hill" mounds hidden; pumpkin bodies out of glow).

## Tuned values
web/src/map/tabs/pirate.ts:deckHeight and rails | deck y 3.6 inside |x|<=14.6, plank height 4.15 m falling over 12.5 m; hull box collider split into seaward/end rails and beach rails with 3.6 m mouths at u -9, 0, 9 | 587 | approve, struck b5 | one hull box collider
web/src/map/tabs/pirate.ts:hourglassBeach base hidden | sandSpit, sandWet, seaShore, fieldBlades_*, grassTuft, Pirate Cove_waterfall hidden; trunk/bush/prop roots past the outline + 1 m pruned | 587 | approve, no strike | base oval shown over the hourglass
web/src/map/tabs/spooky_2.ts:thornThickets | x +-44, 30 vines 7-10 m, 6 segments, root .95, tilt .05-.25 + .2-.38/joint, navy (.1,.11,.19) self .3; collider 3.5 x 7 | 587 | approve, no strike | absent
web/src/map/tabs/spooky_2.ts:darkTorii | (-40,33), posts 7.2 m 5.6 apart, kasagi 9.6 m swept, stone (.2,.21,.28) self .35, 6 m clearing | 587 | approve, struck a7 | absent
web/src/map/tabs/simulation.ts:gridFloor | 5 m tile 512 px, base (228,222,212), 1 m lines (190,186,182) 2 px, 5 m (172,168,165) 3 px, self (.18,.17,.16); base "ground" hidden | 587 | approve, struck a1, a4 | base lilac lawn
web/src/map/tabs/simulation.ts:emptyCentre | centerGrass hidden, centre void hazard (r 8) and its overlay removed | 587 | approve, struck a2 | void disc at origin
web/src/map/tabs/simulation.ts:paleSky | backdrop sphere blue (.38,.68,.76) to haze (.86,.9,.9) smoothstep over up .57, fog = haze, dome off | 588 | [P] 1 rejected (blue (.62,.86,.93) span .4: paler, not cyan; island shot sees only haze); value kept | grey skyDome
web/src/map/tabs/simKit.ts:paleSky (bridge, corridor, low_ground, hill) | defaults as simulation.ts: blue (.38,.68,.76), haze (.86,.9,.9), span .57 | 588 | approve, no strike (reads neutral grey) | base grey skyDome
web/src/map/tabs/simKit.ts:gridMaterial/gridBlock/voidAround | 1 m grid tile per 5 m uv, planar uvs per face; blocks 400 m deep; void box hazards x +-90 z +-60 | 588 | approve | bare plane
web/src/map/tabs/bridge.ts:blocks and span | blocks x +-18..64 |z|<=25; span |x|<18 |z|<=2.5 | 588 | approve, struck b1, b3 (span reads short) | bare plane
web/src/map/tabs/corridor.ts:pads, wall, slot | pads x +-8..38 |z|<=15; wall |x|<=8 |z|<=26 top 7; slot |z|<=2 | 588 | approve, b PASS (wall height barely reads from top) | bare plane
web/src/map/tabs/low_ground.ts:trough | slab x +-60 |z|<=22; floor |x|<=10 at 0, banks to 7 m at |x| 20 | 588 | approve, b PASS | bare plane
web/src/map/tabs/hill.ts:ridge | foot -24, 10 m at x 22, crest to 28, 4 m at 40, flat to 76; grid + pale sky | 588 | approve, struck b2, b3, a2 | ramp -8..30 top 8, base plane material
web/src/map/tabs/dynasty.ts:canalPools | water kept back x -19.6..3, 31..36.6, front -36.6..-31, -3..19.6; dry lawn blocks 0.85 m elsewhere | 588 | approve, struck b3 | two full 92 m canal sheets
web/src/map/tabs/dynasty.ts:columnCliffs | continuous 5-sided columns h7.5..12.5m, square/notched rim, green ledges | 582 | approve | hanging stalactite underside
web/src/map/tabs/dynasty.ts:canalSpurs | four 4.4 m spurs x34/-17 (back) -34/17 (front), |z|17.6..27, outer lawn and canal wall split, 3 m dry crossing | 583 | approve, no strike | absent
web/src/map/tabs/dynasty.ts:terraceBranches | side channels x+-42; flights x+-27: flat deck |z|7..13 at .97, ten .5 m treads to the outer lawn, stepped cheeks | 583 | approve, struck b5 | 582 (rejected-kept): twelve .046 m steps z7..18
web/src/map/tabs/dynasty.ts:lawnTerraces outer h | 2.4 m | 583 | approve (in scope of the stairs; no [P] re-tune) | 1.4 (581)
web/src/map/tabs/dynasty.ts:perimeterFlagstones | three-course loop x+-46 z+-35 around notch and existing bridges | 582 | approve | no connected outer path
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
web/src/map/tabs/spooky_2.ts:squareIsland and fogChannels | power 8, notch x > 36 z > 30; fog z +-12 drawn only; loop path x +-44 z +-38 | 578 | approved, no strike, kerbs/path glow | base oval
web/src/map/tabs/spooky_2.ts:pumpkinShrine | (14,38), 16 m mound, trunks 1.7 m | 585 | approve, no strike (mound dark, trees thin) | 584: (-17,-38), 13 m mound
web/src/map/tabs/pirate.ts:sandIsland | sea ring 62 x 56 (0.2,0.8,0.75); drum 64 x 58, 6 m + belly 14 m (0.72,0.52,0.28) self 0.4, no fog | 578 | approved, struck a3, drum reads thin | stalactite underside
