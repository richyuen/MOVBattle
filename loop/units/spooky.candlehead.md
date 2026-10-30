# spooky.candlehead
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 434)
 1. head in unit_spooky.candlehead_idle is a plain team head with a tiny wick and a yellow glow — TABS: a tall stacked cream-wax candle tower over the head topped by a big cyan flame (ref: spooky.candlehead.red.png)
 2. body in unit_spooky.candlehead_idle is bare team skin — TABS: team robe to mid-thigh with a white V collar edged in gold (ref: spooky.candlehead.red.png, card Appearance "wears a robe")
 3. upper arms in unit_spooky.candlehead_idle bare — TABS: gold armbands on both upper arms (ref: spooky.candlehead.red.png)
 4. lower legs in unit_spooky.candlehead_idle plain team — TABS: dark team boots to the knee with gold bands (ref: spooky.candlehead.red.png)
b PASS (436: both forearms huge wax candles with cyan flames)
c PASS (435: cyan spirit fire; the struck man knocked up into the air)
d PASS (cost 200, hp 0.68x, dmg 0.39x, cd 1.10x; 436 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a candle tower - blocker 1: stacked cream wax tower over the head with a big cyan flame - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 436)
2. [S] a robe - blocker 2: team robe to mid-thigh with a white V collar edged gold - ref: spooky.candlehead.red.png - ours: unit_spooky.candlehead_idle (critic 436)
## Attempts (iter | gap | criterion | verdict)
434 | SPIRIT_FIRE cyan ball projectile (7ae6e9c8) | c | approved (struck 1)
435 | SPIRIT_LIFT knock-up on a spirit_fire hit (a575da38) | c | approved (struck 2; c PASS)
436 | CANDLE_ARMS lumpy wax forearm candles + cyan flames, torch hidden (4202591b) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 436 critic: wax reads white-grey and as a string of round beads (TABS warm cream melted slabs). Candles: spookyDress candleArms/CANDLE_ARMS.
- A candle tower over the head re-frames every shot (LESSONS mesh top rule): a RE-AUDIT follows that gap.
- Evidence 435 (b90a44ee): ability pair = the knockup (ABILITY_PREF). Knock-up: projectileSystem _knockUpFromSpiritFire / SPIRIT_LIFT.
