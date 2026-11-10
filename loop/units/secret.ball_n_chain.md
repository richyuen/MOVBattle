# secret.ball_n_chain
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 500, 3 struck)
 3. shirt in unit_secret.ball_n_chain_idle — a plain team torso; TABS a white shirt with team horizontal stripes on the sleeves (ref: secret.ball_n_chain.red.png)
 4. trousers in unit_secret.ball_n_chain_idle — plain team legs; TABS wide team/white horizontal stripes down the legs (ref: secret.ball_n_chain.red.png)
b PASS (502 stone hugged at the chest in both arms)
c FAIL (1 since 500, 1 struck)
 2. blow in unit_secret.ball_n_chain_release — an overhead stick swing; TABS dives with the stone ball and pounds repeatedly (ref: card Characteristics)
d PASS (509 stats)
## Ranked gaps
1. [S] secret.ball_n_chain.a prisoner shirt — blocker 3: build a white shirt with alternating team bands around the sleeves — ref: reference/units/secret.ball_n_chain.blue.png — ours: unit_secret.ball_n_chain_idle.png
2. [S] secret.ball_n_chain.a striped trousers — blocker 4: add broad alternating white/team trouser sections down both legs — ref: reference/units/secret.ball_n_chain.blue.png — ours: unit_secret.ball_n_chain_idle.png
3. [S] secret.ball_n_chain.c stone pounding — blocker 2: stone-led diving contact followed by repeated contact-timed pounds, keeping torso and stone attached — ref: card Characteristics — ours: unit_secret.ball_n_chain_release.png / _flight.png
## Attempts (iter | gap | criterion | verdict)
509 | stone dive and pounds (724ec250, 4eb56a9b, 13352468; reverted fc1d5642,d5c6f5c4,a01ad5e1) | c | dropped: contact beyond arm reach; forward torso detached from hips
505 | low team cap with cream hem in place of hood (f8f54345) | a | approved (struck 1, 2, 5)
504 | back-step windup and forward leap holding the stone (f91998de) | c | approved (struck 1)
502 | both fists solved onto the stone's flanks, PA _hugStone STONE_HUG (804fac9d) | b | approved (struck 1; b PASS)
501 | torso-hung faceted grey stone 1.3 TW at the chest, 6-link chain, flail hidden, secretDress ballStone (561dcf46) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 509 dropped: fixed-length arms could not reach the stone at a toppled target's chest. Torso translation reached it but detached from hips; next approach must move the whole body.
- 502 DEFECTS: in lineup_secret the far fist hangs just off the stone's flank, elbow out. STONE_HUG front > .3 locks an arm straight (out of reach).
