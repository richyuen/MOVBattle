# viking.longship
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391; 1 rejected [S] since 391)
 1. hull/prow in unit_viking.longship_idle — TABS: a deep dark-brown clinker hull with curved sides sweeping up into the carved dragon head and a rolled scroll stern (ref: .jpg, .red.png); ours: a dragon head with eye, teeth and horns now, but the hull reads as a pale flat raft of stacked beams, the deck at gunwale height and the stern a bent stick
 2. rig in _idle — TABS: no sail; the tall parts are the dragon prow, stern post and oars (ref: .jpg); ours: a flat opaque grey rectangular sail on a bare mast
 3. shields in _idle/_release — TABS: round team shields with a black band and bronze boss along both sides (ref: .jpg); ours: flat olive-grey discs, no boss or team colour
 4. composition/scale in _idle/lineup_viking — TABS: a ship held overhead by carriers, ~3x a man, three oarsmen aboard (ref: .jpg, card "six units"); ours: a ground-level box ~1.5x a man, no carriers, no crew
b FAIL (0 since 391)
 1. crew oars in _idle — TABS: three Long-Boaters in the hull gripping long black flat-bladed oars (ref: .jpg, card Appearance); ours: an empty deck and three thin dark rods, one reading as a spear, no blades or hands
c FAIL (0 since 391)
 1. throw + AoE + disembark in _release/_flight — TABS: carriers hurl the ship, the impact crushes in an AoE and the oarsmen disembark with oars (ref: .jpg, card Characteristics); ours: only `melee hit at 2600 ms`, ability null; the pair shows the ship standing on the grass
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a rig - blocker 2: no mast or yard at all; the deck's verticals are three upright black flat-bladed oars plus the dragon prow and stern post - ref: .jpg - ours: unit_viking.longship_idle.png
2. [S] a hull sheer - blocker 1: a curved brown hull rising toward both stems, deck below the rail, stern a rolled scroll - ref: .jpg - ours: unit_viking.longship_idle.png
3. [S] a shields - blocker 3: round team shields with a black band and bronze boss - ref: .jpg - ours: unit_viking.longship_release.png
4. [S] b crew oars - blocker 1: three oarsmen gripping flat-bladed oars - ref: .jpg - ours: idle
5. [S] c throw - blocker 1: carriers lift and hurl the ship, AoE crush, oarsmen disembark - ref: .jpg - ours: flight
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | clinker hull: keel, lapstrakes, stems, dragon head, curled stern, team rails (b90ffb3) | a | approved (a.1 stands)
393 | rig: sail out, short bare mast, yard and sheets (fe36dfc + 9980e94, reverted 62d09d2/c7c8c0a) | a | rejected
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets in place of the sail - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 393: the reference has no mast or yard; its verticals are the crew's oars. The next rig attempt removes the mast and stands three flat-bladed oars.
