# renaissance.halberd
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 368)
 2. a team-blue flat shape and a pale-blue rod behind the helm's right side in unit_renaissance.halberd_idle — TABS: nothing there (ref: .red.png)
b PASS (368)
c PASS (369)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a stray helm plate — blocker 2: find and remove the team flat shape and pale rod behind the helm's right side (colour-probe first; scratch shot.mjs close-ups from several angles) — ref: renaissance.halberd.red.png — ours: unit_renaissance.halberd_idle.png
## Attempts (iter | gap | criterion | verdict)
327-336 | halberd head, sallet, grip, chop, dress, tabard [S] | a,b,c | approved
368 | sallet re-cut (SALLET_FACETED) [S] (c52c267) | a | approved
369 | dash back from a man inside the pole (HOP_BACK) [S] (e399131) | c | approved
370 | quilted sleeves: packed faceted puffs both arms, black flared gauntlet cuff (HALBERD_QUILT) [S] (9295c61) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD is shared with good.radiant_glaive. _poseHalberd; _chopOnto (CHOP_ONTO); _holdChopDown (CHOP_DOWN). dressHalberd: tabard HALBERD_TAN, belt HALBERD_BELT_FIT, sleeves HALBERD_QUILT.
- Critic 370 minor: puffs read dusty pink-mauve and separated doughnuts (TABS warm rust, edge to edge). 369 minor: the dash is a stiff upright hop.
- HOP_BACK in simulationSystem now holds the halberd's row only (fencer moved to FENCER_RECOVER, 370).
