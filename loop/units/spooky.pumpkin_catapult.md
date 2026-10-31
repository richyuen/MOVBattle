# spooky.pumpkin_catapult
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434)
  (struck 2 at 438)
 1. frame in unit_spooky.pumpkin_catapult_idle is the medieval reddish-brown timber A-frame — TABS: near-black timber frame (ref: spooky.pumpkin_catapult.red.png, card Appearance "predominantly black with bones")
 3. operator in unit_spooky.pumpkin_catapult_idle is a blue soldier — TABS: skeleton in tattered team clothing (ref: card Appearance)
b PASS (438: bone arm with lashed crossbones, bone crossbars, rib cradle)
c PASS (435: jack-o'-lantern payload bursts into rind and bouncing lanterns)
d PASS (cost 1000, hp 3.77x, dmg 0.85x, cd 5.01x; 438 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skeleton operator - blocker 3: dress the crew with dressSkeleton (bone limbs, skull, tattered team rags) - ref: card Appearance - ours: unit_spooky.pumpkin_catapult_idle (critic 438)
2. [P] a near-black frame - blocker 1: spooky frame timber to near-black (~.12,.1,.1), fallout of 757d7237/9dbd09aa - shows in unit_spooky.pumpkin_catapult_idle uprights and base (critic 438)
## Attempts (iter | gap | criterion | verdict)
434 | PUMPKIN_SHOT jack-o-lantern projectile (008ebd5c) | c | approved (struck 1)
435 | PUMPKIN_BURST rind + bouncing lanterns, no fireball (a7717979) | c | approved (struck 2; c PASS)
437 | RIB_CRADLE bone ribs on a spine round a carved jack-o'-lantern, no cup (3c42103f) | b | approved (struck 2)
438 | BONE_FRAME bone arm + lashed crossbones, bone top bar, big low crossbone (757d7237) | b | approved (struck 1; b PASS)
438 | CATAPULT_BANNER team swallow-tail pennants on cords off the low bone's ends (9dbd09aa) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 438 critic: the black box counterweight reads as a big cube (TABS none); pennants a little wide and pale (minor).
- Cradle/bones/banners: vehicleBuilder buildCatapult spooky branch (RIB_CRADLE, BONE_FRAME, CATAPULT_BANNER); "pumpkinPayload" hides at the throw. Operator: addOperator + dressCannonCrew there.
