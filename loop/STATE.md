# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 324   Batch: tribal (1/18)   Consecutive empty: 0   Done: 5/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
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
324 (BASE 319dba1): [S] chieftain a hide cape 74de196 approved | [S] clubber a tusk necklace 54f0b6b approved | [S] mammoth a mane 6d8c95a approved | [P] chieftain a scale 1.15 d2396d7 approved (a -> PASS, chieftain D). 4/4 approved, no regressions.
323 (BASE c272b72): 5/5 approved (clubber loincloth, spear_thrower fang necklace -> D, chieftain beard, mammoth hide + Mammoth Charge).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.chieftain (74de196) VERDICT: APPROVE CRITERION: tribal.chieftain.a FAIL (previous: FAIL) BLOCKERS: struck: 3. Remaining: 4 (struck by d2396d7 below).
- GAP: [S] tribal.clubber (54f0b6b) VERDICT: APPROVE CRITERION: tribal.clubber.a FAIL (previous: FAIL) BLOCKERS: struck: 3. Remaining: 4.
- GAP: [S] tribal.mammoth (6d8c95a) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL) BLOCKERS: struck: 3. Remaining: 2, 4.
- GAP: [P] tribal.chieftain (d2396d7) VERDICT: APPROVE CRITERION: tribal.chieftain.a PASS (previous: FAIL) BLOCKERS: struck: 4. List is empty.
- REGRESSIONS: none
Batch ranked order (critic, 324): clubber.a bracelets (BRACELETS), mammoth.a ankle bands (legCuff), mammoth.a face marking (brow stripe down the trunk). No [P] ranked.

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
- 325 starts at step 3: clubber bracelets + one mammoth gap (ankle bands first; both mammoth gaps are on a, so one per iteration). If both clear their lists, the units go D and the batch checkpoint (step 8) runs, then Batch advances to farmer.
- Tribal ornaments live in web/src/units/tribalDress.ts (NECKLACES incl. "tusks", hornOnRope, HAIR_STYLES, tribalBeard, LOINCLOTHS, BRACELETS, PAULDRONS); tunic and cape are unitFactory (dressTribalTunic, dressTribalCape, TRIBAL_CAPE_UNITS).
- Mammoth: buildMammoth (vehicleBuilder ~1385), mammoth-only branches key on hide === MAMMOTH_HIDE; the sacred elephant reuses it and shaves by mesh name (ELEPHANT_SHAVED). Leg cuffs: "legCuff" on hipJoint (shaggyFur); brow paint "browPaint" (paintMat).
- Capture shade greys warm browns: dark saturated base with emissive 0.1 reads brown. Chieftain _idle is now a side view; his cape shows best in _windup.
- capture.mjs --units takes a comma list (a,b), not spaces. Two gaps in one file: edit, commit, then the next; stage by path. stats.json lives in iter-317.
