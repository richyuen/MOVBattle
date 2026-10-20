# Loop state (v3: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D)
Iteration: 391   Batch: farmer:re+ancient+viking (5-7/19)   Consecutive empty: 0   Done: 31/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+-+ o | ice_archer ---+ o | brawler --++ o | berserker ---+ o | valkyrie -+-+ o | longship ---+ o | jarl ---+ o
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
391 (BASE cd1581b): [P] viking stats e5a0cb5 (d 7/7) | [S] ballista b evidence 03a5bdc approved (b PASS) | [S] halfling vest 6eefbb3 approved (struck a.3) | [S] halfling foot fur bef7e5f approved (a.2 stands) | [S] valkyrie second sword 54ae174 approved (b PASS) | [R] zeus toga trim e30be40 rejected (reverted 86c09ff) | CONFIRM: ballista 4/4 -> D

## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.ballista (03a5bdc) VERDICT: APPROVE CRITERION: ancient.ballista.b PASS (previous: FAIL)
- GAP: [S] farmer.halfling (6eefbb3) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (bef7e5f) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] viking.valkyrie (54ae174) VERDICT: APPROVE CRITERION: viking.valkyrie.b PASS (previous: FAIL)
- GAP: [R] ancient.zeus (e30be40) VERDICT: REJECT CRITERION: ancient.zeus.a FAIL (previous: FAIL)
- CONFIRM: UNIT ancient.ballista: a PASS b PASS c PASS d PASS (4/4)

## Unit file template (loop/units/<id>.md, cap 3200 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> - TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] <criterion> <gap> - blocker <n>: <mechanism> - ref: <file> - ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] - iter: what - critic's top defect)
## Notes (max 3 lines)
```

## Notes for next iteration (max 5 lines)
- Batch farmer:re+ancient+viking; open: halfling, wheelbarrow, minotaur, zeus, all 7 viking. ballista done 391 (CONFIRM 4/4).
- zeus: retry [R] with the critic's spec (bolt .6 tr tall at .7 tr/.5 halfX, colour (1,.5,.1); belt warmer (.95,.55,.2); keep the 391 waist belt and white skirt); one [R] rejected, a second parks a.
- halfling: a.1 legs [S], a.2 foot fur shard fan [S], a.4 shorts [S]; wheelbarrow.a is plateau; next pick one [R].
- viking: valkyrie b PASS; next c flight and a wings; ice_archer idle shows the back (evidence candidate); headbutter/brawler share the viking_helmet hat (per-unit variants).
- The ballista idle camera is a high rear-side now (evidence 03a5bdc); the CONFIRM passed a on it, so no re-audit is owed.
