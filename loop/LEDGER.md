# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
600 | [R] f99eb4fd | map.pirate.a1-3 | approve, struck a2,a3; a1 deep hull/nest clauses cleared
600 | 4834759a | map.fantasy_good.a1 | approve, no strike; stub-pillar clause cleared
600 | 79aae0c6 | map.fantasy_good.a2 | approve, struck a2
600 | bb5ee8bb | map.fantasy_evil.b1 | approve, no strike; multiple shelves clause cleared
600 | d0fccfc5 | map.fantasy_evil.a2 | approve, struck a2
600 | ff505e0b, b79bc009 | map.fantasy_evil.a1 | approve, struck a1
600 | d4289c91 | adventure.a_fierce_rider.b1 | approve, struck b1
600 | ffe2e899, defaf4dd | adventure.the_tiniest_attack.b2 | approve, struck b2
599 | 9b680d9d | map.pirate.a2 | approve, struck a2; second failed a/b CONFIRM -> plateau
599 | a144846a, 4ab2e5aa | introduction.basic_formation.b3 | approve, struck b3; CONFIRM PASS -> D
599 | af027c37 | introduction.ice_archers_only_almost.b3 | approve, struck b3; CONFIRM PASS -> D
599 | f749b1d8 | map.fantasy_evil.a6 | approve, struck a6,a5; first CONFIRM a,b FAIL
599 | ab0886e6, e8517b58 | map.fantasy_good.a5 | approve, struck a5
599 | 368eeb98 | map.fantasy_good.b2 | approve, struck b2
599 | 9a80277f | map.fantasy_good.a2 | approve, no strike
599 | e5a967e4 | map.dynasty.a5 | approve, struck a5
599 | 70907ec1 | map.dynasty.a4 | approve, struck a4
598 | [R] d4fd09be | map.spooky_2.b | approve, struck b1 (plateau lifted); b4 corners bevelled
598 | 26e5a09e (+ evidence 598.0 gate shot) | map.high_ground.b2 | approve, struck b2 (b PASS); gate passage draws passers on the crown; CONFIRM599 b PASS -> D
598 | 7decadec, 6f225d65; 023a7c90, aff6a657, e0b923c7; 7e502bad, 2638f64f; edb92610 (+[P] 3ba5d947) | clubs.b2, b1; hay.b3, b1, b2; basic.b1, b2; ice.b3 (b2) | approve all; struck all but ice b3 (width clause); clubs, hay D
597 | [R] 5e04109e | map.dynasty.a | approve, struck a3, a6 (plateau cleared)
597 | 89b4f29e (+4818fb5b); 6bbd3b7d, 10bafbf2, cfe386c3 | map.fantasy_evil.a6; fantasy_good.a4, a3, b2 | approve all; struck a4, a3; a6 rock-mass and b2 ledge clauses cleared
597 | 426bae72; 275c58c7 (+a137190f), e141277b; 2a5b6349, 0ff32508 | introduction.army.b1; longships.b1, b2; ice_archers.b1, b2 | approve all; struck army b2 b3, longships all (D), ice b1
596 | f4eef72d (+990ecde8); [P] da34040c | map.fantasy_evil.a5; a6 | approve, a5 statue clause; [P] reject, reverted ce1a3756
596 | ca380e64, ffb7e7ad (+8e8d3c20) | map.pirate.b2, a3 | approve, struck b2 (b PASS), a3
596 | 24225dd9 (+7e3e49bc), 703a2a26 | map.spooky_2.b4, a3 | approve; b4 no strike (loop corners), struck a3
596 | 2fb7605e, 534e1920 | map.dynasty.a5, a4 | approve, no strike (clauses cleared); a plateau
596 | 65479838, 788ad169 | map.fantasy_good.b1, a6 | approve, struck both
595 | b3ba566f; da55aaca, 27e30aa2, 3b0cd8d4; 3ea9ae23, 79c9305c, d777e226 (+[P] 725faf2f); 1d0481dd; 65195d10 | pirate.b1; fantasy_evil.b2, a4, a6; fantasy_good.b1, b5, a4, a3; spooky_2.b4; dynasty.b2 | approve all; struck all but spooky_2 b4; CONFIRM fantasy_good failed a, b

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584), wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592), high_ground (589-599): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
loop/scripts/capture-world.mjs:fantasyEvil poses, pirate army | island targety16 radius230, top targety12 radius160; Pirate stage army targety8.2 | 600 | evidence685f65a9,ce687e96 validated | Evil island targety8 radius200, top default; Pirate army targety1
web/src/map/tabs/pirate.ts:galleon shell, nests | beam12m hull8m, 3gold strakes, open4.2m nest floors with4m hoops/posts | 600 | approve f99eb4fd [R], a1 clauses cleared, no strike | beam8 hull4.4, 1gold strake, closed1.8m nests
web/src/map/tabs/pirate.ts:shore palms, summitWreck | 15irregular clumps of3..6 palms8..16m, pointed fronds/rosettes; open9m wrecked bow, ribs, mast and grass on summit | 600 | approve f99eb4fd [R], struck a2,a3 | 9clumps of2..4 palms4.5..7.5m; summit bell
web/src/map/tabs/fantasy_good.ts:openArcade | 1.6m rim beam; real5.4m openings/~7m pitch, 1.1x1.3m piers to-12.5, stone arch tubes r.65; basalt12..27m | 600 | approve4834759a, no strike | 12m solid rim with dark arch plates; basalt3..16m
web/src/map/tabs/fantasy_good.ts:gateFacades | lancets10..25.5m, 18mosaic panes/window, pointed gold frame, triple peaked bands31.7..36m on both faces | 600 | approve79aae0c6, struck a2 | rectangular yellow panes with grid and tiny diagonal tips; gate size/spires unchanged
web/src/map/tabs/fantasy_good.ts:frontFallSpill | 2m fall to ledge, spill toz-46.35, 22m opaque drop +6m alpha fade | 600 | approve a44979d1 [P], no strike; spill visible, fade uncredited | continuous30m drop at deck rim through ledge
web/src/map/tabs/fantasy_evil.ts:blockLevel | five clipped shelves: central(0,10)h3, side(+/-37,20/24)h6, front(-12,-29)h3/(20,-31)h4.5; .75m treads/1.5m runs | 600 | approve bb5ee8bb, no strike | one rectangular plateau x+-24,z-6..34,h3 with2m runs
web/src/map/tabs/fantasy_evil.ts:wingedMonument | robe29m at(32,27,38), hoody47, horns/raised arms, angular wings span36m at y31..50 | 600 | approve d0fccfc5, struck a2 | leaning47m tapered slab at(29.5,20.5,35.5); front chains retained
web/src/map/tabs/fantasy_evil.ts:fracturedFloor | shared jittered3m staggered corners, .975 inset fractured plates with2m sides, outward winding, heights follow shelves | 600 | approve ff505e0b,b79bc009, struck a1 | regular2m grid of1.85m square instanced blocks
web/src/campaign/stages/adventure.ts:a_fierce_rider | Mammoth leaderx2,z0, wingsx3.5,z+-4.6, rearx7,z-5.6/0/5.6; Halfling unchanged | 600 | approve d4289c91, struck b1 | Mammoths line atx2,z-12..8 step4
web/src/campaign/stages/adventure.ts:the_tiniest_attack | 15upper+16lower irregular crop pockets x9..41,z-25..17; two obstacle clearances; Farmer unchanged | 600 | approve ffe2e899,defaf4dd, struck b2 | Halflings regular ranks x20/22.2/24.4,z+-9.9
loop/scripts/capture-world.mjs:evidence poses | gate runtimeId departure at20ms, radius32; Basic army beta.24/field.2; Evil island targety8; Good island220/y8, top165/y8 | 599 | evidence validated; High b CONFIRM | gate attacker never arrived; Basic .77/.72; island200/y-10, top135/y0
web/src/map/tabs/pirate.ts:sternGallery | raked .35m, aft beam .68, lofted tiers8/6/4.2m, side/quarter window rows | 599 | approve, struck a2; CONFIRM a/b FAIL -> plateau | three full-beam box tiers
web/src/map/tabs/fantasy_evil.ts:leaningSpire | lone47m tapered slab at(29.5,20.5,35.5), two25-link front chains to statue plinth | 599 | approve, struck a6,a5; CONFIRM a/b FAIL | spire merged into crag, chains behind
web/src/map/tabs/fantasy_good.ts:corruptedPits | black cracked obelisk and 4 groups of3 thorn vines, tops11..13m; r.28..38 | 599 | approve, struck a5 | absent; first vines buried in pits
web/src/map/tabs/fantasy_good.ts:rearJog | x12..28 z32..40 band sheared by6m taper; deck/rim/kerb/parapet/arches and cut colliders | 599 | approve, struck b2 | stepped rear only
web/src/map/tabs/fantasy_good.ts:gateTowers | legs32m, long gridded lancets, 18/11/9m blue crystals, crown32.5m | 599 | approve, no strike (scale/spires clauses) | legs19m, 9m white spike, short windows
web/src/map/tabs/ancient_1.ts:street placement zones | append4m street strips x+-(2..25), z+-10; original plazas first | 599 | stage/play PASS, formation CONFIRM D | plazas x+-(25..55) only
web/src/map/tabs/viking.ts:innerIce zones | append x+-(1..27), z+-20; original outer zones first | 599 | stage/play PASS, formation CONFIRM D | inherited Challenge x+-(27..61) only
web/src/map/tabs/fantasy_evil.ts:STATUE | (18,15) scale 1.05 yaw 1.27 (faces the ground camera), stone self .75, no shadows received; collider cylinder r 3.9 | 596 | approve, a5 statue clause | 594: (8,26) 1x facing -z, self .2, box collider
web/src/map/tabs/fantasy_evil.ts:rockMass | (.09,.12,.14) self (.03,.04,.045); rim links 1.1 m x .28. 596 [P] (.2,.26,.32)/(.07,.09,.11), links 1.6 m: rejected (mass under the slab, unseen) | 596 | reject (attempt 1) | -
web/src/map/tabs/fantasy_evil.ts:STAIRS, greenRim, shrine, chasms, plateau, basaltFloor, voidSky | flights |x| 8..16 z -16..-6 12 treads; rim 112 rocks, green cracks 35%; shrine ring r 6.2 at (0,1), altar (0,12); spire (36,40) 40 m; crevices 4 m glow (.15,.9,.2); plateau 3 m |x|<=24 z -6..34; 2 m basalt blocks (.13,.2,.22); void clear (.02,.012,.035) | 595 | approve (590-595) | tree ring, maroon lawn, mauve sky
web/src/map/tabs/pirate.ts:deck zone + deckHeight castles | team-1 zone x 2..32 z -41..-20 (appended); forecastle u 3..8 +1.4, stern tiers u -13.5..-5.5/-7.5/-9.3 +2.2/+4/+5.4; stage armies on the -z deck x 8..26 | 596 | approve, struck b2 | armies on sand x 29..41.4
web/src/map/tabs/pirate.ts:beachRing | ring 63 x 57 half, 8 m wide, crown y .3 golden sand; side 7 m + belly to -21, (.66,.46,.22) self 1 (596.3b; .45 read chocolate); 9 palm clumps 2-4 palms 4.5-7.5 m | 596 | approve, struck a3 | bare sea disc edge
web/src/map/tabs/pirate.ts:SHIPS, galleons, gangplanks, deckHeight, rails | +z ship x -17 bow 1, -z ship x 17 bow -1; hull loft u -13..15 (.24,.11,.04) self .14; planks 3.2 x 12.5 m fanned; deck y 3.6, rails split at mouths u -9,0,9; stern lofted galleries (599; see sternGallery) | 595 | approve (585-595) | 576 box hulls at x 0
web/src/map/tabs/pirate.ts:hourglassBeach, goldenSand, sandIsland, bellMountain, tropicSky, openShore | 12 stations points (-61,3)/(61,2), waist 21 at x 9; sand (.82,.56,.2) self (.3,.18,.04), ripple Vs; sea ring 62 x 56 (.2,.8,.75); mountain (34,38) 19 m, bell 6 m; sky (.55,.84,.93); haze treeline hidden | 592 | approve (577-592) | base oval, lagoon
web/src/map/tabs/spooky_2.ts:thornThickets | per side 16 lumps r 1.8-3.2 (.055,.06,.1) self .35 + 52 arching vines 3-7 m, rise 2-4.5 m, navy (.1,.11,.19) self .3; collider 3.5 x 7 kept | 596 | approve, struck a3 | 587: 30 upright vines 7-10 m
web/src/map/tabs/spooky_2.ts:squareRingSpot, terraces, deadPropTrees, blackTrees, rockSkirt, channelBridges, gratedCourt, darkTorii, pumpkinShrine, nightSky | ring on power-8 rim; terraces |z| .8..6.4 h .7, 18.6..29.5 h 1.6; dead trees 6-9.5 m bark (.035,.035,.055); skirt 4 courses (.3,.34,.48); bridges x +-30 rise 3; ember court 15 m; torii (-40,33); shrine (14,38) 16 m mound; navy sky | 595 | approve (578-595) | base oval day map
web/src/map/tabs/dynasty.ts:cherryGrove | ten rim trees, trunks9..13m d1.3, crowns r2.3..3.6; original ring colliders replaced | 599 | approve, struck a5 | 597: every4th base tree, trunk5.5..8m, crown r1.4..2.4; colours unchanged
web/src/map/tabs/dynasty.ts:columnCliffs | tilted courses + four 3-boulder headlands r4.6..6.9; stone (.4,.52,.58) self(.18,.24,.27), moss | 599 | approve, struck a4 | 597: regular courses, cobalt (.22,.36,.44), shoulder moss; 596 pale lavender
web/src/map/tabs/dynasty.ts:turf, pagoda, blossomShrubs | turf (.32,.55,.24) self .3; pagoda open frame, red (.82,.1,.3), stone (.34,.4,.46); shrub clumps (.9,.68,.9) self .45 at |z| 19.4 lips and stair cheeks |z| 5.8 (in stage armies) | 597 | approve ([R]) | turf (.12,.38,.14); white walls + lattice
web/src/map/tabs/fantasy_evil.ts:backdropCrag | 26 boulders 3 tiers tops 8/18/30 m x 22..56 z 46..62, (.2,.26,.32) self .35, out of glow; spire re-lit with it; 4 ledge chains (unseen) | 597 | approve | -
web/src/map/tabs/fantasy_good.ts:pitShafts, waterfalls, frontLedge | floor (.08,.1,.16); navy liners; 6-10 hex columns r 1-2.1 tops -1.2..-6.5 (.55,.62,.72) self .3; channels 1.8 m to back pits, 3 front falls 30 m (.25,.62,1.05); ledge z -46..-40 at y -2, stairs x -50, 14 | 597 | approve | -
web/src/campaign/stages/introduction.ts:army | Protectors x20 z+-5.75 step1.15, Clubbers6x5 x22.2..29.4 | 599 | approve [P], CONFIRM D | wall spacing1.8 z+-9 (597)
web/src/campaign/stages/introduction.ts:ice_archers | trios x18.5..22; archers depths28..29.5/33..34.5/39..40.5, z+-19 | 599 | approve, CONFIRM D | 598: trios29..29.5; archers31..36.6
web/src/campaign/stages/introduction.ts:longships | wedge tip x27.2, ships x35.5 | 598 | approve, D597 | scaffold rows
web/src/campaign/stages/introduction.ts:clubs, hay | clubs x37.4..40.8 z-5.9..6.3; hay C x18..25, farmers2x4 x20.4/22.2 | 598 | approve, both D598 | scaffold rows
web/src/campaign/stages/introduction.ts:basic | shields x12/13.8, sarissas15.6/17.4, z+-9.1/10.9, in streets | 599 | approve, CONFIRM D | 598: x27.5..32.9 in east plaza
web/src/map/tabs/spooky_2.ts:CUTS, RIM, OUTLINE, rockSkirt, cobbleLoop | max-norm rim 54 x 48; cuts big (36,30), corners 42/36, mouths 47.5 z 7..17; skirt boulders inset r*1.1+4k, r <= outline dist/1.35; loop steps 39.25/33.25; fog to 47.5 + 2 falling sheets | 598 | approve ([R]) | 596: power-8 rim, notches 44.5/38.5, loop 41.25/35.25
web/src/map/tabs/dynasty.ts:canalOutlets, PAGODA, sideBridges, clearLoop, perimeterFlagstones, canalPools, 577-583 set | outlets x -34, 17 to z -47.6, falls 3.4 x 12 m; pagoda (0,19) platform 15; bridges x +-12.5; loop 5 m cobbles 3 Chaikin passes; trees 4.6 m off the loop; mintSky (.68,.86,.74); lawn terraces .85/2.4 m (outer h never [P]) | 595 | approve (577-595) | base theme
web/src/map/tabs/fantasy_good.ts:PITS | 5 pits: tree x -34..-12 z -32..-12, obelisk 2..12 z -30..-19, open 22..40 z -32..-15, tree -26..-8 z 13..30, obelisk 6..16 z 19..31; 10 m deep, floor (.24,.3,.42) self (.06,.08,.12) | 596 | approve, struck b1 | 592: four x 6..30 z 9..30
web/src/map/tabs/fantasy_good.ts:cleanDeck | boulder/hill/wallStone/pebble/stump/hayBale/Sanctum junk hidden with colliders; 16 inlay patches 4 x 3 x 1 m, ~half teal (.2,.62,.6), some aqua (.45,.78,.76), self .35 | 596 | approve, struck a6 | dressing on the deck
web/src/map/tabs/fantasy_good.ts:EDGE_STEPS, viaductUnderside, sideIslets, gateTowers, openCentre, parapets, marbleDeck, heavenSky | long edges step 4 m at u -36..-20, -4..12, 28..44; arches 4 x 6.5 m every 6 m; 5 islets; towers (+-40,30) legs 6 x 19 m, glass, water; gold ring 8.5 m; merlons every 2.4 m; pavers (236,240,244); sky (112,182,228) | 595 | approve (591-595); [P] eligible to 598: arch heads rotation (PI/2,0,0), columns longer | base temple, tree ring
web/src/map/tabs/simKit.ts:paleSky/untoned, cloudBanks, gridMaterial | sky untoned (186,207,210)/(216,228,227); banks z 200-240 y -22..-12 untoned white; 1 m grid tiles | 591 | approve (588-591) | teal sky, banks out of frame
