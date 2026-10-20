# Loop state (v3: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D)
Iteration: 390   Batch: farmer:re+ancient (5-6/19)   Consecutive empty: 0   Done: 30/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista +-++ o | minotaur -+++ o | zeus -+++ o
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
390 (BASE 836aeef): [S] ballista a frame 0c52227 approved (a PASS) | [S] ballista c flying bolt cf436a3 +1d34d1a approved (c PASS) | [S] halfling a vest 66faf9b rejected (reverted b0bb4eb) | [S] snake_archer a stance 73c3474 approved | [S] snake_archer a face wrap ee39078 approved (a PASS) | [P] halfling a foot fur 3eda79e rejected (reverted bc7df7e) | [R] sarissa a mantle 5c44ced approved (a PASS) | CONFIRM: snake_archer, sarissa 4/4 -> D

## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.ballista (0c52227) VERDICT: APPROVE CRITERION: ancient.ballista.a PASS (previous: FAIL)
- GAP: [S] ancient.ballista (cf436a3 +1d34d1a) VERDICT: APPROVE CRITERION: ancient.ballista.c PASS (previous: FAIL)
- GAP: [S] farmer.halfling (66faf9b) VERDICT: REJECT CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] ancient.snake_archer (73c3474) VERDICT: APPROVE CRITERION: ancient.snake_archer.a FAIL (previous: FAIL)
- GAP: [S] ancient.snake_archer (ee39078) VERDICT: APPROVE CRITERION: ancient.snake_archer.a PASS (previous: FAIL)
- GAP: [P] farmer.halfling (3eda79e) VERDICT: REJECT CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [R] ancient.sarissa (5c44ced) VERDICT: APPROVE CRITERION: ancient.sarissa.a PASS (previous: FAIL)
- CONFIRM: UNIT ancient.snake_archer: a PASS b PASS c PASS d PASS (4/4) | UNIT ancient.sarissa: a PASS b PASS c PASS d PASS (4/4)

## Unit file template (loop/units/<id>.md, cap 3200 bytes)
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
- farmer:re is the last :re batch (tribal:re, renaissance:re checkpointed). Open: halfling, wheelbarrow (farmer:re); ballista, minotaur, zeus (ancient).
- Plateau, next pick one [R] each (one [R] per iteration): wheelbarrow.a (TABS stacks three riders on the barrow, no pusher visible), zeus.a (rings outside the drape, unlit gold bolt, white skirt), minotaur.a (flat light scroll inlays + scale ~ Zeus height). The 390 sarissa [R] (spec at SARISSA_MANTLE) cleared its plateau first time.
- ballista.b: only the idle half of b.1 stands, because _idle is shot from behind the engine: an evidence commit (capture.mjs camera or engine yaw) first, then rewrite the blocker's shot.
- halfling 390: vest [S] and tuft [P] rejected; the vest read lighter at team .3 toward white (keep), but faceFront hid the white V: rebuild V/panels as closed slabs; re-root the tuft in the foot's own frame.
- stats.mjs takes one unit id or one batch name (no farmer+ancient): run the batch last so stats.json covers it; stats.json is overwritten per run.
