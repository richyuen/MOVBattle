# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
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
575 | 10 commits (viking: D; medieval_2 R: D; ancient_2 x3; ancient_sandbox x2: D; ancient_1 x3) | all approve, 14 struck
576 | 10 commits (ancient_1 x2: D; ancient_2 x2 + P; dynasty, spooky_1, legacy, wild_west, renaissance a; pirate b) | all approve, 9 struck
577 | 6141b061 | map.pirate.b | approve
577 | fc2afb16, 4b99d78f | map.wild_west.b, map.wild_west.a | approve
577 | 1d4cd558 | map.legacy.a | approve
577 | 6259e76b, 479af4ee | map.spooky_1.a, map.spooky_1.b | approve
577 | b1711009, 83c9ca4a | map.dynasty.a, map.dynasty.b | approve
577 | aa80ffb9 | map.renaissance.b | approve
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
web/src/map/tabs/legacy.ts:pineForest | pine 9-14 m per ring trunk + 2 beside, (0.1,0.27,0.12)/(0.15,0.35,0.15) | 576 | approved, too saturated | round leafy ring
web/src/map/tabs/legacy.ts:meadow | floor (0.56,0.64,0.2); clumps 0.8-1.4 x 0.35-0.6 m on 1.1 m grid, (0.62,0.72,0.2)/(0.48,0.6,0.15); zone slabs hidden | 577 | approved | lilac-grey floor
web/src/map/tabs/wild_west.ts:town | 5 back (z 35.5) + 2 front-right (z -35.5) false fronts, board (0.36,0.41,0.53) self-lit 0.5 | 576 | approved, too cornflower | 2 base boxes
web/src/map/tabs/wild_west.ts:openStreet | centre barricade and collider removed | 577 | approved | dark box at (0,0)
web/src/map/tabs/wild_west.ts:desertRim | ~60% saguaro 3-5.5 m, else dead tree 4-6 m; mesas (-36,32) (-30,-36) (38,-32), tiers r 4.5/3.4/2.2, (0.72,0.33,0.18) | 577 | approved | pale leafy ring
web/src/map/tabs/pirate.ts:galleons | 30 m hulls at z +-37 along x, 3 gangplanks each | 576 | approved, sterns cream | base ships at (+-20,20)
web/src/map/tabs/pirate.ts:pirateGalleonStern | hull (0.45,0.26,0.13) self 0.42 (kept) | 577 | rejected, reverted (P attempt 1: (0.2,0.11,0.055) self 0.3 did not show; gold cap slabs cover the tops) | -
web/src/map/tabs/pirate.ts:drainLagoon | z +-24 water hazards and sheets removed | 577 | approved | two water bands
web/src/map/tabs/renaissance.ts:dogesPalace | 36 x 21 m facade, front z 31 | 576 | approved | absent
web/src/map/tabs/renaissance.ts:rectangularPiazza | rows x +-44 (6 m deep, z -28..24), z 31 (|x| 18..40), corners (+-44.5,28); front terrace z -30.5, 5.5 m deep, 2-3 storeys (578); zones |x| <= 43 | 578 | approved, struck b4 | oval townRing; low front wall (577)
web/src/map/tabs/legacy.ts:meadow clump | w 0.35-0.6, h 0.7-1.1 m | 578 | approved, struck a2 | 0.8-1.4 x 0.35-0.6 (577)
web/src/map/tabs/legacy.ts:openGlade and church | barricade (22,0) gone; church nave x -4..10 z 28.5..35.5, tower x -6.5 14 m + spire 9 m, stone (0.24,0.24,0.28) | 578 | approved, struck b5, a3 | base box (-20,20)
web/src/map/tabs/dynasty.ts:courtyard | court |x|,|z| <= 7, pave (0.4,0.41,0.4) self 0.2; pit box half 3; E/W moats |x| 7..10 water hazards | 578 | approved, no strike | pit cyl r 5; pave (0.62,0.62,0.58) self 0.4 (too white)
web/src/map/tabs/spooky_2.ts:squareIsland and fogChannels | power 8, notch x > 36 z > 30; fog z +-12 drawn only; loop path x +-44 z +-38 | 578 | approved, no strike, kerbs/path glow | base oval
web/src/map/tabs/spooky_1.ts:deadTrees and graveyard | bark (0.07,0.07,0.11); plot x 13..31 z 13..29, 24 stones | 578 | approved, struck a3, b2 | ring crowns; base tombs both halves
web/src/map/tabs/pirate.ts:sandIsland | sea ring 62 x 56 (0.2,0.8,0.75); drum 64 x 58, 6 m + belly 14 m (0.72,0.52,0.28) self 0.4, no fog | 578 | approved, struck a3, drum reads thin | stalactite underside
web/src/map/tabs/wild_west.ts:sunsetSky | clear (0.95,0.66,0.44), fog (0.97,0.72,0.5); dir (-0.9,-0.3,0.32) 1.1 warm; sun disc 22 m | 578 | approved, struck a4 | beige-grey with range
