# renaissance.painter
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 368; 1 [S] rejected)
 1. beret in unit_renaissance.painter_idle: a flat wide disc with a dark notch on top — TABS: a soft puffy beret pulled to one side over the brow (ref: .red.png, .jpg)
 2. jabot in unit_renaissance.painter_idle: now a pale ruff wrapping the throat, face clear, but one smooth cone no wider than the head and greyish, ending at the neckline — TABS: a broad warm-tan ruffle in clearly stepped tiers out to the collar, over the chest top (ref: renaissance.painter.jpg)
 3. figure in unit_renaissance.painter_idle: hunched, short-legged, grey-brown trousers — TABS: lanky upright, long khaki-tan legs (ref: .red.png)
b PASS (368)
c FAIL (0 since 368)
 1. missing: Painter Dodge (sidestep off an incoming projectile; card Abilities); needs an _ability shot vs an archer
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a puffy beret — blocker 1: a puffed faceted beret pulled down to one side over the brow — ref: .red.png — ours: unit_renaissance.painter_idle.png
2. [P] a jabot (fallout of 9f0bd3c) — blocker 2: PAINTER_JABOT bottom tier 1.6 head widths, lying over the doublet, warmer tan; NEXT shows in unit_renaissance.painter_idle
3. [S] c Painter Dodge — blocker 1: projectile-dodge sidestep (log it), capture vs an archer — ref: card Abilities — ours: unit_renaissance.painter_release.png
## Attempts (iter | gap | criterion | verdict)
328-335 | palette, splotches, hair, jabot folds, cravat [S] | a,b,c | approved
368 | stacked-tier jabot over the chin (renaissanceDress.ts) [S] (53e6e78, reverted) | a | rejected
369 | jabot under the jaw: 3 tiers below the head mesh, fold rings, warmer tan (painterJabot, PAINTER_JABOT) [S] (9f0bd3c) | a | approved
## Rejected (last 4)
- jabot colour [P] [1] — 334: PAINTER_RUFF_COLOR — no visible change, plain cloth renders grey
- stacked-tier jabot [S] [1] — 368: top tier .over .3 head over the chest top — covered chin and lower face, read as a beard; tiers merged into one cone; pale cream
## Notes (max 3 lines)
- dressPainter: jabot from renaissanceDress painterJabot (cravat gone 369); _holdPalette (PALETTE_OUT).
- painterJabot measures the head mesh's lowest point in the torso frame: keep every tier below it. Cloth tans grey under the sky: raise glow or saturate.
