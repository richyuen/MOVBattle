# tribal.mammoth
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 360; 1 [S] rejected)
 1. body in unit_tribal.mammoth_windup (also _ability): flat flank and back — TABS: rounded barrel, sagging belly, hump behind the head (ref: .red.png, .jpg). Shots crop the topline: re-aim first (evidence)
 5. hull skirt in unit_tribal.mammoth_ability (also _windup, _idle; added 374 by 79f4083): lower hull squared plumb, hung low with a straight hem, legs stubs ~1/3 of the body's depth yet ~.6 of the head's width — TABS: a round belly sagging between the legs, legs ~2/3 of the body's depth, slimmer than the head (ref: .red.png, .blue.png, .jpg)
b PASS (366)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a round belly, visible legs — blocker 5: keep the outward winding, drop skirtSquare/skirtDrop for a round belly sagging between the legs, raise it so ~2/3 of the leg shows, hide the leg roots with a faceted fur collar ring per leg top in hull brown (MAMMOTH_BARREL) — ref: .red.png, .jpg — ours: unit_tribal.mammoth_ability.png
2. [S] a body — blocker 1: evidence first (frame the topline in _windup/_ability), then round the flank — ref: .red.png — ours: unit_tribal.mammoth_windup.png
## Attempts (iter | gap | criterion | verdict)
323-366 | fur, mane, ankles, paint, Charge; pillar legs, charge pose, trample; barrel, trunk; tusk paint, hump, domed thighs [S] | a,b,c | approved
367 | ears (MAMMOTH_EAR) [S] approved; fur hem lobes (MAMMOTH_HEM) [S] (reverted) | a | rejected
372 | tapering legs, separate flared foot lathe (MAMMOTH_LEG) [S] (721d839) | a | approved
374 | hull lower half squared as one skirt over the leg tops; hull winding flipped outward (MAMMOTH_BARREL skirt*) [S] (79f4083 +6910ac7) | a | approved
## Rejected (last 4)
- fur hem over the leg roots [S] [1] — 367: separate jittered lobes — read as stacked balls/boulders heaped on the leg tops
## Notes (max 3 lines)
- 374: the 365 hull was wound inside-out (camera saw the far wall's inside; legs inside drew over it). Keep it outward. Thigh tops sit inside the hull (probe |z| 1.70 vs hull 2.0-2.14).
- Particles never show in capture. Body/trunk/tusk/ear paint mammoth only. Tans: "cloth" (matte), not bone/wood PBR.
- Critic 372: a further radius-only change to MAMMOTH_LEG is a ledger reversal.
