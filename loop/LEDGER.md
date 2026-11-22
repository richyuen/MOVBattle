# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
624 | [R] 3caf1182+bd2eb57c | wild_west.lone_ranger_and_his_friends.b5 | approve,struck5; CONFIRM624 failed b (QD legs in red mound)
624 | [S] d8f85176 | fantasy_good.clash_of_warriors.b2 | approve,struck2; CONFIRM624 D
624 | [S] 8af831d3 / 9652eeb2 | fantasy_good.chaotic_cavalry.b1 / b2 | approve, no strike / struck3; CONFIRM624 failed b (_army behind parapet)
624 | [S] 7722b347 / 86735c1b | fantasy_good.colossal_spike.b2 / b3 | approve,struck1,2 / 3; CONFIRM624 D
624 | [S] 7d4cd947 / 9ab380dc | fantasy_good.vicious_terror.b1 / b3 | approve,struck1,2 / 3; CONFIRM624 D
624 | [S] f2a5226e | fantasy_good.fortified_formation.b3 | approve,struck3; CONFIRM624 failed b (pair on camera axis)
623 | ev 289dcb2b | legacy.siege.b4; lone_ranger.b5 | approve: siege struck4, CONFIRM D; lone_ranger no strike, CONFIRM failed b
623 | [S] a824f386 | legacy.thor_s_battle.b2 | approve,struck2; CONFIRM623 D
623 | [S] 8c0b838f / 0859d60c / 73019b8f | legacy.a_tank.b1 / b3 / b2 | approve,struck1 / 3,4 / 2
623 | [S] a4edc4b1 / 6b2294ae | fantasy_good.royal_archers.b1 / b2 | approve,struck1 / 2
623 | [S] 4ed57ee6 / d10c25d7 | fantasy_good.fortified_formation.b1 / b2 | approve,struck1 / 2
623 | [S] 6d24fdca | fantasy_good.clash_of_warriors.b1 | approve,struck1,3
622 | [S] 33be5f30+60af33c0 | wild_west.lone_ranger_and_his_friends.b5 | approve, no strike; CONFIRM622 failed b (plateau)
622 | [S] 9f80578c | legacy.the_war.b2 | approve,struck2
622 | [S] dc76524d | legacy.the_war.b1 | approve,struck1; CONFIRM622 D
622 | [S] 99579d89 | legacy.thor_s_battle.b1 | approve,struck1
622 | [S] dd0754c0 | legacy.thor_s_battle.b3 | approve,struck3
622 | [S] 6d13b695 | legacy.thor_s_battle.b2 | approve,struck2; CONFIRM622 reopened 2
622 | [S] a83f7ac8 | legacy.siege.b1 | approve,struck1
622 | [S] 1ba824d1 | legacy.siege.b4 | approve,struck4,5; CONFIRM622 reopened 4 (hidden in _army)
622 | [S] 1ba77b68 | legacy.siege.b2 | approve,struck2,3
621 | [S] 5d526992 | wild_west.leading_cacti.b3 | approve, no strike
621 | [S] c264f57d | wild_west.laughing_knights.b5 | approve,struck2,3,5
621 | [S] 5ccadfa6 | wild_west.lone_ranger_and_his_friends.b2 | approve,struck2
621 | [S] 5239e243 | wild_west.lone_ranger_and_his_friends.b3 | approve,struck3,4
621 | [S] b9af7403 | wild_west.lone_ranger_and_his_friends.b1 | approve,struck1; CONFIRM621 failed b (5 hidden)
621 | [S] 923f743a | wild_west.spooky_army.b1 | approve,struck1,5
621 | [S] 59f6339e | wild_west.spooky_army.b2 | approve,struck2
621 | [S] e180a29d | wild_west.spooky_army.b3 | approve,struck3,4; CONFIRM621 D
620 | [S] 8674b5d5 | simulation.pit.b4 | approve,struck4; CONFIRM620 D
620 | [S] ad0443c7 | wild_west.bullets_and_chains.b3 | approve,struck3
620 | [S] 8ee2b715+c24888e0 | wild_west.bullets_and_chains.b1 | approve,struck1
620 | [S] 1224a336 | wild_west.bullets_and_chains.b2 | approve,struck2
620 | [S] 86f90f10 | wild_west.laughing_knights.b1 | approve,struck1
620 | [S] ff99df57+54fc4f85 | wild_west.shogun_s_samurai.b1 | approve,struck1
620 | [S] d4030188+1b3afdb5 | wild_west.shogun_s_samurai.b2 | approve,struck2
620 | [S] 0f419a14 | wild_west.shogun_s_samurai.b3 | approve,struck3
620 | [S] 9dac8173+155eb43f+29d441ac | wild_west.leading_cacti.b3 | dropped (street props after 2 follow-ups)
619 | [S] 3153a700 | simulation.wall.b1 | approve,struck1
619 | [S] cd82a8b2 | simulation.siege.b1 | approve,struck1
619 | [S] 314b86b2 | simulation.siege.b2 | approve,struck2
619 | [S] fbeb343d | simulation.siege.b3 | approve,struck3
619 | [S] 5ee94eae | simulation.pit.b1 | approve,struck1
619 | [S] 08ce63c5 | simulation.pit.b2 | approve,struck2
619 | [S] 910dcfba | simulation.pit.b3 | approve,struck3
619 | [S] 2bbbde3d | wild_west.leading_cacti.b1 | approve,struck1
619 | [S] 33e6a0ad | wild_west.leading_cacti.b2 | approve,struck2

