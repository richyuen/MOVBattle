# renaissance.musketeer
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 368)
 2. no tan collar over the team chestplate in unit_renaissance.musketeer_idle — TABS: a turned tan collar on the breastplate (ref: .red.png, .jpg)
 3. lower legs in unit_renaissance.musketeer_idle: dark boots — TABS: team stockings, dark garter bands, tan sock tops, orange shoes (ref: .red.png)
b FAIL (0 since 368)
 1. musket in unit_renaissance.musketeer_windup/_idle: a thin dark-grey rod — TABS: fat light-grey octagonal barrel, dark ring bands, long brown stock, longer than the man (ref: .red.png)
c PASS (368)
d PASS (cost 250, hp 1.12x, dmg 2.05x vs 2.44x, cd 5.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b matchlock — blocker 1: fat light-grey octagonal barrel, dark bands, long brown stock, longer than the man — ref: renaissance.musketeer.red.png — ours: unit_renaissance.musketeer_windup.png
2. [S] a tan collar — blocker 2: a turned tan collar over the team breastplate (dressMusketeer) — ref: .red.png — ours: unit_renaissance.musketeer_idle.png
## Attempts (iter | gap | criterion | verdict)
335 | vest, blouse sleeves, collar, breeches, stockings [S] (f5030a9) | a | approved
336 | curled moustache and goatee [S] (3ce4ab9) | a | approved
336 | cream tone (.8,.6,.36) glow .15 [P] (dae097a) | a | approved
337 | vest hem skirt, belt line, deeper breeches [S] (780101e) | a | approved
327-332 | morion, matchlock, carry, shouldered aim, smoke, fling [S] | a,b,c | approved
368 | morion re-cut: tall 6-facet bowl, half-disc comb, brim points up, sides droop (MORION_CUT) [S] (965f103) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _aimMusket holds the shouldered aim (MUSKET_AIM); GUN_FLING (weaponHint musket) is shared with wild_west.deadeye; MUSKET and _aimMusket too.
- Facial hair: tribalDress moustache_goatee. dressMusketeer (MUSKETEER_DRESS, MUSKETEER_VEST): vest hem skirt + belt, breeches .6 team.
- Critic 368 minor: comb unreadable from the front three-quarter; iron near-black (TABS dark grey).
