# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 517   Batch: secret_2   Consecutive empty: 0   Done: 110/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen ++++ D
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower ++++ D | miner ++++ D | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter ++++ D | pike ++++ D | barrel_roller ++++ D | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh ++++ D | wizard ++++ D | chariot ++++ D | thor ++++ D | tank ++++ D | super_boxer ++++ D | dark_peasant ++++ D | super_peasant ++++ D
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin ++++ D | divine_arbiter ++++ D | sacred_elephant ++++ D | chronomancer ++++ D
evil: shadow_walker ++++ D | exiled_sentinel ++++ D | mad_mechanic ++++ D | void_cultist ++++ D | tempest_lich ++++ D | death_bringer ++++ D | void_monarch ++++ D
secret_1: ballooner ++++ D | bomb_on_a_stick ++++ D | fan_bearer ++++ D | raptor ++++ D | the_teacher ++++ D | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu ++++ D | executioner ++++ D | shouter ++++ D
secret_2: taekwondo -+-+ o | raptor_rider ---+ o | cheerleader -+-+ o | cupid ---+ o | mace_spinner ---+ o | clams -+-+ o | present_elf ---+ o | ice_mage ---+ o | infernal_whip ---+ o | bank_robbers ---+ o
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 517; BASE c84951f9)
1. [R] secret.fan_bearer.a blocker 1 + CONFIRM lists (798bbba5) APPROVE, struck 1; a PASS; CONFIRM passed, done
2. [S] secret.present_elf.a blocker 1 (b34b4519, 8142c383) APPROVE, struck 1, 7, 6 by lineup
3. [S] secret.ice_mage.a blocker 1 (c46885b9, b82fd72b) APPROVE, struck 1
4. [S] secret.infernal_whip.a blocker 1 (78eabf45) APPROVE, struck 1, 5 and 6 by lineup
5. [S] secret.taekwondo.a blocker 3 (6679b6c8) APPROVE, struck 3, 5 by lineup
6. [S] secret.cupid.a blocker 4 (7159b2bf) APPROVE, struck 4
7. [S] secret.cheerleader.a blocker 3 (9a0c8787) APPROVE, struck 3, 4 by lineup
- 7/7, 13 struck (cupid.b.2 heart arrow picked then left unattempted: the nocked arrow is a glow orb, needs a real aimed mesh)

## Last verdicts (critic header lines verbatim)
- GAP: [R] secret.fan_bearer (798bbba5) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.a PASS   (previous: FAIL)
- GAP: [S] secret.present_elf (b34b4519, 8142c383) / VERDICT: APPROVE / CRITERION: secret.present_elf.a FAIL   (previous: FAIL)
- GAP: [S] secret.ice_mage (c46885b9, b82fd72b) / VERDICT: APPROVE / CRITERION: secret.ice_mage.a FAIL   (previous: FAIL)
- GAP: [S] secret.infernal_whip (78eabf45) / VERDICT: APPROVE / CRITERION: secret.infernal_whip.a FAIL   (previous: FAIL)
- GAP: [S] secret.taekwondo (6679b6c8) / VERDICT: APPROVE / CRITERION: secret.taekwondo.a FAIL   (previous: FAIL)
- GAP: [S] secret.cupid (7159b2bf) / VERDICT: APPROVE / CRITERION: secret.cupid.a FAIL   (previous: FAIL)
- GAP: [S] secret.cheerleader (9a0c8787) / VERDICT: APPROVE / CRITERION: secret.cheerleader.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: fan_bearer ++++ (done). secret_1 checkpoint 12/12 GREEN (output/loop/iter-517/summary.checkpoint.json); secret_1 dropped from Batch.

## Notes for next iteration (max 5 lines)
- 518 first: RE-AUDIT a and b of present_elf, ice_mage and infernal_whip on the new idle (hoods gone, faces show); give the critic their Verdicts blocks.
- raptor_rider, mace_spinner, bank_robbers have had no attempt since their 515 audit: pick their ranked #1 (raptor mount is a linked actor with hideBaseBody, linkedActorPresets).
- Per-slice lineups: lineup_secret_2 is the slice lineup for every open unit now.
- cheerleader: the poms in front of her hips hide top and skirt in idle and lineup (TABS holds them out at the hip sides).
