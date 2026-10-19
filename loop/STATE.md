# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 377   Batch: tribal:re+renaissance:re+farmer:re (5-7/21)   Consecutive empty: 0   Done: 24/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller +-++ o | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
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
377 (BASE 2903f04; mammoth a re-audited: FAIL, 4 new blockers, queued): [S] halberd a visor slit 8f7c74f approved | [S] scarecrow a sack hood 5e14f8f approved | [S] harvester a felt hat 84980cf approved | [S] potion_seller b flask by the neck eeb43aa approved | [S] potion_seller a round head ccd37ad approved | [S] farmer a liripipe tail 9f5019c approved | [S] wheelbarrow a narrow tray, Thrower on the rim aa835d7 +4f65905 approved | [P] halfling a belt ee71b48 dropped (reverted 4d8f47c: waist unreadable)

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.halberd (8f7c74f) VERDICT: APPROVE CRITERION: renaissance.halberd.a PASS (previous: FAIL)
- GAP: [S] farmer.scarecrow (5e14f8f) VERDICT: APPROVE CRITERION: farmer.scarecrow.a PASS (previous: FAIL)
- GAP: [S] farmer.harvester (84980cf) VERDICT: APPROVE CRITERION: farmer.harvester.a PASS (previous: FAIL)
- GAP: [S] farmer.potion_seller (eeb43aa) VERDICT: APPROVE CRITERION: farmer.potion_seller.b FAIL (previous: FAIL)
- GAP: [S] farmer.potion_seller (ccd37ad) VERDICT: APPROVE CRITERION: farmer.potion_seller.a PASS (previous: FAIL)
- GAP: [S] farmer.farmer (9f5019c) VERDICT: APPROVE CRITERION: farmer.farmer.a PASS (previous: FAIL)
- GAP: [S] farmer.wheelbarrow (aa835d7 + 4f65905) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)

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
- Open: mammoth a (4 blockers from the 377 re-audit: topline, mane, head dome, tail), potion_seller b (2 [S]), wheelbarrow a (2 [S]), halfling a (evidence first).
- Evidence owed: mammoth _idle ~3x too close + lineup_tribal crops the mammoth; halfling _idle too small for the waist. One evidence commit each re-opens those shots' criteria.
- Scripts take faction names: --batch farmer for farmer:re. Farmer cloth/hair goes in web/src/units/farmerDress.ts.
- A pose wrong only in the capture: probe the animator's own state at the shot. A splayed leg needs its knee rolled (z), not just bent (x).
- Capture replays are deterministic. Particles do not render on the stepped clock. Never bakeCurrentTransformIntoVertices after parenting. Write node scripts with the Write tool.
