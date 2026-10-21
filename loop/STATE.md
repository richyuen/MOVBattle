# Loop state (v3: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D)
Iteration: 395   Batch: farmer:re+ancient+viking (5-7/19)   Consecutive empty: 0   Done: 31/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+-+ o | ice_archer -+-+ o | brawler -+++ o | berserker -+++ o | valkyrie -+++ o | longship ---+ o | jarl -+-+ o
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
395 (BASE 0ff6879): [S] longship b.1 crew oars ffa5a93 approved (narrowed b.1) | [S] longship a.3 shields 512a007 approved (struck a.3) | [S] berserker a.1 beard ad8f6cf approved (struck a.1) | [S] brawler a.2 beard d4bac61 rejected (reverted 0922c08) | [S] headbutter a.4 gear 607fd74 approved (narrowed a.4) | [S] ice_archer c.2 frost 9400138 approved (struck c.2) - 5/6

## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.longship (ffa5a93) VERDICT: APPROVE CRITERION: viking.longship.b FAIL (previous: FAIL)
- GAP: [S] viking.longship (512a007) VERDICT: APPROVE CRITERION: viking.longship.a FAIL (previous: FAIL)
- GAP: [S] viking.berserker (ad8f6cf) VERDICT: APPROVE CRITERION: viking.berserker.a FAIL (previous: FAIL)
- GAP: [S] viking.brawler (d4bac61) VERDICT: REJECT CRITERION: viking.brawler.a FAIL (previous: FAIL)
- GAP: [S] viking.headbutter (607fd74) VERDICT: APPROVE CRITERION: viking.headbutter.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (9400138) VERDICT: APPROVE CRITERION: viking.ice_archer.c FAIL (previous: FAIL)

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
- Batch unchanged; open: halfling, wheelbarrow, minotaur, zeus and all 7 viking. Done 31. 395: 5/6 approved, no unit closed.
- Next ranked: longship paddle oar blades, longship hull, brawler beard BELOW the mask bottom (proud, bib .9 H, braid), brawler boots, berserker fur belt + cuffs, headbutter boots over the feet, ice_archer ice arrow, cap/mantle/cuffs, headbutter dive.
- The minotaur [R] is still owed (scale 2.1 -> ~1.92 makes him Zeus height: probed 3.24 m vs Zeus 2.96 m; plus flat lighter-team girdle inlays, joined flank, pauldron scroll). Wheelbarrow [R] after it; one [R] per iteration.
- ice_archer a needs an evidence commit first (its idle/lineup show its back); valkyrie a.2 helm is next there.
- The longship's shields read as wheels at four a side (not a blocker): three larger ones a side is the critic's note.
