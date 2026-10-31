# spooky.candlehead
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434)
  (struck 1 at 438, 2 at 439)
 3. upper arms in unit_spooky.candlehead_idle bare — TABS: gold armbands on both upper arms (ref: spooky.candlehead.red.png)
 4. lower legs in unit_spooky.candlehead_idle plain team — TABS: dark team boots to the knee with gold bands (ref: spooky.candlehead.red.png)
b PASS (436: both forearms huge wax candles with cyan flames)
c PASS (435: cyan spirit fire; the struck man knocked up into the air)
d PASS (cost 200, hp 0.68x, dmg 0.39x, cd 1.10x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a boots - blocker 4: spookyDress candleBoots, dark team boot shafts from the foot to the knee with two gold bands near the top - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 439)
2. [S] a armbands - blocker 3: gold bands round both upper arms - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 439)
## Attempts (iter | gap | criterion | verdict)
434-435 | SPIRIT_FIRE ball; SPIRIT_LIFT knock-up (7ae6e9c8, a575da38) | c | approved (c PASS)
436 | CANDLE_ARMS lumpy wax forearm candles + cyan flames, torch hidden (4202591b) | b | approved (struck 1; b PASS)
438 | CANDLE_TOWER wax cap with drips, lumpy column, big cyan flame (584ca625) | a | approved (struck 1)
439 | CANDLE_ROBE square team robe to the thigh, dark hem band, gold-edged white V bib (b10d272a) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 439 critic: the robe is a stiff box ending at the top of the thigh, the dark hem band barely shows (TABS slightly flared to mid-thigh), minor. 438: the tower's flame blooms near white, about the head's width.
- Candles, tower, robe: spookyDress candleArms, candleTower, candleRobe (CANDLE_ROBE, triSlab bib).
- Evidence 435 (b90a44ee): ability pair = the knockup (ABILITY_PREF). Knock-up: projectileSystem _knockUpFromSpiritFire / SPIRIT_LIFT.
