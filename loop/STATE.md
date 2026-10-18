# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 335   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 8/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer -+++ o | balloon_archer -+++ o | musketeer -+++ o | halberd -+++ o | jouster -+++ o | da_vinci_tank -+++ o
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
335 (BASE 9ab6968): [S] halberd c blow held down 8899946 approved | [S] jouster a plate rider 909f200 + e5e55bd approved | [S] painter a cravat 15c41f6 + 6dfd9bc approved | [S] fencer a hair and moustache 370f635 approved | [S] musketeer a vest and blouse f5030a9 approved.
334 (BASE b4b44b1): 4/6 approved (halberd chop onto, jouster heater, jouster drape, fencer doublet); da vinci roof [S] and painter jabot colour [P] rejected.

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.halberd (8899946) VERDICT: APPROVE CRITERION: renaissance.halberd.c PASS (previous: FAIL) BLOCKERS: struck: 3 (none remain)
- GAP: [S] renaissance.jouster (909f200 + e5e55bd) VERDICT: APPROVE CRITERION: renaissance.jouster.a FAIL (previous: FAIL) BLOCKERS: struck: 3. Remaining: 1, 2
- GAP: [S] renaissance.painter (15c41f6 + 6dfd9bc) VERDICT: APPROVE CRITERION: renaissance.painter.a PASS (previous: FAIL) BLOCKERS: struck: 2 (none remain)
- GAP: [S] renaissance.fencer (370f635) VERDICT: APPROVE CRITERION: renaissance.fencer.a FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 3, 4
- GAP: [S] renaissance.musketeer (f5030a9) VERDICT: APPROVE CRITERION: renaissance.musketeer.a FAIL (previous: FAIL) BLOCKERS: 3 partly cleared, narrowed (cream reads white, vest has no hem); 2 remains. REGRESSIONS: none. d PASS 7/7 (stats 335).

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
- Open picks: jouster a chanfron then horse body [S], musketeer a facial hair (reuse curledMoustache + goatee) [S], fencer a boots then paned breeches [S], halberd a self-lit tabard + proud belt [S], balloon_archer a striped doublet [S], da vinci a whole-machine scale [S] (one more rejected [S] = plateau); [P] fallout: musketeer cream tone (335), fencer puffed panes (334).
- getCloth colours grey out under this light: cream/tan needs self-lit cloth (mf.get("cloth", c, {emissiveIntensity})); too much glow reads white (musketeer .25 on pale cream). ~.3 on a deeper tan (.8,.56,.28) read tan (painter 335).
- A ranged shot fires at the very start of its attack: a release pose must be up before the attack (see _aimMusket). Props stand in the world (Matrix.FromXYZAxesToRef); last-layer overrides (_lungeLegs, _holdChopDown) beat the pose stack.
- The da Vinci vehicle root is not scaled by proportions.scale 2.0; its lineup height is the raw DAVINCI_ROOF metres. Faction lineups take a cameraOverride (scenarios.ts makeFactionGalleryScenario).
- After any --iter capture rerun stats --batch <batch> --iter N. capture --units (look) needs a clean tree: stash STATE.md around it, and never `git commit -a` while STATE is dirty. Write patches as scratchpad python files (bash heredocs choke).
