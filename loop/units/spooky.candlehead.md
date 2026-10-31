# spooky.candlehead
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434)
  (struck 1 at 438)
 2. body in unit_spooky.candlehead_idle is bare team skin — TABS: team robe to mid-thigh with a white V collar edged in gold (ref: spooky.candlehead.red.png, card Appearance "wears a robe")
 3. upper arms in unit_spooky.candlehead_idle bare — TABS: gold armbands on both upper arms (ref: spooky.candlehead.red.png)
 4. lower legs in unit_spooky.candlehead_idle plain team — TABS: dark team boots to the knee with gold bands (ref: spooky.candlehead.red.png)
b PASS (436: both forearms huge wax candles with cyan flames)
c PASS (435: cyan spirit fire; the struck man knocked up into the air)
d PASS (cost 200, hp 0.68x, dmg 0.39x, cd 1.10x; 438 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a robe - blocker 2: CANDLE_ROBE team robe to mid-thigh with a white V collar plate edged in gold - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 438)
2. [S] a boots - blocker 4: dark team knee boots with two gold bands - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 438)
## Attempts (iter | gap | criterion | verdict)
434 | SPIRIT_FIRE cyan ball projectile (7ae6e9c8) | c | approved (struck 1)
435 | SPIRIT_LIFT knock-up on a spirit_fire hit (a575da38) | c | approved (struck 2; c PASS)
436 | CANDLE_ARMS lumpy wax forearm candles + cyan flames, torch hidden (4202591b) | b | approved (struck 1; b PASS)
438 | CANDLE_TOWER wax cap with drips, lumpy column, big cyan flame (584ca625) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 438 critic: the tower's flame blooms near white and only about the head's width (TABS a larger pale-cyan octagon wider than the column), minor. The tower re-frames his shots (mesh-top rule); 438's critic judged b, c on the new frames, no regression.
- Candles: spookyDress candleArms/CANDLE_ARMS, candleTower/CANDLE_TOWER (hides propBuilder candle_flame's wick + flame).
- Evidence 435 (b90a44ee): ability pair = the knockup (ABILITY_PREF). Knock-up: projectileSystem _knockUpFromSpiritFire / SPIRIT_LIFT.
