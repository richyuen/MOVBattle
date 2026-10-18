# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 328   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ---+ o | fencer ---+ o | balloon_archer ---+ o | musketeer ---+ o | halberd ---+ o | jouster ---+ o | da_vinci_tank ---+ o
farmer: halfling ???? q | farmer ???? q | hay_baler ???? q | potion_seller ???? q | harvester ???? q | wheelbarrow ???? q | scarecrow ???? q
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
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
328 (BASE 3b4c2c2): [S] fencer b back slab 68ad77a approved | [S] halberd a sallet 0860943 approved | [S] musketeer b musket 9951a96 + 418ba56 approved | [S] painter b palette 642eb06 approved | [P] painter b brush girth 67edb37 approved | [S] jouster b lance 4a390e5 + b5ed844 approved. 6/6, no regressions.
327 (BASE 738015e): 5/5 approved (balloon_archer brim hat, painter brush, fencer cavalier hat, halberd head, musketeer morion).

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.fencer (68ad77a) VERDICT: APPROVE CRITERION: renaissance.fencer.b FAIL (previous: FAIL) BLOCKERS: struck: 2. Remaining: 1.
- GAP: [S] renaissance.halberd (0860943) VERDICT: APPROVE CRITERION: renaissance.halberd.a FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2.
- GAP: [S] renaissance.musketeer (9951a96 + 418ba56) VERDICT: APPROVE CRITERION: renaissance.musketeer.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2.
- GAP: [S] renaissance.painter (642eb06) VERDICT: APPROVE CRITERION: renaissance.painter.b FAIL (previous: FAIL) BLOCKERS: struck: 2; added: 3 (palette held square before the chest, hides the brush).
- GAP: [P] renaissance.painter (67edb37) VERDICT: APPROVE CRITERION: renaissance.painter.b FAIL (previous: FAIL) BLOCKERS: 3.
- GAP: [S] renaissance.jouster (4a390e5 + b5ed844) VERDICT: APPROVE CRITERION: renaissance.jouster.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2.
- REGRESSIONS: none. d PASS 7/7 (stats 328).

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
- balloon_archer and da_vinci_tank had no pick in 328 (their files still hold ranked gaps; bow is shared by every archer: thread a variant, do not add a WeaponType). Fallout [P]s open: painter PALETTE_HOLD out, musketeer MUSKET long/bore.
- LEDGER sits at ~13960/14000 bytes: keep new rows terse and trim old earlier-values notes before adding.
- One-handed props: the hand's +y runs up the forearm; build along +y and turn rotation.x = PI (painter brush), or the prop lies along the arm.
- After any --iter capture rerun stats --batch <batch> --iter N (the capture drops stats.json). capture.mjs --units takes a comma list.
- Capture shade greys warm browns: dark saturated base with emissive 0.1 reads brown. Never put a bare `cat > file` (no heredoc) in a command.
