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
317 | bone spike row (7496412) | tribal.bone_mage.c | approved
317 | stick-and-launch (6f13b5a) | tribal.spear_thrower.c | approved
317 | two-handed grip (6a1bbe4) | tribal.clubber.b | approved
317 | no back spear (3fd57a5) | tribal.protector.b | approved
317 | upright carry (b6bc951) | tribal.bone_mage.b | approved
318 | moss chunks (af37ab3) | tribal.protector.b | approved
318 | lashed stone head (83bec0d + 069541b) | tribal.chieftain.b | approved
318 | spear raised overhead (b194791, reverted 62d30bf) | tribal.spear_thrower.b | rejected
318 | forward toss (9a15b0d) | tribal.stoner.c | approved
318 | leaves along the spike line (000f0de) | tribal.bone_mage.c | approved
319 | spear stood up out of the fist (c8f0e70) | tribal.spear_thrower.b | approved
319 | lashing bands (c7ea0cc + 8c16992) | tribal.chieftain.b | approved
319 | faceted boulder cradled two-handed (aa85160) | tribal.stoner.b | approved
319 | spike loft (33e7601) | tribal.bone_mage.c | approved
319 | skull helmet (e53ba02) | tribal.protector.a | approved
320 | stone leaf head (4e68c1c) | tribal.spear_thrower.b | approved
320 | animal-skull helmet (f86e35f) | tribal.chieftain.a | approved
320 | one-shoulder garment (586d90f + f87534f + e16240e) | tribal.stoner.a | approved
320 | one-shoulder garment, shared tunic (b077ecf) | tribal.protector.a | approved
320 | hide cape (f5283a1) | tribal.bone_mage.a | approved
321 | critter-skull necklace (3adbe16 + aec9799) | tribal.protector.a | approved
321 | charcoal lump, merged chunks (7f4d666 + 1595032) | tribal.stoner.b | approved
321 | long hair (7fe93b7 + 2f5823c) | tribal.stoner.a | approved
321 | tusk headband (36befcc) | tribal.spear_thrower.a | approved
321 | ornamented loincloth (3fd478f) | tribal.bone_mage.a | approved
322 | ornamented loincloth, joins LOINCLOTHS (076f7fd) | tribal.spear_thrower.a | approved
322 | bone necklace (55b683b) | tribal.stoner.a | approved
322 | bone necklace and bracelets (a79b80b) | tribal.bone_mage.a | approved
322 | skull pauldrons (dfa7bbc) | tribal.chieftain.a | approved
322 | hair and beard (940436d) | tribal.clubber.a | approved

## Spent (never retry as [P])
(none yet)

