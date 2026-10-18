# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 325   Batch: tribal (1/18)   Consecutive empty: 0   Done: 6/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
farmer: halfling ???? q | farmer ???? q | hay_baler ???? q | potion_seller ???? q | harvester ???? q | wheelbarrow ???? q | scarecrow ???? q
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
dynasty: samurai ???? q | firework_archer ???? q | monk ???? q | ninja ???? q | dragon ???? q | hwacha ???? q | monkey_king ???? q
renaissance: painter ???? q | fencer ???? q | balloon_archer ???? q | musketeer ???? q | halberd ???? q | jouster ???? q | da_vinci_tank ???? q
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
325 (BASE 75ad012): [S] mammoth a ankle bands 0207b28 approved | [S] clubber a bracelets e8a2cc0 approved (a -> PASS, clubber D). 2/2 approved, no regressions.
324 (BASE 319dba1): 4/4 approved (chieftain hide cape + scale -> D, clubber tusk necklace, mammoth mane).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.mammoth (0207b28) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL) BLOCKERS: struck: 1 (323), 2 (this commit), 3 (324). Remaining: 4.
- GAP: [S] tribal.clubber (e8a2cc0) VERDICT: APPROVE CRITERION: tribal.clubber.a PASS (previous: FAIL) BLOCKERS: struck: 4 (this commit). The list is empty.
- REGRESSIONS: none
Batch ranked order (critic, 325): [S] mammoth.a face marking; [P] mammoth.a ankle band flush (fallout of 0207b28, NEXT in unit_tribal.mammoth_idle).

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
- 326 starts at step 3: mammoth is the last open tribal unit. Pick [S] face marking (blocker 4) and the [P] ankle band flush fallout. If a goes PASS, mammoth is D: run the batch checkpoint (step 8) and advance Batch to farmer.
- Mammoth: buildMammoth (vehicleBuilder ~1390); brow square is "browPaint" (paintMat) on neck ~1540; flat team paint is tuskTipMat (getCloth(color)); ANKLE_BAND on kneeJoint. Elephant shaves paint by mesh name (ELEPHANT_SHAVED): add any new face-paint mesh names there.
- The 324 critic noted _windup crops the head top; if the face stripe cannot show there, re-aim with an evidence commit first.
- Capture shade greys warm browns: dark saturated base with emissive 0.1 reads brown.
- capture.mjs --units takes a comma list (a,b). stats.json lives in iter-317. Never put a bare `cat > file` (no heredoc) in a command: it waits on stdin.