## Done maps (rows compacted; the maps are D and never tuned again)
Done stages (rows compacted): stages_spooky bone, war, cave, turtle, breakout, plunder (616-618) approved and CONFIRMed; final formations in web/src/campaign/stages/spooky.ts and git log loop(616..618).
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584), wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592), high_ground (589-599), pirate (576-602), dynasty (576-603), spooky_2 (578-604), fantasy_evil (590-605), fantasy_good (587-608): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
web/src/campaign/stages/wild_west.ts:leading lanes; main.ts:checkStage | Cacti x20.8, Miners x23.6/26.4/29.2, z-22.4/-19.4/-16.4/-13.4; zone(24.75,-17.9)11x11 | 621 | approve, no strike | Cacti x28,Miners x31/34/37,z-24..-12 (619)
web/src/campaign/stages/wild_west.ts:laughing column; main.ts:checkStage | bridge column z1: Jesters x-3.6..0.8, Knights3.2, Execs5.8, Healers8.4 (z-0.1/2.1); zone(2,1)14x6 | 621 | approve | diamond(20,0)..(24.4,0), transverse rank x20
loop/scripts/capture-world.mjs:laughing army | beta.7 | 622 | approve, D | beta1.2
web/src/campaign/stages/legacy.ts:the_war | front(8,+-6.5); flanks(24,+-22),(28.6,-27),(28,27) | 622 | approve, D | one row x7,z-10..10
web/src/campaign/stages/legacy.ts:thor | Thor6,0; Peasants x6.4..7.1,z+-3.2..30.4; Pikes x13 | 623 | approve, D | Peasants x8.6..9.4 (622); block x7/9.2/11.4
web/src/campaign/stages/legacy.ts:siege; capture-world.mjs:siege army | simulation.siege placements; _army target y8, beta .8 | 623 | approve, D | lines x20/25/31.5; beta1.2
web/src/campaign/stages/legacy.ts:a_tank | tank14.4,0; bearers14.4,+-5; rollers11.8,+-5; muskets13.6/15.2,+-7,14.4,+-8.6 | 623 | approve, D | bearers7,+-.9; one row x10.7
web/src/campaign/stages/fantasy_good.ts:chaotic; main.ts:checkStage | r12 circle round(-12,2): Tanks -12,14/-10 yaw-90/90; Jousters (-6/-18,12.4/-8.4) | 624 | approve | row x21 z6..18; tanks 27.5,10/14
web/src/campaign/stages/fantasy_good.ts:colossal; main.ts:checkStage | Mammoths -16,-19/-11.5,-19.5 yaw90; Protectors x4.5 z+-2.4/0; Chieftains x6.6 z+-1.2; zone(-14,-19)14x8 | 624 | approve, D | one front row x2 z-12..12
web/src/campaign/stages/fantasy_good.ts:vicious; main.ts:checkStage | Reapers 0,+-6; Candleheads x+-2.2/4 z+-6.3; Archers x+-1.1 |z|10/12.2/14.4; yaw-+45; zone(0,0)10x36 | 624 | approve, D | line x7 z-17.6..18; archers x13.5
web/src/campaign/stages/fantasy_good.ts:royal | Kings x20/23,z+-2.5; Archers m x27..31.5,z+-9 | 623 | approve, D | Kings row x20; Archers row x26.5
web/src/campaign/stages/fantasy_good.ts:fortified | Pike trios r8.5 round(13.5,0); Tanks13.5,+-3.8 yaw0/180; Pharaohs 12.9/14.1,0 yaw0/180 | 624 | approve; CONFIRM failed b3 | pike line x7; tanks x12.9; Pharaohs 9.2,+-.9
web/src/campaign/stages/fantasy_good.ts:clash; stagePresentation.ts:clash | Berserker ring r~9 round(16,0); Valkyries spread, drawn y7-10 | 624 | approve, D | block x29..34; Valkyries ground 13..19,+-3
loop/scripts/capture-world.mjs:lone_ranger army | alpha PI+.6, default radius/beta | 624 | approve | alpha PI+.75, beta1.3, r34 (623); PI, beta1.2
web/src/campaign/stages/wild_west.ts:lone_ranger; main.ts:checkStage | front x24 z16.6..27.4; Guns27.5; Deadeyes30.5,17.5/28.5; Lassos30.5,15/31.2,31; QD33,23; zone(27,23)16x20 | 624 | approve; CONFIRM failed b (QD in red mound) | dz+20 Cacti29,0.. QD34.4,2 (622); z-24..-12 (621)
web/src/campaign/stages/wild_west.ts:spooky_army | Candleheads x7/9,z-2..2; Archers x12/14,z-3..3; Vampires x10/12,z+-7.4/9.2; Reaper32,-3.6; Swordcasters x29.4..29.8,z-1.8..-5.4 | 621 | approve, D | front bar x20, archers x28.7
web/src/campaign/stages/simulation.ts:wall Berserkers; stagePresentation.ts:crownSeats | five per crown x6,z+-4..12,y7; clear departure x10 | 619 | approve | rear pad24.4/26.6
web/src/campaign/stages/simulation.ts:pit Hwachas | x35,z+-11 (Archer line ends) | 620 | approve | x27.4,z+-2
web/src/campaign/stages/wild_west.ts:bullets wings; main.ts:checkStage | Cacti x28.4/29,z+-(15.6..20); BnC x32 z+-16/18/20, x34.5 z+-17/19 | 620 | approve | one block x29/31.2,z-25..-11
web/src/campaign/stages/wild_west.ts:bullets Gunslingers; main.ts:checkStage | x38,z+-1.5; stage zone(38,0)6x18 | 620 | approve | front rank x29,z-17.4/-16.1
web/src/campaign/stages/wild_west.ts:laughing Jesters | diamond (20,0),(22.2,+-2.2),(24.4,0) | 620 | approve | line x20,z-0.9..4.5
web/src/campaign/stages/wild_west.ts:shogun Samurai; main.ts:checkStage | six x25..29,z-5.5/-3.8; eight x24..30,z-19.5/-21; stage zone(27,-13.5)10x29 | 620 | approve | bar x31/33.2,z-6.6..5.8
web/src/campaign/stages/wild_west.ts:shogun Shogun+guards, Giant | Shogun27,-24; guards(25/29,-23.8),(27,-27.2); Giant35,-20.5 | 620 | approve | Shogun34.9,6.4; Giant33.2,4.7
web/src/campaign/stages/simulation.ts:siege Musketeers | four per front wall x37.5,z+-7/10/17/22,y15/18; departure34 | 619 | approve | ground31.5,z+-6.3
web/src/campaign/stages/simulation.ts:siege gate guards | Brawlers26,z+-20/0 trios; Jarls31 | 619 | approve | mixed broad20/25
web/src/campaign/stages/simulation.ts:siege royals; main.ts:checkStage | Kings59,+-19; Fencers57,+-16/18/20/22,y14; courtyard zone36..54 | 619 | approve | mixed front20/25; forecourt only
web/src/campaign/stages/simulation.ts:pit Samurai | x20,z0/+-1.8/+-3.6 | 619 | approve | z-7.2..0
web/src/campaign/stages/simulation.ts:pit Monks | x26,z+-1/3 | 619 | approve | x20,z1.8..7.2
web/src/campaign/stages/simulation.ts:pit Firework Archers | x35,z+-8 step2 | 619 | approve | x23.7,z+-7.2
web/src/campaign/stages/simulation.ts:bridge Jousters | x20.5,z0/+-2.5 | 618 | approve | x22.2,z18/22; x27.2,z0
web/src/campaign/stages/simulation.ts:bridge phalanxes | shields25/31,spears27.2/33.2,z+-3.2 | 618 | approve | mixed wide ranks20/22.2
web/src/campaign/stages/simulation.ts:bridge Archers | x37,z0/+-2/+-4 | 618 | approve | x22.2,z-2..14
web/src/campaign/stages/simulation.ts:hill Monks | x23..58,z+-24 | 618 | approve | x20,z+-9.9
web/src/campaign/stages/simulation.ts:hill Harpooners | x60,z0/+-16 | 618 | approve | x25.9,z0/1.8/3.6
web/src/campaign/stages/simulation.ts:hill Musketeers | x71,z+-23.4,step3.6 | 618 | approve | ranks23.7/25.9,z+-9.9
web/src/campaign/stages/simulation.ts:wall front; main.ts:checkStage | shields x1.8..5,spears6.8..10,z+-1.1; slot enemy zone | 618 | approve | mixed pad ranks20/22.2,z+-9.9
web/src/campaign/stages/simulation.ts:wall reserve | ten x18/20,z0/+-1.6/+-3.2 | 618 | approve | mixed22.2/24.4,z+-9.9
loop/scripts/capture-world.mjs:wall army | beta.55 | 618 | evidence | beta1.2
loop/scripts/capture-world.mjs:hill field | target35,5,0,radius120 | 618 | approve | default target0,0,0,radius135
loop/scripts/capture-world.mjs:wall field | target5,0,0,radius90,beta.22 | 618 | approve | default target0,0,0,radius135,beta.72
web/src/campaign/stages/simulation.ts:catapult_castle crowns | six x31.5,z+-7.5/12.5/17.5 | 617 | approve | line x20,z-16..4
web/src/campaign/stages/simulation.ts:catapult_castle reserves; stagePresentation.ts:gate height | (32,0),(42,+-3); gate y12 | 617 | approve | line x20,z8/12/16; gate crown y24
loop/scripts/capture-world.mjs:catapult_castle army | targety12,beta1.4 | 617 | evidence | targety1,beta1.2
web/src/map/tabs/viking_sandbox.ts:placementZones; stages/pirate.ts:arrows army | append inner ice x+-(1..27),z+-20; army -8x | 616 | approve | x>=27; original x27.6..34
web/src/campaign/stages/pirate.ts:arrows right flank | archers x25..18.1,z-6..-12; Heads15.8,-14/13.5,-16 | 616 | approve | archers x26..21.8; Heads20.6/22
web/src/map/tabs/renaissance.ts:placementZones,canal | append x+-(19..43),z-24..-5; water z-29.9..-24.9 | 615 | approve | zones z-5..29; inherited water z-34..-14
web/src/campaign/stages/renaissance.ts:renaissance_fencer Musketeers | stagger x21..28.5,z-20..27.6 | 615 | approve | 614 z-4.5..27.6
web/src/campaign/stages/pirate.ts:boom formation | 3 layers z-20..28, V centre z4 | 615 | approve | 614 z-4..28, V centre z12
web/src/campaign/stages/pirate.ts:small_tribe Chieftains | irregular x20.5..24,z-7.5..8.5 | 615 | approve | 614 mirrored arc
web/src/campaign/stages/pirate.ts:walk_plank Archers | x33..33.8,z-10..-4.6 and 1..6.4 | 615 | approve | 614 z-8..-2.6 and 5.4..10.8
web/src/campaign/stages/pirate.ts:x_marks formation | 17-man X x24.5..32.5,z-12.5..-0.5; two pairs x22/35,z-8/-5; stray25.5,-8.5 | 615 | approve | three deck ranks, two plank heads
web/src/campaign/stages/renaissance.ts:ancient_2 formation; stagePresentation.ts:ancientApproach | formation +9z; path x26,z-2..26, return to city x0..26,z24 | 615 | approve | formation z-8.5..9.5, no approach
web/src/campaign/stages/pirate.ts:rival formation | sand x3.5..14,z-16..-7; zigzag, flank trios, Bombs8.3,Captain10.5,Cannons14 | 615 | approve | deck ranks x19.25..31.1
web/src/campaign/stagePresentation.ts:tiniestSummit | stage-only18x16m hill(20,-9.9),crest6.5,height+cleanup | 601 | approvec283afb0 | flat Farmer
web/src/campaign/stagePresentation.ts:rider | head xz,head/crest maxY+.08,seated joints,restore before sim | 601 | approvea744ccde,c0d6c20a,799d316d | torso-local anchors hidden;flat Halfling
web/src/campaign/stagePresentation.ts:wheelbarrowArchCrown; stages/adventure.ts:wheelbarrow | cap(1.2,7.15,10)8x.5x3.6 top7.4,cart+crew lift;actor(2.6,10) | 601 | approve5f92ad8a | absent cap/lift;actor(29,0)
loop/scripts/capture-world.mjs:fantasyEvil poses, pirate army | island targety16 radius230, top targety12 radius160; Pirate stage army targety8.2 | 600 | evidence685f65a9,ce687e96 validated | Evil island targety8 radius200, top default; Pirate army targety1
web/src/campaign/stages/adventure.ts:a_fierce_rider | Mammoth leaderx2,z0, wingsx3.5,z+-4.6, rearx7,z-5.6/0/5.6; Halfling unchanged | 600 | approve d4289c91, struck b1 | Mammoths line atx2,z-12..8 step4
web/src/campaign/stages/adventure.ts:the_tiniest_attack | 15upper+16lower irregular crop pockets x9..41,z-25..17; two obstacle clearances; Farmer unchanged | 600 | approve ffe2e899,defaf4dd, struck b2 | Halflings regular ranks x20/22.2/24.4,z+-9.9
