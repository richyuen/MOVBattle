# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 411   Batch: ancient+viking+dynasty (6-8/19)   Consecutive empty: 0   Done: 38/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer +-++ o | brawler -+++ o | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ---+ o | firework_archer ---+ o | monk -+-+ o | ninja -+-+ o | dragon ---+ o | hwacha ---+ o | monkey_king ---+ o
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
411 (BASE 186849d; dynasty audited, stats cc4f7de): [S] ice_archer a.4 shin wraps (4b4db5f) approved, struck 4 (+3 by lineup), a PASS | [S] ice_archer b.2 bow rest (e1dc03c) approved, struck 2, CONFIRM failed b (hands empty) | [S] minotaur a.4 compact head (0469073) approved, struck 4 | [S] monk b.1 bo staff (0f878ea) approved, b PASS | [S] ninja a.1 hood (e572534) approved, struck 1, 2 | [S] ninja b.1 shuriken (d5ebed9) approved, struck 1, 2, b PASS - 6/6, 9 struck
410 (BASE 27329a5): minotaur arms + leg sleeves, jarl wraps + beard (D), ice_archer quiver + nock - 6/6, 4 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.ice_archer (4b4db5f) VERDICT: APPROVE CRITERION: viking.ice_archer.a PASS (previous: FAIL)
- GAP: [S] viking.ice_archer (e1dc03c) VERDICT: APPROVE CRITERION: viking.ice_archer.b PASS (previous: FAIL)
- GAP: [S] ancient.minotaur (0469073) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- GAP: [S] dynasty.monk (0f878ea) VERDICT: APPROVE CRITERION: dynasty.monk.b PASS (previous: FAIL)
- GAP: [S] dynasty.ninja (e572534) VERDICT: APPROVE CRITERION: dynasty.ninja.a FAIL (previous: FAIL)
- GAP: [S] dynasty.ninja (d5ebed9) VERDICT: APPROVE CRITERION: dynasty.ninja.b PASS (previous: FAIL)
- CONFIRM viking.ice_archer a PASS | b FAIL | c PASS | d PASS -> open
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Open: ice_archer b (bow in her fist, CONFIRM 411), minotaur a.3 legs, brawler a.4 beard; dynasty all open (audit 411). Next ranked [S]: monk c.1 bo swing / a.1 tengu mask; ninja c.1 star projectile / a.3 gi; ice_archer b bow gripped; minotaur a.3 tapered legs; firework_archer a.1 hair / b.2 rocket; samurai a.1 kabuto / b.1 two-hand hold.
- brawler a.4: out of attempts; the idle board lies as a tray over his trunk - an evidence commit (re-aim at lineup_viking or a lower camera) comes first. Brawler a is starving at 413.
- samurai c.1 (Projectile Block) needs a ranged attacker in its capture scene: evidence commit first. firework_archer _release/_flight frame the target out of shot (reframe).
- Zeus (D) owes a small guard at runtimeUnit.ts:1053 (a flung body keeps a mesh's own render group) - outside the loop's picks; note only.
- ICE_REST (411) and JARL_REST (408) are approved rows: re-nudging them as [P] is a ledger reversal; the ice archer fix must change the mechanism (grip in fist).

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
