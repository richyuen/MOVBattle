# viking.berserker
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 391)
 1. beard in unit_viking.berserker_idle — TABS: a big dark beard and moustache with a braid tied at the end (ref: .red.png, .jpg); ours: no beard, only the thin brown cone from the eyes
 2. fur belt in _idle — TABS: a thick cream fur belt with a large navy round Landfall buckle (ref: .red.png, .jpg); ours: a thin plain belt with a small square buckle
 3. armpit hair in _idle/_windup — TABS: dark tufts under both arms on a bare chest (ref: card "both of their armpits are hairy", .red.png); ours: no tufts
 4. fur calf cuffs in _flight — TABS: big cream fur cuffs over brown boots (ref: .red.png); ours: slim blue legs and plain blue boots
b FAIL (0 since 391)
 1. axe heads in _release/_struck — TABS: two broad steel-grey crescent axe blades on long hafts, heads above the shoulders (ref: .jpg, .red.png, card Berserker Axe x2); ours: two black rectangular hammer heads on hafts
 2. idle grip in _idle — TABS: both axes held upright at the sides, heads clear of the hands (ref: .red.png); ours: both hafts horizontal at the hips, the heads at/off the frame edges
c PASS (392)
d PASS (cost 250, hp 1.55x, dmg 1.07x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b axe heads - blocker 1: BEARDED_AXE heads on both hafts, wider grey crescents above the fists - ref: .red.png - ours: unit_viking.berserker_release.png
2. [S] b idle grip - blocker 2: both axes stood upright at the sides, heads clear of the hands - ref: .red.png - ours: unit_viking.berserker_idle.png
3. [S] a beard - blocker 1: a big dark beard and moustache with a tied braid - ref: .red.png - ours: unit_viking.berserker_idle.png
4. [S] a fur belt - blocker 2: a thick cream fur belt, big navy round Landfall buckle - ref: .jpg - ours: unit_viking.berserker_idle.png
5. [S] a armpit hair - blocker 3: dark tufts under both arms - ref: card - ours: unit_viking.berserker_idle.png
6. [S] a fur cuffs - blocker 4: cream fur calf cuffs over brown boots - ref: .red.png - ours: unit_viking.berserker_flight.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | Super Jump: a real leap arc (rise 8) logged "leap", live-air pose [S] (af3f259 +bd48ae1) | c | approved (c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 392 c: `ability leap at 1250 ms`; _ability is the take-off and _ability_after catches him airborne (shadow separate).
- bd48ae1 gates the leap pose on jump_charge (the runtime marks its own leaps), so hop-backs and the halfling jump keep their poses.
