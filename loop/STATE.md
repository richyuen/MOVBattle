# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 322   Batch: tribal (1/18)   Consecutive empty: 0   Done: 3/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector ++++ D | spear_thrower -+++ o | stoner ++++ D | bone_mage ++++ D | chieftain -+++ o | mammoth -+-+ o
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
322 (BASE 89ee7f7): [S] spear_thrower a loincloth 076f7fd approved | [S] stoner a bone necklace 55b683b approved (a -> PASS, stoner D) | [S] bone_mage a bone necklace + bracelets a79b80b approved (a -> PASS, bone_mage D) | [P] spear_thrower a tusks 8acb32d approved | [S] chieftain a skull pauldrons dfa7bbc approved | [S] clubber a hair and beard 940436d approved. 6/6 approved, no regressions.
321 (BASE 7e45d55): 5/5 approved (protector necklace, stoner lump + hair, spear_thrower tusk band, bone_mage loincloth).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.spear_thrower (076f7fd) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a FAIL (previous: FAIL) BLOCKERS: struck: 2 (ornamented loincloth); struck: 4 (see 8acb32d); remaining: 3.
- GAP: [S] tribal.stoner (55b683b) VERDICT: APPROVE CRITERION: tribal.stoner.a PASS (previous: FAIL) BLOCKERS: struck: 3. List cleared.
- GAP: [S] tribal.bone_mage (a79b80b) VERDICT: APPROVE CRITERION: tribal.bone_mage.a PASS (previous: FAIL) BLOCKERS: struck: 3. List cleared.
- GAP: [P] tribal.spear_thrower (8acb32d) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a FAIL (previous: FAIL) BLOCKERS: struck: 4 (tusks reading as horns); remaining: 3 (fang necklace)
- GAP: [S] tribal.chieftain (dfa7bbc) VERDICT: APPROVE CRITERION: tribal.chieftain.a FAIL (previous: FAIL) BLOCKERS: struck: 2 (skull pauldrons); remaining: 1, 3, 4.
- GAP: [S] tribal.clubber (940436d) VERDICT: APPROVE CRITERION: tribal.clubber.a FAIL (previous: FAIL) BLOCKERS: struck: 1 (hair and beard); remaining: 2, 3, 4.
- REGRESSIONS: none
Batch ranked order (critic, 322): clubber.a loincloth (add to LOINCLOTHS), spear_thrower.a fang necklace ("fang" style), chieftain.a chestnut beard (BEARD chunk), clubber.a tusk necklace ("tusks" style), chieftain.a hide cape (dressTribalCape). No [P] this round. Still open in unit files: clubber.a bracelets, chieftain.a scale; mammoth.a fur hide, mammoth.c Mammoth Charge.

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
- 323 starts at step 3: up to 5 [S] from the 322 ranked order (2 per unit max, different criteria: clubber and chieftain each have only a open, so one each), then mammoth.a fur hide and mammoth.c Mammoth Charge (two criteria, both pickable).
- Tribal ornaments live in web/src/units/tribalDress.ts (boneSkull, boneStick, trunkBand, NECKLACES critter_skulls/bones, HAIR_STYLES long/long_beard/tusk_band, LOINCLOTHS, BRACELETS, PAULDRONS), wired in unitFactory's bareSkinned branch; a unit in NECKLACES drops its furCollar. Tunic and cape are still unitFactory (dressTribalTunic, dressTribalCape).
- Babylon CreateIcoSphere subdivisions 0 means the default 4: use 1 for a twenty-face solid. Browns go near-black in the capture shade: emissive 0.15-0.2.
- _idle is from behind/side for clubber and chieftain: face ornaments (beard) show in lineup_tribal, which every --units capture also shoots.
- Two gaps in one file: edit, commit, then edit the next; stage by path, never -a. Do not chain shell commands. stats.json lives in iter-317.
