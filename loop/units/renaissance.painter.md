# renaissance.painter
Status: open   Audited: 368 (re; a, b re-audited 372)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 372)
 1. jabot in unit_renaissance.painter_idle: tan ragged bib down the chest centre, thin at the throat, widest mid-chest, flat like a stain — TABS: broad warm-tan ruffle wide at the collar right under the jaw, stepped tiers standing proud, ending at the chest top (ref: .jpg, .red.png)
 2. figure in unit_renaissance.painter_idle: doublet flares to mid-thigh over short grey-khaki legs (~40% of height) — TABS: lanky, sweater ends at the hip, khaki-tan legs over half his height (ref: .red.png)
 3. beret in unit_renaissance.painter_idle: thin pale flat pancake — TABS: thick puffy beret in dark team colour, cocked over one side (ref: .jpg)
b PASS (372)
c FAIL (0 since 368)
 1. missing: Painter Dodge (sidestep off a projectile; card Abilities)
d PASS (cost 50, hp 0.75x, dmg 0.17x, cd 0.35x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a jabot (fallout of 0a0238a) — blocker 1: PAINTER_JABOT top tier ~1.4 heads under the jaw, stack ending at the chest top, tiers forward; NEXT shows in unit_renaissance.painter_idle as a wide tan ruffle at the collar
2. [S] a beret — blocker 3: thick puffy beret, dark team shade, cocked — ref: .jpg — ours: unit_renaissance.painter_idle.png
3. [S] a figure — blocker 2: doublet ends at the hip, longer khaki-tan legs — ref: .red.png — ours: unit_renaissance.painter_idle.png
4. [S] c Painter Dodge — blocker 1: projectile sidestep (log it), capture vs an archer
## Attempts (iter | gap | criterion | verdict)
328-335 | palette, splotches, hair, jabot folds, cravat [S] | a,b,c | approved
368 | stacked-tier jabot over the chin [S] (53e6e78, reverted) | a | rejected
369-370 | jabot under the jaw (9f0bd3c); puffed beret (BERET_PUFF, 8139915 +afefe3a) [S] | a | approved
372 | jabot as a front bib: 3 half-round flared panels, last to a point (PAINTER_JABOT replaced) [S] (0a0238a) | a | approved
## Rejected (last 4)
- jabot colour [P] [1] — 334: no visible change, plain cloth renders grey
- stacked-tier jabot [S] [1] — 368: tiers over the chin read as a beard
## Notes (max 3 lines)
- dressPainter: jabot renaissanceDress painterJabot (tiers below the head's lowest point); _holdPalette (PALETTE_OUT). Beret: propBuilder "beret".
- Cloth tans grey under the sky: raise glow or saturate. Idle camera swings to his face side (fac4c91).
