# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 373   Batch: tribal:re+renaissance:re (5-6/21)   Consecutive empty: 0   Done: 23/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower -+++ o | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter -+++ o | fencer -+++ o | balloon_archer ++++ D | musketeer ++++ D | halberd -+++ o | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
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
373 (BASE 2703401; evidence 7c27b4e painter spars with an archer): [S] balloon_archer a flat-brim hat 23dc915 approved | [S] fencer a wings+belt+tabs 909da65+a7d213f+8669b5c approved | [S] spear_thrower a loincloth cd8403d+bdad788+483efeb approved | [S] painter a beret tam 6b5ac3c approved | [S] halberd a rest grip a10c9e5 approved | [S] protector a window face plate 41cba1a approved | [S] painter c Painter Dodge 89dc959 approved | [P] painter a jabot b30db36 approved

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.balloon_archer (23dc915) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.a PASS (previous: FAIL)
- GAP: [S] renaissance.fencer (909da65 +a7d213f +8669b5c) VERDICT: APPROVE CRITERION: renaissance.fencer.a FAIL (previous: FAIL)
- GAP: [S] tribal.spear_thrower (cd8403d +bdad788 +483efeb) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a FAIL (previous: FAIL)
- GAP: [S] renaissance.painter (6b5ac3c) VERDICT: APPROVE CRITERION: renaissance.painter.a FAIL (previous: FAIL)
- GAP: [S] renaissance.halberd (a10c9e5) VERDICT: APPROVE CRITERION: renaissance.halberd.a FAIL (previous: FAIL)
- GAP: [S] tribal.protector (41cba1a) VERDICT: APPROVE CRITERION: tribal.protector.a PASS (previous: FAIL)
- GAP: [S] renaissance.painter (89dc959) VERDICT: APPROVE CRITERION: renaissance.painter.c PASS (previous: FAIL)
- GAP: [P] renaissance.painter (b30db36) VERDICT: APPROVE CRITERION: renaissance.painter.a FAIL (previous: FAIL)

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
- First: evidence commit re-aiming unit_renaissance.halberd_idle off the navy backdrop boulder (critic 373: blocker 1 is the rock), then ask the critic to strike it.
- Then: halberd shoes, spear_thrower stance + [P] flap colour, painter figure (sweater to the hip, longer legs), fencer rolls lowered under near-straight tabs, mammoth leg tops under a hull skirt (one more reject plateaus mammoth.a).
- Look shots can lie by omission: probe world extents before a second blind tweak (373: fencer tabs inside the thigh rolls, spear flap behind the skull). Probe: copy inspect-prop.mjs, filter meshes by name, delete after.
- Capture replays are deterministic. Particles do not render on the stepped clock. Team cloth glow .2 washes to lavender; pale tans merge with bone.
- Never bakeCurrentTransformIntoVertices after parenting. Bash heredocs with quotes/backticks break: write node scripts with the Write tool. printf %s args keep %% literal.
