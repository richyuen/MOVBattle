# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 317   Batch: tribal (1/18)   Consecutive empty: 0   Done: 0/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector --++ o | spear_thrower --++ o | stoner ---+ o | bone_mage -+-+ o | chieftain --++ o | mammoth -+-+ o
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
318 (BASE e14fd1c, IN PROGRESS - implemented and looked at, not yet captured or reviewed): [S] protector b moss chunks af37ab3 pending | [S] chieftain b lashed stone head 83bec0d + follow-up (stone turned broad-face to the swing plane) pending | [S] spear_thrower b spear raised overhead b194791 pending | [S] bone_mage c leaves along the spike line 000f0de pending | [S] stoner c forward toss 9a15b0d pending | [P] bone_mage c spike girth 8b32ce8 pending (fallout of 7496412). Evidence commit: capture.mjs flight shot of a short throw taken under half way to the hit (the stoner's boulder was gone from _flight at +9 ticks).
317 (BASE 2676b33): [S] bone_mage c bone spike row 7496412 approved | [S] spear_thrower c stick-and-launch 6f13b5a approved | [S] clubber b two-handed grip 6a1bbe4 approved | [S] protector b no back spear 3fd57a5 approved | [S] bone_mage b upright carry b6bc951 approved | [P] chieftain b stone size 3ce2f90 approved (fallout of 41a51fe). 6/6 approved, no regressions; three criteria flipped: clubber.b, spear_thrower.c, bone_mage.b.
316 (BASE ff65871): 5/5 approved (club mesh 3af648b, stone axe heads 41a51fe, plank shield 77c8352, deer-skull staff 9474ce7, flat javelin a76560b).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.bone_mage (7496412) VERDICT: APPROVE CRITERION: tribal.bone_mage.c FAIL (previous: FAIL) BLOCKERS: struck: 1; 2 kept; 3 rewritten (squire strides among the spikes, never lifted). c FAIL (1 since 315).
- GAP: [S] tribal.spear_thrower (6f13b5a) VERDICT: APPROVE CRITERION: tribal.spear_thrower.c PASS (previous: FAIL) BLOCKERS: struck: 2. List empty; c flips to PASS (317).
- GAP: [S] tribal.clubber (6a1bbe4) VERDICT: APPROVE CRITERION: tribal.clubber.b PASS (previous: FAIL) BLOCKERS: struck: 2. List empty; b flips to PASS (317).
- GAP: [S] tribal.protector (3fd57a5) VERDICT: APPROVE CRITERION: tribal.protector.b FAIL (previous: FAIL) BLOCKERS: struck: 2; 3 (moss) remains. b FAIL (2 since 315).
- GAP: [S] tribal.bone_mage (b6bc951) VERDICT: APPROVE CRITERION: tribal.bone_mage.b PASS (previous: FAIL) BLOCKERS: struck: 2. List empty; b flips to PASS (317).
- GAP: [P] tribal.chieftain (3ce2f90) VERDICT: APPROVE CRITERION: tribal.chieftain.b FAIL (previous: FAIL) BLOCKERS: 2 rewritten (a fat chunk now, about two-thirds of his head across; TABS head-wide). A further [P] on AXE_HEAD rows would be a re-nudge: the rest goes through an [S].
- REGRESSIONS: none
Batch ranked order (critic, 317): protector.b moss chunks (flips b), chieftain.b lashed stone head (flips b), spear_thrower.b spear raised overhead, bone_mage.c leaves along the spike line, stoner.c forward toss, chieftain.a animal-skull helmet, clubber.a hair and beard, spear_thrower.b stone leaf head, mammoth.a brown fur hide, protector.a skull helmet, stoner.a one-shoulder garment, [P] bone_mage.c spike girth (fallout of 7496412, NEXT unit_tribal.bone_mage_struck). Mammoth.c charge keeps its 315 entry.

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
- RESUME 318 AT STEP 5 (the turn was cut off by the usage limit after step 4): all six gaps in Focus are committed and their look shots checked (every element visible); run `capture.mjs --iter 318 --units tribal.protector,tribal.chieftain,tribal.spear_thrower,tribal.stoner,tribal.bone_mage`, then the critic (step 6) with the shas in Focus (chieftain: 83bec0d plus its follow-up commit), verdicts, memory. LEDGER rows and Structural attempts for 318 are already written as pending; unit files' Attempts are not yet written.
- capture.mjs `--units a,b` is comma-separated (a space-separated list only shoots the first). A look of 2-3 units ~3 min, 5 units ~5 min. The capture also writes a "working tree was dirty" note when STATE/LEDGER are mid-edit; harmless.
- Browns and greys go near-black in the capture's shade, and the bone material renders blue-grey: give prop materials an emissive of 0.1-0.2. `node loop/scripts/inspect-prop.mjs <id> [--no-build]` prints every hand mesh and writes output/loop/inspect_<id>_{front,side}.png.
- The animator keys on prop names: a hafted weapon root must match the regex at proceduralAnimation.ts ~1606 (club|blade|handle|...), a caster's staff is "staff" with an "orb" child (id boneStaff = overhead cast + BONE_HOLD planted carry), a shield matches /shield$/. A "club" with an empty off hand is two-handed (_offhandToGrip). The carry eases in over ~0.3 s: a prop that must read in the placement (idle) frame needs _carryTurn = 1 at _buildCarry like the scythe/bone staff/club.
- Two gaps in one file: edit, commit, then edit the next. File edits keep each file's EOL (LF here). Do not chain shell commands. v1 is under loop/archive/v1/, tag loop-v1-final.
