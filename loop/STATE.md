# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 347   Batch: farmer (3/18)   Consecutive empty: 0   Done: 18/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ---+ o | hay_baler ++++ D | potion_seller ++++ D | harvester -+++ o | wheelbarrow -+-+ o | scarecrow ++++ D
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
347 (BASE 0b0814c): [S] harvester a braids 514b71b approved | [S] wheelbarrow a tray 07f763c+45203bc approved | [S] wheelbarrow b props b2fe249+332b611 approved | [S] farmer c stab 31530f7+558ab78+e3731e9 approved | [S] scarecrow c hover f0d8f77 approved
346 (BASE f006225): wheelbarrow a crew, scarecrow a dress, harvester c sweep approved; harvester a braids rejected; farmer b fork carry dropped.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.harvester (514b71b) VERDICT: APPROVE CRITERION: farmer.harvester.a FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 3
- GAP: [S] farmer.wheelbarrow (07f763c + 45203bc) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 1, 3
- GAP: [S] farmer.wheelbarrow (b2fe249 + 332b611) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.b PASS (previous: FAIL) BLOCKERS: struck: 1 (list empty)
- GAP: [S] farmer.farmer (31530f7 + 558ab78 + e3731e9) VERDICT: APPROVE CRITERION: farmer.farmer.c FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2
- GAP: [S] farmer.scarecrow (f0d8f77) VERDICT: APPROVE CRITERION: farmer.scarecrow.c PASS (previous: FAIL) BLOCKERS: struck: 3 (list empty). REGRESSIONS: none

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
- Open: farmer (a shirt, c back-step, b only via _turnFork route), harvester a tunic, wheelbarrow (a wheel+legs, a crew dress, c ram).
- Melee that the sim lands at the trigger shows nothing at release: make the animator report blowLandsIn (_strikesAtMan) so the hit waits for the pose (347 fork stab).
- Plain browns go black under this light: use mat(scene, c, glow ~.2) or mf.get("cloth", c, {emissive}). Cream/tan needs ~.1-.2; too much reads cream.
- Probe: temp loop/scripts/probe.mjs (vite preview 4189, system Chrome executablePath as capture.mjs, page.evaluate on window.__ua.animator) found 347's timing in minutes; delete after.
- Patch via python with io.open(..., newline=''); files are CRLF. Never `git commit -a` (STATE is dirty mid-iteration). After any --iter capture rerun stats --batch <batch> --iter N.
