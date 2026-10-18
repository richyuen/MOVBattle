# medieval.healer
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. headgear in unit_medieval.healer_idle is an olive cap with a brim disc — TABS: bare head, grey tonsure fringe, grey beard (ref: medieval.healer.red.png)
 2. torso in unit_medieval.healer_idle is plain team ending at the hip — TABS: long team priest robe to the shins (ref: medieval.healer.blue.png)
 3. robe details missing in unit_medieval.healer_idle — TABS: two gold bands collar to knee, gold hem trim, turned collar, grey rope belt (ref: medieval.healer.red.png)
b FAIL (0 since 351)
 1. staff in unit_medieval.healer_idle/_release is a thick dark pole with a plain yellow ball over the shoulder — TABS: thin team staff, gold grip and butt cap, team globus cruciger (gold cross bands, finial), upright in one fist (ref: medieval.healer.blue.png)
c FAIL (1 since 351)
 1. healed ally only partly gilded in unit_medieval.healer_flight/_struck: arms and chest pale cream, tunic, legs and helm stay team blue/grey — TABS: the target turns gold while beamed (card Appearance)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c full gild — blocker 1: tint every body and prop material (clothes, armour, helm) saturated gold while beamed, restored after (runtimeUnit _applyDrunk/GILD) — ref: card Appearance — ours: unit_medieval.healer_flight.png
2. [S] b priest staff — blocker 1: thin team staff, gold grip and cap, globus cruciger — ref: medieval.healer.blue.png — ours: unit_medieval.healer_release.png
3. [S] a priest robe — blocker 2: long team robe to the shins — ref: medieval.healer.blue.png — ours: unit_medieval.healer_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _struck shows only two squires, not the healer; _flight shows the beam.
- critic 351: beam core thin next to the halo (TABS: thick saturated orange-gold bar) - fallout [P] HEAL_BEAM.core, shows in unit_medieval.healer_flight.
