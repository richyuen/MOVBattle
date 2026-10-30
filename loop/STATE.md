# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 415   Batch: ancient+viking+dynasty (6-8/19)   Consecutive empty: 0   Done: 40/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++-+ o | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ---+ o | firework_archer ---+ o | monk ++-+ o | ninja ++++ D | dragon ---+ o | hwacha ---+ o | monkey_king ---+ o
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
415 (BASE 01a65ea2): [S] minotaur a.3 lathed legs (57ec2652) approved, a PASS, CONFIRM failed a (4 new: sash slab, hidden belt, plank pauldron, scale 2.10) | [S] samurai b.3 katana swing (44749436) approved, struck 3 | [S] monk a.3 arm plates (4db0bf1d) approved, a PASS | [S] brawler b.3 board upright (b8bdfcee) approved, struck 3 | [P] brawler haft (2d2156d4) approved, b PASS - 5/5, 5 struck
414 (BASE 46161b8): samurai kabuto opening + katana rest, monk trousers, brawler hatchet - 4/4, 3 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] ancient.minotaur (57ec2652) VERDICT: APPROVE CRITERION: ancient.minotaur.a PASS (previous: FAIL)
- GAP: [S] dynasty.samurai (44749436) VERDICT: APPROVE CRITERION: dynasty.samurai.b FAIL (previous: FAIL)
- GAP: [S] dynasty.monk (4db0bf1d) VERDICT: APPROVE CRITERION: dynasty.monk.a PASS (previous: FAIL)
- GAP: [S] viking.brawler (b8bdfcee) VERDICT: APPROVE CRITERION: viking.brawler.b FAIL (previous: FAIL)
- GAP: [P] viking.brawler (2d2156d4) VERDICT: APPROVE CRITERION: viking.brawler.b PASS (previous: FAIL)
- CONFIRM ancient.minotaur a FAIL | b PASS | c PASS | d PASS -> open (4 new a blockers)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Open: minotaur a (CONFIRM 415 list: scale, sash, belt, pauldron); brawler c (lunge: evidence first); monk c (knockback); dynasty samurai, firework_archer, dragon, hwacha, monkey_king. Next ranked: samurai [P] light katana steel (415.2 fallout) / [P] kabuto lames team (413 fallout) / a hakama, cuirass; monk c.2 knockback; minotaur a scale + sash; firework_archer c.2 impact burst / b.2 rocket nocked; dragon c.1 flame; hwacha a.1 rack; monkey_king b.1 staff.
- samurai c.1 (Projectile Block) and brawler c.1 (lunge) need capture-scene evidence commits first (a ranged attacker; a farther start with the lunge logged).
- Melee release shots are taken at the hit log; a swing that should show must hold its blow (blowLandsIn), as MONK_SWING does via _strikesAtMan.
- A world-posed rest (_restIceBow, _restKatana, _restNorseBoard) must clear rotationQuaternion outside the rest; the katana's rest eases back over .settle so the hit shows the swing.
- Minotaur: 4 CONFIRM fails on a (403-415), each new gear blockers; his scale 2.10 vs card 1.2x is now a blocker (396 [R] 1.92 was rejected with other changes bundled).

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
