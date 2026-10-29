# viking.valkyrie
Status: open   Audited: 391, 400, 401, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 391; struck 2 at 401, 3 at 402; 4 split at 403)
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt
  (struck 1 at 394: the wings; struck 2 at 401: cream feather fans, bronze eye-line band, tall crest; struck 3 at 402: the pale fur collar and two cream plaits; struck at 403 by the split rule: gold arm bands, dark bracers and brown boots)
b PASS (391)
c PASS (393)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a belt - blocker 4: re-seat the belt band and ring off body.torsoMesh's position and scaled extents (as limbShell reads its limb), so the band wraps her waist above the skirt flare and the ring sits on its front - ref: viking.valkyrie.red.png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict)
391-394 | off-hand sword (b PASS); flight FLY (392 rejected, 393 approved, c PASS); layered feather wings (struck a.1) [S] | a,b,c | approved
400 | her own helm: dark team dome, bronze brow band, crest spike, mounts (715aff5) | a | approved (blocker 2 stands)
401 | cream feathers, eye-line band, tall flat crest (c0c74ea + cbecbca) | a | approved (struck 2)
402 | VALKYRIE_COLLAR: cream fur ring + 9 clumps, the Headbutter's plaits in cream to the belt (498f78d) | a | approved (struck 3)
403 | VALKYRIE_ARMOUR: brown belt + rims, gold ring, gold arm bands, dark bracers, brown boots (0ec42c6) | a | approved (bands, bracers, boots struck; belt + ring stand)
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state
## Notes (max 3 lines)
- 403 critic: the belt is seated at chest.y * beltAt in the torso node's frame, ignoring torsoMesh's own offset/scale - it sits low inside the skirt (a brown box off her left hip) and the ring floats below the hem.
- 402: VALKYRIE_COLLAR ring .62 of the shoulder width, 9 lumps; braids via headbutterBraids (unlit cream). 401: VALKYRIE_HELM feathers 5 x 2.1 H.
- 394: unitVisuals wingStyle "layered"; `fly: true` keeps her valkyrieFly marker so FLY still finds her.
