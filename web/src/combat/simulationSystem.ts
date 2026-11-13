import { Color3, Mesh, Node, Quaternion, TransformNode, Vector3, type Material } from "@babylonjs/core";
import { CREW_FIGHT, flyLongshipHull, heaveLongshipCrew, isVehicleUnit, landedOarsmenAt, landLongshipCrew, poseWheelbarrowCrew, swingLongshipCrew, wheelbarrowCrew } from "../units/vehicleBuilder";
import { RuntimeUnit } from "../units/runtimeUnit";
import { AnimState } from "../units/proceduralAnimation";
import {
  AttackType, TargetPriority,
  getAttackProfile, getAIProfile,
  type AttackProfile, type AIProfile,
} from "../data/combatProfiles";
import { ProjectileSystem, type ProjectileShape } from "./projectileSystem";
import { VisualEffects, boneSpikeRowNear } from "./visualEffects";
import type { ImpactPresentation } from "./impactPresentation";
import type { LinkedRelation, RuntimeSpawnRole } from "../units/runtimeUnit";
import type { UnitVisualConfig } from "../units/unitVisuals";
import { HARPOON_MUZZLE, launchRingSword } from "../units/propBuilder";
import { buildGroundSnake, type GroundSnake } from "../units/ancientDress";
import { reaperSpear } from "../units/spookyDress";
import { lassoRope } from "../units/wildWestDress";
import { bearerReach } from "../units/legacyDress";
import { monarchDemonForm } from "../units/evilDress";
import { clamCritter } from "../units/secretDress";
import { aegisField, aegisOrbits, chronoLights, chronoRingLit, paladinGiantHammer } from "./goodMagic";
import { TEAM_COLORS } from "../data/factionColors";

import type { HazardRegion } from "../map/hazards";
import { isPointInsideHazard } from "../map/hazards";
import type { PlacementZone } from "../map/placementValidator";
import type { Obstacle } from "../map/obstacles";
import { NavigationGrid } from "../map/navigation";

/** [S] 460 the aura each bearer's ring lays on the allies inside it (RuntimeUnit.applyAura), in place of the support heal. */
const BEARER_AURA_KIND: Record<string, "haste" | "stay"> = { "legacy.flag_bearer": "haste", "legacy.banner_bearer": "stay" };
/** [S] 465 a bearer is a melee man (his pole is his weapon, Stay Banner / Charge Flag): the ring's aura is a pulse of its own, every `every` s, held `holds` s. */
const BEARER_PULSE = { every: 3, holds: 3.5 };
// [S] 485 Shockwave Hammer (SimulationSystem._stepHammers): reach m, cooldown s, power x the mace blow, splash radius m, push, daze s, hinge angles rad, hang/fall/linger s
const CHRONO_TRANSFORM = { settle: 0.2, drop: 1.45, tilt: 1.15, grow: 0.25, spin: 1.6, orbit: 0.9 };
const PALADIN_HAMMER = { reach: 7, cooldown: 8, power: 1.5, radius: 2.5, push: 5, daze: 1.2, raised: -0.35, down: 1.5, hang: 0.4, fall: 0.3, linger: 0.35 };

export interface SpawnUnitOptions {
  role?: RuntimeSpawnRole;
  countsTowardVictory?: boolean;
  linkedParent?: RuntimeUnit;
  linkedRelation?: LinkedRelation;
  visualOverride?: UnitVisualConfig;
  suppressDecorativeOperators?: boolean;
  forceArticulatedBody?: boolean;
  expireAfterSeconds?: number;
}

function hasAbility(unit: RuntimeUnit, ability: string): boolean {
  return (unit.definition.abilities ?? []).includes(ability as never);
}

function resolveProjectileShape(unit: RuntimeUnit, profile: AttackProfile): ProjectileShape | null {
  // [S] 528 (c.1) the Gatling Gun fires bullets with tracer lines, not crossbow bolts (projectileSystem GATLING_BULLET)
  if (unit.definition.id === "secret.gatling_gun") return "gatling_bullet";
  // [S] 534 (c.2) the Witch (and her clones) throw mushroom spells, not a dark dart (projectileSystem MUSHROOM_SPELL)
  if (unit.definition.id === "secret.witch") return "mushroom_spell";
  switch (unit.definition.projectileHint) {
    case "arrow": return "arrow";
    case "small_arrow": return "small_arrow"; // [S] 465 the Poacher's Small Arrow (projectileSystem SMALL_ARROW)
    case "blowdart": return "blowdart"; // [S] 465 the Blowdarter's Blow Dart (projectileSystem BLOW_DART)
    case "bolt": return "bolt";
    case "bomb": return "bomb";
    case "pumpkin": return "pumpkin";
    case "barrel": return "barrel"; // [S] 463 the Barrel Roller's explosive barrel (projectileSystem BARREL_SHOT)
    case "stone": return unit.definition.specialHint === "cannon" ? "cannonball" : "stone"; // a cannon fires an iron ball, not the catapult's rock
    case "spear": return "spear";
    case "firework": return "firework";
    case "shuriken": return "shuriken";
    case "rocket_arrow": return "rocket_arrow";
    case "crow": return "crow";
    case "fireball": return unit.definition.id === "legacy.wizard" ? "wizard_spell" : "fireball"; // [S] 473 the Wizard's own spell (projectileSystem WIZARD_SPELL)
    case "spirit_fire": return "spirit_fire";
    case "leaves": return "leaves";
    case "sword": return "sword";
    default:
      break;
  }

  const pid = profile.projectileId ?? "";
  switch (pid) {
    case "projectile.arrow": return "arrow";
    case "projectile.bolt": return "bolt";
    case "projectile.bomb": return "bomb";
    case "projectile.stone": return "stone";
    default: break;
  }

  if (profile.type === AttackType.Ranged) return "arrow";
  if (profile.type === AttackType.Siege) return "stone";
  return null;
}

// Throwers whose missile is the prop in their hand (vfx tier 3, units/tribal.spear_thrower, pirate.bomb_thrower, tribal.stoner): it leaves the fist at the throw's let-go, not at the swing's start
// [S] ...and the potionseller's bottle (341; card Weapons: Potion Throw, a lobbed potion): the glass ball in her right hand is what flies, on the bomb's high lob
/** [S] 416 the Dragon's breath: the jet lasts .seconds, from .ahead of his scale in front of his head and .down under it, onto the man's chest (.chest m up). */
// .burn: how long the man it reaches burns (visualEffects BODY_FLAMES), s
// [S] 425 the harpooner's reel-in (_reelIn): the struck man's launch lift (m/s up), top haul speed, where he lands short of the shooter (m), rope taut (s)
const HARPOON_REEL = { lift: 3, top: 14, stop: 1.4, rope: 0.7 };
// [S] 425 guns thrown away after the shot (_tossGuns): who does it, the throw (out to the side, back, up: m/s; spin rad/s), where they lie (m up),
// how long they lie (s), and when the first punch is due after the shot (s)
const GUN_TOSS = { units: new Set(["pirate.flintlock"]), out: 2.6, back: 1.6, up: 3.4, spin: 9, rest: 0.05, lie: 8, ready: 0.9 };
// [S] 426 Blunderbuss Recoil (card Characteristics "ridiculous recoil that will blow them into the ground"): at each shot the shooter is thrown
// back along the shot's line, .back m/s off his feet with .lift m/s up, and tumbles (applyBlastLaunch's topple) to lie on his back before he rises
// [S] 426 Pirate Kick (card pirate.harpooner Characteristics "The Harpooner will then reel in the enemy unit, and kicking them once in melee range"):
// a man within .within m past body contact, with a kick ready (.cooldown s apart), is front-kicked: the harpooner stops, his foot chambers and drives
// out over .windup s (proceduralAnimation PIRATE_KICK_POSE), and at the blow the man (still within .slack more) takes .damage of a shot's harm and is
// booted off his feet .fling m/s along the kick with .lift m/s up; the foot is back down .recover s later. Logged "kick" at the blow.
const PIRATE_KICK = { units: new Set(["pirate.harpooner", "secret.jester", "secret.taekwondo"]), within: 0.6, slack: 0.4, windup: 0.25, recover: 0.35, cooldown: 2.5, damage: 0.8, fling: 5, lift: 3, raise: 1.45, plain: false };
// [S] 511 the Jester Kick (card secret.jester Abilities "Jester Kick": damage 80-1500 against the dagger's 70-140, cooldown 2 s, range 1, warm-up .3 s;
// Characteristics "sharp daggers on their hands and toes ... delivering a lethal kick"; audit 500 c.2): the same front kick, its toe knife leading
// (secretDress jesterToeKnives), on his own clock between dagger stabs: .windup s to the blow, .damage of a stab's harm, a smaller boot off the feet.
// [S] 516 the Taekwondo Kick (card secret.taekwondo Characteristics "deliver a kick to enemy units they encounter, often flinging them away ... the
// quickest to perform with the shortest cooldown"; Abilities "kicks to the head, chest"; audit 515 c.1 "raised fists, legs planted"): his main blow
// is the same front kick driven up to the man's chest and head (.raise rad at the hip), every 1.5 s, punches between; the kick is a plain hit too
// (.plain: hitLog), so it is the release the capture frames.
const KICK_BY_UNIT: Record<string, typeof PIRATE_KICK> = {
  "secret.jester": { ...PIRATE_KICK, within: 0.5, windup: 0.3, recover: 0.3, cooldown: 2, damage: 4, fling: 3.5, lift: 2 },
  "secret.taekwondo": { ...PIRATE_KICK, within: 0.75, windup: 0.22, recover: 0.32, cooldown: 1.5, damage: 3, fling: 7, lift: 3.5, raise: 2.05, plain: true },
};
const kickOf = (id: string): typeof PIRATE_KICK => KICK_BY_UNIT[id] ?? PIRATE_KICK;
/*
 * [S] 514 the Ballooner glued to his man (card Characteristics "use their Ballooner Grabs to glue onto units and lift them up"; audit c.2 "a poke from
 * 1 m"; probe 514: the two toppled apart under their own crowd push, torsos 2.2 m off through the lift): at his grab he is set in chest to chest,
 * their centres .chest of their summed radii apart, faced on him, both kept on their feet (RuntimeUnit.holdUpright) every step of the lift, and both
 * his glue mitts held on the man's trunk (proceduralAnimation GLUE_GRIP) from the grab's own tick until the balloon lets go.
 */
const GLUE_HOLD = { chest: 0.5 };
// [S] 464 the Pike's dropped pike (_dropPike): forward and up as it leaves the fist (m/s), its tumble (rad/s), his first slap after (s)
// 464b: up .8, spin 1.2 left it level at his chest 150 ms on (the _ability_after shot read as still held): it now leaves falling, tipping
const PIKE_DROP = { ahead: 0.6, up: -2.4, spin: 3, ready: 0.6 };
const BLUNDERBUSS_RECOIL = { units: new Set(["pirate.blunderbuss"]), back: 4.5, lift: 3.2 };
// [S] 428 the Captain's dragon pistol (card pirate.captain Weapons off Flintlock Blunderbuss: damage 50, cooldown 2 s, range 3, force 3000; Characteristics
// "will charge in, blasting enemy units with their Pistol"): a man within .range m (centre to centre) with the pistol ready (.cooldown s apart, first
// ready .warmup s after he is first in range) is shot point-blank from the held-out bell while the cutlass keeps on: a flash .flash times a pistol's
// at the bell and a ball to his chest (spawnPistolShot), .damage of a cutlass blow, and he is hurled .fling m/s along the line with .lift m/s up.
// Logged "dragon_pistol" at the shot, as an ability (no plain hit), so the slash stays the release.
const DRAGON_BLAST = { units: new Set(["pirate.captain"]), range: 3, cooldown: 2, warmup: 0.4, damage: 0.42, fling: 7, lift: 3.5, flash: 2.4 };
// [S] 427 the Blunderbuss's shot (card Weapons: force 650, range 5): the man it is fired at is thrown off his feet along the shot's line, .fling m/s
// out and .lift m/s up (applyBlastLaunch's topple: he tumbles and lies before he rises)
const BLUNDERBUSS_BLAST = { units: new Set(["pirate.blunderbuss"]), fling: 6, lift: 7 };
// [S] 427 Bomb Spin (card pirate.pirate_queen Abilities: 7 bombs, explosion radius 3.5, cooldown 8; Characteristics "If outnumbered ... spin and release
// several bombs, then proceed to helicopter upwards, with the bombs blowing up the units below"): with .crowd or more men within .within m and the spin
// ready (.cooldown s apart, ready from the start), she stops and whirls at .rate rad/s, arms out level (proceduralAnimation BOMB_SPIN_POSE); .drop s in,
// .count bombs leave her at even headings, each lobbed .out m out to the ground in .flight s, and she is thrown .rise m/s straight up, still whirling,
// for .after s more. Each bomb bursts .splash m wide for .damage of a blow. Logged "bombspin" at the drop.
const BOMB_SPIN = { units: new Set(["pirate.pirate_queen"]), within: 3, crowd: 3, cooldown: 8, rate: 16, drop: 0.3, after: 0.7, count: 7, out: 2.6, flight: 0.55, splash: 3.5, damage: 0.67, rise: 9 };
const DRAGON_BREATH = { burn: 3, seconds: 0.7, ahead: 0.4, down: 0.3, chest: 0.9 };
// [S] 530 the Wheelbarrow Dragon's breath (spec at the fire_dot status): jet held .seconds from .ahead m before the jaw to .chest m up the man
const BARROW_BREATH = { burn: 2.5, seconds: 0.9, ahead: 0.08, chest: 0.8 };
/*
 * [S] 493 the Mad Mechanic's claw fire (audit 489 c.1: "a lobbed black bomb that explodes in a white blast - TABS: a light-blue flame jet sprayed from
 * the claws at short range (4.5)"; card Weapons "Mad Mechanic Fire": range 4.5, explosion radius 1.25; Characteristics "two claws that spews out
 * light-blue fire"): in place of the bomb, a flame jet (visualEffects spawnFlameJet) from the weapon claw .ahead m in front of the fist to the man's
 * chest (.chest m up) for .seconds, a pale-cyan core in a light-blue rim, .near m round at the claw swelling to .far; the blow lands with the jet.
 */
const MECHANIC_FIRE = { seconds: 0.8, ahead: 0.25, chest: 0.9, near: 0.08, far: 0.3, farPer: 0.1,white: new Color3(0.8, 1, 1), yellow: new Color3(0.25, 0.7, 1.15) };
/*
 * [S] 493 the Death Bringer's warglaive trail (audit 489 c.1: "a slow overhead greatsword chop - TABS: swift twin-blade slashes leaving pink trails";
 * evil.death_bringer.jpg): every blow leaves a hot-pink crescent (visualEffects spawnSlashArc) .radius m round and .band m wide across the man's
 * chest (.chest m up), tipped .tilt rad, alternate blows tipped the other way, fading over .seconds.
 */
const DEATH_SLASH = { white: new Color3(1.2, 0.25, 0.7), radius: 1.0, band: 0.2, tilt: 1.25, seconds: 0.45, chest: 1.0 };
/*
 * [S] 532 the Skeleton Giant's sword blow (audit 527 c.1: "the hit is a punch - TABS: a sword blow"; card Weapons Giant Stiffy Sword, a 2 s
 * overhead blade): every blow he lands leaves the arc the long blade cut, a bone-pale crescent (spawnSlashArc) .radius m round and .band m wide
 * standing upright in the plane from him to the man, centred .between of the way to the man and .up m over his feet, leant .tilt rad toward the
 * man so it falls from over the giant's head onto him, fading over .seconds.
 */
const GIANT_SLASH = { white: new Color3(1.15, 1.08, 0.95), radius: 1.7, band: 0.38, tilt: 0.55, seconds: 0.55, between: 0.45, up: 1.5 };
/*
 * [S] 493 the Void Monarch's sword burst (audit 489 c.1: "he summons two Shadow Walkers - TABS: a two-sword melee strike with a radius-2 burst"; card
 * Weapons "Void Monarch Sword ... explosion radius 2"; evil.void_monarch.jpg: pink-magenta void light): the Reaper's shockwave (visualEffects
 * spawnReaperBurst) in a hot-pink ring over a dark magenta dome .dome m across, run out to .radius m at the man.
 */
const MONARCH_BURST = { radius: 2, dome: 4, ring: new Color3(1.15, 0.2, 0.8), dark: new Color3(0.32, 0.03, 0.22) };
const THROWS_HELD_PROP = new Set(["javelin", "bomb", "stone", "potion"]);
/*
 * [S] planted full-draw loose (354; medieval.archer.jpg: feet set, bow arm out, string at the cheek as the arrow leaves; card shoot delay 1.2 s). A bowman here
 * does not loose at the decision with the bow at his hip: the draw (proceduralAnimation bow_draw_release) runs first and the arrow leaves the bow at its
 * release point (bowReleasesIn), from where the bow is then. Logged "throw" at the loose, as a held throw is.
 */
// [S] 409 ...and the ice archer (CONFIRM 405 b.3: "no bow visible and no draw in unit_viking.ice_archer_windup - TABS: bow vertical at arm's length, the
// ice arrow drawn to the chest"; viking.ice_archer.jpg): she loosed at the decision from her carry, so the shot showed her mid-stride with the bow low
// [S] 420 ...and the firework archer (audit 411 c.3: "the bow slung on her back while she runs - TABS: looses from a full draw with the rocket nocked";
// dynasty.firework_archer.jpg): she fired at the decision from her carry, so _release caught her mid-stride with the bow away
// [S] 443 ...and the skeleton archer (CONFIRM 442 b.1: "at the windup the bow stands upright behind the head - TABS: held out at the target, the string
// hand drawn back"): his Fire Arrow left at the decision, so the shot 150 ms before it caught his carry, never the draw
// [S] 467 the Poacher draws his stave before he looses (audit 457 poacher c.1: "the arrow leaves from the hat while the bow hangs at the hip - TABS: the arrow
// leaves the drawn bow"; card Poacher Bow warm-up 1 s, shoot delay 1 s)
const DRAWS_BEFORE_LOOSE = new Set(["medieval.archer", "viking.ice_archer", "dynasty.firework_archer", "spooky.skeleton_archer", "legacy.poacher"]);
// [S] the potionseller's potions splash men drunk instead of blowing up (342; ProjectileSystem DRUNK_SPLASH): drunk men stagger about, not fighting (DRUNK_WANDER)
const DRUNK_POTIONS = new Set(["farmer.potion_seller"]);
// A drunk man's wander: he reels off DRUNK_WANDER.reach m toward a heading that swings round at .swing rad/s from his own hashed start
const DRUNK_WANDER = { reach: 2.5, swing: 0.9 };
// Archers whose arrows carry a balloon: the man struck floats up under balloons (renaissance.balloon_archer; RuntimeUnit.floatOnBalloons)
const BALLOON_ARROWS = new Set(["renaissance.balloon_archer"]);
// Bowmen whose arrows fly with a red shaft and a large black broadhead (ProjectileSystem._dressBroadhead; medieval.archer.blue.png)
const BROADHEAD_ARROWS = new Set(["medieval.archer"]);
// [S] 385 bowmen who loose a snake: the nocked snake (ancientDress heldSnake) leaves the fist, and the arrow flies dressed as it (ProjectileSystem _dressSnake)
const SNAKE_ARROWS = new Set(["ancient.snake_archer"]);
// [S] 397 the Ice Archer's arrow: a pale ice shaft with a jagged ice head and a trail of frost (ProjectileSystem _dressIceArrow)
const ICE_ARROWS = new Set(["viking.ice_archer"]);
/** [S] 434 archers whose arrows fly burning (projectileSystem FIRE_ARROW) */
const FIRE_ARROWS = new Set(["spooky.skeleton_archer"]);
// [S] 519 Cupid's love arrows (projectileSystem _dressHeartArrow)
const HEART_ARROWS = new Set(["secret.cupid"]);
/** [S] 541 Artemis's sheaf: five arrows on one tick, nocks .nock m apart sideways and .lift m staggered, landing .land m apart across the man (_fireVolley). */
const ARTEMIS_FAN = { count: 5, nock: 0.28, lift: 0.12, land: 0.18 };
/** [S] 541 Ullr's thrown axe: its end-over-end turn (rad/s), the seconds until a new axe is back in his fist, its speed (m/s; card "projectile speed 25"). */
const ULLR_THROW = { tumble: 16, rearm: 0.8, speed: 25 };
/** [S] 519 a lovestruck man's kiss (card secret.cupid: "kiss them relentlessly, draining their hitpoints"): m to his friend, s between kisses, hp per s. */
const LOVE_KISS = { reach: 0.9, every: 0.5, drain: 4 };
/** [S] 536 a mushroomed man's turn on his friends: he closes to .reach m (his own reach up to .reachMax), a blow of .damage every .every s */
const SHROOM_TURN = { reach: 1.1, reachMax: 1.6, every: 1.0, damage: 12 };
/** [S] 536 the Solar Architect's Solar Maelstrom (spec at SimulationSystem._trySolarMaelstrom) */
const SOLAR_MAELSTROM = { near: 7, first: 0.5, cooldown: 12, radius: 3.5, damage: 20, push: 5, lift: 4, seconds: 3, tick: 0.5, heal: 0.04, pull: 7, inPush: 7, inLift: 3 };
/** [S] 539 Blackbeard's Cannon Barrage (spec at SimulationSystem._tryCannonBarrage) */
// 539.7b first .5 -> 0 (look: the barrage came on his second swing, his man already flung 6 m off frame; the first comes down beside him)
const CANNON_BARRAGE = { first: 0, cooldown: 8, balls: 8, every: 0.15, spread: 2.2, lean: 0.8, up: 14, drift: 2, damage: 45, splash: 1.4, push: 6 };
const STIFFY_FEAR = { units: new Set(["spooky.skeleton_warrior"]), every: 2, seconds: 3.5, reach: 4 };
// [S] 475 Pharaoh Kneel: the struck man and enemies within .radius (KNEEL_AURA's ring) kneel .seconds (RuntimeUnit.applyKneel)
const PHARAOH_KNEEL = { radius: 2.4, seconds: 3 };
const BURN_STATUS = { tick: 0.5, damage: 3, spread: 1.4, keep: 2 };
// [S] 535 the Necromancer skull's rot (SimulationSystem._stepNecroCurse): share of full health per tick, and its puff colour
const NECRO_CURSE = { tick: 0.5, rot: 0.1, smoke: new Color3(0.2, 0.42, 0.16) };
// [S] 537 the Necromancer's Gravestone Wall (see SimulationSystem._gravestoneWalls)
const NECRO_GRAVES = { first: 0.5, cooldown: 8, near: 4, ahead: 1.3, apart: 0.85, radius: 2.2, damage: 20, push: 6, lift: 4 };
// [S] 390 engines that fly the bolt they have loaded: a copy of the named node leaves the muzzle and the loaded one is gone until half the reload is past (vehicleBuilder ballistaLoadedBolt)
const LOADED_BOLTS: Record<string, string> = { "ancient.ballista": "ballistaLoadedBolt" };
/*
 * [S] 387 the snake comes down alive (card Characteristics: "After impact these snakes become units and move quickly, lunge at enemies to attack them ...
 * snakes will die after successfully biting twice, or after a 30 second lifetime"; critic 378: it stayed lodged in the man like an arrow). Where the
 * flying snake lands (ProjectileSystem.snakeLand) a ground snake of the same build (ancientDress buildSnake, .long m) lies on the turf, head toward the
 * nearest enemy, and slithers at .speed m/s, its body thrown in a travelling S (.wave rad/s, .waves bends along it, .sway m to a side at the tail, half
 * at the head). Within .reach m it lunges: head reared .rear rad, it darts .dash m/s for .lunge s and bites at the end for .bite damage, .rest s apart.
 * After .bites bites or .life s it goes in a smoke puff. Logged snake_land and snake_bite under the shooter. Not a roster unit: nothing targets it.
 * [S] 388: the ground snake its own long thin build (ancientDress buildGroundSnake, .long m), laid flat; each band thrown .sway m to a side by the S
 * and turned along the curve's slope, so the body lies in bends; the head on its neck held up, swinging with the front, reared .rear rad to lunge.
 */
const SNAKE_LIVE = { long: 2.0, speed: 3.2, wave: 7, waves: 1.4, sway: 0.24, reach: 0.8, rear: 0.45, dash: 4.5, lunge: 0.25, bite: 30, rest: 1.1, bites: 2, life: 30 };
type LiveSnake = { root: TransformNode; snake: GroundSnake; born: number; bites: number; restUntil: number; lungeUntil: number; phase: number };
/**
 * A firearm whose ball throws the man it hits (units/renaissance.musketeer, card Weapons: the musket's force is 1500, against a club's 20): a man the shot
 * leaves alive is knocked off his feet along its line and tumbles, as from a blast (RuntimeUnit.applyBlastLaunch), not merely flinched. Keyed by weaponHint, so
 * every "musket" (wild_west.deadeye too) throws its man. speed, lift: m/s of the throw.
 */
const GUN_FLING: Record<string, { speed: number; lift: number }> = { musket: { speed: 4.5, lift: 5.5 } };
/**
 * [S] the harvester's sweep throws its man (345; card Characteristics "sweep through groups of fragile units at once, with even enough power to send one
 * into the air", Weapons: the scythe's force is 65): a man the level cut (proceduralAnimation SCYTHE_SWEEP) leaves alive is thrown off his feet, out
 * across the cut toward the harvester's off side and away from him, as from a blast (RuntimeUnit.applyBlastLaunch). across: share of the throw sideways;
 * speed, lift: m/s.
 */
/** [S] 417 a staff blow that throws the man back off it: .speed m/s away from the striker and .lift up (dynasty.monk card: force 250). */
// [S] 418 the Monkey King's staff (card Weapons force 1500, six times the monk's 250) sends the man flying several metres
const BO_SHOVE: Record<string, { speed: number; lift: number }> = { "dynasty.monk": { speed: 4.2, lift: 2.4 }, "dynasty.monkey_king": { speed: 8.5, lift: 5.5 } };
const SCYTHE_FLING: Record<string, { across: number; speed: number; lift: number }> = { "farmer.harvester": { across: 0.6, speed: 3.2, lift: 5 } };
// The bone mage's leaf whirl (units/tribal.bone_mage, tribal.bone_mage.png: leaves swirling low among the spikes at the man, none over the caster's head): it rises
// at the row's near end this high off the turf, runs at the man this high up him, on an arc this high per metre (near flat, under the spike tips)
const LEAF_ROW = { lift: 0.6, at: 0.7, arc: 0.03 };
// A swordcaster's sword hangs over his head this long, point on the man, before it flies (units/spooky.swordcaster: swords float round him)
const SWORD_HOVER = 0.7;
// A ring sword rises to this far over the caster's head before it flies ([S] ring-sword-rises)
const SWORD_RISE_OVER = 0.25;

/** The head (orb) of the staff in a caster's hand, where his own missile is lit (vfx tier 3, units/legacy.wizard); null when he holds no staff. */
function staffHeadOf(unit: RuntimeUnit): TransformNode | null {
  for (const hand of [unit.body.rightHand, unit.body.leftHand]) {
    const orb = hand?.getChildMeshes(false).find((m) => m.name === "orb" && m.isEnabled());
    if (orb) return orb;
  }
  return null;
}

/** The muzzle of the harpoon gun in a harpooner's hand (vfx tier 3, units/pirate.harpooner): the harpoon leaves from it on its rope; null with no gun. */
function harpoonMuzzleOf(unit: RuntimeUnit): TransformNode | null {
  for (const hand of [unit.body.rightHand, unit.body.leftHand]) {
    const muzzle = hand?.getDescendants(false, (n) => n.name === HARPOON_MUZZLE)[0];
    if (muzzle instanceof TransformNode && muzzle.isEnabled()) return muzzle;
  }
  return null;
}

/*
 * [S] 462 a short legacy shooter's missile leaves what shoots it (audit 457 poacher c.1: "the shaft leaves from the hat at head height while the bow
 * hangs at the hip - TABS: the arrow leaves the drawn bow"; blowdarter c.1: "the shaft leaves from the hat and no pipe is at the mouth - TABS: the
 * dart leaves the blowgun"). The default origin is a fixed 1 m over the feet: on a man a little over 1 m tall that is his hat. HAND_LAUNCH: "bow"
 * launches from the fist that holds the bow (the hand with a mesh named bow* under it), "mouth" from the front of the head (.mouthAhead of its depth
 * ahead of its middle, .mouthDrop of its height under it), both at their world height (originLift 0).
 */
// 462: the blowdarter's "mouth" was rejected (critic 462: the dart still left at crown height, the pipe on his back): his launch waits for the blowgun hold
// [S] 463/464 now he holds the blowgun at his mouth (proceduralAnimation BLOWGUN_HOLD): "muzzle" launches from the blowgun's tip, its "blowgunMuzzle" node
// [S] 502 the Chu Ko Nu's bolts leave his repeating crossbow's nose ("rcbMuzzle", propBuilder REPEATING_CROSSBOW), not the face (audit 500 c.1)
// [S] 524 the Ice Mage's icicle leaves the open palm that throws it ("palm": RuntimeUnit.startIceThrow poses the arm and names the hand; audit 515 c.2)
const HAND_LAUNCH: Record<string, "bow" | "mouth" | "muzzle" | "barrel" | "palm"> = { "legacy.poacher": "bow", "legacy.blowdarter": "muzzle", "legacy.barrel_roller": "barrel", "secret.chu_ko_nu": "muzzle", "secret.ice_mage": "palm" };
/*
 * [S] 468 the Barrel Roller rolls his barrel into the enemy (audit 457 c.2: "the blast arrives by a throw from 6 m while he stands - TABS: he walks the
 * barrel forward under his feet into the enemy"; card Appearance "to move towards his destination, the Barrel Roller walks forward"). He closes on the
 * barrel to melee reach (rosterManifest engageRangeOverride), and his barrel shot leaves from the ridden barrel's core ("barrel": the barrelBody mesh)
 * and runs along the ground at the man, an arc of BARREL_ROLL.arc of the distance, bursting where it meets him.
 */
const BARREL_ROLL = { arc: 0.02, ridden: true };
/*
 * [S] 469 the barrel he rides is the bomb (critic 468 c.2: "the rolled bomb is a copy spawned at his barrel's core; the barrel he rides stays intact under
 * his feet, so _release shows two barrels at once - TABS: the barrel he rides is the one that rolls into the man and explodes"). BARREL_ROLL.ridden: when
 * the shot rolls, his barrelBody (staves and hoops under it) is hidden and his lift drops (proceduralAnimation _rideBarrel reads it), so he stands on the
 * ground; a fresh barrel is under him again when his next blow is ready (_barrelOut, checked each decision).
 */
const MOUTH_LAUNCH = { mouthAhead: 1.1, mouthDrop: 0.3 };
// [S] 502 the Shouter's shockwave (spec at _tryShout)
const SHOUT = { reach: 9, half: 0.55, speed: 10, lift: 4.5, large: 0.6, giant: 0.3 };
// [S] 503 the Fan Bearer's gust (spec at _tryFanBlow)
const FAN_BLOW = { reach: 10, half: 0.32, push: 10 };
// [S] 503 the Bomb on a Stick's blast on the blow (spec at _tryBombSmack): radius m, burst scale, push times the blow's, burst height on the man (m)
const BOMB_SMACK = { radius: 3.5, scale: 0.7, push: 1.6, chest: 1 };

/** Where a HAND_LAUNCH shooter's missile leaves: his bow fist or his mouth, in world space; null when he has neither. */
function handLaunchPoint(unit: RuntimeUnit): Vector3 | null {
  const how = HAND_LAUNCH[unit.definition.id];
  if (!how) return null;
  const b = unit.body;
  if (how === "bow") {
    const hand = [b.leftHand, b.rightHand].find((h) => h?.getDescendants(false, (n) => /^bow/i.test(n.name)).length);
    if (!hand) return null;
    worldMatrixChain(hand);
    return hand.getAbsolutePosition().clone();
  }
  if (how === "barrel") {
    const core = b.root.getDescendants(false, (n) => n.name === "barrelBody")[0] as TransformNode | undefined;
    if (!core) return null;
    worldMatrixChain(core);
    return core.getAbsolutePosition().clone();
  }
  if (how === "palm") {
    const hand = unit.startIceThrow();
    if (!hand) return null;
    worldMatrixChain(hand);
    return hand.getAbsolutePosition().clone();
  }
  if (how === "muzzle") {
    const muzzle = b.root.getDescendants(false, (n) => n.name === "blowgunMuzzle" || n.name === "rcbMuzzle")[0] as TransformNode | undefined;
    if (!muzzle) return null;
    worldMatrixChain(muzzle);
    return muzzle.getAbsolutePosition().clone();
  }
  const head = b.headMesh;
  if (!head) return null;
  worldMatrixChain(head);
  const box = head.getBoundingInfo().boundingBox;
  const local = box.center.add(new Vector3(0, -box.extendSize.y * MOUTH_LAUNCH.mouthDrop, box.extendSize.z * MOUTH_LAUNCH.mouthAhead));
  return Vector3.TransformCoordinates(local, head.getWorldMatrix());
}

/** Zeus's thrown bolt is back in his fist this share of the cooldown after the throw (384; until then the fist is empty). */
const ZEUS_REARM = 0.6;
/*
 * [S] 474 the Super Peasant's flight (audit 468 super_peasant c.1: "flight missing: he strides on the ground - TABS: he flies flat out at high speed in a
 * superman pose"; legacy.super_peasant.jpg, card Characteristics "They fly at extremely high speeds"): closing from beyond his reach to .reach of it he
 * flies at the man at .speed m/s (at least .minDur s), laid flat out (proceduralAnimation setSuperman), .lift m up at the middle of the line (the arc's
 * peak reached by 1/.rise of the way), set down short of the man; logged "flight" at .logAt of the way, where the pose and the height read.
 */
const SUPER_FLIGHT = { reach: 9, speed: 13, minDur: 0.45, lift: 0.8, // 474b: 1.3 lifted him out of the top of the release frame
  rise: 1.0, logAt: 0.4 };
// [S] 473 Thor's sky bolt (spec at its use in the iconic_thor ability): from .high m over the man, .forks thinner forks .spread m off it
const THOR_SKY_BOLT = { high: 11, forks: 2, spread: 1.6 };
// [S] 386 Zeus's lightning chain (card Characteristics: the thunderbolt "will conduct to nearby units"): from the struck man the bolt hops to the nearest
// living enemy within .reach m of the last man it reached, up to .links hops, each a chain arc (visualEffects spawnZeusBolt chain) and .share of the
// bolt's damage to the man it reaches, logged once as "lightning_chain"
const ZEUS_CHAIN = { links: 3, reach: 2.2, share: 0.35 };

function isFirearmUnit(unit: RuntimeUnit): boolean {
  const hint = unit.definition.weaponHint ?? "";
  return hint === "flintlock" || hint === "musket" || hint === "blunderbuss" || hint === "cannon_hand";
}

function getBehaviorPreset(unit: RuntimeUnit): string {
  return unit.definition.behaviorPreset ?? "default";
}

function originLiftForSource(source: "vehicle-socket" | "linked-role" | "parent"): number {
  return source === "vehicle-socket" ? 0 : 1;
}

function muzzleScaleForProjectile(shape: ProjectileShape): number {
  switch (shape) {
    case "shell": return 1.8;
    case "bomb": case "pumpkin": return 1.4;
    case "rocket_arrow": return 0.65;
    case "bolt": return 0.7;
    case "gatling_bullet": return 0.55;
    case "davinci_ball": return 0.8;
    default: return 1;
  }
}

function shouldSpawnProjectileMuzzleFx(shape: ProjectileShape): boolean {
  return shape === "shell" || shape === "bomb" || shape === "pumpkin" || shape === "rocket_arrow" || shape === "bolt" || shape === "gatling_bullet" || shape === "davinci_ball";
}

function countAliveSpawnedChildren(attacker: RuntimeUnit): number {
  return attacker.linkedChildren.filter((child) => !child.isDead && child.linkedRelation === "spawned-child").length;
}

// How far ahead of a front-rank carrier his board stands against an enemy (see _resolveLivingCollisions): the board plane's reach plus its thickness.
const SHIELD_BOARD_STANDOFF = 0.46;

// The shield wall as one body (see the spec at SimulationSystem._holdShieldFrames): the most a step puts a carrier back toward his slot. At 60 steps a second
// that is 9 m/s, more than any shove or march moves a man in a step, so on his feet he is on his slot.
const SHIELD_SLOT_SNAP = 0.15;
// Rear-rank men are kept at least this share of a clear body gap behind the man ahead (see _keepRanksDeep).
const RANK_DEPTH_SHARE = 0.95;
// An ally who is not in the wall stands at least this much more than a body behind its front rank (clear of the boards, see _keepRanksDeep).
const WALL_QUEUE_GAP = 0.25;
// A clubber a rank back (see _allyBetween): how much further than a front man's strike reach he strikes from, over an ally within this lane of his line.
const REAR_RANK_REACH = 1.4;
// How far past shoulder contact a pressing clubber may still be when he brings his blow down (see _processUnitDecision).
const BLOW_CONTACT_SLACK = 0.3;
// How far past body contact an open-field striker stands to swing (see the strike stand-off in _processUnitDecision).
const STRIKE_STAND = 0.45;
// Two plain men both coming on at least this fast (m/s, along the line between them) meet without knocking each other down (see the collision pass).
const MEET_CLOSING = 0.5;
const REAR_RANK_LANE = 0.7;
// How long a landed heavy blow dwells on the struck man, club head on him, before he is thrown off his feet (see _pendingLaunches).
const BLOW_DWELL = 0.12;
// one-blow-per-man: the longest beat a striker takes, once at his man, before his first blow (each man his own share of it, RuntimeUnit.vary)
const STRIKE_LAG = 0.45;
// [S] 454 a levelled gun's warm-up (card Winchester warm-up 1 s; CONFIRM 453 deadeye c.1: "fired from the carry pose"): in range of her man she holds the
// rifle level (readyAim) for GUN_WARMUP.warmup s before the first shot, so it leaves the levelled muzzle, not the shoulder carry; out of range it resets
const GUN_WARMUP = { units: new Set(["wild_west.deadeye"]), warmup: 1 };
/*
 * Mammoth Charge (tribal.mammoth card: "they will charge at enemy units and trample anyone who comes close"; tribal.mammoth.jpg): an enemy between
 * MAMMOTH_CHARGE.from and .reach metres past its reach sets the mammoth running at it, .speed times its walk for up to .seconds, a dust cloud kicked up at
 * its feet. It does not stop at reach to swing: it runs on through the man to .overrun metres past him, and every enemy its body meets on the way
 * (within .contact of body contact, ahead of its middle) is trampled: .damage, and flung aside off its line and up (applyBlastLaunch .fling sideways
 * and forward, .lift up), each man once per charge. Trampling the man it charged ends the run; then it fights at reach as before. .cooldown s between charges.
 */
/*
 * [S] Halfling Jump (344; card Weapons "range 4, 8 second cooldown", Characteristics "the Halfling will jump into enemy unit when up-close"): a man
 * closing on his enemy, once he is between HALFLING_JUMP.from and .reach metres past his striking distance, springs off the ground at .rise m/s and
 * comes down .short metres short of the man's middle, onto him (RuntimeUnit.leap), at most once every .cooldown seconds; harmless, logged "leap".
 */
// The Healer's beam and gilding last this share of his heal cooldown, so one beam meets the next (HEAL_BEAM in visualEffects, GILD in runtimeUnit)
const HEALER_BEAM_SHARE = 0.95;
/** Refresh a node's world matrix from the root down: world matrices only refresh on render, and a capture replays a frame in one call. */
function worldMatrixChain(node: TransformNode): void {
  const chain: TransformNode[] = [];
  for (let n: TransformNode | null = node; n; n = n.parent as TransformNode | null) chain.unshift(n);
  for (const n of chain) n.computeWorldMatrix(true);
}
const HALFLING_JUMP = { from: 0.6, reach: 4, cooldown: 8, rise: 6.5, short: 0.3 };
/**
 * [S] Halfling Grab (345; card Characteristics: he latches onto the man and is dragged along, even after the man dies; farmer.halfling.png): the halfling's
 * first blow that lands takes hold. From then he is carried on the man: pinned every step on the man's front, HALFLING_CLING.round rad round from dead
 * ahead to one side (his own hashed side), .off of the man's body radius out from his middle and .up of the man's height off the ground, facing him, out of
 * the crowd solver, wherever the man is pushed, walks or is thrown. He keeps hold of a dead man for .afterDeath s, then drops off. Logged "grab".
 */
const HALFLING_CLING = { round: 0.55, off: 0.85, up: 0.32, afterDeath: 2.5 };
/**
 * [S] 444 the Vampire Bite as a latch (434 vampire c.2: "bite in unit_spooky.vampire_release is an overhead swing of a star - TABS: latches onto the
 * enemy and sucks blood"; card Characteristics "They suck the enemy's blood, disregarding the exact place that they are drawing blood from or if another
 * Unit is beating them up"). His attack is never a swing: when it comes up he jumps onto the man and hangs on him, carried wherever the man goes, out of
 * the crowd solver: pinned each step VAMPIRE_LATCH.round rad round from the man's front to his own hashed side, .off of the man's body radius out from his
 * middle and .up of the man's height off the ground, so his head rides at the man's neck and shoulder, his heading held on the man. From .first s on he
 * drinks every .every s (the attack's damage spread over its cooldown), each draught a hit in the hit log, blood welling out of the man's neck the whole
 * time (visualEffects BLOOD_DRAIN). He drops off .afterDeath s after the man dies, or when he dies. Logged "bite" at the jump.
 */
/**
 * [S] 444 Bullet Rain (audit 444 gunslinger c.1: "missing: bullets fired upward that rain back down"; card Characteristics "shoots bullets upwards,
 * which fall back down onto units, as if it's raining bullets", Weapons count 3, per projectile .4 s, explosion radius 2.5; wild_west.gunslinger.jpg:
 * both arms straight up, the revolvers firing into the sky, smoke over his head). His attack raises both arms straight up (ProceduralAnimator.gunsUp,
 * for .hold s); .raise s in, with the arms up, every gun fires straight up (a flash and puff at each muzzle, a streak .up m into the sky; logged
 * "burst"); .fall s later the first of .count bullets comes down on the man, one every .every s, each landing within .spread m of where he stands as it
 * falls: a streak from .up m over the spot to the ground, then a small blast (.blast) that deals the attack's damage out to .splash m.
 */
const BULLET_RAIN = { units: new Set(["wild_west.gunslinger"]), hold: 1.1, raise: 0.3, up: 22, fall: 0.55, count: 3, every: 0.4, spread: 0.9, splash: 2.5, blast: 0.6 };
/**
 * [S] 447 Quick Draw's rapid fire (critic 446 quick_draw c.2: "both pistols fire one burst with a big smoke puff - TABS: rapid one-handed revolver
 * shots, arm extended"; card Weapons Revolver Quickdraw: cooldown 0.2 s, count 1, projectile speed 100; wild_west.quick_draw.jpg: one arm out, one
 * revolver, no smoke cloud). An attack is .shots single shots .every s apart, the first at the decision, each from the one revolver's mouth: a small
 * flash and puff (.flash of a pistol's) and a ball streaking to the man's chest (spawnPistolShot), each dealing 1/.shots of the attack's harm (times
 * .damage) and push (times .push). It replaces the one-tick burst whose six stacked muzzle clouds read as one white ball. Logged "burst" at the first.
 */
/**
 * [S] 447 the Miner's exploding pick (critic 446 miner c.1: "AoE blast: target knocked back, no burst at the impact - TABS: the pick strike explodes,
 * radius 2.5, throws rocks"; card Weapons Pick Axe: explosion radius 2.5; Characteristics "deals AoE damage with its pick"; wild_west.miner.png).
 * When his pick comes down on the man (the landed blow), it blows up there: a fireball with dark rock clods thrown clear (spawnExplosionBurst at
 * .scale) on the ground where the man stands, and the blow's harm reaches every foe within .radius m. Logged "blast" at the blow.
 */
// [P] 448 scale .85 -> .5: the burst whited out half the _flight frame and the miner (critic 447 c defect 1)
const MINER_BLAST = { units: new Set(["wild_west.miner"]), radius: 2.5, scale: 0.5 };
/*
 * [S] 511 the Chu Ko Nu's bolt train (card secret.chu_ko_nu Weapons: count 5, shoot delay per projectile .25 s, speed 30; audit 510 c.1 "bolt train
 * crosses the air above the visible weapon"): each attack lets go one bolt every .every s off the crossbow's rail (HAND_LAUNCH "muzzle"), each from
 * where the rail is at its own moment and with no scatter, so the train runs out of the stock; he keeps turned on the man while it runs. Logged
 * "burst" at the first bolt.
 */
const RCB_VOLLEY = { units: new Set(["secret.chu_ko_nu"]), every: 0.25 };
const QUICK_FAN = { units: new Set(["wild_west.quick_draw"]), shots: 6, every: 0.2, flash: 0.6, damage: 1.18, push: 1.2 };
const VAMPIRE_LATCH = { round: 0.7, off: 0.75, up: 0.2, first: 0.3, every: 0.35, afterDeath: 0.5, blood: 12 };
/**
 * [S] 445 the Lasso's grab (audit 444 lasso c.1: "missing: lasso throw that grabs and drags the target"; card Characteristics "uses a lasso to grab
 * units and drag them around; then run them over with its horse"). His attack is never a jab: he throws the rope (wildWestDress LASSO_ROPE) from his
 * fist onto the man, its loop round the man's chest, and hauls him in: the man is held limp LASSO_DRAG.low m off the ground and pulled along the
 * ground toward the horse at .pull m/s, the rope taut from the rider's fist to his chest; from .first s on, every .every s the drag is a hit (the
 * attack's damage spread over its cooldown). When the man is within .under of the horse's body radius of it, or .most s on, the horse runs him over:
 * a blow of .trample times the attack's damage that throws him .throwUp m/s up and .throwOut m/s on along the haul, and the rope is gone. Logged
 * "lasso" at the throw.
 */
/**
 * [S] 445 the Cactus Explosion (audit 444 cactus c.1: "missing: Cactus Explosion needle burst when attacked"; card ability "explode needles in every
 * direction when attacked", Characteristics "it shoots spikes at enemy units"). Whenever a cactus loses health (any blow, missile or burn), at most once
 * every CACTUS_EXPLOSION.cooldown s, needles burst out of his middle in every direction (visualEffects CACTUS_NEEDLES) and every foe within .radius m of
 * him takes .damage and a push .push out from him. Logged "needles".
 */
const CACTUS_EXPLOSION = { units: new Set(["wild_west.cactus"]), cooldown: 1.2, radius: 3, damage: 20, push: 3 };
// [S] 529 Vlad Impale (spec at _tryVladImpale)
const VLAD_IMPALE = { cooldown: 7, reach: 7, start: 1.1, step: 0.75, width: 0.85, damage: 1.2, lift: 9, push: 2.5 };
// [S] 530 Banshee Scream (spec at _tryBansheeScream)
// [S] 531 Giant Fear (spec at _tryGiantFear)
const GIANT_FEAR = { cooldown: 8, radius: 6, seconds: 4, dome: 3, ring: new Color3(0.7, 1.3, 0.85), dark: new Color3(0.06, 0.22, 0.12) };
// [S] 535 the Banshee's hand curse (spec at SimulationSystem._tryBansheeCurse): stream s, curse s, aim height on the man, stream colours
const BANSHEE_CURSE = { stream: 0.55, seconds: 5, chest: 1.0, look: { white: new Color3(0.8, 0.95, 1.4), yellow: new Color3(0.25, 0.55, 1.3), near: 0.14, far: 0.4, farPer: 0.06 } };
const BANSHEE_SCREAM = { cooldown: 10, radius: 4, damage: 45, lift: 7, push: 6, dome: 4, ring: new Color3(0.55, 0.9, 1.4), dark: new Color3(0.05, 0.16, 0.42) };
const LASSO_DRAG = { units: new Set(["wild_west.lasso"]), low: 0.12, pull: 1.4, first: 0.3, every: 0.35, under: 0.6, most: 2.4, trample: 1.5, throwUp: 5, throwOut: 4 };
/*
 * [S] 442 Reaper impale (audit 434 reaper c.2: "missing: tendrils impaling and hanging a weak unit"; card Characteristics: "Their tentacles will impale
 * any weak Units and hang them as an effigy, and will continuously impale the weakling"; spooky.reaper.jpg: a knight hangs high beside his shoulder on a
 * tendril). A blow of his on a man whose max health is under .weak of his own does not cut: a tendril (spookyDress reaperSpear) runs from his upper back,
 * .rootUp of his height up and .rootBack behind, through the man's middle and .through of the man's height past him, and the man is lifted and hung, feet
 * .up of the Reaper's height (his head top at the stab) off the ground, .side of it out to his off side and .back behind, limp, facing him, stabbed again every .every s for .bite of
 * his max health. Dead, he hangs on .afterDeath s and drops. One man per Reaper. Logged "impale" (the capture's ability pair).
 * [S] 443 (critic 442 c.3: "hangs at chest height in front of the Reaper, against his sleeve - TABS: high beside his shoulder, head above the hood"):
 * hung higher and further out (up .6 -> .8, side .3 -> .45), and the Reaper no longer takes the man on his own tendril for his target
 * (_selectEnemyTarget): he had turned to face him and so swung the effigy round in front of his chest. The tendril is thicker (REAPER_SPEAR).
 */
const REAPER_IMPALE = { units: new Set(["spooky.reaper"]), weak: 0.15, up: 0.8, side: 0.45, back: 0.1, rootUp: 0.66, rootBack: 0.08, through: 0.3, every: 0.6, bite: 0.18, afterDeath: 2.5 };
/*
 * [S] the charge seen (363; critic 360: "same pose and place, no lunge, no dust"; tribal.mammoth.jpg): every MAMMOTH_DUST.every s of the run a dust puff
 * (sprite discs .size times the kick dust) goes up at a pair of its feet, alternating front-left/back-right and front-right/back-left (feet given as [ahead, across] in body radii), and the animator
 * drops its head into the run (ProceduralAnimator.setCharging, CHARGE_POSE).
 */
const MAMMOTH_DUST = { every: 0.12, size: 1.3, feet: [[[0.75, -0.5], [-0.75, 0.5]], [[0.75, 0.5], [-0.75, -0.5]]] as [number, number][][] };
const MAMMOTH_CHARGE = { from: 2, reach: 14, speed: 2.2, seconds: 2.5, overrun: 3, contact: 0.5, damage: 30, fling: 5, lift: 6, cooldown: 6, through: false, log: true };
/*
 * [S] Wheelbarrow ram (348; card Characteristics "It will ram and run over enemy units ... extremely fast speed ... running over units deal extremely low
 * damage"): the mammoth's charge on the cart, driven through. An enemy WHEELBARROW_RAM.from to .reach metres past its reach sets the cart rolling at him at
 * .speed times its pace; every enemy its body meets ahead of its middle is run over (.damage, flung aside and up .fling/.lift), each once per run. Running
 * over its own man does not stop it: it drives on to .overrun metres past where he stood, then turns; .cooldown s between runs, so it keeps ramming
 * back through the fight. Logged "trample" at each man run over (not "charge" at the start).
 */
const WHEELBARROW_RAM = { from: 0.6, reach: 16, speed: 1.7, seconds: 3, overrun: 4, contact: 0.35, damage: 6, fling: 4.5, lift: 4, cooldown: 2.2, through: true, log: false };
/*
 * [S] Knight Charge (351; card Weapons "Knight Charge: damage 20; cooldown 5 s; range 2.5; force 2000", Characteristics "Upon at close range, the Knight
 * will charge in and attack"): the mammoth's charge, short. An enemy KNIGHT_CHARGE.from to .reach metres past his reach sets the knight dashing at him at
 * .speed times his pace for up to .seconds; the man he meets is battered aside and up hard (.fling/.lift) for a little .damage, which ends the dash, and he
 * fights on with sword and shield. .cooldown s between charges. Logged "charge" at the start and "trample" at the hit.
 */
const KNIGHT_CHARGE = { from: 0.4, reach: 2.5, speed: 2.6, seconds: 1.0, overrun: 0.5, contact: 0.3, damage: 5, fling: 6, lift: 3.5, cooldown: 5, through: false, log: true };
/*
 * [S] the jouster's canter charge (369; card Characteristics "can trample smaller units under hoof ... the lance rapidly does damage to enemies it's in
 * contact with ... shockwaves wherever they canter ... within their 2 radius"; renaissance.jouster.png: the horses canter into each other, lances level).
 * An enemy JOUSTER_CHARGE.from to .reach m past his reach sets him cantering at the man at .speed times his pace (the horse's run gait, HORSE_GAIT) and
 * on through him .overrun m; the man he meets takes the lance (his plain attack, if it is ready) and every enemy within .contact m of the horse's hide
 * ahead of its middle is trampled (.damage, flung .fling/.lift). .cooldown s between runs. Logged "charge" at the start and "trample" at each man.
 */
const JOUSTER_CHARGE = { from: 1.5, reach: 16, speed: 1.5, seconds: 3.5, overrun: 4, contact: 1.0, damage: 20, fling: 4, lift: 2.5, cooldown: 3, through: true, log: true };
/*
 * [S] 530 the Cavalry's charge (audit 527 c.1; card Characteristics "Sharing the Jouster Horse's ability to create shockwaves wherever they canter
 * ... When engaging, the Cavalry Horse will pull back and forcefully charge into enemy forces, disrupting their formation"). An enemy CAVALRY_CHARGE
 * .from to .reach m past his reach first makes the horse pull back: CAVALRY_WAVE.pull s backing off him, facing him (logged "pull_back"); then the
 * jouster's run at .speed on through him .overrun m, trampling (.contact, .damage, .fling/.lift) and spearing the man. While it runs, every
 * CAVALRY_WAVE.every s a hoof shockwave goes out under the horse, .ahead of its radius before its middle: a dust ring (TRAMPLE_RING) .radius m
 * across, every enemy inside it hurt .damage and flung .fling/.lift out from it, logged "shockwave". .cooldown s between runs.
 */
const CAVALRY_CHARGE = { from: 1.2, reach: 14, speed: 1.6, seconds: 3.2, overrun: 3.5, contact: 0.9, damage: 30, fling: 5, lift: 2.5, cooldown: 4, through: true, log: true };
const CAVALRY_WAVE = { pull: 0.7, back: 1.0, every: 0.35, ahead: 0.6, radius: 2, damage: 12, fling: 3.5, lift: 2.2 };
/*
 * [S] Minotaur Charge (378; card Characteristics "It attacks by charging at its opponents ... If hit with a projectile, it will charge sooner", ability
 * "charges, headbutting the enemy"; ancient.minotaur.png: head down, horns first, men flung off him). The mammoth's charge on two legs: an enemy
 * MINOTAUR_CHARGE.from to .reach m past his reach sets him sprinting at the man at .speed times his pace, head down (BULL_CHARGE pose); the man he
 * meets is butted aside and up hard (.fling/.lift) for .damage, which ends the run, and he fights on with his fists. .cooldown s between charges.
 * Logged "charge" at the start and "trample" at the hit.
 */
const MINOTAUR_CHARGE = { from: 1.5, reach: 14, speed: 2.3, seconds: 2.2, overrun: 1, contact: 0.4, damage: 30, fling: 7, lift: 5, cooldown: 6, through: false, log: true };
/*
 * [S] 499 the Death Bringer's charge (card Characteristics: "brings death to all by charging at enemy units and cutting through all of them with their
 * two red hot tonfa blades in a swift fashion"; audit 489 c.3: "no dash through the enemy line"). A man .from to .reach m past his reach sets him running
 * at him at .speed times his pace (he is 1.75x already) for up to .seconds s, and through: on .overrun m past where the man stood. Every enemy his body
 * meets on the way (.contact m of slack) is cut once in passing: a warglaive swing (.swing s), .damage (the low end of the blade's 95-190), a short
 * shove aside (.fling, .lift), the pink DEATH_SLASH trail across him, and the cut is logged as a blow (hit log) and "charge_cut". .cooldown s between runs.
 */
const DEATH_CHARGE = { from: 1.5, reach: 14, speed: 2.4, seconds: 1.6, overrun: 3, contact: 0.7, damage: 95, fling: 3.5, lift: 2, cooldown: 5, through: true, log: true, swing: 0.3 };
/*
 * [S] 520 the Raptor Rider's hit-and-run (audit 515 c.2: "the raptor runs the rider into the target (hit-and-run); ours has the mount static while the
 * rider thrusts from a standing pose"; card Characteristics "taking advantage of their steed's speed to conduct hit-and-run tactics ... They can still
 * trample units"; secret.raptor_rider.jpg). The jouster's run on the raptor: a man RAPTOR_CHARGE.from to .reach m past his reach sets the raptor running
 * at him at .speed times its pace (its legs striding, RuntimeUnit._tendRaptorGait) and on through him .overrun m; the man it meets takes the rider's
 * spear (his plain attack, if ready), and every enemy within .contact m of its body ahead of its middle is trampled (.damage, flung .fling/.lift).
 * Then it turns and comes again, .cooldown s between runs. Logged "charge" at the start and "trample" at each man.
 */
/** [S] 520 the Infernal Whip's lash (spec at _tryWhipLash). */
const WHIP_LASH = { out: 0.22, hold: 0.3, back: 0.35, radius: 1.25 };
/** [S] 520 the Present Elf's thrown present (spec at _tryPresentThrow). */
const PRESENT_THROW = { speed: 13.5, apex: 1.4, spin: 6, radius: 1, open: 3, rearm: 12 };
/** [S] 520 the Bank Robbers' safe hurl (spec at _trySafeHurl). */
// .fistReady: s after the safe leaves (the flank robber) or lands (the thrower) before the first punch (526)
const SAFE_HURL = { speed: 9, apex: 1.6, spin: 4, radius: 5, damage: 3, edge: 0.5, push: 6, lift: 4, lie: 6, sink: 3, cashInterval: 0.08, fistReady: 0.5 };
const RAPTOR_CHARGE = { from: 1.2, reach: 14, speed: 1.7, seconds: 3, overrun: 4, contact: 0.6, damage: 12, fling: 4, lift: 3, cooldown: 2.5, through: true, log: true };
// [S] 525 (c.1) the raptor's run throws small trample explosions under its feet wherever it moves (card Characteristics "an ability that creates
// explosions wherever they move"): every .every s of a run a burst (visualEffects spawnExplosionBurst, .size) on the ground .ahead body radii ahead of
// its middle and .side out, left and right foot in turn
const RAPTOR_STOMP = { every: 0.22, size: 0.42, ahead: 0.6, side: 0.45 };
/*
 * [S] 387 Big Headbutt (card Weapons "Big Headbutt: Ability - Melee; damage 30; cooldown 5 s; ... force 32500; explosion radius 4.5", Characteristics "a
 * headbutt ability like the Headbutter"; critic 378: missing). With a man within .within m past his reach and the butt ready (.cooldown s apart), he stops,
 * drops his head (the BULL_CHARGE pose) and drives it down over .windup s; at the blow the ground .ahead m before him bursts: every enemy within .radius m
 * takes .damage and is flung out from it and up (.fling/.lift m/s at its middle, .edge of that at the rim), a dust ring and kicked earth there. His head
 * comes back up .recover s later. The first is ready .cooldown s into the battle. Logged "headbutt" at the blow.
 */
const BIG_HEADBUTT = { within: 0.6, cooldown: 5, windup: 0.35, recover: 0.4, ahead: 0.9, radius: 4.5, damage: 30, fling: 9, lift: 7, edge: 0.35, lunge: 0 };
/*
 * [S] 394 the Headbutter's Headbutt (viking.headbutter.png, card Weapons "Headbutt (ability): the headbutt involves two separate attributes, one for the
 * headbutting movement and one for the damage on head impact"; Characteristics "they attack by ramming the opponent with their spiked helmets ... they can be
 * seen flipping over enemy units from time to time ... After the initial attack, they get up and attack by slapping their opponents, until the next headbutt
 * is ready"; critic 393: `release = melee hit at 1900 ms`, ability null, the pair an upright slap). With a man within .within m past his reach and the butt
 * ready (.cooldown s apart, and the first READY at the start: it is his opening attack), he drops his head and drives it into him over .windup s, stepping
 * .lunge m onto him: the man in front takes .damage and is flipped up and out from the buried head (.fling/.lift m/s at its middle, .edge of that at the rim).
 * The blow is logged "headbutt" and as a hit on the man, so his opening attack is the butt and the slaps are what follows. His head comes back up .recover s
 * later and he slaps until the next.
 * [S] 400 the ram is a dive (critic 399: "bowing about 90 at the waist with both feet planted, his head a forearm short of the foe; he never leaves the
 * vertical or ends on the ground"): instead of a step, he throws himself at the man with RuntimeUnit.leap over the .windup (rise .dive m/s, airtime
 * 2*rise/22 ~= the windup) with the animator's dive pose on from the first frame (proceduralAnimation DIVE), and at the blow he goes down in a short
 * forward sprawl (RuntimeUnit.headbuttSprawl) - the head-first dive, the cap's spike into him, then prone and up again.
 */
const HEADBUTT = { within: 0.55, cooldown: 6, windup: 0.28, recover: 0.5, ahead: 0.5, radius: 1.15, damage: 18, fling: 5, lift: 4.5, edge: 0.5, lunge: 0.5, dive: 3.0, reach: 0.75 };
/*
 * [S] 401 the ram reaches him and the blow frame keeps the dive (critic 400 c.1: "the spike stops short, one hand planted"): the leap now covers the
 * gap between them plus .reach, so the cap's spike lands inside the man rather than a forearm short, and the sprawl waits .sprawlDelay s after the blow -
 * the frame the hit is logged (and the release shot taken) still shows him flat out with both arms swept back, and the flip onto his face follows.
 */
const HEADBUTT_SPRAWL = { delay: 0.14 };
/*
 * [S] Super Jump (392; viking.berserker.jpg, card Weapons "Super Jump: Ability - Melee; leaps towards the enemy"; viking.berserker.red.png: caught in
 * the air, legs kicked, an axe wide in each hand). The berserker's jump_charge used to teleport him to the landing spot, so every shot caught him
 * standing; it is a thrown arc now (RuntimeUnit.leap, the halfling's Jump): .rise m/s up and the flat speed that carries him the leap's distance
 * under gravity (22) and the air drag (1.5/s), an apex of about 1.4 m. Logged "leap" at the take-off.
 */
const JUMP_CHARGE = { rise: 8, swoopRise: 4.5 };
/*
 * [S] the Longship hurl (396; viking.longship.jpg, card Characteristics "the Longship is thrown at the enemies ... the impact crushes them ... the oarsmen
 * disembark"; critic 391: only a melee hit). Instead of a swing, a longship whose man is within .reach m throws ITSELF at him: the hull leaps (RuntimeUnit.leap)
 * .rise m/s up with .short m left between it and him, its crew heaving it up overhead at the take-off, and it comes down in a crush of .radius m round where
 * it lands: every enemy in the ring takes the melee blow's damage at .crush of it, flung out at .fling and up at .lift, the first of them logged as the hit.
 * The crash logs "ship_crash"; the take-off logs "hurl" (the shot's ability pair). The crew step off the deck at the crash (vehicleBuilder landLongshipCrew).
 * .cooldown s before the next hurl. Dust: .dust.
 * [S] 402 the hull leaves the carriers' hands overhead (vehicleBuilder heaveLongshipCrew/flyLongshipHull): each flight step the carriers are held at
 * their take-off spots and the hull sinks from its carried height to the keel line over the first .sink of the flight's airtime (2 .rise / 22 s).
 */
const LONGSHIP_HURL = {
  reach: 5.5, short: 0.9, rise: 7.5, radius: 3.1, crush: 1.35, fling: 6.5, lift: 5, edge: 0.55, cooldown: 6, sink: 0.85,
  dust: new Color3(0.44, 0.33, 0.2),
};
/** [S] 403 the landed oarsmen's oar blows (spec at _chopOars). */
const LONGSHIP_OARS = { reach: 1.5, damage: 12, push: 1.2 };
type ChargeSpec = typeof MAMMOTH_CHARGE;
/*
 * [S] The wheelbarrow's riders fight (349; card Characteristics "the Apple Thrower throws apples and the Farmer stabs any enemy units up close ... combining
 * the Farmer and the Apple Thrower's attacks makes it capable to deal moderately high damage", farmer.wheelbarrow.png): every step, whether the cart is
 * ramming or turning, the Apple Thrower picks the nearest enemy WHEELBARROW_CREW.appleFrom to .appleReach m from the cart, cocks his arm and lets the apple go
 * (the one in his fist flies: a held "stone" on its lob) for .appleDamage, logged "throw"; a new apple .appleEvery s after the last. The Farmer stabs the
 * nearest enemy within .stabReach m of his own seat and ahead of the cart's side line, the blow landing at the end of his drive (.stabDamage, pushed off
 * .stabPush), logged "stab", at most every .stabEvery s. Poses and timing: vehicleBuilder CREW_FIGHT.
 */
const WHEELBARROW_CREW = { appleFrom: 2.5, appleReach: 14, appleEvery: 1.8, appleDamage: 40, applePush: 2, stabReach: 2.4, stabEvery: 1.1, stabDamage: 45, stabPush: 3 };
/*
 * [S] Farmer back-step (348; card Characteristics "They will also slowly back up while attacking, before swinging ahead with a much better stab"): once
 * his stab has gone home (FARMER_BACKSTEP.after s past it) and while his pitchfork is still cooling down, a farmer in reach of his man backs away from
 * him still facing him, at .pace of his walk, out to .margin short of his full reach; when the fork is ready again he lunges in with the next stab.
 */
const FARMER_BACKSTEP = { after: 0.95, pace: 0.5, margin: 0.15 };
/*
 * [S] Sarissa keeps pike distance (380; card Characteristics "They will also back up to maintain spearing distance"; critic 378: at 2.5 m he lunged in
 * and stood). Whenever his man is nearer than SARISSA_KEEP.near of his engage distance and he is not mid-thrust, the sarissa backs away from him still
 * facing him, pike levelled (proceduralAnimation PIKE_LEVEL holds while he walks), at .pace of his walk, and thrusts again from the edge of his reach.
 * Logged "backstep" as each back-off starts (the farmer's back-step branch, its own trigger).
 */
const SARISSA_KEEP = { near: 0.85, pace: 0.7 };
/*
 * [S] Hop back (369). The fencer (card Characteristics "thrusts forward to attack with its foil then steps back ... a dedicated back step"): .afterLand s
 * after his thrust lands on the man he hops straight back off him, still facing him, .dist m along the ground at .rise m/s up. The halberd (card
 * Characteristics "when an enemy unit gets too close, they can dash back for a better angle and strike"): a man come within .close m of his hide (hide to
 * hide) sends him dashing back .dist m in a low hop, then he chops from his pole's length. Never while his own blow is still coming down; .cooldown s
 * between hops. Logged .kind.
 */
const HOP_BACK: Record<string, { afterLand?: number; close?: number; dist: number; rise: number; cooldown: number; kind: string }> = {
  "renaissance.halberd": { close: 0.75, dist: 1.9, rise: 2.6, cooldown: 3, kind: "dash_back" },
  // [S] 464 the Boxer's Backwards Dodge (audit 457 boxer c.2: "missing: Backwards Dodge - TABS: backs away 1-5 on a 3 s cooldown"; card Weapons ability):
  // .afterLand s after a jab lands he hops back off the man, still facing him, .dist m, on the card's 3 s cooldown
  "legacy.boxer": { afterLand: 0.2, dist: 2.6, rise: 2.2, cooldown: 3, kind: "dodge" },
};
/*
 * [S] Fencer recover (370; card Characteristics "thrusts forward to attack with its foil then steps back"; renaissance.fencer.png; critic 369: the 369
 * hop fired 317 ms after the hit, read as a separate event, and the squire walked after him and closed the gap). The step back is part of the thrust: on
 * the very step his thrust lands (_landMeleeBlow) he is committed to a ground slide straight back off the man, facing him, FENCER_RECOVER.dist m in
 * .seconds s, fast at first and easing to a stop (speed falls linearly to zero), feet on the ground. The AI does not steer him while it runs, so nothing
 * the man does can cancel it. Logged .kind at the land. Replaces the fencer's HOP_BACK row.
 */
const FENCER_RECOVER = { dist: 1.8, seconds: 0.16, kind: "backstep" };
/*
 * [S] Fencer Dodge (371; card Abilities "evade most melee attacks by prompting the unit to hop or sidestep away", Characteristics "their AI will use it
 * to try and dodge close-range melee attacks"). When a man's swing goes up at a fencer (the blow is struck at him and still to come down), the fencer,
 * unless his own thrust is on its way or he is already sliding, sidesteps out of its arc: a ground slide FENCER_DODGE.dist m off to one side of the line
 * between them, turned back off the man by .back of the side step (1: half way between side and straight back), in .seconds s, fast at first and easing (the recover slide), facing the man throughout. His sides
 * alternate. .cooldown s between dodges. The blow he dodged was struck at where he stood: it comes down on air. Logged .kind.
 */
const JESTER_DODGE = { dist: 1.9, back: -0.34, seconds: 0.54, cooldown: 2.5, kind: "jester_dodge" };
const FENCER_DODGE = { dist: 2.2, back: 1.0, seconds: 0.22, cooldown: 2.5, kind: "dodge" };
/*
 * [S] 373 Painter Dodge (card Abilities "makes units instinctively sidestep whenever a projectile comes into their way"; Characteristics "They can dodge
 * incoming projectiles"). When a missile flying at a painter is PAINTER_DODGE.warn s from reaching him (ProjectileSystem.incomingAt), the painter, unless
 * he is already sliding or downed, sidesteps square to its line of flight: a ground slide .dist m in .seconds s on the fencer's slide (fast at first,
 * easing), facing his nearest foe; his sides alternate; .cooldown s between dodges. The missile stops following him and comes down where he stood
 * (ProjectileSystem.loseTarget). Logged .kind.
 */
/**
 * [S] 418 First-contact lunge (viking.brawler card Characteristics: "They also lunge on first contact, in an attempt to get the first hit"; audit c.1):
 * once per life, when his nearest foe is within FIRST_LUNGE.within m (and past .closest), he springs at him: a slide of up to .dist m (stopping
 * .stopShort m off the man) over .seconds, the axe swinging (.swing s); logged "lunge".
 */
const FIRST_LUNGE = { within: 3.2, closest: 1.2, dist: 2.4, stopShort: 0.8, seconds: 0.28, swing: 0.35, kind: "lunge" };
/**
 * [S] 417 Projectile Block (dynasty.samurai card: "deflect projectiles away from them with a bright slash using any weapon"; audit 411 c.1): a missile
 * flying at a samurai is cut out of the air once within SAMURAI_BLOCK.reach m of him (and .warn s of reaching him; ProjectileSystem.deflectAt): he turns
 * on it and swings (.flick s), and a white crescent slash (visualEffects SLASH_ARC) stands .ahead m before him at .chest m up; at most once every
 * .cooldown s; logged "block".
 */
/**
 * [S] 494 Sword Implosion (card evil.void_cultist Characteristics: "will occasionally cast a spell that sucks any surrounding enemy into one area, though
 * causing minimal damage"; audit 489 c.2: "a blue knight is summoned beside him and no enemy is pulled in"). It replaces his summon. .first s into the
 * fight and every .every s after, when an enemy stands within .reach m of him, the point is that nearest enemy: every enemy within .radius m of it is
 * hauled toward it (an impulse .pull times its distance, so the far ones fly farther and they meet, plus .lift up) and takes .minor damage; a dark
 * violet shell collapses on the point (visualEffects spawnImplosion). Logged as .kind.
 */
const CULTIST_IMPLOSION = { first: 1.2, every: 7, reach: 5, radius: 4.5, pull: 2.4, lift: 1.4, minor: 6, kind: "implosion" };
/**
 * [S] 494 the Exiled Sentinel's pavises (card Characteristics: "two protective shields that blocks most incoming projectiles"; evil.exiled_sentinel.jpg:
 * arrows stuck in the boards; audit 489 c.2). While his boards are out (not swapped for the axes, RuntimeUnit _tendSentinelAxes), a shaft that will
 * reach him within .warn s and comes at his front (its line within acos(.front) of his facing) stops in a board, stuck in its face, and does not hurt
 * him (projectileSystem catchOnBoards). Logged as .kind.
 */
const SENTINEL_CATCH = { warn: 0.15, front: 0.4, kind: "pavise_block" };
const SAMURAI_BLOCK = { warn: 0.5, reach: 1.3, ahead: 0.6, chest: 1.0, flick: 0.3, cooldown: 0.5, kind: "block" };
const PAINTER_DODGE = { warn: 0.3, dist: 1.6, seconds: 0.2, cooldown: 1.2, kind: "dodge" };
/*
 * [S] 498 the Death Bringer's Quick Dodge (card Characteristics: "the ability to dodge projectiles, moving to the side then back in almost an
 * instant"; audit 489 c.2): as the Painter Dodge, a missile reaching him within .warn s throws him .dist m off its line in .seconds s, and .back s
 * after he lands he slides the same way back onto his line. Logged as .kind (the sidestep).
 */
const QUICK_DODGE = { warn: 0.3, dist: 1.4, seconds: 0.12, back: 0.06, cooldown: 0.8, kind: "quick_dodge" };
// [S] 498 the Void Monarch's Demon Transformation (spec at _countDemonDamage): 800 / 97.5 of his own blows, a 3.5 m burst, floating .3 of his height
const DEMON_FORM = { blows: 800 / 97.5, burst: 3.5, lift: 0.3, kind: "demon_form" };
/*
 * [S] 499 the Void Monarch Dodge (card Abilities: "used by the Void Monarch in both forms"; audit 489 c.2). Not the Painter's slide: a missile that
 * will reach him within .warn s makes him vanish in a dark violet poof and stand .dist m off its line in the same instant (alternate sides), a second
 * poof where he lands, still facing the man he fights; the shaft comes down on air. On foot or floating in his Demon form alike (the lift is his
 * animator's, the blink only moves him across the ground). .cooldown s between dodges. Only evil.void_monarch (custom.void_monarch keeps none).
 * Logged as .kind.
 */
const MONARCH_DODGE = { warn: 0.3, dist: 2.2, cooldown: 1.2, kind: "monarch_dodge" };
/*
 * [S] Banjo Walk (353; card Characteristics "lures enemy units to them, by closing in the enemy to get their attention and then begin retreating while running
 * in circles"; Appearance "It doesn't attack unless ... a unit gets particularly close"). The bard walks at his man until he is .lure m past his reach, then
 * turns and runs, playing: each step heads .turn rad off straight away from the man, so he circles round him and out, alternate bards circling opposite
 * ways. He keeps running until the man is .clear m beyond the lure line, then closes again (the lure). Only a man inside his reach gets the banjo swung at him.
 */
const BANJO_WALK = { lure: 2.2, clear: 1.5, turn: 0.85, step: 1.2 };
// He plays as he goes (354, medieval.bard.blue.png): a music note (visualEffects MUSIC_NOTE) off his head every .every s while the walk runs, .first at its start,
// set .over m over his crown and .aside m to alternate sides
const BANJO_NOTES = { every: 0.45, first: 2, over: 0.32, aside: 0.18, stack: 0.32 };
const CHARGE_DUST = new Color3(0.62, 0.48, 0.34);
// A lancer's aim (see ProceduralAnimator.aimLanceAt): how far past his reach (m) he lays the lance on his man, and the share of the man's height it is aimed at
const LANCE_AIM_REACH = 5;
const LANCE_CHEST = 0.62;

/** One carrier's place in its wall: `offset` is the sideways step from where it stands to its slot. */
interface ShieldSlot {
  wall: number;
  offset: Vector3;
  /** Yaw of the wall's advance: its carriers stand square to it in contact. */
  heading: number;
  /** A rear-rank man's step to his place behind the front, across and in depth; null in the front rank. */
  hold: Vector3 | null;
  /** A front-rank wall's line along its heading (metres): every board in it stands on the plane this far forward, so the boards lap into one surface; null in a rear rank. */
  plane: number | null;
  /** Where on the ground his slot is in the wall's frame: across at his slot's place, in depth on his rank's line. The frame sits on the wall's own mean place, so it moves as one with the men under the shove. */
  at: Vector3;
}

/** A formed wall as the rank behind it sees it: its first slot across the line, how many slots, and how far forward it stands. */
interface ShieldWallLine {
  first: number;
  count: number;
  depth: number;
}

interface UnitPathState {
  waypoints: Vector3[];
  waypointIndex: number;
  desiredGoal: Vector3 | null;
  bypassGoal: Vector3 | null;
  bypassExpiresAt: number;
  lastPositionSample: Vector3;
  lastCollisionContacts: number;
  lastProgressAt: number;
  repathBlockedUntil: number;
}

export class SimulationSystem {
  /** Melee blows landed, newest last, for evidence captures that shoot the frame a blow lands on: the striker's impact point and the struck man's head. Capped at 200. */
  readonly hitLog: Array<{ t: number; attackerUnit: string; targetUnit: string; x: number; y: number; z: number; head: { x: number; y: number; z: number } }> = [];
  /** Abilities and special fires, newest last, for evidence captures that shoot the frame a mechanic fires on (loop v2 criterion c). Capped at 200; the same kind on the same man within 0.5 s is one entry. */
  readonly abilityLog: Array<{ t: number; unit: string; kind: string; x: number; y: number; z: number }> = [];
  private _units: RuntimeUnit[] = [];
  // Heavy blows swung but not yet landed: a club is raised when the swing starts and comes down on the man a few tenths of a second later, and that is
  // when he takes it (trailer_3_sheet_01 r2c3: the club is on the head at the hit). See _tryAttack and _landPendingBlows.
  private _pendingThrows: Array<{ attacker: RuntimeUnit; target: RuntimeUnit; shape: ProjectileShape; damage: number; splashRadius: number; knockback: Vector3; leavesAt: number; fromStaff?: boolean; fromBow?: boolean }> = [];
  private _pendingBlows: Array<{ attacker: RuntimeUnit; target: RuntimeUnit; damage: number; splashRadius: number; knockback: Vector3; landAt: number }> = [];
  // A landed heavy blow dwells on the man before it throws him (trailer_3_sheet_01 r2c3: the club head is on the red man, chest to chest, as he starts to go):
  // the damage, the striker's pinned aim and the flinch are the land step's, the push and the throw off his feet (staggerFromBlow) come BLOW_DWELL s later,
  // so for that long he crumples under the club head where it struck instead of being a body-length off in the air on the next frame. See _landMeleeBlow
  // and _fireDwelledLaunches. A blow that kills him outright throws the corpse at once.
  private _pendingLaunches: Array<{ target: RuntimeUnit; from: Vector3; knockback: number; at: number }> = [];
  /** [S] 497 Shadow Walker marks stacked on each man (WALKER_MARK); a WeakMap, so a battle's dead men drop out with it */
  private _walkerMarks = new WeakMap<RuntimeUnit, number>();
  // A presser's distance to his foe at his last decision: while it is still closing he holds his heavy swing until he is at the man's shoulder.
  private _closingFrom = new Map<RuntimeUnit, number>();
  // one-blow-per-man: when a striker who closed on his man may first bring his weapon down (see STRIKE_LAG)
  private _strikeReadyAt = new Map<RuntimeUnit, number>();
  private _aimReadyAt = new Map<RuntimeUnit, number>();
  // Halflings holding on to their man (HALFLING_CLING): the man, the side he hangs on, when he lets go (set once the man is dead)
  private _spentBalloonPacks = new Set<RuntimeUnit>();
  private _balloonLifts = new Map<RuntimeUnit, { target: RuntimeUnit; start: number; base: number; offset: Vector3; logged: boolean }>();
  private _clings = new Map<RuntimeUnit, { target: RuntimeUnit; side: number; until: number }>();
  // Gunslingers' volleys into the sky and the bullets coming down (BULLET_RAIN): when the guns fire up, then each bullet's spot and landing time
  private _rains: { attacker: RuntimeUnit; target: RuntimeUnit; damage: number; knockback: Vector3; splash: number; upAt: number; drops: { at: Vector3; lands: number; shown: boolean }[] }[] = [];
  /** [S] 447 Quick Draw's shots still to fire this attack (QUICK_FAN). */
  private _rcbVolleys: { attacker: RuntimeUnit; target: RuntimeUnit; damage: number; knockback: Vector3; splash: number; nextAt: number; left: number }[] = [];
  private _fans: { attacker: RuntimeUnit; target: RuntimeUnit; damage: number; knockback: Vector3; splash: number; nextAt: number; left: number }[] = [];
  // Vampires hanging on a man's neck (VAMPIRE_LATCH): the man, his side, the next draught and its damage, when he lets go (set once the man is dead)
  private _latches = new Map<RuntimeUnit, { target: RuntimeUnit; side: number; next: number; draught: number; until: number }>();
  // Lassoed men being hauled in (LASSO_DRAG): the rider, the rope, the next drag hit and its damage, when the horse runs him over at the latest
  // Cacti (CACTUS_EXPLOSION): their health at the last step and when they may burst again
  private _cactusHp = new Map<RuntimeUnit, { hp: number; ready: number }>();
  private _vladImpaleReady = new Map<RuntimeUnit, number>();
  private _giantFearReady = new Map<RuntimeUnit, number>();
  private _screamReady = new Map<RuntimeUnit, number>();
  private _lassos = new Map<RuntimeUnit, { rider: RuntimeUnit; rope: Mesh; loop: Mesh; at: Vector3; last: number; next: number; hit: number; blow: number; end: number }>();
  // Men hung on a Reaper's tendril (REAPER_IMPALE): who holds him, when he drops (set once he is dead), his next stab, the tendril mesh
  private _impales = new Map<RuntimeUnit, { holder: RuntimeUnit; until: number; next: number; spear: Mesh; yaw: number; tall: number }>();
  private _nextDecisionAt = new Map<RuntimeUnit, number>();
  // Mammoth Charge (MAMMOTH_CHARGE): the charger's target and heading, the men it has trampled this run, and when it may charge again
  private _charges = new Map<RuntimeUnit, { target: RuntimeUnit; dir: Vector3; trampled: Set<RuntimeUnit>; spec: ChargeSpec; end: Vector3 | null }>();
  // When a charging mammoth next kicks up dust, and how many kicks it has made (alternating feet) (MAMMOTH_DUST)
  private _chargeDustAt = new Map<RuntimeUnit, number>();
  private _chargeDustKick = new Map<RuntimeUnit, number>();
  private _chargePosed = new Set<RuntimeUnit>();
  // Big Headbutt (BIG_HEADBUTT): each minotaur's butt under way (blow and end times) and when the next is ready
  // [S] 474 the Super Peasant's flights under way (SUPER_FLIGHT)
  private _superFlights = new Map<RuntimeUnit, { from: Vector3; to: Vector3; t0: number; dur: number; logged: boolean }>();
  // [S] 479 Superboxer Punch: a committed 2 m back-dash (.22 s), then a .24 s
  // forward dash to fist reach and the ordinary splash punch, logged separately.
  private _boxerDashes = new Map<RuntimeUnit, { from: Vector3; back: Vector3; to: Vector3; target: RuntimeUnit; start: number }>();
  private _boxerDashReady = new Map<RuntimeUnit, number>();
  private _stepBoxerDashes(now: number): void {
    for (const [unit, dash] of this._boxerDashes) {
      if (unit.isDead || dash.target.isDead) { this._boxerDashes.delete(unit); continue; }
      const age = now - dash.start;
      const pos = age < 0.22 ? Vector3.Lerp(dash.from, dash.back, age / 0.22)
        : Vector3.Lerp(dash.back, dash.to, Math.min(1, (age - 0.22) / 0.24));
      unit.teleportTo(pos);
      const dir = dash.target.position.subtract(pos); dir.y = 0; dir.normalize();
      unit.body.root.rotation.y = Math.atan2(dir.x, dir.z);
      if (age >= 0.46) {
        this._boxerDashes.delete(unit);
        const profile = getAttackProfile(unit.definition.attackProfileId);
        unit.setAttackCooldown(now, profile.cooldown);
        this._landMeleeBlow(unit, dash.target, profile.damage * (unit.definition.damageMultiplier ?? 1), 1.75,
          dir.scale(profile.knockback), now, dash.target.position.clone());
        this._logAbility(unit, "superboxer_punch", now, dash.target.position);
      }
    }
  }
  /** Each Super Peasant flight under way: carried flat out along its line, .lift m up at the middle, logged "flight" at .logAt of the way, set down at its end. */
  private _stepSuperFlights(now: number): void {
    const F = SUPER_FLIGHT;
    for (const [unit, fl] of this._superFlights) {
      if (unit.isDead) { unit.animator.setDive(false); this._superFlights.delete(unit); continue; }
      const u = Math.min(1, (now - fl.t0) / fl.dur);
      const pos = Vector3.Lerp(fl.from, fl.to, u);
      pos.y = F.lift * Math.pow(Math.sin(Math.PI * Math.min(1, u * F.rise)), 0.5) * (u < 1 ? 1 : 0);
      unit.teleportTo(pos);
      unit.body.root.rotation.y = Math.atan2(fl.to.x - fl.from.x, fl.to.z - fl.from.z);
      if (!fl.logged && u >= F.logAt) {
        fl.logged = true;
        this._logAbility(unit, "flight", now);
      }
      if (u >= 1) {
        unit.animator.setDive(false);
        unit.setAttackCooldown(now, 0);
        this._superFlights.delete(unit);
      }
    }
  }
  private _butts = new Map<RuntimeUnit, { target: RuntimeUnit; blowAt: number; endAt: number; done: boolean; spec: typeof BIG_HEADBUTT; sprawlAt?: number }>();
  private _buttReadyAt = new Map<RuntimeUnit, number>();
  // Pirate Kick (PIRATE_KICK): each kick under way and when the next is ready
  private _kicks = new Map<RuntimeUnit, { target: RuntimeUnit; blowAt: number; endAt: number; done: boolean; damage: number }>();
  private _kickReadyAt = new Map<RuntimeUnit, number>();
  // The Captain's dragon pistol (DRAGON_BLAST): when each captain's next shot is ready
  private _blastReadyAt = new Map<RuntimeUnit, number>();
  // Bomb Spin (BOMB_SPIN): each spin under way and when the next is ready
  private _bombSpins = new Map<RuntimeUnit, { dropAt: number; endAt: number; dropped: boolean; damage: number }>();
  private _bombSpinReadyAt = new Map<RuntimeUnit, number>();
  // The wheelbarrow's riders (WHEELBARROW_CREW): each move's start and its man, and when the next may start
  private _crewFights = new Map<RuntimeUnit, { throwAt: number; thrown: boolean; appleAt: RuntimeUnit | null; stabAt: number; stabbed: boolean; stabOn: RuntimeUnit | null }>();
  private _chargeReadyAt = new Map<RuntimeUnit, number>();
  // Farmer back-step (FARMER_BACKSTEP): when each farmer last stabbed, and the farmers backing off now (their heading held on the man)
  private _stabbedAt = new Map<RuntimeUnit, number>();
  private _backingOff = new Set<RuntimeUnit>();
  // Hop back (HOP_BACK): when each man's last blow landed, and when he may hop again
  private _landedAt = new Map<RuntimeUnit, number>();
  private _hopReadyAt = new Map<RuntimeUnit, number>();
  // [S] the Longship's hurl (LONGSHIP_HURL): each ship in flight, the ground landings it had at take-off, and the blow it carries
  private _hurled = new Map<RuntimeUnit, { landed: number; damage: number; t0: number }>();
  // [S] 403 each crashed longship and when its oarsmen landed (LONGSHIP_OARS)
  private _oarsmen = new Map<RuntimeUnit, number>();
  // Fencer recover (FENCER_RECOVER): each sliding man, his flat way back, when it started and the man he faces
  private _recovers = new Map<RuntimeUnit, { dir: Vector3; from: number; foe: RuntimeUnit; dist: number; seconds: number; flip?: boolean }>();
  // Fencer Dodge (FENCER_DODGE): when each fencer may dodge again, and which side he goes next
  private _dodgeReadyAt = new Map<RuntimeUnit, number>();
  private _dodgeSide = new Map<RuntimeUnit, number>();
  private _dodgeBack = new Map<RuntimeUnit, { at: number; dir: Vector3; foe: RuntimeUnit }>();
  // [S] 369 balloon arrows loosed from the draw fist (renaissanceDress heldBalloonArrow): each held arrow and when the next is back in the hand
  private _arrowsAway = new Map<Node, number>();
  // Live snakes on the ground (SNAKE_LIVE), by team
  private _snakes: { s: LiveSnake; team: number }[] = [];
  // Banjo Walk (BANJO_WALK): the bards running their circles now, and which way each turns
  private _banjoWalks = new Map<RuntimeUnit, number>();
  private _banjoTurns = 0;
  // When each walking bard's next note is due (BANJO_NOTES), and a count to alternate their sides
  private _banjoNotes = new Map<RuntimeUnit, number>();
  private _banjoNoteCount = 0;
  private _jumpReadyAt = new Map<RuntimeUnit, number>();
  private _foolishWindup = new Map<RuntimeUnit, number>();
  /** [S] 530 the Cavalry horse's pull-back end time before its charge (CAVALRY_WAVE.pull) */
  private _cavalryPull = new Map<RuntimeUnit, number>();
  private _pathStates = new Map<RuntimeUnit, UnitPathState>();
  private _isRunning = false;
  private _battleStartedAt = 0;
  private _lastBattleDuration = 0;
  private _nextCleanupSweepAt = 0;

  projectileSystem: ProjectileSystem | null = null;
  visualEffects: VisualEffects | null = null;
  impactPresentation: ImpactPresentation | null = null;
  spawnUnitById: ((unitId: string, team: number, position: Vector3, options?: SpawnUnitOptions) => RuntimeUnit | null) | null = null;
  hazards: readonly HazardRegion[] = [];
  navigationGrid: NavigationGrid | null = null;

  readonly minimumDecisionInterval = 0.08;
  readonly attackRangePadding = 0.2;
  /** Short-reach melee (reach under this) keeps closing after it can swing, until bodies touch. */
  readonly meleePressMaxReach = 2.3;
  readonly meleePressGap = 0.1;
  readonly cleanupSweepInterval = 0.75;
  readonly summonLivingCap = 55;
  readonly collisionResolutionPadding = 0.03;
  readonly collisionResolutionPasses = 2;
  readonly waypointReachDistance = 1.1;
  readonly progressSampleDistance = 0.6;
  readonly stuckTimeout = 0.75;
  readonly repathCooldown = 0.35;
  /** Enemies are only sidestepped at arm's length, so opposing lines close and shove. */
  readonly localAvoidanceRadius = 0.7;
  readonly localAvoidanceStrength = 1.45;
  /** Marching allies only steer apart when nearly touching, so ranks stay closed up. */
  readonly formationAvoidanceRadius = 0.3;
  /** Fallen units of either team are stepped around closely so the press stays shut over bodies. */
  readonly fallenAvoidanceRadius = 0.9;
  readonly cohesionRadius = 1.5;
  // A runner more than runnerLeadMargin ahead of every marching ally within runnerHoldRadius drops to runnerHoldMultiplier until they draw level.
  // Only in a body of troops: with fewer than runnerHoldMinAllies marching around it a unit runs free.
  readonly runnerHoldRadius = 3;
  readonly runnerHoldMinAllies = 3;
  readonly runnerLeadMargin = 0.4;
  readonly runnerHoldMultiplier = 0.6;
  readonly congestionBypassDistance = 2.2;
  /** Shield carriers of one wall stand this far apart, centre to centre: two thirds of a round board, so each board laps a third over the next. */
  readonly shieldSlotSpacing = 0.54;
  /** Carriers within this depth of the foremost one form a rank; a sideways gap wider than shieldWallGap splits a rank into separate walls. */
  readonly shieldRankDepth = 1.0;
  readonly shieldWallGap = 2.2;
  /** The most a carrier steps across toward its slot for each stride forward. */
  readonly shieldSlotStride = 0.6;
  /** A rear rank stands this far behind the rank it backs, each man behind the gap between two boards. */
  readonly shieldRankGap = 0.75;
  /** On the march a rear-rank man slows over this last stretch as he comes up to his depth behind the front, and halts at it. */
  readonly shieldRankFollowBand = 0.25;
  /** A wall's men level their spears at the man they are closing on from this far outside their reach, the rear rank with the front. */
  readonly spearLevelReach = 3.5;
  /** Within this much of its reach a heavy weapon's man strikes on his own beat as the press does, out of contact (see ProceduralAnimator._pressBlow). */
  blowStrikeReach = 0.9;
  /** Within this much of its reach a melee unit with a heavy weapon carries it cocked (see ProceduralAnimator.readyBlow). */
  readonly blowReadyReach = 4;
  /** A slotted carrier in contact stands square to the wall's advance while his enemy is within this arc of it; outside it he turns to face him. */
  readonly shieldHeadingArc = 1.0;
  /** Each slotted carrier's wall and the sideways step from where it stands to its slot in it. */
  private _shieldSlots = new Map<RuntimeUnit, ShieldSlot>();
  /** The rank each living carrier was sorted into, 0 the front: kept from tick to tick, so a rear rank pressed up against the front stays a rank behind it. */
  private _shieldRanks = new Map<RuntimeUnit, number>();
  private _now = 0;

  get isRunning(): boolean { return this._isRunning; }

  get battleDuration(): number {
    if (this._isRunning) return this._now - this._battleStartedAt;
    return this._lastBattleDuration;
  }

  get units(): readonly RuntimeUnit[] { return this._units; }

  configureNavigation(
    zones: readonly PlacementZone[],
    obstacles: readonly Obstacle[],
    hazards: readonly HazardRegion[],
  ): void {
    this.hazards = hazards;
    this.navigationGrid = new NavigationGrid(zones, obstacles, hazards);
    this._pathStates.clear();
  }

  registerUnit(unit: RuntimeUnit): void {
    if (this._units.includes(unit)) return;
    this._units.push(unit);
    this._nextDecisionAt.set(unit, 0);
    this._pathStates.delete(unit);
  }

  unregisterUnit(unit: RuntimeUnit): void {
    const idx = this._units.indexOf(unit);
    if (idx >= 0) this._units.splice(idx, 1);
    this._nextDecisionAt.delete(unit);
    this._pathStates.delete(unit);
    this._closingFrom.delete(unit);
    this._strikeReadyAt.delete(unit);
    this._charges.delete(unit);
    this._chargeReadyAt.delete(unit);
    this._stabbedAt.delete(unit);
    this._backingOff.delete(unit);
    this._banjoWalks.delete(unit);
    this._banjoNotes.delete(unit);
    this._jumpReadyAt.delete(unit);
    this._foolishWindup.delete(unit);
  }

  beginSimulation(now: number): void {
    this._boxerDashes.clear(); this._boxerDashReady.clear();
    this._burnTickAt = 0;
    this._fearHits.clear();
    this._necroCursed.clear(); this._necroTickAt = 0; this._solarShots.clear(); this._maelstromReady.clear(); this._maelstroms = [];
    this._pendingBlows = [];
    this._lashes = [];
    for (const h of this._safeHurls) h.mesh.dispose(false, false);
    this._safeHurls = [];
    for (const c of this._clamThrows) c.node?.dispose(false, false);
    this._clamThrows = [];
    for (const p of this._presents) p.node.dispose(false, false);
    this._presents = [];
    for (const held of this._presentsAway.keys()) if (!held.isDisposed()) held.setEnabled(true);
    this._presentsAway.clear();
    this._clings.clear();
    this._spentBalloonPacks.clear();
    this._balloonLifts.clear();
    for (const v of this._latches.keys()) v.holdHeading(null);
    this._latches.clear();
    this._rains = [];
    this._fans = [];
    this._rcbVolleys = [];
    for (const h of this._hammers) h.hinge.dispose(false, true);
    this._hammers = [];
    this._clearChrono();
    for (const imp of this._impales.values()) imp.spear.dispose();
    this._impales.clear();
    for (const l of this._lassos.values()) { l.rope.dispose(); l.loop.dispose(); }
    this._lassos.clear();
    this._cactusHp.clear();
    this._vladImpaleReady.clear();
    this._screamReady.clear();
    this._giantFearReady.clear();
    this._pendingThrows = [];
    this._pendingLaunches = [];
    this._closingFrom.clear();
    this._strikeReadyAt.clear();
    this._aimReadyAt.clear();
    this._charges.clear();
    this._chargeReadyAt.clear();
    this._stabbedAt.clear();
    this._backingOff.clear();
    this._landedAt.clear();
    this._hopReadyAt.clear();
    this._hurled.clear();
    this._oarsmen.clear();
    this._recovers.clear();
    this._dodgeReadyAt.clear();
    this._dodgeSide.clear();
    for (const held of this._arrowsAway.keys()) if (!held.isDisposed()) held.setEnabled(true);
    this._arrowsAway.clear();
    this._clearSnakes();
    this._butts.clear();
    this._buttReadyAt.clear();
    this._kicks.clear();
    this._kickReadyAt.clear();
    this._blastReadyAt.clear();
    this._bombSpins.clear();
    this._bombSpinReadyAt.clear();
    this._banjoWalks.clear();
    this._banjoNotes.clear();
    this._banjoNoteCount = 0;
    this._banjoTurns = 0;
    this._jumpReadyAt.clear();
    this._foolishWindup.clear();
    this._isRunning = true;
    this._now = now;
    this._battleStartedAt = now;
    this._nextCleanupSweepAt = now + this.cleanupSweepInterval;
    this._lastBattleDuration = 0;
  }

  endSimulation(now = this._now): void {
    if (this._isRunning) {
      this._lastBattleDuration = now - this._battleStartedAt;
    }
    this._isRunning = false;
    this._clearSnakes();
    // a summoned Paladin hammer is a free node: it goes with the battle, or a reset leaves it hanging in the next scene
    for (const h of this._hammers) h.hinge.dispose(false, true);
    this._hammers = [];
    this._clearChrono();
    for (const unit of this._units) {
      unit.stopMoving();
      unit.setSpinning(false);
    }
    this._pathStates.clear();
  }

  update(dt: number, now: number): void {
    if (!this._isRunning) return;
    this._now = now;
    if (this.projectileSystem) this.projectileSystem.abilityHook ??= this._logMissileAbility;
    if (this.projectileSystem) this.projectileSystem.snakeLand ??= this._landSnake;
    if (this.projectileSystem) this.projectileSystem.reelIn ??= this._reelIn;
    if (this.projectileSystem) this.projectileSystem.necroCurseHook ??= this._necroCurse;
    if (this._tossed.length > 0) this._stepTossedGuns(dt);

    for (const unit of this._units) {
      unit.update(dt, now);
    }
    if (this._superFlights.size > 0) this._stepSuperFlights(now);
    if (this._boxerDashes.size > 0) this._stepBoxerDashes(now);
    // After the animation step, so the frame a blow lands on is the frame its club is down on the man
    if (this._pendingBlows.length > 0) this._landPendingBlows(now);
    if (this._lashes.length > 0) this._landLashes(now);
    if (this._safeHurls.length > 0) this._stepSafeHurls(now);
    if (this._clamThrows.length > 0) this._stepClamThrows(now);
    if (this._presents.length > 0 || this._presentsAway.size > 0) this._stepPresents(now);
    if (this._pendingLaunches.length > 0) this._fireDwelledLaunches(now);
    if (this._pendingThrows.length > 0) this._launchPendingThrows(now);
    this._stepBurning(now);
    if (this._necroCursed.size > 0) this._stepNecroCurse(now);
    if (this._maelstroms.length > 0) this._stepMaelstroms(now);

    if (this.hazards.length > 0) {
      for (const unit of this._units) {
        if (unit.isDead || unit.linkedParent) continue;
        const inHazard = this.hazards.some((hazard) => isPointInsideHazard(
          unit.position,
          hazard,
          Math.max(0.15, unit.definition.collisionRadius * 0.2),
        ));
        if (!inHazard) continue;
        unit.applyDamage(unit.maxHealth + 9999, Vector3.Zero());
      }
    }

    this._assignShieldSlots();
    this._resolveLivingCollisions();
    this._painterDodges(now);
    this._monarchDodges(now);
    this._samuraiBlocks(now);
    this._cultistImplosions(now);
    this._gravestoneWalls(now);
    this._sentinelCatches(now);
    this._aegisFields(now);
    if (this._hammers.length > 0) this._stepHammers(now);
    if (this._chrono.size > 0) this._stepChrono(now);
    this._firstLunges(now);
    if (this._recovers.size > 0) this._slideRecovers(dt, now);
    if (this._clings.size > 0) this._holdClings(now);
    if (this._balloonLifts.size > 0) this._stepBalloonLifts(now);
    if (this._latches.size > 0) this._holdLatches(now);
    if (this._rains.length > 0) this._stepRains(now);
    if (this._fans.length > 0) this._stepFans(now);
    if (this._rcbVolleys.length > 0) this._stepRcbVolleys(now);
    if (this._impales.size > 0) this._holdImpales(now);
    if (this._lassos.size > 0) this._haulLassos(now);
    this._cactusExplosions(now);
    if (this._charges.size > 0) this._trampleCharges(now);
    if (this._snakes.length > 0) this._slitherSnakes(dt, now);
    if (this._butts.size > 0) this._landButts(now);
    if (this._kicks.size > 0) this._landKicks(now);
    if (this._bombSpins.size > 0) this._whirlBombSpins(dt, now);
    if (this._hurled.size > 0) this._landHurledShips(now);
    if (this._oarsmen.size > 0) this._chopOars(dt, now);
    for (const [held, back] of this._arrowsAway) {
      if (now < back) continue;
      if (!held.isDisposed()) held.setEnabled(true);
      this._arrowsAway.delete(held);
    }
    // a mammoth whose run is over eases back out of the charge pose
    for (const u of this._chargePosed) {
      if (this._charges.has(u)) continue;
      u.animator.setCharging(false);
      this._chargePosed.delete(u);
    }
    this._crewsFight(now);
    this._holdShieldFrames();

    for (const unit of this._units) {
      if (unit.isDead || unit.isAnchoredActor) continue;
      // a fencer sliding back off his thrust is committed to it: no decision steers him until it ends
      if (this._recovers.has(unit) || this._balloonLifts.has(unit) ||
          Array.from(this._balloonLifts.values()).some((lift) => lift.target === unit)) continue;

      const nextDecision = this._nextDecisionAt.get(unit) ?? 0;
      if (now < nextDecision) continue;

      const aiProfile = getAIProfile(unit.definition.aiProfileId);
      this._processUnitDecision(unit, aiProfile, now);
      this._nextDecisionAt.set(unit, now + Math.max(this.minimumDecisionInterval, aiProfile.retargetInterval));
    }

    if (now >= this._nextCleanupSweepAt) {
      this._cleanupExpiredCorpses(now);
      this._nextCleanupSweepAt = now + this.cleanupSweepInterval;
    }
  }

  getLivingCount(team: number): number {
    let count = 0;
    for (const unit of this._units) {
      if (!unit.isDead && unit.team === team && unit.countsTowardVictory) count++;
    }
    return count;
  }

  /** The wheelbarrow's riders throw and stab (spec at WHEELBARROW_CREW). */
  private _crewsFight(now: number): void {
    const C = WHEELBARROW_CREW, F = CREW_FIGHT;
    for (const unit of this._units) {
      if (unit.definition.id !== "farmer.wheelbarrow") continue;
      const crew = wheelbarrowCrew(unit.body);
      if (!crew) continue;
      let fight = this._crewFights.get(unit);
      if (!fight) {
        fight = { throwAt: -99, thrown: true, appleAt: null, stabAt: -99, stabbed: true, stabOn: null };
        this._crewFights.set(unit, fight);
      }
      const throwSpan = F.cock + F.whip + F.hold + F.back;
      const stabSpan = F.draw + F.drive + F.stabHold + F.stabBack;
      if (unit.isDead) {
        poseWheelbarrowCrew(crew, -1, -1);
        continue;
      }
      const nearest = (from: Vector3, lo: number, hi: number, ok: (u: RuntimeUnit) => boolean = () => true): RuntimeUnit | null => {
        let best: RuntimeUnit | null = null, bestD = hi;
        for (const other of this._units) {
          if (other.isDead || other.team === unit.team || !other.isTargetable) continue;
          const d = Math.hypot(other.position.x - from.x, other.position.z - from.z);
          if (d >= lo && d < bestD && ok(other)) { best = other; bestD = d; }
        }
        return best;
      };
      // the apple: start a throw at the nearest man in range, let it go at the end of the cock
      if (now - fight.throwAt >= Math.max(C.appleEvery, throwSpan)) {
        const man = nearest(unit.position, C.appleFrom, C.appleReach);
        if (man) { fight.throwAt = now; fight.thrown = false; fight.appleAt = man; }
      }
      // world matrices are only refreshed by a render: settle the chain before reading a joint, or a frame replayed in one long step reads the spawn spot
      const fresh = (n: TransformNode): Vector3 => {
        const chain: TransformNode[] = [];
        for (let k: Node | null = n; k; k = k.parent) if (k instanceof TransformNode) chain.unshift(k);
        for (const k of chain) k.computeWorldMatrix(true);
        return n.getAbsolutePosition().clone();
      };
      // the stab: the nearest man within reach of the Farmer's seat, ahead of the cart's side line
      const seat = fresh(crew.farmer.root);
      if (now - fight.stabAt >= Math.max(C.stabEvery, stabSpan)) {
        const ahead = new Vector3(Math.sin(unit.body.root.rotation.y), 0, Math.cos(unit.body.root.rotation.y));
        const man = nearest(seat, 0, C.stabReach, (o) => (o.position.x - seat.x) * ahead.x + (o.position.z - seat.z) * ahead.z > -0.3);
        if (man) { fight.stabAt = now; fight.stabbed = false; fight.stabOn = man; }
      }
      const throwT = now - fight.throwAt < throwSpan ? now - fight.throwAt : -1;
      const stabT = now - fight.stabAt < stabSpan ? now - fight.stabAt : -1;
      // the stab aimed at his chest, .6 of the way from his trunk joint to the top of his head
      const on = fight.stabOn && !fight.stabOn.body.root.isDisposed() ? fight.stabOn.body : null;
      const chest = stabT >= 0 && on ? Vector3.Lerp(fresh(on.torso), fresh(on.headTop), 0.6) : null;
      const apple = poseWheelbarrowCrew(crew, throwT, stabT, chest);
      if (apple && !apple.isEnabled() && fight.thrown && throwT < 0) apple.setEnabled(true);
      if (!fight.thrown && throwT >= F.cock) {
        fight.thrown = true;
        const man = fight.appleAt;
        if (apple && man && !man.isDead && this.projectileSystem) {
          const chain: TransformNode[] = [];
          for (let n: Node | null = apple; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          const push = man.position.subtract(unit.position);
          push.y = 0;
          this.projectileSystem.spawnProjectile(
            "stone", apple.getAbsolutePosition().clone(), man, C.appleDamage, push.normalize().scale(C.applePush), 0, unit.team, this._units, undefined, 0,
            { originLift: 0, heldProp: apple },
          );
          apple.setEnabled(false);
          this._logAbility(unit, "throw", now, man.position);
        }
      }
      if (!fight.stabbed && stabT >= F.draw + F.drive) {
        fight.stabbed = true;
        const man = fight.stabOn;
        if (man && !man.isDead && Math.hypot(man.position.x - seat.x, man.position.z - seat.z) < C.stabReach + 0.6) {
          const push = man.position.subtract(seat);
          push.y = 0;
          man.applyDamage(C.stabDamage, push.normalize().scale(C.stabPush));
          man.animator.triggerFlinch();
          this._logAbility(unit, "stab", now, man.position);
        }
      }
    }
  }

  private _stepBalloonLifts(now: number): void {
    for (const [unit, lift] of this._balloonLifts) {
      const target = lift.target;
      const age = now - lift.start;
      if (unit.isDead || target.isDead || age >= 1.8) {
        this._balloonLifts.delete(unit);
        unit.animator.setGlue(null);
        unit.dropFromHang();
        target.dropFromHang();
        continue;
      }
      const t = Math.min(1, age / 1.25);
      const weight = Math.max(1, target.definition.mass);
      const y = lift.base + (3.3 / Math.sqrt(weight)) * t * (2 - t);
      unit.stopMoving();
      const pos = unit.position.clone();
      pos.y = y;
      unit.teleportTo(pos);
      target.hangAt(pos.add(lift.offset), now + 0.1);
      unit.faceTarget(target.position);
      unit.holdUpright();
      target.holdUpright();
      if (!lift.logged && age >= 0.24) {
        lift.logged = true;
        this._logAbility(unit, "float_pack", now, target.position);
      }
    }
  }

  /** Pins each holding halfling on his man (spec at HALFLING_CLING); lets go of a man dead .afterDeath s, or when the halfling dies. */
  private _holdClings(now: number): void {
    for (const [unit, cling] of this._clings) {
      const man = cling.target;
      if (unit.isDead || man.body.root.isDisposed()) {
        this._clings.delete(unit);
        continue;
      }
      if (man.isDead && cling.until === Infinity) cling.until = now + HALFLING_CLING.afterDeath;
      if (now >= cling.until) {
        this._clings.delete(unit);
        continue;
      }
      const yaw = man.body.root.rotation.y + cling.side * HALFLING_CLING.round;
      const out = man.collisionBodyRadius * HALFLING_CLING.off;
      const at = man.position.add(new Vector3(Math.sin(yaw) * out, 0, Math.cos(yaw) * out));
      at.y = Math.max(0, man.position.y) + man.body.metrics.overallHeight * HALFLING_CLING.up;
      unit.stopMoving();
      unit.teleportTo(at);
      unit.faceTarget(man.position);
    }
  }

  /** [S] 447 Fires each Quick Draw's due shots, one revolver shot at a time (spec at QUICK_FAN). */
  /** Lets go the next bolt of each Chu Ko Nu train off the rail (spec at RCB_VOLLEY). */
  private _stepRcbVolleys(now: number): void {
    for (let k = this._rcbVolleys.length - 1; k >= 0; k--) {
      const v = this._rcbVolleys[k];
      if (v.attacker.isDead || v.target.isDead || v.left <= 0) { this._rcbVolleys.splice(k, 1); continue; }
      if (now < v.nextAt) continue;
      v.left -= 1;
      v.nextAt = now + RCB_VOLLEY.every;
      v.attacker.faceTarget(v.target.position);
      const rail = handLaunchPoint(v.attacker) ?? v.attacker.getAttackOrigin().position;
      const shape = resolveProjectileShape(v.attacker, getAttackProfile(v.attacker.definition.attackProfileId)) ?? "arrow";
      // [S] 516 (c.1 "bolt train crosses the air above the visible weapon"): each bolt runs flat off the rail (no arc) to the man's chest, the
      // line the laid crossbow points along (card: projectile speed 30, a 20 m bow)
      const chestLift = Math.max(0.3, this._chestOf(v.target).y - v.target.position.y);
      this.projectileSystem?.spawnProjectile(shape, rail, v.target, v.damage, v.knockback, v.splash, v.attacker.team, this._units, undefined, 0, { originLift: 0, targetLift: chestLift, arc: 0 });
    }
  }

  private _stepFans(now: number): void {
    const F = QUICK_FAN;
    for (let k = this._fans.length - 1; k >= 0; k--) {
      const fan = this._fans[k];
      if (fan.attacker.isDead || fan.target.isDead || fan.left <= 0) { this._fans.splice(k, 1); continue; }
      if (now < fan.nextAt) continue;
      fan.left -= 1;
      fan.nextAt = now + F.every;
      fan.attacker.faceTarget(fan.target.position);
      const chest = this._chestOf(fan.target);
      const bells = this._pistolBells(fan.attacker);
      if (bells.length === 0) bells.push(fan.attacker.body.rightHand.getAbsolutePosition().clone());
      this.projectileSystem?.spawnPistolShot(bells.slice(0, 1), chest, F.flash);
      this._applyDirectOrSplash(fan.target, Math.max(1, Math.ceil(fan.damage / F.shots)), fan.splash, fan.attacker.team, fan.knockback.scale(1 / F.shots));
    }
  }

  /** Fires each gunslinger's guns into the sky and brings the bullets down on his man (spec at BULLET_RAIN). */
  private _stepRains(now: number): void {
    const R = BULLET_RAIN;
    for (let k = this._rains.length - 1; k >= 0; k--) {
      const rain = this._rains[k];
      if (rain.upAt > 0 && now >= rain.upAt) {
        rain.upAt = 0;
        if (rain.attacker.isDead) { this._rains.splice(k, 1); continue; }
        const bells = this._pistolBells(rain.attacker);
        if (bells.length === 0) bells.push(rain.attacker.body.rightHand.getAbsolutePosition().clone());
        for (const bell of bells) this.projectileSystem?.spawnPistolShot([bell], bell.add(new Vector3(0, R.up, 0)));
        this._logAbility(rain.attacker, "burst", now, rain.target.position);
        for (let i = 0; i < R.count; i++) rain.drops.push({ at: Vector3.Zero(), lands: now + R.fall + i * R.every, shown: false });
      }
      for (let i = rain.drops.length - 1; i >= 0; i--) {
        const d = rain.drops[i];
        // the streak sets off as far ahead of the landing as the fall takes at the shot's speed
        if (!d.shown && now >= d.lands - R.up / 65) {
          d.shown = true;
          const a = Math.random() * Math.PI * 2, r = Math.random() * R.spread;
          d.at = new Vector3(rain.target.position.x + Math.cos(a) * r, Math.max(0, rain.target.position.y), rain.target.position.z + Math.sin(a) * r);
          this.projectileSystem?.spawnPistolShot([d.at.add(new Vector3(0, R.up, 0))], d.at, 0.01);
        }
        if (d.shown && now >= d.lands) {
          rain.drops.splice(i, 1);
          this.visualEffects?.spawnExplosionBurst(d.at, R.blast);
          let hit: RuntimeUnit | null = null, best = rain.splash * rain.splash;
          for (const u of this._units) {
            if (u.isDead || u.team === rain.attacker.team) continue;
            const dd = Vector3.DistanceSquared(new Vector3(u.position.x, 0, u.position.z), new Vector3(d.at.x, 0, d.at.z));
            if (dd <= best) { best = dd; hit = u; }
          }
          if (hit) {
            this._applySplashDamage(d.at, rain.splash, rain.attacker.team, rain.damage, rain.knockback.scale(0.4), hit, rain.knockback.scale(0.4));
            if (this.hitLog.length >= 200) this.hitLog.shift();
            worldMatrixChain(hit.body.headTop);
            const head = hit.body.headTop.getAbsolutePosition();
            this.hitLog.push({ t: now, attackerUnit: rain.attacker.definition.id, targetUnit: hit.definition.id, x: d.at.x, y: d.at.y, z: d.at.z, head: { x: head.x, y: head.y, z: head.z } });
          }
        }
      }
      if (rain.upAt === 0 && rain.drops.length === 0) this._rains.splice(k, 1);
    }
  }

  /** The man's neck, a world point at his neck joint (his chain settled first). */
  private _neckOf(man: RuntimeUnit): Vector3 {
    worldMatrixChain(man.body.neck);
    return man.body.neck.getAbsolutePosition().clone();
  }

  /** A vampire's attack: he jumps onto the man (spec at VAMPIRE_LATCH); false for anyone else, and while he already hangs on someone (true). */
  private _tryLatch(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, cooldown: number, now: number): boolean {
    if (attacker.definition.id !== "spooky.vampire") return false;
    if (this._latches.has(attacker)) return true;
    if (attacker.isDead || target.isDead || target.linkedParent || isVehicleUnit(target.definition.id) || this._impales.has(target)) return false;
    const L = VAMPIRE_LATCH;
    const latch = { target, side: attacker.runtimeId % 2 === 0 ? 1 : -1, next: now + L.first, draught: damage * (L.every / Math.max(L.every, cooldown)), until: Infinity };
    this._latches.set(attacker, latch);
    this._pinLatch(attacker, latch);
    this._logAbility(attacker, "bite", now, target.position);
    this.visualEffects?.spawnBloodDrain(() => (this._latches.get(attacker)?.target === target && !target.isDead ? this._neckOf(target) : null), L.blood);
    return true;
  }

  /** Hangs a vampire on his man's neck, facing him (spec at VAMPIRE_LATCH). */
  private _pinLatch(unit: RuntimeUnit, latch: { target: RuntimeUnit; side: number }): void {
    const L = VAMPIRE_LATCH, man = latch.target;
    const yaw = man.body.root.rotation.y + latch.side * L.round;
    const out = man.collisionBodyRadius * L.off;
    const at = man.position.add(new Vector3(Math.sin(yaw) * out, 0, Math.cos(yaw) * out));
    at.y = Math.max(0, man.position.y) + man.body.metrics.overallHeight * man.body.root.scaling.y * L.up;
    unit.stopMoving();
    unit.teleportTo(at);
    unit.holdHeading(Math.atan2(man.position.x - at.x, man.position.z - at.z));
  }

  /** Keeps each vampire on his man and drinks (spec at VAMPIRE_LATCH); drops him .afterDeath s after the man dies, or when he dies. */
  private _holdLatches(now: number): void {
    const L = VAMPIRE_LATCH;
    for (const [unit, latch] of this._latches) {
      const man = latch.target;
      if (!unit.isDead && !man.body.root.isDisposed() && man.isDead && latch.until === Infinity) latch.until = now + L.afterDeath;
      if (unit.isDead || man.body.root.isDisposed() || now >= latch.until) {
        unit.holdHeading(null);
        this._latches.delete(unit);
        continue;
      }
      this._pinLatch(unit, latch);
      if (man.isDead || now < latch.next) continue;
      latch.next += L.every;
      man.applyDamage(latch.draught, Vector3.Zero());
      if (this.hitLog.length >= 200) this.hitLog.shift();
      const neck = this._neckOf(man);
      worldMatrixChain(man.body.headTop);
      const head = man.body.headTop.getAbsolutePosition();
      this.hitLog.push({ t: now, attackerUnit: unit.definition.id, targetUnit: man.definition.id, x: neck.x, y: neck.y, z: neck.z, head: { x: head.x, y: head.y, z: head.z } });
    }
  }

  /** A Lasso's attack: he ropes the man (spec at LASSO_DRAG); false for anyone else, and true while he already hauls someone in. */
  private _tryLasso(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, cooldown: number, now: number): boolean {
    const D = LASSO_DRAG;
    if (!D.units.has(attacker.definition.id)) return false;
    for (const l of this._lassos.values()) if (l.rider === attacker) return true;
    if (attacker.isDead || target.isDead || target.linkedParent || isVehicleUnit(target.definition.id) || this._impales.has(target) || this._lassos.has(target)) return false;
    const { rope, loop } = lassoRope(attacker.body.root.getScene());
    // [S] 446 the rope at the ready in his fist is the one he throws: it hides while the thrown rope is out
    this._showLassoCoil(attacker, false);
    const at = target.position.clone();
    at.y = D.low;
    const lasso = { rider: attacker, rope, loop, at, last: now, next: now + D.first, hit: damage * (D.every / Math.max(D.every, cooldown)), blow: damage * D.trample, end: now + D.most };
    this._lassos.set(target, lasso);
    this._haulLasso(target, lasso, now);
    this._logAbility(attacker, "lasso", now, target.position);
    return true;
  }

  /**
   * [S] 502 the Shouter's Shout (card Abilities "Shout": "a giant shockwave in one direction, blasting units away"; Characteristics: harmless,
   * the same push for every man in it, taller or heavier men resist more; secret.shouter.jpg; audit 500 c.1: "only a melee hit ... no shockwave
   * from the head"). His attack is the shout: every living enemy within SHOUT.reach m of him and inside SHOUT.half rad of the line to his target
   * is blasted off his feet along that line (applyBlastLaunch .speed, .lift; times .large for a large man, .giant for a giant or colossal one),
   * no damage; a wave of white rings and streaks leaves his head down the line (visualEffects spawnShoutWave). Logged "shout", with a plain hit
   * on his target at the same tick (LESSONS: the _release shot is the first plain event).
   */
  private _tryShout(attacker: RuntimeUnit, target: RuntimeUnit, now: number): boolean {
    const S = SHOUT;
    if (attacker.definition.id !== "secret.shouter" || attacker.isDead || target.isDead) return false;
    const line = target.position.subtract(attacker.position);
    line.y = 0;
    if (line.lengthSquared() < 1e-6) return false;
    line.normalize();
    const cosHalf = Math.cos(S.half);
    for (const u of this._units) {
      if (u.isDead || u.team === attacker.team || u.linkedParent || isVehicleUnit(u.definition.id)) continue;
      const to = u.position.subtract(attacker.position);
      to.y = 0;
      const d = to.length();
      if (d > S.reach || (d > 0.3 && Vector3.Dot(to.scale(1 / d), line) < cosHalf)) continue;
      const size = u.definition.size;
      const resist = size === "giant" || size === "colossal" ? S.giant : size === "large" ? S.large : 1;
      u.applyBlastLaunch(line.clone(), S.speed * resist, S.lift * resist);
    }
    worldMatrixChain(attacker.body.headMesh);
    const mouth = attacker.body.headMesh.getAbsolutePosition().clone();
    this.visualEffects?.spawnShoutWave(mouth, line, S.reach);
    const neck = this._neckOf(target);
    worldMatrixChain(target.body.headTop);
    const head = target.body.headTop.getAbsolutePosition();
    this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: target.definition.id, x: neck.x, y: neck.y, z: neck.z, head: { x: head.x, y: head.y, z: head.z } });
    this._logAbility(attacker, "shout", now, target.position);
    return true;
  }

  /**
   * [S] 503 the Fan Bearer's Fan Blow (card Main Hand "Ancient Fan": Polearm - Ranged, projectile Fan Blow, range 10, damage .25, force 40;
   * Characteristics: "uses their long handheld fan in an attempt to blow away approaching enemies ... The wind they create can cause extremely
   * light damage ... The wind blows every unit in its area"; secret.fan_bearer.jpg; audit 500 c.1: "no wind leaves the fan"). His attack is the
   * gust: every living enemy within FAN_BLOW.reach m of him and inside FAN_BLOW.half rad of the line to his target takes the blow's damage and a
   * shove of .push down that line (applyDamage's living knockback: a stagger and a slide, not a launch); a cone of white wind streaks leaves the
   * fan leaf down the line (visualEffects spawnFanGust). A plain hit on his target at the same tick (LESSONS: the _release shot's event).
   */
  private _tryFanBlow(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, now: number): boolean {
    const F = FAN_BLOW;
    if (attacker.definition.id !== "secret.fan_bearer" || attacker.isDead || target.isDead) return false;
    const line = target.position.subtract(attacker.position);
    line.y = 0;
    if (line.lengthSquared() < 1e-6) return false;
    line.normalize();
    const cosHalf = Math.cos(F.half);
    for (const u of this._units) {
      if (u.isDead || u.team === attacker.team || u.linkedParent) continue;
      const to = u.position.subtract(attacker.position);
      to.y = 0;
      const d = to.length();
      if (d > F.reach || (d > 0.3 && Vector3.Dot(to.scale(1 / d), line) < cosHalf)) continue;
      u.applyDamage(damage, line.scale(F.push));
    }
    const leaf = attacker.body.root.getDescendants(false, (n) => n.name === "fanLeaf")[0] as TransformNode | undefined;
    const from = leaf ?? attacker.body.headMesh;
    worldMatrixChain(from);
    this.visualEffects?.spawnFanGust(from.getAbsolutePosition().clone(), line, F.reach);
    const neck = this._neckOf(target);
    worldMatrixChain(target.body.headTop);
    const head = target.body.headTop.getAbsolutePosition();
    this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: target.definition.id, x: neck.x, y: neck.y, z: neck.z, head: { x: head.x, y: head.y, z: head.z } });
    return true;
  }

  /**
   * [S] 503 the Bomb on a Stick's smack (card Main Hand "Bomb on a Stick": Bludgeon - Melee, range 3, explosion radius 3.5; Characteristics: "they
   * will charge the enemy and smack them with the bomb, creating a big blast"; audit 500 c.1: "throws the bomb as a projectile from 6 m"). He walks
   * in to his pole's reach (manifest engageRangeOverride) and his blow lands the bomb on the man: a blast (spawnExplosionBurst at BOMB_SMACK.scale)
   * on the man's chest (.chest m up), the man's harm and a push out to .radius m round him. No bomb leaves his hands. Logged "blast" at the
   * blow, with the plain hit (LESSONS: the _release shot's event).
   */
  private _tryBombSmack(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, now: number): boolean {
    const B = BOMB_SMACK;
    if (attacker.definition.id !== "secret.bomb_on_a_stick" || attacker.isDead || target.isDead) return false;
    // the blast sits on the man's chest, where the smack lands (capture 503: at the ball's place at the blow's start it burst high behind his head)
    this.visualEffects?.spawnExplosionBurst(target.position.add(new Vector3(0, B.chest, 0)), B.scale);
    this._applyDirectOrSplash(target, damage, B.radius, attacker.team, knockback.scale(B.push), knockback.scale(B.push));
    const neck = this._neckOf(target);
    worldMatrixChain(target.body.headTop);
    const head = target.body.headTop.getAbsolutePosition();
    this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: target.definition.id, x: neck.x, y: neck.y, z: neck.z, head: { x: head.x, y: head.y, z: head.z } });
    this._logAbility(attacker, "blast", now, target.position);
    for (const mesh of attacker.body.rightHand.getChildMeshes(false, (mesh) => mesh.name.startsWith("bombStick"))) {
      mesh.setEnabled(false);
    }
    const recoil = new Vector3(attacker.position.x - target.position.x, 0, attacker.position.z - target.position.z).normalize();
    attacker.applyDamage(attacker.currentHealth, recoil.scale(6).add(new Vector3(0, 4, 0)));
    return true;
  }

  /**
   * [S] 520 the Infernal Whip's lash (audit 515 c.1: "the whip extends to the target, range 10; ours throws a dark dart from the hand"; card Weapons
   * "Infernal Whip: Whip - Melee; range 10; explosion radius 1.25", Characteristics "two flaming whips that will extend toward enemy units, lighting
   * them on fire as well as inflicting considerable damage to anyone close"). His attack throws the chain in his fist (secretDress ChainWhip.lash)
   * straight out onto the man's chest over WHIP_LASH.out s; it rests on him .hold s and draws back over .back s. When it reaches him the blade end
   * bursts (spawnWhipTipBlast) and the blow's harm lands out to .radius m round him, with his burn (on-hit statuses). Logged "throw_lash"
   * as it leaves the fist (the capture's release) and the landing as a hit on the man.
   */
  private _lashes: { attacker: RuntimeUnit; target: RuntimeUnit; damage: number; knockback: Vector3; landAt: number }[] = [];
  private _tryWhipLash(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, now: number): boolean {
    const W = WHIP_LASH;
    if (attacker.definition.id !== "secret.infernal_whip" || attacker.isDead || target.isDead) return false;
    if (attacker.whipLashing || this._lashes.some((l) => l.attacker === attacker)) return true;
    const chest = (): Vector3 | null => (target.isDead || !this._units.includes(target) ? null : this._chestOf(target));
    if (!attacker.lashWhipAt(chest, W.out, W.hold, W.back)) return false;
    this._lashes.push({ attacker, target, damage, knockback, landAt: now + W.out });
    this._logAbility(attacker, "throw_lash", now, target.position);
    return true;
  }
  private _landLashes(now: number): void {
    const W = WHIP_LASH;
    const due = this._lashes.filter((l) => now >= l.landAt);
    if (due.length === 0) return;
    this._lashes = this._lashes.filter((l) => now < l.landAt);
    for (const l of due) {
      const { attacker, target } = l;
      if (attacker.isDead || target.isDead || !this._units.includes(target)) continue;
      const at = this._chestOf(target);
      this.visualEffects?.spawnWhipTipBlast(at, W.radius);
      this._applyDirectOrSplash(target, l.damage, W.radius, attacker.team, l.knockback);
      this._applyOnHitStatuses(attacker, target, now, at);
      worldMatrixChain(target.body.headTop);
      const head = target.body.headTop.getAbsolutePosition();
      this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: target.definition.id, x: at.x, y: at.y, z: at.z, head: { x: head.x, y: head.y, z: head.z } });
    }
  }

  /**
   * [S] 520 the Bank Robbers' safe hurl (audit 515 c.1: "missing: safe hurl - summary records only a pistol burst"; card Characteristics "carrying it
   * nefariously until they come across an enemy unit from 7 away, where they will hurl the safe at the approaching assailants. Upon landing, the safe
   * will ... [create] a shockwave that will injure or kill everyone in its 5 WM radius. The safe will stay on the ground for a while ... before slowly
   * sinking into the ground"). Their first attack, while the safe is up over their heads (propBuilder OVERHEAD_SAFE, RuntimeUnit._tendSafeCarry), is
   * the hurl, not a shot: the carried safe is hidden (their arms come down) and a copy of it flies from where it was in an arc .apex m high at
   * .speed m/s onto the man's spot, tumbling .spin rad/s; where it lands every foe within .radius m takes the attack's damage times .damage and a
   * push out from it, a dust ring and smoke go up. It lies there .lie s, then sinks into the ground over .sink s and is gone. The flank robber
   * holds his fire while the safe is up. Logged "throw_safe" as it leaves their hands (the capture's release) and "safe_land" where it lands.
   */
  private _safeHurls: { mesh: Mesh; from: Vector3; to: Vector3; t0: number; dur: number; landed: boolean; half: number; attacker: RuntimeUnit; target: RuntimeUnit; damage: number; knockback: Vector3; nextCashAt: number }[] = [];
  private _trySafeHurl(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, now: number): boolean {
    const S = SAFE_HURL;
    if (attacker.definition.id !== "secret.bank_robbers" || attacker.isDead || target.isDead) return false;
    const lead = attacker.linkedParent ?? attacker;
    const actor = lead.linkedChildren.find((c) => c.visualConfig.special === "safe_bundle");
    const safe = actor?.body.hip.getChildMeshes(false).find((m) => m.name === "safe") as Mesh | undefined;
    // [S] 526 (audit c.4; card Characteristics: after the hurl the pair fight on with their fists) once the safe has left their hands each robber
    // becomes a bare-fisted brawler on his own next attack, pistols kept put away (RuntimeUnit._tendSafeCarry), his first punch SAFE_HURL.fistReady s on
    if (attacker.fistsOnly) return false;
    const gone = !safe || safe.isDisposed() || !safe.isEnabled();
    if (gone) {
      attacker.animator.dropPistols();
      attacker.disarmToFists(now, SAFE_HURL.fistReady);
      this._logAbility(attacker, "fists", now);
      return true;
    }
    if (attacker !== lead) return true;
    worldMatrixChain(safe);
    const from = safe.getAbsolutePosition().clone();
    const scale = safe.absoluteScaling.clone();
    const flying = safe.clone("safeThrown", null, false);
    if (!flying) return false;
    flying.parent = null;
    flying.position.copyFrom(from);
    flying.scaling.copyFrom(scale);
    flying.rotationQuaternion = null;
    flying.rotation.set(0, lead.body.root.rotation.y, 0);
    const glow = flying.getScene().getGlowLayerByName("glow");
    for (const m of [flying, ...flying.getChildMeshes(false)]) { glow?.addExcludedMesh(m as Mesh); m.setEnabled(true); }
    safe.setEnabled(false);
    const half = safe.getBoundingInfo().boundingBox.extendSize.y * scale.y;
    const to = new Vector3(target.position.x, half, target.position.z);
    const dur = Math.max(0.35, Vector3.Distance(new Vector3(from.x, 0, from.z), new Vector3(to.x, 0, to.z)) / S.speed);
    this._safeHurls.push({ mesh: flying, from, to, t0: now, dur, landed: false, half, attacker, target, damage: damage * S.damage, knockback, nextCashAt: now });
    this._logAbility(attacker, "throw_safe", now, target.position);
    // 526: both robbers' hands are empty now: they close with their fists, first punch after the safe has landed
    for (const r of [lead, ...lead.linkedChildren.filter((c) => c.definition.id === lead.definition.id && c.visualConfig.special !== "safe_bundle")]) {
      if (r.isDead || r.fistsOnly) continue;
      r.animator.dropPistols();
      r.disarmToFists(now, dur + S.fistReady);
    }
    return true;
  }
  private _stepSafeHurls(now: number): void {
    const S = SAFE_HURL;
    for (const h of [...this._safeHurls]) {
      const age = now - h.t0;
      if (!h.landed) {
        const u = Math.min(1, age / h.dur);
        h.mesh.position.copyFrom(Vector3.Lerp(h.from, h.to, u));
        h.mesh.position.y += 4 * S.apex * u * (1 - u);
        h.mesh.rotation.x = S.spin * age;
        if (u < 1) {
          if (now >= h.nextCashAt) {
            const drift = h.from.subtract(h.to);
            drift.y = 0;
            drift.normalize().scaleInPlace(1.4);
            this.visualEffects?.spawnSafeCash(h.mesh.position, drift);
            h.nextCashAt = now + S.cashInterval;
          }
          continue;
        }
        h.landed = true;
        h.mesh.rotation.x = 0;
        const door = h.mesh.getChildTransformNodes(true).find((node) => node.name.endsWith("safeDoorPivot"));
        if (door) door.rotation.y = Math.PI * 0.62;
        const at = new Vector3(h.to.x, 0, h.to.z);
        for (const u2 of this._units) {
          if (u2.isDead || u2.team === h.attacker.team || !u2.isTargetable || u2.linkedParent) continue;
          const off = u2.position.subtract(at);
          off.y = 0;
          const d = off.length();
          if (d > S.radius) continue;
          const out = d > 1e-3 ? off.scale(1 / d) : new Vector3(1, 0, 0);
          u2.applyDamage(h.damage * (1 - S.edge * d / S.radius), out.scale(S.push));
          u2.applyBlastLaunch(out, S.push, S.lift);
        }
        this.visualEffects?.spawnTrampleRing(at, S.radius);
        this.visualEffects?.spawnSafeCash(h.mesh.position);
        this.visualEffects?.spawnSmokePuff(at, CHARGE_DUST);
        this._logAbility(h.attacker, "safe_land", now, at);
        continue;
      }
      const sunk = (age - h.dur - S.lie) / S.sink;
      if (sunk > 0) h.mesh.position.y = h.half - sunk * h.half * 2.2;
      if (sunk >= 1) {
        h.mesh.dispose(false, false);
        this._safeHurls.splice(this._safeHurls.indexOf(h), 1);
      }
    }
  }

  /**
   * [S] 520 the Present Elf's thrown present (audit 515 c.1: "present throw - TABS: the present is thrown at the enemy; ours keeps the box in hand
   * while summons appear"; card Weapons "Thrown Present: Throwable - Ranged; damage 120-240; range 13; projectile Present; projectile speed 13.5",
   * Characteristics "throws a present at the opponent, which opens after around 3 seconds, releasing a random unit ... as an ally"). His attack throws
   * the present held before his chest (secretDress PRESENT, "presentRoot"): it is hidden there and a copy of it flies from where it was in an arc
   * .apex m high at .speed m/s onto the man's spot, turning .spin rad/s. It lands upright on the ground: the man there takes the attack's damage out to
   * .radius m. .open s later it bursts open in a puff and one of his summons (summonUnitIds, in turn) steps out of it as his ally; the box is gone.
   * His hands get a new present .rearm s after the throw. Logged "throw_present" at the let-go (the capture's release), "present_open" at the opening.
   */
  private _presents: { node: TransformNode; from: Vector3; to: Vector3; t0: number; dur: number; landed: boolean; openAt: number; opened: boolean; lid: Mesh | null; lidY: number; attacker: RuntimeUnit; target: RuntimeUnit; damage: number; knockback: Vector3 }[] = [];
  private _presentsAway = new Map<TransformNode, number>();
  private _presentTurn = new Map<RuntimeUnit, number>();
  private _tryPresentThrow(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, now: number): boolean {
    const P = PRESENT_THROW;
    if (attacker.definition.id !== "secret.present_elf" || attacker.isDead || target.isDead) return false;
    const held = attacker.body.torso.getChildTransformNodes(true).find((n) => n.name === "presentRoot");
    if (!held || held.isDisposed()) return false;
    if (!held.isEnabled()) return true;
    worldMatrixChain(held);
    for (const m of held.getChildMeshes(false)) m.computeWorldMatrix(true);
    const from = held.getAbsolutePosition().clone();
    const scale = held.absoluteScaling.clone();
    const node = held.clone("presentThrown", null, false);
    if (!node) return false;
    node.parent = null;
    node.position.copyFrom(from);
    node.scaling.copyFrom(scale);
    node.rotationQuaternion = null;
    node.rotation.set(0, attacker.body.root.rotation.y, 0);
    const glow = attacker.body.root.getScene().getGlowLayerByName("glow");
    for (const m of node.getChildMeshes(false)) glow?.addExcludedMesh(m as Mesh);
    node.setEnabled(true);
    held.setEnabled(false);
    this._presentsAway.set(held, now + P.rearm);
    // Set the lower face of the box's floor on the ground.
    const box = held.getChildMeshes(true).find((m) => m.name === "presentBox");
    const half = box ? (box.getBoundingInfo().boundingBox.extendSize.y - box.position.y) * scale.y : 0.25;
    const to = new Vector3(target.position.x, half, target.position.z);
    const dur = Math.max(0.3, Vector3.Distance(new Vector3(from.x, 0, from.z), new Vector3(to.x, 0, to.z)) / P.speed);
    const lid = node.getChildMeshes(true).find((m) => m.name === "presentThrown.presentLid") as Mesh | undefined;
    this._presents.push({ node, from, to, t0: now, dur, landed: false, openAt: Infinity,
      opened: false, lid: lid ?? null, lidY: lid?.position.y ?? 0, attacker, target, damage, knockback });
    this._logAbility(attacker, "throw_present", now, target.position);
    return true;
  }
  private _stepPresents(now: number): void {
    const P = PRESENT_THROW;
    for (const [held, at] of this._presentsAway) {
      if (held.isDisposed()) { this._presentsAway.delete(held); continue; }
      if (now >= at) { held.setEnabled(true); this._presentsAway.delete(held); }
    }
    for (const p of [...this._presents]) {
      if (!p.landed) {
        const u = Math.min(1, (now - p.t0) / p.dur);
        p.node.position.copyFrom(Vector3.Lerp(p.from, p.to, u));
        p.node.position.y += 4 * P.apex * u * (1 - u);
        p.node.rotation.x = u < 1 ? P.spin * (now - p.t0) : 0;
        if (u < 1) continue;
        p.landed = true;
        p.openAt = now + P.open;
        if (!p.target.isDead && this._units.includes(p.target)) {
          this._applyDirectOrSplash(p.target, p.damage, P.radius, p.attacker.team, p.knockback);
          const neck = this._neckOf(p.target);
          worldMatrixChain(p.target.body.headTop);
          const head = p.target.body.headTop.getAbsolutePosition();
          this.hitLog.push({ t: now, attackerUnit: p.attacker.definition.id, targetUnit: p.target.definition.id, x: neck.x, y: neck.y, z: neck.z, head: { x: head.x, y: head.y, z: head.z } });
        }
        this.visualEffects?.spawnKickDust(new Vector3(p.to.x, 0, p.to.z), 1);
        continue;
      }
      if (now < p.openAt) continue;
      const age = now - p.openAt;
      if (age >= 0.8) {
        p.node.dispose(false, false);
        this._presents.splice(this._presents.indexOf(p), 1);
        continue;
      }
      if (p.lid) {
        p.lid.position.set(0.12 + age * 1.6, p.lidY + Math.max(0, 0.32 + 3.2 * age - 5.2 * age ** 2), -0.12 - age * 0.45);
        p.lid.rotation.set(0.35 + age * 2.8, 0, -0.2 - age * 2.3);
      }
      if (p.opened) continue;
      p.opened = true;
      const spot = new Vector3(p.to.x, 0, p.to.z);
      this.visualEffects?.spawnConfetti(spot.add(new Vector3(0, p.to.y, 0)));
      this._logAbility(p.attacker, "present_open", now, spot);
      const ids = p.attacker.definition.summonUnitIds ?? [];
      if (ids.length === 0 || !this.spawnUnitById || p.attacker.isDead || this.getLivingCount(p.attacker.team) >= this.summonLivingCap) continue;
      const turn = this._presentTurn.get(p.attacker) ?? 0;
      this._presentTurn.set(p.attacker, turn + 1);
      this.spawnUnitById(ids[turn % ids.length], p.attacker.team, spot, { role: "summoned", linkedParent: p.attacker, linkedRelation: "spawned-child" });
    }
  }

  /** [S] 446 shows or hides the rider's rope at the ready (wildWestDress LASSO_COIL, the "lassoCoil" node in his right fist). */
  private _showLassoCoil(rider: RuntimeUnit, on: boolean): void {
    if (rider.body.root.isDisposed()) return;
    for (const n of rider.body.rightHand.getDescendants(false, (c) => c.name === "lassoCoil")) n.setEnabled(on);
  }

  /** Pulls a lassoed man a step toward the horse, low and limp, and runs the rope from the rider's fist to his chest (spec at LASSO_DRAG). */
  private _haulLasso(man: RuntimeUnit, l: { rider: RuntimeUnit; rope: Mesh; loop: Mesh; at: Vector3; last: number }, now: number): void {
    const D = LASSO_DRAG, h = l.rider;
    const dt = Math.max(0, now - l.last);
    l.last = now;
    const to = h.position.subtract(l.at);
    to.y = 0;
    const d = to.length();
    if (d > 1e-4) l.at.addInPlace(to.scale(Math.min(1, (D.pull * dt) / d)));
    l.at.y = D.low;
    man.hangAt(l.at, now + 0.3);
    man.faceTarget(h.position);
    worldMatrixChain(h.body.rightHand);
    const fist = h.body.rightHand.getAbsolutePosition().clone();
    // the rope ends on his drawn chest (a toppled man lies away from his root), not over the root
    worldMatrixChain(man.body.torso);
    const chest = man.body.torso.getAbsolutePosition().clone();
    const dir = chest.subtract(fist);
    const len = dir.length();
    dir.normalize();
    l.rope.position.copyFrom(fist);
    l.rope.rotationQuaternion = l.rope.rotationQuaternion ?? new Quaternion();
    Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, l.rope.rotationQuaternion);
    l.rope.scaling.set(1, len, 1);
    l.loop.position.copyFrom(chest);
  }

  /** Hauls each lassoed man in and drags him (hits); the horse runs him over once he is under it or the haul runs long (spec at LASSO_DRAG). */
  private _haulLassos(now: number): void {
    const D = LASSO_DRAG;
    for (const [man, l] of this._lassos) {
      const h = l.rider;
      const gone = h.isDead || !this._units.includes(h) || man.body.root.isDisposed() || man.isDead;
      const close = Vector3.Distance(new Vector3(h.position.x, 0, h.position.z), new Vector3(l.at.x, 0, l.at.z)) <= h.collisionBodyRadius * D.under;
      if (gone || close || now >= l.end) {
        l.rope.dispose();
        l.loop.dispose();
        this._showLassoCoil(h, true);
        this._lassos.delete(man);
        if (man.body.root.isDisposed()) continue;
        man.dropFromHang();
        if (!gone) {
          // run over: the horse's blow throws him up and on along the haul
          const on = h.body.root.getDirection(Vector3.Forward());
          on.y = 0;
          if (on.lengthSquared() < 1e-6) on.set(0, 0, 1);
          on.normalize();
          this._strikeLogged(h, man, l.blow, on.scale(D.throwOut).add(new Vector3(0, D.throwUp, 0)), now);
        }
        continue;
      }
      this._haulLasso(man, l, now);
      if (now < l.next) continue;
      l.next += D.every;
      this._strikeLogged(h, man, l.hit, Vector3.Zero(), now);
    }
  }

  /** Cactus Explosion (CACTUS_EXPLOSION): each ready cactus that lost health since the last step bursts needles at every foe round him. */
  private _cactusExplosions(now: number): void {
    const C = CACTUS_EXPLOSION;
    for (const unit of this._units) {
      if (!C.units.has(unit.definition.id) || unit.isDead) continue;
      const seen = this._cactusHp.get(unit);
      const hp = unit.currentHealth;
      if (!seen) { this._cactusHp.set(unit, { hp, ready: now }); continue; }
      const hurt = hp < seen.hp - 1e-3;
      seen.hp = hp;
      if (!hurt || now < seen.ready) continue;
      seen.ready = now + C.cooldown;
      const mid = unit.position.add(new Vector3(0, unit.body.metrics.overallHeight * unit.body.root.scaling.y * 0.5, 0));
      this.visualEffects?.spawnCactusNeedles(mid);
      for (const foe of this._units) {
        if (foe.isDead || foe.team === unit.team) continue;
        const away = foe.position.subtract(unit.position);
        away.y = 0;
        const d = away.length();
        if (d > C.radius) continue;
        if (d > 1e-4) away.scaleInPlace(1 / d); else away.set(1, 0, 0);
        foe.applyDamage(C.damage, away.scale(C.push));
      }
      this._logAbility(unit, "needles", now, mid);
    }
  }

  /**
   * [S] 529 Vlad Impale (card ability: "the unit will raise its weapon and wooden spikes will appear from a certain direction", impaling those within
   * their radius; secret.vlad.jpg: tall sharpened stakes standing out of the ground). When ready (VLAD_IMPALE.cooldown s) and on his feet, as he swings:
   * a row of stakes bursts out of the ground from .start m ahead of him down the line to the man, every .step m to .reach m (visualEffects
   * spawnStakeRow); every enemy within .width m of the row takes .damage of his blow and is thrown up .lift and on .push. Logged "impale".
   */
  private _tryVladImpale(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, now: number): void {
    const V = VLAD_IMPALE;
    if (attacker.definition.id !== "secret.vlad" || attacker.isDead || target.isDead || attacker.linkedParent) return;
    if (attacker.isAirborne || attacker.isToppled || attacker.isDowned) return;
    if (now < (this._vladImpaleReady.get(attacker) ?? 0)) return;
    const line = target.position.subtract(attacker.position);
    line.y = 0;
    if (line.lengthSquared() < 1e-6) return;
    line.normalize();
    this._vladImpaleReady.set(attacker, now + V.cooldown);
    const count = Math.max(4, Math.floor((V.reach - V.start) / V.step) + 1), end = V.start + (count - 1) * V.step;
    const ground = new Vector3(attacker.position.x, 0, attacker.position.z);
    this.visualEffects?.spawnStakeRow(ground, line, count, V.start, V.step);
    for (const u of this._units) {
      if (u.isDead || u.team === attacker.team || u.linkedParent) continue;
      const to = u.position.subtract(attacker.position);
      to.y = 0;
      const d = Vector3.Dot(to, line);
      if (d < V.start - V.width || d > end + V.width) continue;
      const off = to.subtract(line.scale(d)).length();
      if (off > V.width) continue;
      u.applyDamage(damage * V.damage, Vector3.Zero());
      if (!isVehicleUnit(u.definition.id)) u.applyBlastLaunch(line.clone(), V.push, V.lift);
    }
    this._logAbility(attacker, "impale", now, target.position);
  }

  /**
   * [S] 539 (blackbeard c.1) Blackbeard's Cannon Barrage (card ability "summons a storm of cannonballs (8 cannonballs) coming from the sky toward
   * the enemy"; Characteristics "they can call heavy cannon barrages every few seconds, devastating groups and giant units alike"). CANNON_BARRAGE:
   * when ready (.first s in, then every .cooldown s) and on his feet, as he swings: .balls black cannonballs, one every .every s, each dropping from
   * .up m over a spot within .spread m of his man (the spot leaned .lean m back toward Blackbeard, so the fall shows beside him), splash .splash m,
   * .damage each, a .push blast. Logged "cannon_barrage" (not a plain kind: the ability shot); his anchor blow still lands.
   */
  private _barrageReady = new Map<RuntimeUnit, number>();
  private _tryCannonBarrage(attacker: RuntimeUnit, target: RuntimeUnit, knockback: Vector3, now: number): void {
    const C = CANNON_BARRAGE;
    if (attacker.definition.id !== "secret.blackbeard" || attacker.isDead || target.isDead || attacker.linkedParent) return;
    if (attacker.isAirborne || attacker.isToppled || attacker.isDowned) return;
    if (!this._barrageReady.has(attacker)) this._barrageReady.set(attacker, now + C.first);
    if (now < this._barrageReady.get(attacker)!) return;
    this._barrageReady.set(attacker, now + C.cooldown);
    const back = attacker.position.subtract(target.position); back.y = 0;
    if (back.lengthSquared() > 1e-6) back.normalize();
    const push = knockback.lengthSquared() > 1e-6 ? knockback.normalizeToNew().scale(C.push) : back.scale(-C.push);
    for (let i = 0; i < C.balls; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * C.spread;
      const spot = new Vector3(target.position.x + Math.cos(a) * r + back.x * C.lean, 0, target.position.z + Math.sin(a) * r + back.z * C.lean);
      const sky = spot.add(new Vector3(-back.x * C.drift, C.up, -back.z * C.drift));
      this.projectileSystem?.spawnProjectile("cannonball", sky, target, C.damage, push, C.splash, attacker.team, this._units, undefined, i * C.every, { at: spot, arc: 0 });
    }
    this._logAbility(attacker, "cannon_barrage", now, target.position);
  }

  /**
   * [S] 530 Banshee Scream (audit 527 c.1; card ability "The Banshee will 'scream,' creating a large blue aoe that launches enemy units up and flings
   * them, dealing damage rapidly. It has a considerably long cooldown"; Characteristics "will push every Unit in its radius away"; secret.banshee.png
   * white-blue streamers). When ready (BANSHEE_SCREAM.cooldown s, ready from the start) as she casts: a pale-blue burst dome .radius m round her on the
   * ground (visualEffects spawnReaperBurst in the .ring/.dark look), every enemy inside it hurt .damage and thrown up .lift and out from her .push, a
   * man at her middle straight out her front. Logged "scream".
   */
  /**
   * [S] 531 Giant Fear (audit 527 c.2; card ability "very similar to Stiffy Fear. It summons a aura around the unit, making all enemies in the radius
   * afraid, causing them to flee"; secret.skeleton_giant.jpg: the men round his knees glow and scatter). When ready (GIANT_FEAR.cooldown s, ready from
   * the start) as he swings: a pale ghost-green burst dome .radius m round him on the ground (visualEffects spawnReaperBurst in the .ring/.dark look),
   * every enemy inside it frightened for .seconds (RuntimeUnit.applyFear: the purple skull over his head, he runs from the giant). Logged "giant_fear".
   */
  private _tryGiantFear(attacker: RuntimeUnit, now: number): void {
    const G = GIANT_FEAR;
    if (attacker.definition.id !== "secret.skeleton_giant" || attacker.isDead || attacker.linkedParent) return;
    if (now < (this._giantFearReady.get(attacker) ?? 0)) return;
    this._giantFearReady.set(attacker, now + G.cooldown);
    const ground = new Vector3(attacker.position.x, 0, attacker.position.z);
    this.visualEffects?.spawnReaperBurst(ground, G.radius, G);
    for (const u of this._units) {
      if (u.isDead || u.team === attacker.team || u.linkedParent || !u.isTargetable) continue;
      const away = u.position.subtract(ground);
      away.y = 0;
      if (away.length() > G.radius + u.collisionBodyRadius) continue;
      u.applyFear(G.seconds, attacker.position, now);
    }
    this._logAbility(attacker, "giant_fear", now, ground);
  }

  /*
   * [S] 536 Solar Maelstrom (solar_architect c.2; card Characteristics: "When close to a unit, they will cast a golden spinning maelstrom that blasts
   * enemy units away from an area and heals all ally units within it, before imploding and sucking any nearby enemy units in"; Abilities "in this
   * circle Units ... in the team of a unit with this ability, is healing"). SOLAR_MAELSTROM: when his target is within .near m and it is ready
   * (.cooldown s, the first .first s in), a golden vortex .radius m round where he stands (visualEffects spawnSolarMaelstrom) blasts every enemy in
   * it away (.push, .lift, .damage; logged "maelstrom"); for .seconds it spins, every .tick s healing each friend in it .heal of his full health;
   * then it implodes, every enemy within .pull m of its middle flung in toward it (.inPush, .inLift; logged "maelstrom_implode").
   */
  private _maelstromReady = new Map<RuntimeUnit, number>();
  private _maelstroms: { unit: RuntimeUnit; at: Vector3; until: number; tickAt: number }[] = [];
  private _trySolarMaelstrom(attacker: RuntimeUnit, target: RuntimeUnit, now: number): void {
    const M = SOLAR_MAELSTROM;
    if (attacker.definition.id !== "secret.solar_architect" || attacker.isDead || attacker.linkedParent) return;
    if (!this._maelstromReady.has(attacker)) this._maelstromReady.set(attacker, now + M.first);
    if (now < this._maelstromReady.get(attacker)!) return;
    if (Vector3.Distance(target.position, attacker.position) > M.near) return;
    this._maelstromReady.set(attacker, now + M.cooldown);
    // 536.6b cast on the man who came close, not round himself (look: the vortex spun empty 7 m from the man)
    const at = new Vector3(target.position.x, 0, target.position.z);
    this.visualEffects?.spawnSolarMaelstrom(at, M.radius, M.seconds);
    for (const u of this._units) {
      if (u.isDead || u.team === attacker.team || u.linkedParent || !u.isTargetable) continue;
      const away = u.position.subtract(at); away.y = 0;
      const d = away.length();
      if (d > M.radius + u.collisionBodyRadius) continue;
      // the man at its middle is blown on away from the Architect
      if (d > 0.5) away.scaleInPlace(1 / d); else { away.copyFrom(u.position.subtract(attacker.position)); away.y = 0; if (away.lengthSquared() > 1e-6) away.normalize(); else away.set(1, 0, 0); }
      u.applyDamage(M.damage, away.scale(M.push));
      if (!isVehicleUnit(u.definition.id)) u.applyBlastLaunch(away, M.push, M.lift);
    }
    this._maelstroms.push({ unit: attacker, at, until: now + M.seconds, tickAt: now });
    this._logAbility(attacker, "maelstrom", now, at);
  }
  private _stepMaelstroms(now: number): void {
    const M = SOLAR_MAELSTROM;
    for (const m of [...this._maelstroms]) {
      if (now >= m.tickAt && now < m.until) {
        m.tickAt = now + M.tick;
        for (const u of this._units) {
          if (u.isDead || u.team !== m.unit.team || u.currentHealth >= u.maxHealth) continue;
          if (Vector3.DistanceSquared(new Vector3(u.position.x, 0, u.position.z), m.at) > M.radius * M.radius) continue;
          u.heal(u.maxHealth * M.heal);
        }
      }
      if (now < m.until) continue;
      this._maelstroms.splice(this._maelstroms.indexOf(m), 1);
      for (const u of this._units) {
        if (u.isDead || u.team === m.unit.team || u.linkedParent || !u.isTargetable) continue;
        const toward = m.at.subtract(u.position); toward.y = 0;
        const d = toward.length();
        if (d > M.pull || d < 0.3) continue;
        toward.scaleInPlace(1 / d);
        if (!isVehicleUnit(u.definition.id)) u.applyBlastLaunch(toward, Math.min(M.inPush, d * 2.2), M.inLift);
      }
      this._logMissileAbility(m.unit.definition.id, "maelstrom_implode", m.at);
    }
  }

  private _tryBansheeScream(attacker: RuntimeUnit, now: number): void {
    const B = BANSHEE_SCREAM;
    if (attacker.definition.id !== "secret.banshee" || attacker.isDead || attacker.linkedParent) return;
    if (now < (this._screamReady.get(attacker) ?? 0)) return;
    this._screamReady.set(attacker, now + B.cooldown);
    const ground = new Vector3(attacker.position.x, 0, attacker.position.z);
    this.visualEffects?.spawnReaperBurst(ground, B.radius, B);
    const front = Vector3.TransformNormal(new Vector3(0, 0, 1), attacker.body.root.getWorldMatrix());
    front.y = 0;
    for (const u of this._units) {
      if (u.isDead || u.team === attacker.team || u.linkedParent || !u.isTargetable) continue;
      const away = u.position.subtract(ground);
      away.y = 0;
      const d = away.length();
      if (d > B.radius + u.collisionBodyRadius) continue;
      if (d > 1e-3) away.scaleInPlace(1 / d); else away.copyFrom(front.lengthSquared() > 1e-6 ? front.normalize() : new Vector3(1, 0, 0));
      u.applyDamage(B.damage, away.scale(B.push));
      if (!isVehicleUnit(u.definition.id)) u.applyBlastLaunch(away, B.push, B.lift);
    }
    this._logAbility(attacker, "scream", now, ground);
  }

  /**
   * [S] 535 Banshee Hands (audit 527 c.2; card Weapons, main and off: "a ghastly weapon that casts a spell on units. Units that are cursed will have
   * ghostly effects twirling around them, turning them blue"). Her plain attack is a curse, not a swing: both arms thrust out open-handed
   * (RuntimeUnit.startCurseCast) and a pale-blue ghost stream runs from each palm to the man for .stream s (visualEffects spawnFlameJet in the .look
   * colours); he takes the blow's damage and is cursed .seconds (RuntimeUnit.applyGhostCurse: dyed blue, ghost wisps circling his trunk). Logged
   * "cast_curse" (a cast: the capture's release) and "status:curse" on him.
   */
  private _tryBansheeCurse(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, now: number): boolean {
    const B = BANSHEE_CURSE;
    if (attacker.definition.id !== "secret.banshee" || attacker.linkedParent || target.isDead) return false;
    const palms = attacker.startCurseCast();
    if (this.visualEffects) {
      for (const palm of palms) {
        const from = (): Vector3 | null => (attacker.isDead || palm.isDisposed() ? null : (worldMatrixChain(palm), palm.getAbsolutePosition().clone()));
        const to = (): Vector3 | null => (target.isDead ? null : target.position.add(new Vector3(0, B.chest, 0)));
        this.visualEffects.spawnFlameJet(from, to, B.stream, B.look);
      }
    }
    this._logAbility(attacker, "cast_curse", now, target.position);
    this._strikeLogged(attacker, target, damage, knockback.scale(0.3), now);
    if (!target.isDead) {
      target.applyGhostCurse(B.seconds);
      this._logAbility(attacker, "status:curse", now, target.position);
    }
    return true;
  }

  /** A blow that lands now and goes into the hit log (the capture's plain events). */
  private _strikeLogged(attacker: RuntimeUnit, man: RuntimeUnit, damage: number, impulse: Vector3, now: number): void {
    man.applyDamage(damage, impulse);
    if (this.hitLog.length >= 200) this.hitLog.shift();
    worldMatrixChain(man.body.headTop);
    const head = man.body.headTop.getAbsolutePosition();
    const p = man.position;
    this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: man.definition.id, x: p.x, y: p.y, z: p.z, head: { x: head.x, y: head.y, z: head.z } });
  }

  /** Starts a Reaper's impale on a weak man (spec at REAPER_IMPALE); false when this blow is an ordinary cut. */
  private _tryImpale(attacker: RuntimeUnit, target: RuntimeUnit, now: number): boolean {
    const I = REAPER_IMPALE;
    if (!I.units.has(attacker.definition.id) || attacker.isDead || target.isDead || target.linkedParent || isVehicleUnit(target.definition.id)) return false;
    if (target.maxHealth >= attacker.maxHealth * I.weak || this._impales.has(target) || this._clings.has(target)) return false;
    for (const imp of this._impales.values()) if (imp.holder === attacker) return false;
    // his heading and head height at the stab: the man hangs off those, so he does not swing round the Reaper as the Reaper turns to him
    worldMatrixChain(attacker.body.headTop);
    const tall = Math.max(attacker.body.metrics.overallHeight, attacker.body.headTop.getAbsolutePosition().y - Math.max(0, attacker.position.y));
    const imp = { holder: attacker, until: Infinity, next: now + I.every, spear: reaperSpear(attacker.body.root.getScene()), yaw: attacker.body.root.rotation.y, tall };
    this._impales.set(target, imp);
    this._hangImpaled(target, imp, now);
    target.applyDamage(target.maxHealth * I.bite, Vector3.Zero());
    this._logAbility(attacker, "impale", now, target.position);
    return true;
  }

  /** Hangs the man where the Reaper holds him and runs the tendril from the Reaper's back through his middle (spec at REAPER_IMPALE). */
  private _hangImpaled(man: RuntimeUnit, imp: { holder: RuntimeUnit; spear: Mesh; yaw: number; tall: number }, now: number): void {
    const I = REAPER_IMPALE, h = imp.holder, H = imp.tall;
    const yaw = imp.yaw;
    const fwd = new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new Vector3(fwd.z, 0, -fwd.x);
    const off = -(Math.sign(h.body.rightShoulder.position.x) || 1);
    const at = h.position.add(right.scale(off * I.side * H)).subtract(fwd.scale(I.back * H));
    at.y = Math.max(0, h.position.y) + I.up * H;
    man.hangAt(at, now + 0.3);
    man.faceTarget(h.position);
    const root = h.position.add(right.scale(off * 0.08 * H)).subtract(fwd.scale(I.rootBack * H));
    root.y = Math.max(0, h.position.y) + I.rootUp * H;
    const mid = at.add(new Vector3(0, man.body.metrics.overallHeight * 0.5, 0));
    const dir = mid.subtract(root);
    const len = dir.length() + man.body.metrics.overallHeight * I.through;
    dir.normalize();
    imp.spear.position.copyFrom(root);
    imp.spear.rotationQuaternion = imp.spear.rotationQuaternion ?? new Quaternion();
    Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, imp.spear.rotationQuaternion);
    imp.spear.scaling.set(1, len, 1);
  }

  /** Keeps each impaled man hung and stabbed; drops him .afterDeath s after he dies, or when his Reaper dies (spec at REAPER_IMPALE). */
  private _holdImpales(now: number): void {
    const I = REAPER_IMPALE;
    for (const [man, imp] of this._impales) {
      const gone = imp.holder.isDead || !this._units.includes(imp.holder) || man.body.root.isDisposed();
      if (!gone && man.isDead && imp.until === Infinity) imp.until = now + I.afterDeath;
      if (gone || now >= imp.until) {
        imp.spear.dispose();
        this._impales.delete(man);
        if (!man.body.root.isDisposed()) man.dropFromHang();
        continue;
      }
      if (!man.isDead && now >= imp.next) {
        imp.next = now + I.every;
        man.applyDamage(man.maxHealth * I.bite, Vector3.Zero());
      }
      this._hangImpaled(man, imp, now);
    }
  }

  private _resolveLivingCollisions(): void {
    const roots = this._units.filter((unit) => !unit.isDead && !unit.linkedParent && !this._clings.has(unit) && !this._latches.has(unit) && !this._impales.has(unit));
    if (roots.length < 2) return;

    for (let pass = 0; pass < this.collisionResolutionPasses; pass++) {
      for (let i = 0; i < roots.length; i++) {
        const a = roots[i];
        for (let j = i + 1; j < roots.length; j++) {
          const b = roots[j];
          if (b.isDead) continue;

          const delta = b.position.subtract(a.position);
          delta.y = 0;
          const sameTeam = a.team === b.team;
          // Two bracers of one team stand a fifth closer than their body widths, so a shield line closes up shoulder to shoulder. Any other two of one team stand a tenth closer, so the ranks behind press up into the front one. Enemy contact keeps the full distance.
          const bracedRank = sameTeam && a.definition.aiProfileId === "ai.brace" && b.definition.aiProfileId === "ai.brace";
          // Two carriers slotted into one wall stand at the slot spacing, boards lapping: the solver only parts them inside it.
          const slotA = this._shieldSlots.get(a);
          const sameWall = slotA !== undefined && slotA.wall === this._shieldSlots.get(b)?.wall;
          // Against an enemy a front-rank carrier's reach is his board, not his body: the board stands SHIELD_BOARD_STANDOFF ahead of him on the wall's plane, so an
          // enemy is stopped at its face and two walls meet board to board, instead of bodies and shafts sinking through the boards into the men behind them.
          const reach = (unit: RuntimeUnit) => (this._shieldSlots.get(unit)?.plane ?? null) !== null
            ? Math.max(unit.collisionBodyRadius, SHIELD_BOARD_STANDOFF)
            : unit.collisionBodyRadius;
          const minDistance = sameWall
            ? this.shieldSlotSpacing * 0.9
            : sameTeam
              ? (a.collisionBodyRadius + b.collisionBodyRadius) * (bracedRank ? 0.8 : 0.9)
              : reach(a) + reach(b);
          const distanceSq = delta.lengthSquared();
          if (distanceSq > minDistance * minDistance) continue;

          const distance = Math.sqrt(Math.max(distanceSq, 0.000001));
          const normal = distanceSq > 0.000001
            ? delta.scale(1 / distance)
            : new Vector3(((a.runtimeId + b.runtimeId) % 2 === 0) ? 1 : -1, 0, 0);
          const overlap = minDistance - distance + this.collisionResolutionPadding;
          if (overlap <= 0) continue;

          const contactBias = sameTeam ? 0.55 : 1.0;
          // A colossus is not held up by its own troops: it wades through their ranks and they are the ones moved aside.
          const resistance = (unit: RuntimeUnit) => sameTeam && unit.definition.size === "colossal"
            ? 1e6
            : Math.max(0.55, unit.definition.mass * unit.crowdResistance * (1 + unit.braceAbsorption));
          const resistanceA = resistance(a);
          const resistanceB = resistance(b);
          const inverseMassA = 1 / resistanceA;
          const inverseMassB = 1 / resistanceB;
          const inverseMassTotal = inverseMassA + inverseMassB;
          // A colossus on the move parts its own troops to either side of its path: pushed straight off it, the ones at its rump stayed queued behind it.
          const colossus = !sameTeam ? null : a.definition.size === "colossal" ? a : b.definition.size === "colossal" ? b : null;
          const sideways = (unit: RuntimeUnit, away: Vector3): Vector3 => {
            if (!colossus || unit === colossus) return away;
            const heading = colossus.collisionVelocity;
            if (heading.lengthSquared() < 0.04) return away;
            heading.normalize();
            const side = away.subtract(heading.scale(Vector3.Dot(away, heading)));
            if (side.lengthSquared() < 0.0025) side.set(-heading.z, 0, heading.x).scaleInPlace(unit.runtimeId % 2 === 0 ? 1 : -1);
            return side.normalize();
          };
          a.applyCollisionSeparation(sideways(a, normal.scale(-1)).scale(overlap * (inverseMassA / inverseMassTotal) * a.crowdSeparationStrength * contactBias));
          b.applyCollisionSeparation(sideways(b, normal).scale(overlap * (inverseMassB / inverseMassTotal) * b.crowdSeparationStrength * contactBias));

          const relativeVelocity = b.collisionVelocity.subtract(a.collisionVelocity);
          const impactSpeed = Math.max(0, -Vector3.Dot(relativeVelocity, normal));
          const impulseStrength = Math.min(4.5, overlap * 4.2 * contactBias + impactSpeed * (sameTeam ? 0.55 : 0.9));
          if (impulseStrength <= 0.08) continue;

          const weightedMassA = resistanceA * this._collisionMomentumMultiplier(a);
          const weightedMassB = resistanceB * this._collisionMomentumMultiplier(b);
          const weightedMassTotal = weightedMassA + weightedMassB;
          const compressionRatio = overlap / Math.max(0.05, minDistance);
          // Allies shove each other apart but do not knock each other over: contact inside a team adds nothing to balance pressure. A blow reaches the rank behind through the spillover below.
          const sameTeamPressureScale = 0;
          const enemyPressureScale = 0.92 + compressionRatio * 0.46 + impactSpeed * 0.08;
          const contactPressureScale = sameTeam ? sameTeamPressureScale : enemyPressureScale;
          const pressureScaleA = contactPressureScale * this._collisionMomentumMultiplier(b);
          const pressureScaleB = contactPressureScale * this._collisionMomentumMultiplier(a);
          // Two men running into each other do not knock each other down (trailer_3_sheet_01: foot soldiers meet and fight on their feet; men go down to a
          // blow, a charger or a giant): between two plain men (no size or charge momentum on either) only the shove, not the run-in speed, counts toward a
          // topple. The run-in still pushes, staggers and can interrupt a swing. Before, a head-on meet at a run put both on their backs and neither could
          // swing for ~1.75 s, so no club was ever seen coming down where two lines met (battle-feel.e). A meet is both men coming on (each closing at
          // MEET_CLOSING m/s or more), neither behind a full board: a man who runs onto a raised wall shield still bounces off it and goes over
          // (crowd_topple_clubber_vs_protector).
          const closingA = Vector3.Dot(a.collisionVelocity, normal);
          const closingB = -Vector3.Dot(b.collisionVelocity, normal);
          const plainMeet = !sameTeam && closingA >= MEET_CLOSING && closingB >= MEET_CLOSING
            && this._collisionMomentumMultiplier(a) === 1 && this._collisionMomentumMultiplier(b) === 1
            && !this._carriesWallShield(a) && !this._carriesWallShield(b);
          const shove = Math.min(4.5, overlap * 4.2 * contactBias);
          const toppleScale = plainMeet ? Math.min(1, shove / impulseStrength) : 1;
          a.applyCollisionImpulse(
            normal.scale(-impulseStrength * (weightedMassB / weightedMassTotal)),
            normal,
            pressureScaleA,
            b.contactRole,
            toppleScale,
          );
          b.applyCollisionImpulse(
            normal.scale(impulseStrength * (weightedMassA / weightedMassTotal)),
            normal.scale(-1),
            pressureScaleB,
            a.contactRole,
            toppleScale,
          );
          if (!sameTeam && impulseStrength >= 0.9) {
            const contactCenter = a.position.add(b.position).scale(0.5);
            this.impactPresentation?.recordImpact({
              source: "simulation",
              path: "crowd-shock",
              position: contactCenter,
              target: a,
              impulse: normal.scale(-impulseStrength),
              crowdMetrics: {
                pressure: impulseStrength * pressureScaleA,
                displacementMagnitude: overlap,
                impulseMagnitude: impulseStrength,
              },
              attackerTeam: b.team,
            });
            this.impactPresentation?.recordImpact({
              source: "simulation",
              path: "crowd-shock",
              position: contactCenter,
              target: b,
              impulse: normal.scale(impulseStrength),
              crowdMetrics: {
                pressure: impulseStrength * pressureScaleB,
                displacementMagnitude: overlap,
                impulseMagnitude: impulseStrength,
              },
              attackerTeam: a.team,
            });
            this._applySingleHopSpillover(a, normal.scale(-1), impulseStrength * a.pressureTransferScale, b.contactRole);
            this._applySingleHopSpillover(b, normal, impulseStrength * b.pressureTransferScale, a.contactRole);
          }
        }
      }
    }
  }

  private _applySingleHopSpillover(
    source: RuntimeUnit,
    awayDirection: Vector3,
    basePressure: number,
    contactRole: RuntimeUnit["contactRole"],
  ): void {
    if (basePressure <= 0.12) return;
    let candidate: RuntimeUnit | null = null;
    let bestDistanceSq = Number.POSITIVE_INFINITY;
    const radius = Math.max(2.2, source.collisionBodyRadius * 4.2);
    for (const other of this._units) {
      if (other === source || other.isDead || other.linkedParent || other.team !== source.team) continue;
      const delta = other.position.subtract(source.position);
      delta.y = 0;
      const distanceSq = delta.lengthSquared();
      if (distanceSq <= 0.0001 || distanceSq > radius * radius || distanceSq >= bestDistanceSq) continue;
      bestDistanceSq = distanceSq;
      candidate = other;
    }
    if (!candidate) return;

    const pressure = Math.min(1.45, basePressure);
    const push = awayDirection.scale(Math.min(0.18, pressure * 0.06));
    candidate.applyCrowdDisplacement(push, pressure, awayDirection, 0.58, contactRole);
    candidate.registerPressureTransfer(pressure, contactRole);
  }

  private _collisionMomentumMultiplier(unit: RuntimeUnit): number {
    let multiplier = 1;
    const abilities = new Set(unit.definition.abilities ?? []);
    const size = unit.definition.size ?? "medium";

    if (size === "large") multiplier += 0.08;
    if (size === "giant") multiplier += 0.18;
    if (size === "colossal") multiplier += 0.28;
    if (unit.definition.archetype === "charge_melee") multiplier += 0.18;
    if (unit.definition.archetype === "giant_melee") multiplier += 0.12;
    if (abilities.has("push_force")) multiplier += 0.25;
    if (abilities.has("giant_slam")) multiplier += 0.18;
    if (abilities.has("jump_charge") || abilities.has("leap_attack")) multiplier += 0.12;
    if (unit.isSpinning) multiplier += 0.1;

    return multiplier;
  }

  private _processUnitDecision(unit: RuntimeUnit, aiProfile: AIProfile, now: number): void {
    const attackProfile = getAttackProfile(unit.definition.attackProfileId);
    const preset = getBehaviorPreset(unit);
    const canAttack = unit.hasCapability("attack", now);
    const canMove = unit.hasCapability("move", now);
    unit.holdHeading(null);

    // Drunk (RuntimeUnit.getDrunk): he does not fight, he reels about on a heading that keeps swinging round
    if (unit.isDrunk) {
      const seed = this._units.indexOf(unit) * 2.4;
      const a = seed + now * DRUNK_WANDER.swing + Math.sin(now * 2.3 + seed) * 1.2;
      unit.moveTo(unit.position.add(new Vector3(Math.sin(a), 0, Math.cos(a)).scale(DRUNK_WANDER.reach)));
      this._clearPathState(unit);
      return;
    }

    // [S] 536 Mushroomed (RuntimeUnit.applyMushrooms, the Witch's spell): he ignores his enemies and goes for his nearest friend, striking him (SHROOM_TURN)
    if (unit.isShroomed(now)) {
      let friend: RuntimeUnit | null = null, best = Infinity;
      for (const man of this._units) {
        if (man === unit || man.isDead || man.team !== unit.team || man.isAnchoredActor) continue;
        const d = Vector3.Distance(man.position, unit.position);
        if (d < best) { best = d; friend = man; }
      }
      this._clearPathState(unit);
      if (!friend) { unit.stopMoving(); return; }
      const reach = Math.max(SHROOM_TURN.reach, Math.min(unit.definition.engageRange, SHROOM_TURN.reachMax));
      if (best > reach) { unit.moveTo(friend.position); return; }
      unit.stopMoving();
      unit.faceTarget(friend.position);
      if (now >= (this._kissAt.get(unit) ?? 0)) {
        this._kissAt.set(unit, now + SHROOM_TURN.every);
        unit.triggerAttackVisual(SHROOM_TURN.every * 0.6);
        friend.applyDamage(SHROOM_TURN.damage, friend.position.subtract(unit.position).normalize().scale(0.3));
        this._logAbility(unit, "turncoat", now, friend.position);
      }
      return;
    }

    // [S] 519 Lovestruck (RuntimeUnit.applyLove, Cupid's arrow): he does not fight his enemies, he goes to his nearest friend and kisses him (LOVE_KISS)
    if (unit.isLovestruck(now)) {
      let friend: RuntimeUnit | null = null, best = Infinity;
      for (const man of this._units) {
        if (man === unit || man.isDead || man.team !== unit.team || man.isAnchoredActor) continue;
        const d = Vector3.Distance(man.position, unit.position);
        if (d < best) { best = d; friend = man; }
      }
      this._clearPathState(unit);
      if (!friend) { unit.stopMoving(); return; }
      if (best > LOVE_KISS.reach) { unit.moveTo(friend.position); return; }
      unit.stopMoving();
      unit.faceTarget(friend.position);
      if (now >= (this._kissAt.get(unit) ?? 0)) {
        this._kissAt.set(unit, now + LOVE_KISS.every);
        friend.applyDamage(LOVE_KISS.drain * LOVE_KISS.every, Vector3.Zero());
      }
      return;
    }

    // Frightened (RuntimeUnit.applyFear, Stiffy Fear): he does not fight, he runs straight away from the man who scared him
    if (unit.isAfraid(now)) {
      const away = unit.position.subtract(unit.fearFrom);
      away.y = 0;
      if (away.lengthSquared() < 1e-4) away.set(1, 0, 0);
      unit.moveTo(unit.position.add(away.normalize().scale(STIFFY_FEAR.reach)));
      this._clearPathState(unit);
      return;
    }

    if (BEARER_AURA_KIND[unit.definition.id]) this._pulseBearerAura(unit, now);
    // [S] 469 a fresh barrel under the Barrel Roller once his next blow is ready (BARREL_ROLL.ridden)
    const ridden = this._barrelOut.get(unit);
    if (ridden && unit.canAttack(now)) {
      ridden.setEnabled(true);
      this._barrelOut.delete(unit);
    }

    if (attackProfile.type === AttackType.Support) {
      const ally = this._selectAllyToSupport(unit, aiProfile);
      if (!ally) {
        this._clearPathState(unit);
        return;
      }
      if (!canMove && Vector3.Distance(unit.position, ally.position) > unit.definition.engageRange + this.attackRangePadding) {
        unit.stopMoving();
        this._clearPathState(unit);
        return;
      }
      this._handleSupportAction(unit, ally, attackProfile, now);
      return;
    }

    const enemy = this._selectEnemyTarget(unit, aiProfile);
    if (!enemy) {
      unit.stopMoving();
      unit.setSpinning(false);
      this._clearPathState(unit);
      return;
    }

    // Reach is to the target's hide, not its middle: a giant's body keeps a man farther from its centre than his weapon is long, and he never swung.
    // ...and a giant is struck from the second rank too: it stands over the men at its hide, and those a rank's depth behind them reach it past their shoulders.
    const overRank = enemy.collisionBodyRadius > unit.collisionBodyRadius * 2 ? 1 : 0;
    const engageDistance = unit.definition.engageRange + this.attackRangePadding + Math.max(0, enemy.collisionBodyRadius - unit.collisionBodyRadius) + overRank;
    const distance = Vector3.Distance(unit.position, enemy.position);
    // Orb Casting Spell: throw from a casting hand rather than contact melee.
    if (unit.definition.id === "good.celestial_aegis") {
      unit.faceTarget(enemy.position);
      if (distance > 10) { if(canMove) this._moveUnitToward(unit,enemy.position,10,now); return; }
      unit.stopMoving();this._clearPathState(unit);
      if(canAttack && unit.canAttack(now) && this.projectileSystem) {
        unit.setAttackCooldown(now,2);unit.triggerAttackVisual(.55);
        worldMatrixChain(unit.body.rightHand);
        const from=unit.body.rightHand.getAbsolutePosition().clone();
        const dir=enemy.position.subtract(unit.position).normalize();
        this.projectileSystem.spawnProjectile("aegis_orb",from,enemy,attackProfile.damage*(unit.definition.damageMultiplier??1),dir.scale(8),0,unit.team,this._units,undefined,0,{originLift:0,targetLift:1,arc:.04});
        this._logAbility(unit,"cast_orb",now,enemy.position);
      }
      return;
    }
    // [S] 485 the Sacred Elephant's rider throws his two spears in turn (card Characteristics: "throws two deadly spears"); the empty fist is
    // re-armed .rearm s on. Each lands with a pull on the men round it (ProjectileSystem SPEAR_SUCK). The elephant walks and stomps meanwhile.
    if (unit.definition.id === "good.sacred_elephant") {
      const spears = unit.body.root.getChildMeshes(false).filter((m) => m.name === "elephantRiderSpear");
      for (const s of spears) if (!s.isEnabled() && now >= (this._spearBack.get(s) ?? 0)) s.setEnabled(true);
      const ready = spears.find((s) => s.isEnabled());
      if (ready && canAttack && distance <= 16 && now >= (this._spearReady.get(unit) ?? 0) && this.projectileSystem) {
        this._spearReady.set(unit, now + 1.2);
        worldMatrixChain(ready);
        const from = ready.getAbsolutePosition().clone();
        const dir = enemy.position.subtract(unit.position); dir.y = 0; dir.normalize();
        this.projectileSystem.spawnProjectile("spear", from, enemy, attackProfile.damage * (unit.definition.damageMultiplier ?? 1) * 0.5, dir.scale(4), 0, unit.team, this._units, undefined, 0, { originLift: 0, targetLift: 1, suck: "good.sacred_elephant" });
        ready.setEnabled(false); this._spearBack.set(ready, now + 3);
        this._logAbility(unit, "throw_spear", now, enemy.position);
      }
    }
    // [S] 485 Shockwave Hammer: once in reach the Paladin raises his arm and a giant hammer smashes onto the man (PALADIN_HAMMER)
    if (unit.definition.id === "good.righteous_paladin" && canAttack && distance <= PALADIN_HAMMER.reach && now >= (this._hammerReady.get(unit) ?? 0)) {
      this._hammerReady.set(unit, now + PALADIN_HAMMER.cooldown);
      unit.faceTarget(enemy.position); unit.triggerAttackVisual(.6);
      const dir = enemy.position.subtract(unit.position); dir.y = 0; dir.normalize();
      const hinge = paladinGiantHammer(unit);
      hinge.position.copyFrom(enemy.position.subtract(dir.scale(2.6))); hinge.position.y = enemy.position.y + .35;
      hinge.rotation.y = Math.atan2(dir.x, dir.z); hinge.rotation.x = PALADIN_HAMMER.raised;
      this._hammers.push({ unit, hinge, at: enemy.position.clone(), t0: now, damage: attackProfile.damage * (unit.definition.damageMultiplier ?? 1) * PALADIN_HAMMER.power, dir, struck: false });
      this._logAbility(unit, "cast_hammer", now, enemy.position);
      return;
    }
    // [S] 485 Radiant Glaive Throw (card Weapons: range 12, cooldown 1.25 s): the glaive leaves the hand as a spinning missile that
    // bounces on between enemies (ProjectileSystem RADIANT_BOUNCE); the held one is gone from the fist until it would be back.
    if (unit.definition.id === "good.radiant_glaive") {
      const held = unit.body.rightHand.getChildMeshes(false).find((m) => m.name === "radiantGlaive");
      if (held && !held.isEnabled() && now >= (this._glaiveBack.get(unit) ?? 0)) held.setEnabled(true);
      unit.faceTarget(enemy.position);
      if (distance > 12) { if (canMove) this._moveUnitToward(unit, enemy.position, 12, now); return; }
      unit.stopMoving(); this._clearPathState(unit);
      if (canAttack && unit.canAttack(now) && this.projectileSystem) {
        unit.setAttackCooldown(now, 1.25); unit.triggerAttackVisual(.5);
        worldMatrixChain(unit.body.rightHand);
        const from = unit.body.rightHand.getAbsolutePosition().clone();
        const dir = enemy.position.subtract(unit.position); dir.y = 0; dir.normalize();
        this.projectileSystem.spawnProjectile("radiant_glaive", from, enemy, attackProfile.damage * (unit.definition.damageMultiplier ?? 1), dir.scale(6), 0, unit.team, this._units, undefined, 0, { originLift: 0, targetLift: 1, arc: .05, bounces: 3 });
        if (held) { held.setEnabled(false); this._glaiveBack.set(unit, now + 1); }
        this._logAbility(unit, "throw_glaive", now, enemy.position);
      }
      return;
    }
    if (unit.definition.id === "legacy.super_boxer") {
      if (this._boxerDashes.has(unit)) return;
      if (canAttack && canMove && distance < 4.8 && now >= (this._boxerDashReady.get(unit) ?? 0) && unit.canAttack(now)) {
        const dir = enemy.position.subtract(unit.position); dir.y = 0; dir.normalize();
        const from = unit.position.clone(), back = from.subtract(dir.scale(2));
        const to = enemy.position.subtract(dir.scale(0.85)); to.y = from.y;
        unit.stopMoving(); this._clearPathState(unit);
        this._boxerDashes.set(unit, { from, back, to, target: enemy, start: now });
        // [S] 480: white-yellow tails sample both moving glove positions
        // through the back-dash, return punch and its follow-through.
        this.visualEffects?.spawnWristRibbons([unit.body.leftHand, unit.body.rightHand].map(hand => () => {
          worldMatrixChain(hand); return hand.getAbsolutePosition().clone();
        }), 0.8, true);
        this._boxerDashReady.set(unit, now + 4);
        this._logAbility(unit, "boxer_backdash", now, from);
        return;
      }
    }
    // A lancer lays his couched lance on the man he rides at (aimLanceAt): at the man's chest, LANCE_AIM_REACH m out, at LANCE_CHEST of his height up
    if (distance <= engageDistance + LANCE_AIM_REACH && unit.body.rightHand?.getChildren().some((n) => n.name === "lance")) {
      unit.animator.aimLanceAt(new Vector3(enemy.position.x, enemy.position.y + (enemy.body.headTop.getAbsolutePosition().y - enemy.position.y) * LANCE_CHEST, enemy.position.z));
    }

    if (hasAbility(unit, "teleport") && distance > engageDistance && distance < engageDistance * 3 && unit.canAttack(now)) {
      // [S] 495 the Shadow Walker's Assassin Poof: a dark violet cloud where he vanishes and where he lands (visualEffects spawnShadowPoof)
      const poof = unit.definition.id === "evil.shadow_walker";
      if (this.visualEffects) { if (poof) this.visualEffects.spawnShadowPoof(unit.position); else this.visualEffects.spawnSmokePuff(unit.position); }
      const dir = enemy.position.subtract(unit.position).normalize();
      const teleportDist = Math.min(distance - engageDistance * 0.65, 8);
      const newPos = unit.position.add(dir.scale(teleportDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      if (this.visualEffects) { if (poof) this.visualEffects.spawnShadowPoof(newPos); else this.visualEffects.spawnSmokePuff(newPos); }
      unit.setAttackCooldown(now, attackProfile.cooldown * 0.5);
      this._logAbility(unit, "teleport", now);
      return;
    }

    // [S] 474 the Super Peasant flies at the man (SUPER_FLIGHT) in place of the blink: while a flight is under way he takes no other decision
    if (preset === "iconic_super_peasant" && this._superFlights.has(unit)) return;
    if (preset === "iconic_super_peasant" && distance > engageDistance && distance < engageDistance * SUPER_FLIGHT.reach && unit.canAttack(now)) {
      const dir = enemy.position.subtract(unit.position);
      dir.y = 0;
      dir.normalize();
      const to = enemy.position.subtract(dir.scale(engageDistance * 0.6));
      to.y = 0;
      const from = unit.position.clone();
      from.y = 0;
      this._superFlights.set(unit, { from, to, t0: now, dur: Math.max(SUPER_FLIGHT.minDur, Vector3.Distance(from, to) / SUPER_FLIGHT.speed), logged: false });
      unit.stopMoving();
      this._clearPathState(unit);
      unit.animator.setSuperman(true);
      this.visualEffects?.spawnWristRibbons([unit.body.leftHand, unit.body.rightHand].map(hand => () => {
        worldMatrixChain(hand);
        return hand.getAbsolutePosition().clone();
      }), Math.max(SUPER_FLIGHT.minDur, Vector3.Distance(from, to) / SUPER_FLIGHT.speed) + 0.1);
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(unit.position, new Color3(1.0, 0.88, 0.35));
      return;
    }
    if ((preset === "iconic_super_peasant" || preset === "iconic_thor") && distance > engageDistance && distance < engageDistance * (preset === "iconic_super_peasant" ? 5.5 : 3.0) && unit.canAttack(now)) {
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(
          unit.position,
          preset === "iconic_super_peasant" ? new Color3(1.0, 0.88, 0.35) : undefined,
        );
      }
      const dir = enemy.position.subtract(unit.position).normalize();
      const teleportDist = Math.min(distance - engageDistance * 0.45, preset === "iconic_super_peasant" ? 9.5 : 4.6);
      const newPos = unit.position.add(dir.scale(teleportDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(
          newPos,
          preset === "iconic_super_peasant" ? new Color3(1.0, 0.9, 0.45) : undefined,
        );
      }
      unit.setAttackCooldown(now, attackProfile.cooldown * (preset === "iconic_super_peasant" ? 0.18 : 0.32));
      this._logAbility(unit, "blink", now);
      return;
    }

    // Bomb Spin (BOMB_SPIN): a spin under way holds her where she whirls; outnumbered close in with it ready, she starts one
    if (BOMB_SPIN.units.has(unit.definition.id)) {
      if (this._bombSpins.has(unit)) {
        unit.stopMoving();
        this._clearPathState(unit);
        return;
      }
      if (now >= (this._bombSpinReadyAt.get(unit) ?? 0)) {
        let near = 0;
        for (const other of this._units) {
          if (other.isDead || other.team === unit.team) continue;
          const dx = other.position.x - unit.position.x, dz = other.position.z - unit.position.z;
          if (dx * dx + dz * dz <= BOMB_SPIN.within * BOMB_SPIN.within) near++;
        }
        if (near >= BOMB_SPIN.crowd) {
          const damage = attackProfile.damage * (unit.definition.damageMultiplier ?? 1) * BOMB_SPIN.damage;
          this._bombSpins.set(unit, { dropAt: now + BOMB_SPIN.drop, endAt: now + BOMB_SPIN.drop + BOMB_SPIN.after, dropped: false, damage });
          this._bombSpinReadyAt.set(unit, now + BOMB_SPIN.cooldown);
          unit.animator.setBombSpin(true);
          unit.stopMoving();
          this._clearPathState(unit);
          return;
        }
      }
    }

    // The Captain's dragon pistol (DRAGON_BLAST): a man in its range with it ready is shot from the bell; the captain keeps on at him
    if (DRAGON_BLAST.units.has(unit.definition.id) && !enemy.isDead) {
      const B = DRAGON_BLAST;
      if (distance > B.range) {
        if (this._blastReadyAt.has(unit) && now >= this._blastReadyAt.get(unit)!) this._blastReadyAt.delete(unit);
      } else if (!this._blastReadyAt.has(unit)) {
        this._blastReadyAt.set(unit, now + B.warmup);
      } else if (now >= this._blastReadyAt.get(unit)!) {
        this._blastReadyAt.set(unit, now + B.cooldown);
        this._fireDragonPistol(unit, enemy, attackProfile.damage * (unit.definition.damageMultiplier ?? 1) * B.damage, now);
      }
    }

    // Pirate Kick (PIRATE_KICK): a man kicking stands over it; a man in reach of his foot with it ready gets one
    if (PIRATE_KICK.units.has(unit.definition.id)) {
      const kick = this._kicks.get(unit);
      if (kick) {
        unit.stopMoving();
        this._clearPathState(unit);
        unit.faceTarget(kick.target.position);
        return;
      }
      const KK = kickOf(unit.definition.id);
      const reach = unit.collisionBodyRadius + enemy.collisionBodyRadius + KK.within;
      // a man mid-dodge (the Jester's flip), knocked flat or in the air kicks only once back on his feet
      const onFeet = !this._recovers.has(unit) && !unit.isToppled && !unit.isDowned && !unit.isAirborne;
      if (distance <= reach && now >= (this._kickReadyAt.get(unit) ?? 0) && onFeet) {
        const damage = attackProfile.damage * (unit.definition.damageMultiplier ?? 1) * KK.damage;
        this._kicks.set(unit, { target: enemy, blowAt: now + KK.windup, endAt: now + KK.windup + KK.recover, done: false, damage });
        this._kickReadyAt.set(unit, now + KK.cooldown);
        unit.animator.setKick(true, KK.windup, KK.raise);
        unit.stopMoving();
        this._clearPathState(unit);
        unit.faceTarget(enemy.position);
        return;
      }
    }

    // Big Headbutt (BIG_HEADBUTT): a minotaur butting stands over it; one in reach with it ready starts one. ...and the Headbutter's own (HEADBUTT)
    const buttSpec = unit.definition.id === "ancient.minotaur" ? BIG_HEADBUTT : unit.definition.id === "viking.headbutter" ? HEADBUTT : null;
    if (buttSpec) {
      if (this._butts.has(unit)) {
        unit.stopMoving();
        this._clearPathState(unit);
        unit.faceTarget(this._butts.get(unit)!.target.position);
        return;
      }
      // the minotaur's first butt is a cooldown into the battle, so he opens with his fists; the headbutter opens with his
      const readyAt = this._buttReadyAt.get(unit) ?? (buttSpec === HEADBUTT ? 0 : this._battleStartedAt + BIG_HEADBUTT.cooldown);
      if (!this._charges.has(unit) && distance <= engageDistance + buttSpec.within && now >= readyAt) {
        this._butts.set(unit, { target: enemy, blowAt: now + buttSpec.windup, endAt: now + buttSpec.windup + buttSpec.recover, done: false, spec: buttSpec });
        this._buttReadyAt.set(unit, now + buttSpec.cooldown);
        unit.animator.setCharging(true, buttSpec === BIG_HEADBUTT);
        unit.stopMoving();
        this._clearPathState(unit);
        unit.faceTarget(enemy.position);
        // [S] 400 the headbutter dives head first (critic 399: "bowing about 90 at the waist with both feet planted ... he never leaves the vertical"):
        // he throws himself at the man over the windup, the dive pose on from the first frame, so the ram lands at the blow with him off the ground
        if (buttSpec === HEADBUTT) {
          const step = enemy.position.subtract(unit.position);
          step.y = 0;
          const gap = step.length() - unit.collisionBodyRadius - enemy.collisionBodyRadius;
          unit.animator.setDive(true);
          // [S] 401 the leap covers the gap plus .reach, so the spike meets him (critic 400: "the spike stops short")
          const dist = Math.min(1.7, Math.max(0.5, gap + HEADBUTT.reach));
          if (step.lengthSquared() > 1e-4 && !unit.leap(step.normalize(), dist, HEADBUTT.dive)) {
            unit.moveTo(unit.position.add(step.normalize().scale(HEADBUTT.lunge)));
          }
        } else if (buttSpec.lunge > 0) {
          // the minotaur drives a step onto him with the head
          const step = enemy.position.subtract(unit.position);
          step.y = 0;
          if (step.lengthSquared() > 1e-4) unit.moveTo(unit.position.add(step.normalize().scale(buttSpec.lunge)));
        }
        return;
      }
    }

    // Mammoth Charge: start a run at a man far enough off, and while running, drive on through him (MAMMOTH_CHARGE); the wheelbarrow's ram (WHEELBARROW_RAM)
    const chargeSpec = preset === "iconic_mammoth" ? MAMMOTH_CHARGE : unit.definition.id === "farmer.wheelbarrow" ? WHEELBARROW_RAM
      : unit.definition.id === "medieval.knight" ? KNIGHT_CHARGE : unit.definition.id === "renaissance.jouster" ? JOUSTER_CHARGE
      : unit.definition.id === "ancient.minotaur" ? MINOTAUR_CHARGE : unit.definition.id === "evil.death_bringer" ? DEATH_CHARGE
      : unit.definition.id === "secret.raptor_rider" ? RAPTOR_CHARGE : unit.definition.id === "secret.cavalry" ? CAVALRY_CHARGE : null;
    if (chargeSpec && canMove) {
      const run = this._charges.get(unit);
      if (run && (!unit.isCharging || (run.target.isDead && !run.end))) {
        unit.endCharge();
        this._charges.delete(unit);
      } else if (!run && distance > engageDistance + chargeSpec.from && distance < engageDistance + chargeSpec.reach && now >= (this._chargeReadyAt.get(unit) ?? 0)) {
        const dir = enemy.position.subtract(unit.position);
        dir.y = 0;
        // [S] 530 the Cavalry horse pulls back before it charges (CAVALRY_WAVE.pull)
        if (chargeSpec === CAVALRY_CHARGE) {
          const until = this._cavalryPull.get(unit);
          if (until === undefined) { this._cavalryPull.set(unit, now + CAVALRY_WAVE.pull); this._logAbility(unit, "pull_back", now, enemy.position); }
          if (until === undefined || now < until) {
            unit.moveTo(unit.position.subtract(dir.normalizeToNew().scale(CAVALRY_WAVE.back)));
            this._clearPathState(unit);
            unit.faceTarget(enemy.position);
            return;
          }
          this._cavalryPull.delete(unit);
        }
        unit.startCharge(chargeSpec.speed, now + chargeSpec.seconds);
        this._charges.set(unit, { target: enemy, dir: dir.normalize(), trampled: new Set(), spec: chargeSpec, end: null });
        this._chargeReadyAt.set(unit, now + chargeSpec.cooldown);
        if (chargeSpec.log) this._logAbility(unit, "charge", now, enemy.position);
        if (this.visualEffects) this.visualEffects.spawnSmokePuff(unit.position, CHARGE_DUST);
      }
      const charging = this._charges.get(unit);
      if (charging) {
        if (charging.end) {
          // driven through: on to the point past where its man stood, then the run is over
          const left = charging.end.subtract(unit.position);
          left.y = 0;
          if (left.length() < 0.4) {
            unit.endCharge();
            this._charges.delete(unit);
          } else {
            unit.moveTo(charging.end);
            this._clearPathState(unit);
            unit.faceTarget(charging.end);
            return;
          }
        } else {
          const ahead = charging.target.position.subtract(unit.position);
          ahead.y = 0;
          if (ahead.lengthSquared() > 0.01) charging.dir = ahead.normalize();
          unit.moveTo(charging.target.position.add(charging.dir.scale(chargeSpec.overrun)));
          this._clearPathState(unit);
          unit.faceTarget(charging.target.position);
          return;
        }
      }
    }

    // Foolish Jump: pull back holding the stone, then fling forward into melee.
    if (unit.definition.id === "secret.ball_n_chain") {
      if (unit.isAirborne) return;
      const windup = this._foolishWindup.get(unit);
      if (!canMove || distance > engageDistance + 3.4) this._foolishWindup.delete(unit);
      else if (windup !== undefined || (distance > engageDistance && now >= (this._jumpReadyAt.get(unit) ?? 0))) {
        const dir = new Vector3(enemy.position.x - unit.position.x, 0, enemy.position.z - unit.position.z).normalize();
        unit.faceTarget(enemy.position);
        this._clearPathState(unit);
        if (windup === undefined || now < windup) {
          if (windup === undefined) this._foolishWindup.set(unit, now + 0.24);
          unit.moveTo(unit.position.subtract(dir.scale(0.5)));
          return;
        }
        this._foolishWindup.delete(unit);
        if (unit.leap(dir, Math.max(0.5, distance - engageDistance * 0.4), 6.5)) {
          this._jumpReadyAt.set(unit, now + 5);
          this._logAbility(unit, "foolish_jump", now, enemy.position);
          return;
        }
      }
    }

    // The Executioner raises his axe on a short hop and starts the chop on landing.
    if (unit.definition.id === "secret.executioner") {
      if (unit.isAirborne) return;
      if (canMove && distance > engageDistance * 0.65 && distance < engageDistance + 1.5
        && unit.canAttack(now) && now >= (this._jumpReadyAt.get(unit) ?? 0)) {
        const dir = new Vector3(enemy.position.x - unit.position.x, 0, enemy.position.z - unit.position.z).normalize();
        unit.faceTarget(enemy.position);
        if (unit.leap(dir, distance - engageDistance * 0.45, 5)) {
          unit.triggerAttackVisual(0.46);
          this._jumpReadyAt.set(unit, now + 2);
          this._clearPathState(unit);
          this._logAbility(unit, "executioner_jump", now, enemy.position);
          return;
        }
      }
    }

    // Halfling Jump (HALFLING_JUMP): onto the man from up to 4 m off
    if (unit.definition.id === "farmer.halfling" && canMove && distance > engageDistance + HALFLING_JUMP.from && distance < engageDistance + HALFLING_JUMP.reach
      && now >= (this._jumpReadyAt.get(unit) ?? 0)) {
      const dir = enemy.position.subtract(unit.position);
      dir.y = 0;
      dir.normalize();
      unit.faceTarget(enemy.position);
      if (unit.leap(dir, Math.max(0.5, distance - HALFLING_JUMP.short), HALFLING_JUMP.rise)) {
        this._jumpReadyAt.set(unit, now + HALFLING_JUMP.cooldown);
        this._clearPathState(unit);
        this._logAbility(unit, "leap", now, enemy.position);
        return;
      }
    }

    // Hop back (HOP_BACK): the fencer off his man after the thrust, the halberd off a man come inside his pole
    const hop = HOP_BACK[unit.definition.id];
    if (hop && canMove && now >= (this._hopReadyAt.get(unit) ?? 0) && !this._pendingBlows.some((b) => b.attacker === unit)) {
      const landed = this._landedAt.get(unit);
      const due = hop.afterLand !== undefined
        ? landed !== undefined && now - landed >= hop.afterLand && now - landed < hop.afterLand + 0.6 && distance < engageDistance
        : distance - unit.collisionBodyRadius - enemy.collisionBodyRadius < (hop.close ?? 0);
      if (due) {
        const away = unit.position.subtract(enemy.position);
        away.y = 0;
        if (away.lengthSquared() < 1e-6) away.set(Math.sin(unit.body.root.rotation.y + Math.PI), 0, Math.cos(unit.body.root.rotation.y + Math.PI));
        away.normalize();
        unit.faceTarget(enemy.position);
        if (unit.leap(away, hop.dist, hop.rise)) {
          this._hopReadyAt.set(unit, now + hop.cooldown);
          this._landedAt.delete(unit);
          this._clearPathState(unit);
          this._logAbility(unit, hop.kind, now, enemy.position);
          return;
        }
      }
    }

    // ...and a flying melee unit (the Valkyrie's flying_hover) dives on the man from the same band, a flatter arc logged "swoop". Gated to flying_melee:
    // the balloon archer and the other ranged flyers list flying_hover too, and a melee dive on every flyer would throw them (critic 392).
    const flies = hasAbility(unit, "flying_hover") && unit.definition.archetype === "flying_melee";
    if ((hasAbility(unit, "jump_charge") || hasAbility(unit, "leap_attack") || flies) && distance > engageDistance && distance < engageDistance * 2.5 && unit.canAttack(now)) {
      // [S] Super Jump (392; viking.berserker.jpg, card "Super Jump: leaps towards the enemy", viking.berserker.red.png: mid-air with the legs
      // kicked and both axes out). The leap used to be a teleport to the landing spot, so no shot ever caught him off the ground; it is thrown
      // now by RuntimeUnit.leap (the halfling's arc: rise .rise m/s up, flat speed for `leapDist` under gravity and the air drag), the air pose
      // taking the legs and the arms over for the flight. The leap is logged at its take-off as "leap", the event the capture shoots.
      const dir = new Vector3(enemy.position.x - unit.position.x, 0, enemy.position.z - unit.position.z);
      if (dir.lengthSquared() > 1e-6) dir.normalize();
      const leapDist = Math.min(distance - engageDistance * 0.4, 4.5);
      if (unit.leap(dir, leapDist, flies ? JUMP_CHARGE.swoopRise : JUMP_CHARGE.rise)) {
        this._clearPathState(unit);
        unit.setAttackCooldown(now, attackProfile.cooldown * 0.35);
        // [S] 437 the Vampire flies it as a bat (spookyDress VAMPIRE_BAT, RuntimeUnit.startBatForm)
        if (unit.definition.id === "spooky.vampire") unit.startBatForm();
        // [S] 519 the Taekwondo flies it as a flying kick, posed outright on this tick (ProceduralAnimator.setFlyKick)
        if (unit.definition.id === "secret.taekwondo") { unit.animator.setFlyKick(true); unit.animator.poseFlyKick(); }
        this._logAbility(unit, flies ? "swoop" : "leap", now);
        return;
      }
    }

    // Banjo Walk: in close enough to be noticed, then off round him in circles, playing (BANJO_WALK)
    if (unit.definition.id === "medieval.bard" && canMove) {
      const side = this._banjoWalks.get(unit);
      const lure = engageDistance + BANJO_WALK.lure;
      if (distance > engageDistance && distance < (side === undefined ? lure : lure + BANJO_WALK.clear)) {
        let turn = side;
        if (turn === undefined) {
          turn = this._banjoTurns++ % 2 === 0 ? 1 : -1;
          this._banjoWalks.set(unit, turn);
          this._logAbility(unit, "banjo_walk", now, enemy.position);
          for (let i = 0; i < BANJO_NOTES.first; i++) this._playBanjoNote(unit, i * BANJO_NOTES.stack);
          this._banjoNotes.set(unit, now + BANJO_NOTES.every);
        }
        if (now >= (this._banjoNotes.get(unit) ?? now)) {
          this._playBanjoNote(unit, 0);
          this._banjoNotes.set(unit, now + BANJO_NOTES.every);
        }
        const away = unit.position.subtract(enemy.position);
        away.y = 0;
        away.normalize();
        const a = turn * BANJO_WALK.turn;
        const dir = new Vector3(away.x * Math.cos(a) - away.z * Math.sin(a), 0, away.x * Math.sin(a) + away.z * Math.cos(a));
        unit.moveTo(unit.position.add(dir.scale(BANJO_WALK.step)));
        this._clearPathState(unit);
        return;
      }
      this._banjoWalks.delete(unit);
      this._banjoNotes.delete(unit);
    }

    if (hasAbility(unit, "spin_move") && distance > engageDistance) {
      if (!canMove) {
        unit.stopMoving();
        unit.setSpinning(false);
        this._clearPathState(unit);
        return;
      }
      this._moveUnitToward(unit, enemy.position, engageDistance, now);
      if (!unit.isSpinning) this._logAbility(unit, "spin", now);
      unit.setSpinning(true);
      if (this.visualEffects && Math.random() < 0.35) {
        this.visualEffects.spawnTornadoDust(unit.position);
      }
      return;
    }
    unit.setSpinning(false);
    const spearSlot = this._shieldSlots.get(unit);
    if (spearSlot && distance <= engageDistance + this.spearLevelReach) unit.levelSpearAt(enemy.position, enemy.collisionBodyRadius, spearSlot.hold !== null);
    if (attackProfile.type === AttackType.Melee && distance <= engageDistance + this.blowReadyReach) {
      const inReach = distance <= engageDistance + this.blowStrikeReach;
      // A rank back, behind a man of his own side, a clubber rests his club low over that man's shoulder between beats and strikes from there on his beat
      const behind = !inReach && distance <= engageDistance + this.blowStrikeReach + REAR_RANK_REACH && this._allyBetween(unit, enemy);
      unit.readyBlow(inReach || behind, enemy, behind);
    }

    if (distance <= engageDistance) {
      // Reach decides who may swing, not where the rank stops: short weapons shove in to
      // shoulder contact so the two front lines meet instead of fencing across a gap.
      // Bracers hold their ground and let the rush come onto the shields, but two shield lines facing each other both close.
      const contactDistance = unit.collisionBodyRadius + enemy.collisionBodyRadius + this.meleePressGap;
      const presses = (aiProfile.id !== "ai.brace" || enemy.definition.aiProfileId === "ai.brace") && unit.definition.engageRange < this.meleePressMaxReach;
      // A carrier out of its slot sidles along the wall into it while it fights.
      const slot = this._shieldSlots.get(unit);
      // Strike stand-off (open field: neither man in a shield wall): a man who brings a club or a blade down on a man stops STRIKE_STAND past
      // body contact, where the weapon falls on the other's crown or board top from overhead (trailer_3_sheet_01 r2c3: the clubbers strike from a
      // club's length), instead of walking into shoulder contact (pose bench: roots 0.9 m apart at the land, nearer than the club is long, so the
      // club could only cross the man's front or stand upright behind the fists). A wall's press keeps closing to contact.
      const standOff = !slot && !this._shieldSlots.get(enemy) && unit.swingsAtMan ? STRIKE_STAND : 0;
      const strikeDistance = contactDistance + standOff;
      const sidle = this._shieldSlotStep(unit, true);
      // Farmer back-step (FARMER_BACKSTEP): between stabs he backs off his man, facing him
      const farmerBacks = unit.definition.id === "farmer.farmer" && canMove && !slot && !unit.canAttack(now)
        && now - (this._stabbedAt.get(unit) ?? -1e9) > FARMER_BACKSTEP.after && distance < engageDistance - FARMER_BACKSTEP.margin;
      // ...and the sarissa keeps his pike's distance (SARISSA_KEEP)
      const sarissaKeeps = unit.definition.id === "ancient.sarissa" && canMove && !slot && unit.animator.state !== AnimState.Attacking
        && distance < engageDistance * SARISSA_KEEP.near;
      const backing = farmerBacks || sarissaKeeps;
      if (backing) {
        const away = unit.position.subtract(enemy.position);
        away.y = 0;
        away.normalize();
        unit.moveTo(unit.position.add(away.scale(0.5)));
        unit.setCohesionMoveMultiplier(sarissaKeeps ? SARISSA_KEEP.pace : FARMER_BACKSTEP.pace);
        unit.holdHeading(Math.atan2(-away.x, -away.z));
        if (!this._backingOff.has(unit)) this._logAbility(unit, "backstep", now, enemy.position);
        this._backingOff.add(unit);
      } else if (this._backingOff.delete(unit)) {
        unit.holdHeading(null);
        unit.stopMoving();
      }
      if (backing) {
        // backing off: the step is set above
      } else if (canMove && slot?.hold) {
        // A rear-rank man keeps his place behind the boards and fights over them: he does not press through the front.
        if (sidle) unit.moveTo(unit.position.add(sidle));
        else unit.stopMoving();
      } else if (canMove && presses && distance > strikeDistance + 0.05) {
        const back = unit.position.subtract(enemy.position);
        back.y = 0;
        const stand = enemy.position.add(back.normalize().scale(strikeDistance));
        unit.moveTo(sidle ? stand.addInPlace(sidle) : stand);
      } else if (canMove && sidle) {
        unit.moveTo(unit.position.add(sidle));
      } else {
        unit.stopMoving();
      }
      this._clearPathState(unit);
      unit.faceTarget(enemy.position);
      if (slot) this._holdWallHeading(unit, slot, enemy);
      if (attackProfile.type === AttackType.Melee) unit.leanIntoShove();
      // [S] 454 a gunman in range holds his aim between shots (the Deadeye's levelled Winchester, proceduralAnimation WINCHESTER_AIM)
      else unit.readyAim(this._chestOf(enemy));
      // A presser with a club or a blade does not swing from two strides off: while he is still closing he holds it cocked, and brings it down once he
      // is at the man's shoulder, or has stopped closing (the crowd or a board holds him off).
      const closingFrom = this._closingFrom.get(unit);
      this._closingFrom.set(unit, distance);
      const closing = presses && canMove && !slot?.hold && unit.swingsAtMan && distance > strikeDistance + BLOW_CONTACT_SLACK
        && (closingFrom === undefined || distance < closingFrom - 0.02);
      // one-blow-per-man: a striker who has closed on his man takes his own beat before his first blow, STRIKE_LAG of a spread fixed per man, so a
      // line that arrives together does not bring every weapon down on the same step (r2c3: one club down on its man, the next still high)
      let lagged = false;
      if (unit.swingsAtMan) {
        if (closing) this._strikeReadyAt.delete(unit);
        else {
          if (!this._strikeReadyAt.has(unit)) this._strikeReadyAt.set(unit, now + STRIKE_LAG * unit.vary(17));
          lagged = now < (this._strikeReadyAt.get(unit) ?? 0);
          // ...his club stood upright over his shoulder meanwhile (ready-club-upright)
          if (lagged) unit.animator.waitBeat();
        }
      }
      if (GUN_WARMUP.units.has(unit.definition.id)) {
        if (!this._aimReadyAt.has(unit)) this._aimReadyAt.set(unit, now + GUN_WARMUP.warmup);
        lagged ||= now < (this._aimReadyAt.get(unit) ?? 0);
      }
      if (canAttack && !closing && !lagged) {
        const ready = unit.canAttack(now);
        this._tryAttack(unit, enemy, attackProfile, now);
        if (ready && !unit.canAttack(now) && unit.definition.id === "farmer.farmer") this._stabbedAt.set(unit, now);
      }
    } else {
      this._aimReadyAt.delete(unit);
      if (canMove) {
        this._moveUnitToward(unit, enemy.position, engageDistance, now);
      } else {
        unit.stopMoving();
        this._clearPathState(unit);
      }
    }
  }

  private readonly _bearerAuraAt = new WeakMap<RuntimeUnit, number>();
  private readonly _kissAt = new WeakMap<RuntimeUnit, number>();

  /** [S] 460/465 a bearer's ring (haste for the Flag Bearer, stay for the Banner Bearer) holds every ally inside it; it pulses on its own clock, beside his blows. */
  private _pulseBearerAura(bearer: RuntimeUnit, now: number): void {
    const aura = BEARER_AURA_KIND[bearer.definition.id];
    if (!aura || now < (this._bearerAuraAt.get(bearer) ?? 0)) return;
    const reach = bearerReach(bearer.body);
    const held = this._units.filter((man) => man !== bearer && !man.isDead && man.team === bearer.team && Vector3.Distance(man.position, bearer.position) <= reach);
    if (held.length === 0) return;
    this._bearerAuraAt.set(bearer, now + BEARER_PULSE.every);
    const ringMesh = bearer.body.root.getChildMeshes(false, (m) => m.name === "bearerRing")[0];
    for (const man of held) man.applyAura(aura, BEARER_PULSE.holds, now, ringMesh?.material ?? null);
    this._logAbility(bearer, aura, now, bearer.position);
  }

  private _handleSupportAction(
    supporter: RuntimeUnit, ally: RuntimeUnit,
    attackProfile: AttackProfile, now: number,
  ): void {
    const engageDistance = supporter.definition.engageRange + this.attackRangePadding;
    const distance = Vector3.Distance(supporter.position, ally.position);

    if (distance > engageDistance) {
      this._moveUnitToward(supporter, ally.position, engageDistance, now);
      return;
    }

    supporter.stopMoving();
    this._clearPathState(supporter);
    supporter.faceTarget(ally.position);
    if (!supporter.canAttack(now)) return;

    const cooldownMultiplier = supporter.definition.cooldownMultiplier ?? 1;
    supporter.setAttackCooldown(now, attackProfile.cooldown * cooldownMultiplier);
    let healAmount = Math.max(20, attackProfile.damage);
    if (getBehaviorPreset(supporter) === "secret_cheerleader") {
      healAmount = Math.max(healAmount, 45);
      // [S] 518 (c.1) multi-coloured confetti round the buffed man (card Characteristics), not a smoke puff
      if (this.visualEffects) this.visualEffects.spawnConfetti(ally.position);
      // [S] 519 (c.2) poms thrown up and shaken at the friend while she buffs (RuntimeUnit.startCheer)
      supporter.startCheer(now);
    }
    ally.heal(healAmount);
    // The Healer's Priest Staff: a gold beam from the staff's orb to the man, who goes gold while it holds (HEAL_BEAM, GILD), until near the next heal
    if (supporter.definition.id === "medieval.healer") {
      const beamFor = attackProfile.cooldown * cooldownMultiplier * HEALER_BEAM_SHARE;
      ally.gild(beamFor);
      if (this.visualEffects) {
        const orb = supporter.body.root.getDescendants(false, (n) => n.name === "orb")[0] as TransformNode | undefined;
        this.visualEffects.spawnHealBeam(
          () => {
            if (supporter.isDead) return null;
            if (!orb) return supporter.position.add(new Vector3(0, 1.4, 0));
            worldMatrixChain(orb);
            return orb.getAbsolutePosition().clone();
          },
          () => {
            if (ally.isDead) return null;
            const torso = (ally.body as { torso?: TransformNode }).torso;
            if (!torso) return ally.position.add(new Vector3(0, 1, 0));
            worldMatrixChain(torso);
            return torso.getAbsolutePosition().clone();
          },
          beamFor,
        );
      }
    }
    this._logAbility(supporter, "heal", now, ally.position);
  }

  /** [S] 499 a running Death Bringer cuts a man he passes (DEATH_CHARGE): a swing, the blade's damage, a shove aside, his pink trail, logged as a blow. */
  private _chargeCut(unit: RuntimeUnit, man: RuntimeUnit, dir: Vector3, now: number): void {
    const C = DEATH_CHARGE;
    const off = man.position.subtract(unit.position); off.y = 0;
    const across = new Vector3(dir.z, 0, -dir.x);
    const side = Vector3.Dot(off, across) >= 0 ? 1 : -1;
    const aside = across.scale(side).add(dir.scale(0.4)).normalize();
    unit.triggerAttackVisual(C.swing);
    man.applyDamage(C.damage, aside.scale(C.fling));
    man.applyBlastLaunch(aside, C.fling, C.lift);
    if (this.visualEffects) {
      const n = (this._deathSlashes.get(unit) ?? 0) + 1; this._deathSlashes.set(unit, n);
      this.visualEffects.spawnSlashArc(man.position.add(new Vector3(0, DEATH_SLASH.chest, 0)), dir, { ...DEATH_SLASH, tilt: (n % 2 ? 1 : -1) * DEATH_SLASH.tilt });
    }
    if (this.hitLog.length >= 200) this.hitLog.shift();
    worldMatrixChain(man.body.headTop);
    const head = man.body.headTop.getAbsolutePosition();
    this.hitLog.push({ t: now, attackerUnit: unit.definition.id, targetUnit: man.definition.id, x: man.position.x, y: man.position.y + DEATH_SLASH.chest, z: man.position.z, head: { x: head.x, y: head.y, z: head.z } });
    this._logAbility(unit, "charge_cut", now, man.position);
  }

  /** Every charging mammoth tramples the enemies its body meets ahead of its middle (MAMMOTH_CHARGE), each once per run; its own target ends the run. */
  private _trampleCharges(now: number): void {
    for (const [unit, run] of this._charges) {
      if (unit.isDead || !unit.isCharging) {
        unit.endCharge();
        this._charges.delete(unit);
        this._chargeDustAt.delete(unit);
        continue;
      }
      // [S] 363 the mammoth's run kicks dust up at its feet all the way (MAMMOTH_DUST), not only one puff where it set off
      if (run.spec === MAMMOTH_CHARGE && this.visualEffects && now >= (this._chargeDustAt.get(unit) ?? 0)) {
        const k = this._chargeDustKick.get(unit) ?? 0;
        this._chargeDustKick.set(unit, k + 1);
        this._chargeDustAt.set(unit, now + MAMMOTH_DUST.every);
        const across = new Vector3(run.dir.z, 0, -run.dir.x);
        const r = unit.collisionBodyRadius;
        for (const [ahead, side] of MAMMOTH_DUST.feet[k % 2]) {
          const at = unit.position.add(run.dir.scale(ahead * r)).add(across.scale(side * r));
          at.y = unit.position.y;
          this.visualEffects.spawnKickDust(at, MAMMOTH_DUST.size);
        }
      }
      if (run.spec === RAPTOR_CHARGE && this.visualEffects && now >= (this._chargeDustAt.get(unit) ?? 0)) {
        const k = this._chargeDustKick.get(unit) ?? 0;
        this._chargeDustKick.set(unit, k + 1);
        this._chargeDustAt.set(unit, now + RAPTOR_STOMP.every);
        const across = new Vector3(run.dir.z, 0, -run.dir.x), r = unit.collisionBodyRadius;
        const at = unit.position.add(run.dir.scale(RAPTOR_STOMP.ahead * r)).add(across.scale((k % 2 ? 1 : -1) * RAPTOR_STOMP.side * r));
        at.y = unit.position.y;
        this.visualEffects.spawnExplosionBurst(at, RAPTOR_STOMP.size);
      }
      // [S] 530 the Cavalry horse's hoof shockwaves while it canters (CAVALRY_WAVE)
      if (run.spec === CAVALRY_CHARGE && now >= (this._chargeDustAt.get(unit) ?? 0)) {
        this._chargeDustAt.set(unit, now + CAVALRY_WAVE.every);
        const at = unit.position.add(run.dir.scale(CAVALRY_WAVE.ahead * unit.collisionBodyRadius));
        at.y = unit.position.y;
        this.visualEffects?.spawnTrampleRing(at, CAVALRY_WAVE.radius);
        for (const other of this._units) {
          if (other.isDead || other.team === unit.team || !other.isTargetable) continue;
          const off = other.position.subtract(at);
          off.y = 0;
          if (off.length() > CAVALRY_WAVE.radius + other.collisionBodyRadius) continue;
          const out = off.lengthSquared() > 1e-4 ? off.normalize() : run.dir.clone();
          other.applyDamage(CAVALRY_WAVE.damage, out.scale(CAVALRY_WAVE.fling));
          other.applyBlastLaunch(out, CAVALRY_WAVE.fling, CAVALRY_WAVE.lift);
        }
        this._logAbility(unit, "shockwave", now, at);
      }
      if (run.spec === MAMMOTH_CHARGE || run.spec === JOUSTER_CHARGE || run.spec === MINOTAUR_CHARGE) {
        unit.animator.setCharging(true, run.spec === MINOTAUR_CHARGE);
        this._chargePosed.add(unit);
      }
      for (const other of this._units) {
        if (other.isDead || other.team === unit.team || !other.isTargetable || run.trampled.has(other)) continue;
        const off = other.position.subtract(unit.position);
        off.y = 0;
        const C = run.spec;
        if (off.length() > unit.collisionBodyRadius + other.collisionBodyRadius + C.contact) continue;
        if (Vector3.Dot(off, run.dir) < 0) continue;
        run.trampled.add(other);
        if (C === DEATH_CHARGE) { this._chargeCut(unit, other, run.dir, now); continue; }
        // The jouster's lance goes into the man he rides at as the horse reaches him (JOUSTER_CHARGE)
        if ((C === JOUSTER_CHARGE || C === RAPTOR_CHARGE || C === CAVALRY_CHARGE) && other === run.target && unit.canAttack(now)) this._tryAttack(unit, other, getAttackProfile(unit.definition.attackProfileId), now);
        // Aside off the charge's line, to whichever side of it he stood, and on ahead of it
        const across = new Vector3(run.dir.z, 0, -run.dir.x);
        const side = Vector3.Dot(off, across) >= 0 ? 1 : -1;
        const outward = across.scale(side * 0.8).add(run.dir.scale(0.6)).normalize();
        other.applyDamage(C.damage, outward.scale(C.fling));
        other.applyBlastLaunch(outward, C.fling, C.lift);
        this._logAbility(unit, "trample", now, other.position);
        if (this.visualEffects) this.visualEffects.spawnSmokePuff(other.position, CHARGE_DUST);
        // [S] 364 ...and the ground he is trampled into throws its dust ring and earth (TRAMPLE_RING)
        if (this.visualEffects && C === MAMMOTH_CHARGE) this.visualEffects.spawnTrampleRing(new Vector3(other.position.x, unit.position.y, other.position.z), 2);
      }
      if (run.trampled.has(run.target)) {
        if (run.spec.through) {
          // the cart drives on through: fix the run's end past where its man stood
          if (!run.end) run.end = unit.position.add(run.dir.scale(Vector3.Distance(unit.position, run.target.position) + run.spec.overrun));
        } else {
          unit.endCharge();
          this._charges.delete(unit);
        }
      }
    }
  }

  private _moveUnitToward(unit: RuntimeUnit, desired: Vector3, engageDistance: number, now: number): void {
    // A rear-rank man follows the wall he backs: he marches no closer to it than shieldRankGap, paced to the front as he comes up,
    // and when the front halts he halts behind it, square to the advance, stepping only across to his gap. He is never pulled back.
    const slot = this._shieldSlots.get(unit);
    const behind = slot?.hold ? slot.hold.x * Math.sin(slot.heading) + slot.hold.z * Math.cos(slot.heading) : Infinity;
    if (slot && behind <= 0) {
      const across = this._shieldSlotStep(unit);
      if (across) unit.moveTo(unit.position.add(across));
      else unit.stopMoving();
      this._clearPathState(unit);
      unit.faceTarget(desired);
      unit.holdHeading(slot.heading);
      // Halted behind a wall that has met the enemy he is in the press too: board up and spear down, though his own reach is short of them.
      if (Vector3.Distance(unit.position, desired) <= engageDistance + this.shieldRankGap + 1) unit.leanIntoShove();
      return;
    }
    unit.setCohesionMoveMultiplier(Math.min(this._resolveCohesionMoveMultiplier(unit, desired), 0.5 + 0.5 * behind / this.shieldRankFollowBand));
    const navigationGrid = this.navigationGrid;
    if (!navigationGrid) {
      unit.moveTo(this._steerIntoShieldSlot(unit, this._resolveHazardAwareMoveTarget(unit, desired)));
      return;
    }

    const state = this._getPathState(unit, now);
    this._updatePathProgress(unit, desired, engageDistance, state, now);

    if (state.bypassGoal && now >= state.bypassExpiresAt) {
      state.bypassGoal = null;
    }

    const activeGoal = state.bypassGoal ?? desired;
    const desiredGoalMoved = !state.desiredGoal
      || Vector3.DistanceSquared(state.desiredGoal, activeGoal) > 4;
    const routeMissing = state.waypoints.length === 0 || state.waypointIndex >= state.waypoints.length;
    const needsFreshRoute = (desiredGoalMoved || routeMissing) && now >= state.repathBlockedUntil;

    if (needsFreshRoute) {
      state.desiredGoal = activeGoal.clone();
      state.waypoints = this._buildNavigationWaypoints(unit, activeGoal);
      state.waypointIndex = 0;
      state.repathBlockedUntil = now + this.repathCooldown;
    }

    while (state.waypointIndex < state.waypoints.length) {
      const waypoint = state.waypoints[state.waypointIndex];
      const reachDistance = Math.max(this.waypointReachDistance, unit.definition.collisionRadius * 1.6);
      if (Vector3.DistanceSquared(unit.position, waypoint) > reachDistance * reachDistance) break;
      state.waypointIndex += 1;
      if (state.bypassGoal && Vector3.DistanceSquared(unit.position, waypoint) <= reachDistance * reachDistance) {
        state.bypassGoal = null;
      }
    }

    const nextWaypoint = state.waypoints[state.waypointIndex] ?? this._resolveHazardAwareMoveTarget(unit, activeGoal);
    const steered = this._applyCrowdAvoidance(unit, nextWaypoint);
    unit.moveTo(state.bypassGoal ? steered : this._steerIntoShieldSlot(unit, steered));
  }

  /**
   * Sorts each team's shield carriers into walls: the carriers of one rank, side by side across the line of advance,
   * each given a slot shieldSlotSpacing from the next about the middle of the wall. Carriers close up into their slots
   * on the march and in contact, so their boards overlap. A rank behind a wall is slotted to it: each man behind the
   * gap between two of its boards and shieldRankGap back, on the march as in contact, so the wall stands two deep.
   */
  private _assignShieldSlots(): void {
    this._shieldSlots.clear();
    for (const unit of [...this._shieldRanks.keys()]) {
      if (unit.isDead || !this._units.includes(unit)) this._shieldRanks.delete(unit);
    }
    let walls = 0;
    const standing = this._units.filter((unit) => !unit.isDead && !unit.linkedParent);
    const teams = [...new Set(standing.map((unit) => unit.team))].sort((a, b) => a - b);
    for (const team of teams) {
      const carriers = standing.filter((unit) => unit.team === team && this._carriesWallShield(unit));
      const enemies = standing.filter((unit) => unit.team !== team);
      if (carriers.length < 2 || enemies.length === 0) continue;
      const middle = (units: RuntimeUnit[], axis: "x" | "z") => units.reduce((sum, unit) => sum + unit.position[axis], 0) / units.length;
      let fx = middle(enemies, "x") - middle(carriers, "x");
      let fz = middle(enemies, "z") - middle(carriers, "z");
      const advance = Math.hypot(fx, fz);
      if (advance < 0.01) continue;
      fx /= advance;
      fz /= advance;
      const heading = Math.atan2(fx, fz);
      // Depth runs along the advance, side across it.
      const placed = carriers.map((unit) => ({
        unit,
        depth: unit.position.x * fx + unit.position.z * fz,
        side: unit.position.z * fx - unit.position.x * fz,
      })).sort((a, b) => a.side - b.side || a.unit.runtimeId - b.unit.runtimeId);
      // A carrier seen for the first time takes the rank its depth behind the foremost one puts it in.
      const front = Math.max(...placed.map((entry) => entry.depth));
      for (const entry of placed) {
        if (this._shieldRanks.has(entry.unit)) continue;
        this._shieldRanks.set(entry.unit, Math.max(0, Math.ceil((front - entry.depth) / this.shieldRankDepth - 1 - 1e-6)));
      }
      const rankOf = (unit: RuntimeUnit) => this._shieldRanks.get(unit) ?? 0;
      let ahead: ShieldWallLine[] = [];
      let aheadRank = -1;
      for (const r of [...new Set(placed.map((entry) => rankOf(entry.unit)))].sort((a, b) => a - b)) {
        const rank = placed.filter((entry) => rankOf(entry.unit) === r);
        const hosts = aheadRank === r - 1 ? ahead : [];
        const formed: ShieldWallLine[] = [];
        if (r === 0) {
          let start = 0;
          for (let i = 1; i <= rank.length; i++) {
            if (i < rank.length && rank[i].side - rank[i - 1].side <= this.shieldWallGap) continue;
            const wall = rank.slice(start, i);
            start = i;
            if (wall.length < 2) continue;
            const first = wall.reduce((sum, entry) => sum + entry.side, 0) / wall.length - (wall.length - 1) * 0.5 * this.shieldSlotSpacing;
            const wallId = walls++;
            // The line the men holding it stand on: a man a blow has thrown out of it (in the air or just landed behind it) does not carry it back with him
            const holding = wall.filter((entry) => !entry.unit.isBlowThrown).map((entry) => entry.depth).sort((a, b) => a - b);
            const depths = holding.length > 0 ? holding : wall.map((entry) => entry.depth).sort((a, b) => a - b);
            const line = (depths[(depths.length - 1) >> 1] + depths[depths.length >> 1]) / 2;
            wall.forEach((entry, k) => {
              const shift = first + k * this.shieldSlotSpacing - entry.side;
              const side = first + k * this.shieldSlotSpacing;
              this._shieldSlots.set(entry.unit, { wall: wallId, offset: new Vector3(-fz * shift, 0, fx * shift), heading, hold: null, plane: line, at: new Vector3(line * fx - side * fz, 0, line * fz + side * fx) });
            });
            formed.push({ first, count: wall.length, depth: wall.reduce((sum, entry) => sum + entry.depth, 0) / wall.length });
          }
        } else {
          // Each rear man backs the wall ahead that he stands behind; with none ahead of him he moves up a rank.
          const backing = new Map<ShieldWallLine, typeof rank>();
          for (const entry of rank) {
            const host = hosts.find((line) => entry.side >= line.first - this.shieldWallGap
              && entry.side <= line.first + (line.count - 1) * this.shieldSlotSpacing + this.shieldWallGap);
            if (!host) {
              this._shieldRanks.set(entry.unit, r - 1);
              continue;
            }
            backing.set(host, [...(backing.get(host) ?? []), entry]);
          }
          for (const [host, group] of backing) {
            // Slots sit on the half spacings of the wall ahead: behind its gaps while the group fits between its flanks, centred on it when it does not.
            const gaps = host.count - 1;
            const wanted = Math.round((group.reduce((sum, entry) => sum + entry.side, 0) / group.length - host.first) / this.shieldSlotSpacing - group.length * 0.5);
            const j0 = group.length <= gaps ? Math.min(Math.max(wanted, 0), gaps - group.length) : Math.floor((gaps - group.length) / 2);
            const first = host.first + (j0 + 0.5) * this.shieldSlotSpacing;
            const depth = host.depth - this.shieldRankGap;
            const wallId = walls++;
            group.forEach((entry, k) => {
              const shift = first + k * this.shieldSlotSpacing - entry.side;
              const back = depth - entry.depth;
              this._shieldSlots.set(entry.unit, {
                wall: wallId,
                offset: new Vector3(-fz * shift, 0, fx * shift),
                heading,
                hold: new Vector3(-fz * shift + fx * back, 0, fx * shift + fz * back),
                plane: null,
                at: new Vector3(depth * fx - (first + k * this.shieldSlotSpacing) * fz, 0, depth * fz + (first + k * this.shieldSlotSpacing) * fx),
              });
            });
            formed.push({ first, count: group.length, depth });
          }
        }
        ahead = formed;
        aheadRank = r;
      }
    }
    // Every slotted man's spear stands on his wall's heading from the moment he is slotted, not only once an enemy is handed to him, so a wall's shafts are one line.
    // ...and his board on his rank's strip: the front rank's on the wall's plane, a rear rank's on its own line, each seated on his slot (see _holdShieldFrames).
    for (const [unit, slot] of this._shieldSlots) {
      const line = slot.plane ?? slot.at.x * Math.sin(slot.heading) + slot.at.z * Math.cos(slot.heading);
      unit.holdSpearInWall(slot.heading, line, slot.at);
    }
  }

  /*
   * The shield wall as one body (rebuilt 210). Spec, read off the reference:
   *   tabs_screenshot_06 (a Viking wall closing, two ranks): the front rank's round boards, each about 1.5 shoulder spacings across, overlap rim over rim into one
   *   band at chest height, every board at the same height and the same turn, so from the front, the side or three-quarter on no torso shows between two of them.
   *   Every man stands upright behind his own board, a shoulder spacing from the next, none inside another; the rear rank stands a rank gap behind, its boards a
   *   second band behind the first. trailer_2_sheet_03 r2c3: tall boards packed edge to edge in one plane, the wall a single face.
   * So:
   *   Slots: each carrier's slot is a point in his wall's frame (ShieldSlot.at): across at his slot spacing, in depth on his rank's line. The frame sits on the
   *   wall's mean place and heading every step, so what the shove does to the men together moves the whole wall; after the crowd solver each carrier on his feet
   *   is put back on his slot (up to SHIELD_SLOT_SNAP a step, which is every step's drift), so no shove parts two men of a wall or runs one into another.
   *   Feet: a man held in his wall is braced by it: crowd pressure does not topple him (RuntimeUnit.wallBraced). A blast still throws him, and a man out of his
   *   wall falls as any other does.
   *   Boards: each rank's boards are one strip: every board in a rank is seated on its bearer's slot across the wall, BOARD_PLANE_REACH ahead of the rank's line,
   *   at one height (BOARD_SEAT_HEIGHT of the bearer's stature) and one turn (the heading plus BOARD_LAP), whatever his arms and trunk are doing (see
   *   ProceduralAnimator._lapBoard). The front rank's strip is the face an enemy is stopped at (SHIELD_BOARD_STANDOFF).
   */
  private _holdShieldFrames(): void {
    for (const unit of this._units) unit.wallBraced = false;
    for (const [unit, slot] of this._shieldSlots) {
      // A man a blow has thrown is out of his wall until he settles (RuntimeUnit BLOW_THROW): no bracing, no snap back onto his slot mid-air
      if (unit.isDead || unit.isToppled || unit.isDowned || unit.isBlowThrown) continue;
      unit.wallBraced = true;
      const error = slot.at.subtract(unit.position);
      error.y = 0;
      const reach = error.length();
      if (reach < 1e-3) continue;
      unit.applyCollisionSeparation(error.scaleInPlace(Math.min(reach, SHIELD_SLOT_SNAP) / reach));
    }
    this._keepRanksDeep();
  }

  /**
   * Ranks a body deep (tabs_screenshot_06: the rear rank stands a full body behind the front, every helmet its own): after the slot snap, a rear-rank man who
   * has come within a body of a man of his own side ahead of him in the wall is put back along the wall's heading by the shortfall. Depth only: the front rank and
   * the lateral pitch (the board lap) are not touched, so this does not fight the snap across.
   */
  /** Whether a man of his side on his feet stands between him and this enemy, in a lane of his line to him and within about two bodies of him. */
  private _allyBetween(unit: RuntimeUnit, enemy: RuntimeUnit): boolean {
    const tx = enemy.position.x - unit.position.x, tz = enemy.position.z - unit.position.z;
    const reach = Math.hypot(tx, tz);
    if (reach < 1e-3) return false;
    const fx = tx / reach, fz = tz / reach;
    for (const ally of this._units) {
      if (ally === unit || ally.team !== unit.team || ally.isDead || ally.isToppled || ally.isDowned) continue;
      const dx = ally.position.x - unit.position.x, dz = ally.position.z - unit.position.z;
      const along = dx * fx + dz * fz;
      if (along <= 0.1 || along >= reach) continue;
      if (Math.abs(dz * fx - dx * fz) < REAR_RANK_LANE && along < REAR_RANK_REACH + 0.6) return true;
    }
    return false;
  }

  private _keepRanksDeep(): void {
    const front: RuntimeUnit[] = [];
    for (const [unit, slot] of this._shieldSlots) if (slot.hold === null && unit.wallBraced) front.push(unit);
    for (const [unit, slot] of this._shieldSlots) {
      if (slot.hold === null || !unit.wallBraced) continue;
      const fx = Math.sin(slot.heading), fz = Math.cos(slot.heading);
      let back = 0;
      for (const ahead of front) {
        if (ahead.team !== unit.team) continue;
        const dx = ahead.position.x - unit.position.x, dz = ahead.position.z - unit.position.z;
        const along = dx * fx + dz * fz;
        const across = Math.abs(dz * fx - dx * fz);
        const body = unit.collisionBodyRadius + ahead.collisionBodyRadius;
        if (along < -0.05 || across >= body) continue;
        // How far in depth he must stand behind this man for the two bodies to be clear at this lateral offset
        const need = Math.sqrt(Math.max(0, body * body - across * across)) * RANK_DEPTH_SHARE;
        back = Math.max(back, need - along);
      }
      if (back > 1e-3) unit.applyCollisionSeparation(new Vector3(-fx * back, 0, -fz * back));
    }
    // ...and an ally of the wall who is not in it (a knight, a clubber come up behind it) queues behind its board row: a man on his feet within a body and a
    // board's reach behind a front-rank wall man is put back along that wall's heading, so no blade or mitt is pushed through the boards from behind
    for (const unit of this._units) {
      if (unit.isDead || unit.isToppled || unit.isDowned || this._shieldSlots.has(unit) || unit.position.y > 0.3) continue;
      let back = 0;
      let dir: Vector3 | null = null;
      for (const ahead of front) {
        if (ahead.team !== unit.team) continue;
        const heading = this._shieldSlots.get(ahead)!.heading;
        const fx = Math.sin(heading), fz = Math.cos(heading);
        const dx = ahead.position.x - unit.position.x, dz = ahead.position.z - unit.position.z;
        const along = dx * fx + dz * fz;
        const across = Math.abs(dz * fx - dx * fz);
        const body = unit.collisionBodyRadius + ahead.collisionBodyRadius;
        if (along < -0.05 || across >= body) continue;
        const need = Math.sqrt(Math.max(0, body * body - across * across)) + WALL_QUEUE_GAP;
        if (need - along > back) {
          back = need - along;
          dir = new Vector3(-fx, 0, -fz);
        }
      }
      if (dir && back > 1e-3) unit.applyCollisionSeparation(dir.scaleInPlace(back));
    }
  }

  /** In contact a slotted carrier stands square to his wall's advance, board to the front, while his enemy is within shieldHeadingArc of it. */
  private _holdWallHeading(unit: RuntimeUnit, slot: ShieldSlot, enemy: RuntimeUnit): void {
    const bearing = Math.atan2(enemy.position.x - unit.position.x, enemy.position.z - unit.position.z);
    const off = Math.atan2(Math.sin(bearing - slot.heading), Math.cos(bearing - slot.heading));
    unit.holdHeading(Math.abs(off) <= this.shieldHeadingArc ? slot.heading : null);
  }

  /** A man on his feet holding the line with a full board: bucklers and chargers do not make a wall. */
  private _carriesWallShield(unit: RuntimeUnit): boolean {
    const shield = unit.visualConfig.shield;
    return unit.definition.aiProfileId === "ai.brace" && shield !== "none" && shield !== "buckler"
      && !unit.isToppled && !unit.isDowned;
  }

  /** The step across that takes a carrier toward its slot, no longer than shieldSlotStride, or null when it stands in it. In contact a rear-rank man's step also takes him to his depth behind the front. */
  private _shieldSlotStep(unit: RuntimeUnit, inContact = false): Vector3 | null {
    const slot = this._shieldSlots.get(unit);
    const offset = inContact ? slot?.hold ?? slot?.offset : slot?.offset;
    if (!offset) return null;
    const reach = offset.length();
    if (reach <= 0.05) return null;
    return offset.scale(Math.min(reach, this.shieldSlotStride) / reach);
  }

  /** A slotted carrier marches a stride ahead and a step across toward its slot, so the wall closes up as it advances. */
  private _steerIntoShieldSlot(unit: RuntimeUnit, target: Vector3): Vector3 {
    const step = this._shieldSlotStep(unit);
    if (!step) return target;
    const ahead = target.subtract(unit.position);
    ahead.y = 0;
    if (ahead.lengthSquared() <= 1) return target.add(step);
    return unit.position.add(ahead.normalize()).addInPlace(step);
  }

  private _buildNavigationWaypoints(unit: RuntimeUnit, desired: Vector3): Vector3[] {
    const navigationGrid = this.navigationGrid;
    if (!navigationGrid) return [];

    const route = navigationGrid.findRoute(unit.position, desired, unit.definition.collisionRadius);
    if (route) {
      return route.waypoints.map((waypoint) => waypoint.clone());
    }

    const preferredDirection = desired.subtract(unit.position);
    preferredDirection.y = 0;
    const reachableGoal = navigationGrid.findOpenPositionNear(
      desired,
      unit.definition.collisionRadius,
      preferredDirection.lengthSquared() > 0.0001 ? preferredDirection : undefined,
    );
    if (!reachableGoal) return [];

    const fallbackRoute = navigationGrid.findRoute(unit.position, reachableGoal, unit.definition.collisionRadius);
    return fallbackRoute?.waypoints.map((waypoint) => waypoint.clone()) ?? [reachableGoal];
  }

  /** Caps approach speed to the slowest marching ally within cohesionRadius, and holds back a runner that is out ahead of its rank. */
  private _resolveCohesionMoveMultiplier(unit: RuntimeUnit, desired: Vector3): number {
    const ownSpeed = unit.definition.moveSpeed;
    if (ownSpeed <= 0.01) return 1;
    let slowest = ownSpeed;
    const radiusSq = this.cohesionRadius * this.cohesionRadius;
    const holdRadiusSq = this.runnerHoldRadius * this.runnerHoldRadius;
    const advanceX = desired.x - unit.position.x;
    const advanceZ = desired.z - unit.position.z;
    const advanceLength = Math.hypot(advanceX, advanceZ);
    // How far along the advance the foremost marching ally nearby stands from this unit: negative when all of them are behind it.
    let foremostAlly = -Infinity;
    let marchingAllies = 0;
    for (const other of this._units) {
      if (other === unit || other.isDead || other.linkedParent) continue;
      if (other.team !== unit.team || !other.isMoving) continue;
      const dx = other.position.x - unit.position.x;
      const dz = other.position.z - unit.position.z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq <= holdRadiusSq && advanceLength > 0.01) {
        marchingAllies++;
        foremostAlly = Math.max(foremostAlly, (dx * advanceX + dz * advanceZ) / advanceLength);
      }
      const otherSpeed = other.definition.moveSpeed;
      if (otherSpeed <= 0.01 || otherSpeed >= slowest) continue;
      if (distanceSq > radiusSq) continue;
      slowest = otherSpeed;
    }
    const held = marchingAllies >= this.runnerHoldMinAllies && foremostAlly < -this.runnerLeadMargin;
    return Math.min(slowest / ownSpeed, held ? this.runnerHoldMultiplier : 1);
  }

  private _applyCrowdAvoidance(unit: RuntimeUnit, waypoint: Vector3): Vector3 {
    const desired = waypoint.subtract(unit.position);
    desired.y = 0;
    if (desired.lengthSquared() <= 0.0001) {
      return waypoint;
    }

    const desiredDirection = desired.normalize();
    const avoidance = new Vector3(0, 0, 0);

    for (const other of this._units) {
      if (other === unit || other.isDead || other.linkedParent) continue;
      const delta = unit.position.subtract(other.position);
      delta.y = 0;
      const distanceSq = delta.lengthSquared();
      // Press up against standing allies; step closely around fallen bodies of either team
      const ally = other.team === unit.team;
      const fallen = other.isToppled || other.isDowned;
      // Two carriers of one wall only steer apart inside their slot spacing.
      const slot = this._shieldSlots.get(unit);
      const sameWall = !fallen && slot !== undefined && slot.wall === this._shieldSlots.get(other)?.wall;
      const separation = sameWall ? this.shieldSlotSpacing : unit.collisionBodyRadius + other.collisionBodyRadius
        + (fallen ? this.fallenAvoidanceRadius : !ally ? this.localAvoidanceRadius : this.formationAvoidanceRadius);
      if (distanceSq <= 0.0001 || distanceSq > separation * separation) continue;

      const distance = Math.sqrt(distanceSq);
      const away = delta.scale(1 / distance);
      const aheadBias = Math.max(0.15, Vector3.Dot(away, desiredDirection.scale(-1)) + 0.45);
      const weight = ((separation - distance) / separation) * aheadBias * this.localAvoidanceStrength;
      avoidance.addInPlace(away.scale(weight));
    }

    if (avoidance.lengthSquared() <= 0.0001) {
      return waypoint;
    }

    avoidance.normalize().scaleInPlace(Math.min(this.navigationGrid?.cellSize ?? 1, 0.9));
    return waypoint.add(avoidance);
  }

  private _updatePathProgress(
    unit: RuntimeUnit,
    desired: Vector3,
    engageDistance: number,
    state: UnitPathState,
    now: number,
  ): void {
    if (now - state.lastProgressAt < this.stuckTimeout) {
      return;
    }

    const movement = Vector3.Distance(unit.position, state.lastPositionSample);
    const collisionDelta = unit.collisionContactCount - state.lastCollisionContacts;
    const distanceToGoal = Vector3.Distance(unit.position, desired);
    const stalled = distanceToGoal > engageDistance + 1
      && movement < this.progressSampleDistance
      && collisionDelta >= 2;

    if (stalled) {
      const bypass = this._findBypassGoal(unit, desired);
      if (bypass) {
        state.bypassGoal = bypass;
        state.bypassExpiresAt = now + 1.4;
      }
      state.repathBlockedUntil = now;
    }

    state.lastPositionSample = unit.position.clone();
    state.lastCollisionContacts = unit.collisionContactCount;
    state.lastProgressAt = now;
  }

  private _findBypassGoal(unit: RuntimeUnit, desired: Vector3): Vector3 | null {
    const navigationGrid = this.navigationGrid;
    if (!navigationGrid) return null;

    const toGoal = desired.subtract(unit.position);
    toGoal.y = 0;
    if (toGoal.lengthSquared() <= 0.0001) {
      return null;
    }

    const forward = toGoal.normalize();
    const right = new Vector3(forward.z, 0, -forward.x);
    const lateralDistance = Math.max(this.congestionBypassDistance, unit.definition.collisionRadius * 6);
    const candidates = [
      unit.position.add(right.scale(lateralDistance)),
      unit.position.add(right.scale(-lateralDistance)),
      unit.position.add(forward.scale(-Math.max(this.congestionBypassDistance, unit.definition.collisionRadius * 4))),
    ];

    let bestCandidate: Vector3 | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
      const reachable = navigationGrid.findOpenPositionNear(
        candidate,
        unit.definition.collisionRadius,
        desired.subtract(unit.position),
      );
      if (!reachable) continue;
      const score = Vector3.DistanceSquared(reachable, candidate) + Vector3.DistanceSquared(reachable, desired) * 0.08;
      if (score < bestScore) {
        bestScore = score;
        bestCandidate = reachable;
      }
    }

    return bestCandidate;
  }

  private _getPathState(unit: RuntimeUnit, now: number): UnitPathState {
    const existing = this._pathStates.get(unit);
    if (existing) return existing;

    const created: UnitPathState = {
      waypoints: [],
      waypointIndex: 0,
      desiredGoal: null,
      bypassGoal: null,
      bypassExpiresAt: 0,
      lastPositionSample: unit.position.clone(),
      lastCollisionContacts: unit.collisionContactCount,
      lastProgressAt: now,
      repathBlockedUntil: 0,
    };
    this._pathStates.set(unit, created);
    return created;
  }

  private _clearPathState(unit: RuntimeUnit): void {
    this._pathStates.delete(unit);
  }

  private _tryAttack(attacker: RuntimeUnit, target: RuntimeUnit, attackProfile: AttackProfile, now: number): void {
    if (!attacker.canAttack(now)) return;

    const preset = getBehaviorPreset(attacker);
    const cooldownMultiplier = attacker.definition.cooldownMultiplier ?? 1;
    attacker.setAttackCooldown(now, attackProfile.cooldown * cooldownMultiplier);
    attacker.triggerLinkedRoleActions(attackProfile.cooldown * cooldownMultiplier);
    const emitter = attacker.getAttackEmitter();
    const attackOriginInfo = attacker.getAttackOrigin();
    const smokeOriginInfo = attacker.getSmokeOrigin();
    const impactOriginInfo = attacker.getImpactOrigin();
    const attackOrigin = attackOriginInfo.position;
    const impactOrigin = impactOriginInfo.position;
    if (emitter !== attacker) {
      emitter.triggerAttackVisual(Math.max(0.08, attackProfile.cooldown * cooldownMultiplier * 0.28));
    }

    let impulseDir = target.position.subtract(impactOrigin);
    if (impulseDir.lengthSquared() > 0.0001) {
      impulseDir.normalize();
    } else {
      impulseDir = Vector3.Up();
    }

    const abilities = new Set(attacker.definition.abilities ?? []);
    let damage = attackProfile.damage * (attacker.definition.damageMultiplier ?? 1);
    let splashRadius = attackProfile.splashRadius;
    let knockback = impulseDir.scale(attackProfile.knockback);
    const controlStrength = attacker.definition.controlStrength ?? 1;

    // Five homing book lights carry no contact damage; their arrivals call
    // down the damaging rays (Divine Arbiter Book, card Weapons).
    if (attacker.definition.id === "good.divine_arbiter" && this.projectileSystem) {
      const book=attacker.body.rightHand.getChildMeshes(false).find(m=>m.name==="arbiterBook");
      const source=book ?? attacker.body.rightHand;worldMatrixChain(source);
      const from=source.getAbsolutePosition().clone().add(new Vector3(0,.2,0));
      for(let k=0;k<5;k++) this.projectileSystem.spawnProjectile("arbiter_light",from,target,damage,knockback,2,attacker.team,this._units,new Vector3(0,k*.09,0),k*.1,{originLift:0,targetLift:1,arc:.16+k*.035});
      this._logAbility(attacker,"volley_book",now,target.position); return;
    }

    // [S] a longship hurls itself instead of swinging (LONGSHIP_HURL)
    if (this._tryHurlLongship(attacker, target, damage, now)) return;
    // [S] 444 a vampire does not swing: he jumps onto the man's neck and drinks (VAMPIRE_LATCH)
    if (this._tryLatch(attacker, target, damage, attackProfile.cooldown * cooldownMultiplier, now)) return;
    // [S] 445 the Lasso does not jab: he ropes the man and hauls him under the horse (LASSO_DRAG)
    if (this._tryLasso(attacker, target, damage, attackProfile.cooldown * cooldownMultiplier, now)) return;
    // [S] 529 Vlad raises his log and a row of wooden stakes bursts from the ground toward the man; his blow still lands (VLAD_IMPALE)
    this._tryVladImpale(attacker, target, damage, now);
    // [S] 539 Blackbeard calls a Cannon Barrage down round the man; his anchor blow still lands (CANNON_BARRAGE)
    this._tryCannonBarrage(attacker, target, knockback, now);
    // [S] 530 the Banshee screams: a blue blast round her launches and flings every enemy near her; her curse still lands (BANSHEE_SCREAM)
    this._tryBansheeScream(attacker, now);
    // [S] 535 her blow is no swing: she curses the man from both open hands (BANSHEE_CURSE)
    if (this._tryBansheeCurse(attacker, target, damage, knockback, now)) return;
    // [S] 531 the Skeleton Giant's Giant Fear aura frightens every enemy round him; his blow still lands (GIANT_FEAR)
    this._tryGiantFear(attacker, now);
    // [S] 536 the Solar Architect casts his Solar Maelstrom round him when a man comes close; his ray still fires (SOLAR_MAELSTROM)
    this._trySolarMaelstrom(attacker, target, now);
    // [S] 502 the Shouter does not strike from range: he shouts a harmless shockwave down the line (SHOUT)
    if (this._tryShout(attacker, target, now)) return;
    // [S] 503 the Fan Bearer blows a gust of wind down the line, not a strike (FAN_BLOW)
    if (this._tryFanBlow(attacker, target, damage, now)) return;
    // [S] 503 the Bomb on a Stick smacks the man with the bomb on its pole, which blows up there; it is never thrown (BOMB_SMACK)
    if (this._tryBombSmack(attacker, target, damage, knockback, now)) return;
    // [S] 520 the Infernal Whip lashes his chain out onto the man; no dart leaves his hand (WHIP_LASH)
    if (this._tryWhipLash(attacker, target, damage, knockback, now)) return;
    // [S] 520 the Bank Robbers open by hurling their safe at the man (SAFE_HURL)
    if (this._trySafeHurl(attacker, target, damage, knockback, now)) return;
    // [S] 520 the Present Elf throws the present he holds at the man; nothing appears beside him (PRESENT_THROW)
    if (this._tryPresentThrow(attacker, target, damage, knockback, now)) return;

    if (abilities.has("pull_hook")) knockback = knockback.scale(-0.8);
    if (abilities.has("push_force")) {
      splashRadius = Math.max(splashRadius, 3.0);
      knockback = knockback.scale(1.7);
      damage *= 0.85;
    }
    if (abilities.has("giant_slam")) {
      splashRadius = Math.max(splashRadius, 2.8);
      knockback = knockback.scale(1.35);
      damage *= 1.15;
    }
    if (abilities.has("fire_dot")) damage *= 1.1;
    if (abilities.has("poison")) damage *= 1.05;

    switch (preset) {
      case "secret_balloon_lift":
        knockback = knockback.scale(-1.3 * controlStrength);
        knockback.y = Math.max(knockback.y, 2.1 * controlStrength);
        splashRadius = Math.max(splashRadius, 1.4);
        damage *= 0.8;
        break;
      case "secret_push_fan":
        splashRadius = Math.max(splashRadius, 3.6);
        knockback = knockback.scale(2.35 * controlStrength);
        damage *= 0.72;
        break;
      case "secret_shout_push":
        splashRadius = Math.max(splashRadius, 5.0);
        knockback = knockback.scale(3.2 * controlStrength);
        damage *= 0.78;
        break;
      case "secret_vlad_hook":
        knockback = knockback.scale(-1.9 * controlStrength);
        knockback.y = Math.max(knockback.y, 0.8);
        damage *= 1.15;
        splashRadius = Math.max(splashRadius, 1.6);
        break;
      case "secret_charge_beast":
      case "secret_mounted_charge":
      case "secret_jump_kicker":
      case "secret_lady_red_jade":
      case "secret_dragon_cart":
        knockback = knockback.scale(1.35 * controlStrength);
        splashRadius = Math.max(splashRadius, 1.25);
        damage *= 1.15;
        break;
      case "secret_spin_flail":
      case "secret_mace_spinner":
        splashRadius = Math.max(splashRadius, 1.8);
        knockback = knockback.scale(1.3 * controlStrength);
        damage *= 1.08;
        break;
      case "secret_executioner":
        splashRadius = Math.max(splashRadius, 1.9);
        knockback = knockback.scale(1.35 * controlStrength);
        damage *= 1.12;
        break;
      case "secret_blackbeard":
        splashRadius = Math.max(splashRadius, 2.8);
        knockback = knockback.scale(2.2 * controlStrength);
        damage *= 1.15;
        break;
      case "secret_giant_slam":
        splashRadius = Math.max(splashRadius, 3.6);
        knockback = knockback.scale(1.55 * controlStrength);
        damage *= 1.18;
        break;
      case "secret_ice_giant":
        splashRadius = Math.max(splashRadius, 3.8);
        knockback = knockback.scale(1.6 * controlStrength);
        damage *= 1.16;
        break;
      case "iconic_mammoth":
        splashRadius = Math.max(splashRadius, 3.0);
        knockback = knockback.scale(1.0 * controlStrength);
        knockback.y = Math.max(knockback.y, 1.35);
        damage *= 1.0;
        break;
      case "iconic_reaper":
        splashRadius = Math.max(splashRadius, 4.2);
        knockback = knockback.scale(-2.0 * controlStrength);
        knockback.y = Math.max(knockback.y, 0.7);
        damage *= 1.08;
        break;
      case "iconic_pirate_queen":
        splashRadius = Math.max(splashRadius, 2.25);
        knockback = knockback.scale(1.65 * controlStrength);
        damage *= 1.18;
        break;
      case "iconic_super_peasant":
        splashRadius = Math.max(splashRadius, 2.4);
        knockback = knockback.scale(2.35 * controlStrength);
        knockback.y = Math.max(knockback.y, 1.3);
        damage *= 1.42;
        break;
      default:
        break;
    }

    if (preset === "iconic_dark_peasant") {
      this._logAbility(attacker, "dark_volley", now, target.position);
      const hands = attacker.body.root.getChildMeshes(false).filter((m): m is Mesh => m instanceof Mesh && m.name === "darkHand");
      this.visualEffects?.spawnDarkVolley(hands, target.position.add(new Vector3(0, 1, 0)), () => {
        if (!target.isDead) target.applyDamage(damage, knockback);
      });
      // Only the TABS original owns hand seizure. Custom keeps its summon/pull below.
      if (Vector3.Distance(attacker.position, target.position) <= 5 && this.visualEffects) {
        target.applySlow(0.02, 0.5, now);
        this._logAbility(attacker, "dark_grab", now, target.position);
        this.visualEffects.spawnDarkGrab(hands, () => [target.body.torsoMesh, target.body.headMesh].map(mesh => {
          mesh.computeWorldMatrix(true);
          const box = mesh.getBoundingInfo().boundingBox;
          return { center: box.centerWorld.clone(), radius: Math.max(box.extendSizeWorld.x, box.extendSizeWorld.z) * 0.85 };
        }), () => {
          if (!this._units.includes(target) || target.isDead) return;
          const away = target.position.subtract(attacker.position); away.y = 0;
          if (away.lengthSquared() < 1e-6) away.set(1, 0, 0);
          target.applyDamage(1000, Vector3.Zero());
          target.applyBlastLaunch(away.normalize(), 18, 9);
          this._logAbility(attacker, "dark_annihilate", RuntimeUnit.timeNowSeconds(), target.position);
        });
      }
      return;
    }

    // Custom faction: our Dark Peasant's summon-and-pull, a copy of the iconic_dark_peasant branch as it stood before the loop reworked it.
    // The loop owns iconic_dark_peasant and never touches this one.
    if (preset === "custom_dark_peasant") {
      this._logAbility(attacker, "area_pull", now, target.position);
      this._summonUnits(attacker);
      const controlRadius = Math.max(5.2, splashRadius + 1.6);
      const controlDuration = attacker.definition.statusDurationSeconds ?? 3.2;
      const pullForce = knockback.scale(-2.15 * controlStrength);
      const secondaryCenter = target.position.add(impulseDir.scale(-1.2));
      this._applyAreaControl(target.position, controlRadius, attacker.team, damage * 0.9, pullForce, now, 0.28, controlDuration);
      this._applyAreaControl(secondaryCenter, Math.max(3.6, controlRadius * 0.7), attacker.team, damage * 0.55, pullForce.scale(0.78), now, 0.34, Math.max(2.4, controlDuration - 0.4));
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(target.position, new Color3(0.35, 0.24, 0.52));
        this.visualEffects.spawnSmokePuff(secondaryCenter, new Color3(0.28, 0.2, 0.42));
        this.visualEffects.spawnSmokePuff(attacker.position.add(impulseDir.scale(1.2)), new Color3(0.24, 0.18, 0.38));
      }
      return;
    }

    // [S] 485 Time Ninja Gauntlets (card Weapons: one Time Ninja Projectile from each gauntlet, 150 damage, range 15): a bolt leaves the
    // right wrist, then the left .25 s on; each flies straight to the man and strikes him alone (no dome)
    if (preset === "iconic_chronomancer" && this.projectileSystem) {
      [attacker.body.rightHand, attacker.body.leftHand].forEach((hand, k) => {
        worldMatrixChain(hand);
        this.projectileSystem!.spawnProjectile("time_bolt", hand.getAbsolutePosition().clone(), target, damage, knockback.scale(0.4), 0, attacker.team, this._units, undefined, k * 0.25, { originLift: 0, targetLift: 1, arc: .03 });
      });
      this._logAbility(attacker, "cast_time_bolts", now, target.position);
      if (!this._chrono.has(attacker)) this._chronoTransform(attacker, now);
      return;
    }

    // [S] 524 CLAMS throws his clams from his hands at the man (CLAM_THROW): they become his clams where they land
    if (attacker.definition.id === "secret.clams" && this._throwClams(attacker, target, now)) return;

    // [S] 530 (c.1; card Weapons: off-hand Magic Lantern, projectile Necromancer Skulls, range 15) the Necromancer throws a ghost skull from his
    // lantern (secretDress NECRO_LANTERN "necroLanternGlass" in the off hand) at the man; it strikes him alone. Logged "missile_skull" (his plain shot)
    if (attacker.definition.id === "secret.necromancer" && this.projectileSystem) {
      const glass = attacker.body.leftHand.getChildMeshes(false).find((m) => m.name === "necroLanternGlass");
      const from = glass ?? attacker.body.leftHand;
      worldMatrixChain(from);
      this.projectileSystem.spawnProjectile("necro_skull", from.getAbsolutePosition().clone(), target, damage, knockback.scale(0.4), 0, attacker.team, this._units, undefined, 0, { originLift: 0, targetLift: 1 });
      this._logAbility(attacker, "missile_skull", now, target.position);
      return; // [S] 535 no free summon: skeletons rise only from the skull's dead (NECRO_CURSE)
    }
    if ((abilities.has("summon") || abilities.has("clone") || abilities.has("revive")) && this._summonUnits(attacker)) {
      if (attacker.definition.archetype === "summoner" || attacker.definition.archetype === "support_buff") {
        return;
      }
    }

    if (preset === "iconic_zeus") {
      this._logAbility(attacker, "lightning", now, target.position);
      if (this.visualEffects) {
        // [S] 383: one glowing zig-zag from his throwing hand to the man (visualEffects spawnZeusBolt), not three ground-level sheets from head height
        const hand = attacker.body.rightHand;
        const from = hand ? (hand.computeWorldMatrix(true), hand.getAbsolutePosition().clone()) : attackOrigin.add(new Vector3(0, 1.5, 0));
        this.visualEffects.spawnZeusBolt(from, target.position);
      }
      // [S] 384 (ancient.zeus.png): the held bolt is the one thrown, it leaves the raised fist empty and is back in it .6 of the cooldown on
      const held = attacker.animator.heldThrowProp();
      if (held) attacker.animator.letGoOfThrow(held, attackProfile.cooldown * cooldownMultiplier * ZEUS_REARM);
      this._applyDirectOrSplash(target, damage * 1.12, Math.max(3.3, splashRadius + 1.1), attacker.team, knockback.scale(1.95 * controlStrength));
      this._zeusChain(attacker, target, damage, now);
      return;
    }

    if (preset === "iconic_thor") {
      this._logAbility(attacker, "lightning", now, target.position);
      if (this.visualEffects) {
        // [S] 473 the lightning strikes down out of the sky onto the man (audit 468 thor c.1: "bolt origin: a horizontal bolt leaves his chest - TABS:
        // lightning strikes down from the sky"; legacy.thor.jpg, card Abilities Thor Lightning): THOR_SKY_BOLT thin white-cored blue zig-zags (Zeus's
        // bolt cut) from .high m over the man, the main one straight down and .forks thinner ones a little off it, and a puff where it lands
        const T = THOR_SKY_BOLT;
        this.visualEffects.spawnZeusBolt(target.position.add(new Vector3(0, T.high, 0)), target.position);
        for (let k = 0; k < T.forks; k++) {
          const a = (k / T.forks) * Math.PI * 2 + 0.6;
          this.visualEffects.spawnZeusBolt(target.position.add(new Vector3(Math.cos(a) * T.spread, T.high * 0.8, Math.sin(a) * T.spread)), target.position, true);
        }
        this.visualEffects.spawnSmokePuff(target.position);
        // 473b: and one down onto his raised hammer, where he calls it (the strike on the man is out of the frame that shows him)
        const fist = attacker.body.rightHand;
        if (fist) {
          for (let n: Node | null = fist; n; n = n.parent) if (n instanceof TransformNode) n.computeWorldMatrix(true);
          const at = fist.getAbsolutePosition().clone();
          this.visualEffects.spawnZeusBolt(at.add(new Vector3(0.4, T.high, 0.2)), at.subtract(new Vector3(0, 0.9, 0)));
        }
      }
      this._applyDirectOrSplash(target, damage * 1.22, Math.max(2.4, splashRadius + 0.5), attacker.team, knockback.scale(2.15 * controlStrength));
      return;
    }

    if (abilities.has("lightning_strike")) {
      this._logAbility(attacker, attacker.definition.id === "secret.solar_architect" ? "missile_solar_orb" : "lightning", now, target.position);
      if (this.visualEffects && attacker.definition.id === "evil.tempest_lich") {
        // [S] 491 (c.1, evil.tempest_lich.jpg): a storm cloud over the enemies drops its bolts straight down, no bolt from the staff
        this.visualEffects.spawnStormCloud(target.position.clone(), splashRadius > 0 ? splashRadius : 2.2);
      } else if (this.visualEffects && attacker.definition.id === "secret.solar_architect") {
        // [S] 531 (c.1, secret.solar_architect.png): a white-gold Solar Orb ray from the wand bursting on the man (radius 1.5 per card), no bolt or dome
        // [S] 535 (c.1; card Main and Off Hand: two Solar Architect Wands, each firing the Solar Orb) the ray leaves the gold ring at a wand's tip, the
        // fists taking turns (RuntimeUnit._laySolarWands holds both up and out), not attackOrigin at his feet
        const n = this._solarShots.get(attacker) ?? 0;
        this._solarShots.set(attacker, n + 1);
        const fist = n % 2 ? attacker.body.leftHand : attacker.body.rightHand;
        const ring = fist?.getChildMeshes(false).find((m) => m.name === "solarWandRing");
        let from = attackOrigin;
        if (ring) { worldMatrixChain(ring); from = ring.getAbsolutePosition().clone(); }
        this.visualEffects.spawnSolarRay(from, target.position.add(new Vector3(0, 0.8, 0)), 1.5);
      } else if (this.visualEffects) {
        this.visualEffects.spawnLightning(attackOrigin, target.position);
        // The strike's area as one solid shape over the men it hits
        this.visualEffects.spawnSpellDome(target.position, splashRadius > 0 ? splashRadius : 2.2);
      }
      this._applyDirectOrSplash(target, damage, splashRadius > 0 ? splashRadius : 2.2, attacker.team, knockback.scale(1.4));
      if (abilities.has("freeze")) {
        target.applySlow(0.55, attacker.definition.statusDurationSeconds ?? 2.4, now);
      }
      return;
    }

    if (preset === "iconic_scarecrow") {
      this._fireCustomVolley(attacker, target, damage, knockback, Math.max(6, attacker.definition.volleyCount ?? 8), {
        projectileShape: "crow",
        splashRadius: 0,
        spreadX: 0.9,
        spreadY: 0.7,
        spreadZ: 0.5,
        delayStep: 0.04,
      });
      return;
    }

    if (preset === "iconic_hwacha") {
      // [S] 419 a white faceted smoke cloud billows off the rack face as the volley leaves (visualEffects LAUNCH_SMOKE)
      const rack = attacker.getAttackOrigin().position;
      this.visualEffects?.spawnLaunchSmoke(rack, target.position.subtract(rack));
      this._fireCustomVolley(attacker, target, damage, knockback, Math.max(10, attacker.definition.volleyCount ?? 14), {
        projectileShape: "rocket_arrow",
        splashRadius: 0.4,
        spreadX: 1.2,
        spreadY: 0.85,
        spreadZ: 0.65,
        delayStep: 0.03,
      });
      return;
    }

    if (preset === "iconic_da_vinci_tank") {
      // Cannonballs (card: "launching cannonballs ... they shatter into fragments"), not bolts
      this._fireCustomVolley(attacker, target, damage, knockback, Math.max(6, attacker.definition.burstCount ?? 8), {
        projectileShape: "davinci_ball",
        splashRadius: 0.45,
        spreadX: 1.0,
        spreadY: 0.5,
        spreadZ: 0.75,
        delayStep: 0.04,
      });
      return;
    }

    if (preset === "iconic_legacy_tank") {
      this._fireCustomVolley(attacker, target, damage * 1.25, knockback.scale(1.35), 1, {
        projectileShape: "shell",
        splashRadius: 1.5,
        spreadX: 0,
        spreadY: 0,
        spreadZ: 0,
        delayStep: 0,
      });
      return;
    }

    if (QUICK_FAN.units.has(attacker.definition.id)) {
      if (this._fans.some((f) => f.attacker === attacker)) return;
      this._fans.push({ attacker, target, damage: damage * QUICK_FAN.damage, knockback: knockback.scale(QUICK_FAN.push), splash: splashRadius, nextAt: now, left: QUICK_FAN.shots });
      this._logAbility(attacker, "burst", now, target.position);
      this._stepFans(now);
      return;
    }

    if (preset === "iconic_quick_draw") {
      this._fireBurst(attacker, target, damage * 1.18, knockback.scale(1.2), splashRadius, Math.max(4, attacker.definition.burstCount ?? 6));
      return;
    }

    if (preset === "iconic_monkey_king") {
      const summoned = this._summonUnits(attacker);
      if (summoned) {
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(attacker.position, new Color3(0.94, 0.78, 0.34));
        }
        this._applyDirectOrSplash(target, damage * 0.62, Math.max(1.1, splashRadius * 0.55), attacker.team, knockback.scale(0.72));
        return;
      }
    }

    if (preset === "iconic_super_peasant") {
      this._logAbility(attacker, "slam", now, target.position);
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(impactOrigin, new Color3(1.0, 0.9, 0.42));
      }
      const radius = Math.max(3.1, splashRadius + 0.9);
      // Save the living victims before lethal damage changes their targetability.
      // The signature punch launches the resulting corpses as well as survivors;
      // ordinary melee death lift remains capped in RuntimeUnit.
      const victims = this._units.filter(v => v.team !== attacker.team && !v.isDead && v.isTargetable && Vector3.Distance(v.position, target.position) <= radius);
      this._applyAreaControl(target.position, radius, attacker.team, damage * 1.08, knockback.scale(1.12), now);
      for (const victim of victims) {
        const away = victim.position.subtract(attacker.position); away.y = 0;
        if (away.lengthSquared() < 1e-6) away.set(impulseDir.x, 0, impulseDir.z);
        if (away.lengthSquared() < 1e-6) away.set(1, 0, 0);
        victim.applyBlastLaunch(away.normalize(), 18, 14, true);
      }
      return;
    }

    // [S] 426 the Pirate Queen slashes (pirate.pirate_queen.png: one cutlass swung low through the men; re-audit 426 c.1): her blow is no longer an
    // instant "slam" logged as the swing starts, but the cutlass slash (CUTLASS_SLASH) whose blow lands on the man, and the men round him, as the blade
    // crosses her front (the pending-blow path below), with the slam's weight
    if (preset === "iconic_pirate_queen") {
      damage *= 1.2;
      splashRadius = Math.max(2.6, splashRadius + 0.5);
      knockback = knockback.scale(1.2);
    }

    // [S] 541 (ullr c.1) Ullr throws his axe (audit 538: "an arrow flies off the bow - TABS: a thrown, spinning double-headed axe"; card Weapons
    // "Ullr Axe Throw ... projectile Ullr's Axe; count 1"): the throw windup runs (weapon family throw) and at its let-go the axe in his fist
    // leaves it as the missile, tumbling end over end (ULLR_THROW.tumble rad/s, the pending-throw path below); the frost lands as before
    if (preset === "secret_ullr" && this.projectileSystem && attacker.animator.throwReleasesIn() > 0) {
      this._pendingThrows.push({
        attacker, target, shape: "arrow", damage, splashRadius: 0, knockback: knockback.scale(0.35), leavesAt: now + attacker.animator.throwReleasesIn(),
      });
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (preset === "secret_artemis" || preset === "secret_ullr" || preset === "secret_flying_archer") {
      this._fireVolley(attacker, target, damage, knockback, Math.max(2, attacker.definition.volleyCount ?? 3));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (preset === "secret_bomb_cannon") {
      this._fireVolley(attacker, target, damage, knockback, Math.max(2, attacker.definition.volleyCount ?? 2));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    // [S] 444 the Gunslinger fires his revolvers into the sky and the bullets rain down on the man (BULLET_RAIN)
    if (BULLET_RAIN.units.has(attacker.definition.id)) {
      attacker.animator.gunsUp(BULLET_RAIN.hold);
      this._rains.push({ attacker, target, damage, knockback, splash: Math.max(splashRadius, BULLET_RAIN.splash), upAt: now + BULLET_RAIN.raise, drops: [] });
      return;
    }

    if (RCB_VOLLEY.units.has(attacker.definition.id) && this.projectileSystem) {
      if (this._rcbVolleys.some((v) => v.attacker === attacker)) return;
      const shots = Math.max(3, attacker.definition.burstCount ?? 5);
      this._rcbVolleys.push({ attacker, target, damage: Math.max(1, Math.ceil(damage / shots)), knockback: knockback.scale(0.4), splash: splashRadius > 0 ? splashRadius * 0.5 : 0, nextAt: now, left: shots });
      this._logAbility(attacker, "burst", now, target.position);
      this._stepRcbVolleys(now);
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if ((abilities.has("rapid_fire") || preset === "secret_burst_crossbow" || preset === "secret_bank_robbers" || preset === "secret_sensei" || preset === "secret_gatling") && !attacker.fistsOnly) {
      this._fireBurst(attacker, target, damage, knockback, splashRadius, Math.max(3, attacker.definition.burstCount ?? 3));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (abilities.has("shotgun_blast")) {
      this._fireShotgun(attacker, target, damage, knockback);
      return;
    }

    if (abilities.has("volley_fire")) {
      this._fireVolley(attacker, target, damage, knockback, Math.max(4, attacker.definition.summonCount ?? 6));
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    if (attackProfile.type === AttackType.Ranged || attackProfile.type === AttackType.Siege) {
      this._logAbility(attacker, "fire", now);
      if (this.projectileSystem) {
        // [S] 426 the Flintlock's pistols each fire from their own bell: a small flash there and a ball streaking at the man's chest (spawnPistolShot),
        // in place of the long gun's cloud hung ahead of his chest
        const bells = GUN_TOSS.units.has(attacker.definition.id) ? this._pistolBells(attacker) : [];
        if (isFirearmUnit(attacker)) {
          if (bells.length > 0) this.projectileSystem.spawnPistolShot(bells, this._chestOf(target));
          else this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            impulseDir,
            1,
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
          // [S] 455 the Deadeye's Winchester leaves a long white tracer from the muzzle to the man's chest (projectileSystem RIFLE_TRACER)
          if (attacker.definition.id === "wild_west.deadeye") {
            const muzzle = smokeOriginInfo.position.add(new Vector3(0, originLiftForSource(smokeOriginInfo.source), 0));
            this.projectileSystem.spawnTracer(muzzle, this._chestOf(target));
          }
          this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
          const fling = GUN_FLING[attacker.definition.weaponHint ?? ""];
          if (fling && !target.isDead) {
            const along = new Vector3(impulseDir.x, 0, impulseDir.z);
            if (along.lengthSquared() > 1e-6) target.applyBlastLaunch(along.normalize(), fling.speed, fling.lift);
          }
          if (GUN_TOSS.units.has(attacker.definition.id)) this._tossGuns(attacker, now);
        } else if (attacker.definition.id === "evil.mad_mechanic" && this.visualEffects) {
          // [S] 493 light-blue fire sprayed from the claw onto the man (MECHANIC_FIRE), not a lobbed bomb
          const hand = attacker.body.rightHand;
          const claw = (): Vector3 | null => {
            if (attacker.isDead) return null;
            const chain: TransformNode[] = [];
            for (let n: Node | null = hand; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
            for (const n of chain) n.computeWorldMatrix(true);
            const fwd = target.position.subtract(attacker.position); fwd.y = 0;
            if (fwd.lengthSquared() > 1e-6) fwd.normalize();
            return hand.getAbsolutePosition().add(fwd.scale(MECHANIC_FIRE.ahead));
          };
          const man = (): Vector3 | null => (target.isDead ? null : target.position.add(new Vector3(0, MECHANIC_FIRE.chest, 0)));
          this.visualEffects.spawnFlameJet(claw, man, MECHANIC_FIRE.seconds, MECHANIC_FIRE);
          this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
        } else if (THROWS_HELD_PROP.has(attacker.definition.weaponHint ?? "") && attacker.animator.throwReleasesIn() > 0) {
          // The windup has only started: what he holds leaves his hand at the let-go
          this._pendingThrows.push({
            attacker, target, shape: resolveProjectileShape(attacker, attackProfile) ?? "spear", damage, splashRadius, knockback,
            leavesAt: now + attacker.animator.throwReleasesIn(),
          });
        } else if (DRAWS_BEFORE_LOOSE.has(attacker.definition.id) && attacker.animator.bowReleasesIn() > 0) {
          // The draw has only started: the arrow leaves the bow at the loose
          this._pendingThrows.push({
            attacker, target, shape: resolveProjectileShape(attacker, attackProfile) ?? "arrow", damage, splashRadius, knockback,
            leavesAt: now + attacker.animator.bowReleasesIn(), fromBow: true,
          });
        } else if (staffHeadOf(attacker) && /^(fireball|wizard_spell|leaves)$/.test(resolveProjectileShape(attacker, attackProfile) ?? "") && attacker.animator.castReleasesIn() > 0) {
          // The cast has only started: the fireball leaves the staff's head when the staff is driven level at the man, the bone mage's leaves
          // when his staff is up over his head
          this._pendingThrows.push({
            attacker, target, shape: resolveProjectileShape(attacker, attackProfile)!, damage, splashRadius, knockback, leavesAt: now + attacker.animator.castReleasesIn(), fromStaff: true,
          });
        } else if (staffHeadOf(attacker) && /^(fireball|wizard_spell)$/.test(resolveProjectileShape(attacker, attackProfile) ?? "")) {
          // A caster keeps his staff: the fireball is lit at its head, not thrown from his hip
          const head = staffHeadOf(attacker)!;
          const chain: TransformNode[] = [];
          for (let n: Node | null = head; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          this.projectileSystem.spawnProjectile(
            resolveProjectileShape(attacker, attackProfile)!, head.getAbsolutePosition().clone(), target, damage, knockback, splashRadius, attacker.team, this._units,
            undefined, 0, { originLift: 0 },
          );
        } else if (resolveProjectileShape(attacker, attackProfile) === "leaves" && attacker.body.rightHand) {
          // A bone mage's leaf whirl rises off the hand that holds his staff up, not from his belt
          const hand = attacker.body.rightHand;
          const chain: TransformNode[] = [];
          for (let n: Node | null = hand; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          this.projectileSystem.spawnProjectile(
            "leaves", hand.getAbsolutePosition().clone(), target, damage, knockback, splashRadius, attacker.team, this._units,
            undefined, 0, { originLift: 0.3 },
          );
        } else if (resolveProjectileShape(attacker, attackProfile) === "sword") {
          // A swordcaster's sword is one of those that stand round him ([R] swordcaster-blade-ring): the blade of his ring nearest the man is lifted out
          // of it, hangs SWORD_HOVER s rising to over his head and turning its point onto him, then flies point first from there. No ring left (all out): one appears over his head.
          const head = attacker.body.headTop;
          const chain: TransformNode[] = [];
          for (let n: Node | null = head; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          const lifted = launchRingSword(attacker.body, target.position);
          this.projectileSystem.spawnProjectile(
            "sword", lifted?.at ?? head.getAbsolutePosition().clone(), target, damage, knockback, splashRadius, attacker.team, this._units,
            undefined, SWORD_HOVER, lifted ? { originLift: 0, hover: true, size: lifted.size, riseTo: head.getAbsolutePosition().y + SWORD_RISE_OVER } : { originLift: 0.35, hover: true },
          );
        } else if (attacker.definition.id === "dynasty.dragon" && this.visualEffects) {
          // [S] 416 the Dragon breathes fire: a held flame jet from his mouth onto the man (visualEffects FLAME_JET), the damage dealt where it lands,
          // not a lone puff lobbed ahead of him (audit 411 c.1)
          const body = attacker.body;
          const mouth = (): Vector3 | null => {
            if (attacker.isDead) return null;
            // the paper head's mouth (dynastyDress DRAGON_FORM "dragonMouth"); without it, in front of his own head
            const jaws = body.root.getChildren((n) => n.name === "dragonMouth", false)[0] as TransformNode | undefined;
            if (jaws) { body.root.computeWorldMatrix(true); (jaws.parent as TransformNode).computeWorldMatrix(true); jaws.computeWorldMatrix(true); return jaws.getAbsolutePosition().clone(); }
            body.headMesh.computeWorldMatrix(true);
            const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), body.root.getWorldMatrix());
            fwd.y = 0;
            if (fwd.lengthSquared() > 1e-6) fwd.normalize();
            const at = body.headMesh.getAbsolutePosition().clone();
            return at.addInPlace(fwd.scale(DRAGON_BREATH.ahead * body.root.scaling.y)).addInPlace(new Vector3(0, -DRAGON_BREATH.down * body.root.scaling.y, 0));
          };
          const man = (): Vector3 | null => (target.isDead ? null : target.position.add(new Vector3(0, DRAGON_BREATH.chest, 0)));
          this.visualEffects.spawnFlameJet(mouth, man, DRAGON_BREATH.seconds);
          // [S] 419 the man the jet reaches catches fire: flames stand on his body while he burns (visualEffects BODY_FLAMES; audit c.2 "the knight shows no fire")
          const burning = target;
          this.visualEffects.spawnBodyFlames(() => (burning.isDead && !burning.body.root.isEnabled() ? null : burning.position.clone()), DRAGON_BREATH.burn);
          this._logAbility(attacker, "breath", now);
          this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
        } else if (harpoonMuzzleOf(attacker)) {
          // The harpoon leaves the gun's muzzle at the hip, trailing its rope back to it
          const muzzle = harpoonMuzzleOf(attacker)!;
          const chain: TransformNode[] = [];
          for (let n: Node | null = muzzle; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          this.projectileSystem.spawnProjectile(
            "harpoon", muzzle.getAbsolutePosition().clone(), target, damage, knockback, splashRadius,
            attacker.team, this._units, undefined, 0, { originLift: 0, tether: muzzle },
          );
        } else {
          const boltName = LOADED_BOLTS[attacker.definition.id];
          const loadedBolt = boltName ? attacker.body.root.getChildren((n) => n.name === boltName)[0] as TransformNode | undefined : undefined;
          if (loadedBolt) {
            const chain: TransformNode[] = [];
            for (let n: Node | null = loadedBolt; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
            for (const n of chain) n.computeWorldMatrix(true);
          }
          const launchAt = handLaunchPoint(attacker);
          this.projectileSystem.spawnProjectile(
            resolveProjectileShape(attacker, attackProfile) ?? "arrow",
            launchAt ?? attackOrigin,
            target,
            damage,
            knockback,
            splashRadius,
            attacker.team,
            this._units,
            undefined,
            0,
            { originLift: launchAt ? 0 : originLiftForSource(attackOriginInfo.source), balloons: BALLOON_ARROWS.has(attacker.definition.id) ? attacker.definition.id : undefined, broadhead: BROADHEAD_ARROWS.has(attacker.definition.id), snake: SNAKE_ARROWS.has(attacker.definition.id), iceArrow: ICE_ARROWS.has(attacker.definition.id), fireArrow: FIRE_ARROWS.has(attacker.definition.id), heartArrow: HEART_ARROWS.has(attacker.definition.id), icicle: attacker.definition.id === "secret.ice_mage", drunk: DRUNK_POTIONS.has(attacker.definition.id) ? attacker.definition.id : undefined, heldProp: loadedBolt?.isEnabled() ? loadedBolt : undefined, ...(HAND_LAUNCH[attacker.definition.id] === "barrel" && launchAt ? { arc: BARREL_ROLL.arc, targetLift: 0.3 } : {}) },
          );
          // [S] 469 the Barrel Roller's shot is the barrel under his feet, rolled along the ground (BARREL_ROLL)
          if (HAND_LAUNCH[attacker.definition.id] === "barrel" && launchAt) this._rollRiddenBarrel(attacker);
          if (loadedBolt?.isEnabled()) {
            loadedBolt.setEnabled(false);
            this._arrowsAway.set(loadedBolt, now + attackProfile.cooldown * cooldownMultiplier * 0.5);
          }
          // [S] 369 the balloon arrow in his draw fist is the one that flew: gone from the hand until half the reload is past (renaissanceDress HELD_BALLOON_ARROW)
          // (385: the snake archer's nocked snake too, ancientDress heldSnake)
          const held = BALLOON_ARROWS.has(attacker.definition.id) || SNAKE_ARROWS.has(attacker.definition.id) ? attacker.body.leftHand?.getChildren((n) => n.name === "heldArrow")[0] : undefined;
          if (held) {
            held.setEnabled(false);
            this._arrowsAway.set(held, now + attackProfile.cooldown * cooldownMultiplier * 0.5);
          }
        }
      } else {
        this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
      }
      this._applyOnHitStatuses(attacker, target, now, impactOrigin);
      return;
    }

    // A swing has only gone up: it is struck at this man, and he takes the blow when it comes down on him
    const landIn = attacker.blowLandsIn();
    if (landIn > 0) {
      attacker.aimBlowAt(target, landIn);
      this._pendingBlows.push({ attacker, target, damage, splashRadius, knockback, landAt: now + landIn });
      // a fencer at the end of it may sidestep out of its arc (FENCER_DODGE)
      this._tryDodge(target, attacker, now);
      return;
    }
    if (target.definition.id === "secret.jester" && this._tryDodge(target, attacker, now)) return;
    this._landMeleeBlow(attacker, target, damage, splashRadius, knockback, now, impactOrigin);
  }

  /** Fencer recover (FENCER_RECOVER): commits him to the slide back off `foe` from this step. */
  private _startRecover(unit: RuntimeUnit, foe: RuntimeUnit, now: number): void {
    const dir = unit.position.subtract(foe.position);
    dir.y = 0;
    if (dir.lengthSquared() < 1e-6) dir.set(Math.sin(unit.body.root.rotation.y + Math.PI), 0, Math.cos(unit.body.root.rotation.y + Math.PI));
    dir.normalize();
    unit.stopMoving();
    this._clearPathState(unit);
    unit.holdHeading(Math.atan2(-dir.x, -dir.z));
    this._recovers.set(unit, { dir, from: now, foe, dist: FENCER_RECOVER.dist, seconds: FENCER_RECOVER.seconds });
    this._logAbility(unit, FENCER_RECOVER.kind, now, foe.position);
  }

  /** Fencer Dodge (FENCER_DODGE): a swing has gone up at this fencer; if ready, he sidesteps out of its arc on the recover slide. */
  private _tryDodge(unit: RuntimeUnit, foe: RuntimeUnit, now: number): true | undefined {
    const flip = unit.definition.id === "secret.jester";
    const D = flip ? JESTER_DODGE : FENCER_DODGE;
    if ((!flip && unit.definition.id !== "renaissance.fencer") || (flip && unit.isAirborne) || unit.isDead || unit.isToppled || unit.isDowned || this._recovers.has(unit)) return;
    if (now < (this._dodgeReadyAt.get(unit) ?? 0) || this._pendingBlows.some((b) => b.attacker === unit)) return;
    const away = unit.position.subtract(foe.position);
    away.y = 0;
    if (away.lengthSquared() < 1e-6) return;
    away.normalize();
    const side = this._dodgeSide.get(unit) ?? 1;
    this._dodgeSide.set(unit, -side);
    const dir = new Vector3(-away.z * side, 0, away.x * side).add(away.scale(D.back)).normalize();
    unit.stopMoving();
    this._clearPathState(unit);
    unit.holdHeading(Math.atan2(-away.x, -away.z));
    this._recovers.set(unit, { dir, from: now, foe, dist: D.dist, seconds: D.seconds, flip });
    this._dodgeReadyAt.set(unit, now + D.cooldown);
    // the flip takes the Jester off his feet: a kick he was winding up is dropped, and he may kick again once he lands
    const kick = this._kicks.get(unit);
    if (kick) {
      unit.animator.setKick(false);
      this._kicks.delete(unit);
      if (!kick.done) this._kickReadyAt.set(unit, now + D.seconds);
    }
    // the blow was struck at where he stood: it comes down on air
    this._pendingBlows = this._pendingBlows.filter((b) => !(b.attacker === foe && b.target === unit));
    this._logAbility(unit, D.kind, now, foe.position);
    return true;
  }

  /** First-contact lunge (FIRST_LUNGE): a lunging unit closing on his first foe springs the last metres in with his blow already swinging, once. */
  private _firstLunges(now: number): void {
    const L = FIRST_LUNGE;
    for (const unit of this._units) {
      if (unit.isDead || unit.isToppled || unit.isDowned || this._lunged.has(unit) || this._recovers.has(unit)) continue;
      if (!(unit.definition.abilities ?? []).includes("lunge")) continue;
      let foe: RuntimeUnit | null = null, best = Infinity;
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team) continue;
        const d = Vector3.Distance(u.position, unit.position);
        if (d < best) { best = d; foe = u; }
      }
      if (!foe || best > L.within || best < L.closest) continue;
      const dir = new Vector3(foe.position.x - unit.position.x, 0, foe.position.z - unit.position.z).normalize();
      this._lunged.add(unit);
      unit.stopMoving();
      this._clearPathState(unit);
      this._recovers.set(unit, { dir, from: now, foe, dist: Math.min(L.dist, best - L.stopShort), seconds: L.seconds });
      unit.triggerAttackVisual(L.swing);
      this._logAbility(unit, L.kind, now, unit.position);
    }
  }
  private _lunged = new Set<RuntimeUnit>();
  /** [S] 485 when a Radiant Glaive's thrown glaive is back in his fist (world seconds). */
  private _glaiveBack = new WeakMap<RuntimeUnit, number>();
  private _hammerReady = new WeakMap<RuntimeUnit, number>();
  /** [S] 493 how many warglaive cuts each Death Bringer has landed (DEATH_SLASH turns alternate trails over). */
  private _deathSlashes = new WeakMap<RuntimeUnit, number>();
  private _spearReady = new WeakMap<RuntimeUnit, number>();
  private _spearBack = new WeakMap<object, number>();
  private _hammers: { unit: RuntimeUnit; hinge: TransformNode; at: Vector3; t0: number; damage: number; dir: Vector3; struck: boolean }[] = [];

  /** PALADIN_HAMMER: the summoned hammer hangs raised for .hang s, falls through .fall s onto its man, hurts every enemy within .radius m
   * (knocked off along the blow) and holds off their next attack .daze s (card: "can cancel their attacks"); it fades .linger s after. */
  private _stepHammers(now: number): void {
    const H = PALADIN_HAMMER;
    this._hammers = this._hammers.filter((h) => {
      const t = now - h.t0;
      const u = Math.min(1, Math.max(0, (t - H.hang) / H.fall));
      h.hinge.rotation.x = H.raised + (H.down - H.raised) * u * u;
      if (u >= 1 && !h.struck) {
        h.struck = true;
        this.visualEffects?.spawnTrampleRing(h.at, H.radius); this.visualEffects?.spawnImpactDust(h.at, 2);
        for (const e of this._units) {
          if (e.isDead || e.team === h.unit.team || Vector3.DistanceSquared(e.position, h.at) > H.radius * H.radius) continue;
          e.applyDamage(h.damage, h.dir.scale(H.push).add(new Vector3(0, 2, 0))); e.setAttackCooldown(now, H.daze);
        }
        this._logAbility(h.unit, "hammer_smash", now, h.at);
      }
      if (t < H.hang + H.fall + H.linger) return true;
      h.hinge.dispose(false, true); return false;
    });
  }

  /** Projectile Block (SAMURAI_BLOCK): each ready samurai with a missile about to reach him cuts it out of the air with a bright slash. */
  /** [S] 486 Chronomancer Transformation (card Abilities; good.chronomancer.png): at his first cast the back clock ring drops from his shoulders to
   * ring his hips, tilts toward level, grows a quarter and lights gold-white, turning like a clock face, while glowing cubes drift round him.
   * CHRONO_TRANSFORM: .settle s to move, the ring .drop torso heights down, tilted .tilt rad, .grow larger, .spin rad/s; cubes turn .orbit rad/s. */
  private _chrono = new Map<RuntimeUnit, { at: number; ring: TransformNode; spin: TransformNode; home: Vector3; drop: number; lights: TransformNode; mats: Map<Mesh, Material | null> }>();
  private _chronoTransform(unit: RuntimeUnit, now: number): void {
    const ring = unit.body.torso.getChildren().find(n => n.name === "chronoBackRing") as TransformNode | undefined;
    const spin = ring?.getChildren().find(n => n.name === "chronoRingSpin") as TransformNode | undefined;
    if (!ring || !spin) return;
    const tm = unit.body.torsoMesh, H = tm.getBoundingInfo().boundingBox.extendSize.y * 2 * tm.scaling.y;
    const lit = chronoRingLit(ring.getScene()), mats = new Map<Mesh, Material | null>();
    for (const m of spin.getChildMeshes(false)) { if (!(m instanceof Mesh)) continue; mats.set(m, m.material); m.material = lit; ring.getScene().getGlowLayerByName("glow")?.removeExcludedMesh(m); }
    this._chrono.set(unit, { at: now, ring, spin, home: ring.position.clone(), drop: H * CHRONO_TRANSFORM.drop, lights: chronoLights(unit), mats });
    this._logAbility(unit, "chrono_transform", now, unit.position);
  }
  private _stepChrono(now: number): void {
    const C = CHRONO_TRANSFORM;
    for (const [unit, st] of this._chrono) {
      if (unit.isDead) { st.lights.setEnabled(false); continue; }
      const t = Math.min(1, (now - st.at) / C.settle), e = t * t * (3 - 2 * t);
      st.ring.position.set(st.home.x, st.home.y - st.drop * e, st.home.z * (1 - e));
      st.ring.rotation.x = C.tilt * e;
      st.ring.scaling.setAll(1 + C.grow * e);
      st.spin.rotation.z = -(now - st.at) * C.spin;
      st.lights.rotation.y = (now - st.at) * C.orbit;
    }
  }
  private _clearChrono(): void {
    for (const st of this._chrono.values()) {
      st.ring.position.copyFrom(st.home); st.ring.rotation.x = 0; st.ring.scaling.setAll(1); st.spin.rotation.z = 0;
      for (const [m, mat] of st.mats) { m.material = mat; m.getScene().getGlowLayerByName("glow")?.addExcludedMesh(m); }
      st.lights.dispose(false, true);
    }
    this._chrono.clear();
  }
  private _aegisState = new WeakMap<RuntimeUnit, { field: TransformNode; health: number; recharge: number; orbits?: TransformNode }>();

  private _aegisFields(now: number): void {
    for (const unit of this._units) {
      if (unit.definition.id !== "good.celestial_aegis") continue;
      let state = this._aegisState.get(unit);
      // [S] 488 the field and orbs are built at spawn (unitFactory): these find them on her root
      if (!state) { state = { field: aegisField(unit.body.root), health: 500, recharge: 0 }; this._aegisState.set(unit,state); }
      if (unit.isDead) { state.field.setEnabled(false); state.orbits?.setEnabled(false); continue; }
      state.orbits ??= aegisOrbits(unit.body.root, TEAM_COLORS[unit.team] ?? Color3.White());
      state.orbits.rotation.y=now*.8;
      if (state.health <= 0 && now >= state.recharge) { state.health=500; state.field.setEnabled(true); this._logAbility(unit,"aegis_recharge",now,unit.position); }
      if (state.health <= 0) continue;
      const damage = this.projectileSystem?.deflectField(unit.position.add(new Vector3(0,1.7,0)),3,unit.team) ?? 0;
      if (damage > 0) {
        state.health -= damage; this._logAbility(unit,"aegis_deflect",now,unit.position);
        if (state.health <= 0) { state.recharge=now+10; state.field.setEnabled(false); }
      }
    }
  }

  private _samuraiBlocks(now: number): void {
    const B = SAMURAI_BLOCK;
    const missiles = this.projectileSystem;
    if (!missiles) return;
    for (const unit of this._units) {
      if (unit.definition.id !== "dynasty.samurai" || unit.isDead || unit.isToppled || unit.isDowned) continue;
      if (now < (this._blockReadyAt.get(unit) ?? 0)) continue;
      const cut = missiles.deflectAt(unit, B.warn, B.reach);
      if (!cut) continue;
      this._blockReadyAt.set(unit, now + B.cooldown);
      // [S] 418 the cut is his: he turns on the missile and flicks the katana through it, and the crescent stands before his chest at his blade's reach
      const toward = new Vector3(cut.at.x - unit.position.x, 0, cut.at.z - unit.position.z);
      if (toward.lengthSquared() < 1e-6) toward.copyFrom(cut.dir.scale(-1));
      toward.normalize();
      unit.faceTarget(unit.position.add(toward));
      unit.triggerAttackVisual(B.flick);
      const slashAt = unit.position.add(toward.scale(B.ahead));
      slashAt.y = unit.position.y + B.chest;
      this.visualEffects?.spawnSlashArc(slashAt, cut.dir);
      this._logAbility(unit, B.kind, now, slashAt);
    }
  }
  private _blockReadyAt = new Map<RuntimeUnit, number>();

  private _cultistImplosions(now: number): void {
    const C = CULTIST_IMPLOSION;
    for (const unit of this._units) {
      if (unit.definition.id !== "evil.void_cultist" || unit.isDead || unit.isToppled || unit.isDowned) continue;
      const ready = this._implodeAt.get(unit);
      if (ready === undefined) { this._implodeAt.set(unit, now + C.first); continue; }
      if (now < ready) continue;
      let point: RuntimeUnit | null = null, best = C.reach;
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team) continue;
        const d = Math.hypot(u.position.x - unit.position.x, u.position.z - unit.position.z);
        if (d < best) { best = d; point = u; }
      }
      if (!point) continue;
      this._implodeAt.set(unit, now + C.every);
      const center = point.position.clone();
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team) continue;
        const to = center.subtract(u.position); to.y = 0;
        if (to.length() > C.radius) continue;
        u.applyDamage(C.minor, to.scale(C.pull).add(new Vector3(0, C.lift, 0)));
      }
      this.visualEffects?.spawnImplosion(center, C.radius);
      this._logAbility(unit, C.kind, now, center);
    }
  }
  private _implodeAt = new Map<RuntimeUnit, number>();

  /*
   * [S] 537 Gravestone Wall (necromancer c.3; card Abilities "Gravestone Wall", Characteristics "they also can summon 3 graves from the ground, pushing
   * anyone away if they're starting to close the distance"). NECRO_GRAVES: when he stands on his feet, ready (.cooldown s, ready from .first s) and an
   * enemy has come within .near m, three gravestones burst up across the line to that man .ahead m out in front of him, .apart m between stones
   * (visualEffects spawnGravestones); that man, and every enemy within .radius m of him or of the wall's middle, is hurt .damage and thrown away from the Necromancer
   * (.push, .lift). Logged "gravestone_wall".
   */
  private _graveReady = new Map<RuntimeUnit, number>();
  private _gravestoneWalls(now: number): void {
    const G = NECRO_GRAVES;
    for (const unit of this._units) {
      if (unit.definition.id !== "secret.necromancer" || unit.isDead || unit.isToppled || unit.isDowned || unit.linkedParent) continue;
      const ready = this._graveReady.get(unit);
      if (ready === undefined) { this._graveReady.set(unit, now + G.first); continue; }
      if (now < ready) continue;
      let foe: RuntimeUnit | null = null, best = G.near;
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team || u.linkedParent || !u.isTargetable) continue;
        const d = Math.hypot(u.position.x - unit.position.x, u.position.z - unit.position.z);
        if (d < best) { best = d; foe = u; }
      }
      if (!foe) continue;
      this._graveReady.set(unit, now + G.cooldown);
      const along = foe.position.subtract(unit.position); along.y = 0;
      if (along.lengthSquared() < 1e-6) along.set(1, 0, 0);
      along.normalize();
      const center = new Vector3(unit.position.x + along.x * Math.min(G.ahead, best * 0.6), 0, unit.position.z + along.z * Math.min(G.ahead, best * 0.6));
      this.visualEffects?.spawnGravestones(center, along, G.apart);
      // [S] 538 (c.3, critic 537: "the man who triggers it at ~3.5 m is outside the 2.2 m push round a wall 1.3 m out: no throw seen") the push
      // reaches the man who set the wall off, wherever he stands within .near, and anyone within .radius of him or of the wall's middle
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team || u.linkedParent || !u.isTargetable) continue;
        const to = u.position.subtract(center); to.y = 0;
        const toFoe = u.position.subtract(foe.position); toFoe.y = 0;
        const reach = G.radius + u.collisionBodyRadius;
        if (u !== foe && to.length() > reach && toFoe.length() > reach) continue;
        const away = u.position.subtract(unit.position); away.y = 0;
        if (away.lengthSquared() < 1e-6) away.copyFrom(along); else away.normalize();
        u.applyDamage(G.damage, away.scale(G.push));
        if (!isVehicleUnit(u.definition.id)) u.applyBlastLaunch(away, G.push, G.lift);
      }
      this._logAbility(unit, "gravestone_wall", now, center);
    }
  }

  private _sentinelCatches(now: number): void {
    const C = SENTINEL_CATCH;
    const missiles = this.projectileSystem;
    if (!missiles) return;
    for (const unit of this._units) {
      if (unit.definition.id !== "evil.exiled_sentinel" || unit.isDead || unit.isToppled || unit.isDowned) continue;
      const boards = (unit.body.root.getDescendants(false, (n) => n.name === "paviseShield" || n.name === "paviseShieldRight") as TransformNode[]).filter((b) => b.isEnabled());
      if (!boards.length) continue;
      const yaw = unit.body.root.rotation.y;
      const at = missiles.catchOnBoards(unit, C.warn, new Vector3(Math.sin(yaw), 0, Math.cos(yaw)), C.front, boards);
      if (at) this._logAbility(unit, C.kind, now, at);
    }
  }

  /**
   * Painter Dodge (PAINTER_DODGE): each ready painter with a missile about to reach him sidesteps off its line, and it comes down on air.
   * [S] 445 the Quick Draw has the same instinct (card "Quickdraw Projectile Dodge ... sidestep away when faced with projectiles"; audit 444 c.1).
   */
  private _painterDodges(now: number): void {
    const missiles = this.projectileSystem;
    if (!missiles) return;
    // [S] 498 the Death Bringer's Quick Dodge steps back onto his line once the shaft has passed (QUICK_DODGE.back)
    for (const [unit, back] of this._dodgeBack) {
      if (unit.isDead) { this._dodgeBack.delete(unit); continue; }
      if (now < back.at || this._recovers.has(unit)) continue;
      this._recovers.set(unit, { dir: back.dir, from: now, foe: back.foe, dist: QUICK_DODGE.dist, seconds: QUICK_DODGE.seconds });
      this._dodgeBack.delete(unit);
    }
    for (const unit of this._units) {
      const id = unit.definition.id;
      const quick = id === "evil.death_bringer";
      const D = quick ? QUICK_DODGE : PAINTER_DODGE;
      if ((id !== "renaissance.painter" && id !== "wild_west.quick_draw" && !quick) || unit.isDead || unit.isToppled || unit.isDowned || this._recovers.has(unit) || this._dodgeBack.has(unit)) continue;
      if (now < (this._dodgeReadyAt.get(unit) ?? 0)) continue;
      const incoming = missiles.incomingAt(unit, D.warn);
      if (!incoming) continue;
      let foe: RuntimeUnit | null = null, best = Infinity;
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team) continue;
        const d = Vector3.DistanceSquared(u.position, unit.position);
        if (d < best) { best = d; foe = u; }
      }
      if (!foe) continue;
      const side = this._dodgeSide.get(unit) ?? 1;
      this._dodgeSide.set(unit, -side);
      const dir = new Vector3(-incoming.dir.z * side, 0, incoming.dir.x * side);
      unit.stopMoving();
      this._clearPathState(unit);
      this._recovers.set(unit, { dir, from: now, foe, dist: D.dist, seconds: D.seconds });
      this._dodgeReadyAt.set(unit, now + D.cooldown);
      if (quick) this._dodgeBack.set(unit, { at: now + D.seconds + QUICK_DODGE.back, dir: dir.scale(-1), foe });
      missiles.loseTarget(unit);
      this._logAbility(unit, D.kind, now, unit.position);
    }
  }

  /** [S] 499 the Void Monarch Dodge (spec at MONARCH_DODGE): a violet blink off an incoming missile's line. */
  private _monarchDodges(now: number): void {
    const D = MONARCH_DODGE, missiles = this.projectileSystem;
    if (!missiles) return;
    for (const unit of this._units) {
      if (unit.definition.id !== "evil.void_monarch" || unit.isDead || unit.isToppled || unit.isDowned) continue;
      if (now < (this._dodgeReadyAt.get(unit) ?? 0)) continue;
      const incoming = missiles.incomingAt(unit, D.warn);
      if (!incoming) continue;
      let foe: RuntimeUnit | null = null, best = Infinity;
      for (const u of this._units) {
        if (u.isDead || u.team === unit.team) continue;
        const d = Vector3.DistanceSquared(u.position, unit.position);
        if (d < best) { best = d; foe = u; }
      }
      const side = this._dodgeSide.get(unit) ?? 1;
      this._dodgeSide.set(unit, -side);
      const across = new Vector3(-incoming.dir.z * side, 0, incoming.dir.x * side);
      if (across.lengthSquared() < 1e-6) continue;
      const from = unit.position.clone(), to = from.add(across.normalize().scale(D.dist));
      to.y = from.y;
      if (this.visualEffects) this.visualEffects.spawnShadowPoof(from);
      unit.stopMoving();
      this._clearPathState(unit);
      unit.teleportTo(to);
      if (foe) unit.faceTarget(foe.position);
      if (this.visualEffects) this.visualEffects.spawnShadowPoof(to);
      this._dodgeReadyAt.set(unit, now + D.cooldown);
      missiles.loseTarget(unit);
      this._logAbility(unit, D.kind, now, to);
    }
  }

  /**
   * [S] 498 the Void Monarch's Demon Transformation (card Abilities: "After dealing 800 damage ... the Unit with this ability will begin to float";
   * evil.void_monarch.jpg; audit 489 c.2). Every blow adds its damage to his tally, once for the struck man and once more for each other enemy inside
   * his sword's splash (MONARCH_BURST.radius) round him. When the tally reaches DEMON_FORM.blows of his own first blow (800 over the sword's 97.5
   * average), he transforms once: a wide pink burst where he stands (MONARCH_BURST look, .burst m) and he rises into the air, floating .lift of his
   * height off the ground from then on (proceduralAnimation demonForm, the Reaper's hover with its legs hanging). Logged as .kind.
   */
  private _demonTally = new WeakMap<RuntimeUnit, { dealt: number; blow: number; done: boolean }>();
  private _countDemonDamage(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, now: number): void {
    const D = DEMON_FORM;
    const t = this._demonTally.get(attacker) ?? { dealt: 0, blow: damage, done: false };
    this._demonTally.set(attacker, t);
    if (t.done) return;
    let struck = 1;
    for (const u of this._units) {
      if (u === target || u.isDead || u.team === attacker.team) continue;
      if (Vector3.DistanceSquared(u.position, target.position) <= MONARCH_BURST.radius * MONARCH_BURST.radius) struck++;
    }
    t.dealt += damage * struck;
    if (t.dealt < D.blows * t.blow) return;
    t.done = true;
    attacker.animator.demonForm = D.lift;
    // [S] 502 (c.1) ...and visibly changes form: he rights himself into the hover and stays steadfast, his body turns a pink-lit void with pink
    // eyes and a ring-and-shard aura (evilDress monarchDemonForm)
    attacker.standFirm();
    monarchDemonForm(attacker.body.root.getScene(), attacker.body);
    if (this.visualEffects) this.visualEffects.spawnReaperBurst(attacker.position.clone(), D.burst, MONARCH_BURST);
    this._logAbility(attacker, D.kind, now, attacker.position);
  }

  /** Moves each sliding fencer (recover or dodge) along his slide: speed falling linearly from twice the mean to zero over the slide's seconds. */
  private _slideRecovers(dt: number, now: number): void {
    for (const [unit, r] of this._recovers) {
      const t0 = Math.max(0, now - dt - r.from) / r.seconds, t1 = Math.min(1, (now - r.from) / r.seconds);
      if (unit.isDead || t0 >= 1) {
        this._recovers.delete(unit);
        unit.holdHeading(null);
        continue;
      }
      // distance covered between t0 and t1 under v(t) = 2 * dist * (1 - t): dist * ((2t - t^2) at t1 minus at t0)
      const ease = (t: number) => 2 * t - t * t;
      const step = r.dist * (ease(t1) - ease(t0));
      unit.stopMoving();
      const pos = unit.position.add(r.dir.scale(step));
      if (r.flip) {
        const arc = Math.sin(Math.PI * t1);
        const pitch = 2 * Math.PI * t1;
        const pivot = unit.body.metrics.overallHeight * 0.48;
        pos.y = t1 >= 1 ? 0 : 0.72 * arc + pivot * (1 - Math.cos(pitch));
        unit.body.root.rotation.x = t1 >= 1 ? 0 : pitch;
        const tuck = arc * 0.95;
        unit.body.leftHip.rotation.x -= tuck;
        unit.body.rightHip.rotation.x -= tuck;
        unit.body.leftKnee.rotation.x += tuck;
        unit.body.rightKnee.rotation.x += tuck;
      }
      unit.teleportTo(pos);
      if (!r.foe.isDead) unit.holdHeading(Math.atan2(r.foe.position.x - unit.position.x, r.foe.position.z - unit.position.z));
    }
  }

  private _landMeleeBlow(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, splashRadius: number, knockback: Vector3, now: number, impactOrigin: Vector3): void {
    // The striker's aim is pinned where the blow lands before the man is thrown off that point
    attacker.animator.blowStruck();
    const parry = target.tryTeacherParry(attacker.position, now);
    if (parry) {
      this._logAbility(target, "teacher_parry", now, parry);
      this.visualEffects?.spawnHitSparks(parry, 1.6);
      return;
    }
    const raptorBite = attacker.startRaptorBite(now, target);
    if (raptorBite) {
      knockback = knockback.scale(0.22);
      this._logAbility(attacker, "raptor_bite", now, target.position);
    }
    if (HOP_BACK[attacker.definition.id]) this._landedAt.set(attacker, now);
    if (attacker.definition.id === "renaissance.fencer" && !attacker.isDead && !this._recovers.has(attacker)) this._startRecover(attacker, target, now);
    // [S] 442 a weak man is speared on a tendril and hung, not cut (REAPER_IMPALE)
    const impaled = this._tryImpale(attacker, target, now);
    const heavy = !impaled && !raptorBite && attacker.animator.defaultAttackMotion === "heavy_swing";
    // A heavy blow that leaves him standing dwells on him (BLOW_DWELL): the push is withheld from the damage step and fired with the throw; the crowd
    // around him still takes the blow's shock now
    const dwells = heavy && target.currentHealth > damage;
    // Contact first, recoil second (trailer_3_sheet_01 r2c3: the club head is on the man as he starts to go): while the blow dwells on him his flinch is
    // held, so the land frame shows the club on his crown or shoulders and not his head already snapped 0.8 m back off it (pose bench, hoplite duel);
    // the throw at the dwell's end lays the recoil on
    if (dwells) target.holdFlinch(BLOW_DWELL);
    // ...and he buckles under it on this same step (struck-man buckle, r2c3: knees give, head down, arms out of his guard) till the throw takes him
    if (dwells) target.animator.buckleUnder();
    // [S] 447 the Miner's pick blows up where it lands (MINER_BLAST): its harm out to the explosion's radius
    const blast = MINER_BLAST.units.has(attacker.definition.id);
    if (blast) {
      splashRadius = Math.max(splashRadius, MINER_BLAST.radius);
      this.visualEffects?.spawnExplosionBurst(new Vector3(target.position.x, Math.max(0, target.position.y), target.position.z), MINER_BLAST.scale);
      this._logAbility(attacker, "blast", now, target.position);
    }
    const ballooner = attacker.definition.id === "secret.ballooner";
    if (ballooner) { splashRadius = 0; knockback = Vector3.Zero(); }
    if (!impaled) this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, dwells ? Vector3.Zero() : knockback, knockback);
    if (ballooner && !attacker.isDead && !target.isDead && !target.isAnchoredActor &&
        !target.isAirborne && !this._spentBalloonPacks.has(attacker)) {
      const direction = target.position.subtract(attacker.position);
      direction.y = 0;
      if (direction.lengthSquared() > 1e-6) {
        this._spentBalloonPacks.add(attacker);
        const reach = attacker.collisionBodyRadius + target.collisionBodyRadius;
        // [S] 514 (ballooner c.2) glued chest to chest (GLUE_HOLD): in to .chest of their radii apart, both kept on their feet, his mitts on the
        // man's trunk from this tick (posed now: the hit's frame is drawn before the animator runs again)
        const offset = direction.normalize().scale(reach * GLUE_HOLD.chest);
        const contact = target.position.subtract(offset);
        attacker.stopMoving();
        attacker.teleportTo(contact);
        attacker.faceTarget(target.position);
        this._clearPathState(attacker);
        target.hangAt(target.position, now + 0.1);
        attacker.holdUpright();
        target.holdUpright();
        attacker.animator.setGlue(target.body.torsoMesh, true);
        this._balloonLifts.set(attacker, { target, start: now, base: contact.y, offset, logged: false });
      }
    }
    // [S] 473 the Super Boxer's punch bursts in light where it lands (visualEffects PUNCH_BURST): at the man's chest
    if (attacker.definition.id === "legacy.super_boxer") this.visualEffects?.spawnPunchBurst(target.position.add(new Vector3(0, 1.1, 0)));
    // A halfling's first blow that lands takes hold of the man (HALFLING_CLING)
    if (attacker.definition.id === "farmer.halfling" && !this._clings.has(attacker) && !attacker.isDead) {
      this._clings.set(attacker, { target, side: attacker.runtimeId % 2 === 0 ? 1 : -1, until: Infinity });
      this._logAbility(attacker, "grab", now, target.position);
    }
    // The harvester's level cut throws the man it leaves standing out across it and up (SCYTHE_FLING)
    const sweep = SCYTHE_FLING[attacker.definition.id];
    if (sweep && !target.isDead) {
      const away = new Vector3(target.position.x - attacker.position.x, 0, target.position.z - attacker.position.z);
      if (away.lengthSquared() < 1e-6) away.set(0, 0, 1);
      away.normalize();
      // the off side of a man facing `away` (the cut runs from his weapon side to his off side)
      const offSide = new Vector3(-away.z, 0, away.x).scale(-(Math.sign(attacker.body.rightShoulder.position.x) || 1));
      target.applyBlastLaunch(away.scale(1 - sweep.across).add(offSide.scale(sweep.across)).normalize(), sweep.speed, sweep.lift);
      this._logAbility(attacker, "sweep", now);
    }
    // [S] 417 the Monk's bo throws the man it leaves standing back (BO_SHOVE; audit 411 c.2: "the knight stays upright in place - TABS: force 250
    // sends the target staggering back", card Weapons)
    const shove = BO_SHOVE[attacker.definition.id];
    if (shove && !target.isDead) {
      const away = new Vector3(target.position.x - attacker.position.x, 0, target.position.z - attacker.position.z);
      if (away.lengthSquared() < 1e-6) away.set(0, 0, 1);
      target.applyBlastLaunch(away.normalize(), shove.speed, shove.lift);
      this._logAbility(attacker, "knockback", now, target.position);
    }
    // The struck man recoils on the frame the blow lands, not the next one: his pose for this step was set before the blow
    if (!impaled) target.reposeNow();
    // [S] 464 the Pike loses his pike on his first blow and slaps on bare-handed (PIKE_DROP)
    if (attacker.definition.id === "legacy.pike" && !attacker.isDead) this._dropPike(attacker, now);
    // ...and under a heavy weapon he is thrown back off his feet as hard as the blow pushed, whether it was held for the drop or struck at once from a swing the
    // walk cut short: after the dwell with the club head on him, or at once when the blow killed him
    if (dwells) this._pendingLaunches.push({ target, from: attacker.position.clone(), knockback: knockback.length(), at: now + BLOW_DWELL });
    else if (heavy) target.staggerFromBlow(attacker.position, knockback.length());
    if (this.hitLog.length >= 200) this.hitLog.shift();
    // His pose was written after the last render: bring the chain down to the head up to date before reading it
    const chain: TransformNode[] = [];
    for (let n: Node | null = target.body.headTop; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const head = target.body.headTop.getAbsolutePosition();
    this.hitLog.push({ t: now, attackerUnit: attacker.definition.id, targetUnit: target.definition.id, x: impactOrigin.x, y: impactOrigin.y, z: impactOrigin.z, head: { x: head.x, y: head.y, z: head.z } });
    // Melee sparks
    if (this.visualEffects) this.visualEffects.spawnHitSparks(target.position);
    // [S] 497 every Shadow Walker blow leaves one more green mark circling the struck man's chest (card; visualEffects WALKER_MARK)
    if (this.visualEffects && attacker.definition.id === "evil.shadow_walker" && !target.isDead) {
      const stacks = (this._walkerMarks.get(target) ?? 0) + 1;
      this._walkerMarks.set(target, stacks);
      const chest = target.body.torso;
      this.visualEffects.spawnWalkerMarks(target, () => (target.isDead ? null : chest.getAbsolutePosition().clone()), stacks);
    }
    // [S] 364 the mammoth's stomp lands as a trample: a dust ring runs out over the ground and earth is thrown up (visualEffects TRAMPLE_RING)
    if (this.visualEffects && attacker.definition.id === "tribal.mammoth") {
      this.visualEffects.spawnTrampleRing(new Vector3(target.position.x, attacker.position.y, target.position.z), Math.max(2, splashRadius));
    }
    // [S] 493 every Void Monarch sword blow bursts in pink where it lands, out to its splash (MONARCH_BURST)
    if (this.visualEffects && attacker.definition.id === "evil.void_monarch") {
      this.visualEffects.spawnReaperBurst(new Vector3(target.position.x, target.position.y, target.position.z), MONARCH_BURST.radius, MONARCH_BURST);
    }
    if (attacker.definition.id === "evil.void_monarch") this._countDemonDamage(attacker, target, damage, now);
    // [S] 493 each warglaive cut leaves a pink trail across the man (DEATH_SLASH), turned over on alternate blows as the other blade cuts
    if (this.visualEffects && attacker.definition.id === "evil.death_bringer") {
      const across = target.position.subtract(attacker.position); across.y = 0;
      const n = (this._deathSlashes.get(attacker) ?? 0) + 1; this._deathSlashes.set(attacker, n);
      const look = { ...DEATH_SLASH, tilt: (n % 2 ? 1 : -1) * DEATH_SLASH.tilt };
      this.visualEffects.spawnSlashArc(target.position.add(new Vector3(0, DEATH_SLASH.chest, 0)), across.lengthSquared() > 1e-6 ? across.normalize() : new Vector3(0, 0, 1), look);
    }
    // [S] 532 the Skeleton Giant's sword stroke leaves its arc (GIANT_SLASH): a bone-pale crescent stood in the plane of the chop between him and the man
    if (this.visualEffects && attacker.definition.id === "secret.skeleton_giant" && !attacker.linkedParent) {
      const along = target.position.subtract(attacker.position); along.y = 0;
      const dir = along.lengthSquared() > 1e-6 ? along.normalize() : new Vector3(0, 0, 1);
      const at = Vector3.Lerp(attacker.position, target.position, GIANT_SLASH.between); at.y = target.position.y + GIANT_SLASH.up;
      this.visualEffects.spawnSlashArc(at, dir, GIANT_SLASH);
    }
    // [S] 436 the Reaper's scythe bursts a dark magic shockwave where it lands (card Characteristics; visualEffects REAPER_BURST), out to its splash
    // [S] 444 (CONFIRM 443 c.1: "every scythe swing bursts a dark magic shockwave"): the impaling blow bursts too, the ring and dome at the ground
    // where the man stood as he was speared (he alone is held, not cut)
    if (this.visualEffects && attacker.definition.id === "spooky.reaper") {
      this.visualEffects.spawnReaperBurst(new Vector3(target.position.x, target.position.y, target.position.z), Math.max(2, splashRadius));
    }
    // A painter's brush throws its paint as it lands (card Appearance): blobs of the tuft's own paint leave its point, on along the swing
    const tuft = attacker.body.rightHand?.getDescendants(false, (n) => n.name === "brushPoint")[0];
    if (this.visualEffects && tuft instanceof Mesh && tuft.material && tuft.isEnabled()) {
      const chain: TransformNode[] = [];
      for (let n: Node | null = tuft; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      this.visualEffects.spawnPaintSplotches(tuft.getAbsolutePosition(), target.position.subtract(attacker.position), tuft.material);
    }
    this._applyOnHitStatuses(attacker, target, now, impactOrigin);
  }

  /** Lands the heavy blows whose clubs have come down. A striker who died, was knocked down or was knocked out of reach meanwhile, or whose man is already down, has swung at air. */
  private _landPendingBlows(now: number): void {
    const due = this._pendingBlows.filter((b) => now >= b.landAt);
    if (due.length === 0) return;
    this._pendingBlows = this._pendingBlows.filter((b) => now < b.landAt);
    for (const b of due) {
      const { attacker, target } = b;
      if (attacker.isDead || attacker.isToppled || attacker.isDowned || target.isDead || !this._units.includes(attacker) || !this._units.includes(target)) continue;
      const reach = attacker.definition.engageRange + this.attackRangePadding + Math.max(0, target.collisionBodyRadius - attacker.collisionBodyRadius) + this.blowStrikeReach;
      if (Vector3.Distance(attacker.position, target.position) > reach) continue;
      this._landMeleeBlow(attacker, target, b.damage, b.splashRadius, b.knockback, now, attacker.getImpactOrigin().position);
    }
  }

  /** Throws the men whose heavy blow has dwelt on them BLOW_DWELL: back off their feet, from where the striker stood when it landed. A man killed, toppled or downed meanwhile stays as he is. */
  private _fireDwelledLaunches(now: number): void {
    const due = this._pendingLaunches.filter((l) => now >= l.at);
    if (due.length === 0) return;
    this._pendingLaunches = this._pendingLaunches.filter((l) => now < l.at);
    for (const l of due) {
      if (l.target.isDead || !this._units.includes(l.target)) continue;
      l.target.staggerFromBlow(l.from, l.knockback);
    }
  }

  /** Throws whose arm has come over to the let-go: the prop in the fist flies from where the fist is, and the hand is empty until the next windup. */
  // [S] 469 the Barrel Roller's ridden barrel, hidden while it is out rolling at the man (BARREL_ROLL.ridden), until his next blow is ready
  private _barrelOut = new Map<RuntimeUnit, TransformNode>();
  /** [S] 469 the barrel he rode is the one that rolls: it leaves from under his feet and he drops to the ground (critic 468 c.2; BARREL_ROLL.ridden). */
  private _rollRiddenBarrel(attacker: RuntimeUnit): void {
    if (!BARREL_ROLL.ridden) return;
    const ridden = attacker.body.root.getDescendants(false, (n) => n.name === "barrelBody")[0] as TransformNode | undefined;
    if (!ridden) return;
    ridden.setEnabled(false);
    this._barrelOut.set(attacker, ridden);
  }
  private _launchPendingThrows(now: number): void {
    const due = this._pendingThrows.filter((t) => now >= t.leavesAt);
    if (due.length === 0) return;
    this._pendingThrows = this._pendingThrows.filter((t) => now < t.leavesAt);
    for (const t of due) {
      const { attacker, target } = t;
      if (!this.projectileSystem || attacker.isDead || attacker.isToppled || attacker.isDowned || !this._units.includes(attacker)) continue;
      this._logAbility(attacker, t.fromStaff ? "cast" : "throw", now);
      if (t.fromBow) {
        // Loosed off the drawn bow: from the bow, where the draw has put it
        const origin = attacker.getAttackOrigin();
        this.projectileSystem.spawnProjectile(
          t.shape, origin.position, target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0, { originLift: originLiftForSource(origin.source), broadhead: BROADHEAD_ARROWS.has(attacker.definition.id), iceArrow: ICE_ARROWS.has(attacker.definition.id), fireArrow: FIRE_ARROWS.has(attacker.definition.id), heartArrow: HEART_ARROWS.has(attacker.definition.id) },
        );
        continue;
      }
      const head = t.fromStaff ? staffHeadOf(attacker) : null;
      if (head && t.shape === "leaves") {
        // The bone mage's spell is in the ground, not the air (units/tribal.bone_mage): his row of bone spikes bursts up from his feet to the man as the staff
        // comes up, and the leaves are not thrown off the staff head over his own: the whirl rises low at the row's near end, ahead of his feet, and runs along
        // the spike line at the man under the spike tips (LEAF_ROW)
        this.projectileSystem.spawnProjectile(
          t.shape, boneSpikeRowNear(attacker.position, target.position), target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0,
          { originLift: LEAF_ROW.lift, targetLift: LEAF_ROW.at, arc: LEAF_ROW.arc },
        );
        this.visualEffects?.spawnBoneSpikeRow(attacker.position, target.position);
        continue;
      }
      if (head) {
        // A caster keeps his staff: the missile is lit at its head, where the drive has put it
        const chain: TransformNode[] = [];
        for (let n: Node | null = head; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
        for (const n of chain) n.computeWorldMatrix(true);
        this.projectileSystem.spawnProjectile(
          t.shape, head.getAbsolutePosition().clone(), target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0, { originLift: 0 },
        );
        continue;
      }
      if (t.fromStaff) continue;
      // [S] 468 the Barrel Roller's barrel rolls from under his feet along the ground into the man (BARREL_ROLL)
      const rolledFrom = HAND_LAUNCH[attacker.definition.id] === "barrel" ? handLaunchPoint(attacker) : null;
      if (rolledFrom) {
        this.projectileSystem.spawnProjectile(
          t.shape, rolledFrom, target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0, { originLift: 0, arc: BARREL_ROLL.arc, targetLift: 0.3 },
        );
        this._rollRiddenBarrel(attacker);
        continue;
      }
      const prop = attacker.animator.heldThrowProp();
      // The pose was set this step: bring the hand's chain up to it before reading where the prop is
      const chain: TransformNode[] = [];
      for (let n: Node | null = prop ?? attacker.body.rightHand; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      const from = (prop ?? attacker.body.rightHand).getAbsolutePosition().clone();
      this.projectileSystem.spawnProjectile(
        t.shape, from, target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0,
        { originLift: 0, heldProp: prop ?? undefined, drunk: DRUNK_POTIONS.has(attacker.definition.id) ? attacker.definition.id : undefined,
          ...(attacker.definition.id === "secret.ullr" ? { tumble: ULLR_THROW.tumble, flight: Vector3.Distance(from, target.position) / ULLR_THROW.speed } : {}) },
      );
      // [S] 541 Ullr's throw is logged as the axe leaves his fist (LESSONS 427: a special logged at let-go owns its missile)
      if (attacker.definition.id === "secret.ullr") this._logAbility(attacker, "throw", now, target.position);
      if (prop) attacker.animator.letGoOfThrow(prop, attacker.definition.id === "secret.ullr" ? ULLR_THROW.rearm : 0);
    }
  }

  /*
   * [S] 524 CLAMS throws his clams (card Weapons "Clam Throw: Throwable - Ranged; range 22; projectile Clam; count 3; shoot delay Per Projectile:
   * 0.15 s"; audit 515 c.2 "TABS: clams thrown from the hands; ours has summons appear standing beside him"). One attack throws summonCount clams,
   * .every s apart, from his clam hands in turn (left, right, left). Each is a clam (secretDress clamCritter, built on a loose node) that leaves the
   * hand's world spot and flies at .speed m/s in an arc .apex m high, tumbling .spin rad/s, to a spot .short m short of the man, the three fanned
   * .spread m across his line. Where it lands a puff goes up and his summon (summonUnitIds, a hidden small man under a clam, as _summonUnits) is
   * spawned there. Logged "throw_clams" at the first let-go (the capture's release) and "summon" at each landing.
   */
  private static readonly CLAM_THROW = { every: 0.15, speed: 11, apex: 1.5, spin: 9, short: 1.4, near: 1.2, spread: 0.9 };
  private _clamThrows: { node: TransformNode | null; from: Vector3; to: Vector3; t0: number; dur: number; attacker: RuntimeUnit; summonId: string; left: boolean }[] = [];
  private _throwClams(attacker: RuntimeUnit, target: RuntimeUnit, now: number): boolean {
    const C = SimulationSystem.CLAM_THROW;
    const ids = attacker.definition.summonUnitIds;
    if (!ids || ids.length === 0 || attacker.isDead || target.isDead) return false;
    if (this._clamThrows.some((c) => c.attacker === attacker)) return true;
    const ahead = target.position.subtract(attacker.position);
    ahead.y = 0;
    const dist = ahead.length();
    if (dist < 1e-3) return false;
    ahead.scaleInPlace(1 / dist);
    const side = new Vector3(ahead.z, 0, -ahead.x);
    const count = Math.max(1, attacker.definition.summonCount ?? 1);
    const reach = Math.max(C.near, dist - C.short);
    for (let i = 0; i < count; i++) {
      const fan = (i - (count - 1) / 2) * C.spread;
      const to = attacker.position.add(ahead.scale(reach)).add(side.scale(fan));
      to.y = 0;
      this._clamThrows.push({ node: null, from: attacker.position.clone(), to, t0: now + i * C.every, dur: 0, attacker, summonId: ids[i % ids.length], left: i % 2 === 0 });
    }
    this._logAbility(attacker, "throw_clams", now, target.position);
    return true;
  }
  private _stepClamThrows(now: number): void {
    const C = SimulationSystem.CLAM_THROW;
    for (const c of [...this._clamThrows]) {
      if (now < c.t0) continue;
      const scene = c.attacker.body.root.getScene();
      if (!c.node) {
        if (c.attacker.isDead) { this._clamThrows.splice(this._clamThrows.indexOf(c), 1); continue; }
        const b = c.attacker.body;
        const hand = (c.left ? b.leftHand : b.rightHand) ?? b.rightHand ?? b.root;
        worldMatrixChain(hand);
        c.from = hand.getAbsolutePosition().clone();
        c.node = new TransformNode("clamThrown", scene);
        clamCritter(scene, c.node);
        c.node.position.copyFrom(c.from);
        c.node.rotation.y = Math.atan2(c.to.x - c.from.x, c.to.z - c.from.z);
        c.dur = Math.max(0.3, Vector3.Distance(new Vector3(c.from.x, 0, c.from.z), c.to) / C.speed);
      }
      const age = now - c.t0;
      const u = Math.min(1, age / c.dur);
      c.node.position.copyFrom(Vector3.Lerp(c.from, c.to, u));
      c.node.position.y += 4 * C.apex * u * (1 - u);
      c.node.rotation.x = u < 1 ? C.spin * age : 0;
      if (u < 1) continue;
      c.node.dispose(false, false);
      this._clamThrows.splice(this._clamThrows.indexOf(c), 1);
      if (c.attacker.isDead || this.getLivingCount(c.attacker.team) >= this.summonLivingCap) continue;
      const unit = this.spawnUnitById?.(c.summonId, c.attacker.team, c.to.clone(), {
        role: "summoned", linkedParent: c.attacker, linkedRelation: "spawned-child", expireAfterSeconds: c.attacker.definition.summonLifetimeSeconds,
      });
      if (!unit) continue;
      for (const m of [...unit.body.allMeshes, ...unit.propMeshes]) { m.isVisible = false; m.setEnabled(false); }
      clamCritter(unit.body.root.getScene(), unit.body.root);
      this._logAbility(c.attacker, "summon", now, c.to);
      this.visualEffects?.spawnSmokePuff(c.to);
    }
  }

  private _summonUnits(attacker: RuntimeUnit): boolean {
    if (!this.spawnUnitById) return false;
    if (this.getLivingCount(attacker.team) >= this.summonLivingCap) return false;
    if (attacker.spawnRole === "summoned" && getBehaviorPreset(attacker) === "iconic_monkey_king") return false;
    // [S] 529 (c.1) the Witch summons two clones of herself side by side that fade after 8 s (rosterManifest witch clone); a clone never clones
    if (attacker.spawnRole === "summoned" && attacker.definition.id === "secret.witch") return false;

    const summonIds = attacker.definition.summonUnitIds
      ?? (hasAbility(attacker, "clone") ? [attacker.definition.id] : undefined)
      ?? (hasAbility(attacker, "revive") ? ["spooky.skeleton_warrior"] : undefined);
    if (!summonIds || summonIds.length === 0) return false;

    const activeChildren = countAliveSpawnedChildren(attacker);
    const maxActive = attacker.definition.maxActiveSummons;
    if (maxActive !== undefined && activeChildren >= maxActive) return false;

    const summonCount = Math.max(1, attacker.definition.summonCount ?? 1);
    const remainingSlots = maxActive === undefined ? summonCount : Math.max(0, maxActive - activeChildren);
    const actualSummonCount = Math.min(summonCount, remainingSlots || summonCount);
    if (actualSummonCount <= 0) return false;
    let summoned = false;
    const preset = getBehaviorPreset(attacker);
    const summonLifetime = attacker.definition.summonLifetimeSeconds;
    for (let i = 0; i < actualSummonCount; i++) {
      if (this.getLivingCount(attacker.team) >= this.summonLivingCap) break;
      const summonId = summonIds[i % summonIds.length];
      const angle = (Math.PI * 2 * i) / actualSummonCount;
      const spacing = attacker.definition.behaviorPreset === "secret_present_spawn"
        ? 1.9
        : preset === "iconic_monkey_king"
          ? 2.1
          : 1.5;
      // the Witch's clones stand one each side of her, square to her heading
      const yaw = attacker.body.root.rotation.y, side = i % 2 ? -1 : 1;
      const pos = attacker.definition.id === "secret.witch"
        ? attacker.position.add(new Vector3(Math.cos(yaw) * side * spacing, 0, -Math.sin(yaw) * side * spacing))
        : attacker.position.add(new Vector3(Math.cos(angle) * spacing, 0, Math.sin(angle) * spacing));
      const visualOverride = preset === "iconic_monkey_king"
        ? {
            ...attacker.visualConfig,
            proportions: {
              ...attacker.visualConfig.proportions,
              scale: (attacker.visualConfig.proportions.scale ?? 1) * 0.9,
              bulk: (attacker.visualConfig.proportions.bulk ?? 1) * 0.92,
            },
          }
        : undefined;
      const unit = this.spawnUnitById(summonId, attacker.team, pos, {
        role: "summoned",
        linkedParent: attacker,
        linkedRelation: "spawned-child",
        expireAfterSeconds: summonLifetime,
        visualOverride,
      });
      if (unit) {
        summoned = true;
        // [S] 520 a CLAMS' summon is a biting clam (secretDress clamCritter): the small man's own body and props are hidden under it
        if (attacker.definition.id === "secret.clams") {
          for (const m of [...unit.body.allMeshes, ...unit.propMeshes]) { m.isVisible = false; m.setEnabled(false); }
          clamCritter(unit.body.root.getScene(), unit.body.root);
        }
        this._logAbility(attacker, "summon", RuntimeUnit.timeNowSeconds(), pos);
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(
            pos,
            preset === "iconic_dark_peasant" || preset === "custom_dark_peasant"
              ? new Color3(0.34, 0.22, 0.5)
              : preset === "iconic_monkey_king"
                ? new Color3(0.95, 0.8, 0.35)
                : undefined,
          );
        }
      }
    }
    return summoned;
  }

  private _fireBurst(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, splashRadius: number, shots: number): void {
    this._logAbility(attacker, "burst", RuntimeUnit.timeNowSeconds());
    const projectileShape = resolveProjectileShape(attacker, getAttackProfile(attacker.definition.attackProfileId)) ?? "arrow";
    const perShotDamage = Math.max(1, Math.ceil(damage / shots));
    for (let i = 0; i < shots; i++) {
      const attackOriginInfo = attacker.getAttackOrigin();
      const smokeOriginInfo = attacker.getSmokeOrigin();
      const attackOrigin = attackOriginInfo.position;
      const launchAt = handLaunchPoint(attacker); // [S] 462 HAND_LAUNCH: the bow fist or the mouth
      if (this.projectileSystem && !isFirearmUnit(attacker)) {
        if (shouldSpawnProjectileMuzzleFx(projectileShape) && smokeOriginInfo.source === "vehicle-socket") {
          const dir = target.position.subtract(attackOrigin).normalize();
          this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            dir,
            muzzleScaleForProjectile(projectileShape),
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
        }
        const offset = new Vector3((Math.random() - 0.5) * 0.25, Math.random() * 0.2, (Math.random() - 0.5) * 0.15);
        this.projectileSystem.spawnProjectile(
          projectileShape,
          launchAt ?? attackOrigin,
          target,
          perShotDamage,
          knockback.scale(0.4),
          splashRadius > 0 ? splashRadius * 0.5 : 0,
          attacker.team,
          this._units,
          offset,
          i * 0.04,
          { originLift: launchAt ? 0 : originLiftForSource(attackOriginInfo.source) },
        );
      } else {
        if (this.projectileSystem && isFirearmUnit(attacker)) {
          const dir = target.position.subtract(attackOrigin).normalize();
          this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            dir,
            1,
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
        }
        this._applyDirectOrSplash(target, perShotDamage, splashRadius, attacker.team, knockback.scale(0.35));
      }
    }
  }

  private _fireShotgun(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3): void {
    this._logAbility(attacker, "shotgun", RuntimeUnit.timeNowSeconds());
    const pellets = 6;
    const perPellet = Math.max(1, Math.ceil(damage / pellets));
    const attackOriginInfo = attacker.getAttackOrigin();
    const smokeOriginInfo = attacker.getSmokeOrigin();
    const attackOrigin = attackOriginInfo.position;
    if (this.projectileSystem) {
      const dir = target.position.subtract(attackOrigin).normalize();
      this.projectileSystem.spawnMuzzleFlash(
        smokeOriginInfo.position,
        dir,
        1,
        { originLift: originLiftForSource(smokeOriginInfo.source) },
      );
    }

    for (const unit of this._units) {
      if (unit.isDead || unit.team === attacker.team) continue;
      const distSq = unit.position.subtract(target.position).lengthSquared();
      if (distSq > 2.2 * 2.2) continue;
      const pelletHits = unit === target ? pellets : Math.max(1, Math.floor(pellets / 3));
      this._applyDirectOrSplash(unit, perPellet * pelletHits, 0, attacker.team, knockback.scale(0.5));
    }
    // [S] 427 ...the man the shot is at is blown off his feet along its line (BLUNDERBUSS_BLAST), not left standing under the pellets
    if (BLUNDERBUSS_BLAST.units.has(attacker.definition.id)) {
      const along = target.position.subtract(attacker.position);
      along.y = 0;
      if (along.lengthSquared() > 1e-6) target.applyBlastLaunch(along.normalize(), BLUNDERBUSS_BLAST.fling, BLUNDERBUSS_BLAST.lift);
    }
    // ...and the gun throws him back off his feet (BLUNDERBUSS_RECOIL)
    if (BLUNDERBUSS_RECOIL.units.has(attacker.definition.id)) {
      const back = attacker.position.subtract(target.position);
      back.y = 0;
      if (back.lengthSquared() > 1e-6) attacker.applyBlastLaunch(back.normalize(), BLUNDERBUSS_RECOIL.back, BLUNDERBUSS_RECOIL.lift);
    }
  }

  private _fireVolley(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, count: number): void {
    this._logAbility(attacker, "volley", RuntimeUnit.timeNowSeconds());
    const projectileShape = resolveProjectileShape(attacker, getAttackProfile(attacker.definition.attackProfileId)) ?? "arrow";
    // [S] 541 (artemis c.1) Artemis looses a fanned cluster of five arrows at once (audit 538: "one arrow per shot - TABS: a cluster of five
    // arrows at once"; card Characteristics): ARTEMIS_FAN.count arrows on the same tick, their nocks spread .nock m across the shot's
    // sideways line and .lift m up and down, each landing .land m apart across the man (the middle one follows him), so they fly as a
    // side-by-side sheaf; the volley's damage is shared among them as before
    if (attacker.definition.id === "secret.artemis" && this.projectileSystem) {
      const F = ARTEMIS_FAN, from = attacker.getAttackOrigin();
      const fwd = target.position.subtract(from.position); fwd.y = 0;
      if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
      fwd.normalize();
      const side = new Vector3(-fwd.z, 0, fwd.x);
      const each = Math.max(1, Math.ceil(damage / F.count));
      for (let i = 0; i < F.count; i++) {
        const k = i - (F.count - 1) / 2;
        const nock = side.scale(k * F.nock).add(new Vector3(0, (k % 2 === 0 ? 1 : -1) * F.lift * Math.min(1, Math.abs(k)), 0));
        const at = k === 0 ? undefined : target.position.add(side.scale(k * F.land));
        this.projectileSystem.spawnProjectile(projectileShape, from.position, target, each, knockback.scale(0.35), 0, attacker.team, this._units, nock, 0,
          { originLift: originLiftForSource(from.source), at });
      }
      return;
    }
    const perProjectile = Math.max(1, Math.ceil(damage / count));

    if (!this.projectileSystem) {
      this._applyDirectOrSplash(target, damage, 1.8, attacker.team, knockback.scale(0.65));
      return;
    }

    for (let i = 0; i < count; i++) {
      const attackOriginInfo = attacker.getAttackOrigin();
      const smokeOriginInfo = attacker.getSmokeOrigin();
      const attackOrigin = attackOriginInfo.position;
      if (shouldSpawnProjectileMuzzleFx(projectileShape) && smokeOriginInfo.source === "vehicle-socket") {
        const dir = target.position.subtract(attackOrigin).normalize();
        this.projectileSystem.spawnMuzzleFlash(
          smokeOriginInfo.position,
          dir,
          muzzleScaleForProjectile(projectileShape),
          { originLift: originLiftForSource(smokeOriginInfo.source) },
        );
      }
      const spread = new Vector3((Math.random() - 0.5) * 0.9, Math.random() * 0.5, (Math.random() - 0.5) * 0.45);
      this.projectileSystem.spawnProjectile(
        projectileShape,
        attackOrigin,
        target,
        perProjectile,
        knockback.scale(0.35),
        projectileShape === "bomb" || projectileShape === "pumpkin" || projectileShape === "fireball" ? 0.8 : 0,
        attacker.team,
        this._units,
        spread,
        i * 0.05,
        // [S] 519 Cupid's pair flies as love arrows too (HEART_ARROWS)
        { originLift: originLiftForSource(attackOriginInfo.source), heartArrow: HEART_ARROWS.has(attacker.definition.id) },
      );
    }
  }

  private _fireCustomVolley(
    attacker: RuntimeUnit,
    target: RuntimeUnit,
    damage: number,
    knockback: Vector3,
    count: number,
    options: {
      projectileShape: ProjectileShape;
      splashRadius: number;
      spreadX: number;
      spreadY: number;
      spreadZ: number;
      delayStep: number;
    },
  ): void {
    this._logAbility(attacker, `volley:${options.projectileShape}`, RuntimeUnit.timeNowSeconds());
    if (!this.projectileSystem) {
      this._applyDirectOrSplash(target, damage, Math.max(0, options.splashRadius), attacker.team, knockback);
      return;
    }

    const perProjectile = Math.max(1, Math.ceil(damage / count));
    for (let i = 0; i < count; i++) {
      const attackOriginInfo = attacker.getAttackOrigin();
      const smokeOriginInfo = attacker.getSmokeOrigin();
      const attackOrigin = attackOriginInfo.position;
      if (shouldSpawnProjectileMuzzleFx(options.projectileShape) && smokeOriginInfo.source === "vehicle-socket") {
        const dir = target.position.subtract(attackOrigin).normalize();
        this.projectileSystem.spawnMuzzleFlash(
          smokeOriginInfo.position,
          dir,
          muzzleScaleForProjectile(options.projectileShape),
          { originLift: originLiftForSource(smokeOriginInfo.source) },
        );
      }
      const spread = new Vector3(
        (Math.random() - 0.5) * options.spreadX,
        Math.random() * options.spreadY,
        (Math.random() - 0.5) * options.spreadZ,
      );
      this.projectileSystem.spawnProjectile(
        options.projectileShape,
        attackOrigin,
        target,
        perProjectile,
        knockback.scale(0.42),
        options.splashRadius,
        attacker.team,
        this._units,
        spread,
        i * options.delayStep,
        { originLift: originLiftForSource(attackOriginInfo.source) },
      );
    }
  }

  private _applyAreaControl(
    center: Vector3,
    radius: number,
    attackerTeam: number,
    damage: number,
    impulse: Vector3,
    now: number,
    slowMultiplier?: number,
    slowDuration?: number,
  ): void {
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === attackerTeam || !unit.isTargetable) continue;
      const distanceSq = unit.position.subtract(center).lengthSquared();
      if (distanceSq > radiusSq) continue;
      const distance = Math.sqrt(distanceSq);
      const falloff = radius > 0 ? Math.max(0, 1 - distance / radius) : 1;
      const delta = unit.applyDamage(damage, impulse);
      this.impactPresentation?.recordImpact({
        source: "simulation",
        path: "splash-secondary",
        position: unit.position,
        target: unit,
        impactDelta: delta,
        damage,
        impulse,
        radius,
        falloff,
        attackerTeam,
      });
      if (slowMultiplier !== undefined && slowDuration !== undefined) {
        unit.applySlow(slowMultiplier, slowDuration, now);
      }
    }
    this._applyCrowdShockwave(center, Math.max(1.8, radius + 0.8), attackerTeam, impulse.scale(0.28));
  }

  private _applyOnHitStatuses(attacker: RuntimeUnit, target: RuntimeUnit, now: number, impactOrigin?: Vector3): void {
    const abilities = new Set(attacker.definition.abilities ?? []);
    const preset = getBehaviorPreset(attacker);
    const statusDuration = attacker.definition.statusDurationSeconds ?? 2.5;
    if (abilities.has("freeze")) {
      const freezeStrength = preset === "secret_ice_giant" ? 0.4 : 0.55;
      target.applySlow(freezeStrength, statusDuration, now);
      target.applyFrost(statusDuration, now, attacker.definition.id === "secret.ice_mage");
      this._logAbility(attacker, "status:freeze", now, target.position);
    }
    if (abilities.has("fire_dot")) {
      const fireDamage = preset === "secret_fire_whip" || preset === "secret_dragon_cart" ? 14 : 10;
      const source = impactOrigin ?? attacker.position;
      target.applyDamage(fireDamage, target.position.subtract(source).normalize().scale(0.3));
      if (attacker.definition.id === "secret.infernal_whip" && !target.isDead) {
        target.applyBurn(statusDuration, now);
      }
      if (this.visualEffects) this.visualEffects.spawnFireBurst(target.position);
      // [S] 530 (c.1; card "a little mechanical dragon attached that breathes fire") the barrow dragon breathes it: a held flame jet out of its open
      // jaw (propBuilder BARROW_DRAGON "barrowDragonMouth" on the cart actor) onto the man, his body catching fire, not a lone puff on him
      if (preset === "secret_dragon_cart" && this.visualEffects) {
        const lead = attacker.linkedParent ?? attacker;
        const cart = lead.linkedChildren.find((c) => c.visualConfig.special === "dragon_barrow");
        const jaw = cart?.body.root.getChildMeshes(false).find((m) => m.name === "barrowDragonMouth");
        if (jaw) {
          const mouth = (): Vector3 | null => {
            if (lead.isDead || jaw.isDisposed()) return null;
            worldMatrixChain(jaw);
            const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), cart!.body.root.getWorldMatrix());
            fwd.y = 0;
            if (fwd.lengthSquared() > 1e-6) fwd.normalize();
            return jaw.getAbsolutePosition().add(fwd.scale(BARROW_BREATH.ahead));
          };
          const man = (): Vector3 | null => (target.isDead ? null : target.position.add(new Vector3(0, BARROW_BREATH.chest, 0)));
          this.visualEffects.spawnFlameJet(mouth, man, BARROW_BREATH.seconds);
          const burning = target;
          this.visualEffects.spawnBodyFlames(() => (burning.isDead && !burning.body.root.isEnabled() ? null : burning.position.clone()), BARROW_BREATH.burn);
        }
      }
      this._logAbility(attacker, "status:fire", now, target.position);
    }
    // [S] 435 Stiffy Fear (RuntimeUnit.applyFear): every STIFFY_FEAR.every-th blow of a skeleton warrior's, the first included, frightens the man it lands on
    if (STIFFY_FEAR.units.has(attacker.definition.id) && !target.isDead) {
      const n = this._fearHits.get(attacker) ?? 0;
      this._fearHits.set(attacker, n + 1);
      if (n % STIFFY_FEAR.every === 0) {
        target.applyFear(STIFFY_FEAR.seconds, attacker.position, now);
        this._logAbility(attacker, "status:fear", now, target.position);
      }
    }
    if (abilities.has("poison")) {
      target.applyDamage(6, Vector3.Zero());
      target.poison(); // [S] 467 green and slowly dying (RuntimeUnit POISON)
      this._logAbility(attacker, "status:poison", now, target.position);
    }
    if (abilities.has("fear") && this.visualEffects) {
      this.visualEffects.spawnSmokePuff(target.position);
      // [S] 473 the Pharaoh's kneel: golden rays wheel round him and a golden circle forms on the ground at his feet (visualEffects KNEEL_AURA)
      if (attacker.definition.id === "legacy.pharaoh") this.visualEffects.spawnKneelAura(attacker.position);
      // [S] 475 Pharaoh Kneel: the struck man and every enemy inside the golden circle stop before him and kneel (RuntimeUnit.applyKneel)
      if (attacker.definition.id === "legacy.pharaoh") {
        for (const other of this._units) {
          if (other.isDead || other.team === attacker.team) continue;
          if (other !== target && Vector3.DistanceSquared(other.position, attacker.position) > PHARAOH_KNEEL.radius * PHARAOH_KNEEL.radius) continue;
          other.applyKneel(PHARAOH_KNEEL.seconds, attacker.position, now);
        }
        this._logAbility(attacker, "status:kneel", now, target.position);
      }
      this._logAbility(attacker, "status:fear", now, target.position);
    }
  }

  /*
   * [S] 435 burning men (a Fire Arrow's, RuntimeUnit.applyBurn; card skeleton_archer Characteristics: the fire spreads): every BURN_STATUS.tick s each
   * takes .damage, and while more than .keep of his burn is left a man of his own side within .spread m who is not burning catches it.
   */
  private _burnTickAt = 0;
  private _fearHits = new Map<RuntimeUnit, number>();
  private _stepBurning(now: number): void {
    if (now < this._burnTickAt) return;
    this._burnTickAt = now + BURN_STATUS.tick;
    const burning = this._units.filter((u) => u.isBurning(now));
    for (const unit of burning) {
      unit.applyDamage(BURN_STATUS.damage, Vector3.Zero());
      const left = unit.burnUntil - now;
      if (left < BURN_STATUS.keep) continue;
      for (const other of this._units) {
        if (other === unit || other.isDead || other.team !== unit.team || other.isBurning(now)) continue;
        if (Vector3.DistanceSquared(other.position, unit.position) > BURN_STATUS.spread * BURN_STATUS.spread) continue;
        other.applyBurn(left * 0.8, now);
      }
    }
  }

  /*
   * [S] 535 (necromancer c.2; card Characteristics: "if a unit is hit, they will slowly perish, rotting away until their ultimate demise, in which they
   * will be resurrected as a Skeleton of the Necromancer's team") NECRO_CURSE: a man his skull strikes rots, .rot of his full health every .tick s
   * with a sickly green-black puff off him, till he dies; where he falls a skeleton warrior of the Necromancer's side rises (logged "raise_dead" at
   * the corpse). The Necromancer summons nothing else: no free skeletons beside him.
   */
  private _solarShots = new Map<RuntimeUnit, number>();
  private _necroCursed = new Map<RuntimeUnit, number>();
  private _necroTickAt = 0;
  private _necroCurse = (target: RuntimeUnit, team: number): void => {
    if (target.team === team || this._necroCursed.has(target)) return;
    this._necroCursed.set(target, team);
    // raised the moment he dies, by rot, skull or knife: the last enemy's death ends the battle before another step runs
    target.onDeath = (dead) => { if (this._necroCursed.has(dead)) this._raiseCursed(dead, team); };
    this._logMissileAbility("secret.necromancer", "status:curse", target.position);
  };
  private _stepNecroCurse(now: number): void {
    const tickNow = now >= this._necroTickAt;
    if (tickNow) this._necroTickAt = now + NECRO_CURSE.tick;
    for (const [unit, team] of [...this._necroCursed]) {
      if (!unit.isDead && tickNow) {
        unit.applyDamage(unit.maxHealth * NECRO_CURSE.rot, Vector3.Zero());
        this.visualEffects?.spawnSmokePuff(unit.position.add(new Vector3(0, 1.1, 0)), NECRO_CURSE.smoke);
      }
      // raised on the tick he dies: the last enemy's death ends the battle before another step runs
      if (unit.isDead) this._raiseCursed(unit, team);
    }
  }
  private _raiseCursed(unit: RuntimeUnit, team: number): void {
    this._necroCursed.delete(unit);
    const at = unit.position.clone(); at.y = 0;
    let parent: RuntimeUnit | undefined;
    for (const u of this._units) if (!u.isDead && u.team === team && u.definition.id === "secret.necromancer" && (!parent || Vector3.DistanceSquared(u.position, at) < Vector3.DistanceSquared(parent.position, at))) parent = u;
    if (!this.spawnUnitById || this.getLivingCount(team) >= this.summonLivingCap) return;
    const risen = this.spawnUnitById("spooky.skeleton_warrior", team, at, { role: "summoned", linkedParent: parent, linkedRelation: parent ? "spawned-child" : undefined });
    if (!risen) return;
    this.visualEffects?.spawnSmokePuff(at.add(new Vector3(0, 0.3, 0)), NECRO_CURSE.smoke);
    this._logMissileAbility("secret.necromancer", "raise_dead", at);
  }

  /** One ability-log entry; the same kind on the same man within 0.5 s is folded into the last one (a spin or a volley fires every frame or shot). */
  /** A mechanic a missile set off, logged under its shooter's unit id (ProjectileSystem.abilityHook). */
  private _logMissileAbility = (unitId: string, kind: string, at: Vector3): void => {
    if (this.abilityLog.length >= 200) this.abilityLog.shift();
    this.abilityLog.push({ t: RuntimeUnit.timeNowSeconds(), unit: unitId, kind, x: at.x, y: at.y, z: at.z });
  };

  /** A music note off a playing bard's head (BANJO_NOTES), `lift` m higher still, to alternate sides. */
  private _playBanjoNote(unit: RuntimeUnit, lift: number): void {
    if (!this.visualEffects) return;
    const head = unit.body.headTop;
    head.computeWorldMatrix(true);
    const side = this._banjoNoteCount++ % 2 === 0 ? 1 : -1;
    const facing = unit.body.root.rotation.y;
    const at = head.getAbsolutePosition().add(new Vector3(Math.cos(facing) * side * BANJO_NOTES.aside, BANJO_NOTES.over + lift, -Math.sin(facing) * side * BANJO_NOTES.aside));
    this.visualEffects.spawnMusicNote(at, side);
  }

  /** Zeus's lightning chain off the struck man (spec at ZEUS_CHAIN). */
  private _zeusChain(attacker: RuntimeUnit, struck: RuntimeUnit, damage: number, now: number): void {
    const C = ZEUS_CHAIN;
    const reached = new Set<RuntimeUnit>([struck]);
    let from = struck;
    for (let k = 0; k < C.links; k++) {
      let next: RuntimeUnit | null = null;
      let best = C.reach * C.reach;
      for (const unit of this._units) {
        if (unit.isDead || unit.team === attacker.team || !unit.isTargetable || reached.has(unit)) continue;
        const dx = unit.position.x - from.position.x, dz = unit.position.z - from.position.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < best) { best = dSq; next = unit; }
      }
      if (!next) break;
      if (k === 0) this._logAbility(attacker, "lightning_chain", now, next.position);
      this.visualEffects?.spawnZeusBolt(from.position, next.position, true);
      next.applyDamage(damage * C.share, Vector3.Zero());
      reached.add(next);
      from = next;
    }
  }

  /** Each kick under way (spec at PIRATE_KICK): the man booted off his feet at its blow, the foot back down at its end. */
  private _landKicks(now: number): void {
    for (const [unit, kick] of this._kicks) {
      const K = kickOf(unit.definition.id);
      if (unit.isDead || unit.isToppled || unit.isDowned) { unit.animator.setKick(false); this._kicks.delete(unit); continue; }
      if (!kick.done && now >= kick.blowAt) {
        kick.done = true;
        const man = kick.target;
        const off = man.position.subtract(unit.position);
        off.y = 0;
        const reach = unit.collisionBodyRadius + man.collisionBodyRadius + K.within + K.slack;
        if (!man.isDead && off.length() <= reach) {
          const out = off.lengthSquared() > 1e-6 ? off.normalize() : new Vector3(Math.sin(unit.body.root.rotation.y), 0, Math.cos(unit.body.root.rotation.y));
          man.applyDamage(kick.damage, out.scale(K.fling));
          man.applyBlastLaunch(out, K.fling, K.lift);
          const at = unit.position.add(out.scale(unit.collisionBodyRadius + K.within * 0.5));
          this._logAbility(unit, "kick", now, at);
          if (K.plain) {
            if (this.hitLog.length >= 200) this.hitLog.shift();
            const neck = this._neckOf(man);
            worldMatrixChain(man.body.headTop);
            const head = man.body.headTop.getAbsolutePosition();
            this.hitLog.push({ t: now, attackerUnit: unit.definition.id, targetUnit: man.definition.id, x: neck.x, y: neck.y, z: neck.z, head: { x: head.x, y: head.y, z: head.z } });
          }
          this.visualEffects?.spawnKickDust(at, 1.5);
        }
      }
      if (now >= kick.endAt) {
        unit.animator.setKick(false);
        this._kicks.delete(unit);
      }
    }
  }

  /** The Captain's dragon pistol shot (spec at DRAGON_BLAST): the flash and ball from the held-out bell, the man hurt and hurled along the line. */
  private _fireDragonPistol(unit: RuntimeUnit, man: RuntimeUnit, damage: number, now: number): void {
    const B = DRAGON_BLAST;
    const chest = this._chestOf(man);
    const bells = this._pistolBells(unit);
    this.projectileSystem?.spawnPistolShot(bells, chest, B.flash);
    const from = bells[0] ?? unit.position;
    const along = new Vector3(man.position.x - from.x, 0, man.position.z - from.z);
    if (along.lengthSquared() < 1e-6) along.set(Math.sin(unit.body.root.rotation.y), 0, Math.cos(unit.body.root.rotation.y));
    along.normalize();
    man.applyDamage(damage, along.scale(B.fling));
    if (!man.isDead) man.applyBlastLaunch(along, B.fling, B.lift);
    this._logAbility(unit, "dragon_pistol", now, man.position);
  }

  /** Each Bomb Spin under way (spec at BOMB_SPIN): she whirls; at the drop the bombs go out all round her and she is thrown up; the arms down at its end. */
  private _whirlBombSpins(dt: number, now: number): void {
    const S = BOMB_SPIN;
    for (const [unit, spin] of this._bombSpins) {
      if (unit.isDead) { unit.animator.setBombSpin(false); this._bombSpins.delete(unit); continue; }
      unit.body.root.rotation.y += S.rate * dt;
      if (!spin.dropped && now >= spin.dropAt) {
        spin.dropped = true;
        this._logAbility(unit, "bombspin", now);
        const foe = this._units.find((u) => !u.isDead && u.team !== unit.team);
        if (this.projectileSystem && foe) {
          const yaw = unit.body.root.rotation.y;
          for (let i = 0; i < S.count; i++) {
            const a = yaw + (i / S.count) * Math.PI * 2;
            const dir = new Vector3(Math.sin(a), 0, Math.cos(a));
            const at = unit.position.add(dir.scale(S.out));
            at.y = 0;
            this.projectileSystem.spawnProjectile(
              "bomb", unit.position.add(dir.scale(0.45)), foe, spin.damage, dir.scale(1.5), S.splash, unit.team, this._units,
              undefined, 0, { originLift: 1.1, at, flight: S.flight, targetLift: 0 },
            );
          }
        }
        unit.leap(new Vector3(0, 0, 1), 0, S.rise);
      }
      if (now >= spin.endAt) {
        unit.animator.setBombSpin(false);
        this._bombSpins.delete(unit);
      }
    }
  }

  /** Each butt under way (spec at BIG_HEADBUTT / HEADBUTT): the burst at its blow, the head back up at its end. */
  private _landButts(now: number): void {
    for (const [unit, butt] of this._butts) {
      const B = butt.spec;
      if (unit.isDead) { unit.animator.setCharging(false); unit.animator.setDive(false); this._butts.delete(unit); continue; }
      // [S] 401 the headbutter's sprawl after the dive (HEADBUTT_SPRAWL): the dive holds through the blow's own frame
      if (butt.sprawlAt !== undefined && now >= butt.sprawlAt) {
        butt.sprawlAt = undefined;
        unit.animator.setDive(false);
        unit.headbuttSprawl(now);
      }
      if (!butt.done && now >= butt.blowAt) {
        butt.done = true;
        const yaw = unit.body.root.rotation.y;
        const center = unit.position.add(new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).scale(B.ahead + unit.collisionBodyRadius * 0.5));
        center.y = unit.position.y;
        let logged = false;
        for (const other of this._units) {
          if (other.isDead || other.team === unit.team || !other.isTargetable) continue;
          const off = other.position.subtract(center);
          off.y = 0;
          const d = off.length();
          if (d > B.radius) continue;
          const out = d > 0.05 ? off.scale(1 / d) : new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
          const k = 1 - (1 - B.edge) * (d / B.radius);
          other.applyDamage(B.damage, out.scale(B.fling * k));
          other.applyBlastLaunch(out, B.fling * k, B.lift * k);
          // a head in a man's face is a hit on that man, not only an ability: the sim's hit log records it at the blow
          if (!logged && B.lunge > 0) {
            logged = true;
            const chain: TransformNode[] = [];
            for (let n: Node | null = other.body.headTop; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
            for (const n of chain) n.computeWorldMatrix(true);
            const head = other.body.headTop.getAbsolutePosition();
            if (this.hitLog.length >= 200) this.hitLog.shift();
            this.hitLog.push({ t: now, attackerUnit: unit.definition.id, targetUnit: other.definition.id, x: center.x, y: center.y, z: center.z, head: { x: head.x, y: head.y, z: head.z } });
          }
        }
        this._logAbility(unit, "headbutt", now, center);
        this.visualEffects?.spawnTrampleRing(center, B.radius * 0.6);
        this.visualEffects?.spawnKickDust(center, 2);
        // [S] 400 the ram leaves him on the floor (card "After the initial attack, they get up"): a short forward sprawl from the blow
        // [S] 401 ...which starts HEADBUTT_SPRAWL.delay s after it, so the blow's own frame still shows the dive (critic 400: one hand planted)
        if (B === HEADBUTT) {
          butt.sprawlAt = now + HEADBUTT_SPRAWL.delay;
        }
      }
      if (now >= butt.endAt) {
        unit.animator.setCharging(false);
        unit.animator.setDive(false);
        this._butts.delete(unit);
      }
    }
  }

  /**
   * [S] the Longship's hurl (spec at LONGSHIP_HURL): the hull leaps at the man, logged "hurl" with its crew heaving it up. Only in reach of him.
   * Returns true when it has taken the attack in place of a swing.
   */
  private _tryHurlLongship(unit: RuntimeUnit, target: RuntimeUnit, damage: number, now: number): boolean {
    if (unit.definition.id !== "viking.longship" || this._hurled.has(unit)) return false;
    const dir = target.position.subtract(unit.position);
    dir.y = 0;
    const distance = dir.length();
    if (distance < 0.4 || distance > LONGSHIP_HURL.reach) return false;
    dir.normalize();
    unit.faceTarget(target.position);
    const dist = Math.max(1.6, distance - LONGSHIP_HURL.short);
    if (!unit.leap(dir, dist, LONGSHIP_HURL.rise)) return false;
    this._hurled.set(unit, { landed: unit.landings, damage: damage * LONGSHIP_HURL.crush, t0: now });
    unit.setAttackCooldown(now, LONGSHIP_HURL.cooldown);
    unit.stopMoving();
    heaveLongshipCrew(unit.body);
    this._logAbility(unit, "hurl", now, target.position);
    if (this.visualEffects) this.visualEffects.spawnKickDust(unit.position, 2);
    return true;
  }

  /** Each hurled hull's touchdown (spec at LONGSHIP_HURL): the crush round where it lands, the hit log, the crew off the deck. */
  private _landHurledShips(now: number): void {
    for (const [unit, hurl] of this._hurled) {
      if (unit.isDead) { this._hurled.delete(unit); continue; }
      if (unit.landings <= hurl.landed) {
        // in flight: the carriers stay where they threw from, the hull sinks from their hands to the keel line (spec at LONGSHIP_HURL.sink)
        flyLongshipHull(unit.body, (now - hurl.t0) / (LONGSHIP_HURL.sink * 2 * LONGSHIP_HURL.rise / 22));
        continue;
      }
      this._hurled.delete(unit);
      const center = unit.position.clone();
      center.y = 0;
      const yaw = unit.body.root.rotation.y;
      let logged = false;
      for (const other of this._units) {
        if (other.isDead || other.team === unit.team || !other.isTargetable) continue;
        const off = other.position.subtract(center);
        off.y = 0;
        const d = off.length();
        if (d > LONGSHIP_HURL.radius) continue;
        const out = d > 0.05 ? off.scale(1 / d) : new Vector3(Math.sin(yaw), 0, Math.cos(yaw));
        const k = 1 - (1 - LONGSHIP_HURL.edge) * (d / LONGSHIP_HURL.radius);
        other.applyDamage(hurl.damage, out.scale(LONGSHIP_HURL.fling * k));
        other.applyBlastLaunch(out, LONGSHIP_HURL.fling * k, LONGSHIP_HURL.lift * k);
        if (!logged) {
          logged = true;
          const chain: TransformNode[] = [];
          for (let n: Node | null = other.body.headTop; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          const head = other.body.headTop.getAbsolutePosition();
          if (this.hitLog.length >= 200) this.hitLog.shift();
          this.hitLog.push({ t: now, attackerUnit: unit.definition.id, targetUnit: other.definition.id, x: center.x, y: center.y, z: center.z, head: { x: head.x, y: head.y, z: head.z } });
        }
      }
      landLongshipCrew(unit.body);
      this._oarsmen.set(unit, now);
      this._logAbility(unit, "ship_crash", now, center);
      this.visualEffects?.spawnTrampleRing(center, LONGSHIP_HURL.radius * 0.62);
      this.visualEffects?.spawnKickDust(center, 3);
      this.visualEffects?.spawnSmokePuff(center, LONGSHIP_HURL.dust);
    }
  }

  /**
   * [S] 403 the landed oarsmen chop with their oars (spec at vehicleBuilder OAR_CHOP; card "the oarsmen disembark and attack enemy units with their
   * oars"): each step poses the crew's two-handed chop; at the end of each downstroke every oarsman's blow lands on the nearest enemy within
   * LONGSHIP_OARS.reach m of his feet for .damage, pushed off at .push. Not hit-logged (the crash is the longship's logged hit).
   */
  private _chopOars(dt: number, now: number): void {
    for (const [unit, t0] of this._oarsmen) {
      if (unit.isDead) { this._oarsmen.delete(unit); continue; }
      if (!swingLongshipCrew(unit.body, now - t0, dt)) continue;
      for (const at of landedOarsmenAt(unit.body)) {
        const foe = this._nearestFoe(at, unit.team);
        if (!foe) continue;
        const off = foe.position.subtract(at);
        off.y = 0;
        if (off.length() > LONGSHIP_OARS.reach) continue;
        foe.applyDamage(LONGSHIP_OARS.damage, off.normalize().scale(LONGSHIP_OARS.push));
      }
    }
  }

  /** The nearest living, targetable man not of `team` to `at` on the ground, or null. */
  private _nearestFoe(at: Vector3, team: number): RuntimeUnit | null {
    let best: RuntimeUnit | null = null, bestSq = Infinity;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === team || !unit.isTargetable) continue;
      const dSq = (unit.position.x - at.x) ** 2 + (unit.position.z - at.z) ** 2;
      if (dSq < bestSq) { bestSq = dSq; best = unit; }
    }
    return best;
  }

  /**
   * [S] 425 Reel-in (ProjectileSystem.reelIn; card Characteristics: "The Harpooner will then reel in the enemy unit"): the harpoon has struck a man, so
   * the gun whose muzzle the rope is tied to hauls him off his feet along the line toward the shooter, to land HARPOON_REEL.stop m short of him, the
   * rope taut from muzzle to chest for HARPOON_REEL.rope s. Logged as "reel".
   */
  private _reelIn = (target: RuntimeUnit, tether: TransformNode): number => {
    const shooter = this._units.find((u) => !u.isDead && harpoonMuzzleOf(u) === tether);
    if (!shooter || target.isDead) return 0;
    const R = HARPOON_REEL;
    const along = shooter.position.subtract(target.position);
    along.y = 0;
    const dist = along.length();
    if (dist < R.stop + 0.3) return 0;
    // Airborne for 2 lift / g; the launch keeps .85 of its speed on average (its per-body spread), so the haul covers dist - stop in that time
    const air = (2 * R.lift) / 9.81;
    target.applyBlastLaunch(along.normalize(), Math.min(R.top, (dist - R.stop) / air / 0.85), R.lift);
    this._logAbility(shooter, "reel", this._now, target.position);
    return R.rope;
  };

  /** A flying snake has landed (ProjectileSystem.snakeLand): it goes on as a live snake on the turf there (spec at SNAKE_LIVE). */
  private _landSnake =(at: Vector3, from: Vector3, team: number): void => {
    const scene = this._units[0]?.body.root.getScene();
    if (!scene) return;
    const L = SNAKE_LIVE;
    const foe = this._nearestFoe(at, team);
    const root = new TransformNode("liveSnake", scene);
    root.position.set(at.x, foe ? foe.position.y : 0, at.z);
    // laid head on toward the nearest foe, or on along its line of flight
    const to = foe ? foe.position.subtract(at) : at.subtract(from);
    root.rotation.y = Math.atan2(to.x, to.z);
    const snake = buildGroundSnake(scene, "liveSnakeBody", L.long);
    snake.root.parent = root;
    snake.root.position.set(0, 0, -snake.bodyL);
    const now = RuntimeUnit.timeNowSeconds();
    this._snakes.push({ s: { root, snake, born: now, bites: 0, restUntil: now + 0.15, lungeUntil: 0, phase: 0 }, team });
    this._logMissileAbility("ancient.snake_archer", "snake_land", root.position);
  };

  /** Every live snake slithers at its nearest foe, lunges and bites (spec at SNAKE_LIVE); spent ones go in a puff. */
  private _slitherSnakes(dt: number, now: number): void {
    const L = SNAKE_LIVE;
    for (let i = this._snakes.length - 1; i >= 0; i--) {
      const { s, team } = this._snakes[i];
      const foe = this._nearestFoe(s.root.position, team);
      if (s.bites >= L.bites || now - s.born >= L.life || !foe) {
        this.visualEffects?.spawnSmokePuff(s.root.position.clone());
        s.root.dispose();
        this._snakes.splice(i, 1);
        continue;
      }
      const to = foe.position.subtract(s.root.position);
      to.y = 0;
      const dist = to.length();
      const lunging = now < s.lungeUntil;
      if (!lunging) s.root.rotation.y = Math.atan2(to.x, to.z);
      const reach = L.reach + foe.definition.collisionRadius;
      let step = 0;
      if (lunging) step = L.dash;
      else if (dist > reach * 0.7) step = L.speed;
      if (step > 0 && dist > 0.05) {
        const go = Math.min(step * dt, Math.max(0, dist - foe.definition.collisionRadius * 0.6));
        s.root.position.x += Math.sin(s.root.rotation.y) * go;
        s.root.position.z += Math.cos(s.root.rotation.y) * go;
      }
      s.root.position.y = foe.position.y;
      // the travelling S: each piece thrown to a side by where it lies along the body, the tail most
      s.phase += dt * L.wave * (lunging ? 0.4 : step > 0 ? 1 : 0.35);
      const k = L.waves * Math.PI * 2;
      const side = (along: number) => Math.sin(s.phase - along * k) * L.sway * (1 - 0.45 * along);
      const slope = (along: number) => (-Math.cos(s.phase - along * k) * k * L.sway * (1 - 0.45 * along) - 0.45 * L.sway * Math.sin(s.phase - along * k)) / s.snake.bodyL;
      for (const m of s.snake.segs) {
        const along = (m.metadata as { snakeAlong: number }).snakeAlong;
        m.position.x = side(along);
        m.rotation.y = Math.atan(slope(along));
        // stretched by the bend so the bands still meet along the curve
        m.scaling.y = Math.sqrt(1 + slope(along) ** 2);
      }
      // the head rides the body's front, held up, and rears through the lunge
      s.snake.neck.position.x = side(1);
      s.snake.neck.rotation.y = Math.atan(slope(1));
      s.snake.neck.rotation.x = lunging ? -L.rear : 0;
      if (lunging && now + dt >= s.lungeUntil) {
        if (dist <= reach + 0.2) {
          foe.applyDamage(L.bite, to.normalize().scale(1.5));
          s.bites++;
          this._logMissileAbility("ancient.snake_archer", "snake_bite", foe.position);
        }
        s.restUntil = now + L.rest;
        s.lungeUntil = 0;
      } else if (!lunging && dist <= reach && now >= s.restUntil) {
        s.lungeUntil = now + L.lunge;
      }
    }
  }

  private _clearSnakes(): void {
    for (const { s } of this._snakes) if (!s.root.isDisposed()) s.root.dispose();
    this._snakes = [];
    for (const g of this._tossed) if (!g.node.isDisposed()) g.node.dispose();
    this._tossed = [];
  }

  /** [S] 426 The world mouths of the pistols in a man's fists (propBuilder "flintlock": its "musketMuzzle" node at the bell), world matrices settled. */
  private _pistolBells(unit: RuntimeUnit): Vector3[] {
    const out: Vector3[] = [];
    for (const hand of [unit.body.rightHand, unit.body.leftHand]) {
      if (!hand) continue;
      for (const node of hand.getDescendants(false, (n) => n.name === "musketMuzzle")) {
        if (!(node instanceof TransformNode) || !node.isEnabled()) continue;
        const chain: TransformNode[] = [];
        for (let n: Node | null = node; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
        for (const n of chain) n.computeWorldMatrix(true);
        out.push(node.getAbsolutePosition().clone());
      }
    }
    return out;
  }

  /** [S] 426 A man's chest, where his torso mesh is drawn (a point over his root when it is gone). */
  private _chestOf(unit: RuntimeUnit): Vector3 {
    const chest = unit.body.torsoMesh;
    if (!chest || chest.isDisposed()) return unit.position.add(new Vector3(0, 1, 0));
    const chain: TransformNode[] = [];
    for (let n: Node | null = chest; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    return chest.getAbsolutePosition().clone();
  }

  /** [S] 425 Guns thrown away after the shot (GUN_TOSS), tumbling to the turf where they lie until GUN_TOSS.lie runs out. */
  private _tossed: { node: TransformNode; vel: Vector3; spin: Vector3; left: number }[] = [];

  /**
   * [S] 425 The Flintlock throws his pistols away as soon as the shot is fired (card Characteristics), then closes bare-fisted: each pistol leaves its
   * fist where it is, flung out to its own side, back over his shoulder and up (GUN_TOSS out, back, up m/s) and turning end over end, and he becomes a
   * light melee man (RuntimeUnit.disarmToFists), his first punch due GUN_TOSS.ready s on. Logged as "toss".
   */
  private _tossGuns(unit: RuntimeUnit, now: number): void {
    const G = GUN_TOSS;
    const b = unit.body;
    b.root.computeWorldMatrix(true);
    const rootM = b.root.getWorldMatrix();
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), rootM);
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    let k = 0;
    for (const hand of [b.rightHand, b.leftHand]) {
      if (!hand) continue;
      const gun = hand.getChildren().find((n): n is TransformNode => n instanceof TransformNode && n.getChildren().some((c) => c.name === "pistolBell"));
      if (!gun) continue;
      const chain: TransformNode[] = [];
      for (let n: Node | null = gun; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      gun.setParent(null);
      const side = Math.sign(Vector3.Dot(Vector3.TransformNormal(new Vector3(1, 0, 0), rootM), gun.position.subtract(unit.position))) || (k === 0 ? 1 : -1);
      const out = Vector3.Cross(Vector3.Up(), fwd).scale(-side);
      const vel = out.scale(G.out).addInPlace(fwd.scale(-G.back)).addInPlace(new Vector3(0, G.up, 0));
      const euler = gun.rotationQuaternion ? gun.rotationQuaternion.toEulerAngles() : gun.rotation.clone();
      gun.rotationQuaternion = null;
      gun.rotation.copyFrom(euler);
      this._tossed.push({ node: gun, vel, spin: new Vector3(G.spin * (k === 0 ? 1 : -1), G.spin * 0.4, 0), left: G.lie });
      k++;
    }
    if (k === 0) return;
    unit.animator.dropPistols();
    unit.disarmToFists(now, G.ready);
    this._logAbility(unit, "toss", now);
  }

  /**
   * [S] 464 the Pike drops his pike after one attack and then slaps (audit 457 pike c.2: "the pike is still in hand after the attack - TABS: it loses
   * its pike after one attack and then slaps"; card Characteristics). On the step his first blow lands, the pike (the "shaft" in his weapon fist) leaves
   * the fist where it is and falls, PIKE_DROP.ahead m/s forward and .up m/s up, turning .spin rad/s, to lie on the turf with the tossed guns; the
   * animator lets go of its levelled hold, and he fights on bare-handed (RuntimeUnit.disarmToFists), his first slap due .ready s on. Logged "drop".
   */
  private _dropPike(unit: RuntimeUnit, now: number): void {
    const P = PIKE_DROP;
    const pike = unit.body.rightHand.getDescendants(false, (n) => n.name === "shaft")[0] as TransformNode | undefined;
    if (!pike) return;
    worldMatrixChain(pike);
    pike.setParent(null);
    const fwd = new Vector3(Math.sin(unit.body.root.rotation.y), 0, Math.cos(unit.body.root.rotation.y));
    const euler = pike.rotationQuaternion ? pike.rotationQuaternion.toEulerAngles() : pike.rotation.clone();
    pike.rotationQuaternion = null;
    pike.rotation.copyFrom(euler);
    this._tossed.push({ node: pike, vel: fwd.scale(P.ahead).addInPlace(new Vector3(0, P.up, 0)), spin: new Vector3(P.spin, 0, 0), left: GUN_TOSS.lie });
    unit.animator.dropPike();
    unit.disarmToFists(now, P.ready);
    this._logAbility(unit, "drop", now);
  }

  private _stepTossedGuns(dt: number): void {
    for (let i = this._tossed.length - 1; i >= 0; i--) {
      const g = this._tossed[i];
      g.left -= dt;
      if (g.left <= 0 || g.node.isDisposed()) {
        if (!g.node.isDisposed()) g.node.dispose();
        this._tossed.splice(i, 1);
        continue;
      }
      if (g.vel.lengthSquared() === 0) continue;
      g.vel.y -= 9.81 * dt;
      g.node.position.addInPlace(g.vel.scale(dt));
      g.node.rotation.addInPlace(g.spin.scale(dt));
      // Lying on the turf: flat on its side, still
      if (g.node.position.y <= GUN_TOSS.rest) {
        g.node.position.y = GUN_TOSS.rest;
        g.vel.setAll(0);
        g.node.rotation.x = Math.PI / 2;
      }
    }
  }

  private _logAbility(unit: RuntimeUnit, kind: string, t: number, at: Vector3 = unit.position): void {
    const id = unit.definition.id;
    for (let i = this.abilityLog.length - 1; i >= 0 && this.abilityLog[i].t > t - 0.5; i--) {
      if (this.abilityLog[i].unit === id && this.abilityLog[i].kind === kind) return;
    }
    if (this.abilityLog.length >= 200) this.abilityLog.shift();
    this.abilityLog.push({ t, unit: id, kind, x: at.x, y: at.y, z: at.z });
  }

  /** `shock` is the push the crowd around him and the impact presentation see, the knockback itself unless the man's own share of it is held back (a dwelling blow). */
  private _applyDirectOrSplash(target: RuntimeUnit, damage: number, splashRadius: number, attackerTeam: number, knockback: Vector3, shock: Vector3 = knockback): void {
    if (splashRadius > 0) {
      // The neighbours in the splash take the blow's real push; only the man it is on has his held back
      this._applySplashDamage(target.position, splashRadius, attackerTeam, damage, shock, target, knockback);
    } else {
      const delta = target.applyDamage(damage, knockback);
      if (this.impactPresentation) {
        this.impactPresentation.recordImpact({
          source: "simulation",
          path: "direct",
          position: target.position,
          target,
          impactDelta: delta,
          damage,
          impulse: shock,
          attackerTeam,
        });
      } else if (this.visualEffects) {
        this.visualEffects.spawnImpactDust(target.position);
        this.visualEffects.spawnHitDebris(target.position);
      }
    }
    const shockRadius = splashRadius > 0 ? splashRadius + 0.85 : 1.55;
    this._applyCrowdShockwave(target.position, shockRadius, attackerTeam, shock.scale(splashRadius > 0 ? 0.3 : 0.2), target);
  }

  /** `primaryImpulse` is the push the primary target himself takes, the splash's own unless his share is held back (a dwelling blow: zero, thrown later). */
  private _applySplashDamage(center: Vector3, radius: number, attackerTeam: number, damage: number, impulse: Vector3, primaryTarget?: RuntimeUnit, primaryImpulse: Vector3 = impulse): void {
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit.isDead || unit.team === attackerTeam || !unit.isTargetable) continue;
      const distanceSq = unit.position.subtract(center).lengthSquared();
      if (distanceSq > radiusSq) continue;
      const distance = Math.sqrt(distanceSq);
      const falloff = radius > 0 ? Math.max(0, 1 - distance / radius) : 1;
      const delta = unit.applyDamage(damage, unit === primaryTarget ? primaryImpulse : impulse);
      const path = unit === primaryTarget ? "splash-primary" : "splash-secondary";
      if (this.impactPresentation) {
        this.impactPresentation.recordImpact({
          source: "simulation",
          path,
          position: unit.position,
          target: unit,
          impactDelta: delta,
          damage,
          impulse,
          radius,
          falloff,
          attackerTeam,
        });
      } else if (this.visualEffects) {
        this.visualEffects.spawnImpactDust(unit.position);
        this.visualEffects.spawnHitDebris(unit.position);
      }
    }
  }

  private _applyCrowdShockwave(
    center: Vector3,
    radius: number,
    attackerTeam: number,
    impulse: Vector3,
    primaryTarget?: RuntimeUnit,
  ): void {
    const baseMagnitude = impulse.length();
    if (baseMagnitude < 0.55 || radius <= 0.5) return;
    const radiusSq = radius * radius;
    for (const unit of this._units) {
      if (unit === primaryTarget || unit.isDead || unit.team === attackerTeam || !unit.isTargetable || unit.linkedParent) continue;
      const delta = unit.position.subtract(center);
      delta.y = 0;
      const distanceSq = delta.lengthSquared();
      if (distanceSq <= 0.00001 || distanceSq > radiusSq) continue;
      const distance = Math.sqrt(distanceSq);
      const falloff = 1 - distance / radius;
      if (falloff <= 0) continue;
      const direction = delta.scale(1 / distance);
      const displacement = direction.scale(baseMagnitude * 0.05 * falloff);
      const pressure = baseMagnitude * 0.7 * falloff;
      unit.applyCrowdDisplacement(displacement, pressure, direction.scale(-1), 1 + falloff * 0.35);
      this.impactPresentation?.recordImpact({
        source: "simulation",
        path: "crowd-shock",
        position: unit.position,
        target: unit,
        impulse,
        radius,
        falloff,
        attackerTeam,
        crowdMetrics: {
          pressure,
          displacementMagnitude: displacement.length(),
          impulseMagnitude: baseMagnitude,
        },
      });
    }
  }

  private _selectEnemyTarget(requester: RuntimeUnit, aiProfile: AIProfile): RuntimeUnit | null {
    let best: RuntimeUnit | null = null;
    let bestScore = Infinity;

    for (const candidate of this._units) {
      if (candidate.isDead || candidate.team === requester.team || !candidate.isTargetable) continue;
      // the man on his own tendril is stabbed by it, not faced (REAPER_IMPALE)
      if (this._impales.get(candidate)?.holder === requester) continue;
      const score = this._scoreCandidate(requester, candidate, aiProfile.targetPriority);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  private _selectAllyToSupport(requester: RuntimeUnit, aiProfile: AIProfile): RuntimeUnit | null {
    let best: RuntimeUnit | null = null;
    let bestScore = Infinity;

    for (const candidate of this._units) {
      if (candidate.isDead || candidate.team !== requester.team || candidate === requester || !candidate.isTargetable) continue;
      if (candidate.currentHealth >= candidate.maxHealth) continue;
      const score = this._scoreCandidate(requester, candidate, aiProfile.targetPriority);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }

    return best;
  }

  private _scoreCandidate(requester: RuntimeUnit, candidate: RuntimeUnit, priority: TargetPriority): number {
    // Nearest is by the hide too: measured to its middle a giant was never the nearest enemy of the men pressed against it.
    const hide = Math.max(0, candidate.position.subtract(requester.position).length() - Math.max(0, candidate.collisionBodyRadius - requester.collisionBodyRadius));
    // A giant draws the men round it: within 2 of its hide it counts as touching, and past that as six tenths as far, so they turn on it and do not fight on beside its legs.
    const hideDistance = candidate.collisionBodyRadius > requester.collisionBodyRadius * 2 ? Math.max(0, hide - 2) * 0.6 : hide;
    const baseDistanceScore = hideDistance * hideDistance;
    const linkedRolePenalty = candidate.linkedParent ? 9 : 0;

    switch (priority) {
      case TargetPriority.LowestHealth:
        return candidate.currentHealth + baseDistanceScore * 0.01 + linkedRolePenalty * 0.1;
      case TargetPriority.HighestCost:
        return -candidate.definition.cost + baseDistanceScore * 0.001 + linkedRolePenalty * 0.1;
      default:
        return baseDistanceScore + linkedRolePenalty;
    }
  }

  private _cleanupExpiredCorpses(now: number): void {
    for (let i = this._units.length - 1; i >= 0; i--) {
      const unit = this._units[i];
      if (!unit.isDead || now < unit.deathCleanupAt) continue;

      this._nextDecisionAt.delete(unit);
      for (const mesh of unit.body.allMeshes) {
        mesh.isVisible = false;
      }
      // Gear leaves with the body: a field of loose hats and weapons with no corpses reads as a bug.
      for (const mesh of unit.propMeshes) {
        mesh.isVisible = false;
      }
      if (unit.healthBarMesh) unit.healthBarMesh.isVisible = false;
      if (unit.healthBarBg) unit.healthBarBg.isVisible = false;
    }
  }

  private _resolveHazardAwareMoveTarget(unit: RuntimeUnit, desired: Vector3): Vector3 {
    if (this.hazards.length === 0) return desired;

    const start = unit.position;
    for (const hazard of this.hazards) {
      if (hazard.shape !== "box") continue;

      const padding = Math.max(4.5, unit.definition.collisionRadius + 3.5);
      const left = hazard.center.x - hazard.halfX - padding;
      const right = hazard.center.x + hazard.halfX + padding;
      const top = hazard.center.z - hazard.halfZ - padding;
      const bottom = hazard.center.z + hazard.halfZ + padding;
      if (!this._segmentIntersectsBox(start, desired, left, right, top, bottom)) continue;

      const topCost = Math.abs(start.z - top) + Math.abs(desired.z - top);
      const bottomCost = Math.abs(start.z - bottom) + Math.abs(desired.z - bottom);
      const bypassZ = topCost <= bottomCost ? top : bottom;
      const startOnLeft = start.x <= hazard.center.x;
      const desiredOnLeft = desired.x <= hazard.center.x;
      const crossingHazard = startOnLeft !== desiredOnLeft;
      const nearX = startOnLeft ? left : right;
      const farX = startOnLeft ? right : left;
      const alignedToBypassLane = Math.abs(start.z - bypassZ) <= 2.5;

      if (crossingHazard) {
        return new Vector3(alignedToBypassLane ? farX : nearX, desired.y, bypassZ);
      }

      return new Vector3(nearX, desired.y, bypassZ);
    }

    return desired;
  }

  private _segmentIntersectsBox(
    start: Vector3,
    end: Vector3,
    left: number,
    right: number,
    top: number,
    bottom: number,
  ): boolean {
    const pointInside = (point: Vector3) => (
      point.x >= left && point.x <= right && point.z >= top && point.z <= bottom
    );
    if (pointInside(start) || pointInside(end)) return true;

    const dx = end.x - start.x;
    const dz = end.z - start.z;
    let tMin = 0;
    let tMax = 1;

    const clipAxis = (p: number, q: number): boolean => {
      if (Math.abs(p) < 0.000001) {
        return q >= 0;
      }
      const ratio = q / p;
      if (p < 0) {
        if (ratio > tMax) return false;
        if (ratio > tMin) tMin = ratio;
      } else {
        if (ratio < tMin) return false;
        if (ratio < tMax) tMax = ratio;
      }
      return true;
    };

    return (
      clipAxis(-dx, start.x - left)
      && clipAxis(dx, right - start.x)
      && clipAxis(-dz, start.z - top)
      && clipAxis(dz, bottom - start.z)
      && tMin <= tMax
    );
  }
}
