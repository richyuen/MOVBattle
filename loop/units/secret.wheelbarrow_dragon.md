# secret.wheelbarrow_dragon
Status: open   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 532, CONFIRM 532 list)
 1. dragon horns in unit_secret.wheelbarrow_dragon_idle — TABS: two large cream ram-like horns curving out sideways from the back of the head, with smaller cream horns below (ref: secret.wheelbarrow_dragon.red.png / .blue.png)
 2. jaw rims in unit_secret.wheelbarrow_dragon_idle — TABS: cream/bone tooth-lined jaw plates framing the mouth (ref: secret.wheelbarrow_dragon.red.png, secret.wheelbarrow_dragon.jpg)
 3. Traveller's afro in unit_secret.wheelbarrow_dragon_idle — TABS: a big round brown puff rising well above and around the head (ref: secret.wheelbarrow_dragon.blue.png, card Appearance "Afro")
b PASS (532: struck 2, open crocodile jaws; CONFIRM 532 passed)
c PASS (530: struck 1, flame jet from the jaw; CONFIRM 532 passed)
d PASS (532 stats; CONFIRM 532 passed)
## Ranked gaps
1. [S] secret.wheelbarrow_dragon.a ram horns — blocker 1: big curved cream horns (segmented arc, swept out and back) plus a small pair, replacing the grey cones in buildBarrowDragon — ref: secret.wheelbarrow_dragon.jpg — ours: unit_secret.wheelbarrow_dragon_idle
2. [S] secret.wheelbarrow_dragon.a bone jaw plates — blocker 2: cream plates along both jaws' edges framing the mouth (BARROW_JAWS rims wider/taller, swatch colour) — ref: secret.wheelbarrow_dragon.jpg — ours: unit_secret.wheelbarrow_dragon_idle
3. [S] secret.wheelbarrow_dragon.a round afro — blocker 3: a tall round puff over and round the head, not a flat disc (dressAfro is shared with farmer.wheelbarrow: own puff in secretDress) — ref: secret.wheelbarrow_dragon.blue.png — ours: unit_secret.wheelbarrow_dragon_idle
## Attempts (iter | gap | criterion | verdict)
532 | lanky Traveller (bulk .78, arms 1.12, legs 1.14), team overalls over a bare team chest, barrowDriverOveralls (44712ed1) | a | approved (struck 4, a PASS; CONFIRM failed a)
532 | open crocodile jaws with bone rims and fangs, dark gullet keeps "barrowDragonMouth", BARROW_JAWS (f1fb5d6a) | b | approved (struck 2, b PASS)
531 | driver's brown afro (dressAfro), straw hat off (e7664e58, 0ef10b96) | a | approved (struck 3)
530 | barrow dragon flame jet from "barrowDragonMouth", BARROW_BREATH (7b82178a) | c | approved (struck 1, c PASS)
528-529 | plank barrow on a log wheel DRAGON_BARROW; team dragon head in the tray BARROW_DRAGON | a | approved (struck 1, 2; b.1)
## Rejected (last 4)
## Notes (max 3 lines)
- The dragon is built in the barrow (cart actor root); the dragon_head actor is the emitter only. Driver dress gates on posePreset "mounted" and special !== "dragon_barrow".
- 532 critic: driver's hands hang free beside the handles (TABS grips both); a reach onto the handles would read better.
- CONFIRM blockers 1-2 are colour/shape: check horns and rims on a --noglow swatch.
