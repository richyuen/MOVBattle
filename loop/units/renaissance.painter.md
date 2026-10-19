# renaissance.painter
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 368; 1 [S] rejected)
 2. jabot in unit_renaissance.painter_idle: a pale ruff wrapping the throat, face clear, but one smooth cone no wider than the head, greyish, ending at the neckline — TABS: a broad warm-tan ruffle in clearly stepped tiers out to the collar, over the chest top (ref: renaissance.painter.jpg). Idle is shot from behind his left shoulder: re-aim first (evidence commit)
 3. figure in unit_renaissance.painter_idle: hunched, short-legged, grey-brown trousers — TABS: lanky upright, long khaki-tan legs (ref: .red.png)
b PASS (368)
c FAIL (0 since 368)
 1. missing: Painter Dodge (sidestep off an incoming projectile; card Abilities); needs an _ability shot vs an archer
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Painter Dodge — blocker 1: projectile-dodge sidestep (log it), capture vs an archer — ref: card Abilities — ours: (no ability shot)
2. [S] a jabot — blocker 2: broad warm-tan ruffle, 3 stepped tiers out to the collar (after the idle re-aim) — ref: renaissance.painter.jpg — ours: unit_renaissance.painter_idle.png
3. [S] a figure — blocker 3: lanky upright stance, long khaki-tan legs — ref: .red.png — ours: unit_renaissance.painter_idle.png
## Attempts (iter | gap | criterion | verdict)
328-335 | palette, splotches, hair, jabot folds, cravat [S] | a,b,c | approved
368 | stacked-tier jabot over the chin [S] (53e6e78, reverted) | a | rejected
369 | jabot under the jaw: 3 tiers, fold rings (painterJabot, PAINTER_JABOT) [S] (9f0bd3c) | a | approved
370 | puffed beret: band + faceted puff slid to one side, team colour (BERET_PUFF) [S] (8139915 +afefe3a) | a | approved
## Rejected (last 4)
- jabot colour [P] [1] — 334: PAINTER_RUFF_COLOR — no visible change, plain cloth renders grey
- stacked-tier jabot [S] [1] — 368: tiers over the chin read as a beard; merged into one pale cone
## Notes (max 3 lines)
- dressPainter: jabot renaissanceDress painterJabot (keep tiers below the head mesh's lowest point); _holdPalette (PALETTE_OUT). Beret is propBuilder buildFittedHat "beret".
- Critic 370 minor: beret slide weak, sits nearly centred like a mushroom cap. Cloth tans grey under the sky: raise glow or saturate.
