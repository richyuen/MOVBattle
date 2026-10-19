# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 374   Batch: tribal:re+renaissance:re (5-6/21)   Consecutive empty: 0   Done: 26/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd -+++ o | jouster ++++ D | da_vinci_tank ++++ D
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
374 (BASE e35255b; evidence 6b5cef8 halberd idle from his other side): [S] halberd a shoes b46132a approved | [S] spear_thrower a stance 9fcac3a approved | [S] painter a sweater to the hip 0ee7192 approved | [S] fencer a tabs bent close 0118f84 approved | [S] mammoth a hull skirt 79f4083+6910ac7 approved | [P] spear_thrower a flap colour 5780739 approved

## Last verdicts (critic header lines verbatim)
- RE-AUDIT renaissance.halberd (evidence 6b5cef8): blocker 1 struck; UNIT renaissance.halberd: a FAIL b PASS c PASS d PASS (3/4)
- GAP: [S] renaissance.halberd (b46132a) VERDICT: APPROVE CRITERION: renaissance.halberd.a FAIL (previous: FAIL)
- GAP: [S] tribal.spear_thrower (9fcac3a) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a FAIL (previous: FAIL)
- GAP: [S] renaissance.painter (0ee7192) VERDICT: APPROVE CRITERION: renaissance.painter.a PASS (previous: FAIL)
- GAP: [S] renaissance.fencer (0118f84) VERDICT: APPROVE CRITERION: renaissance.fencer.a PASS (previous: FAIL)
- GAP: [S] tribal.mammoth (79f4083 +6910ac7) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [P] tribal.spear_thrower (5780739) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a PASS (previous: FAIL)

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
- Open: halberd a (breeches, stance, visor slit) and mammoth a (round belly + leg-root collars, then body after an evidence re-aim). Under 5 pickable [S]: tail overlap - audit farmer:re at step 2 and pick from both.
- Mammoth hull is now wound outward (6910ac7): check a mesh's winding before tuning what shows through it. Probe: copy inspect-prop.mjs, filter meshes by name, delete after.
- Critic 374 for a later renaissance:re: fencer thigh rolls read as round pumpkin globes wider than the hips (TABS boxy panel breeches to the knee).
- Capture replays are deterministic. Particles do not render on the stepped clock. Team cloth glow .2 washes to lavender; pale tans merge with bone.
- Never bakeCurrentTransformIntoVertices after parenting. Write node scripts with the Write tool; printf %s args keep %% literal.
