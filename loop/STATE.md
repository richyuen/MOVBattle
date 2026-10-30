# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 430   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 48/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon -+++ o | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock -+++ o | blunderbuss +-++ o | bomb_thrower -+++ o | harpooner -+++ o | cannon ++++ D | captain --++ o | pirate_queen --++ o
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
430 (BASE 28adb4e4; starving queen b): [S] flintlock a.3 socks (4fd14183) struck 3, a PASS; CONFIRM failed a | [S] bomb_thrower a.4 sash (9c97ba97, 4ce95061) struck 4, a PASS; CONFIRM failed a | [S] harpooner a.2 beard (a2de9843) struck 2 | [S] blunderbuss a.4 hair (ed8b9edd) struck 4, a PASS | [S] queen a.2 locks (7899b9c6) struck 2 | [S] captain a.2 parrots (674c7165) struck 2 | [S] queen b.2 big cutlass (83f4e760) approved, none struck (idle end-on) | [R] monkey_king a face + robe (80235174) struck 1, 2, a PASS; CONFIRM failed a (3rd: plateau) - 8/8, 8 struck
429 (BASE 6555ee29): [S] flintlock a.4 hair (a216eda0, 70fa9c2c) struck 4 | [S] bomb_thrower a.3 socks (784eeeca) struck 3 | [S] cannon a.1 bandanna (1f3e8df6) a PASS; CONFIRM passed, D | [S] monkey_king a.2 hair ring (e6fad918) | [S] dragon a.3 trim (3b24b339) | [S] dragon b.2 front hold (df5dd028) b PASS | [S] harpooner b.3 bayonet (37ea2e85) b PASS - 7/7, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.flintlock (4fd14183) VERDICT: APPROVE CRITERION: pirate.flintlock.a PASS (previous: FAIL)
- GAP: [S] pirate.bomb_thrower (9c97ba97, follow-up 4ce95061) VERDICT: APPROVE CRITERION: pirate.bomb_thrower.a PASS (previous: FAIL)
- GAP: [S] pirate.harpooner (a2de9843) VERDICT: APPROVE CRITERION: pirate.harpooner.a FAIL (previous: FAIL)
- GAP: [S] pirate.blunderbuss (ed8b9edd) VERDICT: APPROVE CRITERION: pirate.blunderbuss.a PASS (previous: FAIL)
- GAP: [S] pirate.pirate_queen (7899b9c6) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL (previous: FAIL)
- GAP: [S] pirate.captain (674c7165) VERDICT: APPROVE CRITERION: pirate.captain.a FAIL (previous: FAIL)
- GAP: [S] pirate.pirate_queen (83f4e760) VERDICT: APPROVE CRITERION: pirate.pirate_queen.b FAIL (previous: FAIL)
- GAP: [R] dynasty.monkey_king (80235174) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a PASS (previous: FAIL, plateau)
- REGRESSIONS: none
- CONFIRM: UNIT pirate.flintlock: a FAIL b PASS c PASS d PASS (3/4) | UNIT pirate.bomb_thrower: a FAIL b PASS c PASS d PASS (3/4) | UNIT dynasty.monkey_king: a FAIL b PASS c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- [R] slot 431: dragon a (plateau since 429, waited 430) before monkey_king a (plateau again, CONFIRM 430: slim build at size 1.15, knee shorts). Starving at 431: blunderbuss b (gun rebuild, last 426).
- Evidence commit first at 431: queen b.2's idle shows the big cutlass end-on; it reads in unit_pirate.pirate_queen_release (critic 430). Re-aim before any queen b pick.
- Pickable [S]: flintlock a.1/bomb_thrower a.1 team bandana (one "bandana" hat change serves both), flintlock a.2 ginger locks, bomb_thrower a.2 belt, captain a.4 beard (pirateBeard can serve), queen a.4 skirt, queen b.1 off-hand sabre, captain b.2 cup guard. [P] harpooner size 1.05 -> 1.30 (fallout of PIRATE_BEARD).
- Shared 430: pirateDress PLAIN_SOCKS (flintlockSocks), BOMB_SASH, PIRATE_BEARD (pirateBeard), BLUNDERBUSS_HAIR, QUEEN_HAIR, CAPTAIN_PARROTS (finds "tricornCrown"); propBuilder QUEEN_CUTLASS (weaponVariant queen_cutlass); dynastyDress MONKEY_FACE takes teamColor; no tunic skirt for monkey_king.
- Shared earlier: pirateHair (any colour/opts), PIRATE_SOCKS, CANNON_BANDANNA, buildCutlass + CUTLASS_SLASH, PIRATE_KICK, GUN_TOSS + spawnPistolShot, DRAGON_BLAST, CAPTAIN_COAT, dynastyDress DRAGON_TRIM, _holdDragonPole, HARPOON_BAYONET.

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
