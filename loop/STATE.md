# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 342   Batch: farmer (3/18)   Consecutive empty: 0   Done: 14/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+-+ o | farmer ---+ o | hay_baler ---+ o | potion_seller -+++ o | harvester ---+ o | wheelbarrow ---+ o | scarecrow -+-+ o
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
342 (BASE 403fb0d): [S] scarecrow c flying crows d8ad061 approved | [S] halfling a shorts+belt 439c08e approved | [S] farmer b fork carry 8c2de8f(+576a2bf,ee4bf48) rejected, reverted | [S] potion_seller c drunk splash 97ea8d4(+925e370) approved | [S] harvester b low scythe carry 0c87e29 approved | [P] harvester a braids 7017d25 approved
341 (BASE edea5e2): hay_baler a bowl cut, hay_baler b STICK.thick, potion_seller c lobbed bottle, halfling a jacket, scarecrow b held crows, farmer a socks all approved.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.scarecrow (d8ad061) VERDICT: APPROVE CRITERION: farmer.scarecrow.c FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2, 3
- GAP: [S] farmer.halfling (439c08e) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL) BLOCKERS: struck: 3. Remaining: 4
- GAP: [S] farmer.farmer (8c2de8f + 576a2bf, ee4bf48) VERDICT: REJECT CRITERION: farmer.farmer.b FAIL (previous: FAIL) BLOCKERS: 1
- GAP: [S] farmer.potion_seller (97ea8d4 + 925e370) VERDICT: APPROVE CRITERION: farmer.potion_seller.c PASS (previous: FAIL) BLOCKERS: struck: 2. Remaining: none
- GAP: [S] farmer.harvester (0c87e29) VERDICT: APPROVE CRITERION: farmer.harvester.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2; added: 3 (pegs float off the snath)
- GAP: [P] farmer.harvester (7017d25) VERDICT: APPROVE CRITERION: farmer.harvester.a FAIL (previous: FAIL) BLOCKERS: 2 partly cleared, 3. REGRESSIONS: none

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
- Pickable [P] fallout: scarecrow c FLYING_CROW wings spread sideways (fallout of d8ad061, NEXT shot unit_farmer.scarecrow_flight). Wheelbarrow still untouched (crew likely over the [S] cap: split it); hay_baler untouched in 342.
- Plain browns go black under this light: use mat(scene, c, glow ~.2) or mf.get("cloth", c, {emissiveIntensity}). Cream/tan needs ~.2-.3; dark browns with glow read tan at lineup distance.
- Carry (proceduralAnimation): only props whose root name is in the turnable regex (club|blade|handle|...|scytheCarry) are turned onto attitude.tip; others ride the fist. Tip frame: x weapon side, y up, z forward. Held throws: THROWS_HELD_PROP.
- Look captures need a clean tree incl. untracked: git stash push -- <dirty paths> (only those paths!) around them; --units takes a comma list and wipes output/loop/look. Vehicles live in vehicleBuilder.ts. Scarecrow visuals live in preset iconic_scarecrow.
- Write patches as scratchpad python files via the Write tool (open with newline='' to keep EOLs); bash heredocs containing apostrophes break here. After any --iter capture rerun stats --batch <batch> --iter N. Cloned StandardMaterials with DynamicTextures never get ready.
