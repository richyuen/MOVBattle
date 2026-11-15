# map.farmer_1
Status: open   Audited: 555 (AUDIT x2), 560 (CONFIRM: passed b; failed a), 561 (CONFIRM: failed a)   Done: -
## Verdicts
a FAIL plateau (0 since 561, CONFIRM list; second CONFIRM fail): 1. watermill roofs plain tan-brown gables over navy-blue walls in map_farmer_1_island (front centre) and map_farmer_1_top (bottom centre) — TABS: the two mill halves carry blue-grey roof panels framed by timber beams over plank-board walls (ref: reference/maps/wiki/farmer_1.png, lower left) 2. bridge is a smooth pale-grey half-pipe slab with plain rails in map_farmer_1_ground (centre) — TABS: a humped cobbled grey-stone arch with stone parapets (ref: reference/maps/wiki/farmer_1.png, centre) 3. flat pale-lime disc mounds at the rim in map_farmer_1_island (left and right) and map_farmer_1_top (left, back-left, right) — TABS: big faceted olive boulder/bush clumps (ref: reference/maps/wiki/farmer_1.png, left centre and bottom right) 4. no tilled furrow strips anywhere on the field in map_farmer_1_top — TABS: rows of raised tilled strips on both sides of the river in front of the bridge (ref: reference/maps/wiki/farmer_1.png, centre-left and centre-right)
b PASS (560: struck 3; CONFIRM 560)
c PASS (561 judge)
## Ranked gaps
1. [R] a — rebuild the look from both CONFIRM lists (560: water tufts, flat bridge, straight canal; 561: blockers 1-4 above) plus critic 561's straight-course note: mill blue-grey roofs + timber-framed plank walls, cobbled stone deck with block courses, olive faceted boulder/bush clumps replacing the "hill" disc mounds, tilled strip rows either side of the river, riverX one large diagonal S-bend (keep |x| room for zones: hazards follow riverX)
## Attempts (iter | gap | criterion | verdict)
555-559 | a: watermill, red houses, meadow + tracks, earth bowl, ruins out + pumpkins | a | 5 APPROVE, struck 1, 3, 5, 6
555-558 | b: river, bridge, totem out, walls, wheat strips | b | 5 APPROVE, struck 1, 2, 4, 5, 6
560 | [S] Scots pines; round island; watermill rebuilt (8105869f, 22e0ba71+ba8232f8, d6119113) | a, b | 3 APPROVE struck a4, b3, a2
561 | [S] blades cleared off river/deck (5f83a159) | a1 | APPROVE struck 1
561 | [S] humped arched bridge, units drawn on the hump (37c2368f, dc06adf4) | a2 | APPROVE struck 2
561 | [S] ragged stream edges, bend 1.9/rate 0.1, bank boulders (b23c5f33, 48c5b110) | a3 | APPROVE (kept: course still straight)
## Rejected (last 4)
## Notes (max 3 lines)
- Builder tabs/farmer_1.ts on campaign.introduction; river hazard |x - riverX| < 2 (zones |x|>=5); bridgeHeight is the map's drawn height (units ride the hump).
- Critic 561: deck plain pale grey (want cobbled mid grey ~0.6,0.58,0.55); path flecks on the bridge foot; near bank rocks cool slate in shade.
