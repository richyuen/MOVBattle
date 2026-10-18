# farmer.scarecrow
Status: done   Audited: 339   Done: 347
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (346)
b PASS (341)
c PASS (347)
d PASS (cost 1200, hp 1.38x, dmg 5.56x, cd 9.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
339 | big black crow wings (CROW_WINGS) [S] (185ca19) | a | approved
340 | full-head sack mask (SACK) [S] (44d5b86) | a | approved
341 | black crow in each fist (HELD_CROW) [S] (6718e9a) | b | approved
342 | flying crow missiles (FLYING_CROW) [S] (d8ad061) | c | approved
344 | T-pose idle/walk, perched elbow crows (TPOSE) [S] (c3ffda9) | a | approved
345 | T held through the throw, A-pose reload [S] (29f6cf4) | c | approved
346 | scarecrow clothes (SCARECROW_DRESS) [S] (5cd3e3a) | a | approved
347 | Big Crow Wings hover, wing beat (HOVER, _hover) [S] (f0d8f77) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- T/A pose is _holdTPose; hover is _hover (hip lifted per frame, sim footing untouched). FLYING_CROW must not be re-nudged as [P].
- 347 critic: hover lift .13 small, legs keep walking while hovering (TABS dangle together) - polish only.
