import { Color3, Mesh, Node, TransformNode, Vector3 } from "@babylonjs/core";
import { CREW_FIGHT, poseWheelbarrowCrew, wheelbarrowCrew } from "../units/vehicleBuilder";
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
import type { HazardRegion } from "../map/hazards";
import { isPointInsideHazard } from "../map/hazards";
import type { PlacementZone } from "../map/placementValidator";
import type { Obstacle } from "../map/obstacles";
import { NavigationGrid } from "../map/navigation";

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
  switch (unit.definition.projectileHint) {
    case "arrow": return "arrow";
    case "bolt": return "bolt";
    case "bomb": return "bomb";
    case "stone": return unit.definition.specialHint === "cannon" ? "cannonball" : "stone"; // a cannon fires an iron ball, not the catapult's rock
    case "spear": return "spear";
    case "firework": return "firework";
    case "shuriken": return "shuriken";
    case "rocket_arrow": return "rocket_arrow";
    case "crow": return "crow";
    case "fireball": return "fireball";
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
const THROWS_HELD_PROP = new Set(["javelin", "bomb", "stone", "potion"]);
/*
 * [S] planted full-draw loose (354; medieval.archer.jpg: feet set, bow arm out, string at the cheek as the arrow leaves; card shoot delay 1.2 s). A bowman here
 * does not loose at the decision with the bow at his hip: the draw (proceduralAnimation bow_draw_release) runs first and the arrow leaves the bow at its
 * release point (bowReleasesIn), from where the bow is then. Logged "throw" at the loose, as a held throw is.
 */
const DRAWS_BEFORE_LOOSE = new Set(["medieval.archer"]);
// [S] the potionseller's potions splash men drunk instead of blowing up (342; ProjectileSystem DRUNK_SPLASH): drunk men stagger about, not fighting (DRUNK_WANDER)
const DRUNK_POTIONS = new Set(["farmer.potion_seller"]);
// A drunk man's wander: he reels off DRUNK_WANDER.reach m toward a heading that swings round at .swing rad/s from his own hashed start
const DRUNK_WANDER = { reach: 2.5, swing: 0.9 };
// Archers whose arrows carry a balloon: the man struck floats up under balloons (renaissance.balloon_archer; RuntimeUnit.floatOnBalloons)
const BALLOON_ARROWS = new Set(["renaissance.balloon_archer"]);
// Bowmen whose arrows fly with a red shaft and a large black broadhead (ProjectileSystem._dressBroadhead; medieval.archer.blue.png)
const BROADHEAD_ARROWS = new Set(["medieval.archer"]);
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
    case "bomb": return 1.4;
    case "rocket_arrow": return 0.65;
    case "bolt": return 0.7;
    case "davinci_ball": return 0.8;
    default: return 1;
  }
}

