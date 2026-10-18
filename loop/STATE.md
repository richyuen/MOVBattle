# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 339   Batch: farmer (3/18)   Consecutive empty: 0   Done: 14/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+-+ o | farmer ---+ o | hay_baler ---+ o | potion_seller -+-+ o | harvester ---+ o | wheelbarrow ---+ o | scarecrow ---+ o
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
339 (BASE f0fe549; stats f0fe549, audit 7 units): [S] halfling b empty hands 697a9c6 approved | [S] farmer b low two-handed pitchfork 151102b approved | [S] potion_seller b bottle each hand a682e21+122ce87 approved | [S] hay_baler a hay-bale armour 5acc99a+56a8306 approved | [S] scarecrow a crow wings 185ca19 approved
338 (BASE fb738c8): da_vinci_tank upper tier hat + scale 2.3 approved. Renaissance done; checkpoint 12/12 GREEN.

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.halfling (697a9c6) VERDICT: APPROVE CRITERION: farmer.halfling.b PASS (previous: FAIL) BLOCKERS: struck: 1 (none remain)
- GAP: [S] farmer.farmer (151102b) VERDICT: APPROVE CRITERION: farmer.farmer.b FAIL (previous: FAIL) BLOCKERS: 1. one fist at rest, off hand off the shaft; struck: 2
- GAP: [S] farmer.potion_seller (a682e21 + 122ce87) VERDICT: APPROVE CRITERION: farmer.potion_seller.b PASS (previous: FAIL) BLOCKERS: struck: 1 (none remain)
- GAP: [S] farmer.hay_baler (5acc99a + 56a8306) VERDICT: APPROVE CRITERION: farmer.hay_baler.a FAIL (previous: FAIL) BLOCKERS: struck: 1; 2, 3 open; added: 4 arms across the bale's face
- GAP: [S] farmer.scarecrow (185ca19) VERDICT: APPROVE CRITERION: farmer.scarecrow.a FAIL (previous: FAIL) BLOCKERS: struck: 1; 2, 3, 4 open. REGRESSIONS: none

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
- Farmer audited 339 (all a/b/c FAIL, d 7/7 PASS after the stats commit). Pickable [P]: hay_baler HAY_BALE.top ~1.6 (fallout of 5acc99a). harvester and wheelbarrow untouched yet.
- getCloth colours grey out under this light: cream/tan needs self-lit cloth (mf.get("cloth", c, {emissiveIntensity})); ~.2 on (.7,.46,.22) reads tan, .3 on a pale tan reads cream.
- Look captures (no --iter) need a clean tree incl. untracked files: git stash push -u -- loop/units around them; --units takes a comma list (a,b), not spaces.
- Vehicles (wheelbarrow) are in vehicleBuilder.ts; a whole-machine scale node beats widening radii. Scarecrow uses visualPreset iconic_scarecrow (unitVisuals getPresetVisual), not its table entry.
- After any --iter capture rerun stats --batch <batch> --iter N. Write patches as scratchpad python files (utf-8); heredocs with quotes break in bash here.
