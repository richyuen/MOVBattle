# farmer.farmer
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 3. shirt in unit_farmer.farmer_idle lacks leaf-cut collar/hem and strap belt (ref: farmer.farmer.blue.png)
b FAIL (1 since 339)
 1. pitchfork in unit_farmer.farmer_idle/_windup in one fist at the butt, off hand off the shaft — TABS: both fists on the shaft at rest, held low across the front (ref: farmer.farmer.red.png)
c FAIL (1 since 339)
 2. missing: back-up then lunging stab — the lunge stab exists (347), the slow back-step between blows does not (ref: card Characteristics)
d PASS (cost 80, hp 0.74x, dmg 0.67x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a shirt — blocker 3: leaf-cut collar and hem dags on the shirt, brown strap belt at the waist — ref: farmer.farmer.blue.png — ours: unit_farmer.farmer_idle.png
2. [S] c back-step — blocker 2: slow back-step away from the target during the cooldown, then the lunge stab (simulationSystem farmer melee) — ref: card Characteristics — ours: unit_farmer.farmer_release.png
3. [S] b two-fist carry — blocker 1: reuse _turnFork / the off-fist pole solve to seat the fork low across the front at rest, off fist on the shaft — ref: farmer.farmer.red.png — ours: unit_farmer.farmer_idle.png
## Attempts (iter | gap | criterion | verdict)
339 | two-handed pitchfork carried low, curled grey tines (FORK) [S] (151102b) | b | approved
340 | liripipe hood, leaf-cut collar (LIRIPIPE) [S] (4ccaced) | a | approved
341 | white cuffed socks, brown slip-on shoes (FARMER_SOCK) [S] (3c6b4c5) | a | approved
342 | fork carried across the hips in both fists (FORK_CARRY) [S] (8c2de8f +2) | b | rejected
346 | forkShaft low carry (FORK_LOW) [S] (e75d76c) | b | dropped
347 | pitchfork stab on its own clock, hit held to the drive (FORK_STAB) [S] (31530f7 +2) | c | approved
## Rejected (last 4)
- fork carried across the hips [S] [1] — 342: FORK_CARRY attitude — off fist floats above the shaft, fork points forward like a couched lance, windup one-handed with tines in the dirt
## Notes (max 3 lines)
- b is at 2 attempts (342 rejected, 346 dropped): pick it only via the 347 _turnFork route (fork mesh "shaft" is not a carry node; turn it in the fist).
- Sim lands the fork hit at FORK_STAB.land via blowLandsIn; 347 critic: tines clip through the man, fork stands up in _struck (minor).
