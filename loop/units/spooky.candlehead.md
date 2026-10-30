# spooky.candlehead
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. head in unit_spooky.candlehead_idle is a plain team head with a tiny wick and a yellow glow — TABS: a tall stacked cream-wax candle tower over the head topped by a big cyan flame (ref: spooky.candlehead.red.png)
 2. body in unit_spooky.candlehead_idle is bare team skin — TABS: team robe to mid-thigh with a white V collar edged in gold (ref: spooky.candlehead.red.png, card Appearance "wears a robe")
 3. upper arms in unit_spooky.candlehead_idle bare — TABS: gold armbands on both upper arms (ref: spooky.candlehead.red.png)
 4. lower legs in unit_spooky.candlehead_idle plain team — TABS: dark team boots to the knee with gold bands (ref: spooky.candlehead.red.png)
b FAIL (0 since 434)
 1. main hand in unit_spooky.candlehead_idle holds a dark stick — TABS: both forearms sheathed in huge melted cream candles with cyan flames at the bottom (ref: spooky.candlehead.red.png, card Main Hand/Off Hand Candle Fire)
c PASS (435: cyan spirit fire; the struck man knocked up into the air)
d PASS (cost 200, hp 0.68x, dmg 0.39x, cd 1.10x; 435 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b candle arms - blocker 1: forearms sheathed in huge melted cream candles with cyan flames at the bottom - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 435)
2. [S] a candle tower - blocker 1: stacked cream-wax candle tower over the head with a big cyan flame - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 435)
## Attempts (iter | gap | criterion | verdict)
434 | SPIRIT_FIRE cyan ball projectile (7ae6e9c8) | c | approved (struck 1)
435 | SPIRIT_LIFT knock-up on a spirit_fire hit (a575da38) | c | approved (struck 2; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Evidence 435 (b90a44ee): ability pair = the knockup (ABILITY_PREF); fire_dot logs status:fire at the cast, so _struck (800 ms) is before the missile lands.
- Knock-up: projectileSystem _knockUpFromSpiritFire / SPIRIT_LIFT.
