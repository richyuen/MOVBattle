# map.viking
Status: open   Audited: 562 (AUDIT x2), 573 (CONFIRM: passed a, b)   Done: -
## Verdicts
a PASS (573: struck 5, 6; CONFIRM 573)
b FAIL (571: struck 3): 2. Snowbanks with pine forest on the sides absent in map_viking_top — TABS: raised snowy shore with pines (ref: reference/stages/introduction.ice_archers_only_almost.png)
c PASS (574 judge)

## Ranked gaps
1. [S] b — white snowbank that reads from above — blocker 2: bankFace sheet with upward normals (check the first normal; wind or flipFaces), vertex colour white to pale blue (0.75,0.84,0.95) at most, emissive SNOW_SHADE x1.0, shore rocks large enough to show at the bank foot; BANK.top stays 2.4 m — ref: reference/stages/introduction.ice_archers_only_almost.png — ours: map_viking_ground.png, map_viking_top.png

## Attempts (iter | gap | criterion | verdict)
565-566 | [S] own builder; ice lake, cracks, snow banks; field cleared | a, b | 2 APPROVE struck a1, b1, b4
570-572 | [S] snow pines; ship in the ice; blizzard sky and mist | a, b | 3 APPROVE, struck a2, a3, a4, b3
573 | [S] raised snowbanks (264fb953) | b | APPROVE, no strike
573 | [S] ice underside (c44dc74a); frozen waterfall (f74d311d) | a | 2 APPROVE, struck a5, a6 (a PASS); CONFIRM passed a, b
574 | [S] shaded bank face and shore rocks (fdb5043b) | b | REJECT (attempts 1): face rendered near black, regressed a
574 | [P] BANK.top 2.4 -> 4.5 (dc64fad6) | b | REJECT: doubled the dark face

## Rejected (last 4)
- 574 [S] fdb5043b bankFace: double-sided vertex-coloured sheet over the ramp renders near black in ground/army shots; rocks unseen (attempts 1)
- 574 [P] dc64fad6 BANK.top 4.5: a tall dark wall hiding pine trunks (attempts 1)

## Notes (max 3 lines)
- Stages on it (8): introduction.ice_archers_only_almost, introduction.longships, challenge.ice_archer_and_friends, challenge.big_brawl, dynasty.viking_army, spooky.breakout, fantasy_good.clash_of_warriors, fantasy_evil.dismantle_the_spears (all enemies x 29..40, |z| <= 18, inside the lake).
- Critic 573: cascade glows near white (iceMat self-light 0.5 -> 0.3); underside sides drum-like.
