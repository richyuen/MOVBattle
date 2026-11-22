# wild_west.lone_ranger_and_his_friends
Status: open   Audited: 619 (AUDIT x2), 621 (CONFIRM: passed -; failed b), 622 (CONFIRM: passed -; failed b), 623 (CONFIRM: passed -; failed b)   Done: -
## Verdicts
a PASS (623 judge)
b FAIL plateau (CONFIRM failed b: 621, 622, 623; list from CONFIRM 623): s1. two Miners each side of the three front Cacti in stage_wild_west.lone_ranger_and_his_friends_army.png (struck 621) | s2. separate Gunslinger pair behind the Cacti beside the Miners in _army (struck 621) | s3. Deadeye pair behind the Gunslingers in _army (struck 621) | s4. one Lasso either side of the Deadeyes in _army (struck 621) | 5. the Quick Draw centrally between the two rear shooters before the town (all in _army) — TABS: the Quick Draw stands alone and fully visible at the centre of the rear, between the two Deadeyes, with the town church behind him (ref: reference/stages/wild_west.lone_ranger_and_his_friends.png, .thumb.png)
c PASS (623 judge)
## Ranked gaps
1. [R] b party re-laid on the player-to-chapel axis — blocker 5: the chapel at (39,35) straight behind (+x) a lone Quick Draw; Deadeyes ~6 m either side of him, clear of the rock wall; Lassos off the rear trio; stage zone in main.ts:checkStage moved with it; _army back to alpha PI (critic + CONFIRM 623: a camera swing alone cannot put the church behind him) — ref: reference/stages/wild_west.lone_ranger_and_his_friends.png — ours: _army
## Attempts (iter | gap | criterion | verdict)
621 | 5ccadfa6, 5239e243, b9af7403 Miners, Gunslingers, Deadeyes, Lassos, QD (35.5,-18) | b1-b4 | APPROVE (struck 1-4)
622 | 33be5f30+60af33c0 party dz+20 onto open sand; stage zone (32,2) 10x15 | b5 | APPROVE, no strike; CONFIRM failed b
623 | 289dcb2b evidence: _army alpha PI+.75, beta 1.3, radius 34 (chapel behind-left of the party) | b5 | APPROVE, no strike; CONFIRM failed b
## Rejected (last 4)
## Notes (max 3 lines)
- A low rock-wall obstacle sits near (35.5,2); the chapel is a box obstacle at (39,35) half 3.7x5.7, door facing -z. Validate with --check-only.
- Team-1 strips z -27..-9 and 9..27 (x 27..61); the party stands on its stage zone. CONFIRM 623 also flagged foreground boulders in the swung _army.
