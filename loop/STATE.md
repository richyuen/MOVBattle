# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 334   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter -+++ o | fencer -+++ o | balloon_archer -+++ o | musketeer -+++ o | halberd -+-+ o | jouster -+++ o | da_vinci_tank -+++ o
farmer: halfling ???? q | farmer ???? q | hay_baler ???? q | potion_seller ???? q | harvester ???? q | wheelbarrow ???? q | scarecrow ???? q
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
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
334 (BASE b4b44b1): [S] halberd c chop onto the man b6a163f approved | [S] jouster b heater upright 69073a5 approved | [S] jouster a domed drape 73fd09c + ea5c8af approved | [S] da_vinci_tank a taller roof by pitch 519d913 + 52df144 rejected (reverted eff2731, bbb8e18) | [S] fencer a doublet and breeches c58861e approved | [P] painter a jabot colour 135a0e6 rejected (reverted 7278234).
333 (BASE 84f6665): 5/5 approved (fencer lunge legs, jouster level lance, balloon arrow ball, painter jabot, halberd dress) + evidence 04ea157.

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.halberd (b6a163f) VERDICT: APPROVE CRITERION: renaissance.halberd.c FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 3
- GAP: [S] renaissance.jouster (69073a5) VERDICT: APPROVE CRITERION: renaissance.jouster.b PASS (previous: FAIL) BLOCKERS: struck: 3 (list empty)
- GAP: [S] renaissance.jouster (73fd09c + ea5c8af) VERDICT: APPROVE CRITERION: renaissance.jouster.a FAIL (previous: FAIL) BLOCKERS: 1 re-worded (hem in, still a slab), 2, 3
- GAP: [S] renaissance.da_vinci_tank (519d913 + 52df144) VERDICT: REJECT CRITERION: renaissance.da_vinci_tank.a FAIL (previous: FAIL) BLOCKERS: 4 not struck (witch-hat cone, spike cap)
- GAP: [S] renaissance.fencer (c58861e) VERDICT: APPROVE CRITERION: renaissance.fencer.a FAIL (previous: FAIL) BLOCKERS: 3 re-worded (doublet in; breeches read as a kilt), 2, 4
- GAP: [P] renaissance.painter (135a0e6) VERDICT: REJECT CRITERION: renaissance.painter.a FAIL (previous: FAIL) BLOCKERS: 2 (no visible change). REGRESSIONS: none. d PASS 7/7 (stats 334).

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
- Open picks: halberd c blow held down ([S], not a CHOP [P]), jouster a plate rider / chanfron / drape open at the chest, fencer a hair+moustache / boots, painter a self-lit cravat [S], halberd a self-lit tabard [S], musketeer a facial hair / vest, balloon_archer a striped doublet, da vinci a whole-machine scale [S] (one more rejected [S] = plateau); [P] fencer puffed panes (FENCER_DRESS).
- getCloth colours grey out under this light whatever the tint (334 painter [P] showed no change): warm cream/tan needs a self-lit material (mat(scene, colour, glow) as HORSE_DRAPE), an [S].
- A ranged shot fires at the very start of its attack: a release pose must be up before the attack (see _aimMusket). Props stand in the world (Matrix.FromXYZAxesToRef) as _poseHalberd/_holdHeater/_aimMusket do; last-layer overrides (_lungeLegs) beat the pose stack.
- The da Vinci vehicle root is not scaled by proportions.scale 2.0; its lineup height is the raw DAVINCI_ROOF metres. Faction lineups take a cameraOverride (scenarios.ts makeFactionGalleryScenario).
- After any --iter capture rerun stats --batch <batch> --iter N. capture needs a clean tree. Write memory files with the Write tool + a python script (bash heredocs choke on long quoted text). LEDGER tribal rows compacted 334.
