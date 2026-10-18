# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 343   Batch: farmer (3/18)   Consecutive empty: 0   Done: 14/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++-+ o | farmer ---+ o | hay_baler --++ o | potion_seller -+++ o | harvester ---+ o | wheelbarrow ---+ o | scarecrow -+-+ o
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
343 (BASE 856e2aa): [S] halfling a hairy feet 87e37b9 approved | [S] potion_seller a umber hair cap fb5c49e approved | [S] hay_baler c stick whack a4f19ae approved | [S] harvester b pegs rooted, snath/blade colours 0c7f22a approved | [P] scarecrow c FLYING_CROW wings flat d6343bd approved
342 (BASE 403fb0d): scarecrow c flying crows, halfling a shorts, potion_seller c drunk splash, harvester b low scythe, harvester a braids [P] approved; farmer b fork carry rejected.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.halfling (87e37b9) VERDICT: APPROVE CRITERION: farmer.halfling.a PASS (previous: FAIL) BLOCKERS: struck: 4. The list is now empty, so a flips to PASS.
- GAP: [S] farmer.potion_seller (fb5c49e) VERDICT: APPROVE CRITERION: farmer.potion_seller.a FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2, 3
- GAP: [S] farmer.hay_baler (a4f19ae) VERDICT: APPROVE CRITERION: farmer.hay_baler.c PASS (previous: FAIL) BLOCKERS: struck: 1. The list is now empty, so c flips to PASS.
- GAP: [S] farmer.harvester (0c7f22a) VERDICT: APPROVE CRITERION: farmer.harvester.b FAIL (previous: FAIL) BLOCKERS: struck: 2, 3. Remaining: added: 4 (grip wraps float off the bowed snath)
- GAP: [P] farmer.scarecrow (d6343bd) VERDICT: APPROVE CRITERION: farmer.scarecrow.c FAIL (previous: FAIL) BLOCKERS: Remaining: 2, 3. REGRESSIONS: none

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
- No [P] fallout pending. Wheelbarrow still untouched (its only ranked [S] is the 3-crew seating; split it); farmer b is at 1 rejected (a 2nd plateaus it).
- Plain browns go black under this light: use mat(scene, c, glow ~.2) or mf.get("cloth", c, {emissiveIntensity}). Cream/tan needs ~.2-.3.
- Carry (proceduralAnimation): only props whose root name is in the turnable regex (club|blade|handle|...|scytheCarry) turn onto attitude.tip. Club blows go through _aimBlow (arm overhead) unless exempted like _whacks().
- Look captures need a clean tree incl. untracked: git stash push -- <dirty paths> around them; --units takes a comma list and wipes output/loop/look. Vehicles live in vehicleBuilder.ts.
- Patch via scratchpad python with io.open(..., newline='', encoding='utf-8') (cp1252 default breaks on unitVisuals). After any --iter capture rerun stats --batch <batch> --iter N.
