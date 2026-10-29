# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 412   Batch: ancient+viking+dynasty (6-8/19)   Consecutive empty: 0   Done: 39/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler -+++ o | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ---+ o | firework_archer ---+ o | monk -+-+ o | ninja -+++ o | dragon ---+ o | hwacha ---+ o | monkey_king ---+ o
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

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
412 (BASE 7d1d920): [S] ice_archer b.1 bow grip in the fist (6ae7e0f + c508944) approved, b PASS, CONFIRM passed - D | [S] monk a.1 tengu mask (2070597) approved, none struck | [S] ninja a.3 gi (b2d03e9) approved, struck 3 | [S] ninja c.1 star in flight (0245af2) approved, c PASS | [S] monk c.1 bo swing (3b45ede + 52ae020) approved, struck 1 | [S] firework_archer a.1 hair (772d55d) approved, struck 1 - 6/6, 5 struck
411 (BASE 186849d; dynasty audited): ice_archer wraps + bow rest (CONFIRM failed b), minotaur compact head, monk bo, ninja hood + shuriken - 6/6, 9 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.ice_archer (6ae7e0f + c508944) VERDICT: APPROVE CRITERION: viking.ice_archer.b PASS (previous: FAIL)
- GAP: [S] dynasty.monk (2070597) VERDICT: APPROVE CRITERION: dynasty.monk.a FAIL (previous: FAIL)
- GAP: [S] dynasty.ninja (b2d03e9) VERDICT: APPROVE CRITERION: dynasty.ninja.a FAIL (previous: FAIL)
- GAP: [S] dynasty.ninja (0245af2) VERDICT: APPROVE CRITERION: dynasty.ninja.c PASS (previous: FAIL)
- GAP: [S] dynasty.monk (3b45ede + 52ae020) VERDICT: APPROVE CRITERION: dynasty.monk.c FAIL (previous: FAIL)
- GAP: [S] dynasty.firework_archer (772d55d) VERDICT: APPROVE CRITERION: dynasty.firework_archer.a FAIL (previous: FAIL)
- CONFIRM viking.ice_archer a PASS | b PASS | c PASS | d PASS -> D
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Open: minotaur a.3 legs, brawler a.4 beard; dynasty all open. Next ranked [S]: ninja a.4 trousers; firework_archer b.1 big recurve / c.1 rocket in flight / a.2 robe; monk c.2 knockback / a.2 team hat ([P] tengu brows is 412.2 fallout); samurai a.1 kabuto / b.1 two-hand hold; minotaur a.3 lathed legs; dragon c.1 flame; hwacha a.1 rack; monkey_king b.1 staff.
- brawler a.4: out of attempts; the idle board lies as a tray over his trunk - an evidence commit (re-aim at lineup_viking or a lower camera) comes first. Brawler a is starving at 413: pick it next iteration.
- samurai c.1 (Projectile Block) needs a ranged attacker in its capture scene: evidence commit first. firework_archer _release/_flight frame the target out of shot (reframe).
- Melee release shots are taken at the hit log; a swing that should show must hold its blow (blowLandsIn), as MONK_SWING does via _strikesAtMan.
- ICE_REST (411), JARL_REST (408) are approved rows: re-nudging them as [P] is a ledger reversal.

## Unit file template (loop/units/<id>.md, cap 3200 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> - TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] <criterion> <gap> - blocker <n>: <mechanism> - ref: <file> - ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] - iter: what - critic's top defect)
## Notes (max 3 lines)
```
