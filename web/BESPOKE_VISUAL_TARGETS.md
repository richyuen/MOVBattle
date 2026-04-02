# Bespoke Visual Targets

## Intent
This pass is the max-bespoke visual target sheet for the current procedural roster. The rule is simple: if a unit has a memorable TABS silhouette cue, preserve that cue even when that requires one-off config or builder behavior.

## No-Regression Rules
- Do not reopen already-good faction baseline units unless a shared primitive change breaks their read.
- Prefer explicit one-off silhouette choices over adding another weak generic preset.
- Enclosed vehicles keep hidden/internal crew. Exposed operator units keep visible operator counts and placements.
- Validation is not complete without both lineup and pairwise coverage where confusion risk is high.

## Faction Cue Families
- Tribal: oversized heads, crude wood, rough bone, wide masks, lopsided mass.
- Farmer: improvised tools, rural cloth, bulky hay/produce silhouettes, simple hats.
- Medieval: plated helmets, shield mass, longswords, heraldic capes, siege wood frames.
- Ancient: bronze/gold armor, shields, plumes, disciplined spear/archer geometry.
- Viking: horned/viking helmets, axes, round shields, fur-and-cape heroic mass.
- Dynasty: conical hats, robes, martial stances, cleaner red/gold weapon reads.
- Renaissance: duelist slimness, painter eccentricity, musket/halberd contrast, balloon/tank eccentricity.
- Pirate: black hats, gunpowder weapons, naval wood, hooks/harpoons, captain silhouettes.
- Spooky: bone, candle, cape/collar, spectral glow, summoner/post/harvest horror cues.
- Wild West: cowboy hats, pistols, rifles, dynamite, rugged dust-and-leather profiles.
- Legacy: toybox/classic icons, banners, exaggerated wizard and boxer reads, deliberate faction mashup.
- Good: bright halos, polished armor, elegant staffs/glaives, paladin bulk, divine symmetry.
- Evil: dark capes, void orbitals, demonic iron, lich silhouettes, oppressive boss scale.
- Secret: maximum individuality; no two Secret heroes or oddballs should collapse into the same read.

## Priority Targets
### Secret Core
- `secret.ballooner`
  Must-match cues: oversized balloon, tiny suspended body, light melee fallback.
- `secret.fan_bearer`
  Must-match cues: large fan, sweeping gust read, slim support stance.
- `secret.the_teacher`
  Must-match cues: robe silhouette, disciplined katana duelist read, minimalist head shape.
- `secret.jester`
  Must-match cues: jester cap, dual tiny blades, unstable nimble silhouette.
- `secret.chu_ko_nu`
  Must-match cues: repeating crossbow, compact ranged stance, visible back rack/bolt read.
- `secret.executioner`
  Must-match cues: massive axe, hooded bulk, heavy forward menace.
- `secret.cheerleader`
  Must-match cues: two pom-poms, tiny support frame, crowd-buff energy.
- `secret.cupid`
  Must-match cues: wings, small bow unit, light romantic/flying silhouette.
- `secret.witch`
  Must-match cues: pointed hat, summon posture, occult cape/staff read.
- `secret.banshee`
  Must-match cues: pale ghostly body, flowing spectral trail, hovering menace.
- `secret.necromancer`
  Must-match cues: bone staff, pale skeletal caster materials, revive/summon read.
- `secret.solar_architect`
  Must-match cues: halo + staff, bright holy magic identity, taller mage posture.
- `secret.vlad`
  Must-match cues: regal spear, noble head cue, vampire collar instead of pirate read.
- `secret.blackbeard`
  Must-match cues: pirate captain hat, pistol + cutlass, wider captain torso.
- `secret.ullr`
  Must-match cues: archer + axe hybrid, cold palette, heroic hunter silhouette.
- `secret.lady_red_jade`
  Must-match cues: red royal duelist, strong sword presence, elite boss posture.
