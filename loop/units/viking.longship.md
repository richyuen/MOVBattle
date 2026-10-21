# viking.longship
Status: open   Audited: 391 (re), 395   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 391)
 1. hull/prow in _idle: the dragon head reads, but the hull is a pale flat raft of stacked beams, the deck at gunwale height, the stern a bent stick - TABS: a deep dark-brown clinker hull curving up into the stem and a rolled scroll stern (ref: .jpg, .red.png)
 4. composition/scale in _idle/lineup_viking: a ground-level box ~1.5x a man - TABS: held overhead by carriers, ~3x a man, three oarsmen aboard (ref: .jpg, card "six units")
 (struck 2 at 394: the rig; struck 3 at 395: the shields)
b FAIL (1 since 391)
 1. crew oars in _idle: three crew stand amidships and grip the oars, but the blades are spear-shaped diamonds and the men are slim mannequins with pinhead horns - TABS: flat rounded paddle blades, stocky horned oarsmen sunk into the hull (ref: .jpg)
c FAIL (0 since 391)
 1. throw + AoE + disembark in _release/_flight - TABS: carriers hurl the ship, the impact crushes in an AoE and the oarsmen disembark (ref: .jpg, card Characteristics); ours: only `melee hit at 2600 ms`, ability null
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b oar blades - blocker 1: a flat elongated paddle, wider than it is thick, about a quarter of the oar's length, in place of the four-sided diamond - ref: .jpg - ours: unit_viking.longship_idle.png
2. [S] a hull - blocker 1: curved clinker sides rising to the stems, the deck sunk below the gunwale - ref: .red.png - ours: unit_viking.longship_idle.png
3. [S] c throw - blocker 1: carriers lift and hurl the ship, AoE crush, oarsmen disembark - ref: .jpg - ours: unit_viking.longship_flight.png
4. [S] a composition - blocker 4: a ship ~3x a man held overhead by carriers - ref: .jpg - ours: lineup_viking.png
## Attempts (iter | gap | criterion | verdict)
392 | clinker hull [S] (b90ffb3) | a | approved (a.1 stands)
393 | rig [S] (fe36dfc + 9980e94, reverted) | a | rejected
394 | rig: mast/sail/yard out, three oars [S] (708a90c + a61028b) | a | approved (struck a.2)
395 | three Long-Boaters with the oars hung in their fists [S] (ffa5a93) | b | approved (narrowed b.1)
395 | team shields, dark half, rim, bronze boss [S] (512a007) | a | approved (struck a.3)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 395: the crew are bare slim mannequins (addOperator) with pinhead horns; the shields cover the side like wheels (four a side).
- OARS: blade .52 x .36, flat .17, hung off the fist; crew at z -.62/.02/.66, feet .64, oar butt .62 below the grip.
