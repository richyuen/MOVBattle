# Loop state (v8: two auditors per batch, lists merged; up to 9 gaps; a unit with 3 or fewer blockers picked first; a c look shows the target; v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 477   Batch: legacy_2   Consecutive empty: 0   Done: 78/139   Parked: 0
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
legacy_2: pharaoh -+++ o | wizard ---+ o | chariot +-++ o | thor -+++ o | tank -+++ o | super_boxer +--+ o | dark_peasant -+-+ o | super_peasant -+-+ o
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 477; BASE b26a5cf2)
Nine structural gaps in three sub-batches, one commit per gap; beard follow-up after look.
1. [S] legacy.pharaoh.a blocker 1: lanky straight-legged build (b8d03fdd) APPROVE, struck 1
2. [S] legacy.pharaoh.a blocker 2: gold false beard (a019aff2) APPROVE, struck 2
3. [S] legacy.thor.a blocker 1: lanky upright build (e8a90461) APPROVE, struck 1
4. [S] legacy.thor.a blocker 2: pointed blond beard (8bdc9ab2, 74843223) APPROVE, struck 2
5. [S] legacy.thor.a blocker 3: layered swept wings (dfbb27b2) APPROVE, struck 3
6. [S] legacy.chariot.a blocker 1: transverse plume fan (32545a0f) APPROVE, struck 1
7. [S] legacy.chariot.b blocker 1: oval gold-rimmed shield (17bfabb4) APPROVE, none struck
8. [S] legacy.super_boxer.a blocker 1: lanky upright build (e09e65d6) APPROVE, struck 1
9. [S] legacy.super_boxer.b blocker 1: luminous fist-fitted mitts (533a1de9) APPROVE, none struck
- 9/9, 7 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] legacy.pharaoh (b8d03fdd)
- VERDICT: APPROVE
- CRITERION: legacy.pharaoh.a PASS   (previous: FAIL)
- GAP: [S] legacy.pharaoh (a019aff2)
- VERDICT: APPROVE
- CRITERION: legacy.pharaoh.a PASS   (previous: FAIL)
- GAP: [S] legacy.thor (e8a90461)
- VERDICT: APPROVE
- CRITERION: legacy.thor.a PASS   (previous: FAIL)
- GAP: [S] legacy.thor (8bdc9ab2, 74843223)
- VERDICT: APPROVE
- CRITERION: legacy.thor.a PASS   (previous: FAIL)
- GAP: [S] legacy.thor (dfbb27b2)
- VERDICT: APPROVE
- CRITERION: legacy.thor.a PASS   (previous: FAIL)
- GAP: [S] legacy.chariot (32545a0f)
- VERDICT: APPROVE
- CRITERION: legacy.chariot.a PASS   (previous: FAIL)
- GAP: [S] legacy.chariot (17bfabb4)
- VERDICT: APPROVE
- CRITERION: legacy.chariot.b FAIL   (previous: FAIL)
- GAP: [S] legacy.super_boxer (e09e65d6)
- VERDICT: APPROVE
- CRITERION: legacy.super_boxer.a PASS   (previous: FAIL)
- GAP: [S] legacy.super_boxer (533a1de9)
- VERDICT: APPROVE
- CRITERION: legacy.super_boxer.b FAIL   (previous: FAIL)
- REGRESSIONS: none
- UNIT legacy.pharaoh: a FAIL b PASS c PASS d PASS (3/4)
- UNIT legacy.thor: a FAIL b PASS c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- Pharaoh a and Thor a are plateau after their second CONFIRM failures. Next [R] slot: Pharaoh first (same-age tie), Thor waits for the following slot. Spec each from both 475 and 477 lists; preserve cleared build/head details and confirmed b/c.
- Chariot b: oval shield improved but face remains obstructed/cropped; re-seat clear of horse/mane and breastwork, evidence commit first if idle cannot show the full face. Its speculative CONFIRM was discarded because gap critic kept b FAIL.
- Super Boxer b: two approved [S] without a strike; next mechanism needs broad knuckle pad/cuff/thumb. c punch and trails still open. No unit done this iteration; batch checkpoint not due.
- Dark Peasant c volley: next try launches hands out of sphere with >=1 m streaks and an evidence commit framing him and target side-on in _ability_after. Super Peasant c needs wrist ribbons; a needs belt/tunic/trousers.
- Wizard c: keep target aloft spinning until chest burst. Eligible [P] fallout: 475 WIZARD_STAFF .98 -> 1.25 or TANK_ROOF domeAt (.34,.14) -> (.34,.3); 474 SUPER_TUNIC fallout expired after 477.
