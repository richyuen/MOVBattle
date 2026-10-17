# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 316   Batch: tribal (1/18)   Consecutive empty: 0   Done: 0/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber --++ o | protector --++ o | spear_thrower ---+ o | stoner ---+ o | bone_mage ---+ o | chieftain --++ o | mammoth -+-+ o
farmer: halfling ???? q | farmer ???? q | hay_baler ???? q | potion_seller ???? q | harvester ???? q | wheelbarrow ???? q | scarecrow ???? q
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
dynasty: samurai ???? q | firework_archer ???? q | monk ???? q | ninja ???? q | dragon ???? q | hwacha ???? q | monkey_king ???? q
renaissance: painter ???? q | fencer ???? q | balloon_archer ???? q | musketeer ???? q | halberd ???? q | jouster ???? q | da_vinci_tank ???? q
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
316 (BASE ff65871): [S] clubber b club mesh 3af648b approved | [S] chieftain b stone axe heads 41a51fe approved | [S] protector b plank shield with face hole 77c8352 approved | [S] bone_mage b deer-skull staff 9474ce7 approved | [S] spear_thrower c flat javelin a76560b approved. 5/5 approved, no regressions; every b/c list touched still has a blocker left, so no criterion flipped.

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.clubber (3af648b) VERDICT: APPROVE CRITERION: tribal.clubber.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2.
- GAP: [S] tribal.chieftain (41a51fe) VERDICT: APPROVE CRITERION: tribal.chieftain.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2 (rewritten: the swung stone is a thin lens under a head across).
- GAP: [S] tribal.protector (77c8352) VERDICT: APPROVE CRITERION: tribal.protector.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2, 3.
- GAP: [S] tribal.bone_mage (9474ce7) VERDICT: APPROVE CRITERION: tribal.bone_mage.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2 (rewritten: carried level at the hip, TABS upright beside the body).
- GAP: [S] tribal.spear_thrower (a76560b) VERDICT: APPROVE CRITERION: tribal.spear_thrower.c FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2.
- REGRESSIONS: none
Batch ranked order (critic, 316): bone_mage.c bone spike row, spear_thrower.c stick-and-launch, clubber.b two-handed grip, protector.b no back spear, bone_mage.b upright carry, spear_thrower.b spear raised overhead, chieftain.a animal-skull helmet, protector.b moss chunks, clubber.a hair and beard, [P] chieftain.b stone size (fallout of 41a51fe). Stoner and mammoth keep their 315 ranked gaps (stoner.c forward toss, mammoth.a brown fur, stoner.a garment, mammoth.c charge).

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
- 317 starts at step 3: up to 5 [S] from the 316 ranked order above (2 per unit max, different criteria), plus at most 1 [P]: chieftain.b stone size is eligible fallout (41a51fe approved in 316, NEXT names unit_tribal.chieftain_release). Stoner's two gaps (c forward toss = give "stone" a LAUNCH entry like the spear's; a one-shoulder garment) and mammoth's are unpicked since 315.
- Browns and greys go near-black in the capture's shade: give prop materials an emissive of 0.08-0.15 (mat(scene, colour, 0.1)). A raised prop can leave the windup frame at the top: check the look. `node loop/scripts/inspect-prop.mjs <id> [--no-build]` builds, spawns the unit alone and prints every hand mesh (name, visible, world extent) plus output/loop/inspect_<id>_{front,side}.png.
- The animator keys on prop names: a hafted weapon root must be named like the regex at proceduralAnimation.ts ~1599 (club|blade|handle|...), a caster's staff is "staff" with an "orb" child (id boneStaff for the overhead cast), a shield matches /shield$/.
- Two gaps in one file: edit, commit, then edit the next; splitting hunks afterwards cost a stash dance this iteration. Capture: a 1-2 unit look ~2.5 min, 5 units ~5 min.
- File edits keep each file's EOL (LF here). Do not chain shell commands. v1 is under loop/archive/v1/, tag loop-v1-final.
