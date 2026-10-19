# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 362   Batch: medieval+tribal:re (4/21)   Consecutive empty: 0   Done: 20/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector -+++ o | spear_thrower -+++ o | stoner -+++ o | bone_mage --++ o | chieftain --++ o | mammoth ---+ o
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
362 (BASE 9fb2a91): [S] protector b stone slab 27256cd+d38d4b0 approved | [S] clubber a ragged loincloth da977ab+20e52ec approved | [S] spear_thrower b flint head cf3ff8b approved | [P] clubber a mop darker/wider e4f3774 approved | [S] stoner a one-strap dress 3834142 approved | [S] bone_mage a mask rack c66c10a approved | [S] bone_mage b staff rack 42d26c9 approved | [S] chieftain b axe re-haft c174af8 approved; king [R] and mammoth deferred

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.protector (27256cd + d38d4b0) VERDICT: APPROVE CRITERION: tribal.protector.b PASS (previous: FAIL)
- GAP: [S] tribal.clubber (da977ab + 20e52ec) VERDICT: APPROVE CRITERION: tribal.clubber.a FAIL (previous: FAIL)
- GAP: [S] tribal.spear_thrower (cf3ff8b) VERDICT: APPROVE CRITERION: tribal.spear_thrower.b PASS (previous: FAIL)
- GAP: [P] tribal.clubber (e4f3774) VERDICT: APPROVE CRITERION: tribal.clubber.a FAIL (previous: FAIL)
- GAP: [S] tribal.stoner (3834142) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL)
- GAP: [S] tribal.bone_mage (c66c10a) VERDICT: APPROVE CRITERION: tribal.bone_mage.a FAIL (previous: FAIL)
- GAP: [S] tribal.bone_mage (42d26c9) VERDICT: APPROVE CRITERION: tribal.bone_mage.b FAIL (previous: FAIL)
- GAP: [S] tribal.chieftain (c174af8) VERDICT: APPROVE CRITERION: tribal.chieftain.b FAIL (previous: FAIL)

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
- king a is plateau (2 rejected [S] since 355): next pick on it is one [R] of the legs from the breeches down (the breeches' gathered hem hung past the knee hinge over the team knee end, slim shin under it); the thigh is not covered by the breeches (361: recolouring it read beige).
- Pick next: chieftain skull helm (idle is front three-quarter now) + off-hand hold upright, protector skull helm, spear tusks, bone_mage staff skull (DEER_MASK profile), stoner strap band + close skirt, clubber stance/curl, mammoth legs and charge (ability at 17 ms: check _ability shot timing first); [P] fallout: DEER_RACK.tan, RAGGED_LOIN.long.
- Evidence owed: unit_tribal.mammoth_idle frames only legs and a tusk; bone_mage_idle: staff rack covers the mask's (judge it in lineup_tribal). King belt buckle hidden in king_idle.
- Light warm cloth: medievalDress warmCloth (own amber emissive) + unglow every mesh in it; a limb under a slim shell must be recoloured too. Tan bone/antler renders grey in the capture's shade: go darker and warmer with more glow.
- Expect re-baselines at the medieval checkpoint: squire/archer stats (351), archer loose and broadhead (354, 358), bard walk, catapult frame/wheels/paint, knight plate+legs+cape, king skirt removed (360).
