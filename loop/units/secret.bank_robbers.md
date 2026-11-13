# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2), 521, 523 (RE-AUDIT a x2), 524 (RE-AUDIT c x2), 527 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts
a PASS (529: struck 2, gun belt; CONFIRM 527 failed a once)
b FAIL (2 since 527, 2 struck; CONFIRM list)
 1. safe body is pale periwinkle in unit_secret.bank_robbers_idle (pink-magenta in lineup_secret_2). TABS: a deep navy (blue) or dark maroon (red) safe with orange trim (ref: secret.bank_robbers.blue.png, .red.png).
 4. safe floor rests on the robbers' hat crowns in unit_secret.bank_robbers_idle, the brims pressed against its base. TABS: about a forearm's clear gap between the hat and the safe's base (ref: secret.bank_robbers.blue.png) introduced by 865a5057 at runtimeUnit.ts:_tendSafeCarry
c PASS (526: struck 4, fists after the throw; CONFIRM 527)
d PASS (530 stats)
## Ranked gaps
1. [S] secret.bank_robbers.b safe colour — blocker 1: unlit deep team body (navy/maroon), team scaled ~.35 — ref: secret.bank_robbers.blue.png — ours: unit_secret.bank_robbers_idle
2. [P] secret.bank_robbers.b arm reach — blocker 4: robbers' armLength 1 -> ~1.3 so the safe clears the hats (fallout of [S] 865a5057) — ref: secret.bank_robbers.blue.png — ours: unit_secret.bank_robbers_idle
## Attempts (iter | gap | criterion | verdict)
530 | safe door: big orange dial and boss, handle on a stem plate, hinge blocks with orange diamond studs, SAFE_DOOR (f4eb62e2) | b | approved (struck 2)
530 | straight-arm carry: safe floor at the shorter man's locked reach (SAFE_CARRY.reach .97), flank robber scale 1.06 legLength 1.22 (865a5057) | b | approved (struck 3; added 4)
529 | dark brown gun belt, brass buckle, holstered grip each hip, ROBBER_BELT (e692516e) | a | approved (struck 2, a PASS)
528 | magenta bandana over the lower face, point over the chest, ROBBER_BANDANA (84812928) | a | approved (struck 1; 3 by lineup)
518-527 | vault, overhead carry, hurl, crowns, door, sleeves, fists, legs, boots, vest | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM 527 failed a, b once: a second fail makes that criterion plateau.
- 530 critic: the handle reads as a three-lobed knob (TABS straight T-bar with knobbed ends; not a blocker).
- 519: card "the taller one", so a slight height gap is TABS.
