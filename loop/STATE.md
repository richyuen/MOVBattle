# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 363   Batch: medieval+tribal:re (4/21)   Consecutive empty: 0   Done: 20/139   Parked: 0
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
363 (BASE b62c597): [S] chieftain a beast skull 03e92ab+e52aaa4 approved | [S] protector a skull re-seat d6d6c79+c60ed20 approved | [S] spear_thrower a hung tusks 09199c4 approved | [S] bone_mage b staff skull f270dce approved | [S] stoner a curved strap 205e839 approved | [P] bone_mage a DEER_RACK.tan 326d648 rejected (reverted 5c0429d) | [S] mammoth a fur legs 5d518c2+7c6a257+9b9ed17 approved | [S] mammoth c charge pose+dust baea514+d0548b0 approved; king [R] deferred (7 [S] taken)

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.chieftain (03e92ab + e52aaa4) VERDICT: APPROVE CRITERION: tribal.chieftain.a FAIL (previous: FAIL)
- GAP: [S] tribal.protector (d6d6c79 + c60ed20) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL)
- GAP: [S] tribal.spear_thrower (09199c4) VERDICT: APPROVE CRITERION: tribal.spear_thrower.a FAIL (previous: FAIL)
- GAP: [S] tribal.bone_mage (f270dce) VERDICT: APPROVE CRITERION: tribal.bone_mage.b FAIL (previous: FAIL)
- GAP: [S] tribal.stoner (205e839) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL)
- GAP: [P] tribal.bone_mage (326d648) VERDICT: REJECT CRITERION: tribal.bone_mage.a FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (5d518c2 + 7c6a257 + 9b9ed17) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (baea514 + d0548b0) VERDICT: APPROVE CRITERION: tribal.mammoth.c FAIL (previous: FAIL)

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
- FIRST pick: king [R] of the legs from the breeches down (a plateau; deferred 361-363, medieval cannot checkpoint while it is open): the breeches' gathered hem hung past the knee hinge over the team knee end, slim shin under it; the thigh is not covered by the breeches (361: recolouring it read beige).
- Pick next: protector idle evidence re-aim (capture.mjs, head beside/above the slab), mammoth trample ring (sprites) + barrel body, chieftain loincloth+hip tusks, bone_mage cheek leaves + wide tan staff rack, stoner close skirt; [P] fallout: BEAST_SKULL lift/pitch, TUSK_BAND thick/tan, MAMMOTH_LEG radii.
- Capture: particle systems do not render on the stepped clock (use sprite meshes, as spawnKickDust / the fireball dust). Lathes wound top-down face inward.
- Light warm cloth: medievalDress warmCloth (own amber emissive) + unglow every mesh in it. Tan bone/antler renders grey in the capture's shade: go darker and warmer with more glow, inside an [S] (DEER_RACK colour [P] was a ledger reversal).
- Expect re-baselines at the medieval checkpoint: squire/archer stats (351), archer loose and broadhead (354, 358), bard walk, catapult frame/wheels/paint, knight plate+legs+cape, king skirt removed (360).
