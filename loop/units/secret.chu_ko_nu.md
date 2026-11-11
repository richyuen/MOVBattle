# secret.chu_ko_nu
Status: open   Audited: 500 (AUDIT x2), 510 (CONFIRM: passed d; failed a, b, c), 511 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a PASS (515 robe to the knee, banded leggings)
b FAIL plateau (2 rejected [S] since 511 RE-AUDIT, 2 struck)
 2. Deep rectangular receiver dominates the torso in unit_secret.chu_ko_nu_idle — TABS: a narrower magazine sits above the stock, leaving the limbs as the dominant crossbow span (ref: reference/units/secret.chu_ko_nu.blue.png).
 4. Crossbow held upright with its limbs at hip height in unit_secret.chu_ko_nu_idle — TABS: held level across the chest, limbs at chest height and the stock running diagonally across the body (ref: reference/units/secret.chu_ko_nu.blue.png).
 5. crossbow in unit_secret.chu_ko_nu_windup — laid level but pointing backwards, prod and magazine trailing behind him away from the man he faces — TABS: the crossbow points ahead of him toward the enemy (ref: reference/units/secret.chu_ko_nu.jpg)
c FAIL (1 since 510 CONFIRM)
 1. Bolt train crosses the air above the visible weapon in unit_secret.chu_ko_nu_flight — TABS: the repeating crossbow bolts should leave the crossbow rail (ref: loop/cards/secret.chu_ko_nu.md, Weapons).
d PASS (515 stats)
## Ranked gaps
1. [R] secret.chu_ko_nu.b hold and back-off — blockers 2, 4, 5: a backpedal whose body yaw is locked on the enemy (verify the move step honours holdHeading), the crossbow hugged across the chest, stock diagonal, limbs at chest height, lay toward the man, a slimmer magazine — ref: reference/units/secret.chu_ko_nu.blue.png, .jpg — ours: unit_secret.chu_ko_nu_idle.png, _windup.png
2. [S] secret.chu_ko_nu.c bolt origin — blocker 1: bolts leave the held crossbow's rail (rcbMuzzle on the laid bow) — ref: card Weapons — ours: unit_secret.chu_ko_nu_flight.png
## Attempts (iter | gap | criterion | verdict)
515 | robe tiers anchored to the knee joint (ea39c522) | a | approved (struck 3)
515 | dark team leggings, three orange wraps, secretDress chuKoNuLeggings (79e1a268) | a | approved (struck 4; a PASS)
515 | readyAim every step + lay flipped + holdHeading on the man (19b0b661, 3948d262; reverted 823dc1cf, c248299a) | b | rejected
514 | bow toward readyAim, lay flipped (09540a69, reverted 4d6431b2) | b | rejected
511 | level two-fist crossbow hold, PA _holdRepeatingCrossbow (7f696d24, 44e1c3fa) | b | approved (struck 1, 3; added 5)
511 | timed bolt train off the rail, SS RCB_VOLLEY (feef9d94) | c | approved (no strike)
503-514 | hair/bun, robe, harness, belt, sleeves, mitts | a | approved
## Rejected (last 4)
515 | b.5 (19b0b661, 3948d262) | attempts 2 | still faces his retreat in the side shots; bow behind him; idle bow thrust to arm's length at head height
514 | b.5 (09540a69) | attempts 1 | windup is a back-off without readyAim: bow trails
## Notes (max 3 lines)
- 515 probe: with holdHeading the probe body faced the man (face 1) and the bow pointed at him (.6 m) while upright; the capture's side shots still show him facing his retreat. A knight at contact knocks him limp (limp 1) and the hold fades.
- c starves at 516 (last attempt 511).
