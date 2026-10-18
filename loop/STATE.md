# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 341   Batch: farmer (3/18)   Consecutive empty: 0   Done: 14/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+-+ o | farmer ---+ o | hay_baler ---+ o | potion_seller -+-+ o | harvester ---+ o | wheelbarrow ---+ o | scarecrow -+-+ o
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
341 (BASE edea5e2): [S] hay_baler a bowl cut f6567f9 approved | [P] hay_baler b STICK.thick .085 ffd0fe6 approved | [S] potion_seller c lobbed bottle e8afe34 approved | [S] halfling a jacket 76bdeb8 approved | [S] scarecrow b crow in each hand 6718e9a approved | [S] farmer a socks and shoes 3c6b4c5 approved
340 (BASE f525109): hay_baler b stick, hay_baler a bale top, farmer a liripipe, halfling a mop, harvester a floppy hat, scarecrow a sack mask all approved.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.hay_baler (f6567f9) VERDICT: APPROVE CRITERION: farmer.hay_baler.a FAIL (previous: FAIL) BLOCKERS: struck: 2. remaining: 3
- GAP: [P] farmer.hay_baler (ffd0fe6) VERDICT: APPROVE CRITERION: farmer.hay_baler.b FAIL (previous: FAIL) BLOCKERS: 2 rewritten (thickness cleared; carry remains)
- GAP: [S] farmer.potion_seller (e8afe34) VERDICT: APPROVE CRITERION: farmer.potion_seller.c FAIL (previous: FAIL) BLOCKERS: struck: 1. remaining: 2
- GAP: [S] farmer.halfling (76bdeb8) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL) BLOCKERS: struck: 2. remaining: 3, 4
- GAP: [S] farmer.scarecrow (6718e9a) VERDICT: APPROVE CRITERION: farmer.scarecrow.b PASS (previous: FAIL) BLOCKERS: struck: 1. (list cleared)
- GAP: [S] farmer.farmer (3c6b4c5) VERDICT: APPROVE CRITERION: farmer.farmer.a FAIL (previous: FAIL) BLOCKERS: struck: 2. remaining: 3. REGRESSIONS: none

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
- No pickable [P] fallout from 341 (critic listed only [S] NEXTs). Harvester and wheelbarrow untouched since 340 (wheelbarrow crew likely over the [S] cap: split it).
- Plain browns go black under this light: use mat(scene, c, glow ~.2) or mf.get("cloth", c, {emissiveIntensity}). Cream/tan needs ~.2-.3.
- A right-hand prop named "handle" is turned by the animator to a hashed carry; force a carry via the pick line (fork/hayStick .9 = low level carry). Held throws: weaponHint in simulationSystem THROWS_HELD_PROP flies the fist prop.
- Look captures need a clean tree incl. untracked: git stash push -- <dirty paths> around them; --units takes a comma list. Vehicles live in vehicleBuilder.ts. Scarecrow visuals live in preset iconic_scarecrow.
- Write patches as scratchpad python files via the Write tool (open with newline='' to keep EOLs); bash heredocs containing apostrophes break here. After any --iter capture rerun stats --batch <batch> --iter N.
