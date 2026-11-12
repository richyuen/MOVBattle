# secret.present_elf
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2), 523 (RE-AUDIT c x2)   Done: -
## Verdicts
a FAIL (1 since 518, 1 struck)
 2. open vest with toggles in unit_secret.present_elf_idle — TABS: team vest open over the cream shirt; ours is a dark teal tunic block (ref: secret.present_elf.png)
 3. green trousers in unit_secret.present_elf_idle — TABS: green legs; ours has team legs (ref: secret.present_elf.blue.png)
 4. black boots in unit_secret.present_elf_idle — TABS: black boots; ours has team feet (ref: secret.present_elf.red.png)
b PASS (524: struck 3, striped hooked candy cane on the lid)
c PASS (523 RE-AUDIT x2)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.present_elf.a green trousers — blocker 3: green trouser shells over the legs — ref: secret.present_elf.blue.png — ours: unit_secret.present_elf_idle
2. [S] secret.present_elf.a black boots — blocker 4: black boot shells over the feet — ref: secret.present_elf.red.png — ours: unit_secret.present_elf_idle
3. [S] secret.present_elf.a open vest — blocker 2: evidence commit first (the present hides the torso in the idle), then two open team panels with toggles over the cream shirt — ref: secret.present_elf.png
## Attempts (iter | gap | criterion | verdict)
524 | open team vest, cream piping, toggles (68161f8e, reverted 23b2afbd) | a | dropped (hidden behind the present in the idle)
524 | cream-and-team striped hooked cane across the lid, secretDress PRESENT_CANE (eff4e629) | b | approved (struck 3, b PASS)
523 | two open gold bells with clappers in front of the bow (a369ec7a) | b | approved (struck 2)
522 | the hollow present kicks its lid clear and releases the ally in confetti (d8255310) | c | approved (struck 2, c PASS)
521 | add a cream undershirt and flared wrist sleeves (d7ddb060) | a | approved (struck 1)
520 | throws the present from his chest at the man; it lands, opens 3 s on and his ally steps out, simulationSystem PRESENT_THROW (ed6474a0) | c | approved (struck 1)
519 | torso-sized team present, gold-edged band, bow with tails and small bells, secretDress presentElfPresent PRESENT (b2600e04) | b | approved (struck 1)
517 | green elf cap, cream fur band, pompom, hood off, secretDress elfCap (b34b4519, 8142c383) | a | approved (struck 1, 7, 6 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 524: a.2 is judged in an idle where the torso-sized present covers the chest: re-aim (back three-quarter) before another vest.
- 522: the ability pair holds on the box's landing spot at present_open (da9a1858).
- 524 DEFECTS: the cane's shaft is mostly hidden behind the body in the idle; only the hook reads.
