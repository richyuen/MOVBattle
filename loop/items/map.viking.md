# map.viking
Status: open   Audited: 562 (AUDIT x2), 573 (CONFIRM: passed a, b)   Done: -
## Verdicts
a PASS (573: struck 5, 6; CONFIRM 573)
b FAIL (571: struck 3): 2. Snowbanks with pine forest on the sides absent in map_viking_top — TABS: raised snowy shore with pines (ref: reference/stages/introduction.ice_archers_only_almost.png)
c PASS (573 judge)

## Ranked gaps
1. [S] b — bank reads from above — blocker 2: a shaded grey-blue bank face with snow-capped grey rocks along its foot at the lake shore (snowbankSheet) — ref: reference/maps/wiki/viking.png — ours: map_viking_top.png
2. [P] b — bank height — blocker 2: BANK.top 2.4 to 4.5 m (fallout of 264fb953), shows in map_viking_top.png — ref: reference/stages/introduction.ice_archers_only_almost.png — ours: map_viking_top.png

## Attempts (iter | gap | criterion | verdict)
565 | [S] own builder; ice lake with crack network, snow banks (4d8db327) | a1 | APPROVE struck a1, b1
566 | [S] clear inherited obstacles and pits off the lake (1e70afc3) | b4 | APPROVE struck b4
570 | [S] layered snow pines (23af4ed0) | a | APPROVE, struck a2
571 | [S] wooden ship locked in the ice by the left shore (d5caaf8b) | b | APPROVE, struck b3 and a4
572 | [S] cyan blizzard sky, flakes, drawn mist walls (30beeb4b+b35b008f) | a | APPROVE, struck a3
573 | [S] raised snowbanks under the pines, drawn height (264fb953) | b | APPROVE, no strike (white on white, unshaded)
573 | [S] faceted white-blue ice underside (c44dc74a); frozen waterfall crag at the back (f74d311d) | a | 2 APPROVE, struck a5, a6 (a PASS); CONFIRM passed a, b

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it (8): introduction.ice_archers_only_almost, introduction.longships, challenge.ice_archer_and_friends, challenge.big_brawl, dynasty.viking_army, spooky.breakout, fantasy_good.clash_of_warriors, fantasy_evil.dismantle_the_spears (all enemies x 29..40, |z| <= 18, inside the lake).
- Critic 573: cascade glows near white (iceMat self-light 0.5 -> 0.3); underside sides drum-like. Critic 572: sky dull grey-teal; mist top edge hard.
