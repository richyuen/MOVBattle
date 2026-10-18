# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 320   Batch: tribal (1/18)   Consecutive empty: 0   Done: 0/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector -+++ o | spear_thrower -+++ o | stoner --++ o | bone_mage -+++ o | chieftain -+++ o | mammoth -+-+ o
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
320 (BASE 548c3fd): [S] spear_thrower b stone leaf head 4e68c1c approved (b -> PASS) | [P] protector a domed cranium 12e7843 approved | [S] chieftain a animal-skull helmet f86e35f approved | [S] stoner a one-shoulder garment 586d90f + f87534f + e16240e approved | [S] protector a one-shoulder garment b077ecf approved | [S] bone_mage a hide cape f5283a1 approved. Stoner c blocker 2 struck (c -> PASS). 6/6 approved, no regressions.
319 (BASE cd9ae05): 5/5 approved (spear stood up c8f0e70, lashing bands c7ea0cc + 8c16992, faceted boulder aa85160, spike loft 33e7601, skull helmet e53ba02; evidence cd9ae05).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.spear_thrower (4e68c1c) VERDICT: APPROVE CRITERION: tribal.spear_thrower.b PASS (previous: FAIL) BLOCKERS: struck: 2 (1 struck 319). List cleared, so b flips to PASS.
- GAP: [P] tribal.protector (12e7843) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 3.
- GAP: [S] tribal.chieftain (f86e35f) VERDICT: APPROVE CRITERION: tribal.chieftain.a FAIL (previous: FAIL) BLOCKERS: 1 narrowed (the skull half is cleared; the beard half remains). Still open: 2, 3, 4.
- GAP: [S] tribal.stoner (586d90f + f87534f + e16240e) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 1, 3
- GAP: [S] tribal.protector (b077ecf) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 3 (neck).
- GAP: [S] tribal.bone_mage (f5283a1) VERDICT: APPROVE CRITERION: tribal.bone_mage.a FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2, 3
- REGRESSIONS: none
Batch ranked order (critic, 320): protector.a critter-skull necklace (finishes the protector), stoner.b charcoal lump ([S] new hull of 2-3 merged chunks; a [P] on BOULDER_* is a ledger reversal), stoner.a long hair, spear_thrower.a tusk headband, spear_thrower.a ornamented loincloth, bone_mage.a ornamented loincloth (shared mechanism), bone_mage.a bone necklace and bracelets, chieftain.a skull pauldrons, chieftain.a beard. Not re-ranked but still open in unit files: chieftain.a hide cape (dressTribalCape), clubber.a hair and beard, mammoth.a fur hide, mammoth.c Mammoth Charge.

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
- 321 starts at step 3 (tribal all audited, none done): up to 5 [S] from the 320 ranked order (2 per unit max, different criteria); no [P] is fallout-listed this time. The protector necklace finishes the protector (only a blocker 3 left).
- Shared tribal dressing lives in unitFactory's bareSkinned branch: hair mop (skipped under bone_mask/antler_skull), furCollar (the dark neck ring), hangSkirt "hideKilt" + pelvis box (the loincloth), dressTribalTunic (TRIBAL_TUNIC_UNITS), dressTribalCape (TRIBAL_CAPE_UNITS). Necklaces, loincloth ornaments and hair replace those per unit id; size off torsoM + _yoke vertices in the torso frame (bounding boxes are stale; the trunk is a box in section).
- Debug aid: a copy of inspect-prop.mjs walking body.torso (not the hands) with four camera yaws found the tunic sizing bug; the look shows placement only from one side. A look's output/loop/look/ is wiped by the next capture; captures share port 4181, inspect uses 4183.
- Browns go near-black in the capture's shade: emissive 0.15-0.2. The animator keys on prop names (club|blade|handle..., "staff"+"orb", /shield$/, "shaft", "boulder"); the javelin's +y runs fist -> elbow.
- Two gaps in one file: edit, commit, then edit the next; stage by path, never -a. Do not chain shell commands. stats.json lives in iter-317. v1 is under loop/archive/v1/, tag loop-v1-final.
