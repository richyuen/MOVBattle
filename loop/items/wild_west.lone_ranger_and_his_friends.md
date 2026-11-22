# wild_west.lone_ranger_and_his_friends
Status: open   Audited: 619 (AUDIT x2), 621-623 (CONFIRM: failed b x3), 624 (CONFIRM: passed -; failed b)   Done: -
## Verdicts
a PASS (624 judge)
b FAIL plateau (CONFIRM failed b: 621, 622, 623, 624; list from CONFIRM 624): s1. two Miners each side of the three front Cacti in stage_wild_west.lone_ranger_and_his_friends_army.png (struck 621) | s2. separate Gunslinger pair behind the Cacti beside the Miners in _army (struck 621) | s3. Deadeye pair behind the Gunslingers in _army (struck 621) | s4. one Lasso either side of the Deadeyes in _army (struck 621) | 5. the Quick Draw centrally between the two rear shooters before the town (all in _army) — TABS: the Quick Draw stands alone and fully visible at the centre of the rear, between the two Deadeyes, with the town church behind him (ref: reference/stages/wild_west.lone_ranger_and_his_friends.png, .thumb.png)
c PASS (624 judge)
## Ranked gaps
1. [R] b Quick Draw seen whole — blocker 5: he stands (33,23) inside the chapel's raised red mound/disc (x~30..36, z~20..26 in _army) with his legs hidden: move him and the rear trio off it onto open sand (e.g. QD ~29.5,23, Deadeyes/Lassos with him, keep the chapel behind-left), or lift him onto the mound via MapBuildResult height — ref: reference/stages/wild_west.lone_ranger_and_his_friends.png — ours: _army
## Attempts (iter | gap | criterion | verdict)
621 | 5ccadfa6, 5239e243, b9af7403 Miners, Gunslingers, Deadeyes, Lassos, QD (35.5,-18) | b1-b4 | APPROVE (struck 1-4)
622 | 33be5f30+60af33c0 party dz+20 onto open sand; stage zone (32,2) 10x15 | b5 | APPROVE, no strike; CONFIRM failed b
623 | 289dcb2b evidence: _army alpha PI+.75, beta 1.3, radius 34 | b5 | APPROVE, no strike; CONFIRM failed b
624 | [R] 3caf1182+bd2eb57c party re-laid SW of the chapel (QD 33,23), stage zone (27,23) 16x20, _army alpha PI+0.6 | b5 | APPROVE (critic struck 5); CONFIRM failed b (QD legs hidden in the red mound)
## Rejected (last 4)
## Notes (max 3 lines)
- A rear-street building fills x ~18..27, z ~28..37 (obstacle); the chapel box is (39,35) half 3.7x5.7, door -z. Validate with --check-only.
- Critic 624: left Deadeye partly behind a dead trunk, left Lasso behind the porch post (minor).
