# secret.sensei
Status: open   Audited: 538 (AUDIT x2), 541 (CONFIRM: passed b, d; failed a, c)   Done: -
## Verdicts
a FAIL (0 since 541; CONFIRM 541 list)
 1. forearm spikes in unit_secret.sensei_idle, a short row of small white sawteeth flat along the forearm — TABS: four large curved bone-white spikes standing out from each forearm guard, a main silhouette element (ref: secret.sensei.red.png, .blue.png; card Appearance "spiked armor on their forearms")
 2. arms in unit_secret.sensei_idle, bare pale-blue team skin from shoulder to hand — TABS: dark team-cloth sleeves and armoured forearm guards, with only the hand lighter (ref: secret.sensei.blue.png)
b PASS (540: struck 1; CONFIRM 541 passed)
c FAIL (0 since 541; CONFIRM 541 list)
 1. missing: Shuriken Tempest (the wind ring that pushes close enemies back and deflects projectiles; summary records only "burst at 383 ms" and no ability) — TABS: white wind swirls around the sensei (ref: secret.sensei.jpg; card Abilities, Characteristics)
 2. thrown shurikens in unit_secret.sensei_flight, plain small 4-point stars — TABS: the many-pointed shuriken he holds, spinning in flight (ref: card Appearance "spinning when thrown and overall having far more points"; ours unit_secret.sensei_idle holds a 10-point star)
d PASS (541 stats)
## Ranked gaps
1. [S] secret.sensei.c thrown star — blocker 2: the projectile a copy of SENSEI_SHURIKEN (many blades), spinning — ref: card Appearance — ours: unit_secret.sensei_flight
2. [S] secret.sensei.c Shuriken Tempest — blocker 1: near-enemy trigger, white wind ring pushing men back — ref: secret.sensei.jpg — ours: summary (needs an ability shot)
3. [S] secret.sensei.a spikes — blocker 1: SENSEI_BRACER spikes long, curved, bone-white, standing out — ref: secret.sensei.red.png — ours: unit_secret.sensei_idle
4. [S] secret.sensei.a sleeves — blocker 2: dark team cloth sleeves shoulder to wrist — ref: secret.sensei.blue.png — ours: unit_secret.sensei_idle
## Attempts (iter | gap | criterion | verdict)
541 | team vest, orange edge strips SENSEI_VEST, robe board off (2ccc5709) | a | approved (struck 2)
541 | two stacked waist bands edged orange SENSEI_BAND (4b07f4b5) | a | approved (struck 3, a PASS; CONFIRM failed a, c)
540 | ten-bladed pinwheel shuriken SENSEI_SHURIKEN (ac64e6be) | b | approved (struck 1, b PASS)
540 | spiked team forearm guards SENSEI_BRACER (956195e2) | a | approved (struck 4)
539 | team hood-helmet, brow band, shuriken emblem, neck flare SENSEI_HOOD; cone hat off (896b1aac) | a | approved (struck 1, 5)
## Rejected (last 4)
## Notes (max 3 lines)
- 541 critic: vest trim reads gold-yellow more than orange under the glow; band mostly behind the off hand in the idle.
- 540 critic: stars ~1.5 heads across with a heavy hub read as mace balls in the lineup (TABS thin blades round a small pale hub).
