# Loop ledger (v2): every value the loop has tuned

Rows: `file:identifier | current value | last iter | verdict | earlier values (newest first)`. The identifier carries the unit
(`rosterManifest.ts:tribal.clubber damageMultiplier`, `unitVisuals.ts:tribal.clubber proportions.scale`, `propBuilder.ts:club CLUB_LEN`).
Verdicts: approved, rejected, pending, spent. A row is `spent` after two attempts without approval or when it was listed as
never-retry; it is not pickable as [P]. The critic rejects a [P] gap that reverses or re-nudges a row approved within the last 20
iterations ("ledger reversal"). An [S] gap that replaces the mechanism owning a row may set new values: the worker resets the row to
pending and keeps the old value under earlier values. Stats knobs set by a `loop(N.0): [P] <batch> stats` commit are rows too
(verdict `stats`, never reviewed by the critic, never a ledger reversal). One row per tuning knob a mechanism exposes, not per line;
a value column is at most 80 characters. The worker updates rows at commit time (pending) and after verdicts. Drop rows untouched
for 25 iterations.

## Structural attempts (last 10 iterations; `iter | gap | unit.criterion | verdict`)
316 | club mesh (3af648b) | tribal.clubber.b | approved
316 | stone axe heads (41a51fe) | tribal.chieftain.b | approved
316 | plank shield with face hole (77c8352) | tribal.protector.b | approved
316 | deer-skull staff (9474ce7) | tribal.bone_mage.b | approved
316 | flat javelin (a76560b) | tribal.spear_thrower.c | approved

## Spent (never retry as [P])
(none yet)

## Rows
propBuilder.ts:club CLUB_LONG (of the man's height) | 0.6 | 316 | approved | (new; the old club was 0.65 prop units)
propBuilder.ts:club CLUB_GRIP (share below the fist) | 0.2 | 316 | approved | (new)
propBuilder.ts:club CLUB_HEAD (head width, of CLUB_LONG) | 0.22 | 316 | approved | (new)
propBuilder.ts:stone_axe AXE_LONG (of the man's height) | 0.4 | 316 | approved | (new)
propBuilder.ts:stone_axe AXE_GRIP | 0.25 | 316 | approved | (new)
propBuilder.ts:stone_axe AXE_HEAD (stone length, of AXE_LONG) | 0.42 | 316 | approved | (new)
propBuilder.ts:slab SLAB_WIDE | 0.34 | 316 | approved | 0.25
propBuilder.ts:slab SLAB_TALL | 0.71 | 316 | approved | (unchanged by the 316 rebuild)
propBuilder.ts:slab SLAB_EYE (opening across) | 0.12 | 316 | approved | (new)
propBuilder.ts:slab SLAB_EYE_UP (of the height above the middle) | 0.22 | 316 | approved | (new)
propBuilder.ts:bone_staff BONE_STAFF_LONG (prop units) | 0.62 | 316 | approved | (new; the old rod was 0.85)
propBuilder.ts:bone_staff BONE_STAFF_GRIP | 0.4 | 316 | approved | (new)
propBuilder.ts:bone_staff BONE_STAFF_SKULL | 0.1 | 316 | approved | (new)
projectileSystem.ts:LAUNCH.spear speed | 20 | 316 | approved | (new; the fixed lob flew the chord at 18 with arc 0.15 m per metre)
projectileSystem.ts:LAUNCH.spear gravity | 9.8 | 316 | approved | (new)
