# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 350   Batch: medieval (4/18)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
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
350 (BASE 8ce9347): [S] farmer b fork head at hip height aecb1d9 approved | [S] wheelbarrow c stab aimed at the man b0cfd14+6b93c12 approved | [S] wheelbarrow a log drum wheel 6298fe0 approved | [P] wheelbarrow a AFRO 109f875 approved
349: farmer [R] carry, wheelbarrow crew dressed + riders fight approved.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.farmer (aecb1d9) VERDICT: APPROVE CRITERION: farmer.farmer.b PASS (previous: FAIL) BLOCKERS: struck: 2 (list now empty)
- GAP: [S] farmer.wheelbarrow (b0cfd14 + 6b93c12) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.c PASS (previous: FAIL) BLOCKERS: struck: 2 (list now empty)
- GAP: [S] farmer.wheelbarrow (6298fe0) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a PASS (previous: FAIL) BLOCKERS: struck: 3 (list now empty)
- GAP: [P] farmer.wheelbarrow (109f875) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a PASS (previous: FAIL; flipped by 6298fe0)

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
- REQUIRED FIRST COMMIT (350 farmer batch checkpoint, 10/12): battlefeel_shield_wall_vs_light_swarm (tribal.protector moved 1.82 > 1.35) and battlefeel_spillover_chain (farmer.farmer dead, expected toppled|downed|recovering). Fix or re-baseline with cause.
- medieval is unaudited: step 2 (capture --batch medieval, stats, AUDIT critic) next. Reread ITERATE step 2.
- Off-camera checks: a scratch playwright probe on `vite preview` (seed Math.random as capture does; replay a frame with ONE advanceTime call, as shots do) beats guessing from shot angles.
- Sim code reading joint positions must computeWorldMatrix the chain first: world matrices only refresh on render, and capture replays a frame in one call (350 wheelbarrow stab never fired in shots).
- Plain browns go black under this light: mat(scene, c, glow ~.2). Patch via python io.open(..., newline=''). Never `git commit -a`. After any --iter capture rerun stats --batch <batch> --iter N.
