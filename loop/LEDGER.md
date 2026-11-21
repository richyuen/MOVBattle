# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
619 | [S] 3153a700 | simulation.wall.b1 | approve,struck1
619 | [S] cd82a8b2 | simulation.siege.b1 | approve,struck1
619 | [S] 314b86b2 | simulation.siege.b2 | approve,struck2
619 | [S] fbeb343d | simulation.siege.b3 | approve,struck3
619 | [S] 5ee94eae | simulation.pit.b1 | approve,struck1
619 | [S] 08ce63c5 | simulation.pit.b2 | approve,struck2
619 | [S] 910dcfba | simulation.pit.b3 | approve,struck3
619 | [S] 2bbbde3d | wild_west.leading_cacti.b1 | approve,struck1
619 | [S] 33e6a0ad | wild_west.leading_cacti.b2 | approve,struck2
618 | [S] 6f7fc7cf | spooky.war.b3 | approve,struck3
618 | [S] b8026b2a | simulation.bridge_battle.b1 | approve,struck1
618 | [S] 2a9b7b0f | simulation.bridge_battle.b2 | approve,struck2
618 | [S] 43b24f31 | simulation.bridge_battle.b3 | approve,struck3
618 | [S] 88752814 | simulation.hill.b1 | approve,struck1
618 | [S] b5282674 | simulation.hill.b2 | approve,struck2
618 | [S] e9a5f4e6+8f911699 | simulation.hill.b3 | approve,struck3
618 | [S] 0bea9c00+87255cd9 | simulation.wall.b2 | approve,struck2
618 | [S] defa4af0 | simulation.wall.b3 | approve,struck3
617 | [S] 2b5c4799 | spooky.plunder.b2 | approve,struck2
617 | [S] 611811bb+5639eb60 | spooky.plunder.b3 | approve,struck3
617 | [S] 0dcb4ead+63569070 | spooky.turtle.b1 | approve,struck1
617 | [S] 0604b51b | spooky.turtle.b2 | approve,struck2
617 | [S] 3ad84c80 | spooky.war.b1 | approve,struck1
617 | [S] 62623681 | spooky.war.b2 | approve,struck2
617 | [S] d5cbbe24+59c1b039+b1d3d11a | spooky.war.b4 | approve,struck4
617 | [S] a0e3e596 | simulation.catapult_castle.b1 | approve,struck1
617 | [S] 66b970e2 | simulation.catapult_castle.b2 | approve,struck2
616 | [S] 24dca1bb | spooky.plunder.b1 | approve,struck1
616 | [S] f6a98d2d | spooky.bone.b1 | approve,struck1
616 | [S] 58221731+e4ec548f | spooky.bone.b2 | approve,struck2
616 | [S] ebca0cfd+bbcb3192 | spooky.cave.b2 | approve,struck2
616 | [S] daec95d3+dcdff888 | spooky.breakout.b1 | approve,struck1
616 | [S] 9b61be07 | spooky.breakout.b2 | approve,struck2
616 | [S] 995853ac | pirate.arrows_and_arrow.b2 | approve,struck2
616 | [S] fefdffcd | pirate.arrows_and_arrow.b3 | approve,struck3
616 | [S] d4648d25 | spooky.cave.b1 | approve,struck1
615 | [S] 5ff25056+b7d24ea3 | renaissance.renaissance_fencer.b2 | approve,struck2
615 | [S] 8375f571 | pirate.boom_and_the_units_go_down.b4 | approve,struck4
615 | [S] a1363de3 | pirate.a_small_tribe.b2 | approve,struck2
615 | [S] cd65ec9e | pirate.you_won_t_make_us_walk_the_plank.b3 | approve,struck3
615 | [S] 6d676fc0+97df2916 | pirate.x_marks_the_spot.b1 | approve,struck1,4
615 | [S] c0e3830c+70807a69 | pirate.x_marks_the_spot.b2 | approve,struck2,3
615 | [S] b7a1342a | renaissance.renaissance_vs_ancient_2.b6 | approve,struck6
615 | [S] f8b8b9b7 | pirate.a_rival_captain.b1 | approve,struck1
615 | [S] b7a228e2 | pirate.a_rival_captain.b4 | approve,struck2,3,4,5
614 | [S] 09e189d5 | pirate.you_won_t_make_us_walk_the_plank.b1 | approve,struck1,2 (stage scenery plankArch, Healers behind)
614 | [S] 4dbbd64c+ff4b17f9 | pirate.you_won_t_make_us_walk_the_plank.b3 | approve,struck4 (two 4-archer lines 14 m back); CONFIRM failed b3: arch hides the +z line
614 | [S] a5ea15f0 | pirate.a_small_tribe.b1 | approve,struck1 (Protector ahead, Chieftain arc)
614 | [S] 40345484 | pirate.a_small_tribe.b3 | approve,struck3,4 (Mage + 2 Stoners per wing)
614 | [S] 090d6a67 | pirate.boom_and_the_units_go_down.b4 | approve,no strike (z -4..28; zone stops at z -5)
614 | [S] 546a125c | pirate.boom_and_the_units_go_down.b2 | approve,struck2 (Musketeer V)
614 | [S] f135fc9e | renaissance.renaissance_fencer.b2 | approve,no strike (Musketeers z -4.5..27.6; zone stops at z -5)
614 | [S] ccebe571 | renaissance.a_new_art_wave.b5 | approve,struck5 (the 2 mid-square) -> D
614 | [S] 85977a0e | renaissance.balloons.b4 | approve,struck4 (stage scenery balloonStreet) -> D

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584), wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592), high_ground (589-599), pirate (576-602), dynasty (576-603), spooky_2 (578-604), fantasy_evil (590-605), fantasy_good (587-608): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
web/src/campaign/stages/simulation.ts:wall Berserkers; stagePresentation.ts:crownSeats | five per crown x6,z+-4..12,y7; clear departure x10 | 619 | approve | rear pad24.4/26.6
web/src/campaign/stages/simulation.ts:siege Musketeers | four per front wall x37.5,z+-7/10/17/22,y15/18; departure34 | 619 | approve | ground31.5,z+-6.3
web/src/campaign/stages/simulation.ts:siege gate guards | Brawlers26,z+-20/0 trios; Jarls31 | 619 | approve | mixed broad20/25
web/src/campaign/stages/simulation.ts:siege royals; main.ts:checkStage | Kings59,+-19; Fencers57,+-16/18/20/22,y14; courtyard zone36..54 | 619 | approve | mixed front20/25; forecourt only
web/src/campaign/stages/simulation.ts:pit Samurai | x20,z0/+-1.8/+-3.6 | 619 | approve | z-7.2..0
web/src/campaign/stages/simulation.ts:pit Monks | x26,z+-1/3 | 619 | approve | x20,z1.8..7.2
web/src/campaign/stages/simulation.ts:pit Firework Archers | x35,z+-8 step2 | 619 | approve | x23.7,z+-7.2
web/src/campaign/stages/wild_west.ts:leading Cacti | x28,z-24/-20/-16/-12 | 619 | approve | x31.2,z-19.9..-16.1
web/src/campaign/stages/wild_west.ts:leading Miners | four files x31/34/37,z-24/-20/-16/-12 | 619 | approve | transverse x29,z-25..-11
web/src/campaign/stages/spooky.ts:war Catapults | x20,z+-7.5 | 618 | approve | x31.8,z+-2
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
web/src/campaign/stages/spooky.ts:plunder Captains | main plank(11,-5.3),(14,-3.7) | 617 | approve | secondary heads(19.7,-18/8.55)
web/src/campaign/stages/spooky.ts:plunder Bomb Throwers | trios x14/16.5/19,z around-18/8.6 | 617 | approve | deck x28.25/31.1
web/src/campaign/stages/spooky.ts:turtle right Squires | 13-man arc x10..30,z+-24 | 617 | approve | bridgehead ranks x7/9.2
web/src/campaign/stages/spooky.ts:turtle mixed force; main.ts:checkStage | left bank x-11..-25.5,z+-15,yaw+PI/2; stage enemy zone | 617 | approve | bridgehead x9.2/12.9
web/src/campaign/stages/spooky.ts:war centre | seven swords x13..16.5,z+-4,two bows20,+-2 | 617 | approve | rectangle x20/22.2,bows28.1
web/src/campaign/stages/spooky.ts:war Vampires; stagePresentation.ts:war stair | 3x3 x26/28.5/31,z0/+-2.6; stair x22..34,h4 | 617 | approve | interleaved x22.2/24.4
web/src/campaign/stages/spooky.ts:war wings | six swords14/17,z+-16..21,two bows21,z+-17/20 | 617 | approve | central ranks x20/22.2,bows28.1
web/src/campaign/stages/simulation.ts:catapult_castle crowns | six x31.5,z+-7.5/12.5/17.5 | 617 | approve | line x20,z-16..4
web/src/campaign/stages/simulation.ts:catapult_castle reserves; stagePresentation.ts:gate height | (32,0),(42,+-3); gate y12 | 617 | approve | line x20,z8/12/16; gate crown y24
loop/scripts/capture-world.mjs:catapult_castle army | targety12,beta1.4 | 617 | evidence | targety1,beta1.2
web/src/campaign/stages/spooky.ts:plunder Queen | sand(6.5,-4.5) | 616 | approve | deck(19.25,-4.5)
web/src/campaign/stages/spooky.ts:bone formation | scattered x12..34.6,z4..20.5; stagePresentation.ts:boneApproach low walls and tower | 616 | approve | two ranks x20/22.2,z-9.9..9.9; no approach
web/src/campaign/stages/spooky.ts:cave Chieftains | irregular cliff-foot pockets x24..30.1,z-14..22 | 616 | approve | two rows x20/22.2
web/src/campaign/stages/spooky.ts:breakout Berserkers; main.ts:checkStage | inward oval24x19 at origin; stage-only enemy ice zone52x56 | 616 | approve | bank ranks x29..31.8, inherited team1 half
web/src/campaign/stages/spooky.ts:breakout Jarls | separate x-5..5.5,z23.5..25 | 616 | approve | x31.2,z6/10/14/18
web/src/map/tabs/viking_sandbox.ts:placementZones; stages/pirate.ts:arrows army | append inner ice x+-(1..27),z+-20; army -8x | 616 | approve | x>=27; original x27.6..34
web/src/campaign/stages/pirate.ts:arrows right flank | archers x25..18.1,z-6..-12; Heads15.8,-14/13.5,-16 | 616 | approve | archers x26..21.8; Heads20.6/22
web/src/campaign/stages/spooky.ts:cave Protectors | 2x3 x28.7/30.1,z4.6/6/7.4 | 616 | approve | one line x20,z-9.9..-0.9
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
loop/scripts/capture-world.mjs:evidence poses | gate runtimeId departure at20ms, radius32; Basic army beta.24/field.2; Evil island targety8; Good island220/y8, top165/y8 | 599 | evidence validated; High b CONFIRM | gate attacker never arrived; Basic .77/.72; island200/y-10, top135/y0
web/src/map/tabs/ancient_1.ts:street placement zones | append4m street strips x+-(2..25), z+-10; original plazas first | 599 | stage/play PASS, formation CONFIRM D | plazas x+-(25..55) only
web/src/map/tabs/viking.ts:innerIce zones | append x+-(1..27), z+-20; original outer zones first | 599 | stage/play PASS, formation CONFIRM D | inherited Challenge x+-(27..61) only
web/src/campaign/stages/introduction.ts:all6 stages | approved + CONFIRMed D597-599; final formations in source/git loop(597..599); rows compacted | 599 | approve | scaffold rows
