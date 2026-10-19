# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 387   Batch: tribal:re+renaissance:re+farmer:re+ancient (5-8/21)   Consecutive empty: 0   Done: 28/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa -+++ o | hoplite ++++ D | snake_archer -+-+ o | ballista ---+ o | minotaur -+++ o | zeus -+++ o
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
387 (BASE 5b88632; evidence 5b88632, e4d3ca7): [S] snake_archer c summon c513c8f approved (struck c.2, added c.3) | [S] minotaur c Big Headbutt 72be3fb +720dffe approved (c PASS) | [S] zeus a beard de591d4 approved (struck a.1) | [S] ballista a operator 3b71139 rejected (reverted ce63321) | [S] sarissa a collar fold 35cf884 approved (narrowed) | [S] halfling a stance fb699af approved (narrowed) | [P] halfling a buckle a1902d7 approved (struck a.1) | [S] wheelbarrow a riders 51b7c67 approved (narrowed)

## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.snake_archer (c513c8f) VERDICT: APPROVE CRITERION: ancient.snake_archer.c FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (72be3fb + 720dffe) VERDICT: APPROVE CRITERION: ancient.minotaur.c PASS (previous: FAIL)
- GAP: [S] ancient.zeus (de591d4) VERDICT: APPROVE CRITERION: ancient.zeus.a FAIL (previous: FAIL)
- GAP: [S] ancient.ballista (3b71139) VERDICT: REJECT CRITERION: ancient.ballista.a FAIL (previous: FAIL)
- GAP: [S] ancient.sarissa (35cf884) VERDICT: APPROVE CRITERION: ancient.sarissa.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (fb699af) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [P] farmer.halfling (a1902d7) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] farmer.wheelbarrow (51b7c67) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)

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
- RE-AUDIT first (step 2): 5b88632 moved the _idle cameras of halfling, snake_archer and ballista; re-audit criterion a of those three only (give the critic their Verdicts blocks).
- Critic 387 ranked: ballista operator (behind the trough's end, helmet above the stock), ground snake (long thin banded S, head up), zeus toga fill, ballista loaded bolt, minotaur girdle face, wheelbarrow knees, halfling feet. [P] fallout: HALFLING_STANCE spread .32, SARISSA_FOLD drapeTall .22 / drapeTilt .6.
- Capture ABILITY_PREF (capture.mjs) runs detection on until a named kind: minotaur headbutt, snake_archer snake_land (framed on the struck man).
- Flat colour that survives ACES: "unlit" material, emissive red >1 / blue ~0, glow.addExcludedMesh. "metal" renders black: use cloth + glow. Generic tunicSkirt covers waist gear: exclude the unit in unitFactory's skirt condition.
- Probes (output/loop/, --build first): probe_shield, _potion, _mino, _wheelbarrow, _halfling, _hoplite, _head, _sarissa (--unit= --pat=), _local. Python edits: PYTHONUTF8=1 (no PIL here). Write node/python scripts with the Write tool.
