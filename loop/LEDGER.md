# Loop ledger (v10): every value the loop has tuned on maps and stages

Rows: `file:identifier | value | last iter | verdict | earlier values`. P: no approved reversal within 20 iterations; two failed polish attempts spend a row. S/R replace mechanisms. The unit phase's ledger is `loop/archive/v4/LEDGER.md`.

## Structural attempts (iter | sha | item.criterion | verdict)
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

## Done maps (rows compacted; the maps are D and never tuned again)
tribal_1, tribal_2, tribal_sandbox, farmer_1, farmer_2, farmer_snow, medieval_1, medieval_2, viking, viking_sandbox, ancient_1, ancient_sandbox, legacy (576-584), wild_west, ancient_2, renaissance, spooky_1 (565-587), simulation, hill, bridge, corridor (587-591), low_ground, defend_the_castle (588-592), high_ground (589-599), pirate (576-602), dynasty (576-603): every row approved and CONFIRMed; values in their builders' spec comments and git log `loop(5xx)`.

## Tuned values
web/src/map/tabs/spooky_2.ts:pumpkinShrine | ten lobes,main7.2m y6; arch13m/forks,15candles | 601 | approve bba97442 | single4.6m sphere y5,3trees
web/src/map/tabs/fantasy_good.ts:viaductUnderside front | z-46.06 crown-3.2/spring-5.9/foot-14.1,5.4m openings/~7m pitch,6m returns | 601 | approve9e419281 | z-40.06 crown-1.6/spring-4.3/foot-12.5 masked by ledge
web/src/map/tabs/fantasy_evil.ts:greenRim hosts | inherited domes replaced3faceted hosts each,8rim+4..6green mushrooms/host,caps.55..1.2/stems.4..1m | 601 | approvee40ca4f6 | magenta domes,6rim/caps.7..1.5
web/src/map/tabs/fantasy_evil.ts:CLIFF_SHELVES/brokenCliffs | side(+/-37,25)h9,front(-12,-30)h4.5/(20,-31)h6;10m-wide12m16-tread stairs;colliders/buttresses;central3m | 601 | approve12ddab5e | five all-edge ramp shelves600
web/src/campaign/stagePresentation.ts:tiniestSummit | stage-only18x16m hill(20,-9.9),crest6.5,height+cleanup | 601 | approvec283afb0 | flat Farmer
web/src/campaign/stagePresentation.ts:rider | head xz,head/crest maxY+.08,seated joints,restore before sim | 601 | approvea744ccde,c0d6c20a,799d316d | torso-local anchors hidden;flat Halfling
web/src/campaign/stagePresentation.ts:wheelbarrowArchCrown; stages/adventure.ts:wheelbarrow | cap(1.2,7.15,10)8x.5x3.6 top7.4,cart+crew lift;actor(2.6,10) | 601 | approve5f92ad8a | absent cap/lift;actor(29,0)
loop/scripts/capture-world.mjs:fantasyEvil poses, pirate army | island targety16 radius230, top targety12 radius160; Pirate stage army targety8.2 | 600 | evidence685f65a9,ce687e96 validated | Evil island targety8 radius200, top default; Pirate army targety1
web/src/map/tabs/fantasy_good.ts:openArcade | 1.6m rim beam; real5.4m openings/~7m pitch, 1.1x1.3m piers to-12.5, stone arch tubes r.65; basalt12..27m | 600 | approve4834759a, no strike | 12m solid rim with dark arch plates; basalt3..16m
web/src/map/tabs/fantasy_good.ts:gateFacades | lancets10..25.5m, 18mosaic panes/window, pointed gold frame, triple peaked bands31.7..36m on both faces | 600 | approve79aae0c6, struck a2 | rectangular yellow panes with grid and tiny diagonal tips; gate size/spires unchanged
web/src/map/tabs/fantasy_good.ts:frontFallSpill | 2m fall to ledge, spill toz-46.35, 22m opaque drop +6m alpha fade | 600 | approve a44979d1 [P], no strike; spill visible, fade uncredited | continuous30m drop at deck rim through ledge
web/src/map/tabs/fantasy_evil.ts:blockLevel | five clipped shelves: central(0,10)h3, side(+/-37,20/24)h6, front(-12,-29)h3/(20,-31)h4.5; .75m treads/1.5m runs | 600 | approve bb5ee8bb, no strike | one rectangular plateau x+-24,z-6..34,h3 with2m runs
web/src/map/tabs/fantasy_evil.ts:wingedMonument | robe29m at(32,27,38), hoody47, horns/raised arms, angular wings span36m at y31..50 | 600 | approve d0fccfc5, struck a2 | leaning47m tapered slab at(29.5,20.5,35.5); front chains retained
web/src/map/tabs/fantasy_evil.ts:fracturedFloor | shared jittered3m staggered corners, .975 inset fractured plates with2m sides, outward winding, heights follow shelves | 600 | approve ff505e0b,b79bc009, struck a1 | regular2m grid of1.85m square instanced blocks
web/src/campaign/stages/adventure.ts:a_fierce_rider | Mammoth leaderx2,z0, wingsx3.5,z+-4.6, rearx7,z-5.6/0/5.6; Halfling unchanged | 600 | approve d4289c91, struck b1 | Mammoths line atx2,z-12..8 step4
web/src/campaign/stages/adventure.ts:the_tiniest_attack | 15upper+16lower irregular crop pockets x9..41,z-25..17; two obstacle clearances; Farmer unchanged | 600 | approve ffe2e899,defaf4dd, struck b2 | Halflings regular ranks x20/22.2/24.4,z+-9.9
loop/scripts/capture-world.mjs:evidence poses | gate runtimeId departure at20ms, radius32; Basic army beta.24/field.2; Evil island targety8; Good island220/y8, top165/y8 | 599 | evidence validated; High b CONFIRM | gate attacker never arrived; Basic .77/.72; island200/y-10, top135/y0
web/src/map/tabs/fantasy_evil.ts:leaningSpire | lone47m tapered slab at(29.5,20.5,35.5), two25-link front chains to statue plinth | 599 | approve, struck a6,a5; CONFIRM a/b FAIL | spire merged into crag, chains behind
web/src/map/tabs/fantasy_good.ts:corruptedPits | black cracked obelisk and 4 groups of3 thorn vines, tops11..13m; r.28..38 | 599 | approve, struck a5 | absent; first vines buried in pits
web/src/map/tabs/fantasy_good.ts:rearJog | x12..28 z32..40 band sheared by6m taper; deck/rim/kerb/parapet/arches and cut colliders | 599 | approve, struck b2 | stepped rear only
web/src/map/tabs/ancient_1.ts:street placement zones | append4m street strips x+-(2..25), z+-10; original plazas first | 599 | stage/play PASS, formation CONFIRM D | plazas x+-(25..55) only
web/src/map/tabs/viking.ts:innerIce zones | append x+-(1..27), z+-20; original outer zones first | 599 | stage/play PASS, formation CONFIRM D | inherited Challenge x+-(27..61) only
web/src/map/tabs/fantasy_evil.ts:STATUE | (18,15) scale 1.05 yaw 1.27 (faces the ground camera), stone self .75, no shadows received; collider cylinder r 3.9 | 596 | approve, a5 statue clause | 594: (8,26) 1x facing -z, self .2, box collider
web/src/map/tabs/fantasy_evil.ts:rockMass | (.09,.12,.14) self (.03,.04,.045); rim links 1.1 m x .28. 596 [P] (.2,.26,.32)/(.07,.09,.11), links 1.6 m: rejected (mass under the slab, unseen) | 596 | reject (attempt 1) | -
web/src/map/tabs/fantasy_evil.ts:STAIRS/shrine/chasms/voidSky | flights |x|8..16 z-16..-6; shrine r6.2(0,1),altar(0,12); chasms4m acid(.15,.9,.2); void(.02,.012,.035); replaced floor/rim/monument in newer rows | 595 | approve590-595 | tree ring/maroon lawn/mauve sky
web/src/map/tabs/spooky_2.ts:thornThickets | per side 16 lumps r 1.8-3.2 (.055,.06,.1) self .35 + 52 arching vines 3-7 m, rise 2-4.5 m, navy (.1,.11,.19) self .3; collider 3.5 x 7 kept | 596 | approve, struck a3 | 587: 30 upright vines 7-10 m
web/src/map/tabs/spooky_2.ts:squareRingSpot, terraces, deadPropTrees, blackTrees, rockSkirt, channelBridges, gratedCourt, darkTorii, pumpkinShrine, nightSky | ring on power-8 rim; terraces |z| .8..6.4 h .7, 18.6..29.5 h 1.6; dead trees 6-9.5 m bark (.035,.035,.055); skirt 4 courses (.3,.34,.48); bridges x +-30 rise 3; ember court 15 m; torii (-40,33); shrine (14,38) 16 m mound; navy sky | 595 | approve (578-595) | base oval day map
web/src/map/tabs/fantasy_evil.ts:backdropCrag | 26 boulders 3 tiers tops 8/18/30 m x 22..56 z 46..62, (.2,.26,.32) self .35, out of glow; spire re-lit with it; 4 ledge chains (unseen) | 597 | approve | -
web/src/map/tabs/fantasy_good.ts:pitShafts, waterfalls, frontLedge | floor (.08,.1,.16); navy liners; 6-10 hex columns r 1-2.1 tops -1.2..-6.5 (.55,.62,.72) self .3; channels 1.8 m to back pits, 3 front falls 30 m (.25,.62,1.05); ledge z -46..-40 at y -2, stairs x -50, 14 | 597 | approve | -
web/src/campaign/stages/introduction.ts:all6 stages | approved + CONFIRMed D597-599; final formations in source/git loop(597..599); rows compacted | 599 | approve | scaffold rows
web/src/map/tabs/spooky_2.ts:CUTS, RIM, OUTLINE, rockSkirt, cobbleLoop | max-norm rim 54 x 48; cuts big (36,30), corners 42/36, mouths 47.5 z 7..17; skirt boulders inset r*1.1+4k, r <= outline dist/1.35; loop steps 39.25/33.25; fog to 47.5 + 2 falling sheets | 598 | approve ([R]) | 596: power-8 rim, notches 44.5/38.5, loop 41.25/35.25
web/src/map/tabs/fantasy_good.ts:PITS | 5 pits: tree x -34..-12 z -32..-12, obelisk 2..12 z -30..-19, open 22..40 z -32..-15, tree -26..-8 z 13..30, obelisk 6..16 z 19..31; 10 m deep, floor (.24,.3,.42) self (.06,.08,.12) | 596 | approve, struck b1 | 592: four x 6..30 z 9..30
web/src/map/tabs/fantasy_good.ts:cleanDeck | boulder/hill/wallStone/pebble/stump/hayBale/Sanctum junk hidden with colliders; 16 inlay patches 4 x 3 x 1 m, ~half teal (.2,.62,.6), some aqua (.45,.78,.76), self .35 | 596 | approve, struck a6 | dressing on the deck
web/src/map/tabs/fantasy_good.ts:EDGE_STEPS, viaductUnderside, sideIslets, gateTowers, openCentre, parapets, marbleDeck, heavenSky | long edges step 4 m at u -36..-20, -4..12, 28..44; arches 4 x 6.5 m every 6 m; 5 islets; towers (+-40,30) legs 6 x 19 m, glass, water; gold ring 8.5 m; merlons every 2.4 m; pavers (236,240,244); sky (112,182,228) | 595 | approve (591-595); [P] eligible to 598: arch heads rotation (PI/2,0,0), columns longer | base temple, tree ring
web/src/map/tabs/simKit.ts:paleSky/untoned, cloudBanks, gridMaterial | sky untoned (186,207,210)/(216,228,227); banks z 200-240 y -22..-12 untoned white; 1 m grid tiles | 591 | approve (588-591) | teal sky, banks out of frame
