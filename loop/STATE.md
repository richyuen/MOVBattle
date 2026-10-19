# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 378   Batch: tribal:re+renaissance:re+farmer:re+ancient (5-8/21)   Consecutive empty: 0   Done: 24/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller +-++ o | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer --++ o | sarissa ---+ o | hoplite ---+ o | snake_archer ---+ o | ballista ---+ o | minotaur ---+ o | zeus ---+ o
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
dynasty: samurai ???? q | firework_archer ???? q | monk ???? q | ninja ???? q | dragon ???? q | hwacha ???? q | monkey_king ???? q
pirate: flintlock ???? q | blunderbuss ???? q | bomb_thrower ???? q | harpooner ???? q | cannon ???? q | captain ???? q | pirate_queen ???? q
spooky: skeleton_warrior ???? q | skeleton_archer ???? q | candlehead ???? q | vampire ???? q | pumpkin_catapult ???? q | swordcaster ???? q | reaper ???? q
wild_west: dynamite_thrower ???? q | miner ???? q | cactus ???? q | gunslinger ???? q | lasso ???? q | deadeye ???? q | quick_draw ???? q
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict)
378 (BASE 5715b05; evidence add9656: mammoth _idle, lineup_tribal, halfling _idle; ancient audited + stats 5715b05, tail overlap at 4 pickable): [S] mammoth a topline ad41648 +d33b7c6 approved | [S] mammoth a crest 97b036e approved | [S] potion_seller b neck in fist c1e205c approved | [S] wheelbarrow a bunched riders 9ea4314 approved | [S] minotaur a fur + gear 87155bc +8ac5a35 approved | [S] minotaur c charge 241b811 approved | [S] shield_bearer b scutum 2940691 approved (+ c PASS)

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.mammoth (ad41648 + d33b7c6) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (97b036e) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] farmer.potion_seller (c1e205c) VERDICT: APPROVE CRITERION: farmer.potion_seller.b FAIL (previous: FAIL)
- GAP: [S] farmer.wheelbarrow (9ea4314) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (87155bc + 8ac5a35) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (241b811) VERDICT: APPROVE CRITERION: ancient.minotaur.c FAIL (previous: FAIL)
- GAP: [S] ancient.shield_bearer (2940691) VERDICT: APPROVE CRITERION: ancient.shield_bearer.b FAIL (previous: FAIL); also ancient.shield_bearer.c PASS (previous: FAIL)

## Unit file template (loop/units/<id>.md, cap 2600 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> — TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c <gap> — blocker 1: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] — iter: what — critic's top defect)
## Notes (max 3 lines)
```

## Notes for next iteration (max 5 lines)
- Re-audit owed (evidence add9656): halfling a from the re-aimed _idle (say so in the critic prompt with its Verdicts block). Mammoth a was judged afresh in 378.
- Open in the old batches: mammoth a (head dome, tail), potion_seller b (flask size/orientation), wheelbarrow a (low rim, Thrower's legs splayed), halfling a. Ancient's ranked gaps are in its unit files.
- Ancient cloth/hair/gear go in web/src/units/ancientDress.ts (dressMinotaur there). Scutum rides the protector's _holdSlab (metadata.holeUp).
- Scripts take faction names: --batch farmer for farmer:re, --batch ancient. A pose wrong only in the capture: probe the animator's own state (output/loop/probe_potion.mjs).
- Capture replays are deterministic. Particles do not render on the stepped clock. Never bakeCurrentTransformIntoVertices after parenting. Write node scripts with the Write tool.
