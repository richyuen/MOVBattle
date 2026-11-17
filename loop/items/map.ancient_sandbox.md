# map.ancient_sandbox
Status: open   Audited: 562 (AUDIT x2), 573 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (574: struck 1, 3, 5): 2. saturated mid-green lawn across map_ancient_sandbox_ground.png — TABS: yellow-olive green grass (ref: reference/maps/wiki/ancient_sandbox.png) 4. large white cloud mass covering the lower right of the island in map_ancient_sandbox_island.png — TABS: clouds stay in the sky and the island and its cliffs are unobstructed (ref: reference/maps/greek_ancient_sandbox.png)
b PASS (573: struck 1, 4; CONFIRM 573)
c PASS (574 judge)

## Ranked gaps
1. [S] a — lawn palette — blocker 2: yellow-olive field floor and grass flecks — ref: reference/maps/wiki/ancient_sandbox.png — ours: map_ancient_sandbox_ground.png
2. [S] a — cloud off the island — blocker 4: remove or raise the low "cloud" mesh in front of the island's lower right — ref: reference/maps/greek_ancient_sandbox.png — ours: map_ancient_sandbox_island.png

## Attempts (iter | gap | criterion | verdict)
563-566 | [S] own builder: terracotta cliffs, sea, junk removed, meadow, clay paths | a, b | 5 APPROVE struck a1, a4, a5, b5
570-572 | [S] temple hills, ruins, spiral mountain, hamlets and cypresses | a, b | 4 APPROVE struck a2, a3, a6, b2, b3
573 | [S] outer shelves and headlands (d11426f4); offshore islets (b82dd7b7) | b | 2 APPROVE, struck b1, b4 (b PASS); CONFIRM failed a
574 | [S] clear sky (a472ad38); sandstone rocks and steps (ae0499eb); hazy graded sea (452ef25d+7ac51041) | a | 3 APPROVE, struck a1, a3, a5

## Rejected (last 4)

## Notes (max 3 lines)
- No stages fought on it. Base is campaign.challenge (shared): dress it in tabs/ancient_sandbox.ts only.
- Critic 574: islets render slate-violet (fog them); near sea lower left still saturated with cyan lagoon edge; steps read as boxes on the cliff face.
- Critic 573: field inside still a rounded rectangle with an orange rim line. Critic 572: houses bare cubes.
