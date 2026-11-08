# good.sacred_elephant
Status: open   Audited: 481 (AUDIT x2), 491 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 491)
 1. tusks in unit_good.sacred_elephant_idle — long, slim, cream mammoth tusks that sweep forward and up past the trunk tip to about half a body length in front of the head — TABS: short, thick, conical grey-ivory tusks that curl up close to the head and end about level with the cheeks, each with a gold ring (ref: reference/units/good.sacred_elephant.jpg, good.sacred_elephant.red.png; card Appearance "mixture of an African Elephant and an Asian Elephant").
 2. rider's tank-top in unit_good.sacred_elephant_idle — a plain white torso block washed into a white glow blob, with no bands — TABS: a white short top crossed by horizontal team-coloured bands with gold linings (ref: reference/units/good.sacred_elephant.red.png, .blue.png; card Appearance "white short tank-top, with gold linings").
 3. feet in unit_good.sacred_elephant_idle — each leg ends in a stepped, octagonal, flared grey collar like a column base — TABS: smooth tapering legs ending in plain rounded pads (ref: reference/units/good.sacred_elephant.jpg, good.sacred_elephant.blue.png).
b PASS (482 gap review; CONFIRM 491)
c PASS (485 rider spear throws with pull; CONFIRM 491)
d PASS (491 stats)
## Ranked gaps
1. [S] good.sacred_elephant.a short curled tusks — blocker 1: thick conical tusks curling up beside the trunk root, ending by the cheeks, gold ring kept — ref: good.sacred_elephant.jpg — ours: unit_good.sacred_elephant_idle.png
2. [S] good.sacred_elephant.a banded rider top — blocker 2: white top with team bands and gold linings, out of the glow — ref: good.sacred_elephant.red.png — ours: unit_good.sacred_elephant_idle.png
3. [S] good.sacred_elephant.a rounded foot pads — blocker 3: replace the stepped flared rim with a plain rounded pad — ref: good.sacred_elephant.blue.png — ours: unit_good.sacred_elephant_idle.png
## Attempts (iter | gap | criterion | verdict)
491 | [P] rig at .84 (ELEPHANT_GIANT), seat 4.1 -> 3.4 m (20f7342f) | a | approved (struck 5; CONFIRM failed a)
490 | draped flank blanket (38f71664); pale flared foot pads (52fdcb61) | a | approved (struck 6, 3)
489 | small folded hide ears (504716a7, b6f1d5ba) | a | approved (struck 2)
486 | rider white dress (c2caca9d) | a | approved (struck 4)
485 | rider spear throws (c9266f24) | c | approved (struck 1; c PASS)
482-485 | paired rider spears, continuous trunk | a,b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Tusks are the mammoth's (vehicleBuilder buildMammoth MAMMOTH_TUSK); feet ELEPHANT_FOOT; rider ELEPHANT_RIDER_DRESS (goodDress).
- Rig scale: buildMammoth giant = ELEPHANT_GIANT (vis scale does not reach it).
