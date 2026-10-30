# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 431   Batch: dynasty+pirate (10/19)   Consecutive empty: 0   Done: 50/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock -+++ o | blunderbuss -+++ o | bomb_thrower ++++ D | harpooner -+++ o | cannon ++++ D | captain -+++ o | pirate_queen -+++ o
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
431 (BASE 3d4a557c; starving blunderbuss b): [R] dragon a head+body (3e94ecfa, 48329bf4) struck 1-4, a PASS; CONFIRM passed, D | [S] flintlock a.1 team bandana (6561ba6f) struck 1, also bomb_thrower a.1 struck | [S] bomb_thrower a.2 belt (8d798815, 67e6d6eb) struck 2, a PASS; CONFIRM passed, D | [S] captain a.4 beard (927e8a7a, ee1ab3a9) struck 4, a PASS; CONFIRM failed a | [S] captain b.2 cup guard (3021427b) b PASS | [P] harpooner a.4 scale 1.3 (ec00c268) a PASS; CONFIRM failed a | [S] queen b.1 crossed blades (fe03e273) struck 1, 2, b PASS | [S] queen a.4 skirt (d06b4abd) a PASS; CONFIRM failed a | [S] blunderbuss b.1 gun rebuild (8addafc1) b PASS; CONFIRM failed a - 9/9, 13 struck
430 (BASE 28adb4e4; starving queen b): [S] flintlock a.3 socks (4fd14183) struck 3, a PASS; CONFIRM failed a | [S] bomb_thrower a.4 sash (9c97ba97, 4ce95061) struck 4, a PASS; CONFIRM failed a | [S] harpooner a.2 beard (a2de9843) struck 2 | [S] blunderbuss a.4 hair (ed8b9edd) struck 4, a PASS | [S] queen a.2 locks (7899b9c6) struck 2 | [S] captain a.2 parrots (674c7165) struck 2 | [S] queen b.2 big cutlass (83f4e760) approved, none struck (idle end-on) | [R] monkey_king a face + robe (80235174) struck 1, 2, a PASS; CONFIRM failed a (3rd: plateau) - 8/8, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [R] dynasty.dragon (3e94ecfa, follow-up 48329bf4) VERDICT: APPROVE CRITERION: dynasty.dragon.a PASS (previous: FAIL, plateau)
- GAP: [S] pirate.flintlock (6561ba6f) VERDICT: APPROVE CRITERION: pirate.flintlock.a FAIL (previous: FAIL)
- GAP: [S] pirate.bomb_thrower (6561ba6f) VERDICT: APPROVE CRITERION: pirate.bomb_thrower.a FAIL (previous: FAIL)
- GAP: [S] pirate.bomb_thrower (8d798815, follow-up 67e6d6eb) VERDICT: APPROVE CRITERION: pirate.bomb_thrower.a PASS (previous: FAIL)
- GAP: [S] pirate.captain (927e8a7a, follow-up ee1ab3a9) VERDICT: APPROVE CRITERION: pirate.captain.a PASS (previous: FAIL)
- GAP: [S] pirate.captain (3021427b) VERDICT: APPROVE CRITERION: pirate.captain.b PASS (previous: FAIL)
- GAP: [P] pirate.harpooner (ec00c268) VERDICT: APPROVE CRITERION: pirate.harpooner.a PASS (previous: FAIL)
- GAP: [S] pirate.pirate_queen (fe03e273) VERDICT: APPROVE CRITERION: pirate.pirate_queen.b PASS (previous: FAIL)
- GAP: [S] pirate.pirate_queen (d06b4abd) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a PASS (previous: FAIL)
- GAP: [S] pirate.blunderbuss (8addafc1) VERDICT: APPROVE CRITERION: pirate.blunderbuss.b PASS (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT dynasty.dragon: a PASS b PASS c PASS d PASS (4/4) | UNIT pirate.bomb_thrower: 4/4 | UNIT pirate.captain: a FAIL (3/4) | UNIT pirate.harpooner: a FAIL (3/4) | UNIT pirate.pirate_queen: a FAIL (3/4) | UNIT pirate.blunderbuss: a FAIL (3/4)

## Notes for next iteration (max 5 lines)
- [R] slot 432: monkey_king a (plateau since 430, waited 431). Every other open pirate criterion is a (CONFIRM 431 lists, 0 since 431); none starving.
- Pickable [S] 432: flintlock a.2 ginger locks; captain a.1 pants+boots / a.2 tricorn / a.3 shirt+sash; harpooner a.1 rolled pants / a.2 tricorn / a.3 shoes; queen a.1 skirt front / a.2 sleeves / a.3 dreads; blunderbuss a.1 leg staves (barrelBracers on legs). One per unit unless under 5 pickable.
- Shared 431: pirateDress PIRATE_BELT (pirateBelt), CAPTAIN_BEARD (captainBeard; pirateBeard takes a colour), QUEEN_SKIRT (queenSkirt); cannonBandanna dresses flintlock + bomb_thrower (hat none); propBuilder CUTLASS bowl guard, BLUNDERBUSS rebuilt; proceduralAnimation QUEEN_GUARD _restQueenBlades; dynastyDress DRAGON_FORM [R] (no DRAGON_MUZZLE).
- Shared earlier: pirateHair, PIRATE_SOCKS/PLAIN_SOCKS, PIRATE_BEARD, CANNON_BANDANNA, buildCutlass + CUTLASS_SLASH, PIRATE_KICK, GUN_TOSS, DRAGON_BLAST, CAPTAIN_COAT, CAPTAIN_PARROTS, QUEEN_HAIR, QUEEN_CUTLASS, BARREL_BRACERS, HARPOON_BAYONET.
- LEDGER at 15956/16000 and LESSONS at 9998/10000: compact pirate 427-428 rows and merge lessons before adding.

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
