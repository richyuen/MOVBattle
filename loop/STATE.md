# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 402   Batch: farmer:re+ancient+viking (5-8/19)   Consecutive empty: 0   Done: 32/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+++ o | ice_archer -+++ o | brawler -+++ o | berserker ++++ D | valkyrie -+++ o | longship ++-+ o | jarl -+++ o
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
401 (BASE 0b04353): [S] longship a.4 two carriers + 1.8x ship (e0fbb2c) approved, a struck; CONFIRM then failed c | [S] jarl a.5 pelt curtains to the hips (fd578de + 9c1b402) approved, 5 struck | [S] valkyrie a.2 cream helm feathers, eye-line band, tall crest (c0c74ea + cbecbca) approved, 2 struck | [S] ice_archer c.1 bead flakes out, nine icicles (5509051) approved, c PASS | [S] headbutter c.1 reach .75 + sprawl .14 s + arms trailing (41852fd + fde5dd6) approved, c PASS | [S] headbutter a.4 bracer fur + belt at the waist (7f8b218) approved, 4 narrowed | [S] brawler a.4 second wider bib (05ccbb8 + 6f22d10, reverted a1edda8/3d01ac1) REJECTED - 6/7
400 (BASE 5a4fea1): [S] farmer.halfling a.5 shorts hem 74d90a4 approved (struck a.5) | [S] ancient.zeus a.3 emblem 6169685+9f043da approved (blocker 3 stands: still pink-grey) | [S] viking.headbutter c.1 dive + prone sprawl 7c3bc11 approved (blocker 1 stands) | [S] viking.headbutter a.4 unlit fur + buckle 4c49b9b approved (blocker 4 stands) | [S] viking.ice_archer c.1 icicles under the shaft 92f8e5b approved (blocker 1 stands) | [S] viking.valkyrie a.2 own helm 715aff5 approved (blocker 2 stands) | [S] viking.longship a.1 deep hull c0da83d approved (struck a.1) | [R] viking.jarl a.1 bear-head hood f80dd04 approved (struck a.1; added a.5) - 8/8

## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.longship (e0fbb2c) VERDICT: APPROVE CRITERION: viking.longship.a PASS (previous: FAIL)
- GAP: [S] viking.jarl (fd578de, 9c1b402) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] viking.valkyrie (c0c74ea, cbecbca) VERDICT: APPROVE CRITERION: viking.valkyrie.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (5509051) VERDICT: APPROVE CRITERION: viking.ice_archer.c PASS (previous: FAIL)
- GAP: [S] viking.headbutter (41852fd, fde5dd6) VERDICT: APPROVE CRITERION: viking.headbutter.c PASS (previous: FAIL)
- GAP: [S] viking.headbutter (7f8b218) VERDICT: APPROVE CRITERION: viking.headbutter.a FAIL (previous: FAIL)
- GAP: [S] viking.brawler (05ccbb8, 6f22d10) VERDICT: REJECT CRITERION: viking.brawler.a FAIL (previous: FAIL)
- CONFIRM viking.longship a PASS | b PASS | c FAIL | d PASS -> unit stays open, c takes the confirmer's 2 blockers (0 since 401)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 401: 6/7 approved, 1 rejected (brawler bib) and reverted; no regressions. Done 32 still. Batch unchanged: farmer:re 2 open, ancient 2, viking 6.
- longship c reopened by the CONFIRM: the carriers vanish at the hurl (the hull snaps from overhead to y=0) and the landed oarsmen hold no oars - those two are its next picks.
- Next ranked: brawler a the jaw locks splayed wide of the board's rim (not more chest length); jarl a the beard then the chest/arms; valkyrie a the collar then the armour; ice_archer a the front view (evidence commit first); headbutter a warm cream fur on a new material + a broad belt.
- v4 rules (401 review): ice_archer's back-view evidence commit is 402's first commit (outside the 7); minotaur.a (no attempt since 396) is starving and its [R] takes the [R] slot; wheelbarrow.a starves at 403.
- No CONFIRM passed; nothing became D.

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
