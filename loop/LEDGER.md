# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
606 | [R] 57397d50 | map.fantasy_good.b1-2 | approve,struck1,2 (quadrant wells, diagonal gates); CONFIRM a,b PASS
606 | [R] 6d627f50 | map.fantasy_good.a1-2 | approve,struck1 (multi-bay gatehouses)
606 | [R] 9b0909fd | map.fantasy_good.a2 | approve, no strike (fog-off cyan sheets)
606 | [R] 628c2755 | map.fantasy_good.a2 | reject, reverted 639fec40 (curtains read as pale glass in _top)
605 | [R] fc3db046 | map.fantasy_evil.b1 | reject, rejected-kept (revert conflicts); 6 m routes, edge chambers; centre stayed solid
605 | [R] 18965679 | map.fantasy_evil.a1-2 | approve,struck2 (ledge mushroom pads); a1 slab/gate/no-monument clauses cleared
605 | [R] 89f441c4 | map.fantasy_evil.b1 | approve,struck1 (sunken central pit, front/back chambers, 8 m causeways)
605 | [R] 01db5cf0 | map.fantasy_evil.a1 | approve,struck1 (seven slab shrines on plinths, mixed rim masses); CONFIRM a,b PASS -> D
604 | 50cccd39 | map.spooky_2.b4 | approve,struck4 (deck from OUTLINE); CONFIRM a,b PASS -> D
603 | 21d6f4ee | map.dynasty.a2 | approve,struck2 (level loop at grade, notch bridge)
603 | 11e518f9 | map.dynasty.a1 | approve,struck1 (lawn tufts, turf (.4,.6,.33)); CONFIRM a,b PASS -> D
602 | [R] 92afd9c8 | map.pirate.b1 | approve,struck1; critic added b2 (base palms on the turned strip)
602 | 264c9d94,36a587e7 | map.pirate.a1 | approve,struck1; CONFIRM a PASS
602 | c3b103ee | map.pirate.b2 | approve,struck2; CONFIRM b PASS -> D
601 | [R] e0ec78a8 | map.pirate.b1 | reject,reverted d62511b6; R attempt1
601 | 632a9f8c | map.pirate.a1 | approve,no strike
601 | bba97442 | map.spooky_2.a4 | approve,struck4
601 | 9e419281 | map.fantasy_good.a1 | approve,struck1; second CONFIRM a/b FAIL -> plateau
601 | e40ca4f6 | map.fantasy_evil.a3 | approve,struck3; second CONFIRM a/b FAIL -> plateau
601 | 12ddab5e | map.fantasy_evil.b1 | approve,struck1
601 | c283afb0 | adventure.the_tiniest_attack.b1 | approve,struck1; CONFIRM D
601 | a744ccde,c0d6c20a,799d316d | adventure.a_fierce_rider.b2 | approve,struck2; CONFIRM D
601 | 5f92ad8a | adventure.final_destination_wheelbarrow.b1 | approve,struck1; CONFIRM D

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584), wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592), high_ground (589-599), pirate (576-602), dynasty (576-603), spooky_2 (578-604), fantasy_evil (590-605): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
web/src/map/tabs/fantasy_good.ts:viaductUnderside front | z-46.06 crown-3.2/spring-5.9/foot-14.1,5.4m openings/~7m pitch,6m returns | 601 | approve9e419281 | z-40.06 crown-1.6/spring-4.3/foot-12.5 masked by ledge
web/src/campaign/stagePresentation.ts:tiniestSummit | stage-only18x16m hill(20,-9.9),crest6.5,height+cleanup | 601 | approvec283afb0 | flat Farmer
web/src/campaign/stagePresentation.ts:rider | head xz,head/crest maxY+.08,seated joints,restore before sim | 601 | approvea744ccde,c0d6c20a,799d316d | torso-local anchors hidden;flat Halfling
web/src/campaign/stagePresentation.ts:wheelbarrowArchCrown; stages/adventure.ts:wheelbarrow | cap(1.2,7.15,10)8x.5x3.6 top7.4,cart+crew lift;actor(2.6,10) | 601 | approve5f92ad8a | absent cap/lift;actor(29,0)
loop/scripts/capture-world.mjs:fantasyEvil poses, pirate army | island targety16 radius230, top targety12 radius160; Pirate stage army targety8.2 | 600 | evidence685f65a9,ce687e96 validated | Evil island targety8 radius200, top default; Pirate army targety1
web/src/map/tabs/fantasy_good.ts:openArcade | 1.6m rim beam; real5.4m openings/~7m pitch, 1.1x1.3m piers to-12.5, stone arch tubes r.65; basalt12..27m | 600 | approve4834759a, no strike | 12m solid rim with dark arch plates; basalt3..16m
web/src/map/tabs/fantasy_good.ts:gateFacades | lancets10..25.5m, 18mosaic panes/window, pointed gold frame, triple peaked bands31.7..36m on both faces | 600 | approve79aae0c6, struck a2 | rectangular yellow panes with grid and tiny diagonal tips; gate size/spires unchanged
web/src/map/tabs/fantasy_good.ts:frontFallSpill | 2m fall to ledge, spill toz-46.35, 22m opaque drop +6m alpha fade | 600 | approve a44979d1 [P], no strike; spill visible, fade uncredited | continuous30m drop at deck rim through ledge
web/src/campaign/stages/adventure.ts:a_fierce_rider | Mammoth leaderx2,z0, wingsx3.5,z+-4.6, rearx7,z-5.6/0/5.6; Halfling unchanged | 600 | approve d4289c91, struck b1 | Mammoths line atx2,z-12..8 step4
web/src/campaign/stages/adventure.ts:the_tiniest_attack | 15upper+16lower irregular crop pockets x9..41,z-25..17; two obstacle clearances; Farmer unchanged | 600 | approve ffe2e899,defaf4dd, struck b2 | Halflings regular ranks x20/22.2/24.4,z+-9.9
loop/scripts/capture-world.mjs:evidence poses | gate runtimeId departure at20ms, radius32; Basic army beta.24/field.2; Evil island targety8; Good island220/y8, top165/y8 | 599 | evidence validated; High b CONFIRM | gate attacker never arrived; Basic .77/.72; island200/y-10, top135/y0
web/src/map/tabs/fantasy_good.ts:corruptedPits | black cracked obelisk and 4 groups of3 thorn vines, tops11..13m; r.28..38 | 599 | approve, struck a5 | absent; first vines buried in pits
web/src/map/tabs/fantasy_good.ts:rearJog | x12..28 z32..40 band sheared by6m taper; deck/rim/kerb/parapet/arches and cut colliders | 599 | approve, struck b2 | stepped rear only
web/src/map/tabs/ancient_1.ts:street placement zones | append4m street strips x+-(2..25), z+-10; original plazas first | 599 | stage/play PASS, formation CONFIRM D | plazas x+-(25..55) only
web/src/map/tabs/viking.ts:innerIce zones | append x+-(1..27), z+-20; original outer zones first | 599 | stage/play PASS, formation CONFIRM D | inherited Challenge x+-(27..61) only
web/src/map/tabs/fantasy_good.ts:pitShafts, waterfalls, frontLedge | floor (.08,.1,.16); navy liners; 6-10 hex columns r 1-2.1 tops -1.2..-6.5 (.55,.62,.72) self .3; channels 1.8 m to back pits, 3 front falls 30 m (.25,.62,1.05); ledge z -46..-40 at y -2, stairs x -50, 14 | 597 | approve | -
web/src/campaign/stages/introduction.ts:all6 stages | approved + CONFIRMed D597-599; final formations in source/git loop(597..599); rows compacted | 599 | approve | scaffold rows
web/src/map/tabs/fantasy_good.ts:PITS | 5 pits: tree x -34..-12 z -32..-12, obelisk 2..12 z -30..-19, open 22..40 z -32..-15, tree -26..-8 z 13..30, obelisk 6..16 z 19..31; 10 m deep, floor (.24,.3,.42) self (.06,.08,.12) | 596 | approve, struck b1 | 592: four x 6..30 z 9..30
web/src/map/tabs/fantasy_good.ts:cleanDeck | boulder/hill/wallStone/pebble/stump/hayBale/Sanctum junk hidden with colliders; 16 inlay patches 4 x 3 x 1 m, ~half teal (.2,.62,.6), some aqua (.45,.78,.76), self .35 | 596 | approve, struck a6 | dressing on the deck
web/src/map/tabs/fantasy_good.ts:EDGE_STEPS, viaductUnderside, sideIslets, gateTowers, openCentre, parapets, marbleDeck, heavenSky | long edges step 4 m at u -36..-20, -4..12, 28..44; arches 4 x 6.5 m every 6 m; 5 islets; towers (+-40,30) legs 6 x 19 m, glass, water; gold ring 8.5 m; merlons every 2.4 m; pavers (236,240,244); sky (112,182,228) | 595 | approve (591-595); [P] eligible to 598: arch heads rotation (PI/2,0,0), columns longer | base temple, tree ring
web/src/map/tabs/simKit.ts:paleSky/untoned, cloudBanks, gridMaterial | sky untoned (186,207,210)/(216,228,227); banks z 200-240 y -22..-12 untoned white; 1 m grid tiles | 591 | approve (588-591) | teal sky, banks out of frame
