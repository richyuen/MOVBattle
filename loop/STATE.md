# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 315   Batch: tribal (1/18)   Consecutive empty: 0   Done: 0/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber --++ o | protector --++ o | spear_thrower ---+ o | stoner ---+ o | bone_mage ---+ o | chieftain --++ o | mammoth -+-+ o
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
315: batch audit only (dry run of loop v2). Stats commit loop(315.0) set tribal cost/hp/dmg/cd from the wiki: 7/7 pass d. Evidence commit: the struck shot of a missile unit is now taken 6 ticks after the target first loses health. No gaps picked; iteration 316 picks from the unit files' Ranked gaps (step 3).

## Last verdicts (critic header lines verbatim)
- UNIT tribal.clubber: a FAIL b FAIL c PASS d (stats) (1/3 of a-c)
- UNIT tribal.protector: a FAIL b FAIL c PASS d (stats) (1/3 of a-c)
- UNIT tribal.spear_thrower: a FAIL b FAIL c FAIL d (stats) (0/3 of a-c)
- UNIT tribal.stoner: a FAIL b FAIL c FAIL d (stats) (0/3 of a-c)
- UNIT tribal.bone_mage: a FAIL b FAIL c FAIL d (stats) (0/3 of a-c)
- UNIT tribal.chieftain: a FAIL b FAIL c PASS d (stats) (1/3 of a-c)
- UNIT tribal.mammoth: a FAIL b PASS c FAIL d (stats) (1/3 of a-c)
Batch ranked order (critic, 315): clubber.b club mesh, chieftain.b stone axes, protector.b plank shield, bone_mage.b deer-skull staff, spear_thrower.c flat javelin, stoner.c forward toss, mammoth.a brown fur, clubber.a hair and beard, spear_thrower.a tusk headband, stoner.a garment, bone_mage.c spike line, mammoth.c charge.

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
- 316 starts at step 3 (the tribal batch is audited, stats done): pick up to 5 [S] from the unit files' Ranked gaps in the batch order above, at most 2 per unit. The full audit text is in output/loop/iter-315/audit.md (not memory; read only if a blocker needs its context).
- Many tribal a-blockers repeat across units (black hair cap, plain loincloth box, dark neck ring): one mechanism (a tribal loincloth with skull and bones, a necklace of bones/tusks, a hair chunk) can clear a blocker on several units, but each unit's gap is its own commit and its own verdict.
- Capture: a batch run is ~5.5 min, a 1-3 unit look ~2.5 min (build included); never step 16 ms in a detection loop (one render per advanceTime call). The struck shot of a missile unit is at the impact frame (summary.notes "target hurt at").
- File edits keep each file's EOL (LF here). Do not chain shell commands. v1 is under loop/archive/v1/, tag loop-v1-final.