- `secret.sensei`
  Must-match cues: throwing-master hat, robe read, lighter silhouette than shogun.
- `secret.shogun`
  Must-match cues: samurai helmet, broader commander frame, rear-banner authority cue.
- `secret.artemis`
  Must-match cues: radiant hero halo, bow-forward silhouette, premium archer read.

### Vehicles And Composites
- `dynasty.hwacha`
  Must-match cues: single rear operator, wide rocket rack, obvious rolling artillery body.
- `renaissance.da_vinci_tank`
  Must-match cues: enclosed wood tank shell, no exposed killable pilot, squat rolling dome.
- `legacy.tank`
  Must-match cues: enclosed armored chassis, distinct cannon barrel, heavier military tank read than Da Vinci.
- `secret.bomb_cannon`
  Must-match cues: exposed gunner, heavier pirate-bomb artillery body, darker explosive silhouette.
- `secret.gatling_gun`
  Must-match cues: exposed crank gun, obvious rotating barrel cluster, pirate-industrial carriage.
- `secret.bank_robbers`
  Must-match cues: carried safe, robber + safe grouping, asymmetrical composite silhouette.
- `secret.wheelbarrow_dragon`
  Must-match cues: wheelbarrow base plus dragon head, obvious hybrid cart read.
- `secret.clams`
  Must-match cues: oversized shell, pearl core, hidden bomb-diver comedy read.
- `good.sacred_elephant`
  Must-match cues: holy elephant altar/roof silhouette, brighter sacred trim, not a plain mammoth clone.

### Giants And Bosses
- `legacy.dark_peasant`
  Must-match cues: oversized shadow mass, orbiting dark forms, oppressive non-human boss read.
- `legacy.super_peasant`
  Must-match cues: bright hero aura, simplified super-body silhouette, airborne-impact read.
- `spooky.reaper`
  Must-match cues: giant scythe, torn spectral cloak, sweeping aura.
- `evil.void_monarch`
  Must-match cues: large crown/cape mass, void orbitals, tall summoner-boss read.
- `secret.skeleton_giant`
  Must-match cues: bony colossal shoulders, pale skeletal crown, giant undead scale.
- `secret.samurai_giant`
  Must-match cues: giant katana, samurai armor read, red royal giant presence.
- `secret.tree_giant`
  Must-match cues: branch crown, bark/leaf mass, living-tree giant read.
- `secret.ice_giant`
  Must-match cues: crystalline horns/shards, cold blue scale, icy brute silhouette.

## Pairwise Differentiation Targets
- `wild_west.gunslinger` vs `wild_west.quick_draw`
  Quick Draw must look like the larger hero version, not just another cowboy gunner.
- `legacy.boxer` vs `legacy.super_boxer`
  Super Boxer must look like a clear upgrade in scale, material, and heroic body read.
- `good.chronomancer` vs `good.divine_arbiter`
  Chronomancer is ring/time magic; Divine Arbiter is thunder/halo hero mass.
- `secret.vlad` vs `secret.blackbeard`
  Vlad must read noble vampire; Blackbeard must read pirate brute.
- `secret.sensei` vs `secret.shogun`
  Sensei is lighter robe/hat precision; Shogun is armored command mass.
- `secret.witch` vs `secret.necromancer`
  Witch is pointed-hat spectral summoner; Necromancer is bone-staff undead reviver.

## Acceptance Links
- Baseline coverage: [`web/COMPREHENSIVE_VISUAL_PARITY_MATRIX.md`](C:/Git/MOVBattle/web/COMPREHENSIVE_VISUAL_PARITY_MATRIX.md)
- Gallery flow: [`web/VISUAL_ACCEPTANCE_GALLERY.md`](C:/Git/MOVBattle/web/VISUAL_ACCEPTANCE_GALLERY.md)
- Executable scenarios: [`web/src/testing/scenarios.ts`](C:/Git/MOVBattle/web/src/testing/scenarios.ts)
