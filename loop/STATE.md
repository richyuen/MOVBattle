# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 371   Batch: tribal:re+renaissance:re (5-6/21)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector -+++ o | spear_thrower -+++ o | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter -+-+ o | fencer -+++ o | balloon_archer --++ o | musketeer ++++ D | halberd -+++ o | jouster ++++ D | da_vinci_tank ++++ D
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
371 (BASE fac4c91; evidence fac4c91 idle face-side swing): [S] musketeer a hose e7a49eb approved | [S] balloon_archer a placket + shoulder puffs 58d2ee9 approved | [S] fencer a one-piece felt hat 47ab317 +4b357d0 approved | [S] jouster a feather clump ae2a04b approved | [S] fencer c Fencer Dodge c88c308 approved; no [P]

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.musketeer (e7a49eb) VERDICT: APPROVE CRITERION: renaissance.musketeer.a PASS (previous: FAIL)
- GAP: [S] renaissance.balloon_archer (58d2ee9) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.a FAIL (previous: FAIL)
- GAP: [S] renaissance.fencer (47ab317 + 4b357d0) VERDICT: APPROVE CRITERION: renaissance.fencer.a FAIL (previous: FAIL)
- GAP: [S] renaissance.jouster (ae2a04b) VERDICT: APPROVE CRITERION: renaissance.jouster.a PASS (previous: FAIL)
- GAP: [S] renaissance.fencer (c88c308) VERDICT: APPROVE CRITERION: renaissance.fencer.c PASS (previous: FAIL)

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
- Step 2 first: RE-AUDIT a and b of painter and spear_thrower only (fac4c91 swung their idle camera to the face side; give the critic their Verdicts blocks). Fencer idle still hides his face under brim and braids though it points at the camera: needs another re-aim rule before his hat plume gap.
- halberd blocker 2 (team flat shape behind the helm) is the backdrop's dark boulder, probe 371: no mesh there; the pale rod is the sallet slit (TABS shows team through it). Ask the critic to strike it at the re-audit.
- Then: balloon_archer flat slashes + flat hat, fencer plume/crown + shoulder wings, painter dodge (needs an archer scene) or figure, protector window disc, mammoth legs (one more reject plateaus mammoth.a), spear_thrower fresh entry.
- Capture replays are deterministic (f9da668). Particles do not render on the stepped clock. Scratch probe pattern: spawn alone, game.frameCamera, screenshot; freeze requestAnimationFrame. Team cloth glow .2 washes to lavender.
- Never bakeCurrentTransformIntoVertices after parenting. [P] re-nudges of rows approved in the last 20 iterations are ledger reversals. Bash heredoc/node -e eats backticks: write TS via files.
