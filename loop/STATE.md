# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 416   Batch: ancient+viking+dynasty (6-8/19)   Consecutive empty: 0   Done: 40/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++-+ o | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai -+-+ o | firework_archer ---+ o | monk ++-+ o | ninja ++++ D | dragon ---+ o | hwacha -+-+ o | monkey_king -+-+ o
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

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
416 (BASE a312f052; starvation: dragon, hwacha, monkey_king untouched since 411): [S] dragon c.1 flame jet (799cefaa) struck 1 | [S] dragon a.1 paper head + ribbon (3ac0c32c) struck 3, 4 | [S] hwacha a.1 lattice rack (50d2eac3) struck a.1, b PASS | [S] hwacha c.1 rockets (65915a61) struck 1 | [S] monkey_king b.1 staff (10e4da35) b PASS | [S] monkey_king a.3 tail (f97d38f2) struck 3 | [P] samurai katana steel (52fa1771) b PASS - 7/7, 10 struck
415 (BASE 01a65ea2): minotaur legs (CONFIRM failed a, 4 new), samurai swing, monk plates (a PASS), brawler board + haft (b PASS) - 5/5
## Last verdicts (critic header lines verbatim)
- GAP: [S] dynasty.dragon (799cefaa) VERDICT: APPROVE CRITERION: dynasty.dragon.c FAIL (previous: FAIL)
- GAP: [S] dynasty.dragon (3ac0c32c) VERDICT: APPROVE CRITERION: dynasty.dragon.a FAIL (previous: FAIL)
- GAP: [S] dynasty.hwacha (50d2eac3) VERDICT: APPROVE CRITERION: dynasty.hwacha.a FAIL (previous: FAIL); hwacha.b PASS
- GAP: [S] dynasty.hwacha (65915a61) VERDICT: APPROVE CRITERION: dynasty.hwacha.c FAIL (previous: FAIL)
- GAP: [S] dynasty.monkey_king (10e4da35) VERDICT: APPROVE CRITERION: dynasty.monkey_king.b PASS (previous: FAIL)
- GAP: [S] dynasty.monkey_king (f97d38f2) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a FAIL (previous: FAIL)
- GAP: [P] dynasty.samurai (52fa1771) VERDICT: APPROVE CRITERION: dynasty.samurai.b PASS (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Starving at 417 (no attempt since 411): dragon b (carrier poles: take via a.2 carriers), hwacha b is PASS, monkey_king c (jump); firework_archer a (last 412) starves at 417 too. Next ranked: [P] dragon head scale + idle framing evidence; dragon a.2 carriers; monkey_king c.1 jump / a.1 headgear; firework_archer a.2 robe; hwacha [P] timber / a.3 wheels / c.2 smoke; dragon c.2 burning; monk c.2 knockback; brawler c lunge (evidence first); minotaur a scale + sash; samurai a hakama/cuirass, c block (evidence first).
- samurai c.1 (Projectile Block) and brawler c.1 (lunge) need capture-scene evidence commits first (a ranged attacker; a farther start with the lunge logged).
- A world-posed rest (_restIceBow, _restKatana, _restNorseBoard) must clear rotationQuaternion outside the rest; the monkey king rides _restMonkBo via the "monkBoHolder" holder.
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun.

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
