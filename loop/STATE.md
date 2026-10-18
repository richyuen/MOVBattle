# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 319   Batch: tribal (1/18)   Consecutive empty: 0   Done: 0/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector -+++ o | spear_thrower --++ o | stoner ---+ o | bone_mage -+++ o | chieftain -+++ o | mammoth -+-+ o
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
319 (BASE cd9ae05 after the evidence commit): [S] spear_thrower b spear stood up out of the fist c8f0e70 approved | [S] chieftain b lashing bands c7ea0cc + 8c16992 approved (b -> PASS) | [S] stoner b faceted boulder cradled two-handed aa85160 approved | [S] bone_mage c spike loft 33e7601 approved (c -> PASS) | [S] protector a skull helmet e53ba02 approved. Evidence cd9ae05: a short throw's _struck from the far rig at impact+9. 5/5 approved, no regressions.
318 (BASE e14fd1c): 5/6 approved (moss chunks af37ab3, lashed stone head 83bec0d + 069541b, forward toss 9a15b0d, leaves along the spike line 000f0de, [P] spike girth 8b32ce8; spear raised overhead b194791 rejected and reverted 62d30bf).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.spear_thrower (c8f0e70) VERDICT: APPROVE CRITERION: tribal.spear_thrower.b FAIL (previous: FAIL) BLOCKERS: struck: 1 (spear stood up out of the fist, arm straight up). Remaining: 2
- GAP: [S] tribal.chieftain (c7ea0cc + 8c16992) VERDICT: APPROVE CRITERION: tribal.chieftain.b PASS (previous: FAIL) BLOCKERS: struck: 3 (lashing bands); 1 and 2 struck earlier (316, 318). List empty: b PASS.
- GAP: [S] tribal.stoner (aa85160) VERDICT: APPROVE CRITERION: tribal.stoner.b FAIL (previous: FAIL) BLOCKERS: struck: 2 (both hands on the rock's sides before the belly). Remaining: 1 half cleared (faceted and wider than the torso, but an even twenty-face solid in mid grey)
- GAP: [S] tribal.bone_mage (33e7601) VERDICT: APPROVE CRITERION: tribal.bone_mage.c PASS (previous: FAIL) BLOCKERS: struck: 3 (spike loft); 1 and 2 struck earlier (317, 318). List empty: c PASS.
- GAP: [S] tribal.protector (e53ba02) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL) BLOCKERS: none struck. Remaining: 1 half cleared (pale bone with sockets and a snout, but a flat wide lid, not a cranium over the top half of the head), 2, 3
- REGRESSIONS: none
Batch ranked order (critic, 319): spear_thrower.b stone leaf head, [P] protector.a domed cranium (SKULL_FACETED.tall 0.85 -> 1.6, under 0.35 -> 0.7; fallout of e53ba02), [P] stoner.b irregular charcoal chunk (BOULDER_JITTER 0.2 -> 0.35, BOULDER_COLOR -> (0.2, 0.17, 0.15); fallout of aa85160), chieftain.a animal-skull helmet (the domed SKULL_FACETED over the crown above the beard), stoner.a one-shoulder garment, protector.a one-shoulder garment (same tunic mechanism), bone_mage.a hide cape, chieftain.a hide cape (same cape mechanism), clubber.a hair and beard, spear_thrower.a tusk headband, mammoth.a brown fur hide, mammoth.c Mammoth Charge. Stoner.c blocker 2: the critic says the re-aimed _struck reads cleared, to be struck at its next review.

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
- 320 starts at step 3 (all tribal units audited, none done): take up to 5 [S] from the 319 ranked order (2 per unit max, different criteria) and 1 [P] (either protector.a domed cranium or stoner.b charcoal chunk; both are fallout of 319 [S]). The two b/a [P]s are the critic's own numbers; the [S] after them: chieftain.a helmet should reuse SKULL_FACETED, so do the protector [P] first in the same iteration.
- Shared mechanisms the critic ranked twice: a one-shoulder tunic chunk (stoner.a, protector.a) and a hide cape wedge (bone_mage.a, chieftain.a); one mechanism in propBuilder, each unit's gap its own commit.
- A look's output/loop/look/ is wiped by the next capture run: read a look's shots before starting another. Two captures cannot run at once (one preview port 4181); inspect-prop.mjs uses 4183 and `--no-build` serves the last capture's build, so it can run beside a capture. A look of 3 units ~4 min. Browns and greys go near-black in the capture's shade: prop materials get an emissive of 0.1-0.2.
- The animator keys on prop names: a hafted weapon root must match the regex at proceduralAnimation.ts ~1620 (club|blade|handle|...), a caster's staff is "staff" with an "orb" child, a shield matches /shield$/; the javelin is "shaft" (_javelin/_standJavelin), the boulder "boulder" (_carryBoulder). A prop that must read in the placement frame needs _carryTurn = 1 at _buildCarry.
- Two gaps in one file: edit, commit, then edit the next; stage by path, never -a (STATE/LEDGER stay dirty). Do not chain shell commands. stats.json lives in the last iteration that ran stats.mjs (iter-317). v1 is under loop/archive/v1/, tag loop-v1-final.
