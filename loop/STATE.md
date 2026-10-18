# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 318   Batch: tribal (1/18)   Consecutive empty: 0   Done: 0/139   Parked: 0
Batches, in order: tribal, farmer, medieval, ancient, viking, dynasty, renaissance, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector -+++ o | spear_thrower --++ o | stoner ---+ o | bone_mage -+-+ o | chieftain --++ o | mammoth -+-+ o
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
318 (BASE e14fd1c): [S] protector b moss chunks af37ab3 approved | [S] chieftain b lashed stone head 83bec0d + 069541b approved | [S] spear_thrower b spear raised overhead b194791 rejected (reverted 62d30bf) | [S] stoner c forward toss 9a15b0d approved | [S] bone_mage c leaves along the spike line 000f0de approved | [P] bone_mage c spike girth 8b32ce8 approved (fallout of 7496412). Evidence 22f8d75: a short throw's _flight at 45% of the way to the hit. 5/6 approved, no regressions; protector.b flipped to PASS.
317 (BASE 2676b33): 6/6 approved (bone spike row 7496412, stick-and-launch 6f13b5a, two-handed grip 6a1bbe4, no back spear 3fd57a5, upright carry b6bc951, [P] stone size 3ce2f90).

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.protector (af37ab3) VERDICT: APPROVE CRITERION: tribal.protector.b PASS (previous: FAIL) BLOCKERS: struck: 1 (316), 2 (317), 3 (this commit) — none remaining
- GAP: [S] tribal.chieftain (83bec0d + 069541b) VERDICT: APPROVE CRITERION: tribal.chieftain.b FAIL (previous: FAIL) BLOCKERS: 1. (struck 316) 2. struck (this commit) 3. added: rope is a loose hoop standing off the stone — TABS: twine bound tight over the stone and round the handle top, crossing in an X
- GAP: [S] tribal.spear_thrower (b194791) VERDICT: REJECT CRITERION: tribal.spear_thrower.b FAIL (previous: FAIL) BLOCKERS: 1 kept (the shaft runs DOWN from the fist behind the head, leaf at the nape, point backward); 2 kept
- GAP: [S] tribal.stoner (9a15b0d) VERDICT: APPROVE CRITERION: tribal.stoner.c FAIL (previous: FAIL) BLOCKERS: 1 struck (this commit); 2 kept: the named shot cannot show it (camera inside the dust, squire thrown out of frame) — re-aim _struck from the far rig at impact+9 ticks by evidence commit
- GAP: [S] tribal.bone_mage (000f0de) VERDICT: APPROVE CRITERION: tribal.bone_mage.c FAIL (previous: FAIL) BLOCKERS: 1 (struck 317) 2 struck (this commit) 3 kept (bent over backward between two spikes, boots on the turf)
- GAP: [P] tribal.bone_mage (8b32ce8) VERDICT: APPROVE CRITERION: tribal.bone_mage.c FAIL (previous: FAIL) BLOCKERS: unchanged
- REGRESSIONS: none
Batch ranked order (critic, 318): spear_thrower.b spear stood up out of the fist (turn the hand/re-seat the shaft about pi at the cock), chieftain.b lashing bands (flat strips replacing the tori; flips b), stoner.b faceted boulder cradled two-handed, bone_mage.c spike loft, spear_thrower.b stone leaf head, protector.a skull helmet, chieftain.a animal-skull helmet, stoner.a one-shoulder garment, bone_mage.a hide cape, clubber.a hair and beard, mammoth.a brown fur hide, mammoth.c Mammoth Charge. No [P] fallout was listed. Stoner.c blocker 2 is unranked until its _struck re-aim lands.

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
- 319 starts at step 3: first an evidence commit (loop(319.0): evidence) re-aiming unit_tribal.stoner_struck from the far rig at impact+9 ticks (the critic says the 2 m camera sits inside the impact dust and the thrown squire leaves the frame); then up to 5 [S] from the 318 ranked order above (2 per unit max, different criteria; spear_thrower's two b gaps are one criterion so take only the first). No [P] is eligible (none listed as fallout).
- Spear thrower (attempts 1 on b): the javelin's +y runs from the fist TOWARD the elbow, so a raised straight arm hangs it down the back; the fix turns the hand/node about pi at the cock and un-turns through the swing (critic's NEXT). The 318 look read the shot wrong: the dark head above the fist was the leaf at the nape.
- A look's output/loop/look/ is wiped by the next capture run: read a look's shots before starting another. Two captures cannot run at once (one preview port). capture.mjs `--units a,b` is comma-separated; a look of 5 units ~5 min. Browns and greys go near-black in the capture's shade: prop materials get an emissive of 0.1-0.2. `node loop/scripts/inspect-prop.mjs <id> [--no-build]` writes output/loop/inspect_<id>_{front,side}.png (the "ext" it prints is unreliable; trust the pictures).
- The animator keys on prop names: a hafted weapon root must match the regex at proceduralAnimation.ts ~1606 (club|blade|handle|...), a caster's staff is "staff" with an "orb" child, a shield matches /shield$/; a "club" with an empty off hand is two-handed. A prop that must read in the placement frame needs _carryTurn = 1 at _buildCarry.
- Two gaps in one file: edit, commit, then edit the next; stage by path, never -a (STATE/LEDGER stay dirty). Do not chain shell commands. v1 is under loop/archive/v1/, tag loop-v1-final.
