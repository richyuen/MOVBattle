# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 321   Batch: tribal (1/18)   Consecutive empty: 0   Done: 1/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector ++++ D | spear_thrower -+++ o | stoner -+++ o | bone_mage -+++ o | chieftain -+++ o | mammoth -+-+ o
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
321 (BASE 7e45d55): [S] protector a critter-skull necklace 3adbe16 + aec9799 approved (a -> PASS, protector D) | [S] stoner b charcoal lump 7f4d666 + 1595032 approved (b -> PASS) | [S] stoner a long hair 7fe93b7 + 2f5823c approved | [S] spear_thrower a tusk headband 36befcc approved (blocker 4 added: tusks read as horns) | [S] bone_mage a ornamented loincloth 3fd478f approved. 5/5 approved, no regressions.
320 (BASE 548c3fd): 6/6 approved (spear leaf head 4e68c1c, protector cranium 12e7843, chieftain skull helmet f86e35f, stoner garment 586d90f+, protector garment b077ecf, bone_mage cape f5283a1).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.protector (3adbe16 + aec9799) VERDICT: APPROVE CRITERION: tribal.protector.a PASS (previous: FAIL) BLOCKERS: struck: 3 (critter-skull necklace). List empty → a PASS; with b, c, d PASS the unit is done.
- GAP: [S] tribal.stoner (7f4d666 + 1595032) VERDICT: APPROVE CRITERION: tribal.stoner.b PASS (previous: FAIL) BLOCKERS: struck: 1 (charcoal lump). Blocker 2 was already struck. List empty → b PASS.
- GAP: [S] tribal.stoner (7fe93b7 + 2f5823c) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL) BLOCKERS: struck: 1 (long hair). Remaining: 3.
- GAP: [S] tribal.spear_thrower (36befcc) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2, 3; added: 4 (tusks read as horns, introduced by 36befcc).
- GAP: [S] tribal.bone_mage (3fd478f) VERDICT: APPROVE CRITERION: tribal.bone_mage.a FAIL (previous: FAIL) BLOCKERS: struck: 2 (ornamented loincloth). Remaining: 3.
- REGRESSIONS: none
Batch ranked order (critic, 321): spear_thrower.a loincloth (add to LOINCLOTHS), stoner.a bone necklace ("bones" style), spear_thrower.a fang necklace ("fang" style), bone_mage.a bone necklace + wrist bracelets; then [P] spear_thrower.a tusks (fallout of 36befcc: TUSK_BAND rise 0.65, thick 0.4, shows in _idle). Still open in unit files: chieftain.a skull pauldrons, beard, hide cape, scale; clubber.a hair and beard; mammoth.a fur hide, mammoth.c Mammoth Charge.

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
- 322 starts at step 3: up to 5 [S] from the 321 ranked order (2 per unit max, different criteria) plus the one fallout [P] on TUSK_BAND. Spear_thrower has only criterion a open, so take one of its two [S] per iteration.
- Tribal ornaments live in web/src/units/tribalDress.ts (boneSkull, boneStick, trunkBand, dressTribalNecklace/NECKLACES, dressTribalHair/HAIR_STYLES, tuskBand, dressTribalLoincloth/LOINCLOTHS), wired in unitFactory's bareSkinned branch; a unit in NECKLACES drops its furCollar. Tunic and cape are still unitFactory (dressTribalTunic, dressTribalCape).
- Babylon CreateIcoSphere subdivisions 0 means the default 4 (a fine ball): use 1 for a twenty-face solid. Browns go near-black in the capture shade: emissive 0.15-0.2.
- Close-ups: a temporary copy of inspect-prop.mjs (frameCamera dist ~2.2, four yaws; yaw pi is his front) shows ornaments the side-on _idle cannot; delete the copy before committing. Captures share port 4181, inspect 4183.
- Two gaps in one file: edit, commit, then edit the next; stage by path, never -a. Do not chain shell commands. stats.json lives in iter-317. v1 is under loop/archive/v1/, tag loop-v1-final.
