# pirate.pirate_queen
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 422)
 1. the head in unit_pirate.pirate_queen_idle - a flat black angular hat - TABS: a team bandana with a white eyepatch over one eye (ref: pirate.pirate_queen.red.png; card "cloth covering one of their eyes")
 2. the sides of the head in unit_pirate.pirate_queen_idle - bare - TABS: long black curly locks with beads hanging to the shoulders (ref: pirate.pirate_queen.red.png; card "curly long hair with hair beads")
 3. the chest in unit_pirate.pirate_queen_idle - a plain dark tunic - TABS: a brown sash slung from the shoulder across the chest carrying four black bombs (ref: pirate.pirate_queen.red.png; card "brown bomb sash")
 4. the hips in unit_pirate.pirate_queen_idle - bare team legs from the tunic hem - TABS: a team wrap skirt with green beads at its hem over pink pants (ref: pirate.pirate_queen.red.png; card "red skirt with green beads")
b FAIL (1 since 422)
 1. the off hand in unit_pirate.pirate_queen_idle - a long dark rod held low - TABS: a jewelled sabre, a slim curved blade on a tan hilt (ref: pirate.pirate_queen.red.png; card Main Hand Piratequeen's Sabre / Appearance "jewel-embedded custom Sabre")
 2. the main-hand blade in unit_pirate.pirate_queen_idle - a straight broad double-edged sword with a cross guard - TABS: an unusually big curved cutlass with a tan guard (ref: pirate.pirate_queen.red.png; card "unusually big Cutlass")
c FAIL (0 since 422) [RE-AUDIT at 426: five squires since 425]
 1. the blow in unit_pirate.pirate_queen_release - the rod shoved two-handed across the chest (summary "slam") - TABS: a cutlass or sabre slash (card Weapons; ref: reference/units/pirate.pirate_queen.png, the cutlass swung low through the men)
 2. missing: Bomb Spin - summary.notes records no ability - TABS: when outnumbered she spins, scattering seven bombs, then rises (card Abilities Bomb Spin; the 1v1 capture can never trigger it, so the scenario must outnumber her by an evidence commit before this blocker can be struck)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 425 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b cutlass mount - blocker 1: blades out ahead of the fists, a bigger main cutlass (propBuilder cutlass mount) - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_windup (425 rank 11)
2. [S] c Bomb Spin - blocker 2: outnumbered, she spins and scatters seven bombs, logged - ref: card Abilities - ours: unit_pirate.pirate_queen_release (425 rank 12)
3. [S] c blade slash - blocker 1: the cutlass arcs through the target, not the rod slam - ref: pirate.pirate_queen.png - ours: unit_pirate.pirate_queen_release
## Attempts (iter | gap | criterion | verdict)
425 | CUTLASS curved blade, tan cup hilt, both fists (e5226412) | b | approved (none struck)
## Rejected (last 4)
## Notes (max 3 lines)
- 425 evidence: she spars with five squires. Her blow is iconic_pirate_queen's "slam", which bypasses CUTLASS_SLASH (blade_slash only).
- 425 defect: blades run up behind the forearm.
