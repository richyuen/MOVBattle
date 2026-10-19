# renaissance.painter
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 368; 1 [S] rejected)
 1. beret in unit_renaissance.painter_idle: a flat wide disc with a dark notch on top — TABS: a soft puffy beret pulled to one side over the brow (ref: .red.png, .jpg)
 2. jabot in unit_renaissance.painter_idle: a small tan triangle on the chest — TABS: a broad tan ruffle in stacked tiers wrapping the throat out to the collar, the face clear above it (ref: renaissance.painter.jpg)
 3. figure in unit_renaissance.painter_idle: hunched, short-legged, grey-brown trousers — TABS: lanky upright, long khaki-tan legs (ref: .red.png)
b PASS (368)
c FAIL (0 since 368)
 1. missing: Painter Dodge (sidestep off an incoming projectile; card Abilities); needs an _ability shot vs an archer
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a jabot under the jaw — blocker 2: tiers seated with the top at the jaw line (under the head, not over it), flared tiers with a step and darker underside between, warm tan, less glow — ref: renaissance.painter.jpg — ours: unit_renaissance.painter_idle.png
2. [S] a puffy beret — blocker 1: a puffed faceted beret pulled down to one side over the brow — ref: .red.png — ours: unit_renaissance.painter_idle.png
3. [S] c Painter Dodge — blocker 1: projectile-dodge sidestep (log it), capture vs an archer — ref: card Abilities — ours: unit_renaissance.painter_release.png
## Attempts (iter | gap | criterion | verdict)
333-335 | jabot folds, then cravat wrap, knot, tail [S] (15c41f6) | a | approved
328-334 | palette, splotches, hair [S]; palette-out and ruff-colour [P] rejected | b,c,a | approved
368 | stacked-tier jabot, 3 ragged ruffles (painterJabot, renaissanceDress.ts) [S] (53e6e78, reverted) | a | rejected
## Rejected (last 4)
- jabot colour [P] [1] — 334: PAINTER_RUFF_COLOR — no visible change, plain cloth renders grey
- stacked-tier jabot [S] [1] — 368: top tier .over .3 head over the chest top — covered chin and lower face, read as a beard; tiers merged into one cone; pale cream
## Notes (max 3 lines)
- dressPainter: PAINTER_CRAVAT (self-lit wrap, knot, tail) on the torso; _holdPalette solves the off hand beside the shoulder (PALETTE_OUT).
- Jabot twice read as a beard (333 to mid-chest, 368 over the chin): keep every tier below the head mesh's bottom; new code in renaissanceDress.ts.
