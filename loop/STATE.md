# Loop state (v3: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D)
Iteration: 399   Batch: farmer:re+ancient+viking (5-8/19)   Consecutive empty: 0   Done: 32/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+-+ o | ice_archer -+-+ o | brawler -+++ o | berserker ++++ D | valkyrie -+++ o | longship -+++ o | jarl -+++ o
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
399 (BASE 52a661a): [S] viking.berserker a.4 leg kit 52ba964 approved (struck a.4; DONE, CONFIRM 399 all PASS) | [S] ancient.zeus a.3 bolt hue/top/stand-off feff7d2+860ea63 REJECTED (reverted aa36ed2/9849d90) | [S] viking.ice_archer c.1 frost ribbon 2684991 REJECTED (reverted 084f002) | [S] farmer.halfling a.2 foot fur band d901df3+661f909 approved (struck 2) | [S] viking.longship b.1 paddle head + crew to the chest 4aec762+116f015 approved (b PASS) - 3/5
398 (BASE 5d111a2): [S] farmer.halfling a.1 legs 58a4a23 approved (a.1 stands; added a.5 shin overshoot, a.6 right foot) | [S] viking.berserker a.3 armpits 7c2acb6+cf65ff1 approved (struck a.3) | [S] viking.brawler a.2 beard 3c31474 approved (a.2 stands; added a.4 beard length, a.5 colour) | [S] viking.ice_archer c.1 ice arrow 42cf51c approved (c.1 stands: the frost still beads) | [S] viking.longship b.1 crew b94068d approved (b.1 stands: blades still 1.5 heads, crew cut at the belt) | [R] ancient.zeus a.3 toga trim 4778c43 approved (a.3 stands: hue and the bolt's top) - 6/6

## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.berserker (52ba964) VERDICT: APPROVE CRITERION: viking.berserker.a PASS (previous: FAIL)
- GAP: [S] ancient.zeus (feff7d2 + 860ea63) VERDICT: REJECT CRITERION: ancient.zeus.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (2684991) VERDICT: REJECT CRITERION: viking.ice_archer.c FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (d901df3 + 661f909) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] viking.longship (4aec762 + 116f015) VERDICT: APPROVE CRITERION: viking.longship.b PASS (previous: FAIL)
- CONFIRM viking.berserker: a PASS b PASS c PASS d PASS (399) -> D

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

## Notes for next iteration (max 5 lines)
- 399: 3/5 approved, berserker DONE by CONFIRM (all four PASS). Done 32. Batch unchanged: farmer:re 2 open, ancient 2, viking 6. Critic ran on the session default model (no grok retry).
- Next ranked: ice_archer icicles UNDER the shaft (3-4 tetra, perpendicular, spread in y; the flat ribbon read as a fin); zeus emblem at the belt's .85 self-light held high on the shoulder and clear of the raised hand's bloom; longship a.1 hull sides then a.4 carriers; halfling shorts hem; ice_archer a.4 evidence commit (idle/lineup is the back).
- zeus: the 7.5 cm stand-off (reverted together with the hue in aa36ed2/9849d90) does kill the ghost — re-apply it on the next attempt.
- The halfling's foot fur (band across the instep) and the berserker's Brawler leg kit are both approved; do not re-nudge either.