## Rows
propBuilder.ts:club CLUB_LONG (of the man's height) | 0.6 | 316 | approved | (new; the old club was 0.65 prop units)
propBuilder.ts:club CLUB_GRIP (share below the fist) | 0.2 | 316 | approved | (new)
propBuilder.ts:club CLUB_HEAD (head width, of CLUB_LONG) | 0.22 | 316 | approved | (new)
propBuilder.ts:stone_axe AXE_LONG (of the man's height) | 0.4 | 316 | approved | (new)
propBuilder.ts:stone_axe AXE_GRIP | 0.25 | 316 | approved | (new)
propBuilder.ts:stone_axe AXE_HEAD (stone length, of AXE_LONG) | 0.78 | 318 | approved | 0.55 (317 [P]), 0.42 (316); the 318 [S] rebuilt the chunk and its lashing
propBuilder.ts:stone_axe AXE_HEAD_SQUASH (height, thickness of the length) | 0.62, 0.5 | 318 | approved | 0.8, 0.6 (317), 0.62, 0.4 (316, inline)
propBuilder.ts:stone_axe AXE_LASH (strip wide, thick, proud, tilt, at, bed) | 0.055, 0.06, 0.012, 0.5, 0.1, 0.35 | 319 | approved | tori: thick 0.03, tilt 0.5 (318); the 319 [S] replaced the tori with bedded strips and damped the chunk's thin-axis jitter to bed
propBuilder.ts:slab SLAB_MOSS (top, bottom chunk size, proud of the face) | 0.13, 0.08, 0.03 | 318 | approved | (new)
proceduralAnimation.ts:throw JAVELIN_COCK (raise, out, elbow) | -2.8, 0.12, -0.1 | 319 | approved | reverted (318: the same arm without the shaft turn hung the javelin down the back)
proceduralAnimation.ts:throw JAVELIN_UNTURN (share of the whip where the stood shaft starts turning back) | 0.2 | 319 | approved | (new; square at THROW_LET_GO 0.5)
propBuilder.ts:slab SLAB_WIDE | 0.34 | 316 | approved | 0.25
propBuilder.ts:slab SLAB_TALL | 0.71 | 316 | approved | (unchanged by the 316 rebuild)
propBuilder.ts:slab SLAB_EYE (opening across) | 0.12 | 316 | approved | (new)
propBuilder.ts:slab SLAB_EYE_UP (of the height above the middle) | 0.22 | 316 | approved | (new)
propBuilder.ts:bone_staff BONE_STAFF_LONG (prop units) | 0.62 | 316 | approved | (new; the old rod was 0.85)
propBuilder.ts:bone_staff BONE_STAFF_GRIP | 0.4 | 316 | approved | (new)
propBuilder.ts:bone_staff BONE_STAFF_SKULL | 0.1 | 316 | approved | (new)
projectileSystem.ts:LAUNCH.spear speed | 20 | 316 | approved | (new; the fixed lob flew the chord at 18 with arc 0.15 m per metre)
projectileSystem.ts:LAUNCH.spear gravity | 9.8 | 316 | approved | (new)
projectileSystem.ts:LAUNCH.spear throw (staggerFromBlow force) | 220 | 317 | approved | (new; the card's force)
proceduralAnimation.ts:club OFFHAND_GRIP_UP (of the club's length) | 0.11 | 317 | approved | (new)
proceduralAnimation.ts:bone_staff BONE_HOLD (raise, out, elbow) | -0.2, 0.18, -0.5 | 317 | approved | (new; planted, tip 0.03, 1.6, 0.04)
visualEffects.ts:boneSpikes BONE_SPIKE_NEAR..FAR (m) | 0.45, 1.35 | 317 | approved | (new; EVERY 0.025 s, STEP 0.55 m, STAND 1.6 s)
visualEffects.ts:boneSpikes BONE_SPIKE_GIRTH (base, grow, m) | 0.32, 0.22 | 318 | approved | 0.14, 0.1 (317, inline)
projectileSystem.ts:LAUNCH.stone speed, gravity (held only) | 18, 9.8 | 318 | approved | (new; the fixed lob flew at 10 with arc 0.4 m per metre, and still does for a catapult)
simulationSystem.ts:LEAF_ROW (lift, at, arc per metre) | 0.6, 0.7, 0.03 | 318 | approved | (new; the leaves left the staff head with originLift 0, arc 0.12)
projectileSystem.ts:SPIKE_LOFT (up, along m/s) | 10, 2.5 | 319 | approved | (new; before it the caught man had only applyDamage's capped 0.95 lift)
propBuilder.ts:stone BOULDER_WIDE, BOULDER_JITTER, BOULDER_CHUNKS (3), BOULDER_COLOR | 0.3, 0.16, r 0.42/0.34/0.3, (0.2, 0.18, 0.16) e0.1 | 321 | approved | jitter 0.2, one ball, (0.3, 0.27, 0.24) e0.15 (319); (0.34, 0.31, 0.28) (pre-loop)
proceduralAnimation.ts:boulder BOULDER_CARRY (raise, inward, elbow), BOULDER_HOLD | -0.75, 0.2, -0.6, 1.0 | 319 | approved | -0.6, 0.42, -0.75, no hold solve (pre-loop)
propBuilder.ts:bone_mask SKULL_FACETED (heads, tall, under, jitter, socket, snout) | 1.45, 1.6, 0.7, 0.09, 0.3, 0.55 | 320 | approved | tall 0.85, under 0.35 (319 [S]; 320 [P] was its fallout); old cap SKULL_HEADS 1.25 smooth dome
propBuilder.ts:javelin JAVELIN_HEAD_LONG, JAVELIN_HEAD_WIDE | 0.15, 0.095 | 320 | approved | 0.13, 0.09 (the four-sided cone)
propBuilder.ts:javelin JAVELIN_LEAF (thick, waist, root, jitter, wraps), JAVELIN_STONE | 0.3, 0.35, 0.4, 0.14, 3, (0.44, 0.43, 0.41) e0.15 | 320 | approved | (new; iron (0.2, 0.21, 0.24), red binding)
unitFactory.ts:tunic TUNIC (top, skirt, flare, tatters, strap), TUNIC_COLOR | 0.88, 0.6, 1.25, 5, 0.22, (0.5, 0.29, 0.18) e0.15 | 320 | approved | (new; stoner, protector)
unitFactory.ts:cape HIDE_CAPE (wide, thick, tilt, jitter, points, drop), COLOR | 1.25, 0.35, 0.12, 0.12, 4, 0.55, (0.38, 0.23, 0.14) e0.16 | 320 | approved | (new; bone_mage)
tribalDress.ts:necklace CRITTER_NECKLACE (skull, spread, drop, lift, strap) | 0.5, 0.55, 0.2, 0.05, 0.03 | 321 | approved | skull 0.42 (321 first commit); protector
tribalDress.ts:hair LONG_HAIR (strands, face, fringe, long, thick), COLOR | 17, 0.8, 4, 1.05, 0.32, (0.3, 0.18, 0.1) e0.18 | 321 | approved | 13 strands, thick 0.24 (321 first commit); stoner
tribalDress.ts:tusks TUSK_BAND (band, strap, rise, bow, thick) | 0.45, 0.1, 0.65, 0.22, 0.4 | 322 | approved | rise 1.1, thick 0.28 (321 [S]); 322 [P] fallout; do not re-nudge before 342
tribalDress.ts:loincloth LOINCLOTH (ropes, flap, skull, bone, boneAt), FLAP_COLOR | 2, 0.85, 0.42, 0.62, 0.95, (0.5, 0.3, 0.18) e0.15 | 321 | approved | (new; bone_mage)
tribalDress.ts:necklace BONE_NECKLACE (drop, bone, middle, thick, gap, strap, off) | 0.16, 0.55, 1.25, 0.13, 2.4, 0.03, 0.14 | 322 | approved | (new; stoner, bone_mage)
tribalDress.ts:bracelets BRACELET (at, apart, bones, long, thick, proud) | 0.76, 0.16, 6, 0.3, 0.28, 0.18 | 322 | approved | (new; bone_mage)
tribalDress.ts:pauldrons PAULDRON (wide, long, top, out) | 1.9, 0.95, 0.12, 0.55 | 322 | approved | (new; chieftain; critic 322: too white, sockets too big)
tribalDress.ts:beard BEARD (down, wide, deep, locks, lockLong, jitter), CLUBBER_HAIR_COLOR | 0.32, 1.0, 0.5, 5, 0.3, 0.15, (0.4, 0.25, 0.15) e0.18 | 322 | approved | (new; clubber)
