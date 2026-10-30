# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 429   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 48/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon -+++ o | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock -+++ o | blunderbuss --++ o | bomb_thrower -+++ o | harpooner -+++ o | cannon ++++ D | captain --++ o | pirate_queen --++ o
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
429 (BASE 6555ee29; starving flintlock a, bomb_thrower a, dragon a/b, harpooner b): [S] flintlock a.4 hair (a216eda0, 70fa9c2c) struck 4 | [S] bomb_thrower a.3 socks (784eeeca) struck 3 | [S] cannon a.1 bandanna (1f3e8df6) struck 1, 2, a PASS; CONFIRM passed, D | [S] monkey_king a.2 hair ring (e6fad918) struck 2, a PASS; CONFIRM failed a (2nd: plateau) | [S] dragon a.3 trim (3b24b339) struck 3, a PASS; CONFIRM failed a (2nd: plateau) | [S] dragon b.2 front hold (df5dd028) struck 2, b PASS | [S] harpooner b.3 bayonet (37ea2e85) struck 3, b PASS - 7/7, 8 struck
428 (BASE 0445ba6b; evidence c6ac0351 cannon idle swing .25): [S] captain c.2 dragon pistol blast (29111559) struck 2, c PASS | [S] captain a.3 long coat (9fb9986c) struck 3 | [S] queen a.3 bomb sash (72765079, cfa8f57b) struck 3 | [S] blunderbuss a.3 bracers (d6d8e60a) struck 3 | [S] cannon b.2 handles (8009017b, 0a24e9b0) struck 2, b PASS | [S] cannon a.3 striped shirt (a478d4ce) struck 3, a PASS; CONFIRM failed a (bandanna, eyes) | [S] monkey_king a.3 slim trunk (eea59cc5) struck 3 - 7/7, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.flintlock (a216eda0, 70fa9c2c) VERDICT: APPROVE CRITERION: pirate.flintlock.a FAIL (previous: FAIL)
- GAP: [S] pirate.bomb_thrower (784eeeca) VERDICT: APPROVE CRITERION: pirate.bomb_thrower.a FAIL (previous: FAIL)
- GAP: [S] pirate.cannon (1f3e8df6) VERDICT: APPROVE CRITERION: pirate.cannon.a PASS (previous: FAIL)
- GAP: [S] dynasty.monkey_king (e6fad918) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a PASS (previous: FAIL)
- GAP: [S] dynasty.dragon (3b24b339) VERDICT: APPROVE CRITERION: dynasty.dragon.a PASS (previous: FAIL)
- GAP: [S] dynasty.dragon (df5dd028) VERDICT: APPROVE CRITERION: dynasty.dragon.b PASS (previous: FAIL)
- GAP: [S] pirate.harpooner (37ea2e85) VERDICT: APPROVE CRITERION: pirate.harpooner.b PASS (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT pirate.cannon: a PASS b PASS c PASS d PASS (4/4) | UNIT dynasty.monkey_king: a FAIL b PASS c PASS d PASS (3/4) | UNIT dynasty.dragon: a FAIL b PASS c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- [R] slot 430: dragon a and monkey_king a are both plateau (2nd CONFIRM fail 429); one [R] per iteration, specs in their unit files. Starving: queen b at 430; blunderbuss b, harpooner a at 431.
- Pickable [S] (429 NEXT): flintlock a.3 grey socks, bomb_thrower a.4 bomb sash, harpooner a.2 beard / a.4 1.30x size; earlier: captain a.2 parrots, queen a.2 locks (pirateHair can serve), blunderbuss a.4 hair (pirateHair), queen b.2 big cutlass, captain b.2 cutlass, blunderbuss b.1 rebuild. [P] flintlock hair ginger.
- Shared 429: pirateDress PIRATE_HAIR (pirateHair, any colour/opts), PIRATE_SOCKS, CANNON_BANDANNA (dressCannonCrew cap=false on the pirate cannon); dynastyDress eyeSpanInHead now exported, MONKEY_HAIR, DRAGON_TRIM + dragonTrim; proceduralAnimation _holdDragonPole; propBuilder HARPOON_BAYONET.
- Shared earlier: buildCutlass + CUTLASS_SLASH (captain, queen, blackbeard); PIRATE_KICK harpooner; GUN_TOSS + spawnPistolShot flintlock; DRAGON_BLAST captain; CAPTAIN_COAT; CANNON_HANDLES; MONKEY_TRUNK first in his dress.

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
