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
c FAIL (0 since 391)
 1. Super Jump in _ability/_ability_after — TABS: leaps a long distance towards the enemy, legs kicked, axes wide (ref: .jpg, card Super Jump); ours: the pair is shot on the spawn-time spin at 17 ms on empty ground; the leap at tick 75 appears in no shot and `ability` logs "spin"
d PASS (cost 250, hp 1.55x, dmg 1.07x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Super Jump — blocker 1: the ability log takes the spawn-time "spin" (tick 1), so the pair is shot on empty ground; log the leap at tick 75 as the ability and shoot _ability/_ability_after on the apex — ref: .jpg — ours: unit_viking.berserker_ability.png
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
- Both abilities (spin_move, jump_charge) fire; the capture picks the first logged event, the spin at tick 1.
- Axe props are the generic black heads, shared with the brawler's axe.
