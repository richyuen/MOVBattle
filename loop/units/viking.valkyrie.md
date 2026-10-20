# viking.valkyrie
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 391)
 1. wings in unit_viking.valkyrie_idle - TABS: broad pale-blue feathered wings with a dark bone leading edge, each wider than the body (ref: .png, .red.png); ours: two fans of flat pale-blue shards threaded on one dark rod, no feathers
 2. helmet in _idle - TABS: layered cream feather wings on a bronze frame, a tall magenta crest and a metal brow band (ref: .red.png, .png); ours: flat pale fins on a grey-blue dome, no crest or brow band
 3. collar/braids in _idle - TABS: a pale fur collar and two thick pale braids over the chest (ref: .png, .red.png); ours: a bare blue chest
 4. armour in _idle - TABS: a team tunic with a wide brown belt and gold ring, gold arm bands, dark bracers and brown boots (ref: .red.png, .png); ours: a plain blue tunic and skirt, no belt, trim or boots
b PASS (391)
c FAIL (0 since 391)
 1. flight in _idle (no ability pair; summary ability null) - TABS: hovers above the ground with feet tucked and a shadow below, then swoops (ref: .png, card Characteristics); ours: both boots planted in every shot, no flight/leap event
d PASS (cost 500, hp 1.86x, dmg 1.67x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c flight - blocker 1: a hover state that lifts the root about .8 m with knees tucked and a ground shadow, and a swoop dive onto the target before each strike, logged as a leap/flight event in abilityLog - ref: .png - ours: unit_viking.valkyrie_idle.png
2. [S] a wings - blocker 1: rebuild each wing as layered long pale-blue feather slabs (primaries fanned, shorter coverts) hung from a thick dark bone leading edge, each wing wider than the body, in vikingDress.ts - ref: .red.png - ours: unit_viking.valkyrie_idle.png
## Attempts (iter | gap | criterion | verdict)
391 | off hand a second Valkyrie sword, shield off (unitVisuals offhandWeapon) [S] (54ae174) | b | approved (struck b.1, b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 391 b: the second blade is in the left hand (idle hides it behind the body/near wing; the windup shows both); the round shield is gone.
- Next: c flight (hover/swoop) and a wings; the a.2 helmet, a.3 braids, a.4 armour follow.
- Visual map: sword / plume_helmet / none / wings; `flying_hover` is listed but no flight event is logged and the feet stay planted.
