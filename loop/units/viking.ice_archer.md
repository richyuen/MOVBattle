# viking.ice_archer
Status: open   Audited: 391, 395-402, 403 (re-audit a), 405 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 405; the CONFIRM's list)
 1. white fur ruff ring with icicle teeth hanging down the chest in unit_viking.ice_archer_idle and lineup_viking - TABS: no collar; small grey snow lumps on each shoulder top over the team coat (ref: .red.png, .blue.png)
 2. dull brown-mauve vest over the torso in lineup_viking (red team) - TABS: the whole coat team red down to mid-thigh, belted (ref: .red.png)
 3. small black tube quiver on the back in lineup_viking - TABS: a large brown leather quiver slab hanging at the right hip (ref: .red.png, .blue.png)
 4. white fur bands at the knees in unit_viking.ice_archer_idle - TABS: khaki baggy leg wraps from knee to mid-shin over brown boots (ref: .red.png, viking.jpg)
b FAIL (0 since 405; the CONFIRM's list)
 1. bow shape in unit_viking.ice_archer_idle: a straight spine lined with rows of big sideways spike blades, reads as a spiked spear - TABS: a slender, smoothly curved crystalline bow with a string, about her height (ref: .red.png, viking.jpg)
 2. bow carriage in unit_viking.ice_archer_idle: held low, tip angled down and forward to the ground like a lance - TABS: upright and diagonal in the left hand across the body, upper tip above the hat (ref: .red.png, viking.jpg)
 3. no bow visible and no draw in unit_viking.ice_archer_windup (running, forward hand empty) - TABS: bow vertical at arm's length, the ice arrow drawn to the chest (ref: .jpg)
c PASS (401; CONFIRM 405)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the CONFIRM gave none: each criterion's first blocker)
1. [S] b bow shape - blocker 1: a slender curved ice bow with a string, the spikes cut down to a light crust (ICE_BOW) - ref: .red.png - ours: unit_viking.ice_archer_idle.png
2. [S] a snow lumps - blocker 1: the mantle ring and icicle teeth off; small grey snow lumps on each shoulder top (ICE_ARCHER_MANTLE) - ref: .red.png - ours: unit_viking.ice_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
395-401 | ice crust; round cap (struck a.1); iceArrow dressing + crown; frost ribbon (399 rejected); icicles; nine-icicle comb (c PASS) [S] | a,c | approved
402-404 | ICE_ARCHER_MANTLE (911eda0); cap on the eye line (7029273); brawlerLegs (db12da9) | a | approved
405 | ICE_ARCHER_BAND: dark leather brim with 8 rivet studs (99ac4de) | a | approved (struck 4, a PASS); CONFIRM failed a, b
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 405 CONFIRM: a.2 is colour-only - judge it on a --noglow swatch; a.4 contradicts the 404 brawlerLegs cuffs the gap critic approved (TABS: khaki wraps).
- 403 evidence (88e3f00): her idle camera sits on the eye meshes; a head-hung cap is seated off their tops (eyeTopInHead).
- 402: ICE_ARCHER_MANTLE ring .8 of the shoulder width, 10 points; unlit (.74,.76,.8). 396: ICE_ARCHER_CAP (dome 1.26 W, brim .26 H).
