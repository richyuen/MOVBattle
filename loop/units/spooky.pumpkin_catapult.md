# spooky.pumpkin_catapult
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 434)
  (struck 2 at 438, 3 at 440)
 1. frame in unit_spooky.pumpkin_catapult_idle is the medieval reddish-brown timber A-frame — TABS: near-black timber frame (ref: spooky.pumpkin_catapult.red.png, card Appearance "predominantly black with bones")
b PASS (438: bone arm with lashed crossbones, bone crossbars, rib cradle)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 440 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a black frame - blocker 1: vehicleBuilder buildCatapult spooky branch, a near-black timber material (own material, not the body source) for the A-frame, chassis and beams; wheels may keep theirs - ref: spooky.pumpkin_catapult.red.png - ours: unit_spooky.pumpkin_catapult_idle (critic 440)
## Attempts (iter | gap | criterion | verdict)
434-435 | PUMPKIN_SHOT, PUMPKIN_BURST (008ebd5c, a7717979) | c | approved (c PASS)
437-438 | RIB_CRADLE, BONE_FRAME (3c42103f, 757d7237) | b | approved (b PASS)
438 | CATAPULT_BANNER team swallow-tail pennants off the low bone's ends (9dbd09aa) | a | approved (struck 2)
439 | SKELETON_CREW operator stripped to bone, ribs, team rag tunic + head rag (6e88e2f5) | a | approved (no strike: the bones rendered team)
440 | operator skull anchor: wrapAsBody's skin clone kept off his bones (bc704fe0) | a | approved (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 440 critic: a big dark counterweight cube rides on the arm (TABS none), not a blocker. 438: pennants a little wide and pale (minor).
- Cradle/bones/banners: vehicleBuilder buildCatapult spooky branch (RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER); operator spookyDress skeletonCrew; skull anchor passed to wrapAsBody.
- wrapAsBody's body source must stay the team axle: a black frame needs its own timber material (LESSONS 14).
