# viking.ice_archer
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 391)
 1. cap in unit_viking.ice_archer_idle — TABS: a round team cap with a pale fur brim and a fur/snow pom (ref: .red.png, .jpg); ours: a smooth blue cone with a bare point
 2. shoulder mantle in _idle — TABS: a pale jagged fur/snow mantle over both shoulders (ref: .jpg); ours: a flat smooth blue disc ring at the neck
 3. fur calf cuffs in _flight — TABS: big cream fur cuffs over dark boots (ref: .red.png, .jpg); ours: slim blue boots, no fur
 4. front view in lineup_viking (also _idle) — TABS: the face, long nose and bead eyes read (ref: .red.png); ours: the archer shows its back and quiver, no face or cap front
b FAIL (0 since 391)
 1. Ice Bow in _idle/_flight — TABS: a body-height pale-blue bow with jagged icicle tips and a white snowball at the upper nock (ref: .jpg, card Main Hand Ice Bow); ours: a small dark-wood C-bow with a plain white string at waist height
c FAIL (0 since 391)
 1. ice arrow in _release — TABS: a long pale-blue arrow with a jagged ice head and frost trail (ref: .jpg); ours: a dark-brown shaft with a small blue cone head
 2. freeze in _struck/_ability — TABS: the hit unit frosts blue / ice-crusts and slows (ref: card Characteristics); ours: the target only recoils; `status:freeze` at 383 ms shows no frost and the pair is framed on the archer
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b Ice Bow — blocker 1: a body-height pale-ice limb with jagged icicle tips and a white snowball nock — ref: .jpg — ours: unit_viking.ice_archer_flight.png
2. [S] c ice arrow + freeze — blockers 1/2: a pale-blue ice arrow with a jagged ice head, and a frost-blue tint/ice crust held on the hit target — ref: .jpg — ours: unit_viking.ice_archer_release.png
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
- Idle shows the back/quiver: an evidence candidate if a cap/face gap is picked.
- Freeze is logged (status:freeze) but no visual status mesh is keyed for it.
