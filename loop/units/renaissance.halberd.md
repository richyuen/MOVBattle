# renaissance.halberd
Status: open   Audited: 368 (re; a re-audited 372)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 372)
 1. sallet rear in unit_renaissance.halberd_idle: a dark-navy faceted flap attached to the sallet juts right past the raised gauntlet down to the shoulder, wider than the head (grass and trees behind, no boulder) — TABS: a compact black bucket, nothing beyond the head's outline (ref: renaissance.halberd.red.png, .blue.png)
 2. helm front in unit_renaissance.halberd_idle: the upper gauntlet grips the shaft at helm height and hides the slit and bead eyes — TABS: upper gauntlet at the collar, lower arm across the belly, slit and eyes clear (ref: .blue.png)
 3. feet in unit_renaissance.halberd_idle: team-blue blocky boots — TABS: orange-brown shoes with turned cuffs under the team hose (ref: .blue.png)
b PASS (368)
c PASS (369)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a idle grip — blocker 2: upper gauntlet at the collar, lower forearm across the belly, helm front clear — ref: .blue.png — ours: unit_renaissance.halberd_idle.png
## Attempts (iter | gap | criterion | verdict)
327-336 | halberd head, sallet, grip, chop, dress, tabard [S] | a,b,c | approved
368 | sallet re-cut (SALLET_FACETED) [S] (c52c267) | a | approved
369 | dash back from a man inside the pole (HOP_BACK) [S] (e399131) | c | approved
370 | quilted sleeves: packed faceted puffs both arms, black flared gauntlet cuff (HALBERD_QUILT) [S] (9295c61) | a | approved
372 | bevor as a chin cup inside the shell (SALLET_FACETED) [S] (512e743, reverted) | a | dropped (no change in the shot)
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD is shared with good.radiant_glaive. _poseHalberd; _chopOnto (CHOP_ONTO); _holdChopDown (CHOP_DOWN). dressHalberd: tabard HALBERD_TAN, belt HALBERD_BELT_FIT, sleeves HALBERD_QUILT.
- Critic 370 minor: puffs read dusty pink-mauve and separated doughnuts (TABS warm rust, edge to edge). 369 minor: the dash is a stiff upright hop.
- Blocker 1 is the backdrop boulder behind his head: probe 372 (neck meshes) finds nothing past the head but the bevor, whose cut changed nothing in the shot, and grass blades cross the shape's foot. Re-aim the idle (evidence) or ask the critic to strike it.
