# secret.present_elf
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2), 523 (RE-AUDIT c x2), 525 (CONFIRM: passed a, c; failed b)   Done: -
## Verdicts
a PASS (525: struck 2, 3, 4; CONFIRM passed)
b FAIL (0 since 525, CONFIRM list)
 1. present box width in unit_secret.present_elf_idle — ours a tall slim slab barely wider than his torso — TABS: a near-cube about twice his shoulder width that hides his whole front (ref: secret.present_elf.red.png, secret.present_elf.blue.png)
 2. present box height in unit_secret.present_elf_idle — ours ends at the top of the thighs — TABS: the box reaches down to his knees, only shins and boots showing below it (ref: secret.present_elf.blue.png)
c PASS (523 RE-AUDIT x2; CONFIRM 525 passed)
d PASS (525 stats)
## Ranked gaps
1. [S] secret.present_elf.b present size — blockers 1 and 2: a near-cube box about twice shoulder width, chin to knee, held before the body (PRESENT w/h/d and the hold; the thrown box keeps the same size) — ref: secret.present_elf.blue.png — ours: unit_secret.present_elf_idle
## Attempts (iter | gap | criterion | verdict)
525 | black mid-shin boots, flared top, secretDress presentElfBoots ELF_BOOT (828f37d3) | a | approved (struck 4, a PASS, CONFIRM passed)
525 | green trouser shells, pelvis green, tunic skirt off, secretDress presentElfTrousers ELF_TROUSER (b2419661) | a | approved (struck 3)
525 | open team vest with cream piping and toggles, yoke recoloured to the shirt cream (553aa464) | a | approved (struck 2)
525 | evidence: unit_secret.present_elf_front, the idle angle after the present leaves (2bc9d115) | a | evidence
524 | open team vest, cream piping, toggles (68161f8e, reverted 23b2afbd) | a | dropped (hidden behind the present in the idle)
524 | cream-and-team striped hooked cane across the lid, secretDress PRESENT_CANE (eff4e629) | b | approved (struck 3, b PASS)
523 | two open gold bells with clappers in front of the bow (a369ec7a) | b | approved (struck 2)
522 | the hollow present kicks its lid clear and releases the ally in confetti (d8255310) | c | approved (struck 2, c PASS)
521 | add a cream undershirt and flared wrist sleeves (d7ddb060) | a | approved (struck 1)
520 | throws the present from his chest; it lands, opens 3 s on and his ally steps out, PRESENT_THROW (ed6474a0) | c | approved (struck 1)
519 | torso-sized team present, gold-edged band, bow with tails and small bells, PRESENT (b2600e04) | b | approved (struck 1)
517 | green elf cap, cream fur band, pompom, hood off, secretDress elfCap (b34b4519, 8142c383) | a | approved (struck 1, 7, 6 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 525: the vest is judged in unit_secret.present_elf_front; a bigger present will cover more of the idle (keep the front shot).
- 522: the ability pair holds on the box's landing spot at present_open (da9a1858).
- 525 DEFECTS: vest ends at the waist, piping faint; no team belt with gold buckle.
