# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 349   Batch: farmer (3/18)   Consecutive empty: 0   Done: 19/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer +-++ o | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+-+ o | scarecrow ++++ D
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
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
349 (BASE cbee979): [R] farmer b two-fisted low carry 8407342 approved | [S] wheelbarrow a dress the crew fb4fe35 approved | [S] wheelbarrow c riders fight 81f76b1 approved
348 (BASE 7aef804): farmer a shirt, harvester a tunic, wheelbarrow a wheel + c ram, farmer c back-step approved.

## Last verdicts (critic header lines verbatim)
- GAP: [R] farmer.farmer (8407342) VERDICT: APPROVE CRITERION: farmer.farmer.b FAIL (previous: FAIL) BLOCKERS: struck: 1 (the off hand is on the shaft now). added: 2. fork head droops to the grass
- GAP: [S] farmer.wheelbarrow (fb4fe35) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 3. wheel is a thin 8 cm log slice
- GAP: [S] farmer.wheelbarrow (81f76b1) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.c FAIL (previous: FAIL) BLOCKERS: 2 narrowed (the apple throw is cleared; the stab is recorded but does not visibly land). REGRESSIONS: none

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
- Open: farmer b (plateau lifted by the approved [R]; [S] lay FORK_HOLD level in world space), wheelbarrow (a log drum, c aim the Farmer's stab, land it at the drive's end; [P] AFRO fallout).
- Off-camera checks: a scratch playwright probe on `vite preview` (spawnUnit, read joint world positions) beats guessing from shot angles; measure in battle, not just at spawn.
- A mechanic that starts after the struck shot needs a _logAbility event so capture takes an ability pair. Vehicle crews: body.root.metadata (wheelbarrowCrew).
- Plain browns go black under this light: use mat(scene, c, glow ~.2) or mf.get("cloth", c, {emissive}). Heredocs with apostrophes break the bash wrapper: write patch scripts with Write.
- Patch via python with io.open(..., newline=''). Never `git commit -a` (STATE is dirty mid-iteration). After any --iter capture rerun stats --batch <batch> --iter N.
