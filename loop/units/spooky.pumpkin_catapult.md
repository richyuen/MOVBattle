# spooky.pumpkin_catapult
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 434)
  (struck 2 at 438)
 1. frame in unit_spooky.pumpkin_catapult_idle is the medieval reddish-brown timber A-frame — TABS: near-black timber frame (ref: spooky.pumpkin_catapult.red.png, card Appearance "predominantly black with bones")
 3. operator in unit_spooky.pumpkin_catapult_idle is a blue soldier — TABS: skeleton in tattered team clothing (ref: card Appearance)
b PASS (438: bone arm with lashed crossbones, bone crossbars, rib cradle)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 439 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a operator bone colour - blocker 3: stop the team re-tint after addOperator's callback (or dress him after it) so skeletonCrew's cream bone shows under the team rag - ref: card Appearance - ours: unit_spooky.pumpkin_catapult_idle (critic 439)
2. [S] a black frame - blocker 1: near-black timber material for the spooky A-frame and chassis - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_idle (critic 439)
## Attempts (iter | gap | criterion | verdict)
434-435 | PUMPKIN_SHOT, PUMPKIN_BURST (008ebd5c, a7717979) | c | approved (c PASS)
437 | RIB_CRADLE bone ribs on a spine round a carved jack-o'-lantern, no cup (3c42103f) | b | approved (struck 2)
438 | BONE_FRAME bone arm + lashed crossbones, bone crossbars (757d7237) | b | approved (struck 1; b PASS)
438 | CATAPULT_BANNER team swallow-tail pennants off the low bone's ends (9dbd09aa) | a | approved (struck 2)
439 | SKELETON_CREW operator stripped to bone, ribs, team rag tunic + head rag (6e88e2f5) | a | approved (no strike: the bones render team-coloured)
## Rejected (last 4)
## Notes (max 3 lines)
- 439 critic: the operator is a skeleton silhouette now, but every bone renders team (rag and bone one colour); suspect a team re-tint after addOperator's dress callback (wrapAsBody tints the body material).
- 438 critic: the black box counterweight reads as a big cube (TABS none); pennants a little wide and pale (minor).
- Cradle/bones/banners: vehicleBuilder buildCatapult spooky branch (RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER); operator spookyDress skeletonCrew (SKELETON_CREW).
