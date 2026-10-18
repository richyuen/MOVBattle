# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 345   Batch: farmer (3/18)   Consecutive empty: 0   Done: 17/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ---+ o | hay_baler ++++ D | potion_seller ++++ D | harvester -+-+ o | wheelbarrow ---+ o | scarecrow -+-+ o
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
345 (BASE 2c5c9ce): [S] potion_seller a boots edeb651 approved | [S] hay_baler a fitted bale 492545d approved | [P] scarecrow a perch 06e5c87 approved | [S] harvester c sweep 8bd49db+c11f873 rejected (reverted 65a6e24, 0d5ca23) | [S] scarecrow c T release, A reload 29f6cf4 approved | [S] halfling c grab b0d26ea approved
344 (BASE af1f77a): harvester b snath, halfling c jump, hay_baler b carry, potion_seller a jerkin, scarecrow a T-pose [S]: all approved.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.potion_seller (edeb651) VERDICT: APPROVE CRITERION: farmer.potion_seller.a PASS (previous: FAIL) BLOCKERS: struck: 3 (list now empty)
- GAP: [S] farmer.hay_baler (492545d) VERDICT: APPROVE CRITERION: farmer.hay_baler.a PASS (previous: FAIL) BLOCKERS: struck: 3 (list now empty)
- GAP: [P] farmer.scarecrow (06e5c87) VERDICT: APPROVE CRITERION: farmer.scarecrow.a FAIL (previous: FAIL) BLOCKERS: 3 remaining
- GAP: [S] farmer.harvester (8bd49db + c11f873) VERDICT: REJECT CRITERION: farmer.harvester.c FAIL (previous: FAIL) BLOCKERS: 1, 2 remaining
- GAP: [S] farmer.scarecrow (29f6cf4) VERDICT: APPROVE CRITERION: farmer.scarecrow.c FAIL (previous: FAIL) BLOCKERS: 2 (A-pose half), 3 remaining
- GAP: [S] farmer.halfling (b0d26ea) VERDICT: APPROVE CRITERION: farmer.halfling.c PASS (previous: FAIL) BLOCKERS: struck: 2 (list now empty). REGRESSIONS: none

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
- Open: farmer (b at 1 rejected: a 2nd plateaus it), harvester (c at 1 rejected), wheelbarrow (untouched: split its 3-crew seating), scarecrow (a dress; c needs an evidence commit: reload shot ~1.2 s past the volley for the A-pose, then hover).
- Harvester sweep retry: the scythe is blade_slash; time the level cut so the release (hit) tick shows the snath crossing his front; fling must show him airborne in _struck.
- Plain browns go black under this light: use mat(scene, c, glow ~.2) or mf.get("cloth", c, {emissiveIntensity}). Cream/tan needs ~.2-.3.
- Unit capture idle shot is 100 ms after spawn (side-on); the lineup is the front view. A probe copy of capture.mjs in loop/scripts/ can print animator fields per tick; delete it after (it wipes look/).
- Patch via a scratchpad .py file run with python; io.open(..., newline='', encoding='utf-8'). A revert conflicting only by adjacency was resolved by hand (345). After any --iter capture rerun stats --batch <batch> --iter N.
