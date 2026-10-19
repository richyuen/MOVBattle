# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 359   Batch: medieval (4/21)   Consecutive empty: 0   Done: 25/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire -+++ o | archer -+++ o | healer ++++ D | knight ++++ D | catapult ++++ D | king -+++ o
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
359 (BASE 46c19a5): [S] archer a hood cdc15b5+e8bbf78 approved | [S] healer a turned collar 1173ec2 approved | [S] knight a plate legs 3dd532f approved | [S] king a dress re-land 44f8443 approved | [S] archer a sleeves a43c08b rejected (reverted f1af07a) | [S] knight a cape cut d2850fe approved | [S] king a beard 8801b8c approved | [P] squire a sleeve tone caa7905 rejected (reverted e6c54e8)

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.archer (cdc15b5 + e8bbf78) VERDICT: APPROVE CRITERION: medieval.archer.a FAIL (previous: FAIL)
- GAP: [S] medieval.healer (1173ec2) VERDICT: APPROVE CRITERION: medieval.healer.a PASS (previous: FAIL)
- GAP: [S] medieval.knight (3dd532f) VERDICT: APPROVE CRITERION: medieval.knight.a FAIL (previous: FAIL)
- GAP: [S] medieval.king (44f8443) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL)
- GAP: [S] medieval.archer (a43c08b) VERDICT: REJECT CRITERION: medieval.archer.a FAIL (previous: FAIL)
- GAP: [S] medieval.knight (d2850fe) VERDICT: APPROVE CRITERION: medieval.knight.a PASS (previous: FAIL)
- GAP: [S] medieval.king (8801b8c) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL)
- GAP: [P] medieval.squire (caa7905) VERDICT: REJECT CRITERION: medieval.squire.a FAIL (previous: FAIL)

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
- Light cloth greys out: archer's tan sleeve shell (359) and squire's beige sleeves render neutral grey while brown leather renders brown. First step: read the sleeve material back in the browser (later arm repaint in unitFactory? cloth cache key?); likely the king's stockings too.
- Arm/leg dress over the tabard block's mail must be shells (limbShell, shellStripes), not recolours: dressMedieval runs before unitFactory paints the arms.
- One-sided custom meshes get culled from outside (archer hood until 359): wind both ways (slab helper, hood shell).
- Expect re-baselines at the medieval checkpoint: squire/archer stats (351), archer loose and broadhead arrow (354, 358), bard walk, catapult frame/wheels/paint, knight plate+legs+cape.
- tribal:re, renaissance:re, farmer:re follow medieval: full re-audits of the done batches under the new angles (ITERATE step 2).
