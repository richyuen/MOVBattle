# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 360   Batch: medieval+tribal:re (4/21)   Consecutive empty: 0   Done: 20/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber --++ o | protector --++ o | spear_thrower --++ o | stoner -+++ o | bone_mage --++ o | chieftain --++ o | mammoth ---+ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king -+++ o
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
360 (BASE 61a9760): [S] squire a sleeve material ca82190+def8b50 approved | [S] archer a sleeve material 6c6eb29+3d9f92d approved | [S] king a blouse/breeches/stockings 774e5c3+0dd77b3 approved; tribal:re audited (tail overlap, 3 pickable medieval [S])

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.squire (ca82190 + def8b50) VERDICT: APPROVE CRITERION: medieval.squire.a PASS (previous: FAIL)
- GAP: [S] medieval.archer (6c6eb29 + 3d9f92d) VERDICT: APPROVE CRITERION: medieval.archer.a PASS (previous: FAIL)
- GAP: [S] medieval.king (774e5c3 + 0dd77b3) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL)

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
- Pick from both batches: king a slim stockings, then tribal ranked gaps (chieftain off-hand axe, stoner hair, clubber club, bone_mage skull mask, protector shield hold, mammoth charge, spear head). Tribal evidence of the audit: output/loop/iter-360-tribal/.
- Evidence commits owed (critic 360 DEFECTs): unit_tribal.chieftain_idle shot from behind his weapon side; unit_tribal.mammoth_idle frames only legs and a tusk. King's belt buckle hidden in king_idle.
- Light warm cloth greys under the cool hemi ground light + ACES (material readback 360: nothing repaints it): use medievalDress warmCloth (own amber emissive) and unglow every mesh in it, or the glow layer haloes it. A limb under a slim shell must be recoloured too.
- Arm/leg dress over the tabard block's mail must be shells (limbShell), not recolours; one-sided custom meshes get culled from outside (wind both ways).
- Expect re-baselines at the medieval checkpoint: squire/archer stats (351), archer loose and broadhead (354, 358), bard walk, catapult frame/wheels/paint, knight plate+legs+cape, king skirt removed (360).
