# Loop state (v8: two auditors per batch, lists merged; up to 9 gaps; a unit with 3 or fewer blockers picked first; a c look shows the target; v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 479   Batch: legacy_2   Consecutive empty: 0   Done: 79/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen ++++ D
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower ++++ D | miner ++++ D | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter ++++ D | pike ++++ D | barrel_roller ++++ D | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh -+++ o | wizard ---+ o | chariot ++++ D | thor -+++ o | tank -+++ o | super_boxer ++-+ o | dark_peasant -+-+ o | super_peasant -+-+ o
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 479; BASE b83edf3d)
Nine gaps in three sub-batches; evidence b83edf3d, ff152789, fc7c5263, f4f4e00d outside the nine.
1. [R] legacy.thor.a blockers 1/2: open V coat and Viking belt (288e2eb7, ddec1562) APPROVE, struck 1; belt 2 stands.
2. [S] legacy.chariot.b blocker 1: exposed shield mount (b4856556) APPROVE, struck 1; CONFIRM passed; D.
3. [S] legacy.super_boxer.b blocker 1: padded gloves and head-scale fit (36730de3, cc74e96d) APPROVE, struck 1.
4. [S] legacy.dark_peasant.a blocker 4: open laced jerkin (663b3f2d, 5fa80d38) APPROVE, struck 4; Custom gated off.
5. [S] legacy.dark_peasant.c blocker 1: streaking hand volley (1eb610b3) APPROVE, struck 1.
6. [S] legacy.super_peasant.a blocker 3: rope belt (0fb715a1, 3f642c6a) APPROVE, struck 3.
7. [S] legacy.super_peasant.c blocker 2: wrist ribbons (909a9f7c) APPROVE, struck 2.
8. [S] legacy.wizard.c blocker 2: sustained lift and chest burst (0117757c, c67e45e9) APPROVE, airborne clause struck mechanically; explosion stands.
9. [S] legacy.super_boxer.c blocker 1: dash punch (d2432f2a) APPROVE, struck 1.
- 9/9, 9 struck (8 full blockers + Wizard's airborne clause)

## Last verdicts (critic header lines verbatim)
- GAP: [R] legacy.thor (288e2eb7, ddec1562)
- VERDICT: APPROVE
- CRITERION: legacy.thor.a FAIL (previous: FAIL)
- GAP: [S] legacy.chariot (b4856556)
- VERDICT: APPROVE
- CRITERION: legacy.chariot.b PASS (previous: FAIL)
- GAP: [S] legacy.super_boxer (36730de3, cc74e96d)
- VERDICT: APPROVE
- CRITERION: legacy.super_boxer.b PASS (previous: FAIL)
- GAP: [S] legacy.dark_peasant (663b3f2d, 5fa80d38)
- VERDICT: APPROVE
- CRITERION: legacy.dark_peasant.a FAIL (previous: FAIL)
- GAP: [S] legacy.dark_peasant (1eb610b3)
- VERDICT: APPROVE
- CRITERION: legacy.dark_peasant.c FAIL (previous: FAIL)
- GAP: [S] legacy.super_peasant (0fb715a1, 3f642c6a)
- VERDICT: APPROVE
- CRITERION: legacy.super_peasant.a FAIL (previous: FAIL)
- GAP: [S] legacy.super_peasant (909a9f7c)
- VERDICT: APPROVE
- CRITERION: legacy.super_peasant.c FAIL (previous: FAIL)
- GAP: [S] legacy.wizard (0117757c, c67e45e9)
- VERDICT: APPROVE
- CRITERION: legacy.wizard.c FAIL (previous: FAIL)
- GAP: [S] legacy.super_boxer (d2432f2a)
- VERDICT: APPROVE
- CRITERION: legacy.super_boxer.c FAIL (previous: FAIL)
- REGRESSIONS: none
- UNIT legacy.chariot: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- Thor a remains plateau (477): belt face still hidden by pelvis/grip after partial [R] 479; preserve cleared coat/head/build and confirmed b/c. Its speculative CONFIRM passed but is discarded because gap critic kept a FAIL. Pharaoh a plateau (478) still awaits sandals.
- At 480, starving criteria last tried 475 are Wizard a/b and Tank a; Tank's [P] fallout expired, so pick rider-scale blocker 1 as structural. Wizard c is not plateau: latest airborne clause strike resets the no-strike run; explosion remains.
- Super Boxer only lacks glove trails; Dark Peasant needs lower dress and converging hand grab-blast; Super Peasant needs continuous tunic, rolled trousers and extreme victim launch (post-impact evidence first).
- Next step 2: RE-AUDIT c only for Dark Peasant, Super Peasant and Wizard after scoped motion-camera commits; give both auditors each current Verdicts block. Other criteria retain verdicts.
- Chariot confirmed D; 79/139 done. Batch checkpoint not due. Checks passed; no browser errors/regressions. Push blocked by auto-review: new iteration payload needs separate approval for github.com/richyuen/MOVBattle despite prior destination approval.