function shouldSpawnProjectileMuzzleFx(shape: ProjectileShape): boolean {
  return shape === "shell" || shape === "bomb" || shape === "rocket_arrow" || shape === "bolt" || shape === "davinci_ball";
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
 * [S] Minotaur Charge (378; card Characteristics "It attacks by charging at its opponents ... If hit with a projectile, it will charge sooner", ability
 * "charges, headbutting the enemy"; ancient.minotaur.png: head down, horns first, men flung off him). The mammoth's charge on two legs: an enemy
 * MINOTAUR_CHARGE.from to .reach m past his reach sets him sprinting at the man at .speed times his pace, head down (BULL_CHARGE pose); the man he
 * meets is butted aside and up hard (.fling/.lift) for .damage, which ends the run, and he fights on with his fists. .cooldown s between charges.
 * Logged "charge" at the start and "trample" at the hit.
 */
const MINOTAUR_CHARGE = { from: 1.5, reach: 14, speed: 2.3, seconds: 2.2, overrun: 1, contact: 0.4, damage: 30, fling: 7, lift: 5, cooldown: 6, through: false, log: true };
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
const FENCER_DODGE = { dist: 2.2, back: 1.0, seconds: 0.22, cooldown: 2.5, kind: "dodge" };
/*
 * [S] 373 Painter Dodge (card Abilities "makes units instinctively sidestep whenever a projectile comes into their way"; Characteristics "They can dodge
 * incoming projectiles"). When a missile flying at a painter is PAINTER_DODGE.warn s from reaching him (ProjectileSystem.incomingAt), the painter, unless
 * he is already sliding or downed, sidesteps square to its line of flight: a ground slide .dist m in .seconds s on the fencer's slide (fast at first,
 * easing), facing his nearest foe; his sides alternate; .cooldown s between dodges. The missile stops following him and comes down where he stood
 * (ProjectileSystem.loseTarget). Logged .kind.
 */
const PAINTER_DODGE = { warn: 0.3, dist: 1.6, seconds: 0.2, cooldown: 1.2, kind: "dodge" };
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
  // A presser's distance to his foe at his last decision: while it is still closing he holds his heavy swing until he is at the man's shoulder.
  private _closingFrom = new Map<RuntimeUnit, number>();
  // one-blow-per-man: when a striker who closed on his man may first bring his weapon down (see STRIKE_LAG)
  private _strikeReadyAt = new Map<RuntimeUnit, number>();
  // Halflings holding on to their man (HALFLING_CLING): the man, the side he hangs on, when he lets go (set once the man is dead)
  private _clings = new Map<RuntimeUnit, { target: RuntimeUnit; side: number; until: number }>();
  private _nextDecisionAt = new Map<RuntimeUnit, number>();
  // Mammoth Charge (MAMMOTH_CHARGE): the charger's target and heading, the men it has trampled this run, and when it may charge again
  private _charges = new Map<RuntimeUnit, { target: RuntimeUnit; dir: Vector3; trampled: Set<RuntimeUnit>; spec: ChargeSpec; end: Vector3 | null }>();
  // When a charging mammoth next kicks up dust, and how many kicks it has made (alternating feet) (MAMMOTH_DUST)
  private _chargeDustAt = new Map<RuntimeUnit, number>();
  private _chargeDustKick = new Map<RuntimeUnit, number>();
  private _chargePosed = new Set<RuntimeUnit>();
  // The wheelbarrow's riders (WHEELBARROW_CREW): each move's start and its man, and when the next may start
  private _crewFights = new Map<RuntimeUnit, { throwAt: number; thrown: boolean; appleAt: RuntimeUnit | null; stabAt: number; stabbed: boolean; stabOn: RuntimeUnit | null }>();
  private _chargeReadyAt = new Map<RuntimeUnit, number>();
  // Farmer back-step (FARMER_BACKSTEP): when each farmer last stabbed, and the farmers backing off now (their heading held on the man)
  private _stabbedAt = new Map<RuntimeUnit, number>();
  private _backingOff = new Set<RuntimeUnit>();
  // Hop back (HOP_BACK): when each man's last blow landed, and when he may hop again
  private _landedAt = new Map<RuntimeUnit, number>();
  private _hopReadyAt = new Map<RuntimeUnit, number>();
  // Fencer recover (FENCER_RECOVER): each sliding man, his flat way back, when it started and the man he faces
  private _recovers = new Map<RuntimeUnit, { dir: Vector3; from: number; foe: RuntimeUnit; dist: number; seconds: number }>();
  // Fencer Dodge (FENCER_DODGE): when each fencer may dodge again, and which side he goes next
  private _dodgeReadyAt = new Map<RuntimeUnit, number>();
  private _dodgeSide = new Map<RuntimeUnit, number>();
  // [S] 369 balloon arrows loosed from the draw fist (renaissanceDress heldBalloonArrow): each held arrow and when the next is back in the hand
  private _arrowsAway = new Map<Node, number>();
  // Banjo Walk (BANJO_WALK): the bards running their circles now, and which way each turns
  private _banjoWalks = new Map<RuntimeUnit, number>();
  private _banjoTurns = 0;
  // When each walking bard's next note is due (BANJO_NOTES), and a count to alternate their sides
  private _banjoNotes = new Map<RuntimeUnit, number>();
  private _banjoNoteCount = 0;
  private _jumpReadyAt = new Map<RuntimeUnit, number>();
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
  }

  beginSimulation(now: number): void {
    this._pendingBlows = [];
    this._clings.clear();
    this._pendingThrows = [];
    this._pendingLaunches = [];
    this._closingFrom.clear();
    this._strikeReadyAt.clear();
    this._charges.clear();
    this._chargeReadyAt.clear();
    this._stabbedAt.clear();
    this._backingOff.clear();
    this._landedAt.clear();
    this._hopReadyAt.clear();
    this._recovers.clear();
    this._dodgeReadyAt.clear();
    this._dodgeSide.clear();
    for (const held of this._arrowsAway.keys()) if (!held.isDisposed()) held.setEnabled(true);
    this._arrowsAway.clear();
    this._banjoWalks.clear();
    this._banjoNotes.clear();
    this._banjoNoteCount = 0;
    this._banjoTurns = 0;
    this._jumpReadyAt.clear();
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

    for (const unit of this._units) {
      unit.update(dt, now);
    }
    // After the animation step, so the frame a blow lands on is the frame its club is down on the man
    if (this._pendingBlows.length > 0) this._landPendingBlows(now);
    if (this._pendingLaunches.length > 0) this._fireDwelledLaunches(now);
    if (this._pendingThrows.length > 0) this._launchPendingThrows(now);

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
    if (this._recovers.size > 0) this._slideRecovers(dt, now);
    if (this._clings.size > 0) this._holdClings(now);
    if (this._charges.size > 0) this._trampleCharges(now);
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
      if (this._recovers.has(unit)) continue;

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

  private _resolveLivingCollisions(): void {
    const roots = this._units.filter((unit) => !unit.isDead && !unit.linkedParent && !this._clings.has(unit));
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
    // A lancer lays his couched lance on the man he rides at (aimLanceAt): at the man's chest, LANCE_AIM_REACH m out, at LANCE_CHEST of his height up
    if (distance <= engageDistance + LANCE_AIM_REACH && unit.body.rightHand?.getChildren().some((n) => n.name === "lance")) {
      unit.animator.aimLanceAt(new Vector3(enemy.position.x, enemy.position.y + (enemy.body.headTop.getAbsolutePosition().y - enemy.position.y) * LANCE_CHEST, enemy.position.z));
    }

    if (hasAbility(unit, "teleport") && distance > engageDistance && distance < engageDistance * 3 && unit.canAttack(now)) {
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(unit.position);
      const dir = enemy.position.subtract(unit.position).normalize();
      const teleportDist = Math.min(distance - engageDistance * 0.65, 8);
      const newPos = unit.position.add(dir.scale(teleportDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(newPos);
      unit.setAttackCooldown(now, attackProfile.cooldown * 0.5);
      this._logAbility(unit, "teleport", now);
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

    // Mammoth Charge: start a run at a man far enough off, and while running, drive on through him (MAMMOTH_CHARGE); the wheelbarrow's ram (WHEELBARROW_RAM)
    const chargeSpec = preset === "iconic_mammoth" ? MAMMOTH_CHARGE : unit.definition.id === "farmer.wheelbarrow" ? WHEELBARROW_RAM
      : unit.definition.id === "medieval.knight" ? KNIGHT_CHARGE : unit.definition.id === "renaissance.jouster" ? JOUSTER_CHARGE
      : unit.definition.id === "ancient.minotaur" ? MINOTAUR_CHARGE : null;
    if (chargeSpec && canMove) {
      const run = this._charges.get(unit);
      if (run && (!unit.isCharging || (run.target.isDead && !run.end))) {
        unit.endCharge();
        this._charges.delete(unit);
      } else if (!run && distance > engageDistance + chargeSpec.from && distance < engageDistance + chargeSpec.reach && now >= (this._chargeReadyAt.get(unit) ?? 0)) {
        const dir = enemy.position.subtract(unit.position);
        dir.y = 0;
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

    if ((hasAbility(unit, "jump_charge") || hasAbility(unit, "leap_attack")) && distance > engageDistance && distance < engageDistance * 2.5 && unit.canAttack(now)) {
      const dir = enemy.position.subtract(unit.position).normalize();
      const leapDist = Math.min(distance - engageDistance * 0.4, 4.5);
      const newPos = unit.position.add(dir.scale(leapDist));
      newPos.y = 0;
      unit.teleportTo(newPos);
      this._clearPathState(unit);
      unit.setAttackCooldown(now, attackProfile.cooldown * 0.35);
      this._logAbility(unit, "leap", now);
      return;
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
      if (canAttack && !closing && !lagged) {
        const ready = unit.canAttack(now);
        this._tryAttack(unit, enemy, attackProfile, now);
        if (ready && !unit.canAttack(now) && unit.definition.id === "farmer.farmer") this._stabbedAt.set(unit, now);
      }
    } else {
      if (canMove) {
        this._moveUnitToward(unit, enemy.position, engageDistance, now);
      } else {
        unit.stopMoving();
        this._clearPathState(unit);
      }
    }
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
      if (this.visualEffects) this.visualEffects.spawnSmokePuff(ally.position);
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
        // The jouster's lance goes into the man he rides at as the horse reaches him (JOUSTER_CHARGE)
        if (C === JOUSTER_CHARGE && other === run.target && unit.canAttack(now)) this._tryAttack(unit, other, getAttackProfile(unit.definition.attackProfileId), now);
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

    if (preset === "iconic_chronomancer") {
      this._logAbility(attacker, "slow_dome", now, target.position);
      this._applyAreaControl(target.position, Math.max(3.6, splashRadius + 1.1), attacker.team, damage * 0.72, knockback.scale(0.55 * controlStrength), now, 0.34, attacker.definition.statusDurationSeconds ?? 3.8);
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(target.position);
        this.visualEffects.spawnSpellDome(target.position, Math.max(3.6, splashRadius + 1.1), new Color3(0.55, 0.62, 0.95));
      }
      return;
    }

    if ((abilities.has("summon") || abilities.has("clone") || abilities.has("revive")) && this._summonUnits(attacker)) {
      if (attacker.definition.archetype === "summoner" || attacker.definition.archetype === "support_buff") {
        return;
      }
    }

    if (preset === "iconic_zeus") {
      this._logAbility(attacker, "lightning", now, target.position);
      if (this.visualEffects) {
        this.visualEffects.spawnLightning(attackOrigin, target.position);
        this.visualEffects.spawnLightning(attackOrigin, target.position.add(new Vector3(0.8, 0, 0.6)));
        this.visualEffects.spawnLightning(attackOrigin, target.position.add(new Vector3(-0.8, 0, -0.6)));
      }
      this._applyDirectOrSplash(target, damage * 1.12, Math.max(3.3, splashRadius + 1.1), attacker.team, knockback.scale(1.95 * controlStrength));
      return;
    }

    if (preset === "iconic_thor") {
      this._logAbility(attacker, "lightning", now, target.position);
      if (this.visualEffects) {
        this.visualEffects.spawnLightning(attackOrigin, target.position);
        this.visualEffects.spawnSmokePuff(attackOrigin);
      }
      this._applyDirectOrSplash(target, damage * 1.22, Math.max(2.4, splashRadius + 0.5), attacker.team, knockback.scale(2.15 * controlStrength));
      return;
    }

    if (abilities.has("lightning_strike")) {
      this._logAbility(attacker, "lightning", now, target.position);
      if (this.visualEffects) {
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
      this._applyAreaControl(target.position, Math.max(3.1, splashRadius + 0.9), attacker.team, damage * 1.08, knockback.scale(1.12), now);
      return;
    }

    if (preset === "iconic_pirate_queen") {
      this._logAbility(attacker, "slam", now, target.position);
      if (this.visualEffects) {
        this.visualEffects.spawnSmokePuff(target.position, new Color3(0.92, 0.56, 0.38));
      }
      this._applyDirectOrSplash(target, damage * 1.2, Math.max(2.6, splashRadius + 0.5), attacker.team, knockback.scale(1.2));
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

    if (abilities.has("rapid_fire") || preset === "secret_burst_crossbow" || preset === "secret_bank_robbers" || preset === "secret_sensei" || preset === "secret_gatling") {
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
        if (isFirearmUnit(attacker)) {
          this.projectileSystem.spawnMuzzleFlash(
            smokeOriginInfo.position,
            impulseDir,
            1,
            { originLift: originLiftForSource(smokeOriginInfo.source) },
          );
          this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, knockback);
          const fling = GUN_FLING[attacker.definition.weaponHint ?? ""];
          if (fling && !target.isDead) {
            const along = new Vector3(impulseDir.x, 0, impulseDir.z);
            if (along.lengthSquared() > 1e-6) target.applyBlastLaunch(along.normalize(), fling.speed, fling.lift);
          }
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
        } else if (staffHeadOf(attacker) && /^(fireball|leaves)$/.test(resolveProjectileShape(attacker, attackProfile) ?? "") && attacker.animator.castReleasesIn() > 0) {
          // The cast has only started: the fireball leaves the staff's head when the staff is driven level at the man, the bone mage's leaves
          // when his staff is up over his head
          this._pendingThrows.push({
            attacker, target, shape: resolveProjectileShape(attacker, attackProfile)!, damage, splashRadius, knockback, leavesAt: now + attacker.animator.castReleasesIn(), fromStaff: true,
          });
        } else if (staffHeadOf(attacker) && resolveProjectileShape(attacker, attackProfile) === "fireball") {
          // A caster keeps his staff: the fireball is lit at its head, not thrown from his hip
          const head = staffHeadOf(attacker)!;
          const chain: TransformNode[] = [];
          for (let n: Node | null = head; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
          for (const n of chain) n.computeWorldMatrix(true);
          this.projectileSystem.spawnProjectile(
            "fireball", head.getAbsolutePosition().clone(), target, damage, knockback, splashRadius, attacker.team, this._units,
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
          this.projectileSystem.spawnProjectile(
            resolveProjectileShape(attacker, attackProfile) ?? "arrow",
            attackOrigin,
            target,
            damage,
            knockback,
            splashRadius,
            attacker.team,
            this._units,
            undefined,
            0,
            { originLift: originLiftForSource(attackOriginInfo.source), balloons: BALLOON_ARROWS.has(attacker.definition.id) ? attacker.definition.id : undefined, broadhead: BROADHEAD_ARROWS.has(attacker.definition.id), drunk: DRUNK_POTIONS.has(attacker.definition.id) ? attacker.definition.id : undefined },
          );
          // [S] 369 the balloon arrow in his draw fist is the one that flew: gone from the hand until half the reload is past (renaissanceDress HELD_BALLOON_ARROW)
          const held = BALLOON_ARROWS.has(attacker.definition.id) ? attacker.body.leftHand?.getChildren((n) => n.name === "heldArrow")[0] : undefined;
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
  private _tryDodge(unit: RuntimeUnit, foe: RuntimeUnit, now: number): void {
    const D = FENCER_DODGE;
    if (unit.definition.id !== "renaissance.fencer" || unit.isDead || unit.isToppled || unit.isDowned || this._recovers.has(unit)) return;
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
    this._recovers.set(unit, { dir, from: now, foe, dist: D.dist, seconds: D.seconds });
    this._dodgeReadyAt.set(unit, now + D.cooldown);
    // the blow was struck at where he stood: it comes down on air
    this._pendingBlows = this._pendingBlows.filter((b) => !(b.attacker === foe && b.target === unit));
    this._logAbility(unit, D.kind, now, foe.position);
  }

  /** Painter Dodge (PAINTER_DODGE): each ready painter with a missile about to reach him sidesteps off its line, and it comes down on air. */
  private _painterDodges(now: number): void {
    const D = PAINTER_DODGE;
    const missiles = this.projectileSystem;
    if (!missiles) return;
    for (const unit of this._units) {
      if (unit.definition.id !== "renaissance.painter" || unit.isDead || unit.isToppled || unit.isDowned || this._recovers.has(unit)) continue;
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
      missiles.loseTarget(unit);
      this._logAbility(unit, D.kind, now, unit.position);
    }
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
      unit.teleportTo(unit.position.add(r.dir.scale(step)));
      if (!r.foe.isDead) unit.holdHeading(Math.atan2(r.foe.position.x - unit.position.x, r.foe.position.z - unit.position.z));
    }
  }

  private _landMeleeBlow(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, splashRadius: number, knockback: Vector3, now: number, impactOrigin: Vector3): void {
    // The striker's aim is pinned where the blow lands before the man is thrown off that point
    attacker.animator.blowStruck();
    if (HOP_BACK[attacker.definition.id]) this._landedAt.set(attacker, now);
    if (attacker.definition.id === "renaissance.fencer" && !attacker.isDead && !this._recovers.has(attacker)) this._startRecover(attacker, target, now);
    const heavy = attacker.animator.defaultAttackMotion === "heavy_swing";
    // A heavy blow that leaves him standing dwells on him (BLOW_DWELL): the push is withheld from the damage step and fired with the throw; the crowd
    // around him still takes the blow's shock now
    const dwells = heavy && target.currentHealth > damage;
    // Contact first, recoil second (trailer_3_sheet_01 r2c3: the club head is on the man as he starts to go): while the blow dwells on him his flinch is
    // held, so the land frame shows the club on his crown or shoulders and not his head already snapped 0.8 m back off it (pose bench, hoplite duel);
    // the throw at the dwell's end lays the recoil on
    if (dwells) target.holdFlinch(BLOW_DWELL);
    // ...and he buckles under it on this same step (struck-man buckle, r2c3: knees give, head down, arms out of his guard) till the throw takes him
    if (dwells) target.animator.buckleUnder();
    this._applyDirectOrSplash(target, damage, splashRadius, attacker.team, dwells ? Vector3.Zero() : knockback, knockback);
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
    // The struck man recoils on the frame the blow lands, not the next one: his pose for this step was set before the blow
    target.reposeNow();
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
    // [S] 364 the mammoth's stomp lands as a trample: a dust ring runs out over the ground and earth is thrown up (visualEffects TRAMPLE_RING)
    if (this.visualEffects && attacker.definition.id === "tribal.mammoth") {
      this.visualEffects.spawnTrampleRing(new Vector3(target.position.x, attacker.position.y, target.position.z), Math.max(2, splashRadius));
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
          t.shape, origin.position, target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0, { originLift: originLiftForSource(origin.source), broadhead: BROADHEAD_ARROWS.has(attacker.definition.id) },
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
      const prop = attacker.animator.heldThrowProp();
      // The pose was set this step: bring the hand's chain up to it before reading where the prop is
      const chain: TransformNode[] = [];
      for (let n: Node | null = prop ?? attacker.body.rightHand; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      const from = (prop ?? attacker.body.rightHand).getAbsolutePosition().clone();
      this.projectileSystem.spawnProjectile(
        t.shape, from, target, t.damage, t.knockback, t.splashRadius, attacker.team, this._units, undefined, 0,
        { originLift: 0, heldProp: prop ?? undefined, drunk: DRUNK_POTIONS.has(attacker.definition.id) ? attacker.definition.id : undefined },
      );
      if (prop) attacker.animator.letGoOfThrow(prop);
    }
  }

  private _summonUnits(attacker: RuntimeUnit): boolean {
    if (!this.spawnUnitById) return false;
    if (this.getLivingCount(attacker.team) >= this.summonLivingCap) return false;
    if (attacker.spawnRole === "summoned" && getBehaviorPreset(attacker) === "iconic_monkey_king") return false;

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
      const pos = attacker.position.add(new Vector3(Math.cos(angle) * spacing, 0, Math.sin(angle) * spacing));
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
        this._logAbility(attacker, "summon", RuntimeUnit.timeNowSeconds(), pos);
        if (this.visualEffects) {
          this.visualEffects.spawnSmokePuff(
            pos,
            preset === "iconic_dark_peasant"
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
          attackOrigin,
          target,
          perShotDamage,
          knockback.scale(0.4),
          splashRadius > 0 ? splashRadius * 0.5 : 0,
          attacker.team,
          this._units,
          offset,
          i * 0.04,
          { originLift: originLiftForSource(attackOriginInfo.source) },
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
  }

  private _fireVolley(attacker: RuntimeUnit, target: RuntimeUnit, damage: number, knockback: Vector3, count: number): void {
    this._logAbility(attacker, "volley", RuntimeUnit.timeNowSeconds());
    const projectileShape = resolveProjectileShape(attacker, getAttackProfile(attacker.definition.attackProfileId)) ?? "arrow";
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
        projectileShape === "bomb" || projectileShape === "fireball" ? 0.8 : 0,
        attacker.team,
        this._units,
        spread,
        i * 0.05,
        { originLift: originLiftForSource(attackOriginInfo.source) },
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
      this._logAbility(attacker, "status:freeze", now, target.position);
    }
    if (abilities.has("fire_dot")) {
      const fireDamage = preset === "secret_fire_whip" || preset === "secret_dragon_cart" ? 14 : 10;
      const source = impactOrigin ?? attacker.position;
      target.applyDamage(fireDamage, target.position.subtract(source).normalize().scale(0.3));
      if (this.visualEffects) this.visualEffects.spawnFireBurst(target.position);
      this._logAbility(attacker, "status:fire", now, target.position);
    }
    if (abilities.has("poison")) {
      target.applyDamage(6, Vector3.Zero());
      this._logAbility(attacker, "status:poison", now, target.position);
    }
    if (abilities.has("fear") && this.visualEffects) {
      this.visualEffects.spawnSmokePuff(target.position);
      this._logAbility(attacker, "status:fear", now, target.position);
    }
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
