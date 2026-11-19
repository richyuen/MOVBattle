# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
611 | [S] 9abb8611 | dynasty.area_of_effect.b1 | approve,struck1-5 (before the massif, Stoner V); CONFIRM -> D
611 | [S] 034b8c68 | dynasty.viking_army.b1 | approve,struck1-4 (two Berserker groups, Jarls in the gap, ship behind each); CONFIRM -> D
611 | [S] f8dcc5b9 | dynasty.zeus_and_other_folks.b1 | approve,struck1-3 (3x2 shield block); b4 building at the back left
611 | [S] 6faa88dd | dynasty.catapults.b1 | approve,no strike (echelon receding left, not yet touching)
611 | [S] ac07417e+71cdb10a | dynasty.samurai.b1 | approve,struck1-3 (3:3 round the Monk, flank groups); b4 path left
611 | [S] 611.6/6b/6c reverted | dynasty.art_of_war.b1 | dropped (outside team-1 zone, then a Ninja in the canal spur)
610 | [S] e19bf480 | challenge.twin_lords.b1 | approve,struck1-6 (under the castle wall, re-laid); CONFIRM -> D
610 | [S] e3db6089 | challenge.zeus.b5 | approve,struck5 (phalanx 48 deg)
610 | [S] 6e6423a2 | challenge.zeus.b3 | approve,struck3 (Hoplites hinged back); [P] 05b84fcd spacing 0.98 m struck1; CONFIRM -> D
610 | [S] 3348b58f+1cb4aa72+579db65e | challenge.a_warm_welcome.b1 | approve,struck1-6 (drawn boulder cave welcomeCave); CONFIRM -> D
609 | [S] 08421589+c3b30ff4 | adventure.tree_mammoths.b1 | approve,struck1 (perch crowns, stagePresentation PERCHES); CONFIRM -> D
609 | [S] ff209a0c+093c86aa | adventure.tree_tribe.b1 | approve,struck1 (one man to a perch crown, 3 rows on enemy arc); CONFIRM -> D
609 | [S] 55676eea | adventure.sneaky_tribe.b1 | approve,struck1 (drawn rock cave, 6x6 inside); CONFIRM -> D
609 | [S] fceec30c | challenge.ice_archer_and_friends.b1 | approve,struck1-4 (five groups, archer arrow); CONFIRM -> D
609 | [S] 4e382b32+29e3a14d | challenge.zeus.b4 | approve,struck2,4 (slanted phalanx ~23 deg, Zeus centre); b1,3,5 left
609 | [S] aaf6e1bf | challenge.big_brawl.b1 | approve,struck1-7 (Brawler V, Longship back centre); CONFIRM -> D
609 | [S] 3dc7a176 | challenge.knights_and_priests.b1 | approve,struck1-3 (under the castle wall, Knight arrow); CONFIRM -> D
608 | [R] cff61026 | map.fantasy_good.a2 | approve,struck2 (field-side gate sheets into deck channels, gates out of glow); CONFIRM 606 a -> D
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

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584), wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592), high_ground (589-599), pirate (576-602), dynasty (576-603), spooky_2 (578-604), fantasy_evil (590-605), fantasy_good (587-608): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
web/src/campaign/stagePresentation.ts:tiniestSummit | stage-only18x16m hill(20,-9.9),crest6.5,height+cleanup | 601 | approvec283afb0 | flat Farmer
web/src/campaign/stagePresentation.ts:rider | head xz,head/crest maxY+.08,seated joints,restore before sim | 601 | approvea744ccde,c0d6c20a,799d316d | torso-local anchors hidden;flat Halfling
web/src/campaign/stagePresentation.ts:wheelbarrowArchCrown; stages/adventure.ts:wheelbarrow | cap(1.2,7.15,10)8x.5x3.6 top7.4,cart+crew lift;actor(2.6,10) | 601 | approve5f92ad8a | absent cap/lift;actor(29,0)
loop/scripts/capture-world.mjs:fantasyEvil poses, pirate army | island targety16 radius230, top targety12 radius160; Pirate stage army targety8.2 | 600 | evidence685f65a9,ce687e96 validated | Evil island targety8 radius200, top default; Pirate army targety1
web/src/campaign/stages/adventure.ts:a_fierce_rider | Mammoth leaderx2,z0, wingsx3.5,z+-4.6, rearx7,z-5.6/0/5.6; Halfling unchanged | 600 | approve d4289c91, struck b1 | Mammoths line atx2,z-12..8 step4
web/src/campaign/stages/adventure.ts:the_tiniest_attack | 15upper+16lower irregular crop pockets x9..41,z-25..17; two obstacle clearances; Farmer unchanged | 600 | approve ffe2e899,defaf4dd, struck b2 | Halflings regular ranks x20/22.2/24.4,z+-9.9
loop/scripts/capture-world.mjs:evidence poses | gate runtimeId departure at20ms, radius32; Basic army beta.24/field.2; Evil island targety8; Good island220/y8, top165/y8 | 599 | evidence validated; High b CONFIRM | gate attacker never arrived; Basic .77/.72; island200/y-10, top135/y0
web/src/map/tabs/ancient_1.ts:street placement zones | append4m street strips x+-(2..25), z+-10; original plazas first | 599 | stage/play PASS, formation CONFIRM D | plazas x+-(25..55) only
web/src/map/tabs/viking.ts:innerIce zones | append x+-(1..27), z+-20; original outer zones first | 599 | stage/play PASS, formation CONFIRM D | inherited Challenge x+-(27..61) only
web/src/campaign/stages/introduction.ts:all6 stages | approved + CONFIRMed D597-599; final formations in source/git loop(597..599); rows compacted | 599 | approve | scaffold rows
web/src/map/tabs/simKit.ts:paleSky/untoned, cloudBanks, gridMaterial | sky untoned (186,207,210)/(216,228,227); banks z 200-240 y -22..-12 untoned white; 1 m grid tiles | 591 | approve (588-591) | teal sky, banks out of frame
