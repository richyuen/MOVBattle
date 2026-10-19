# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 389   Batch: tribal:re+renaissance:re+farmer:re+ancient (5-8/21)   Consecutive empty: 0   Done: 28/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa -+++ o | hoplite ++++ D | snake_archer -+++ o | ballista ---+ o | minotaur -+++ o | zeus -+++ o
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
389 (BASE f31835b): [S] zeus a toga colour fdab7e5 approved (narrowed) | [S] minotaur a girdle f835112 approved (narrowed) | [S] sarissa a collar 9c2d24b approved (narrowed) | [S] snake_archer a headgear d561c70 +0390b63 approved (narrowed) | [S] halfling a foot fur cd0bed8 +b505810 approved (narrowed) | [S] ballista a timber 532010f approved (struck a.2) | [S] ballista b loaded bolt 246a014 approved (struck b.2) | [P] wheelbarrow a knees a63c351 approved (narrowed)

## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.zeus (fdab7e5) VERDICT: APPROVE CRITERION: ancient.zeus.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (f835112) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- GAP: [S] ancient.sarissa (9c2d24b) VERDICT: APPROVE CRITERION: ancient.sarissa.a FAIL (previous: FAIL)
- GAP: [S] ancient.snake_archer (d561c70 +0390b63) VERDICT: APPROVE CRITERION: ancient.snake_archer.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (cd0bed8 +b505810) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] ancient.ballista (532010f) VERDICT: APPROVE CRITERION: ancient.ballista.a FAIL (previous: FAIL)
- GAP: [S] ancient.ballista (246a014) VERDICT: APPROVE CRITERION: ancient.ballista.b FAIL (previous: FAIL)
- GAP: [P] farmer.wheelbarrow (a63c351) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)

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
- Critic 389 ranked: ballista frame taller + flying bolt from BALLISTA_BOLT, zeus rings outside the drape + gold bolt, snake_archer stance + wrap/cord, minotaur flat light scroll inlays, sarissa chunk in cape material, halfling vest, wheelbarrow knees at the Farmer's waist. [P] fallout: HALFLING_TUFT inX 0 clump .8, SARISSA_CHUNK tip .1.
- Grey/washed cloth: SSAO (main.ts, radius 1.5) reads DOUBLESIDE ribbons' inward faces as occlusion; build dress shells one-sided facing out (flipFaces check). PBR colours are linear: an sRGB target c needs ~c^2.2 (wood .62/.3/.2 showed taupe).
- Capture ABILITY_PREF (capture.mjs): minotaur headbutt, snake_archer snake_land (framed on the struck man). stats.json is written by stats.mjs, not capture: rerun stats --iter N after the last capture.
- Flat colour that survives ACES: "unlit" material, emissive red >1 / blue ~0, glow.addExcludedMesh. "metal" renders black: use cloth + glow. Generic tunicSkirt covers waist gear: exclude the unit in unitFactory's skirt condition.
- Probes (output/loop/, --build first): probe_bbox (--unit --pat --frame=torso --ylo --yhi: vertex bboxes), probe_zeus_shot (--unit --aim=head|torso|root --dist --yaw: close-up PNGs), probe_zeus, _mat, _near, _mino, _halfling, _wheelbarrow, _sarissa.
