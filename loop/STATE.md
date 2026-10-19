# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 380   Batch: tribal:re+renaissance:re+farmer:re+ancient (5-8/21)   Consecutive empty: 0   Done: 24/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller +-++ o | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer --++ o | sarissa -+++ o | hoplite ---+ o | snake_archer ---+ o | ballista ---+ o | minotaur -+-+ o | zeus ---+ o
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
380 (BASE 3474541): [S] potion_seller b flask hang re-land e6efab4 approved | [S] shield_bearer b scutum chin-shin (holeUp fix) f87fef0 approved | [S] hoplite b dory low 41000a8 +dcff49a approved | [S] mammoth a crest on the dome 61181b3 approved (a.3 struck) | [S] wheelbarrow a low rim + seats fe764b2 +f78cb48 approved | [S] halfling a sleeved jacket b0e0351 +b52f817 approved (a.1 struck) | [S] sarissa c back-up 9789cbd approved (c PASS)

## Last verdicts (critic header lines verbatim)
- GAP: [S] farmer.potion_seller (e6efab4) VERDICT: APPROVE CRITERION: farmer.potion_seller.b FAIL (previous: FAIL)
- GAP: [S] ancient.shield_bearer (f87fef0) VERDICT: APPROVE CRITERION: ancient.shield_bearer.b FAIL (previous: FAIL)
- GAP: [S] ancient.hoplite (41000a8 + dcff49a) VERDICT: APPROVE CRITERION: ancient.hoplite.b FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (61181b3) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] farmer.wheelbarrow (fe764b2 + f78cb48) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (b0e0351 + b52f817) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] ancient.sarissa (9789cbd) VERDICT: APPROVE CRITERION: ancient.sarissa.c PASS (previous: FAIL)

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
- Open in the old batches: mammoth a (tail only), potion_seller b (teal liquid inside the glass; POTION_GLASS locked), wheelbarrow a (Thrower knees to world targets outside the Farmer), halfling a (belt/vest, shins, hair). Ancient gaps in its unit files.
- unitFactory keeps a prop root's metadata.holeUp (scutum hold); other prop metadata is still replaced by { runtimeUnit }. Orange trims render tan under "cloth": try a flat self-lit material path, not a colour nudge.
- Ancient cloth/hair/gear in web/src/units/ancientDress.ts. World-space holds in the animator: _levelPike, _carryDory, _applyBullFists, _hangFlasks (all via _heading()).
- Scripts take faction names: --batch farmer for farmer:re. Probes: output/loop/probe_shield.mjs, probe_potion.mjs, probe_mino.mjs (--build first).
- Capture replays are deterministic. Particles do not render on the stepped clock. Never bakeCurrentTransformIntoVertices after parenting. Write node scripts with the Write tool.
