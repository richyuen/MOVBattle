# map.spooky_1
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (577: struck 1, 5): 3. leafy round trees in map_spooky_1_ground — TABS: only black, leafless, gnarled trees (ref: card Overview; reference/maps/wiki/spooky_1.png) 4. jack-o-lanterns and candles in map_spooky_1_top — TABS: glowing orange pumpkins and candle clusters scattered along the rims (ref: reference/maps/wiki/spooky_1.png)
b FAIL (577: struck 1, 3, 4): 2. graveyard placement in map_spooky_1_top — TABS: a fenced graveyard on the right plateau, not rows of graves on both halves (ref: card Overview; reference/maps/spooky_1.png) 5. Left ramp in map_spooky_1_top — TABS: a ramp runs down the left side to the room under the bridge; ours has none (ref: card Secrets)
c PASS (577 judge)

## Ranked gaps
1. [S] a dead trees — blocker 3: every leafy ring crown replaced by black gnarled leafless trees — ref: reference/maps/wiki/spooky_1.png — ours: map_spooky_1_ground.png
2. [S] a pumpkins and candles — blocker 4: glowing jack-o-lanterns and candle clusters along both plateau rims — ref: reference/maps/wiki/spooky_1.png — ours: map_spooky_1_top.png
3. [S] b graveyard — blocker 2: fenced graveyard (headstone rows behind an iron fence) on the right plateau only — ref: reference/maps/spooky_1.png — ours: map_spooky_1_top.png

## Attempts (iter | gap | criterion | verdict)
576 | [S] navy night sky, stars and moon, mountains and clouds hidden (4dd2d342) | a | APPROVE, struck a2
577 | [S] night grass, zone slabs hidden (6259e76b) | a | APPROVE, struck a1 (a5 cleared by 479af4ee)
577 | [S] fog chasm: Medieval 1 plateaus on column cliffs, fog ravine, void hazards, stone bridge (479af4ee) | b | APPROVE, struck b1, b3, b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stage: spooky.bone (enemies x 20..22.2, |z| <= 9.9). Shares base campaign.spooky with spooky_2: dress in tabs/spooky_1.ts only.
- Critic 577: fog sheets (28 m rectangles) stick out past the island front; fog reads bright lavender; maroon discs and pink pools remain; zones |x| 5-41 overlap the ravine at |z| > 20.
- nightGrass's floor recolour is moot (fogChasm hides the floor); only its slab hiding and blade colour survive.
