# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 382   Batch: tribal:re+renaissance:re+farmer:re+ancient (5-8/21)   Consecutive empty: 0   Done: 26/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer -+++ o | sarissa -+++ o | hoplite --++ o | snake_archer ---+ o | ballista ---+ o | minotaur -+-+ o | zeus ---+ o
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
382 (BASE b359959): [S] sarissa a crest bands bc537dc +5dcf082 +f61cdaa approved | [S] hoplite b dory aim e3ebcbd approved (struck b.2) | [S] shield_bearer a legion helm c7d3111 approved (struck a.1) | [S] halfling a mop 1a97f99 +fd22501 approved | [S] minotaur a bull head 4c7d9fb approved (struck a.1) | [S] snake_archer a hood 7a7a3fb approved (struck a.1) | [S] wheelbarrow a hay mound ed5a3b5 rejected, reverted e797cb9

## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.sarissa (bc537dc +5dcf082 +f61cdaa) VERDICT: APPROVE CRITERION: ancient.sarissa.a FAIL (previous: FAIL)
- GAP: [S] ancient.hoplite (e3ebcbd) VERDICT: APPROVE CRITERION: ancient.hoplite.b FAIL (previous: FAIL)
- GAP: [S] ancient.shield_bearer (c7d3111) VERDICT: APPROVE CRITERION: ancient.shield_bearer.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (1a97f99 +fd22501) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (4c7d9fb) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- GAP: [S] ancient.snake_archer (7a7a3fb) VERDICT: APPROVE CRITERION: ancient.snake_archer.a FAIL (previous: FAIL)
- GAP: [S] farmer.wheelbarrow (ed5a3b5) VERDICT: REJECT CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)

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
- Open in the old batches: wheelbarrow a (Thrower back + up, knees wide; probe numbers in its Notes), halfling a ([P] hair + belt fallout; first an evidence commit: _idle shows him turned away). Ancient gaps in its unit files.
- Minotaur Big Headbutt needs an evidence commit first: capture takes the first special event (charge at 17 ms) as _ability. Crest blades: one solid strip per band.
- Flat colour that survives ACES: "unlit" material, emissive red >1 / blue ~0, glow.addExcludedMesh (SCUTUM_TRIM_FLAT). "metal" renders black (no env map): use cloth + glow.
- Melee blows are logged as the attack starts: _release is a tick before the animator's attack; motion shows in _flight. Ancient world-space holds: _levelPike, _carryDory (+thrust), _applyBullFists, _hangFlasks.
- Probes (output/loop/, --build first): probe_shield, _potion, _mino, _wheelbarrow, _halfling, _hoplite, _head. Capture replays are deterministic. Particles do not render on the stepped clock. Never bakeCurrentTransformIntoVertices after parenting. Write node scripts with the Write tool.
