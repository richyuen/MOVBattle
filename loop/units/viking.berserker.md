# viking.berserker
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 391)
 1. beard in unit_viking.berserker_idle — TABS: a big dark beard and moustache with a braid tied at the end (ref: .red.png, .jpg); ours: no beard, only the thin brown cone from the eyes
 2. fur belt in _idle — TABS: a thick cream fur belt with a large navy round Landfall buckle (ref: .red.png, .jpg); ours: a thin plain belt with a small square buckle
 3. armpit hair in _idle/_windup — TABS: dark tufts under both arms on a bare chest (ref: card "both of their armpits are hairy", .red.png); ours: no tufts
 4. fur calf cuffs in _flight — TABS: big cream fur cuffs over brown boots (ref: .red.png); ours: slim blue legs and plain blue boots
b PASS (394)
 (struck 1 at 393: the axe heads; struck 2 at 394: the idle grip)
c PASS (392)
d PASS (cost 250, hp 1.55x, dmg 1.07x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 1: a dark beard and moustache with a braid tie - ref: .red.png - ours: unit_viking.berserker_idle.png
2. [S] a fur belt - blocker 2: a thick cream fur belt with a big navy round buckle - ref: .red.png - ours: unit_viking.berserker_idle.png
3. [S] a armpit hair - blocker 3: dark tufts under both arms - ref: .red.png - ours: unit_viking.berserker_idle.png
4. [S] a fur cuffs - blocker 4: cream fur calf cuffs over brown boots - ref: .red.png - ours: unit_viking.berserker_flight.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | Super Jump: a real leap arc (rise 8) logged "leap", live-air pose [S] (af3f259 + bd48ae1) | c | approved (c PASS)
393 | bearded crescents on both hafts at .78 size [S] (6cfe8b5 + 671a758) | b | approved (struck b.1)
394 | idle grip: both axes stood upright at his sides like the off-hand stone axe, gated on a pair, blades squared to front [S] (ab4c5e2 + 1add642) | b | approved (b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 394 b: _standsPairAxes (a handle with a beardedAxeCarry mark in BOTH fists) stands both through _standOffhandAxe/_standMainAxe with PAIR_AXE_FACE; the lone axe + board (Brawler) keeps BEARDED_AXE_CARRY.
- The stood pair starts at full weight (_pairAxeSpawned): the idle shot is 100 ms in, an ease from zero read as absent.
- 394 critic: the crescents sit a little small against his head (not a lineup-distance defect).
