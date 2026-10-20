# viking.ice_archer
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 391)
 1. cap in unit_viking.ice_archer_idle — TABS: a round team cap with a pale fur brim and a fur/snow pom (ref: .red.png, .jpg); ours: a smooth blue cone with a bare point
 2. shoulder mantle in _idle — TABS: a pale jagged fur/snow mantle over both shoulders (ref: .jpg); ours: a flat smooth blue disc ring at the neck
 3. fur calf cuffs in _flight — TABS: big cream fur cuffs over dark boots (ref: .red.png, .jpg); ours: slim blue boots, no fur
 4. front view in lineup_viking (also _idle) — TABS: the face, long nose and bead eyes read (ref: .red.png); ours: the archer shows its back and quiver, no face or cap front
b PASS (393)
c FAIL (0 since 391)
 1. ice arrow in _release — TABS: a long pale-blue arrow with a jagged ice head and frost trail (ref: .jpg); ours: a dark-brown shaft with a small blue cone head
 2. freeze in _struck/_ability — TABS: the hit unit frosts blue / ice-crusts and slows (ref: card Characteristics); ours: the target only recoils; `status:freeze` at 383 ms shows no frost and the pair is framed on the archer
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c freeze - blocker 2: a frost tint or ice crust on the hit target at `status:freeze` - ref: card Characteristics - ours: unit_viking.ice_archer_struck.png
2. [S] a cap - blocker 1: a round team cap with a pale fur brim and a snow pom - ref: .jpg - ours: unit_viking.ice_archer_idle.png
3. [S] a mantle - blocker 2: a pale jagged fur/snow mantle over both shoulders - ref: .jpg - ours: unit_viking.ice_archer_idle.png
4. [S] a cuffs - blocker 3: cream fur calf cuffs over dark boots - ref: .jpg - ours: unit_viking.ice_archer_flight.png
5. [S] a front view - blocker 4 first an evidence commit: the idle and lineup are a back view (quiver), so the cap and face cannot be judged - ours: unit_viking.ice_archer_idle.png
6. [S] c ice arrow - blocker 1: a long pale-blue arrow with a jagged ice head and frost trail - ref: .jpg - ours: unit_viking.ice_archer_release.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | Ice Bow: body-height pale-ice limbs, jagged tips, snowball nock [S] (dd3caf1) | b | approved (b.1 stood)
393 | icicle fringe down both limbs, bigger tip crowns (ICE_BOW) [S] (1e0549d) | b | approved (b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 393 critic: the shards stick out sideways from both faces like thorns; TABS thin icicles hang off the limb's belly (not a lineup-distance blocker).
- Idle shows the back/quiver: an evidence commit comes before any cap/face gap.
- Freeze is logged (status:freeze) but no visual status mesh is keyed for it.
