# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 337   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 13/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank -+++ o
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
337 (BASE fb7c450): [S] fencer a thigh rolls d8407ce+2e54e8c approved | [S] musketeer a vest hem 780101e approved | [S] jouster a caparison f277bbf approved | [S] da_vinci_tank a scale 1.9x, flat cap 412d16c approved (evidence 09659a9 lineup lastApart)
336 (BASE 6be02ce): 6/6 approved (jouster chanfron, musketeer facial hair + cream [P], fencer boots, halberd tabard, archer doublet).

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.fencer (d8407ce + 2e54e8c) VERDICT: APPROVE CRITERION: renaissance.fencer.a PASS (previous: FAIL) BLOCKERS: struck: 3 (list empty)
- GAP: [S] renaissance.musketeer (780101e) VERDICT: APPROVE CRITERION: renaissance.musketeer.a PASS (previous: FAIL) BLOCKERS: struck: 3 (list empty)
- GAP: [S] renaissance.jouster (f277bbf) VERDICT: APPROVE CRITERION: renaissance.jouster.a PASS (previous: FAIL) BLOCKERS: struck: 1 (list empty)
- GAP: [S] renaissance.da_vinci_tank (412d16c; evidence 09659a9) VERDICT: APPROVE CRITERION: renaissance.da_vinci_tank.a FAIL (previous: FAIL) BLOCKERS: 4 stays (peak above halberdier, ~1.5 men; only level with the rider's helm). REGRESSIONS: none. d PASS 7/7 (stats 337).

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
- Only da_vinci_tank open (a, blocker 4: peak must clear the jouster rider's crest). Picks: [P] DAVINCI_SCALE 1.9 -> 2.3 + scenarios.ts lastApart (fallout of 412d16c, NEXT lineup_renaissance.png); [S] cap as its own hat (eave lip proud, short collar between tiers). When it is D or p: batch checkpoint (step 8), then Batch: farmer.
- getCloth colours grey out under this light: cream/tan needs self-lit cloth (mf.get("cloth", c, {emissiveIntensity})); ~.3 on a deeper tan (.8,.56,.28) reads tan.
- DAVINCI_SCALE grows the "davinci_spin" and "davinci_chassis" nodes (both direct root children; _spinDrum finds the spin node by name); pilot offset in linkedActorPresets.ts is scaled by hand; metrics height = capTop x scale.
- Faction lineups take a cameraOverride and lastApart (scenarios.ts makeFactionGalleryScenario). Thighs stand close (hipOffX): limb dress wider than the hip gap must push outward, not clamp.
- After any --iter capture rerun stats --batch <batch> --iter N. capture needs a clean tree: stash STATE.md around it. Write patches as scratchpad python files with the Write tool; loop md files may be CRLF.
