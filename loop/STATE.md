# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 385   Batch: tribal:re+renaissance:re+farmer:re+ancient (5-8/21)   Consecutive empty: 0   Done: 28/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa -+++ o | hoplite ++++ D | snake_archer ---+ o | ballista ---+ o | minotaur -+-+ o | zeus -+-+ o
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
385 (BASE 522cb46): [S] shield_bearer a sandals 9c57271 approved (a PASS, D) | [S] hoplite a crest box f6b09dd +79ce333 approved (a PASS, D) | [S] sarissa a eye slots fd2a912 approved (narrowed) | [S] snake_archer b nocked snake 100ea4a approved (struck c.1) | [S] minotaur a pauldron shell 3131dbb +ac045b2 approved | [S] zeus a toga 3d11834 approved

## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.shield_bearer (9c57271) VERDICT: APPROVE CRITERION: ancient.shield_bearer.a PASS (previous: FAIL)
- GAP: [S] ancient.hoplite (f6b09dd +79ce333) VERDICT: APPROVE CRITERION: ancient.hoplite.a PASS (previous: FAIL)
- GAP: [S] ancient.sarissa (fd2a912) VERDICT: APPROVE CRITERION: ancient.sarissa.a FAIL (previous: FAIL)
- GAP: [S] ancient.snake_archer (100ea4a) VERDICT: APPROVE CRITERION: ancient.snake_archer.b FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (3131dbb +ac045b2) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- GAP: [S] ancient.zeus (3d11834) VERDICT: APPROVE CRITERION: ancient.zeus.a FAIL (previous: FAIL)

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
- Open in the old batches: wheelbarrow a (Thrower back + up, knees wide; probe numbers in its Notes), halfling a (evidence first: 383 _idle pitch PI/2.9 too steep; then belt [S], feet [P]). Ancient gaps in its unit files (critic 385 ranked: sarissa nose guard up between the eyes, zeus bare legs + strapSandals, sarissa cape collar, zeus toga to the belt, minotaur scrolled belt, snake summon). Ballista operator needs an _idle framed on the machine's rear first.
- Minotaur Big Headbutt needs an evidence commit first: capture takes the first special event (charge at 17 ms) as _ability.
- Flat colour that survives ACES: "unlit" material, emissive red >1 / blue ~0, glow.addExcludedMesh. "metal" renders black: use cloth + glow. Vehicle wrapAsBody team-tints every mesh sharing its main mesh's material.
- Melee blows are logged as the attack starts: _release is a tick before the animator's attack; motion shows in _flight. trunkBand on a thin slice of a box trunk falls back to an oversized box: use trunkBand(body,0,1).
- Probes (output/loop/, --build first): probe_shield, _potion, _mino, _wheelbarrow, _halfling, _hoplite, _head, _sarissa (--unit= --pat=), _local (torso-local extents). Particles do not render on the stepped clock. Write node scripts with the Write tool.
