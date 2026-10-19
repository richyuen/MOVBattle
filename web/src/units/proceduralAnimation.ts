import { Matrix, Mesh, Quaternion, Vector3, type Node, type TransformNode } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";
import { SWORD_RING_BOB } from "./propBuilder";

export enum AnimState {
  Idle,
  Walking,
  Attacking,
  Dead,
}

/**
 * TABS-style procedural animation: wobbly sine-wave driven joints.
 * All rotation values are in radians.
 */
export type AttackStyle = "humanoid" | "mammoth";
export type WalkStyle = "humanoid" | "quadruped";
export type AttackMotion =
  | "strike"
  | "heavy_swing"
  | "blade_slash"
  | "thrust"
  | "throw"
  | "bow_draw_release"
  | "crossbow_snap"
  | "firearm_recoil"
  | "reload"
  | "crank"
  | "brace"
  | "carry"
  | "breath";
export type LocomotionBias = "none" | "heavy_carry" | "aimed" | "braced";
/** A weapon that turns in the fist: the turn and the offset it was strapped on with, and for a bow the spin about its length and where its middle sits from the fist. */
type CarriedProp = { node: TransformNode; rest: Quaternion; grip: Vector3; spin?: Quaternion; seat?: Vector3; plant?: number };
export type ReleaseTimingProfile =
  | "default"
  | "melee_commit"
  | "thrust_extend"
  | "bow_release"
  | "crossbow_release"
  | "firearm_recoil"
  | "throw_release";

/*
 * The shield press, rebuilt. Spec, read off the reference:
 *   tabs_screenshot_06 (a shield wall closing, two ranks deep): no two men carry the trunk at one angle; the chests are pitched forward of the hips by anything from about 10 to
 *   about 30 degrees and the heads are not levelled back, each sits on its trunk at its own tilt. Every man is at his own point of a stride, one knee forward and bent. The boards
 *   stand at different turns and tilts, following the shoulders behind them. Six spears show, all in the rear rank, and every one of them is RAISED: the shafts stand above the
 *   helmets at pitches between about 60 and 85 degrees above level, parallel, none crossing another and none crossing a head. No spear in the wall lies level.
 *   trailer_3_sheet_01 r3c1 (five spearmen with the spear up to strike): the fist is at the ear, above the shoulder, the elbow carried out behind, the trunk leant a little back,
 *   the shaft beside the cheek; five shafts at five slightly different pitches.
 * So:
 *   Trunk: a braced man's trunk pitch is his own, BRACE_PITCH_MIN..MAX forward of the hips, and it is his whatever he is doing under it (stepping in, standing, striking): the
 *   walk's lean and the shove's cap no longer bring a rank to one angle. His head follows the trunk by his own share and is tucked or lifted on top of that. The lead shoulder is
 *   turned into the board, and the board turns and tilts with it.
 *   Spears: one line per wall. From the moment a man is slotted into a wall his spear stands on the wall's heading at SPEAR_WALL_UP above level, the same for every man in it,
 *   front rank and rear, whichever way his own body is turned: so the shafts are parallel and none crosses another or a head, and its butt drops beside his own hip. The stroke
 *   runs the shaft through the fist along that line and back; it never tips the shaft down. A front man's spear is not levelled or dipped either: no wall spear in the reference lies level, and a shaft half as tall again
 *   as the man, pointed at an enemy under a pace away, either runs on through him or is pushed back through the fist into the man behind. He holds it couched low instead, the
 *   fist at his waist in front of him and gripped near the butt, SPEAR_FRONT_GRIP_MIN..MAX of its length from it, and raised on the same line as the rear rank's spears, so the
 *   point stands over the enemy's head and the short end below the fist points down behind him to his heel, through nobody.
 *   Each works his stroke on his own beat: drawn back SPEAR_DRAW of a lunge, thrown SPEAR_LUNGE metres along the wall's raised line, brought back.
 *   Legs: a braced man is on his feet, not sat on his heels. The deepest crouch folds the knees BRACE_CROUCH_DEEP at most and the step of the drive leg is BRACE_STEP_MIN..MAX.
 */
const BRACE_PITCH_MIN = 0.14;
const BRACE_PITCH_MAX = 0.56;
const SPEAR_LUNGE = 0.45;
const SPEAR_DRAW = -0.4;
const SPEAR_WALL_UP = 1.48;
// A rear-rank spear thrust overhand over the boards at a foe in reach: this far above level (see _carrySpear).
const SPEAR_OVERHAND_UP = 0.18;
const SPEAR_FRONT_GRIP_MIN = 0.2;
const SPEAR_FRONT_GRIP_MAX = 0.28;
// The front rank's boards in a wall in contact (see _lapBoard): how far ahead of the rank's line their plane stands, and the one turn off square every board in it takes.
const BOARD_PLANE_REACH = 0.42;
// How far a pressed board's top is tipped forward into the foe (radians), at full shove (see _lapBoard).
const BOARD_PRESS_TILT = 0.3;
/*
 * The wall surface (242 [R]; tabs_screenshot_06: the front boards are one battered surface, not a row of tiles). Read off the reference: neighbouring boards stand at
 * clearly different turns (some near square, some a third edge-on), at different heights (a head's height between the highest and lowest rim), some tipped into
 * the foe and some leaning back on their bearer, and one stands proud of the next by up to a hand. So each front-rank man's board carries its own seeds, used whole:
 *   depth off the strip +-WALL_BOARD_DEPTH m, height +-WALL_BOARD_STEP m, a turn +-WALL_BOARD_TURN rad on top of BOARD_LAP, a standing lean WALL_BOARD_LEAN
 *   (back to forward, rad) to which the press adds half BOARD_PRESS_TILT and a third of his trunk pitch, and his roll. The faces differ too (propBuilder ROUND_FACES).
 */
const WALL_BOARD_DEPTH = 0.09;
const WALL_BOARD_STEP = 0.1;
const WALL_BOARD_TURN = 0.38;
const WALL_BOARD_LEAN = [-0.2, 0.3];
// How far a pressing wall man's drive leg goes back (radians at the hip, at full shove); his lead knee and trunk follow it (see the brace).
const PRESS_DRIVE = 0.4;
// The tree giant's hip carry: the arm reached forward and down, the elbow nearly straight, so the fist rides at the hip ahead of the thigh (units/secret.tree_giant),
// and where the trunk points in the body's frame (x out, y up, z ahead).
const TREE_HIP_ARM = { raise: -0.9, out: 0.15, elbow: -0.4 };
// 267 [R], 269 (units/secret.tree_giant): the trunk runs out near level from the fist to his flank and a little ahead, and its bow (built to the trunk's own
// +x; see the spec over TREE_CLUB_LONG in propBuilder) is turned to face up, so the trunk rises a little into a crown centred on its end, hip-high at his side.
const TREE_HIP_TIP = new Vector3(0.9, 0.02, 0.35);
// The scythe's high carry (units/spooky.reaper): the fist up in front of the chest, the snath slanted up and out over his weapon shoulder so its head
// rides above the hood, and the crescent turned flat to the front (SCYTHE_SPIN about the snath), sweeping back in over the hood and curling down.
const SCYTHE_HIGH_ARM = { raise: -0.95, out: 0.22, elbow: -1.05 };
const SCYTHE_HIGH_TIP = new Vector3(0.6, 0.78, 0.15);
const SCYTHE_SPIN = Math.PI / 2;
/*
 * [S] the harvester's scythe carry (342; farmer.harvester.red.png: both fists on the snath at hip height, the snath run diagonally across his front from
 * the butt low past his weapon hip up to the head beyond his off shoulder, the blade hanging down from its top end). A scythe whose snath carries the
 * "snathPeg" mark (unitFactory SNATH_PEG) takes this carry in place of the high one: weapon arm SCYTHE_LOW.raise swing, .out, .elbow fold so the fist is
 * before the weapon hip; the snath's line from the fist .tip in his own frame (x toward the weapon side, y up, z forward); the crescent turned .spin about
 * the snath. The off fist is put on the upper peg by _twoHandPole (POLE_GRIP.snathPeg).
 */
/*
 * [S] the scarecrow's T-pose (344; farmer.scarecrow.png: he stands with both arms held straight out level to the sides, a crow in each fist and one
 * perched upright on each elbow; card Characteristics "back to the T-pose when reloaded, waiting for their crows to perch onto their arms"). A body with
 * a crow in the weapon fist (propBuilder heldCrow, "crowHeldBody") stands and walks with both upper arms out to the sides TPOSE.lift short of level,
 * swung TPOSE.ahead forward, elbows straight; it eases in and out at .rate (out of it to attack). Each perched crow (propBuilder buildPerchedCrow, on
 * the shoulder at the elbow) is kept upright and facing his front whatever the arm does, sat .perch of his height above the elbow's middle.
 * [S] T-pose release, A-pose reload (345; card Characteristics "They will go into an A-pose when reloading, before going back to the T-pose when reloaded,
 * waiting for their crows to perch onto their arms"): he keeps the T through the attack, so the crows leave from his outstretched arms; .after s past the
 * volley (noteReload) his arms come down to the A, .a rad out from hanging, the perched crows gone, for the rest of the reload; reloaded, back up to the T
 * with the crows on his elbows again.
 */
const TPOSE = { lift: 0.04, ahead: 0.12, rate: 8, perch: 0.07, a: 0.5, after: 0.6 };
/*
 * [S] Big Crow Wings hover (347; card "a pair of Big Crow Wings, keeping them hovered", farmer.scarecrow.png: he hangs in the air feet clear of the path, wings
 * spread): the scarecrow's whole body is held HOVER.lift of his height off the turf (the hip carried up; the sim's footing is untouched, so blows and the
 * crow throw still start where they did), bobbing HOVER.bob of his height at HOVER.rate rad/s, and each wing (its wingRoot on the torso) beats slowly about
 * its spread, HOVER.beat rad up and down in time with the bob (down-beat lifts him). A knocked-down or dead scarecrow drops to the ground (limp, Dead).
 */
const HOVER = { lift: 0.13, bob: 0.025, rate: 2.4, beat: 0.28, rateIn: 3 };
const SCYTHE_LOW = { raise: -0.3, out: 0.12, elbow: -0.75, tip: new Vector3(-0.8, 0.5, 0.3), spin: Math.PI / 2 };
/**
 * [S] the potionseller's hang (377; farmer.potion_seller.red.png: both arms hang near straight at his sides, a flask in each fist at the hip, never
 * raised to the chest): whatever the hashed carry, a flask in the fist takes this attitude for the weapon arm and the same for the off arm.
 */
const POTION_HANG = { raise: 0.04, out: 0.16, elbow: -0.14, tip: new Vector3(0, -1, 0.2), left: { raise: 0.04, out: 0.16, elbow: -0.14 } };
/*
 * [S] the harvester's sweep (345; card Characteristics "swing and cut ... sweep through groups of fragile units at once, with even enough power to send one
 * into the air"; farmer.harvester.png): not a chop from overhead but a low level cut across his front. The low-carried (pegged) scythe's attack:
 *   cock (0 -> commit): the trunk wound SCYTHE_SWEEP.twist (rad) round onto his weapon side, the snath swung back level to SCYTHE_SWEEP.cock (yaw from his
 *   front toward the weapon side, rad) at .low below level, both fists low before the hips (arms .arm forward), knees bent .crouch;
 *   cut (commit -> .through of the rest): the trunk unwinds to .twist the other way and the snath sweeps level through his front to .end (toward the off
 *   side), slow off the cock and fastest across the front; the blow is on the man where the snath crosses his front (.hitAt of the cut);
 *   hold to .hold of the rest, then eased back to the carry. Through the cut the crescent is turned .roll about the snath, so it lies flat, not hanging. The sim throws a man the sweep leaves alive up and away (simulationSystem SCYTHE_FLING).
 */
const SCYTHE_SWEEP = { roll: Math.PI / 2, twist: 0.75, cock: 2.0, end: -1.1, low: 0.12, arm: -0.55, crouch: 0.25, through: 0.55, hitAt: 0.55, hold: 0.75 };
/*
 * [S] the hay baler's level stick carry (344; farmer.hay_baler.blue.png: the stick held in the one weapon fist at hip height before the bale, run level
 * across his front to past the off hip). The stick (id hayStick) takes HAY_CARRY in place of the low fork carry: weapon arm .raise swing forward and .out,
 * elbow .elbow folded so the fist is ahead of the weapon hip clear of the bale's face; the stick's line from the fist .tip in his own frame (x toward the
 * weapon side, y up, z forward), level and across. Like the scythe he stands in it from the first frame, not eased round from the fist's strapped angle.
 */
const HAY_CARRY = { raise: -0.6, out: 0.1, elbow: -0.85, tip: new Vector3(-0.95, 0.02, 0.32) };
// A wall man's trunk is carried no further over than this (radians), and his head is brought back up by this share of it, face level over the rim.
const WALL_TRUNK_MAX = 0.3;
const WALL_HEAD_LEVEL = 0.9;
// A wall man's legs (see the upright pass): the most a knee folds and a thigh swings (radians), and the share of the brace's hip sink he keeps.
const WALL_KNEE_MAX = 0.35;
const WALL_HIP_MAX = 0.35;
const WALL_SINK_SHARE = 0.3;
const BOARD_LAP = 0.22;
const BOARD_PLANE_MAX_OUT = 0.7;
// Where a board rides on its rank's strip: this share of the bearer's neck height above his feet (chest height; tabs_screenshot_06 boards run chin to knee).
const BOARD_SEAT_HEIGHT = 0.62;
// The shield fist is reached to this far behind the board's seat, at its back, so it does not come through the face.
const BOARD_GRIP_BACK = 0.12;
/** The front man's couched spear arm: the upper arm hangs forward of plumb by this much and the elbow folds the forearm up to carry the fist at the waist. */
const SPEAR_COUCH_RAISE = -0.45;
const SPEAR_COUCH_ELBOW = -1.25;
const BRACE_CROUCH_DEEP = 0.7;
const BRACE_STEP_MIN = 0.22;
const BRACE_STEP_MAX = 0.5;
/*
 * The bowman's shot. Spec, read off trailer_3_sheet_01 r1c1 (an archer with the bow up): the stave stands upright in the fist of the leading arm, out in front of the face
 * at the end of that arm, its two limbs above and below the fist; the other hand is at the string by the chest or cheek; he stands part side-on with the bow shoulder to his mark.
 * So: he turns BOW_TURN_MIN..MAX off the line of the shot, his own amount, and leans back off the bow by his own amount; and the stave does not go back to hanging from the hand
 * while he shoots, as it did: it is turned in the fist to stand upright, canted a little toward the mark, for as long as the bow arm is up (see _carryProp).
 */
const BOW_TURN_MIN = 0.95;
const BOW_TURN_MAX = 1.3;
/** A caster does not hold his rod from a squat: of whatever crouch his rest stance has, he keeps this share. */
const CASTER_CROUCH = 0.3;
/** A javelin man's rest stance (374, _buildIdlePose): always hip-shot, crouch at most .crouch, forward lean .lean + up to .lean2. */
const JAVELIN_UPRIGHT = { crouch: 0.04, lean: 0.08, lean2: 0.06 };
/** The halberdier's rest stance (376, _buildIdlePose): square on straight legs, hip tilt .tilt, stride .stride, no crouch, lean .lean. */
const HALBERD_SQUARE = { tilt: 0.03, stride: 0.12, lean: 0.04, spread: 0.09, knee: 0.06 };
/** A heavy weapon's arc in the fist, radians from straight up: cocked up and back over the shoulder, landed forward and down on the mark. */
const CLUB_COCK = -0.4;
const CLUB_LAND = 1.8;
/*
 * [S] two-handed grip (units/tribal.clubber, card Weapon Type Two-handed; tribal.clubber.jpg: both fists stacked on the grip, the off hand above the weapon
 * hand). A club with nothing in the other hand is held in both: after the carry or the swing has turned the club in the weapon fist, the off hand is reached
 * onto the shaft OFFHAND_GRIP_UP of the club's length above that fist (the fists touch), wherever the shaft is, cocked over the shoulder, laid on a man or
 * coming down. The off arm is solved (shoulder swing and elbow fold) for that point every frame, its elbow stood out to his free side and down (see _offhandToGrip).
 */
const OFFHAND_GRIP_UP = 0.11;
/*
 * [S] two-fisted sword (353; medieval.squire.blue.png: both fists stacked on the longsword's hilt; card Weapon Type Two-handed). A slab sword whose blade
 * carries one of these markers (propBuilder SlabCut.fists) is held in both fists: wherever the carry or the swing has the blade, the off fist is reached onto
 * the grip TWO_FIST_SWORD of the grip's length below where the weapon fist sits on it (toward the pommel), so the blade leads and the fists share the hilt.
 * Not the pole carry (POLE_GRIP): that turns the sword pommel-first (351). Held through idle, the march and the swing.
 */
const TWO_FIST_SWORD: Record<string, number> = { longswordFists: 0.4, zweiFists: 0.4 };
/*
 * [S] the Knight's arming sword held out (355; medieval.knight.red.png: the sword arm out from his side at the waist, the whole grey blade stood up and a
 * little out beside the shield, never shouldered along the arm). A blade marked `armingOut` (propBuilder, weaponVariant arming_sword) skips the four hashed
 * carries: the weapon arm .raise forward, .out from the side, elbow .elbow, the blade's point toward .tip (body frame: x out to the weapon side, y up, z ahead).
 */
const ARMING_OUT = { raise: -0.35, out: 0.85, elbow: -0.55, tip: [0.35, 0.9, 0.25] as const };
/*
 * [R] two fists on the long grip (354; medieval.king.jpg, .red.png: the King's Zweihander held in both fists, arms run down to the hilt before his belly).
 * Spec read off the renders: the weapon fist closes on the grip right under the cross (the Zweihander's mount seats it there, propBuilder ZWEI.seat), the off
 * fist sits stacked under it on the grip, about a fist apart (TWO_FIST_SWORD of the grip below the weapon fist), the pommel clear below both; never an off hand
 * in the air beside the guard. The solve (see _swordInBothFists), every frame after the carry or the swing has placed the blade:
 * 1. the wanted off-fist point on the grip, TWO_FIST_SWORD grip lengths under the weapon fist, kept between the pommel end and FISTS_ON_GRIP.gap of the drop
 *    under the weapon fist;
 * 2. when the off shoulder cannot reach it, the point of that range inside the off arm's reach (the reach sphere cut with the grip line) nearest it;
 * 3. when no point of the range is in reach (a one-armed swing out at his side carries the grip 1.4-1.8 m off a 0.9 m arm), the weapon fist is drawn in toward
 *    the off shoulder by the shortfall, the weapon arm re-solved with the blade keeping its attitude in the world, so the cut is swung in both fists before him;
 *    then 2. again. FISTS_ON_GRIP.reach: the share of the arm's full length taken as its reach (the solver leaves the elbow a little bent).
 */
const FISTS_ON_GRIP = { gap: 0.75, reach: 0.96, pommel: 0.4 };
// The couched lance (see _couchLance): weapon arm swing and elbow at rest, the shaft's dip below level and turn in across the horse (rad), the attack's drive and trunk pitch
const COUCH = { raise: -0.35, elbow: -1.35, dip: 0.08, across: 0.12, drive: 0.5, pitch: 0.2 };
// The couched lance turned onto its man (see aimLanceAt): seconds an aim holds after the last call, how fast the lance comes onto him and off (1/s)
const LANCE_AIM = { hold: 0.6, rate: 4 };
/*
 * [S] two-handed pole (329; renaissance.halberd.jpg: both fists on the shaft, spaced, the off hand nearer the head). A pole whose root carries one of these
 * marks is held in both hands in every living state but limpness: the weapon arm poses as before and the off hand is solved (as the club's, _offArmTo) onto
 * the shaft where it passes nearest the off shoulder, kept within the span [from, to] of the shaft's length out along it from the weapon fist (_twoHandPole).
 */
const POLE_GRIP = {
  hpoint: [0.15, 0.45], // the halberd (and every glaive built on it)
  musketFore: [0.3, 0.7], // the matchlock: the off hand under the fore-stock (renaissance.musketeer.jpg)
  forkBar: [0.2, 0.5], // the pitchfork: the off hand up the shaft toward the head (farmer.farmer.red.png)
  snathPeg: [0.28, 0.32], // the harvester's scythe: the off hand on the upper peg (SCYTHE_LOW)
  banjoNeck: [0.6, 0.95], // the bard's banjo: the off hand fretting up the neck (medieval.bard.red.png)
} as const;
/*
 * [S] shouldered aim (331; renaissance.musketeer.jpg: the stock to him, the barrel out at the target, smoke at the muzzle). The weapon fist is solved (_armTo) onto a point MUSKET_AIM.ahead of his height before the weapon shoulder, .inward toward the cheek and .drop below it, so the
 * butt behind the fist sits in the shoulder; the musket is stood level along his front over its rest, the off hand following it on the fore-stock
 * (_twoHandPole). The shot leaves as the attack starts, often straight from the march, so the aim is held in every living state (eased back in at .rate
 * per s after a fall), and the muzzle kicks up .kick (rad) at the shot, settling at .settle per s.
 */
const MUSKET_AIM = { ahead: 0.17, inward: 0.03, drop: 0.03, rate: 10, kick: 0.25, settle: 6 };
// The halberd's vertical chop (see _animateHalberdChop): the shaft's tilt from straight up toward his front, raised and landed (rad), the weapon arm's
// swing and elbow at each, the trunk's pitch and the off foot's step at the land, and the share of the attack it is held on the man
// The halberd at rest (see _restHalberd): the weapon fist's seat in shares of his height from the weapon shoulder, the shaft's tilt toward his front (rad)
const HALBERD_REST = { ahead: 0.13, inward: 0.12, drop: 0.24, tilt: 0.05 };
const CHOP = { raised: -0.55, landed: 1.95, armUp: -2.7, elbowUp: -0.9, armDown: -1.25, elbowDown: -0.15, pitch: 0.35, step: -0.4, hold: 0.1 };
// The chop aimed onto its man (see _chopOnto): how far under his crown the axe lands (m at scale 1), the landing tilt's range from straight up (rad),
// and the most of the axe head's reach the shaft may be drawn back through the fists
const CHOP_ONTO = { below: 0.12, min: 0.9, max: 2.1, slide: 0.6 };
/*
 * [S] blow held down (335; card Characteristics "a vertical chop that can deal devastating damage": the axe stays down on the man for a beat before it is
 * raised). The chop keeps its own clock from the land, whatever the state does after it: the halberd, the weapon arm and the trunk are held at the landed
 * pose for CHOP_DOWN.hold s, then eased back to the rest over CHOP_DOWN.rise s, laid over the walk or the stand that follows the attack (see _holdChopDown).
 */
const CHOP_DOWN = { hold: 0.35, rise: 0.3 };
/*
 * [S] palette held up (328; renaissance.painter.jpg: the off arm out from the shoulder and the forearm up, the palette flat at chest height beside him).
 * A palette in the off hand is held up in every state but death and limpness, laid over the stand, the walk and the swing (see _holdPalette): shoulder
 * swung forward PALETTE_HOLD.raise and out PALETTE_HOLD.out, elbow folded PALETTE_HOLD.elbow; it breathes PALETTE_HOLD.sway on its own beat.
 */
const PALETTE_HOLD = { raise: -1.0, out: -0.55, elbow: -1.2, sway: 0.05 };
/*
 * [S] palette out and face-up (331; renaissance.painter.jpg: the palette out to his off side at shoulder height, tilted face-up, the body and the brush clear
 * of it). Over PALETTE_HOLD the off hand is solved (_offArmTo) onto a point beside the off shoulder, PALETTE_OUT.side of his height out, .fwd ahead and .drop
 * below, in the body's frame (the swing's trunk twist does not bring it round in front), and the board stood in the world face-up, tipped .tip to his front.
 */
const PALETTE_OUT = { side: 0.24, fwd: 0.1, drop: 0.07, tip: 0.35 };
// The rider's heater (see _holdHeater): where the off fist is held off the off shoulder (shares of his height: forward, out, down) and how far the board's
// face is turned from his off side toward his front (rad)
const HEATER_HOLD = { fwd: 0.2, side: 0.08, drop: 0.2, turn: 0.35 };
/*
 * [S] lunge (330; card Characteristics "thrusts forward to attack with its foil then steps back"; renaissance.fencer.png: the sword arm straight out level
 * at the foe, the blade on its line, the front foot well in, the rear leg long). A rapier is not brought down on a man (no _aimBlow): it is thrust.
 * Guard (to the commit): fist drawn in by the chest, elbow folded LUNGE.guardElbow, sword shoulder turned forward LUNGE.turn, the rapier point-first
 * (see RAPIER_POINT). Lunge (commit to the land): arm out level (LUNGE.reach), elbow straight, trunk
 * pitched in LUNGE.pitch, the sword-side leg out in front (LUNGE.front, knee LUNGE.knee), the rear leg long behind (LUNGE.back), the hip carried
 * LUNGE.step of its height toward the foe and sunk. Held LUNGE.hold, then the step back: the hip LUNGE.back step behind its stand, arm back to the guard.
 */
/** Share of the hip's rest height the lunge legs give up: the mean drop of the bent front leg and the straight rear one (thigh = shin = half). */
const lungeSinkShare = (): number => 1 - (0.5 * Math.cos(LUNGE.front) + 0.5 * Math.cos(LUNGE.front + LUNGE.knee) + Math.cos(LUNGE.back)) / 2;
/*
 * [S] The farmer's pitchfork stab (347; card Characteristics "swing and stab enemy units", farmer.farmer.png): not the generic thrust (whose arm drive left the
 * low-carried fork trailing in the turf behind a bare fist). The fork is turned in the fist level at the enemy, tines first (through _sweepTip/_clubHold, so
 * a blow on him cannot tip it): drawn back (0 -> commit) with the weapon fist at the hip, the trunk turned back FORK_STAB.turn and sat back, the tines
 * FORK_STAB.cock up; driven (commit -> the blow's landing) both arms out to FORK_STAB.reach, the trunk pitched FORK_STAB.pitch over a front leg stepped out
 * FORK_STAB.step of the hip height, the tines FORK_STAB.dip down onto the chest, home FORK_STAB.land of the way through the attack, where the sim lands
 * the hit (blowLandsIn holds it till then, as for the halberd's chop; the draw takes FORK_STAB.commit of that); held to the attack's end, then eased back to the carry over FORK_STAB.back of it. Run on its own clock as a pose layer (_holdForkStab), so the
 * walk the farmer steps in on does not cut it short.
 */
const FORK_STAB = { land: 0.7, commit: 0.62, back: 0.3, cock: 0.18, dip: -0.08, turn: 0.35, drawRaise: -0.25, drawElbow: -1.45, reach: -1.3, offReach: -1.2, pitch: 0.28, step: 0.3, front: -0.7, knee: 0.55, hold: 0.25 };
/*
 * [S] The bard's banjo carry (351; medieval.bard.red.png, .png: the pot at his weapon hip, the neck up across his chest to the off shoulder, the face out,
 * the off hand fretting the neck). Laid in his own frame and both arms solved onto it, as the fork carry: the weapon fist BANJO_HOLD.out of the hip
 * height out to his weapon side, .up above the hip joint, .ahead in front of it; the neck laid from it along (-.across to the off side, .rise up, .forward
 * ahead), the pot's face turned out before him; the off fist on the neck by _twoHandPole (POLE_GRIP.banjoNeck). Idle and walking; the attack swings it.
 */
const BANJO_HOLD = { out: 0.2, up: 0.1, ahead: 0.32, across: 0.72, rise: 0.66, forward: 0.12 };
const FORK_HOLD = { out: 0.16, drop: -0.1, ahead: 0.22, across: 0.78, up: 0.04, forward: 0.55, reach: 1.5, curlAhead: 0.6, curlDown: 0.8 };
const LUNGE = { guardRaise: -0.75, guardElbow: -1.35, turn: 0.4, reach: -1.5, pitch: 0.3, front: -1.25, knee: 1.35, back: 0.85, step: 0.45, retreat: 0.2, hold: 0.16 };
/*
 * [S] lunge legs (333; renaissance.fencer.png, read off the red fencer: the front thigh near level, ~70 deg forward of vertical, the shin dropped back
 * under the knee near upright, ~80 deg of knee bend; the rear leg straight, ~50 deg back of vertical, its boot far behind; the hip sunk to about the
 * height of the front knee, a third of the leg's height down). Laid as the last leg layer (_lungeLegs, after every pose, carry, limp and air layer), so
 * nothing the press, the brace or the stride makes of the legs survives the lunge: thighs and knees go to LUNGE.front/knee/back by _lungeOut, and the
 * hip comes down by what the spread legs give up in height, so both soles stay on the ground (thigh and shin taken as half the hip's rest height each).
 */
/*
 * [S] point-first rapier (331; renaissance.fencer.png: in guard the point is toward the foe; card "thrusts forward ... then steps back"). The rapier no longer
 * rests up the forearm and half-turns for the attack: over every living state it is stood in the world point-first along his front (_pointRapier, the last
 * carry layer), lifted RAPIER_POINT.guard above level in guard and brought level as the lunge goes out, the hilt kept in the fist. LUNGE.hold keeps the arm out.
 */
const RAPIER_POINT = { guard: 0.3 };
/*
 * [S] the off-hand Stone Axe stood up (361; tribal.chieftain.red.png: a Stone Axe in each fist, both carried upright at his sides, the heads above the
 * shoulders; card Off Hand Stone Axe). The off axe hung in the left fist by its grip preset ran level forward behind the body and was never seen. Over every
 * living state (_standOffhandAxe, after the rapier) the off-hand axe is stood in the world: its handle (+y) up, leant OFF_AXE.out to his off side and
 * OFF_AXE.ahead forward, the stone (the handle's +z) turned out OFF_AXE.face (ahead, out) so its broad face shows from the front three-quarter; the fist stays
 * on the grip.
 */
const OFF_AXE = { out: 0.18, ahead: 0.22, face: [0.75, 0.65] as const };
/*
 * [S] both Stone Axes carried upright at his sides (364; tribal.chieftain.red.png, .png: a Stone Axe in each fist, forearms forward at hip height, both
 * hafts upright beside his body, the stones above the shoulders). Outside an attack the main-hand axe lay level across his chest from the heavy-swing guard.
 * Now, while he is not attacking (_standMainAxe, eased in and out at MAIN_AXE.ease per second so the swing itself is untouched), the main arm takes the off
 * arm's pose mirrored across his midline and the main axe is stood up at his main side exactly as the off one (OFF_AXE mirrored), its grip kept in the fist.
 */
const MAIN_AXE = { ease: 8 };
/*
 * [S] the Mammoth Charge pose (363; tribal.mammoth.jpg, card "they will charge at enemy units": head down, tusks levelled ahead, galloping): eased in at
 * .ease per second while the run lasts (setCharging); the head dropped .headDown rad and tossed .toss with the stride, the body pitched .pitch nose-down,
 * a gallop over the walk (front pair and hind pair reaching together .stride rad, the front knees folding .fold on the back swing, the body rocking .rock)
 * at .pace rad per second.
 */
/*
 * [S] the bull's charge on two legs (378, the minotaur's; ancient.minotaur.png: bent at the waist, head down and horns forward, arms swept back): a
 * humanoid on a charge run leans his trunk BULL_CHARGE.lean rad forward and drops his head .head more, his arms .armsBack rad back behind him and pumping
 * .pump with the stride, his legs striding .stride, all by the eased charge weight.
 */
const BULL_CHARGE = { lean: 0.6, head: 0.35, armsBack: 0.7, pump: 0.25, stride: 0.5, pace: 11 };
/*
 * [S] bare fists (379, the minotaur's; card Main Hand / Off Hand "Minotaur Grab", Unarmed; ancient.minotaur.red.png: no weapon, both fists balled before the
 * belly, elbows bent near square and out from the flanks; ancient.minotaur.png: one arm grabs a man while the other punches).
 * - Carry (stood or marching): each fist solved (_armTo) onto a point .carryAhead before his hip, .carryOut out to its side and .carryUp above it, in u
 *   (his shoulder's height over his hip), so the fists ride out before the belly, elbows bent out; eased out under the charge run.
 * - Blow (grab then punch): to .grab of the blow both arms reach out together, shoulders .reach, elbows near straight (the grab); the off arm then holds
 *   there while the weapon arm draws back to .cock (elbow .cockFold) until .punch and drives straight out to .reach (elbow 0) with the trunk twisted .twist
 *   onto the off side and pitched .lean; the rest eases back to the carry.
 */
/*
 * [S] the levelled pike (379, the sarissa's; ancient.sarissa.png: a rank marching with the long pikes run level forward at the hip, both fists on the
 * shaft, the off hand ahead; card Weapon Type Two-handed, Off Hand N/A). In u, the height of his weapon shoulder over his hip joint: the weapon fist at
 * PIKE_LEVEL.ahead before the hip, .out to the weapon side, .up above it; the shaft run along his heading tilted .tilt rad up, the fist .fistAt of its
 * length from the butt; the off fist on the shaft .offAhead further along it. The thrust draws both fists back .draw of .stroke and drives them out a whole
 * .stroke along the shaft's line, then eases back. No off-hand disc.
 */
// the flask's bulb from the fist, in the world: down and a little ahead (see _hangFlasks)
const FLASK_HANG = { down: 1, ahead: 0.3 };
const PIKE_LEVEL = { ahead: 0.7, out: 0.35, up: 0.2, tilt: 0.05, fistAt: 0.3, offAhead: 0.6, draw: 0.3, stroke: 0.9 };
const BULL_FISTS = { carryAhead: 0.45, carryOut: 0.6, carryUp: 0.3, lift: -0.4, out: 0.3, fold: -1.35, reach: -1.35, grab: 0.35, cock: -0.35, cockFold: -1.9, punch: 0.62, twist: 0.35, lean: 0.2 };
const CHARGE_POSE = { ease: 10, headDown: 0.42, toss: 0.08, pitch: 0.1, stride: 0.42, fold: 0.4, rock: 0.05, pace: 9 };
/*
 * [S] the jouster's canter (369; renaissance.jouster.png, card Speed 2.50x "the Jouster Horse ... create shockwaves wherever they canter"): the barded
 * horse's four legs (propBuilder hgait_* pivots) swing fore and aft about their tops whenever he moves, a three-beat canter: hind lead first, then the
 * other hind with the diagonal fore together, then the leading fore (.beats, share of the stride). .walk / .run rad of swing at .walkPace / .runPace rad
 * per second (run on a charge, setCharging). Eased in and out at .ease per second.
 */
const HORSE_GAIT = { ease: 8, walk: 0.32, run: 0.62, walkPace: 8, runPace: 12, beats: { hind_l: 0, hind_r: 0.3, fore_l: 0.3, fore_r: 0.6 } as Record<string, number> };
/*
 * [S] the plank shield held square in front (361; tribal.protector.red.png, .png: the slab held upright square before his body, brow to knee, his face
 * looking through its round hole). The slab hung off his hand at his side. Over every living state (_holdSlab, after the carries) the board is stood in the
 * world square to his heading, its eye hole on his midline at his own eye height, SLAB_FRONT.reach of his stature ahead of his neck; his shield fist is
 * reached straight at the board's back (_gripBoard) .grip behind its middle. On each blow it is shoved out .bash further at the peak of the swing and back.
 */
const SLAB_FRONT = { reach: 0.2, grip: 0.08, bash: 0.22 };
// The press blow (see _pressBlow): the beat a clubber in contact strikes on, and the shares of it spent resting landed on the man in front, heaving up off him,
// cocked, slamming down and held on the impact. Landed (rest + impact) is most of the beat: trailer_3_sheet_01 r2c3 catches clubs down on men, not raised.
/*
 * [S] club-cocked-in-press (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (the club arcs down through the man) and r3c1 (arm cocked well back over the
 * shoulder, then committed forward): a clubber in reach of the man he strikes (not a rank back) never holds his club straight up or level between blows.
 * - Cocked (heave + cock of the beat): fist up over his own head, elbow folded so the fist sits behind the crown, the club laid BACK over the shoulder,
 *   PRESS_CLUB_COCK rad from straight up (head back and up on a diagonal behind his crown).
 * - Landed (the slam's end, the rest and the impact): fist raised forward to about head height (PRESS_AIM_ARM), the club laid DOWN from it onto that man's
 *   board line (PRESS_BOARD_LINE of his height under his crown), solved onto him by _contactOn (press-landed-contact), so it comes down onto the board top or
 *   the head and never runs level across the chest.
 * - The slam sweeps the head from the cock up over the top and down onto him (the arc is blended through vertical, not across the front).
 */
const PRESS_CLUB_COCK = -1.05;
const PRESS_AIM_ARM = 1.0;
const PRESS_AIM_ELBOW = { cock: -1.7, land: -0.25 };
const PRESS_BOARD_LINE = 0.25;
/*
 * [S] press-landed-contact (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (the club arcs down through the man and stops on him): a landed club, in the
 * press beat and through a swing's BLOW_HOLD, is not laid at a fixed angle but solved onto a world point on the struck man (_contactOn), its shaft resting there:
 * - his crown, when the line from the raised fist falls onto it at least CONTACT_MIN_FALL below level;
 * - else the top of his board on his near face (PRESS_BOARD_LINE of his height under the crown, CONTACT_FRONT of it out toward the striker).
 * The swing's follow-through runs on from the crown to that board top and is held there, never down his axis to the turf at his feet.
 */
const CONTACT_MIN_FALL = 0.2;
const CONTACT_FRONT = 0.12;
// press-club-lands-on-board: the lowest the pinned head may sit on his near face, in shares of his height under the crown (the foot of his board)
const CONTACT_LOWEST = 0.6;
/*
 * [S] press-mark-held (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (every club at the pile is cocked back or down on a man, none stands up): the in-reach
 * press beat outlives gaps in the sim's strike calls (a man shoved a step out of reach, a retarget): his man stays marked PRESS_MARK_HOLD seconds past the last
 * call and through any swing at him, so the beat keeps cocking back and landing down on him. While marked:
 * - the sim's own swing (heavy_swing) winds up to PRESS_CLUB_COCK, back over the shoulder, not to the near-upright CLUB_COCK, and after the drop the club stays
 *   down on his board line (_pressDownArc) instead of being heaved back up toward vertical;
 * - a clubber in the shove with no man marked (and not a rank back) carries the club in that same cock, never straight up.
 */
const PRESS_MARK_HOLD = 1.5;
const PRESS_BLOW_BEAT_MIN = 1.5;
const PRESS_BLOW_BEAT_MAX = 2.4;
const PRESS_BLOW_REST = 0.38;
const PRESS_BLOW_HEAVE = 0.14;
const PRESS_BLOW_COCK = 0.1;
const PRESS_BLOW_SLAM = 0.08;
// A rear-rank clubber's resting blow between beats: this far down from the cock toward landed (1), the club laid forward over the man ahead (see readyBlow).
const REAR_CLUB_REST = 0.85;
/*
 * [S] ready-club-upright (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (the right clubber, waiting his turn beside a club that is down on its man): a
 * striker the sim holds off his first blow (STRIKE_LAG, waitBeat) stands his club near upright over his shoulder, not cocked back on the diagonal every
 * cocked club shares: the weapon arm raised WAIT_CLUB.arm (fist about shoulder height, out in front), elbow WAIT_CLUB.elbow, the club WAIT_CLUB.arc from
 * vertical. So a waiting club and a landed one cross in a line instead of lying side by side. Eased in and out over ~0.15 s; his blow starts from it.
 */
const WAIT_CLUB = { arm: -1.25, out: 0.2, elbow: -1.5, arc: 0.12 };
// ...and a marked man's windup lifts the club through that upright and tips it back to his own cock only near the commit: this share of PRESS_CLUB_COCK at
// least (each man his own, up to the full cock), reached at the commit
const WAIT_CLUB_DEPTH = { min: 0.45 };
// How far the arm comes down from the cock onto the man: the fist stops raised before the striker's face, so the club laid down from it lands on the board top or
// the head in front, not level into the board at the belly.
const PRESS_BLOW_ARM = 1.7;
// The club's arc in that raised fist when landed: forward and a little down, across the board top or the head, not hanging to the ground.
const PRESS_BLOW_CLUB = 1.2;
/*
 * [R] target-aimed blow (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (blue clubbers on a red man) and r3c1 (every strike line ends on a body):
 * - The blow is struck AT a man, not along a fixed arc: on the frame it lands the weapon's head is on the struck man's head (crown or just over it, the shaft
 *   laid across it when the weapon is longer than the gap), whatever his height or how far off he stands, within arm + weapon reach.
 * - The weapon comes DOWN onto the man from above, never level or rising: onto his crown, or, a taller man, across his shoulders and board top under the
 *   fist (BLOW_DROP). The striker's near-straight arm (elbow ~0.15 rad) stands straight up over his own head in the world (BLOW_OVERHEAD), and he rises out of the press crouch into a long-legged lunge (BLOW_LUNGE); his trunk is
 *   pitched forward ~0.4 rad into the blow, never folded double (r2c3: the clubber bends at the waist roughly 30-45 deg, legs long under him).
 * - Weapons stay down on men for a good share of the beat, not snapped back up (r2c3 catches the club down, r3c1 every line on a body): after the swing the
 *   weapon is held on the man BLOW_HOLD s, easing off over its last BLOW_HOLD_FADE s.
 * - The struck man recoils on that same frame: head and trunk thrown back (the flinch, laid over every stance layer so a braced board man still goes back,
 *   held full FLINCH_HOLD s, and re-posed in the step the blow lands, see SimulationSystem._landMeleeBlow).
 * The windup is the swing's own; from BLOW_AIM_FROM of the time to the landing the weapon is brought round onto the man and is fully on him at BLOW_LAND of
 * the drop, when the sim lands the damage (blowLandsIn).
 */
const BLOW_LAND = 0.55;
/*
 * [S] the hay baler's stick whack (343; card: Stick, a bludgeon on a 0.75 s cooldown, "swing, beat and whack"; farmer.hay_baler.blue.png: a short crooked
 * stick in one fist). Not the club's overhead blow from straight over the head (BLOW_OVERHEAD): a quick one-handed forearm whack from the shoulder.
 * - Cock (0 -> commit): the weapon fist drawn back beside the ear, shoulder STICK_WHACK.cock (from hanging; -pi/2 is level ahead) and out .out, elbow folded
 *   .fold, the trunk turned .twist onto the weapon side; the stick's head back over the shoulder, its arc .cockArc (0 up, + forward).
 * - Whack (commit -> .land of what is left): accelerating all the way (squared), the arm thrown out ahead to shoulder .hit (a little under level), the
 *   elbow near straight (.reach), the trunk turned back through .twist the other way and pitched .pitch into it; the stick's arc to .hitArc, its head
 *   forward and down at the man's chest. The sim lands the blow on that frame (blowLandsIn), the stick's head on him.
 * - Held there to .hold, then eased back to the carry by the end. The off arm swings back against the whack (.offSwing) and takes no part in it.
 * The club's aimed overhead blow (_aimBlow) is left out for the stick: it would stand his arm straight up over his head and hang the stick down from it.
 */
const STICK_WHACK = { cock: -2.1, out: 0.55, fold: -1.75, twist: 0.4, cockArc: -0.9, hit: -1.25, reach: -0.15, pitch: 0.3, hitArc: 1.9, land: 0.35, hold: 0.6, offSwing: 0.6 };
const BLOW_AIM_FROM = 0.75;
const BLOW_HOLD = 0.6;
const BLOW_HOLD_FADE = 0.15;
// The hold is let go early once the fist stands farther than this many weapon reaches from the point the blow struck (the striker walked or turned away)
const BLOW_HOLD_SLIP = 1.25;
const BLOW_ELBOW = -0.15;
const BLOW_PITCH = 0.4;
// The weapon arm in the blow: straight up over his head, this far forward of vertical (rad)
const BLOW_OVERHEAD = 0.5;
// The mark this far over the head top (hand-scale units)
const BLOW_CROWN = 0.04;
// The weapon on the frame it lands falls at least this far below level (rad), onto the crown or on down through the shoulders and board; a man farther off than
// the fist and that falling weapon reach is lunged at, the hip carried at most BLOW_STEP of the striker's standing height toward him (r2c3: the clubber steps
// into the man, the club coming down through him)
const BLOW_FALL = 0.95;
const BLOW_STEP = 0.4;
// The striker's legs in the blow: front thigh forward, back thigh behind, knees near straight (hip/knee rotation.x)
const BLOW_LUNGE = { front: -0.4, back: 0.3, knee: 0.1 };
// Farthest a man's head may be from the striker's shoulder, in weapon reaches + one arm, for the blow to be aimed at him at all
const BLOW_AIM_SLACK = 2.5;
// The arm is solved onto the strike point only when the point stands this much more than (weapon reach - arm) from the shoulder (see _aimBlow)
const BLOW_SOLVE_MARGIN = 0.15;
// A flinch holds its full snap this long before it eases off (see update)
const FLINCH_HOLD = 0.12;
// The blow does not stop on the crown (trailer_3_sheet_01 r2c3: the club ends low after its arc, the striker bent into it): from the landing the fist goes on
// down its arc, over BLOW_FOLLOW s, from straight up to BLOW_FOLLOW_ARM rad past the vertical toward the man (forward and below level), the trunk pitched a
// further BLOW_FOLLOW_PITCH into it, and the weapon head runs on from the crown down onto his board top (see press-landed-contact), where it is held out the
// rest of BLOW_HOLD.
const BLOW_FOLLOW = 0.12;
const BLOW_FOLLOW_ARM = 2.05;
const BLOW_FOLLOW_PITCH = 0.3;
/*
 * [S] drive-through (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (the clubber bent ~45 deg at the waist into the blow, the club ~40-70 deg below
 * level, its head low in front of him): a stand-off blow (solved) is laid at an ANGLE, not hung from a point. On the frame it lands the club falls
 * BLOW_DRIVE_FALL.land below level and the trunk is pitched BLOW_DRIVE_PITCH.land about the waist; over the BLOW_DRIVE s after (the dwell and the throw) the
 * club steepens to .end, the trunk bends on to .end and any leap settles back onto his feet, so the fist comes down to his chest and the club ends low.
 * The fist is solved an arm from the shoulder and a club's reach back up that angle from the strike point, the point sliding down the man's axis (crown,
 * shoulders, chest, never under BLOW_DRIVE_LOWEST of his height) to wherever that fist can reach: the club is driven down through him, not set on his helm.
 */
const BLOW_DRIVE = 0.3;
const BLOW_DRIVE_FALL = { land: 0.7, end: 1.2 };
const BLOW_DRIVE_PITCH = { land: 0.6, end: 0.9 };
const BLOW_DRIVE_LOWEST = 0.75;

// Overhand throw (trailer_3_sheet_01 r3c3: the spear in flight, the thrower's arm out ahead and the hand empty; units/tribal.spear_thrower): through the windup the
// throwing arm goes up and back until the fist is behind the head (THROW_COCK: shoulder raise, out, elbow folded, chest turned back and leant away, the other arm
// pointed at the foe); at the commit it whips over the top and forward, the elbow straightening, the chest turning through and pitching in, and the missile leaves
// the fist THROW_LET_GO of the way through that swing, with the arm out ahead near shoulder height; the arm follows through low and the man comes back to the ready.
const THROW_COCK = { raise: -2.9, out: 0.3, elbow: -1.6, turn: 0.4, lean: -0.15, lead: -1.3 };
/*
 * A javelin's cock (tribal.spear_thrower.red.png: the arm reached straight up, the spear stood on up out of the fist over the crown, its point tipped a little
 * forward at the foe): not the fist folded behind the head but the whole arm up, elbow near straight (JAVELIN_COCK), with the shaft TURNED ABOUT in the fist
 * (_standJavelin). The javelin is strapped on running from the fist up the forearm (a hand's +y runs wrist to elbow), so the raised arm alone hung it down
 * the back of the head, leaf at the nape (318, rejected). At the cock the "shaft" is turned pi about the fist and seated the same way out past the fingers,
 * so it stands on up out of the fist; it is turned back as the arm whips over the top, from JAVELIN_UNTURN of the swing to the let-go (THROW_LET_GO), where
 * the missile is a copy of the prop in its own frame and the held one is hidden until the next windup. The chest's turn, lean and the other arm are the throw's.
 */
const JAVELIN_COCK = { raise: -2.8, out: 0.12, elbow: -0.1 };
const JAVELIN_UNTURN = 0.2;
const THROW_FOLLOW = { raise: -0.35, lean: 0.35 };
const THROW_SWING = 0.55;
// Harpoon gun at the hip (units/pirate.harpooner): gun arm a little behind the hang (raise > 0 tips the nozzle down), off hand across onto the canister,
// trunk rocked back `kick` rad at the release
const HARPOON_HIP = { raise: 0.25, out: 0.1, elbow: -0.3, offRaise: -0.55, offIn: 0.4, offElbow: -1.0, kick: 0.12 };
const THROW_LET_GO = 0.5;
/*
 * Two-hand boulder (vfx.k; units/tribal.stoner). Spec read off the reference: the boulder, about .38 of his height across, is held in front of the belly in both
 * hands, one on each side of it, upper arms hanging forward ~30 deg (BOULDER_CARRY raise), elbows a little bent, the rock's middle at the hands' midpoint.
 * The throw is a heave, not an overarm toss: through the windup he folds forward ~30 deg at the waist on bent knees with both arms swung down and back so the
 * rock hangs low between his knees (BOULDER_DIP); at the commit both arms swing up and forward together, the trunk coming up and leaning back (BOULDER_HEAVE),
 * and the rock leaves both hands at chest height THROW_LET_GO of the way through that swing, the same let-go the sim times the missile on (throwReleasesIn).
 * 319 (tribal.stoner.blue.png, the mitts on the chunk's sides): the arms hang forward a little more so the rock sits before the belly, and whatever the
 * arm layer did, the mitts are spread about the shoulders to BOULDER_HOLD of the rock's width apart (see _carryBoulder), so a wide chunk is cradled between
 * them and not swallowed over both fists.
 */
const BOULDER_CARRY = { raise: -0.75, inward: 0.2, elbow: -0.6 };
const BOULDER_HOLD = 1.0;
/*
 * [S] lockbox-belly-two-hand (vfx.p; units/spooky.swordcaster). Spec read off the reference: the chest is held square across the belly, its long side left to
 * right and close against him, just under the chest plate, a hand on each end. Upper arms hang near his sides with the elbows out (LOCKBOX_CARRY out), the
 * forearms bent ~80 deg forward (elbow) and swung in round the box (turn, about the vertical through the shoulder) so the two mitts meet its ends in front of
 * the navel. Held the same through the walk, the idle and the cast: he never lets go of it.
 */
const LOCKBOX_CARRY = { raise: 0.15, out: 0.6, turn: 0.6, elbow: -1.85 };
/*
 * [S] lockbox-body-anchor (vfx.p; units/spooky.swordcaster: the chest centred at the navel, both mitts on its ends). The box is fixed to the torso, not
 * placed from the hands: its middle on his centreline LOCKBOX_NAVEL of his shoulder height up the trunk and LOCKBOX_FRONT of it out before the belly. Each
 * arm is reached onto its own end by a solve of shoulder raise, shoulder turn and elbow bend, starting from LOCKBOX_CARRY (see _lockboxAnchor).
 * [R] swordcaster-blade-ring (vfx.p), the hug read off units/spooky.swordcaster.jpg: the elbows bow out wide of the trunk (LOCKBOX_CARRY out, ~35 deg off
 * the side) and the forearms come back in round the box, so what is solved onto each end face is the MITT's middle (the palm), not the wrist joint above
 * it: the palm sits LOCKBOX_PALM_OUT of a mitt's width out past the end, the mitt cupping the end face, the forearm never running on past the box.
 */
const LOCKBOX_NAVEL = 0.35;
const LOCKBOX_FRONT = 0.55;
const LOCKBOX_PALM_OUT = 0.35;
const LOCKBOX_IK_STEPS = 8;
const BOULDER_DIP = { raise: 0.25, inward: 0.32, elbow: -0.25, trunk: 0.55, thigh: -0.45, knee: 0.7 };
const BOULDER_HEAVE = { raise: -2.4, inward: 0.3, elbow: -0.15, trunk: -0.25 };
// ...and throws the trunk and the head this far back (r2c3: the struck man is knocked back off his feet)
const FLINCH_PITCH = 0.85;
const FLINCH_HEAD = 0.9;
// Board knocked off (trailer_3_sheet_01 r2c3: the man under the club is thrown open and off his feet, not left standing behind his board): a heavy blow takes the
// struck man's board out of the wall, his board arm flung out wide and back (BOARD_OFF_FLING, shoulder rad) with the board hanging off it, and his knees go
// (BOARD_OFF_BUCKLE: thighs forward, knees bent, hips dropped this share of his standing hip height), so his helm drops under his file-mates' and his trunk
// shows over the gap where his board was. Full BOARD_OFF_HOLD s, eased back over the rest of BOARD_OFF_SECONDS.
const BOARD_OFF_SECONDS = 0.6;
const BOARD_OFF_HOLD = 0.25;
const BOARD_OFF_FLING = { out: 1.4, back: 0.6 };
const BOARD_OFF_BUCKLE = { thigh: 0.9, knee: 1.6, sink: 0.35 };
/*
 * [S] struck-man buckle (battle-feel.e). Spec read off trailer_3_sheet_01 r2c3 (the man under the club folds: knees give, head goes down, arms drop out of
 * his guard, before he goes): a heavy blow that dwells on a man (SimulationSystem BLOW_DWELL) buckles him on the very step it lands, for BUCKLE_SECONDS,
 * full for all but the last BUCKLE_FADE of it. Thighs forward BUCKLE.thigh and knees bent BUCKLE.knee (rad), the hips dropped BUCKLE.sink of his standing
 * hip height so both soles stay down; the trunk folded BUCKLE.trunk forward over them and the head BUCKLE.head further down; both arms dropped to BUCKLE.arm
 * from hanging, elbows loose, whatever guard or swing they held. Laid over every stance and swing layer; the throw off his feet takes over from it.
 */
const BUCKLE_SECONDS = 0.2;
const BUCKLE_FADE = 0.06;
const BUCKLE = { thigh: 0.55, knee: 1.4, sink: 0.2, trunk: 0.3, head: 0.5, arm: -0.35, elbow: -0.3 };
/*
 * [R] one-blow-per-man (battle-feel.e blockers 2 and 5). Spec read off trailer_3_sheet_01 r2c3 and r3c1: in a line every blow is its own. Two clubbers side
 * by side are at different points of their arcs (one club down and driven into its man, the next still high), at their own angles; and every man under a
 * blow folds in his own shape, none a copy of his neighbour. Each man carries a variety in [0, 1) fixed by his runtime id (RuntimeUnit.vary), from which:
 * - the sim gives him his own beat, up to STRIKE_LAG s, between reaching his man and his first blow, so a line that arrives together strikes in a ragged run;
 * - his driven club falls BLOW_DRIVE_VARY rad either side of BLOW_DRIVE_FALL;
 * - his buckle (BUCKLE, the give at the knees, the trunk only part-way down: r2c3) is turned BUCKLE_VARY.twist either way about his spine, his head turned
 *   BUCKLE_VARY.head and rolled with it, one knee BUCKLE_VARY.knee deeper than the other, his trunk BUCKLE_VARY.trunk of its fold more or less, and one arm
 *   dropped further than the other.
 */
const BLOW_DRIVE_VARY = 0.4;
const BUCKLE_VARY = { twist: 0.35, head: 0.5, roll: 0.18, knee: 0.3, trunk: 0.4, arm: 0.5 };
// Thrown back off his feet by a heavy blow, hip-led (trailer_3_sheet_01 r2c3, the red man leaving the clubbers, read off the frame: he goes seat-first, the
// pelvis the lowest point of him and the one the blow carries; the trunk is tipped ~53 deg from upright the way he goes, head still above the hips; one leg
// trails straight down and a little the way he goes, ~40 deg from vertical; the other leg is flung back toward the striker near straight, the thigh ~20 deg
// under level and the shin carrying on its line, not folded under him (the tile's man flies face-first with that hip extended, so his shin rises a little off the thigh line; struck from the front ours flies back with the hip flexed, and a near-straight knee is the nearest match); arms out wide). Measured in the flight plane by the pose bench
// (scratch probe, one clubber on one man in the open): hip-to-neck tilt, kicked thigh and shin angles at 336 ms after the land. The root's pitch (RuntimeUnit BLOW_THROW_TRUNK, about the root origin at his feet) is turned into a pitch about the pelvis by anchoring
// the hip THROWN.seat of its standing height straight over the root (an offset in the root frame, undone at the top of the next update like the blow lunge),
// and the thighs are laid out in the flight frame, not swept by a fixed amount: the trailing thigh .legTrail rad from straight down toward where he goes
// and the kicked one .legKick (toward the striker), each as a world angle the root's live pitch is taken out of, knees .kneeTrail/.kneeKick.
// Shoulders out .armsOut and back .armsBack rad, elbows straight, trunk .trunk and head .head rad over the root's pitch, SET over every trunk layer under it
// (the walk's run lean, the press crouch and the flinch all added forward pitch, and a man flying back at 4.5 m/s still runs his gait: the trunk stood
// 8-26 deg off upright on the bench for the root's 57). Laid on the land frame, eased out with the body's throw.
// A caster's missile leaves his staff's head at the end of the drive, when the staff is thrust level at the enemy (units/legacy.wizard.png: arm out straight,
// staff level along it, the fireball off its head), CAST_LOOSE of the cast in; the staff stays thrust there to CAST_HOLD, not chopped down after it.
const CAST_LOOSE = 0.68;
const CAST_HOLD = 0.94;
// The staff's head direction at the full drive, in the body's yaw frame: straight ahead, a touch up
const CAST_LEVEL_TIP = new Vector3(0, 0.1, 1).normalize();
// A bone mage casts with his staff up, not driven level (units/tribal.bone_mage: staff arm straight up over the head, the staff stood skull end up and leant a
// little ahead): the arm is up by CAST_RAISE_UP of the cast and stays up to CAST_HOLD, so the leaves leave its head at CAST_LOOSE with it still overhead.
// CAST_RAISE_ARM is the staff arm (shoulder raise and out, elbow), CAST_RAISE_TIP the staff head direction in the body yaw frame (x toward the staff side).
const CAST_RAISE_UP = 0.4;
const CAST_RAISE_ARM = { raise: -2.9, out: 0.32, elbow: -0.12 };
const CAST_RAISE_TIP = new Vector3(0.15, 1, 0.3).normalize();
// The bone mage's carry (units/tribal.bone_mage, tribal.bone_mage.red.png: the crooked staff stood upright beside the body, its butt by the foot, the skull at
// shoulder height): the staff arm (shoulder raise and out, elbow) with the fist at the hip and the staff planted, the free arm hanging, and the staff's tip before
// the per-man jitter (x toward the staff side). One hold for every bone mage, not the three slants a wizard's staff takes, and in it from the first frame.
const BONE_HOLD = { raise: -0.2, out: 0.18, elbow: -0.5, left: { raise: -0.15, out: 0.12, elbow: -0.35 }, tip: [0.03, 1.6, 0.04] as const };
// The Healer's priest staff (353; medieval.healer.blue.png: the staff stood upright at his side, butt by the foot, the fist at the bottom of the ribs, the
// other arm hanging): the bone mage's planted hold with the fist higher. One hold, in it from the first frame.
const PRIEST_HOLD = { raise: -0.4, out: 0.2, elbow: -1.05, left: { raise: -0.1, out: 0.12, elbow: -0.3 }, tip: [0.03, 1.6, 0.04] as const };
const THROWN = { armsOut: 1.35, armsBack: 0.45, trunk: 0, head: 0.1, seat: 0.92, legTrail: 0.7, legKick: -1.22, kneeTrail: 0.15, kneeKick: 0.1 };

export class ProceduralAnimator {
  private _body: ArticulatedBody;
  private _state = AnimState.Idle;
  private _time = 0;
  private _attackTimer = 0;
  private _attackDuration = 0.4;
  private _attackMotion: AttackMotion = "strike";
  private _wobblePhase: number; // random offset per unit
  attackStyle: AttackStyle = "humanoid";
  walkStyle: WalkStyle = "humanoid";
  defaultAttackMotion: AttackMotion = "strike";
  locomotionBias: LocomotionBias = "none";
  releaseTimingProfile: ReleaseTimingProfile = "default";

  // Death ragdoll state
  private _deathAngularVelocities: number[] = [];
  private _deathJointAngles: number[] = [];
  private _deathRestAngles: number[] = [];
  private _deathAirAngles: number[] = [];
  private _deathDamping = 0.97;

  constructor(body: ArticulatedBody) {
    this._body = body;
    this._wobblePhase = Math.random() * Math.PI * 2;
  }

  get state(): AnimState { return this._state; }

  setState(state: AnimState): void {
    if (this._state === state) return;
    // The harvester's sweep is carried through to its end (SCYTHE_SWEEP.through): a step he takes in the press, mid-cut, waits for it (375; the sim's
    // moveTo had cut the sweep off just past the cock while its blow still landed, so the hit frame showed him in the press with the scythe stood up)
    if (this._state === AnimState.Attacking && this._lowScythe && this._attackMotion === "blade_slash" && state !== AnimState.Dead) {
      this._afterSweep = state;
      return;
    }
    this._state = state;
    if (state === AnimState.Dead) {
      this._initDeathRagdoll();
    }
  }

  triggerAttack(windupTime: number, motion?: AttackMotion): void {
    this._afterSweep = null;
    this._state = AnimState.Attacking;
    this._attackTimer = 0;
    this._attackDuration = windupTime + 0.25;
    this._attackMotion = motion ?? this.defaultAttackMotion;
    this._chopDown = null;
    if (this._attackMotion === "thrust" && this._stabsFork()) {
      this._stabClock = 0;
      this._stabDuration = this._attackDuration;
    }
    // The next one is in the hand at the windup
    if (this._thrownProp) {
      this._thrownProp.setEnabled(true);
      this._thrownProp = null;
    }
  }

  // The held prop that left the hand at the last throw: hidden until the next windup
  private _thrownProp: TransformNode | null = null;

  /** A cast from the hold just started: seconds until the staff is driven level at the enemy (CAST_LOOSE), where its missile leaves its head; 0 when none is running. */
  castReleasesIn(): number {
    if (this._state !== AnimState.Attacking || this._attackMotion !== "strike" || this.attackStyle === "mammoth" || !this.castsFromHold) return 0;
    return Math.max(0.001, CAST_LOOSE * this._attackDuration - this._attackTimer);
  }

  /** A throw just started: seconds until the missile leaves the fist (THROW_LET_GO into the forward swing); 0 when no throw is running. */
  throwReleasesIn(): number {
    if (this._state !== AnimState.Attacking || this._attackMotion !== "throw") return 0;
    const commit = this._resolveReleasePoint(0.45);
    const letGo = commit + (1 - commit) * THROW_SWING * THROW_LET_GO;
    return Math.max(0.001, letGo * this._attackDuration - this._attackTimer);
  }

  /** A bow draw just started: seconds until the loose (the release point, string at the cheek and bow arm out); 0 when no draw is running. See DRAWS_BEFORE_LOOSE. */
  bowReleasesIn(): number {
    if (this._state !== AnimState.Attacking || this._attackMotion !== "bow_draw_release") return 0;
    return Math.max(0.001, this._resolveReleasePoint(0.72) * this._attackDuration - this._attackTimer);
  }

  /** What the throwing hand holds now (its prop, not the mitt), or null when it is empty. */
  heldThrowProp(): TransformNode | null {
    // Not the mitt, and not a state glow riding the fist (a lit fuse's spark is tagged with a visual key): the weapon itself
    return this._body.rightHand.getChildren().find((n): n is TransformNode => !/HandM$/.test(n.name) && !n.metadata?.visualKey && (n as TransformNode).isEnabled()) as TransformNode | undefined ?? null;
  }

  /** The held prop has left the hand: it is not drawn there again until the next windup. */
  letGoOfThrow(prop: TransformNode): void {
    prop.setEnabled(false);
    this._thrownProp = prop;
  }

  /** The man a blow is being struck at (his head mark), set by the sim when the swing starts; null for none. See the [R] target-aimed blow spec. */
  aimBlowAt(mark: TransformNode | null, landsIn = 0): void {
    // A rapier is thrust at him on its own line (see LUNGE), not brought down on his head
    this._blowMark = this._rapier() || this._stabsFork() ? null : mark;
    this._blowLandsAt = landsIn;
    // nor is a halberd's chop: it comes down in his own plane (see CHOP)
    if (this._halberd()) {
      // but it is aimed onto him (see _chopOnto)
      this._chopMark = mark;
      this._chopAim = null;
      this._blowMark = null;
    }
    this._blowClock = 0;
    this._blowStruck = null;
  }
  private _blowMark: TransformNode | null = null;
  // Where the blow struck, in the world, taken by blowStruck on the land step: the hold and follow-through stay on that point, not on the man's live crown,
  // which the blow has just thrown over and away (probed: tracking him live ran the club down after his flipped head to shin height, into the turf)
  private _blowStruck: { head: Vector3; contact: Vector3 } | null = null;
  // This blow's arm is solved onto its point (a stand-off strike), decided each frame of the drop and kept for the land (see _aimBlow)
  private _blowSolved = false;

  /** The sim lands the blow this step, before the struck man is thrown: pin the aim on where his crown and the weapon's head are now. */
  blowStruck(): void {
    const mark = this._blowMark;
    if (!mark || mark.isDisposed() || this._blowLandsAt <= 0) return;
    const b = this._body;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.rightHand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const marks: TransformNode[] = [];
    for (let n: TransformNode | null = mark; n; n = n.parent as TransformNode | null) marks.unshift(n);
    for (const n of marks) n.computeWorldMatrix(true);
    const scale = Math.max(0.001, b.rightHand.absoluteScaling.y);
    const hand = b.rightHand.getAbsolutePosition();
    this._blowStruck = { head: this._crownOf(mark).add(new Vector3(0, BLOW_CROWN * scale, 0)), contact: this._contactOn(mark, hand, this._blowSolved) };
  }
  // Seconds from the start of the swing to the blow landing, and since the swing started: the aim keeps its own time, so a swing the walk or the stand cuts
  // short in the animation still comes down on the man when the sim lands it
  private _blowLandsAt = 0;
  private _blowClock = 0;
  private _aimWeight = 0;
  private _aimTip = new Vector3(0, 1, 0);
  private _blowLunge = new Vector3(0, 0, 0);

  /** A swing that lands on a man: heavy (club, hammer, axe) or a blade's slash. */
  private _strikesAtMan(): boolean {
    // a halberd's chop, and the farmer's stab (FORK_STAB): the sim holds the hit for the moment the tines go home
    const chop = this._attackMotion === "thrust" && (this._halberd() !== null || this._stabsFork());
    return (this._attackMotion === "heavy_swing" || this._attackMotion === "blade_slash" || chop) && this.attackStyle !== "mammoth" && this.walkStyle !== "quadruped";
  }

  // The share of the attack at which the blow is fully on the man: BLOW_LAND of the way through the drop after the commit
  private _blowLandFraction(): number {
    if (this._attackMotion === "heavy_swing") {
      const commit = this._resolveReleasePoint(0.45);
      if (this._whacks()) return commit + (1 - commit) * STICK_WHACK.land;
      return commit + (1 - commit) * 0.45 * BLOW_LAND;
    }
    // the halberd's chop is on the man 0.4 of the way from the top of its raise to the end
    if (this._attackMotion === "thrust" && this._stabsFork()) return FORK_STAB.land;
    if (this._attackMotion === "thrust") {
      const top = this._resolveReleasePoint(0.5);
      return top + (1 - top) * 0.4;
    }
    if (this._attackMotion === "blade_slash" && this._sweeps()) {
      const cocked = this._resolveReleasePoint(0.45);
      return cocked + (1 - cocked) * SCYTHE_SWEEP.through * SCYTHE_SWEEP.hitAt;
    }
    const commit = this._resolveReleasePoint(0.4);
    return commit + (1 - commit) * BLOW_LAND * 0.6;
  }

  /** A swing at a man just started: seconds until it is on him, when the sim lands the blow; 0 when no such swing is running. */
  blowLandsIn(): number {
    if (this._state !== AnimState.Attacking || !this._strikesAtMan()) return 0;
    return Math.max(0.001, this._blowLandFraction() * this._attackDuration - this._attackTimer);
  }

  /**
   * The blow on the man (spec above): from early in the drop the weapon arm is brought round to point from the shoulder at his head and the weapon's head laid
   * on it, the trunk pitched into it; held there after the swing, then let go. Overrides whatever the swing, shove or ready hold made of the arm.
   */
  private _aimBlow(dt: number): void {
    let w = 0;
    const mark = this._blowMark;
    if (mark && !mark.isDisposed() && this._state !== AnimState.Dead && this._limp < 0.5 && this._blowLandsAt > 0) {
      this._blowClock += dt;
      const t = this._blowClock;
      const land = this._blowLandsAt;
      // From BLOW_AIM_FROM short of the landing the weapon comes round onto him, full at the landing, held BLOW_HOLD and let go over its last BLOW_HOLD_FADE
      const from = land * BLOW_AIM_FROM;
      const s = Math.max(0, Math.min(1, (t - from) / Math.max(0.001, land - from)));
      w = t <= land ? s * s * (3 - 2 * s) : Math.max(0, Math.min(1, (land + BLOW_HOLD - t) / BLOW_HOLD_FADE));
      if (w <= 0 && t > land) this._blowMark = null;
    }
    // A fencer out on his lunge is committed as a striker on his man is: a blow on him then snaps only his head back (see LUNGE)
    this._aimWeight = this._lungeOut;
    // and the press's shove does not fold his sword arm back in: out on the lunge it stays straight and level at the man
    if (this._lungeOut > 0.01) {
      const b = this._body, lo = this._lungeOut;
      b.rightShoulder.rotation.x += (LUNGE.reach - b.rightShoulder.rotation.x) * lo;
      b.rightShoulder.rotation.z += (0 - b.rightShoulder.rotation.z) * lo;
      b.rightElbow.rotation.x += (-0.05 - b.rightElbow.rotation.x) * lo;
    }
    // Last frame's lunge comes off the hip first: nothing else poses the hip across the ground
    const lunged = this._blowLunge;
    if (lunged.x !== 0 || lunged.z !== 0) {
      this._body.hip.position.subtractInPlace(lunged);
      lunged.setAll(0);
    }
    if (w <= 0.01 || !mark || this._whacks() || this._sweeps()) return;
    // How far past the landing the blow has followed through (BLOW_FOLLOW)
    const fu = Math.max(0, Math.min(1, (this._blowClock - this._blowLandsAt) / BLOW_FOLLOW));
    const follow = fu * fu * (3 - 2 * fu);
    const b = this._body;
    // The pose this frame, top down, so the shoulder and the hand are where this frame puts them and not where the last one did
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.rightHand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    // A stand-off blow drives on through him (drive-through): how far into its BLOW_DRIVE after the landing
    const du = Math.max(0, Math.min(1, (this._blowClock - this._blowLandsAt) / BLOW_DRIVE));
    const drive = du * du * (3 - 2 * du);
    const driven = this._blowSolved;
    const pitchTo = driven ? BLOW_DRIVE_PITCH.land + (BLOW_DRIVE_PITCH.end - BLOW_DRIVE_PITCH.land) * drive : BLOW_PITCH + BLOW_FOLLOW_PITCH * follow;
    b.torso.rotation.x += (pitchTo - b.torso.rotation.x) * w;
    // He comes up out of the press crouch into the blow, legs long in a lunge (r2c3), so the club is brought down from over his own head and not poked up from the board rim
    b.leftHip.rotation.x += (BLOW_LUNGE.front - b.leftHip.rotation.x) * w;
    b.rightHip.rotation.x += (BLOW_LUNGE.back - b.rightHip.rotation.x) * w;
    b.leftKnee.rotation.x += (BLOW_LUNGE.knee - b.leftKnee.rotation.x) * w;
    b.rightKnee.rotation.x += (BLOW_LUNGE.knee - b.rightKnee.rotation.x) * w;
    for (const n of chain) n.computeWorldMatrix(true);
    // and his head where he stands now: the sim steps without drawing, so the mark's cached world place can be strides behind him. Once the blow has
    // struck (_blowStruck) his crown is read from where it was hit, not from the man flying off it
    const struck = this._blowStruck;
    const marks: TransformNode[] = [];
    if (!struck) for (let n: TransformNode | null = mark; n; n = n.parent as TransformNode | null) marks.unshift(n);
    for (const n of marks) n.computeWorldMatrix(true);
    const scale = Math.max(0.001, b.rightHand.absoluteScaling.y);
    const head = struck ? struck.head : this._crownOf(mark).add(new Vector3(0, BLOW_CROWN * scale, 0));
    const shoulder = b.rightShoulder.getAbsolutePosition();
    const reach = this._weaponReach() * scale;
    const arm = Vector3.Distance(shoulder, b.rightHand.getAbsolutePosition());
    if (Vector3.Distance(head, shoulder) > (reach + arm) * BLOW_AIM_SLACK) return;
    const toward = new Vector3(head.x - shoulder.x, 0, head.z - shoulder.z);
    if (toward.lengthSquared() < 1e-6) toward.set(0, 0, 1);
    toward.normalize();
    // The weapon falls BLOW_FALL below level onto the man (r2c3: the club comes down through him, not across him), so the fist must stand no farther from him
    // than the weapon's reach along that line. A man farther off is lunged at: the hip is carried toward him, at most BLOW_STEP of the striker's standing height.
    const short = Vector3.Dot(head.subtract(shoulder), toward) - arm * Math.sin(BLOW_OVERHEAD) - Math.cos(BLOW_FALL) * reach;
    if (short > 0) {
      const rootScale = Math.max(0.001, b.root.absoluteScaling.y);
      this._hipRest ??= b.hip.position.y;
      const step = Math.min(short, BLOW_STEP * this._hipRest * 2 * rootScale) * w;
      lunged.copyFrom(Vector3.TransformNormal(toward, Matrix.RotationY(-b.root.rotation.y)).scale(step / rootScale));
      lunged.y = 0;
      b.hip.position.addInPlace(lunged);
      for (const n of chain) n.computeWorldMatrix(true);
    }
    // Fist: up over his own head, the arm BLOW_OVERHEAD from vertical toward the man in the world, whatever his trunk's lean, so the weapon always starts its
    // fall from above. Rest hangs down -y in the shoulder's parent; rotation.x a turns it to (0, -cos a, -sin a)
    // Struck, the follow-through is the settle from this onto the point (below), not a swing on down past it that the settle would have to pull back up
    const swing = struck ? BLOW_OVERHEAD : BLOW_OVERHEAD + (BLOW_FOLLOW_ARM - BLOW_OVERHEAD) * follow;
    const up = toward.scale(Math.sin(swing)).addInPlace(new Vector3(0, Math.cos(swing), 0));
    const parent = b.rightShoulder.parent as TransformNode;
    const armDir = Vector3.TransformNormal(up, Matrix.Invert(parent.getWorldMatrix())).normalize();
    const pitch = Math.atan2(-armDir.z, -armDir.y);
    b.rightShoulder.rotation.x += (pitch - b.rightShoulder.rotation.x) * w;
    b.rightShoulder.rotation.z += (0.08 - b.rightShoulder.rotation.z) * w;
    b.rightElbow.rotation.x += (BLOW_ELBOW - b.rightElbow.rotation.x) * w;
    for (const n of chain) n.computeWorldMatrix(true);
    // [S] grounded lunge (battle-feel.e; r2c3 and r3c1: every striker's boots on the turf, the blow carried by the bend at the waist, not a spring): the
    // striker never leaves the ground. The hip sinks by what the spread lunge legs give up in height (thighs BLOW_LUNGE.front/back off vertical, the knees
    // near straight), so both soles stay on the ground under him; a man whose crown stands over the fist is struck lower down him instead (the drive-through
    // solve slides the point down his axis; a press blow takes his board top, _contactOn). Replaces the BLOW_LEAP spring, which in a dense line threw every
    // man of both lines a full half-height off the ground on the same step (probe: hips .61 -> 1.22 at the first blow).
    {
      this._hipRest ??= b.hip.position.y;
      const spread = Math.max(Math.abs(BLOW_LUNGE.front), Math.abs(BLOW_LUNGE.back));
      const sink = this._hipRest * (1 - Math.cos(spread) * Math.cos(BLOW_LUNGE.knee * 0.5)) * w;
      b.hip.position.y = Math.min(b.hip.position.y, this._hipRest - sink);
      for (const n of chain) n.computeWorldMatrix(true);
    }
    // The weapon's head goes onto the point and the arm is brought to it, through the drop and the hold alike: the fist lies an arm from the shoulder and a
    // reach from that point, of the two such places in the vertical plane through both the upper one (the arm came over the top). Solved through the drop too
    // (aimed-head-on-crown): with the fist left straight overhead a man nearer than the club is long could only be struck down his near face, the club hung
    // near vertical in the gap between them, head at his belt (bench: 0.74 m off his crown at the land). Struck, the point is the one it hit.
    // Solved only from a stand-off: in a press, chest to chest, the point lies inside the fold of arm and weapon (span under reach - arm) and the arm
    // could only be flung back to reach it, so there the fist stays overhead and the head is pinned on his near face as before (press-landed-contact)
    if (!struck) {
      const probe = this._contactOn(mark, b.rightHand.getAbsolutePosition(), true);
      const sh = b.rightShoulder.getAbsolutePosition();
      const arm0 = Vector3.Distance(sh, b.rightHand.getAbsolutePosition());
      this._blowSolved = Vector3.Distance(probe, sh) >= reach - arm0 + BLOW_SOLVE_MARGIN;
    }
    const solved = this._blowSolved;
    let point = struck ? struck.contact : this._contactOn(mark, b.rightHand.getAbsolutePosition(), solved);
    if (solved) {
      // drive-through: the club at its angle, the fist an arm from the shoulder and a reach back up that angle from a point on his axis, the point slid
      // down him (never above where it struck, never under BLOW_DRIVE_LOWEST of his height) to where the fist can be
      const fall = BLOW_DRIVE_FALL.land + (BLOW_DRIVE_FALL.end - BLOW_DRIVE_FALL.land) * drive + this._vary(7) * BLOW_DRIVE_VARY;
      const S = b.rightShoulder.getAbsolutePosition();
      const armNow = Vector3.Distance(S, b.rightHand.getAbsolutePosition());
      const tall = Math.max(0.001, head.y - b.root.getAbsolutePosition().y);
      const fh = Vector3.Dot(point.subtract(S), toward) - Math.cos(fall) * reach;
      const fy = Math.sqrt(Math.max(0, armNow * armNow - fh * fh));
      const py = Math.max(head.y - tall * BLOW_DRIVE_LOWEST, Math.min(point.y, S.y + fy - Math.sin(fall) * reach));
      point = new Vector3(point.x, py, point.z);
      // the fist where the club at that angle starts, or as near it as the arm goes
      const fist = point.add(toward.scale(-Math.cos(fall) * reach)).addInPlace(new Vector3(0, Math.sin(fall) * reach, 0));
      const armTo = fist.subtract(S);
      if (armTo.lengthSquared() > 1e-6) {
        const armHold = Vector3.TransformNormal(armTo.normalize(), Matrix.Invert(parent.getWorldMatrix())).normalize();
        b.rightShoulder.rotation.x += (Math.atan2(-armHold.z, -armHold.y) - b.rightShoulder.rotation.x) * w;
        for (const n of chain) n.computeWorldMatrix(true);
      }
      if (struck && drive >= 1 && Vector3.Distance(b.rightHand.getAbsolutePosition(), point) > reach * BLOW_HOLD_SLIP) {
        this._blowClock = Math.max(this._blowClock, this._blowLandsAt + BLOW_HOLD - BLOW_HOLD_FADE);
      }
    } else if (struck) {
      const shoulderNow = b.rightShoulder.getAbsolutePosition();
      const armNow = Vector3.Distance(shoulderNow, b.rightHand.getAbsolutePosition());
      const d = point.subtract(shoulderNow);
      const df = Vector3.Dot(d, toward);
      const span = Math.hypot(df, d.y);
      // A point past the arm's and the weapon's reach together (a lunging strike from a stand-off) has the arm laid straight at it and the head falling short,
      // the same way every frame, not a jump between two poses as the reach comes and goes
      const k = Math.max(-1, Math.min(1, (armNow * armNow + span * span - reach * reach) / (2 * armNow * Math.max(0.001, span))));
      if (span > 0.001) {
        const ef = df / span, ey = d.y / span, s = Math.sqrt(1 - k * k);
        // along shoulder->point by k, and off it at right angles, upward, by s
        const upHold = toward.scale(k * ef - s * ey).addInPlace(new Vector3(0, k * ey + s * ef, 0));
        const armHold = Vector3.TransformNormal(upHold, Matrix.Invert(parent.getWorldMatrix())).normalize();
        b.rightShoulder.rotation.x += (Math.atan2(-armHold.z, -armHold.y) - b.rightShoulder.rotation.x) * w * (solved ? 1 : follow);
        for (const n of chain) n.computeWorldMatrix(true);
      }
      // Walked or turned off the point meanwhile (the sim has him on to the next man) so the fist cannot stand a reach from it: the hold is let go now, over
      // its fade, rather than held on a point the club is not on
      if (struck && follow >= 1 && Vector3.Distance(b.rightHand.getAbsolutePosition(), struck.contact) > reach * BLOW_HOLD_SLIP) {
        this._blowClock = Math.max(this._blowClock, this._blowLandsAt + BLOW_HOLD - BLOW_HOLD_FADE);
      }
    }
    // Weapon: laid from the fist onto the point the arm was solved to, so its head is on him: his crown, or under a crown at or over the fist his board top
    // (_contactOn), pinned every frame from where he stands now, and held on the point it struck after the land, never run on past him into the turf
    const hand = b.rightHand.getAbsolutePosition();
    let end = point;
    if (!solved) {
      // Unsolved (a press): laid DOWN from the raised fist at least BLOW_FALL below level, onto his crown when it lies that steep under the fist, else down
      // the BLOW_FALL line at full reach, settling onto the pinned point over the follow-through
      const across = Math.max(0.001, Vector3.Dot(head.subtract(hand), toward));
      const onto = hand.y - head.y >= across * Math.tan(BLOW_FALL)
        ? point
        : hand.add(toward.scale(Math.cos(BLOW_FALL) * reach)).addInPlace(new Vector3(0, -Math.sin(BLOW_FALL) * reach, 0));
      end = follow > 0 ? Vector3.Lerp(onto, point, follow) : onto;
    }
    const dir = end.subtract(hand).normalize();
    this._aimTip = Vector3.TransformNormal(dir, Matrix.RotationY(-b.root.rotation.y)).normalize();
    this._aimWeight = w;
    this._clubHold = Math.max(this._clubHold, w);
  }

  /**
   * Where a blow lands on a man: the top of his crown, which under a helm or hat is the top of its shell (the hat's own mesh, not a crest or plume on it),
   * straight over the head-top mark. The mark's chain is already brought up to this frame.
   */
  private _crownOf(mark: TransformNode): Vector3 {
    const at = mark.getAbsolutePosition().clone();
    for (const child of mark.getChildren()) {
      const shell = child as Mesh;
      if (typeof shell.getBoundingInfo !== "function" || !shell.isEnabled() || !shell.isVisible) continue;
      shell.computeWorldMatrix(true);
      at.y = Math.max(at.y, shell.getBoundingInfo().boundingBox.maximumWorld.y);
    }
    return at;
  }

  // How far the weapon's head stands from the fist, in the hand's own scale: the farthest corner of its meshes' boxes, measured once
  private _reach: number | undefined;
  private _weaponReach(): number {
    if (this._reach !== undefined) return this._reach;
    const node = this._carry?.weapon?.prop?.node;
    const hand = this._body.rightHand;
    let far = 0;
    if (node) {
      hand.computeWorldMatrix(true);
      const at = hand.getAbsolutePosition();
      for (const mesh of node.getChildMeshes(false)) {
        mesh.computeWorldMatrix(true);
        for (const corner of mesh.getBoundingInfo().boundingBox.vectorsWorld) far = Math.max(far, Vector3.Distance(corner, at));
      }
    }
    this._reach = Math.max(0.3, far / Math.max(0.001, hand.absoluteScaling.y));
    return this._reach;
  }

  /** Brief flinch on hit — snaps torso/head back then recovers. */
  triggerFlinch(): void {
    if (this._state === AnimState.Dead) return;
    this._flinchTimer = 0.35;
    this._squashTimer = 0.15;
  }

  /** A heavy blow has come down on him: his board is knocked off his face and his knees go (BOARD_OFF), shown from the next pose on. */
  knockBoardOff(): void {
    if (this._state === AnimState.Dead) return;
    this._boardOff = BOARD_OFF_SECONDS;
  }
  private _boardOff = 0;

  /** A heavy blow has just landed on him and dwells there: his knees give and he folds under it (BUCKLE), shown from this very pose. */
  buckleUnder(): void {
    if (this._state === AnimState.Dead) return;
    this._buckle = BUCKLE_SECONDS;
  }
  private _buckle = 0;
  /** This man's own draw from every spread (one-blow-per-man), in [0, 1); set by his RuntimeUnit from his runtime id. */
  variety = 0.5;
  // His share of one spread, in [-1, 1): each salt a different, fixed draw
  private _vary(salt: number): number {
    const v = Math.sin((this.variety * 1000 + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return (v - Math.floor(v)) * 2 - 1;
  }

  /** A heavy blow has thrown him back off his feet: arms flung out wide, legs swept forward from under him (THROWN), full for `hold` s of `seconds`. */
  throwBack(seconds: number, hold: number): void {
    if (this._state === AnimState.Dead) return;
    this._thrown = seconds;
    this._thrownSeconds = seconds;
    this._thrownHold = hold;
  }
  private _thrown = 0;
  private _thrownSeconds = 1;
  private _thrownHold = 0;
  // Last frame's hip anchor of the throw (THROWN.seat), in the root frame: taken off the hip at the top of the next update
  private readonly _thrownSeat = new Vector3(0, 0, 0);
  private _thrownWeight(): number {
    if (this._thrown <= 0 || this._state === AnimState.Dead) return 0;
    const k = Math.min(1, this._thrown / Math.max(0.01, this._thrownSeconds - this._thrownHold));
    return k * k * (3 - 2 * k);
  }
  // Full for the first BOARD_OFF_HOLD s, then eased back over the rest
  private _boardOffWeight(): number {
    if (this._boardOff <= 0 || this._state === AnimState.Dead) return 0;
    const k = Math.min(1, this._boardOff / (BOARD_OFF_SECONDS - BOARD_OFF_HOLD));
    return k * k * (3 - 2 * k);
  }

  /** Toppled/downed living bodies go limp: 1 crumples the joints, 0 returns to the animated pose. */
  setLimp(limp: boolean): void {
    this._limpTarget = limp ? 1 : 0;
  }

  /** A body in flight takes its own air shape instead of the flat crumple it will land in. */
  /** Which face a corpse comes to rest on: `up` > 0 on its back, < 0 on its front. Its rest pose then stands folds up off the ground on the open side. */
  setLandedFace(up: number): void {
    const landed = up > 0.5 ? 1 : up < -0.5 ? -1 : 0;
    if (landed === 0 || landed === this._landedFace || this._state !== AnimState.Dead || this.walkStyle === "quadruped") return;
    this._landedFace = landed;
    this._writeDeathRest(landed);
  }

  setAirborne(airborne: boolean): void {
    this._airTarget = airborne ? 1 : 0;
  }

  /** A beast on a charge run (the mammoth's): eases into CHARGE_POSE while on, out of it after. */
  setCharging(charging: boolean, bull = false): void {
    this._chargeTarget = charging ? 1 : 0;
    if (charging) this._bullCharge = bull;
  }

  // a man on two legs charging head down (BULL_CHARGE); the jouster's rider sits his horse's charge upright
  private _bullCharge = false;
  /** Bare-fisted (BULL_FISTS): carries his fists before the belly and grabs then punches; set by the runtime for the minotaur. */
  bullFists = false;

  /** The fists carry (BULL_FISTS), stood or marching, eased out under the charge run. */
  private _applyBullFists(): void {
    if (!this.bullFists || this.walkStyle === "quadruped" || (this._state !== AnimState.Idle && this._state !== AnimState.Walking)) return;
    const b = this._body, F = BULL_FISTS, k = (1 - this._charge) * (1 - Math.min(1, this._limp));
    if (k <= 0.01) return;
    for (const n of [b.root, b.hip, b.torso, b.rightShoulder, b.leftShoulder]) n.computeWorldMatrix(true);
    const hip = b.hip.getAbsolutePosition();
    const u = Math.max(0.05, b.rightShoulder.getAbsolutePosition().y - hip.y);
    const sway = Math.sin((this._time + this._wobblePhase) * 3) * 0.04 * u;
    const { fwd, right } = this._heading();
    for (const side of [1, -1]) {
      const fist = hip.add(fwd.scale(F.carryAhead * u)).add(right.scale(side * F.carryOut * u)).add(new Vector3(0, F.carryUp * u + side * sway, 0));
      if (side > 0) this._armTo(b.rightShoulder, b.rightElbow, b.rightHand, fist, k, 1);
      else this._offArmTo(fist, k, 1);
    }
  }

  /** The grab and punch (BULL_FISTS). */
  private _animateBullPunch(dt: number): void {
    this._attackTimer += dt;
    const b = this._body, F = BULL_FISTS;
    const p = Math.min(this._attackTimer / this._attackDuration, 1);
    const ease = (u: number) => u * u * (3 - 2 * u);
    const grab = ease(Math.min(1, p / F.grab));
    const back = p < F.grab ? 0 : p < F.punch ? ease((p - F.grab) / (F.punch - F.grab)) : 1;
    const drive = p < F.punch ? 0 : ease(Math.min(1, (p - F.punch) / 0.12));
    const rest = p > 0.85 ? ease((p - 0.85) / 0.15) : 0;
    const hold = 1 - rest;
    // the off arm: from the carry out to the grab, held there
    b.leftShoulder.rotation.x = (F.lift + (F.reach - F.lift) * grab) * 1 * hold + F.lift * rest;
    b.leftShoulder.rotation.z = -F.out * 0.5;
    b.leftElbow.rotation.x = F.fold * (1 - grab) * hold + F.fold * rest - 0.15 * grab * hold;
    // the weapon arm: out to the grab, drawn back to the cock, driven straight out
    const wShoulder = F.lift + (F.reach - F.lift) * grab + (F.cock - F.reach) * back + (F.reach - F.cock) * drive;
    const wElbow = F.fold * (1 - grab) + (F.cockFold - 0) * back * (1 - drive);
    b.rightShoulder.rotation.x = wShoulder * hold + F.lift * rest;
    b.rightShoulder.rotation.z = F.out * 0.5;
    b.rightElbow.rotation.x = wElbow * hold + F.fold * rest;
    b.torso.rotation.y = (-F.twist * back + F.twist * 2 * drive) * hold;
    b.torso.rotation.x = (F.lean * grab - F.lean * 0.5 * back + F.lean * 1.5 * drive) * hold;
    b.rightHip.rotation.x = -0.2 * drive * hold;
    b.leftHip.rotation.x = 0.25 * drive * hold;
    b.leftKnee.rotation.x = 0.2 * drive * hold;
    if (p >= 1) this._state = AnimState.Idle;
  }
  private _chargeTarget = 0;
  private _charge = 0;

  /** [S] the charge pose (363; spec at CHARGE_POSE), over the quadruped's own walk or idle, by the eased charge weight. */
  private _applyChargePose(dt: number): void {
    this._charge += (this._chargeTarget - this._charge) * Math.min(1, dt * CHARGE_POSE.ease);
    const c = this._charge;
    if (c < 0.01 || this._state === AnimState.Dead) return;
    const b = this._body;
    if (this.walkStyle !== "quadruped") {
      // the bull's head-down run (BULL_CHARGE); not the jouster's rider
      if (!this._bullCharge) return;
      const B = BULL_CHARGE, s = Math.sin((this._time + this._wobblePhase) * B.pace);
      b.torso.rotation.x += B.lean * c;
      b.neck.rotation.x += B.head * c;
      b.leftShoulder.rotation.x += (B.armsBack + s * B.pump) * c;
      b.rightShoulder.rotation.x += (B.armsBack - s * B.pump) * c;
      b.leftHip.rotation.x -= s * B.stride * c;
      b.rightHip.rotation.x += s * B.stride * c;
      return;
    }
    const t = (this._time + this._wobblePhase) * CHARGE_POSE.pace;
    b.neck.rotation.x += CHARGE_POSE.headDown * c + Math.sin(t * 2) * CHARGE_POSE.toss * c;
    b.torso.rotation.x += CHARGE_POSE.pitch * c;
    // the gallop: front pair and hind pair reach together, longer than the trot's swing
    const reach = Math.sin(t) * CHARGE_POSE.stride * c;
    b.leftShoulder.rotation.x += reach;
    b.rightShoulder.rotation.x += reach * 0.8;
    b.leftHip.rotation.x -= reach;
    b.rightHip.rotation.x -= reach * 0.8;
    b.leftElbow.rotation.x += Math.max(0, -Math.sin(t)) * CHARGE_POSE.fold * c;
    b.rightElbow.rotation.x += Math.max(0, -Math.sin(t)) * CHARGE_POSE.fold * c;
    b.hip.rotation.x += Math.sin(t * 2) * CHARGE_POSE.rock * c;
  }

  // The barded horse's leg pivots (HORSE_GAIT), found once; empty for every other body
  private _gaitLegs: TransformNode[] | null = null;
  private _horseGait = 0;

  /** [S] the canter (369; spec at HORSE_GAIT): the horse's legs swung on their pivots while he moves. */
  private _applyHorseGait(dt: number): void {
    if (!this._gaitLegs || (this._gaitLegs.length === 0 && this._time < 0.5)) {
      const nodes = this._body.hip.getDescendants(false) as TransformNode[];
      this._gaitLegs = nodes.filter((n) => n.name.startsWith("hgait_"));
    }
    if (this._gaitLegs.length === 0) return;
    const moving = this._state !== AnimState.Dead && (this._state === AnimState.Walking || this._chargeTarget > 0);
    this._horseGait += ((moving ? 1 : 0) - this._horseGait) * Math.min(1, dt * HORSE_GAIT.ease);
    const c = this._charge;
    const amp = (HORSE_GAIT.walk + (HORSE_GAIT.run - HORSE_GAIT.walk) * c) * this._horseGait;
    const t = (this._time + this._wobblePhase) * (HORSE_GAIT.walkPace + (HORSE_GAIT.runPace - HORSE_GAIT.walkPace) * c);
    for (const leg of this._gaitLegs) {
      const beat = HORSE_GAIT.beats[leg.name.slice(6)] ?? 0;
      leg.rotation.x = Math.sin(t - beat * Math.PI * 2) * amp;
    }
  }

  /** Melee contact: called every decision while in reach; the shove pose decays on its own once the calls stop. */
  leanIntoShove(): void {
    this._shoveTimer = 0.5;
  }

  private _shoveTimer = 0;

  /** An enemy is close enough to close with (a few strides): a heavy weapon comes up to its cocked hold over the shoulder and stays there until the calls stop. */
  readyBlow(striking = false, behindRank = false, mark: TransformNode | null = null): void {
    this._readyTimer = 0.6;
    if (striking) this._strikeTimer = 0.6;
    if (behindRank) this._restLowTimer = 0.6;
    // In reach of the man himself (not a rank back): his beat is cocked back and landed down on that man (see club-cocked-in-press). The man is held through
    // gaps in the calls (press-mark-held): a call out of reach leaves him marked for PRESS_MARK_HOLD; a rank back, or his man dead, lets go at once
    if (striking && !behindRank && mark) {
      this._pressMark = mark;
      this._pressMarkTimer = PRESS_MARK_HOLD;
    } else if (behindRank || striking) this._pressMark = null;
  }
  private _pressMark: TransformNode | null = null;
  private _pressMarkTimer = 0;
  // How far this frame's press club is landed (0 cocked back, 1 down on the man), for _carryProp to lay it onto his board line; zeroed every frame
  private _pressLand = 0;
  /** The in-reach press beat's man: held PRESS_MARK_HOLD past the last call and through a swing at him; null a rank back, or once he is gone. */
  private _pressAim(): TransformNode | null {
    const m = this._pressMark;
    return m && !m.isDisposed() && m.isEnabled() && (this._pressMarkTimer > 0 || this._state === AnimState.Attacking) && this._state !== AnimState.Dead ? m : null;
  }
  // A clubber a rank back behind a man of his own side (see readyBlow): between beats his club rests low over that man's shoulder, not cocked
  private _restLowTimer = 0;
  /** The sim holds him off his first blow this step (STRIKE_LAG): his club stands near upright over his shoulder (WAIT_CLUB) till his beat. */
  waitBeat(): void {
    this._waitTimer = 0.12;
  }
  private _waitTimer = 0;
  private _wait = 0;
  private _strikeTimer = 0;
  private _readyTimer = 0;
  private _ready = 0;

  /** A wall man's enemy, called every decision while the wall closes on him or fights him: the spear comes to its fighting hold (see _carrySpear), a front man's pointed down at that man, a rear man's raised over the rank ahead, until the calls stop. */
  levelSpearAt(enemyGround: Vector3, enemyRadius = 0.3, rearRank = false): void {
    this._spearAim.copyFrom(enemyGround);
    this._spearAimRadius = enemyRadius;
    this._spearRear = rearRank;
    this._spearAimTimer = 0.6;
  }
  private _spearAim = new Vector3();
  /**
   * A lancer's man, called every decision while he closes on him (renaissance.jouster.png: the lance runs level at the foe's chest, across the horse's
   * neck): the couched lance turns from its rest line onto that point in yaw only, kept level at COUCH.dip, and comes back to rest LANCE_AIM.hold s after
   * the calls stop.
   * `chest` is the man's chest point in the world.
   */
  aimLanceAt(chest: Vector3): void {
    this._lanceAim.copyFrom(chest);
    this._lanceAimTimer = LANCE_AIM.hold;
  }
  private _lanceAim = new Vector3();
  private _lanceAimTimer = 0;
  private _lanceOn = 0;
  /** Slotted into a shield wall, called every step while he stands in it: his spear goes up on the wall's heading at SPEAR_WALL_UP (see _carrySpear), until the calls stop. */
  holdSpearInWall(heading: number, boardPlane: number | null = null, slotAt: Vector3 | null = null): void {
    this._wallHeading = heading;
    this._wallTimer = 0.3;
    this._boardPlane = boardPlane;
    if (slotAt) (this._boardSlot ??= new Vector3()).copyFrom(slotAt);
    else this._boardSlot = null;
  }
  // A front-rank man's wall line along the heading (see _lapBoard), null in a rear rank; how far his board has gone over from his hand to it (0 to 1); and where it was strapped on.
  private _boardPlane: number | null = null;
  // His slot in the wall's frame (SimulationSystem ShieldSlot.at): his board is seated on it across the wall, not on his hand (see _lapBoard)
  private _boardSlot: Vector3 | null = null;
  // The height his board rides at, a share of his stature taken from his body when it is first seated, so every board in a strip is at one height
  private _boardSeat: number | null = null;
  private _boardLap = 0;
  private _boardRest: Vector3 | null = null;
  // The heading of the wall he stands in, shared by every man in it, and how far his spear has gone over to the wall's line (0 to 1).
  private _wallHeading = 0;
  private _wallTimer = 0;
  private _wallHold = 0;
  private _spearDir = new Vector3();
  private _spearAimRadius = 0.3;
  // Whether he stands in a rear rank, and how far his hold has gone over from the front man's to the rear man's (0 to 1).
  private _spearRear = false;
  private _spearRearHold = 0;
  // How far the bow arm is up in a shot (0 to 1): the stave is stood upright in the fist by this much (see _carryProp).
  private _bowUp = 0;
  // The stroke (see _carrySpear): where in it the man is, from SPEAR_DRAW (drawn back) through 0 (the hold) to 1 (full lunge), and how near the enemy is to being in reach, 0 to 1.
  private _spearThrust = 0;
  private _spearNear = 0;
  // How far a rear man's spear has come down from its raised hold to the overhand thrust over the boards (0 to 1; see _carrySpear)
  private _spearOverhand = 0;
  private _lastDt = 1 / 60;
  /**
   * A clubber's blow in the press, on his own beat of PRESS_BLOW_BEAT_MIN..MAX seconds (hashed from the wobble phase, so a press is staggered). 1 is the club down
   * on the man in front, 0 cocked over the shoulder. The beat: resting landed on him (PRESS_BLOW_REST), heaved up off him to the cock (PRESS_BLOW_HEAVE), held
   * cocked (PRESS_BLOW_COCK), slammed down, slow off the cock and fastest at the bottom (PRESS_BLOW_SLAM), and held on the impact for the rest. So about two
   * thirds of a press is landed in any frame and a few clubs are up or coming down (trailer_3_sheet_01 r2c3). Each slam that lands is counted (blowsLanded):
   * the unit makes the man it lands on flinch.
   */
  private _pressBlow(): number {
    // A real swing is on the man (aimBlowAt, through its hold): the cosmetic beat yields, cocked, so the walk cutting the swing short does not hand the arm
    // to whatever phase the beat is in (probed: a landed beat dropped the fist to shin height 100 ms before the sim's blow came down)
    if (this._blowMark && this._blowLandsAt > 0 && this._blowClock < this._blowLandsAt + BLOW_HOLD) return 0;
    const h = Math.sin(this._wobblePhase * 91.7) * 43758.5453;
    const own = h - Math.floor(h);
    const beat = PRESS_BLOW_BEAT_MIN + (PRESS_BLOW_BEAT_MAX - PRESS_BLOW_BEAT_MIN) * own;
    const cycle = this._time / beat + own * 3.7;
    const u = cycle % 1;
    const up = PRESS_BLOW_REST, cock = up + PRESS_BLOW_HEAVE, slam = cock + PRESS_BLOW_COCK, impact = slam + PRESS_BLOW_SLAM;
    let blow: number;
    if (u < up) blow = 1;
    else if (u < cock) {
      const x = (u - up) / PRESS_BLOW_HEAVE;
      blow = 1 - x * x * (3 - 2 * x);
    } else if (u < slam) blow = 0;
    else if (u < impact) {
      const x = (u - slam) / PRESS_BLOW_SLAM;
      blow = x * x;
    } else blow = 1;
    // A slam lands once a beat, when the club reaches the man
    const beatIndex = Math.floor(cycle - impact);
    if (u >= impact && beatIndex !== this._lastBlowBeat) {
      if (this._lastBlowBeat !== null) this._blowsLanded++;
      this._lastBlowBeat = beatIndex;
    }
    return blow;
  }
  /** Whether the press beat is in its heave-up or cocked phase right now (the club is going up for the slam, not resting). */
  private _pressBlowCocked(): boolean {
    const h = Math.sin(this._wobblePhase * 91.7) * 43758.5453;
    const own = h - Math.floor(h);
    const beat = PRESS_BLOW_BEAT_MIN + (PRESS_BLOW_BEAT_MAX - PRESS_BLOW_BEAT_MIN) * own;
    const u = (this._time / beat + own * 3.7) % 1;
    return u >= PRESS_BLOW_REST && u < PRESS_BLOW_REST + PRESS_BLOW_HEAVE + PRESS_BLOW_COCK;
  }
  private _lastBlowBeat: number | null = null;
  private _blowsLanded = 0;
  /** Blows landed in the press since the last call (each a slam reaching the man in front): the unit makes its strike target flinch for each. */
  takeBlowsLanded(): number {
    const n = this._blowsLanded;
    this._blowsLanded = 0;
    return n;
  }

  /** One stroke of a levelled spear on the man's own beat: a slow draw back, a lunge in an eighth of the beat, and a recovery to the hold. */
  private _thrustStroke(): number {
    const br = (this._bracePose ??= this._buildBracePose());
    const u = (this._time * br.thrustRate + br.thrustPhase) % 1;
    const ease = (x: number): number => x * x * (3 - 2 * x);
    if (u < 0.45) return SPEAR_DRAW * ease(u / 0.45);
    if (u < 0.58) return SPEAR_DRAW + (1 - SPEAR_DRAW) * ease((u - 0.45) / 0.13);
    return 1 - ease((u - 0.58) / 0.42);
  }
  private _spearAimTimer = 0;
  private _spearLevel = 0;
  private _chestRise: number | null = null;
  private _shove = 0;
  // A heavy weapon's arc in the fist, radians from straight up (negative behind, positive in front), and how far it overrides the carry; written by the heavy
  // swing and the press, zeroed every frame.
  private _clubArc = 0;
  private _clubHold = 0;
  // The harvester's sweep (SCYTHE_SWEEP): the snath's line in his own frame while it runs, null otherwise; whether his scythe is the low-carried one
  private _sweepTip: Vector3 | null = null;
  // The state a step asked for while the sweep ran (setState): taken up when it ends
  private _afterSweep: AnimState | null = null;
  private _lowScythe = false;
  private _potionHang = false;
  // Per-unit shove pose so a rank in contact does not share one silhouette. Hashed from the wobble
  // phase rather than drawn fresh, so spawning consumes no extra random numbers.
  private _shovePose: { pitch: number; roll: number; stance: number; knee: number; rate: number; spread: number; elbow: number; trail: number; stride: number } | null = null;
  private _buildShovePose(): { pitch: number; roll: number; stance: number; knee: number; rate: number; spread: number; elbow: number; trail: number; stride: number } {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      // A third of a rank presses upright or leaning a touch back, the rest lean in by their own amount: at 0.2-0.35 for all, every presser met the 0.6 cap and the rank folded at one angle.
      pitch: h(1) < 0.34 ? -0.08 + h(11) * 0.12 : 0.1 + h(11) * 0.25,
      roll: (h(2) - 0.5) * 0.4,
      stance: (h(3) < 0.5 ? -1 : 1) * (0.12 + h(4) * 0.15),
      knee: 0.12 + h(5) * 0.2,
      rate: 5 + h(6) * 4,
      spread: 0.15 + h(7) * 0.3,
      elbow: 0.7 + h(8) * 0.5,
      trail: 0.12 + h(9) * 0.2,
      stride: 0.6 + h(10) * 0.25, // at 0.45-0.65 a charging rank took short steps under its lean
    };
  }
  // Per-man brace behind a board, so a wall in contact is men and not one man stamped out. Each stands in one of three ways, his own: crouched low under the rim on
  // folded legs, stood tall with the board held high, or shoulder driven into it. Within that he has his own board arm, the board's own turn and tilt in his grip, his own
  // height and elevation of spear, the way his head is turned, and his own beat of shifting his weight from foot to foot. Hashed from the wobble phase like the shove pose.
  private _bracePose: ReturnType<ProceduralAnimator["_buildBracePose"]> | null = null;
  private _braceSink = 0;
  private _hipRest: number | null = null;
  private _buildBracePose() {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const pick = h(101);
    const stand = pick < 0.35
      ? { crouch: BRACE_CROUCH_DEEP - 0.28 + h(103) * 0.28, raise: -0.45 - h(104) * 0.15 }
      : pick < 0.7
        ? { crouch: 0.05 + h(103) * 0.15, raise: -0.85 - h(104) * 0.2 }
        : { crouch: 0.25 + h(103) * 0.25, raise: -0.62 - h(104) * 0.16 };
    return {
      ...stand,
      // Trunk and head (see the spec at the head of this file): his own pitch into the board, the share of it his head is carried back up by, and the pitch of his spear
      // above level when he stands in a rear rank and below it when he stands in the front one.
      pitch: BRACE_PITCH_MIN + h(102) * (BRACE_PITCH_MAX - BRACE_PITCH_MIN),
      headLevel: 0.1 + h(124) * 0.7,
      spearGrip: SPEAR_FRONT_GRIP_MIN + h(127) * (SPEAR_FRONT_GRIP_MAX - SPEAR_FRONT_GRIP_MIN),
      out: 0.15 + h(105) * 0.3,
      elbow: -0.9 - h(106) * 0.45,
      kneeBias: (h(107) - 0.5) * 0.16,
      cant: (h(108) - 0.5) * 0.24,
      look: (h(109) - 0.5) * 0.7,
      boardYaw: (h(110) - 0.5) * 0.44,
      boardTilt: (h(111) - 0.5) * 0.32,
      boardRoll: (h(112) - 0.5) * 0.4,
      wallDepth: (h(140) - 0.5) * 2 * WALL_BOARD_DEPTH,
      wallStep: (h(141) - 0.5) * 2 * WALL_BOARD_STEP,
      wallTurn: (h(143) - 0.5) * 2 * WALL_BOARD_TURN,
      wallLean: WALL_BOARD_LEAN[0] + h(142) * (WALL_BOARD_LEAN[1] - WALL_BOARD_LEAN[0]),
      spearDip: (h(113) - 0.5) * 0.14,
      spearRaise: -2.2 + (h(114) - 0.5) * 0.5,
      spearElbow: -1.2 + (h(115) - 0.5) * 0.4,
      shiftRate: 1.2 + h(116) * 1.4,
      shiftPhase: h(117) * Math.PI * 2,
      thrustRate: 0.9 + h(118) * 0.5,
      thrustPhase: h(119),
      // Drive leg: he pushes off one leg, his own. That foot is planted behind him on a straight leg and the other is stepped in under the board on a bent knee,
      // by his own length of step; a man sunk low on folded legs steps shorter. The trunk turns the lead shoulder into the board and the head is tucked behind
      // the rim or lifted to look over it.
      lead: h(120) < 0.5 ? -1 : 1,
      lunge: (BRACE_STEP_MIN + h(121) * (BRACE_STEP_MAX - BRACE_STEP_MIN)) * (1 - Math.min(0.5, stand.crouch * 0.5)),
      twist: 0.1 + h(122) * 0.4,
      tuck: -0.2 + h(123) * 0.6,
    };
  }
  private _flinchTimer = 0;
  private _squashTimer = 0;
  private _limpTarget = 0;
  private _limp = 0;
  private _landedFace = 0;
  // Per-unit crumple shape so a pile of fallen bodies does not share one pose.
  private readonly _limpPose = this._buildLimpPose();

  private _buildLimpPose() {
    // Half the bodies throw one arm up past the head, the rest fling it out wide; the other arm stays near the
    // side. Every arm lies in the plane of the torso and its elbow folds sideways within that plane, so a body
    // on its back or front rests its arms and fists on the ground instead of holding a forearm up in the air.
    const pick = Math.random();
    const overhead = pick < 0.5;
    const leftFlung = Math.floor(pick * 4) % 2 === 0;
    // A flung-wide arm is never more than a diagonal and its forearm always folds back toward the head, hard
    // half the time, the arm thrown past the head folds 40 to 90 degrees at the elbow as well, and the low arm
    // lies along the side, so no body rests as a T or with a straight arm. Derived from
    // `pick`, so the pose draws no more random numbers than before.
    const folded = Math.floor(pick * 8) % 2 === 0;
    const flungX = overhead ? -(2.95 + Math.random() * 0.4) : (Math.random() - 0.5) * 0.3;
    const flungZ = overhead ? 0.1 + Math.random() * 0.6 : folded ? 0.45 + Math.random() * 0.35 : 0.5 + Math.random() * 0.3;
    const flungElbowZ = overhead ? 0.7 + Math.random() * 0.87 : folded ? 1.3 + Math.random() * 0.6 : 1.0 + Math.random() * 0.6;
    const lowX = (Math.random() - 0.5) * 0.3;
    const lowZ = 0.05 + Math.random() * 0.2;
    // The arm at the side is crooked too: its elbow folds outward 40 to 90 degrees, so no corpse lies with a
    // straight arm. From `pick`; the draw it replaces is still taken, so the pose uses as many random numbers.
    Math.random();
    const lowElbowZ = 0.7 + (pick * 128 - Math.floor(pick * 128)) * 0.87;
    // One leg lies splayed out to the side and bent at the knee within the ground plane; the other stays straight.
    const leftSplayed = Math.floor(pick * 16) % 2 === 0;
    // The knee folds between 50 and 90 degrees, so the leg is plainly crooked and not a slightly parted straight one.
    const splayZ = 0.5 + (pick * 32 - Math.floor(pick * 32)) * 0.5;
    const splayKneeZ = 0.9 + (pick * 64 - Math.floor(pick * 64)) * 0.7;
    // That leg's knee also stands up off the ground: the thigh lifts and the shin drops back to the foot.
    const tent = 0.45 + (pick * 256 - Math.floor(pick * 256)) * 0.35;
    // Each arm swings up to 0.6 rad further out or in and the trunk twists up to 0.5 rad about the spine, so the
    // fallen do not all lie square in one prone shape. From `pick` again, so no further random numbers are drawn.
    const bit = (n: number): number => pick * n - Math.floor(pick * n) - 0.5;
    const leftSwing = bit(512) * 1.2;
    const rightSwing = bit(1024) * 1.2;
    return {
      leftFlung,
      leftSplayed,
      torsoX: Math.random() * 0.2,
      torsoY: bit(2048),
      torsoZ: (Math.random() - 0.5) * 0.7,
      neckX: (Math.random() - 0.5) * 1.1,
      leftArmX: leftFlung ? flungX : lowX,
      rightArmX: leftFlung ? lowX : flungX,
      leftArmZ: -Math.max(0.02, (leftFlung ? flungZ : lowZ) + leftSwing),
      rightArmZ: Math.max(0.02, (leftFlung ? lowZ : flungZ) + rightSwing),
      // Elbow angles are the resting angles themselves, not offsets: barely any forward fold.
      leftElbowX: -0.12,
      rightElbowX: -0.12,
      leftElbowZ: -(leftFlung ? flungElbowZ : lowElbowZ),
      rightElbowZ: leftFlung ? lowElbowZ : flungElbowZ,
      // The straight leg's thigh stays near the body's line and its knee barely folds, so it lies flat; only the
      // splayed leg tents.
      leftHipX: -0.25 + Math.random() * 0.5 - (leftSplayed ? tent : 0),
      rightHipX: -0.25 + Math.random() * 0.5 - (leftSplayed ? 0 : tent),
      leftKneeX: 0.05 + Math.random() * 0.55 + (leftSplayed ? tent * 1.6 : 0),
      rightKneeX: 0.05 + Math.random() * 0.55 + (leftSplayed ? 0 : tent * 1.6),
      leftHipZ: leftSplayed ? -splayZ : -0.05,
      rightHipZ: leftSplayed ? 0.05 : splayZ,
      leftKneeZ: leftSplayed ? splayKneeZ : 0,
      rightKneeZ: leftSplayed ? 0 : -splayKneeZ,
    };
  }

  private _airTarget = 0;
  private _air = 0;
  // Per-unit flight shape as [joint, x, y, z]: a third of the bodies jackknife at the waist, a third bow backward
  // with the arms past the head, a third sit in an L with the legs straight out. Arms stay in line with the trunk
  // while the legs scissor wide apart on knees that each give by about half a radian, so a launched body is a bent plank that forks at
  // the hips and not a four-pointed star. Hashed from the wobble phase like the shove pose, so it consumes no
  // random numbers.
  private _airPose: Array<[{ rotation: { x: number; y: number; z: number } }, number, number, number]> | null = null;
  private _buildAirPose(): Array<[{ rotation: { x: number; y: number; z: number } }, number, number, number]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const b = this._body;
    const twist = (h(23) - 0.5) * 2.4; // up to 1.2 rad either way about the spine, so flung bodies do not all face one way
    const roll = (h(24) < 0.5 ? -1 : 1) * (0.4 + h(50) * 0.3); // and 0.4 to 0.7 rad over to one side at the waist, so the bend shows chest-on too
    const pitch = (h(48) - 0.5) * 2.4; // and up to 1.2 rad nose-up or nose-down, so they do not all fly flat like planks
    const variant = Math.floor(h(21) * 3);
    // The pitch may not cancel a variant's own bend: a trunk left within 0.4 rad of straight on the hips is folded
    // 0.4 to 0.9 rad the way it already leaned, so every body in flight is bent at the waist and none is a plank.
    const fold = (x: number): number => (Math.abs(x) < 0.4 ? (x < 0 ? -1 : 1) * (0.4 + h(49) * 0.5) : x);
    // One arm leads the other by about 0.6 rad and each knee bends by its own 0.4 to 1.2 rad, so the two sides of a
    // body in flight never mirror each other and no leg flies straight as a plank.
    const lead = h(40) < 0.5 ? 0 : 1;
    const armGap = 0.5 + h(41) * 0.3;
    const leftArm = lead === 0 ? armGap : 0;
    const rightArm = lead === 0 ? 0 : armGap;
    const leftKnee = 0.4 + h(42) * 0.8;
    const rightKnee = 0.4 + ((h(42) + 0.35 + h(43) * 0.3) % 1) * 0.8;
    // One leg swings 0.25 to 0.6 rad ahead of or behind the other and both kick out to the side, one by 0.3 to 0.55 rad
    // and the other by half that, so the legs splay open without making a wide V.
    const hipGap = (h(44) < 0.5 ? -1 : 1) * (0.25 + h(45) * 0.35);
    const kick = 0.3 + h(47) * 0.25;
    const leftKick = -(h(46) < 0.5 ? kick : kick * 0.5);
    const rightKick = h(46) < 0.5 ? kick * 0.5 : kick;
    // The right arm flings 0.7 to 1.2 rad out from the side and the left 0.3 to 1.2, so the two rarely match, on elbows that give by half a
    // radian at most, so they splay near full stretch and do not tuck in against the trunk.
    const leftOut = 0.3 + h(51) * 0.9;
    const rightOut = 0.7 + h(52) * 0.5;
    const leftBend = -(0.1 + h(53) * 0.3 + rightArm * 0.4);
    const rightBend = -(0.1 + h(54) * 0.3 + leftArm * 0.4);
    if (variant === 0) {
      // Jackknife: folded hard at the waist, straight legs swung only a little way up toward the arms reaching for the toes
      const hip = 0.2 + h(30) * 0.3;
      return [
        [b.torso, fold(0.9 + h(25) * 0.5 + pitch), twist, roll],
        [b.neck, 0.4, 0, 0],
        [b.leftShoulder, -(1.0 + h(26) * 0.3 + leftArm), 0, -leftOut],
        [b.rightShoulder, -(1.0 + h(27) * 0.3 + rightArm), 0, rightOut],
        [b.leftElbow, leftBend, 0, 0],
        [b.rightElbow, rightBend, 0, 0],
        [b.leftHip, -hip, 0, leftKick],
        [b.rightHip, -(hip + hipGap), 0, rightKick],
        [b.leftKnee, leftKnee, 0, 0],
        [b.rightKnee, rightKnee, 0, 0],
      ];
    }
    if (variant === 1) {
      // Bow: spine bent backward, head thrown back, arms trailing straight past the head, heels kicked up behind
      const hip = 0.35 + h(32) * 0.3;
      return [
        [b.torso, fold(-(0.45 + h(25) * 0.3) + pitch), twist, roll],
        [b.neck, -0.5, 0, 0],
        [b.leftShoulder, -(2.9 + h(26) * 0.2 - leftArm), 0, -leftOut],
        [b.rightShoulder, -(2.9 + h(28) * 0.2 - rightArm), 0, rightOut],
        [b.leftElbow, leftBend, 0, 0],
        [b.rightElbow, rightBend, 0, 0],
        [b.leftHip, hip, 0, leftKick],
        [b.rightHip, hip + hipGap, 0, rightKick],
        [b.leftKnee, leftKnee, 0, 0],
        [b.rightKnee, rightKnee, 0, 0],
      ];
    }
    // Sit: thighs folded square to the trunk with the legs held out straight, arms trailing back along the sides
    const hip = 1.2 + h(25) * 0.3;
    return [
      [b.torso, fold(0.2 + h(26) * 0.3 + pitch), twist, roll],
      [b.neck, (h(27) - 0.5) * 0.6, 0, 0],
      [b.leftShoulder, 0.2 + h(28) * 0.2 + leftArm, 0, -leftOut],
      [b.rightShoulder, 0.2 + h(29) * 0.2 + rightArm, 0, rightOut],
      [b.leftElbow, leftBend, 0, 0],
      [b.rightElbow, rightBend, 0, 0],
      [b.leftHip, -hip, 0, leftKick],
      [b.rightHip, -(hip + hipGap), 0, rightKick],
      [b.leftKnee, leftKnee, 0, 0],
      [b.rightKnee, rightKnee, 0, 0],
    ];
  }

  // Pupil wobble state (googly eyes)
  private _pupilOffX = 0;
  private _pupilOffY = 0;
  private _pupilVelX = 0;
  private _pupilVelY = 0;
  private _prevNeckRotX = 0;
  private _prevNeckRotZ = 0;

  update(dt: number): void {
    this._lastDt = dt;
    this._time += dt;

    if (this._state !== AnimState.Dead) {
      this._resetPose();
    }
    // Last frame's throw anchor comes off the hip first (the sinks below set only its height)
    if (this._thrownSeat.x !== 0 || this._thrownSeat.y !== 0 || this._thrownSeat.z !== 0) {
      this._body.hip.position.subtractInPlace(this._thrownSeat);
      this._thrownSeat.setAll(0);
    }
    // and last frame's lunge (see LUNGE); a lunge cut short leaves the rapier turned point-first: turned back as soon as it is over
    if (this._lungeStep.z !== 0) {
      this._body.hip.position.subtractInPlace(this._lungeStep);
      this._lungeStep.setAll(0);
    }
    this._lungeOut = 0;

    // a chop cut short leaves the halberd stood at its angle: back to its rest in the fist
    if (this._halberdProp && this._halberdProp.node.rotationQuaternion && !this._chopDown && !(this._state === AnimState.Attacking && this._attackMotion === "thrust")) {
      this._poseHalberd(0, 0);
      this._slideHalberd(0);
      this._chopAim = null;
    }

    this._idleSink = 0;
    this._clubHold = 0;
    this._sweepTip = null;
    this._pressLand = 0;
    this._castLift = 0;
    this._castReach = 0;
    this._castLevel = 0;
    switch (this._state) {
      case AnimState.Idle:
        this._animateIdle(dt);
        break;
      case AnimState.Walking:
        this._animateWalk(dt);
        break;
      case AnimState.Attacking:
        this._animateAttack(dt);
        break;
      case AnimState.Dead:
        this._animateDead(dt);
        break;
    }
    this._applyChargePose(dt);
    this._applyHorseGait(dt);

    // Shove overlay (additive): torso pitched into the enemy, legs split and bent, heaving;
    // between swings the arms windmill out from the shoulders instead of hanging at the sides.
    this._shoveTimer -= dt;
    this._shove += ((this._shoveTimer > 0 ? 1 : 0) - this._shove) * Math.min(1, dt * 6);
    this._spearAimTimer -= dt;
    this._spearLevel += ((this._spearAimTimer > 0 ? 1 : 0) - this._spearLevel) * Math.min(1, dt * 5);
    this._spearRearHold += ((this._spearRear ? 1 : 0) - this._spearRearHold) * Math.min(1, dt * 4);
    this._wallTimer -= dt;
    this._wallHold += ((this._wallTimer > 0 ? 1 : 0) - this._wallHold) * Math.min(1, dt * 6);
    this._boardLap += ((this._wallTimer > 0 && this._boardPlane !== null ? 1 : 0) - this._boardLap) * Math.min(1, dt * 5);
    this._spearThrust = this._spearLevel > 0.01 && this._spearShaft() ? this._thrustStroke() * this._spearLevel * this._spearNear : 0;
    this._braceSink = 0;
    if (this._shove > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      const p = (this._shovePose ??= this._buildShovePose());
      const k = this._shove;
      const phase = (this._time + this._wobblePhase) * p.rate;
      // The walk already leans 0.55 rad; a presser still stepping in takes half the extra pitch.
      const br = this._shieldBoard() ? (this._bracePose ??= this._buildBracePose()) : null;
      if (br) {
        // A man behind a board carries the trunk at his own pitch, whatever the walk, the stand or the strike under the shove had made of it, heaving on it a little;
        // and his head is his own on top of that, carried part of the way back up and tucked or lifted. Nothing here brings two men to one angle.
        const set = k * (1 - Math.min(1, this._limp));
        b.torso.rotation.x += (br.pitch + Math.sin(phase * 0.5) * 0.06 - b.torso.rotation.x) * set;
        b.neck.rotation.x += (-br.pitch * br.headLevel + br.tuck - b.neck.rotation.x) * set;
      } else {
        b.torso.rotation.x += (p.pitch * (this._state === AnimState.Walking ? 0.5 : 1) + Math.sin(phase * 0.5) * 0.08) * k;
        // A swing pitches the torso itself; with the shove on top the lean stops at 0.6 rad, short of a fold at the waist.
        b.torso.rotation.x = Math.min(b.torso.rotation.x, 0.6);
        b.neck.rotation.x -= p.pitch * 0.6 * k;
      }
      b.torso.rotation.z += ((br ? p.roll * 0.3 + br.cant : p.roll) + Math.cos(phase * 0.35) * 0.08) * k;
      // Thighs come forward under the pitched torso and the knees give a little, so the body breaks at the waist and stays tall on its legs.
      b.leftHip.rotation.x += (p.stance - 0.15) * k;
      b.rightHip.rotation.x -= (p.stance + 0.15) * k;
      b.leftKnee.rotation.x += (p.knee + 0.05) * k;
      b.rightKnee.rotation.x += (p.knee + 0.05) * k;
      if (this._state !== AnimState.Attacking && this.defaultAttackMotion === "heavy_swing" && (this._carry ??= this._buildCarry()).weapon?.prop) {
        // A clubber in the press, stood or stepping in, does not windmill or level his weapon arm: he keeps it cocked up over his shoulder and, on his own beat,
        // brings it down onto the man in front (see _pressBlow), holds it there a moment and heaves it back up, while the free arm still claws and shoves.
        const heave = Math.sin(phase * 0.5) * 0.12;
        const marked = this._pressAim() !== null;
        // No man marked and not a rank back: he carries the press cock and does not slam at nothing (press-mark-held)
        const aimed = marked || this._restLowTimer <= 0;
        const blow = aimed && !marked ? 0 : this._pressBlow();
        b.rightShoulder.rotation.x += (-2.5 + heave + (aimed ? PRESS_AIM_ARM : PRESS_BLOW_ARM) * blow - b.rightShoulder.rotation.x) * k;
        b.rightShoulder.rotation.z += (0.3 - 0.4 * blow - b.rightShoulder.rotation.z) * k;
        const elbow = aimed ? PRESS_AIM_ELBOW.cock + (PRESS_AIM_ELBOW.land - PRESS_AIM_ELBOW.cock) * blow : -1.3 + 1.15 * blow;
        b.rightElbow.rotation.x += (elbow - b.rightElbow.rotation.x) * k;
        // The trunk goes over with the blow and the head with it
        b.torso.rotation.x += 0.45 * blow * k;
        b.neck.rotation.x += 0.15 * blow * k;
        b.leftShoulder.rotation.x += (-0.9 + Math.sin(phase) * 1.1) * k;
        b.leftShoulder.rotation.z -= (p.spread + Math.cos(phase) * 0.25) * k;
        b.leftElbow.rotation.x -= (1.0 + Math.sin(phase) * 0.6) * k;
        if (aimed) {
          this._clubArc = PRESS_CLUB_COCK + heave;
          this._pressLand = marked ? blow : 0;
        } else this._clubArc = CLUB_COCK * 0.9 + heave + (PRESS_BLOW_CLUB - CLUB_COCK * 0.9 - heave) * blow;
        this._clubHold = Math.max(this._clubHold, k);
      } else if (this._state === AnimState.Idle) {
        b.leftShoulder.rotation.x += (-0.9 + Math.sin(phase) * 1.1) * k;
        b.rightShoulder.rotation.x += (-0.9 + Math.sin(phase + Math.PI) * 1.1) * k;
        b.leftShoulder.rotation.z -= (p.spread + Math.cos(phase) * 0.25) * k;
        b.rightShoulder.rotation.z += (p.spread + Math.cos(phase + Math.PI) * 0.25) * k;
        b.leftElbow.rotation.x -= (1.0 + Math.sin(phase) * 0.6) * k;
        b.rightElbow.rotation.x -= (1.0 + Math.sin(phase + Math.PI) * 0.6) * k;
      } else {
        // Stepping in or swinging: the elbows stay bent, so no arm is a straight rod.
        b.leftElbow.rotation.x -= (p.elbow + 0.1) * k;
        b.rightElbow.rotation.x -= (p.elbow - 0.1) * k;
      }
      if (br) {
        // Brace: whatever the walk, the swing or the flail made of the shield arm, it locks out in front of the chest, upper arm forward and forearm
        // across the body, at the man's own height and reach, and holds there while the weapon arm goes on working.
        const hold = k * (1 - Math.min(1, this._limp));
        b.leftShoulder.rotation.x += (br.raise + Math.sin(phase * 0.5) * 0.06 - b.leftShoulder.rotation.x) * hold;
        b.leftShoulder.rotation.y += (0 - b.leftShoulder.rotation.y) * hold;
        b.leftShoulder.rotation.z += (br.out - b.leftShoulder.rotation.z) * hold;
        b.leftElbow.rotation.x += (br.elbow - b.leftElbow.rotation.x) * hold;
        b.leftElbow.rotation.z += (0 - b.leftElbow.rotation.z) * hold;
        // Legs: the thighs come forward by half of what the knees fold, so the feet stay under him, and the hips come down by what that takes off the legs' height.
        // He shifts his weight from foot to foot on his own beat: the unloaded knee gives and the trunk rocks over the other.
        const shift = Math.sin(this._time * br.shiftRate + br.shiftPhase);
        b.leftHip.rotation.x -= (br.crouch * 0.5 + shift * 0.06) * hold;
        b.rightHip.rotation.x -= (br.crouch * 0.5 - shift * 0.06) * hold;
        b.leftKnee.rotation.x += (br.crouch + br.kneeBias + Math.max(0, shift) * 0.2) * hold;
        b.rightKnee.rotation.x += (br.crouch - br.kneeBias + Math.max(0, -shift) * 0.2) * hold;
        b.torso.rotation.z += shift * 0.05 * hold;
        b.neck.rotation.y += br.look * hold;
        // Drive leg (see _buildBracePose): the lead thigh comes forward with its shin left upright under the knee, the drive leg goes back straight by the seven tenths
        // of that angle that keeps both feet on the ground, and the hips come down by what the split takes off the legs.
        const lunge = br.lunge * hold;
        const leadHip = br.lead < 0 ? b.leftHip : b.rightHip;
        const leadKnee = br.lead < 0 ? b.leftKnee : b.rightKnee;
        const driveHip = br.lead < 0 ? b.rightHip : b.leftHip;
        leadHip.rotation.x -= lunge;
        leadKnee.rotation.x += lunge;
        driveHip.rotation.x += lunge * 0.7;
        // Pressing (tabs_screenshot_06: the men walk into their boards): in the shove the drive leg goes further back and straight, the lead knee bends over
        // the foot and the trunk is driven forward into the board, by PRESS_DRIVE at full shove
        const drive = PRESS_DRIVE * Math.min(1, this._shove) * hold;
        driveHip.rotation.x += drive;
        leadHip.rotation.x -= drive * 0.5;
        leadKnee.rotation.x += drive * 0.6;
        b.torso.rotation.x += drive * 0.5;
        b.torso.rotation.y += br.lead * br.twist * hold;
        b.neck.rotation.y -= br.lead * br.twist * 0.6 * hold;
        this._hipRest ??= b.hip.position.y;
        this._braceSink = this._hipRest * ((1 - Math.cos(br.crouch * 0.5)) + (1 - Math.cos(br.lunge)) * 0.5) * hold;
        if (this._spearShaft()) {
          // Spear arm: no windmill and no underarm poke. The fist goes up to the ear, above the shoulder, with the elbow cocked out behind, and holds the shaft there;
          // a stroke straightens the arm forward along the shaft from that hold and comes back to it, the elbow cocking further as the shaft is drawn back.
          const jab = Math.max(this._state === AnimState.Attacking ? Math.sin(Math.min(1, this._attackTimer / this._attackDuration) * Math.PI) : 0, this._spearThrust);
          // A rear man's fist is at his ear; a front man's is couched at his waist (see the spec at the head of this file)
          const front = 1 - this._spearRearHold;
          b.rightShoulder.rotation.x += (br.spearRaise + (SPEAR_COUCH_RAISE - br.spearRaise) * front + 0.5 * jab + Math.sin(phase * 0.5 + 1) * 0.05 - b.rightShoulder.rotation.x) * hold;
          b.rightShoulder.rotation.y += (0 - b.rightShoulder.rotation.y) * hold;
          b.rightShoulder.rotation.z += (0.2 - b.rightShoulder.rotation.z) * hold;
          b.rightElbow.rotation.x += (br.spearElbow + (SPEAR_COUCH_ELBOW - br.spearElbow) * front + 0.9 * jab + 0.8 * Math.min(0, this._spearThrust) - b.rightElbow.rotation.x) * hold;
          b.rightElbow.rotation.z += (0 - b.rightElbow.rotation.z) * hold;
        }
      }
    }
    if (this._hipRest !== null) this._body.hip.position.y = this._hipRest - this._braceSink - this._idleSink;
    // Upright in the wall (tabs_screenshot_06: every man stands upright behind his board, face over the rim): whatever the brace, the press and the stride made of him,
    // a man held in a wall carries his trunk no further over than WALL_TRUNK_MAX, his neck brings his face back up level over the rim, and his knees stay under
    // his hips with no splay out to the side. The shove is in his stride and his shoulder, not a fold at the waist.
    const upright = this._wallHold * (1 - Math.min(1, this._limp));
    if (upright > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      const over = Math.max(0, b.torso.rotation.x - WALL_TRUNK_MAX);
      b.torso.rotation.x -= over * upright;
      b.neck.rotation.x += (-b.torso.rotation.x * WALL_HEAD_LEVEL - b.neck.rotation.x) * upright;
      for (const hip of [b.leftHip, b.rightHip]) hip.rotation.z -= hip.rotation.z * upright;
      // ...and he stands on his legs: no knee folded past WALL_KNEE_MAX, no thigh swung past WALL_HIP_MAX either way (a short step, not a lunge), and his hips
      // carried at WALL_SINK_SHARE of the brace's sink, so he stands about his height behind the board and not crouched under its rim
      for (const knee of [b.leftKnee, b.rightKnee]) knee.rotation.x -= Math.max(0, knee.rotation.x - WALL_KNEE_MAX) * upright;
      for (const hip of [b.leftHip, b.rightHip]) hip.rotation.x -= (hip.rotation.x - Math.max(-WALL_HIP_MAX, Math.min(WALL_HIP_MAX, hip.rotation.x))) * upright;
      if (this._hipRest !== null) b.hip.position.y = this._hipRest - (this._braceSink * (1 - upright * (1 - WALL_SINK_SHARE))) - this._idleSink;
    }
    // Spear carry: a shield man on the march does not pump his spear arm. It hangs at his side with the elbow a little bent, the shaft stood up in the fist.
    if (this._state === AnimState.Walking && this._spearShaft()) {
      const b = this._body;
      const carry = (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp));
      b.rightShoulder.rotation.x += (Math.sin((this._time + this._wobblePhase) * 4) * 0.06 - b.rightShoulder.rotation.x) * carry;
      b.rightShoulder.rotation.z += (0.25 - b.rightShoulder.rotation.z) * carry;
      b.rightElbow.rotation.x += (-0.5 - b.rightElbow.rotation.x) * carry;
    }
    // Prop carry: an arm with a weapon or a board in its hand is not an empty arm on the march. It leaves the walk's pendulum for a hold of the man's own, weapon hand up in front
    // of the hip and board arm folded across the body, and the load drops on each footfall and is heaved back up between them, twice a stride, on his own beat.
    if (this._state === AnimState.Walking && this.walkStyle !== "quadruped") {
      const b = this._body;
      const c = (this._carry ??= this._buildCarry());
      const carry = (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp));
      const bob = Math.abs(Math.sin((this._time + this._wobblePhase) * (this._gait ??= this._buildGait()).rate + c.beat)) - 0.5;
      this._carryDip = bob * c.bob;
      // A caster marches with his rod in the hold he stands with
      const load = c.weapon ?? (c.ready?.cast ? c.ready : null);
      if (load) {
        b.rightShoulder.rotation.x += (load.raise + bob * c.bob - b.rightShoulder.rotation.x * 0.8) * carry;
        b.rightShoulder.rotation.z += (load.out - b.rightShoulder.rotation.z) * carry;
        b.rightElbow.rotation.x += (load.elbow - bob * c.bob * 1.5 - b.rightElbow.rotation.x) * carry;
      }
      if (c.board) {
        b.leftShoulder.rotation.x += (c.board.raise - bob * c.bob * 0.7 - b.leftShoulder.rotation.x * 0.8) * carry;
        b.leftShoulder.rotation.z += (c.board.out - b.leftShoulder.rotation.z) * carry;
        b.leftElbow.rotation.x += (c.board.elbow + bob * c.bob - b.leftElbow.rotation.x) * carry;
      }
    }
    // Closing on a man with a heavy weapon, out of contact: whatever the carry or the stand made of the weapon arm, it comes up to the cocked hold over the
    // shoulder that the press keeps (see _animateHeavySwing), so men stepping into a fight carry their clubs raised and not slanted or trailed.
    this._readyTimer -= dt;
    this._strikeTimer -= dt;
    this._pressMarkTimer -= dt;
    this._ready += ((this._readyTimer > 0 ? 1 : 0) - this._ready) * Math.min(1, dt * 6);
    this._waitTimer -= dt;
    this._wait += ((this._waitTimer > 0 ? 1 : 0) - this._wait) * Math.min(1, dt * 8);
    const cocked = this._ready * (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp));
    if (cocked > 0.01 && this._state !== AnimState.Attacking && this._state !== AnimState.Dead && this.walkStyle !== "quadruped" && this.defaultAttackMotion === "heavy_swing" && (this._carry ??= this._buildCarry()).weapon?.prop) {
      const b = this._body;
      const heave = Math.sin((this._time + this._wobblePhase) * 3) * 0.1;
      // Within striking distance he brings it down on his own beat, as a man in the press does. A rank back, behind a man of his own side, he rests the club
      // low and forward over that man's shoulder between beats, heaving it a little (trailer_3_sheet_01 r2c3: the clubs behind the line are down on it, not
      // raised), and on his beat it is cocked and slammed down from there
      this._restLowTimer -= dt;
      const rest = this._restLowTimer > 0 ? REAR_CLUB_REST + Math.sin((this._time + this._wobblePhase) * 2.2) * 0.08 : 0;
      const blow = this._strikeTimer > 0 || (rest <= 0 && this._pressAim() !== null) ? (rest > 0 ? Math.max(this._pressBlow(), rest * (this._pressBlow() > 0.001 || this._pressBlowCocked() ? 0 : 1)) : this._pressBlow()) : rest;
      // In reach of the man himself: cocked back over the shoulder between slams, landed down onto his board line (club-cocked-in-press); closing on him,
      // out of reach and not a rank back, the club is carried in that same cock, back over the shoulder, not stood straight up
      const aimed = rest <= 0 && (this._pressAim() !== null || this._strikeTimer <= 0);
      b.rightShoulder.rotation.x += (-2.5 + heave + (aimed ? PRESS_AIM_ARM : PRESS_BLOW_ARM) * blow - b.rightShoulder.rotation.x) * cocked;
      b.rightShoulder.rotation.z += (0.3 - 0.4 * blow - b.rightShoulder.rotation.z) * cocked;
      const elbow = aimed ? PRESS_AIM_ELBOW.cock + (PRESS_AIM_ELBOW.land - PRESS_AIM_ELBOW.cock) * blow : -1.3 + 1.15 * blow;
      b.rightElbow.rotation.x += (elbow - b.rightElbow.rotation.x) * cocked;
      b.torso.rotation.x += 0.45 * blow * cocked;
      // Held off his first blow (ready-club-upright): the club stood near upright over his shoulder instead of cocked back
      const wait = this._wait * (1 - Math.min(1, blow * 4));
      if (wait > 0.01) {
        b.rightShoulder.rotation.x += (WAIT_CLUB.arm + heave * 0.5 - b.rightShoulder.rotation.x) * wait * cocked;
        b.rightShoulder.rotation.z += (WAIT_CLUB.out - b.rightShoulder.rotation.z) * wait * cocked;
        b.rightElbow.rotation.x += (WAIT_CLUB.elbow - b.rightElbow.rotation.x) * wait * cocked;
      }
      if (this._clubHold <= 0.01) {
        this._clubArc = aimed ? PRESS_CLUB_COCK + heave : CLUB_COCK * 0.9 + heave + (PRESS_BLOW_CLUB - CLUB_COCK * 0.9 - heave) * blow;
        this._clubArc += (WAIT_CLUB.arc + heave * 0.3 - this._clubArc) * wait;
        this._pressLand = aimed ? blow * (1 - wait) : 0;
      }
      this._clubHold = Math.max(this._clubHold, cocked);
    }
    // Limp overlay (additive): bend spine, elbows and knees while toppled or downed
    this._limp += (this._limpTarget - this._limp) * Math.min(1, dt * 9);
    if (this._limp > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      const p = this._limpPose;
      const k = this._limp;
      b.torso.rotation.x += p.torsoX * k;
      b.torso.rotation.y += p.torsoY * k;
      b.torso.rotation.z += p.torsoZ * k;
      b.neck.rotation.x += p.neckX * k;
      b.leftShoulder.rotation.x += p.leftArmX * k;
      b.rightShoulder.rotation.x += p.rightArmX * k;
      b.leftShoulder.rotation.z += p.leftArmZ * k;
      b.rightShoulder.rotation.z += p.rightArmZ * k;
      // Elbows blend to their resting fold rather than adding to the idle or walk bend already there.
      b.leftElbow.rotation.x += (p.leftElbowX - b.leftElbow.rotation.x) * k;
      b.rightElbow.rotation.x += (p.rightElbowX - b.rightElbow.rotation.x) * k;
      b.leftElbow.rotation.z += p.leftElbowZ * k;
      b.rightElbow.rotation.z += p.rightElbowZ * k;
      b.leftHip.rotation.x += p.leftHipX * k;
      b.rightHip.rotation.x += p.rightHipX * k;
      b.leftKnee.rotation.x += p.leftKneeX * k;
      b.rightKnee.rotation.x += p.rightKneeX * k;
    }
    // Air overlay: a limp body in flight blends from the crumple to its own flight shape, and back on landing
    this._air += (this._airTarget - this._air) * Math.min(1, dt * 9);
    if (this._air * this._limp > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const a = this._air * Math.min(1, this._limp);
      for (const [joint, x, y, z] of (this._airPose ??= this._buildAirPose())) {
        joint.rotation.x += (x - joint.rotation.x) * a;
        joint.rotation.y += (y - joint.rotation.y) * a;
        joint.rotation.z += (z - joint.rotation.z) * a;
      }
      this._flailInAir(a);
    }
    // Waist break (additive): the legs carry the body's lean while the torso bends part-way back against it and
    // the head hangs the way the body is going, so a pressed, running or toppling body is an S, not one plank.
    if (this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      // A limp body keeps half the counter-bend, so its crumple still folds it forward at the waist.
      const k = 1 - 0.5 * Math.min(1, this._limp);
      const leanX = Math.max(-0.4, Math.min(0.4, b.root.rotation.x));
      const leanZ = Math.max(-0.4, Math.min(0.4, b.root.rotation.z));
      b.torso.rotation.x -= leanX * 0.8 * k;
      b.torso.rotation.z -= leanZ * 0.8 * k;
      b.neck.rotation.x += leanX * 0.6;
      b.neck.rotation.z += leanZ * 0.6;
    }
    // Squash-and-stretch on hit
    if (this._squashTimer > 0) {
      this._squashTimer -= dt;
      const t = Math.max(0, this._squashTimer / 0.15);
      const squash = Math.sin(t * Math.PI);
      const b = this._body;
      b.torso.scaling.y = 1 - 0.15 * squash;
      b.torso.scaling.x = 1 + 0.08 * squash;
      b.torso.scaling.z = 1 + 0.08 * squash;
    } else if (this._body.torso.scaling.y !== 1) {
      this._body.torso.scaling.setAll(1);
    }

    this._aimBlow(dt);
    this._squareShield();
    this._carrySpear();
    this._carryProp(dt);
    this._holdForkStab(dt);
    this._turnFork();
    this._holdBanjo();
    this._offhandToGrip();
    this._holdChopDown(dt);
    this._aimMusket(dt);
    this._restHalberd();
    this._twoHandPole();
    this._levelPike();
    this._applyBullFists();
    this._hangFlasks();
    this._carryBoulder();
    this._holdPalette();
    this._couchLance();
    this._holdHeater();
    this._pointRapier();
    this._standOffhandAxe();
    this._standMainAxe(dt);
    this._holdSlab();
    this._lungeLegs();
    this._holdTPose(dt);
    // A throw cut short (knocked down mid-cock) leaves the javelin turned about: strapped on again as soon as the throw is over
    if (this._javelinStand > 0 && !(this._state === AnimState.Attacking && this._attackMotion === "throw")) this._standJavelin(this._javelin()!, 0);
    this._tendSwordRing(dt);
    // Flinch overlay (additive), the very last pose layer: laid over the brace, the board's squaring and the carries, so a man behind a board still goes back
    // under the blow. It holds full for the first FLINCH_HOLD of its time, so the frame the blow lands on shows it whole.
    if (this._flinchTimer > 0 && this._state !== AnimState.Dead) {
      this._flinchTimer -= dt;
      const intensity = Math.max(0, Math.min(1, this._flinchTimer / (0.35 - FLINCH_HOLD)));
      const b = this._body;
      // A man struck while his own blow comes down on his man carries it through (r2c3): his trunk and weapon arm stay on the blow, only his head goes back
      // ...and so does the harvester through his sweep (SCYTHE_SWEEP): a blow on him does not tip the cut up off its level line
      const committed = intensity * (1 - Math.max(this._aimWeight, this._sweepTip ? this._clubHold : 0));
      // Snap torso backward and to the side
      b.torso.rotation.x -= FLINCH_PITCH * committed;
      b.torso.rotation.z += 0.3 * committed;
      // Head whips back
      b.neck.rotation.x -= FLINCH_HEAD * intensity;
      // Arms flail out
      b.leftShoulder.rotation.z -= 0.5 * intensity;
      b.rightShoulder.rotation.z += 0.5 * committed;
    }
    // Buckled under a dwelling blow (see BUCKLE): knees given, hips dropped, trunk and head folded down, arms dropped out of his guard
    if (this._buckle > 0 && this._state !== AnimState.Dead) {
      const b = this._body;
      const k = Math.min(1, this._buckle / BUCKLE_FADE) * (1 - this._thrownWeight());
      if (dt > 0) this._buckle = Math.max(0, this._buckle - dt);
      // his own fold (one-blow-per-man): which knee goes deeper, how far his trunk comes down, the way he twists and his head turns
      const uneven = this._vary(1) * BUCKLE_VARY.knee;
      const kneeL = BUCKLE.knee * (1 + uneven), kneeR = BUCKLE.knee * (1 - uneven);
      b.leftHip.rotation.x += (-BUCKLE.thigh * (1 + uneven * 0.6) - b.leftHip.rotation.x) * k;
      b.rightHip.rotation.x += (-BUCKLE.thigh * (1 - uneven * 0.6) - b.rightHip.rotation.x) * k;
      b.leftKnee.rotation.x += (kneeL - b.leftKnee.rotation.x) * k;
      b.rightKnee.rotation.x += (kneeR - b.rightKnee.rotation.x) * k;
      this._hipRest ??= b.hip.position.y;
      b.hip.position.y = Math.min(b.hip.position.y, this._hipRest * (1 - BUCKLE.sink * k));
      b.torso.rotation.x += (BUCKLE.trunk * (1 + this._vary(2) * BUCKLE_VARY.trunk) - b.torso.rotation.x) * k;
      b.torso.rotation.y += (this._vary(3) * BUCKLE_VARY.twist - b.torso.rotation.y) * k;
      b.torso.rotation.z += (this._vary(4) * BUCKLE_VARY.roll - b.torso.rotation.z) * k;
      b.neck.rotation.x += (BUCKLE.head - b.neck.rotation.x) * k;
      b.neck.rotation.y += (this._vary(5) * BUCKLE_VARY.head - b.neck.rotation.y) * k;
      const armSide = this._vary(6) * BUCKLE_VARY.arm;
      for (const [sh, side] of [[b.leftShoulder, 1], [b.rightShoulder, -1]] as const) {
        sh.rotation.x += (BUCKLE.arm * (1 + side * armSide) - sh.rotation.x) * k;
        sh.rotation.z *= 1 - k * 0.7;
      }
      b.leftElbow.rotation.x += (BUCKLE.elbow - b.leftElbow.rotation.x) * k;
      b.rightElbow.rotation.x += (BUCKLE.elbow - b.rightElbow.rotation.x) * k;
    }
    // Board knocked off and knees gone (see BOARD_OFF): the board arm flung out wide and the board hanging off it, the hips dropped on bent knees
    const off = this._boardOffWeight();
    if (off > 0) {
      const b = this._body;
      if (dt > 0) this._boardOff = Math.max(0, this._boardOff - dt);
      b.leftShoulder.rotation.z -= BOARD_OFF_FLING.out * off;
      b.leftShoulder.rotation.x += BOARD_OFF_FLING.back * off;
      b.leftElbow.rotation.scaleInPlace(1 - off);
      // Thrown off his feet, his knees do not fold under him
      const buckle = off * (1 - this._thrownWeight());
      b.leftHip.rotation.x -= BOARD_OFF_BUCKLE.thigh * buckle;
      b.rightHip.rotation.x -= BOARD_OFF_BUCKLE.thigh * buckle;
      b.leftKnee.rotation.x += BOARD_OFF_BUCKLE.knee * buckle;
      b.rightKnee.rotation.x += BOARD_OFF_BUCKLE.knee * buckle;
      if (this._hipRest !== null) b.hip.position.y = Math.min(b.hip.position.y, this._hipRest * (1 - BOARD_OFF_BUCKLE.sink * buckle));
    }
    // Thrown back off his feet, hip-led (see THROWN): the hip anchored over the root so the root's pitch turns about his pelvis, both arms flung out wide
    // and back, the legs laid out in the flight frame (one trailing down the way he goes, one knee kicked up toward the striker), so he reads as a man
    // leaving seat-first with his trunk tipped back, not one laid flat head-first about his feet
    const thrown = this._thrownWeight();
    if (thrown > 0) {
      const b = this._body;
      if (dt > 0) this._thrown = Math.max(0, this._thrown - dt);
      // The pelvis is the point the blow carries: the hip sits THROWN.seat of its height straight over the root whatever the root's pitch and roll, the
      // rest of him turning about it. In the root frame that is the root's rotation taken off a vertical offset
      const r = b.root.rotation;
      const hy = b.hip.position.y;
      const anchored = Vector3.TransformNormal(new Vector3(0, hy * THROWN.seat, 0), Matrix.Invert(Matrix.RotationYawPitchRoll(r.y, r.x, r.z)));
      this._thrownSeat.set(anchored.x * thrown, (anchored.y - hy) * thrown, anchored.z * thrown);
      b.hip.position.addInPlace(this._thrownSeat);
      b.rightShoulder.rotation.z += THROWN.armsOut * thrown;
      // The board arm is out already as far as the board's fling took it
      b.leftShoulder.rotation.z -= Math.max(0, THROWN.armsOut - BOARD_OFF_FLING.out * off) * thrown;
      b.rightShoulder.rotation.x += THROWN.armsBack * thrown;
      b.rightElbow.rotation.scaleInPlace(1 - thrown);
      b.torso.rotation.x += (-THROWN.trunk - b.torso.rotation.x) * thrown;
      b.neck.rotation.x += (-THROWN.head - b.neck.rotation.x) * thrown;
      // Thighs as world angles from straight down, positive the way he goes (-z, away from the striker who faced him): a hip rotation adds to the root's
      // pitch about the same axis, so the root's live pitch is taken out of each
      const trail = THROWN.legTrail - r.x;
      const kick = THROWN.legKick - r.x;
      b.rightHip.rotation.x += (trail - b.rightHip.rotation.x) * thrown;
      b.leftHip.rotation.x += (kick - b.leftHip.rotation.x) * thrown;
      b.rightKnee.rotation.x += (THROWN.kneeTrail - b.rightKnee.rotation.x) * thrown;
      b.leftKnee.rotation.x += (THROWN.kneeKick - b.leftKnee.rotation.x) * thrown;
    }

    // ─── Googly-eye pupil wobble ───
    this._updatePupilWobble(dt);
  }

  // What each arm is carrying on the march and how this man holds it. A weapon is anything in the right hand but the mitt itself; an aimed bow and a wall carrier's upright
  // spear already have their own holds. Looked up on first use, like the board, and hashed from the wobble phase like the gait.
  // The weapon is carried in one of four attitudes, the man's own: shouldered (hand up at the collar, the head of it back over the shoulder), upright (hand in front of the
  // chest, the weapon stood up), across the chest (hand at the belt, the weapon slanted up to the other shoulder) or trailed (arm hung, the weapon low and behind him).
  // `tip` is where the weapon points in that attitude, in the body's own frame: x out to the weapon side, y up, z ahead.
  // A bowman has no carry. Standing, he has a ready hold instead, one of three and his own: at the port (the bow slanted across the chest, both hands on it), stood up in
  // front of him at half arm with the other hand at the string, or held low across the hips. With it goes his stance: feet staggered fore and aft by `stagger` on knees
  // giving by `give`, and the body turned `yaw` off the line to the enemy with the head left looking down it. `spin` turns a bow about its own length so the belly faces away
  // from him, and `seat` is where its middle sits from the fist, in the weapon's own frame.
  // A caster (an orbed staff or a bolt in the hand) has a ready hold too, `cast`, and keeps it standing, on the march and as the place his cast starts from and comes back to.
  // The staff is stood on the ground beside him or out in front and leant on, or cradled across the chest; the bolt is cocked by the head, held up overhead or low at the
  // side; the other hand is up in a gesture, on the hip or across on the shaft. He keeps his own stance under it, with more of his weight on the one hip. `plant` is half
  // the length of a staff that stands on the ground: the fist slides along it until its butt is down.
  private _carry: {
    weapon: { raise: number; out: number; elbow: number; tip: Vector3; prop: CarriedProp | null } | null;
    ready: { raise: number; out: number; elbow: number; tip: Vector3; prop: CarriedProp | null; left: { raise: number; out: number; elbow: number }; yaw: number; stagger: number; give: number; cast?: boolean; overhead?: boolean } | null;
    board: { raise: number; out: number; elbow: number } | null; bob: number; beat: number;
  } | null = null;
  private _carryTurn = 0;
  private _carryDip = 0;
  // How far a cast has the staff or bolt off its hold: `_castLift` takes a planted staff off the ground, `_castReach` tips its head back (negative) and then at the enemy.
  private _castLift = 0;
  private _castReach = 0;
  // How far the drive has laid the staff level at the enemy (CAST_LEVEL_TIP)
  private _castLevel = 0;
  // Where that cast lays the staff head: level at the enemy, or stood up over the head (CAST_RAISE_TIP, side-signed)
  private _castTip = CAST_LEVEL_TIP;
  /** True for a body that stands and casts from its own two-handed hold, so nothing outside should spread its arms for it. */
  get castsFromHold(): boolean {
    return (this._carry ??= this._buildCarry()).ready?.cast === true;
  }
  private _buildCarry(): NonNullable<ProceduralAnimator["_carry"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    // A caster's rod: a staff with an orb on it (a plain staff is a striking weapon) or a bolt.
    const rod = this.locomotionBias === "aimed" ? undefined
      : this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "bolt" || (n.name === "staff" && n.getChildren().some((c) => c.name === "orb")));
    const held = this.locomotionBias !== "aimed" && !rod && !this._spearShaft() && this._body.rightHand.getChildren().some((n) => !/HandM$/.test(n.name));
    // A club, a sword or a hafted head turns in the fist to the attitude; anything else only rides the arm.
    const node = this._body.rightHand.getChildren().find((n): n is TransformNode => /^(club|blade|gsblade|katana|handle|pickaxeHandle|treeClubCarry|scytheCarry)$/.test(n.name));
    const side = Math.sign(this._body.rightShoulder.position.x) || 1;
    // A scythe is carried one way, high, and like the tree he stands in it from the first frame, whatever phase the arm is in
    const scythe = node?.name === "scytheCarry";
    // ...but the harvester's, pegged (SCYTHE_LOW), is carried low across him in both fists
    const lowScythe = scythe && !!node?.getChildren().some((c) => c.getChildren().some((g) => g.name === "snathPeg"));
    this._lowScythe = lowScythe;
    // A slab sword marked two-fisted (TWO_FIST_SWORD) has the off fist on its grip under the weapon fist; it is mounted with its own line through the fist
    // (FISTS_ON_GRIP): the grip preset set it off to the side of that line, so the fist closed on air beside the grip
    const fists = node && /^(blade|gsblade)$/.test(node.name) ? node.getChildren().find((c) => c.name in TWO_FIST_SWORD) : undefined;
    this._swordFists = fists ? TWO_FIST_SWORD[fists.name] : 0;
    if (node && fists) {
      const line = Vector3.Up().rotateByQuaternionToRef(Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), new Vector3());
      node.position.copyFrom(line.scale(Vector3.Dot(node.position, line)));
    }
    const prop = node ? {
      node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), grip: node.position.clone(),
      spin: scythe ? Quaternion.RotationYawPitchRoll((lowScythe ? SCYTHE_LOW.spin : SCYTHE_SPIN) * side, 0, 0) : undefined,
    } : null;
    if (scythe) this._carryTurn = 1;
    // A club with nothing in the other hand is held in both (two-handed grip, see OFFHAND_GRIP_UP), and like the scythe it is in its carry from the first frame
    this._twoHanded = node?.name === "club" && !this._shieldBoard() && this._body.leftHand.getChildren().every((n) => /HandM$/.test(n.name));
    if (this._twoHanded) this._carryTurn = 1;
    // The tree's bowed side (its own +x) is turned about the trunk to face back against the way the trunk runs out, which the carry's turn then brings round to face up
    if (node?.name === "treeClubCarry" && prop) prop.spin = Quaternion.RotationYawPitchRoll(Math.atan2(-TREE_HIP_TIP.z, TREE_HIP_TIP.x * side) + Math.PI, 0, 0);
    const lean = (x: number, y: number, z: number): Vector3 => new Vector3((x + (h(93) - 0.5) * 0.3) * side, y + (h(94) - 0.5) * 0.3, z + (h(95) - 0.5) * 0.3).normalize();
    // A pole held in both hands is carried upright before the chest (POLE_GRIP), the one attitude that keeps its shaft in the off hand's reach
    // The pitchfork (339) is carried low instead: the weapon arm hanging, the shaft out level before his hips (farmer.farmer.png), the last attitude below
    const fork = this._body.rightHand.getChildren().some((n) => n.getChildren().some((c) => c.name === "forkBar"));
    // The hay baler's stick (344) has its own level carry across his front (HAY_CARRY)
    const hayStick = node?.id === "hayStick";
    if (hayStick) this._carryTurn = 1;
    // A flask in the fist hangs at the hip (POTION_HANG)
    const potion = this._body.rightHand.getChildren().some((n) => n.name === "potionBall");
    this._potionHang = potion;
    const pick = fork ? 0.9 : this._body.rightHand.getChildren().some((n) => n.getChildren().some((c) => c.name in POLE_GRIP)) ? 0.4 : h(92);
    // An uprooted tree has one carry, not four (units/secret.tree_giant): the fist at the hip ahead of the thigh, the trunk run out near level to his own side and a
    // little forward, the crown hip-high at his flank, not shouldered or stood up over the line beside him
    const tree = node?.name === "treeClubCarry";
    // and he stands in it from the first frame: a whole tree does not ease round out of the fist's strapped angle
    if (tree) this._carryTurn = 1;
    const armingOut = !!node?.getChildren().some((c) => c.name === "armingOut");
    const attitude = potion
      ? { raise: POTION_HANG.raise, out: POTION_HANG.out, elbow: POTION_HANG.elbow, tip: POTION_HANG.tip.clone() }
      : armingOut
      ? { raise: ARMING_OUT.raise, out: ARMING_OUT.out, elbow: ARMING_OUT.elbow, tip: new Vector3(ARMING_OUT.tip[0] * side, ARMING_OUT.tip[1], ARMING_OUT.tip[2]).normalize() }
      : hayStick
      ? { raise: HAY_CARRY.raise, out: HAY_CARRY.out, elbow: HAY_CARRY.elbow, tip: new Vector3(HAY_CARRY.tip.x * side, HAY_CARRY.tip.y, HAY_CARRY.tip.z).normalize() }
      : lowScythe
      ? { raise: SCYTHE_LOW.raise, out: SCYTHE_LOW.out, elbow: SCYTHE_LOW.elbow, tip: new Vector3(SCYTHE_LOW.tip.x * side, SCYTHE_LOW.tip.y, SCYTHE_LOW.tip.z).normalize() }
      : scythe
      ? { raise: SCYTHE_HIGH_ARM.raise, out: SCYTHE_HIGH_ARM.out, elbow: SCYTHE_HIGH_ARM.elbow, tip: new Vector3(SCYTHE_HIGH_TIP.x * side, SCYTHE_HIGH_TIP.y, SCYTHE_HIGH_TIP.z).normalize() }
      : tree
      ? { raise: TREE_HIP_ARM.raise, out: TREE_HIP_ARM.out, elbow: TREE_HIP_ARM.elbow, tip: new Vector3(TREE_HIP_TIP.x * side, TREE_HIP_TIP.y, TREE_HIP_TIP.z).normalize() }
      : pick < 0.3
      ? { raise: -0.9 - h(81) * 0.3, out: 0.15 + h(82) * 0.2, elbow: -1.9 - h(83) * 0.3, tip: lean(0.25, 0.45, -0.85) }
      : pick < 0.55
        ? { raise: -0.5 - h(81) * 0.3, out: 0.2 + h(82) * 0.2, elbow: -1.2 - h(83) * 0.3, tip: lean(0.1, 1, 0.1) }
        : pick < 0.8
          ? { raise: -0.45 - h(81) * 0.25, out: 0.02 + h(82) * 0.1, elbow: -1.4 - h(83) * 0.3, tip: lean(-0.8, 0.55, 0.2) }
          : { raise: 0.3 + h(81) * 0.2, out: 0.15 + h(82) * 0.15, elbow: -0.15 - h(83) * 0.2, tip: lean(0.2, -0.4, -0.9) };
    const bow = this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "bow");
    const hang = bow ? Quaternion.FromEulerAngles(bow.rotation.x, bow.rotation.y, bow.rotation.z) : null;
    const stave = bow && hang ? { node: bow, rest: hang, grip: bow.position.clone(), spin: Quaternion.RotationYawPitchRoll(Math.PI, 0, 0), seat: new Vector3(0, 0, bow.position.length() * 0.3) } : null;
    const stand = h(96);
    const hold = stand < 0.38
      ? { raise: -0.5 - h(81) * 0.2, out: -0.12 - h(82) * 0.12, elbow: -1.45 - h(83) * 0.3, tip: lean(-0.55, 0.8, 0.15), left: { raise: -0.75 - h(97) * 0.2, out: -0.3 - h(98) * 0.15, elbow: -1.15 - h(99) * 0.3 } }
      : stand < 0.72
        ? { raise: -0.85 - h(81) * 0.25, out: 0.02 + h(82) * 0.12, elbow: -0.35 - h(83) * 0.25, tip: lean(0.05, 1, 0.2), left: { raise: -0.65 - h(97) * 0.2, out: -0.35 - h(98) * 0.15, elbow: -1.5 - h(99) * 0.3 } }
        : { raise: -0.1 - h(81) * 0.2, out: 0.05 + h(82) * 0.12, elbow: -0.75 - h(83) * 0.3, tip: lean(-0.75, 0.5, 0.3), left: { raise: -0.35 - h(97) * 0.2, out: -0.2 - h(98) * 0.15, elbow: -0.95 - h(99) * 0.3 } };
    const armed = this.locomotionBias === "aimed" && this._body.rightHand.getChildren().some((n) => !/HandM$/.test(n.name));
    const staff = rod?.name === "staff";
    const bone = rod?.id === "boneStaff";
    const priest = rod?.id === "priestStaff";
    if (bone || priest) this._carryTurn = 1;
    const rodHold = !rod ? null : priest
      ? { raise: PRIEST_HOLD.raise - h(81) * 0.08, out: PRIEST_HOLD.out + h(82) * 0.06, elbow: PRIEST_HOLD.elbow - h(83) * 0.1, tip: lean(...PRIEST_HOLD.tip), left: { ...PRIEST_HOLD.left }, plant: true }
      : bone
      ? { raise: BONE_HOLD.raise - h(81) * 0.1, out: BONE_HOLD.out + h(82) * 0.08, elbow: BONE_HOLD.elbow - h(83) * 0.15, tip: lean(...BONE_HOLD.tip), left: { raise: BONE_HOLD.left.raise - h(97) * 0.15, out: BONE_HOLD.left.out + h(98) * 0.1, elbow: BONE_HOLD.left.elbow - h(99) * 0.2 }, plant: true }
      : staff
      ? stand < 0.45
        ? { raise: -0.7 - h(81) * 0.2, out: 0.3 + h(82) * 0.15, elbow: -1.0 - h(83) * 0.3, tip: lean(0.12, 1.6, 0.05), left: { raise: -1.3 - h(97) * 0.3, out: 0.35 + h(98) * 0.2, elbow: -1.3 - h(99) * 0.3 }, plant: true }
        : stand < 0.75
          ? { raise: -1.05 - h(81) * 0.2, out: 0.1 + h(82) * 0.1, elbow: -0.45 - h(83) * 0.25, tip: lean(0, 1.6, -0.25), left: { raise: 0.3 + h(97) * 0.2, out: 0.5 + h(98) * 0.2, elbow: -1.5 - h(99) * 0.4 }, plant: true }
          : { raise: -0.45 - h(81) * 0.2, out: -0.05 - h(82) * 0.1, elbow: -1.5 - h(83) * 0.3, tip: lean(-0.45, 0.85, 0.1), left: { raise: -0.7 - h(97) * 0.2, out: -0.3 - h(98) * 0.15, elbow: -1.2 - h(99) * 0.3 }, plant: false }
      : stand < 0.4
        ? { raise: -2.3 - h(81) * 0.3, out: 0.35 + h(82) * 0.15, elbow: -1.5 - h(83) * 0.3, tip: lean(0.05, 0.45, 0.9), left: { raise: -1.2 - h(97) * 0.3, out: 0.1 + h(98) * 0.2, elbow: -0.3 - h(99) * 0.3 }, plant: false }
        : stand < 0.7
          ? { raise: -2.8 - h(81) * 0.2, out: 0.3 + h(82) * 0.15, elbow: -0.5 - h(83) * 0.3, tip: lean(0, 1, 0.25), left: { raise: -1.35 - h(97) * 0.3, out: 0.15 + h(98) * 0.2, elbow: -0.3 - h(99) * 0.3 }, plant: false }
          : { raise: -0.3 - h(81) * 0.2, out: 0.25 + h(82) * 0.15, elbow: -0.9 - h(83) * 0.3, tip: lean(0.1, 0.25, 0.95), left: { raise: -1.4 - h(97) * 0.3, out: 0.4 + h(98) * 0.2, elbow: -1.2 - h(99) * 0.3 }, plant: false };
    const rodProp = rod && rodHold ? {
      node: rod, rest: Quaternion.FromEulerAngles(rod.rotation.x, rod.rotation.y, rod.rotation.z), grip: rod.position.clone(),
      plant: rodHold.plant ? (rod as Mesh).getBoundingInfo().boundingBox.extendSize.y * rod.scaling.y : undefined,
    } : null;
    return {
      weapon: held ? { ...attitude, prop } : null,
      ready: armed ? { ...hold, prop: stave, yaw: 0.6 + h(89) * 0.35, stagger: 0.4 + h(90) * 0.2, give: 0.1 + h(91) * 0.16 }
        : rodHold ? { ...rodHold, prop: rodProp, yaw: 0.1 + h(89) * 0.25, stagger: 0, give: 0, cast: true, overhead: rod?.id === "boneStaff" } : null,
      board: this._shieldBoard() ? { raise: -0.3 - h(85) * 0.4, out: -0.15 + h(86) * 0.3, elbow: -0.8 - h(87) * 0.5 } : null,
      bob: 0.08 + h(84) * 0.1,
      beat: h(88) * Math.PI,
    };
  }

  /*
   * [S] couched lance (330; renaissance.jouster.png: both riders' lances level, tucked under the arm at the waist, driven across the horse's neck into the
   * other; renaissance.jouster.red.png: carried level forward at rest too, tip a little down). A lance in the weapon fist is held couched in every living
   * state but limpness: the weapon arm low and bent, fist at the waist (COUCH.raise, COUCH.elbow), the shaft stood in the world COUCH.dip below level and
   * COUCH.across in toward the off side. On the attack it is driven forward (COUCH.drive of arm swing and elbow opening, the trunk pitched COUCH.pitch).
   */
  private _lanceProp: { node: TransformNode; rest: Quaternion } | null | undefined = undefined;
  private _couchLance(): void {
    if (this._lanceProp === undefined) {
      const node = this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "lance");
      this._lanceProp = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z) } : null;
    }
    const lance = this._lanceProp;
    if (!lance) return;
    const w = this._state === AnimState.Dead || this.walkStyle === "quadruped" ? 0 : 1 - Math.min(1, this._limp);
    if (w <= 0.01) {
      lance.node.rotationQuaternion = null;
      return;
    }
    const b = this._body;
    const progress = this._state === AnimState.Attacking ? Math.min(1, this._attackTimer / Math.max(0.001, this._attackDuration)) : 0;
    const drive = this._state === AnimState.Attacking ? Math.sin(Math.min(1, progress * 1.6) * Math.PI) : 0;
    b.rightShoulder.rotation.x += (COUCH.raise - COUCH.drive * drive - b.rightShoulder.rotation.x) * w;
    b.rightShoulder.rotation.z += (0.12 - b.rightShoulder.rotation.z) * w;
    b.rightElbow.rotation.x += (COUCH.elbow + COUCH.drive * 1.6 * drive - b.rightElbow.rotation.x) * w;
    b.torso.rotation.x += COUCH.pitch * drive * w;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.rightHand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    b.leftShoulder.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    const right = b.rightShoulder.getAbsolutePosition().subtract(b.leftShoulder.getAbsolutePosition());
    right.y = 0;
    if (right.lengthSquared() < 1e-6) right.set(1, 0, 0);
    right.normalize();
    const axis = fwd.scale(Math.cos(COUCH.dip) * Math.cos(COUCH.across))
      .subtractInPlace(right.scale(Math.sin(COUCH.across)))
      .addInPlace(new Vector3(0, -Math.sin(COUCH.dip), 0)).normalize();
    // [S] level lance (333; renaissance.jouster.png: both lances near level, across the horse's neck into the foe at chest height, never dipped down onto
    // him). On his man the lance only turns: its heading swings from the rest line to the man's (yaw), its pitch stays COUCH.dip whatever his height or
    // crouch, so a downed or stooping man no longer drags it steep through the caparison (never
    // turned back behind the fist), eased on and off
    this._lanceAimTimer -= this._lastDt;
    this._lanceOn += ((this._lanceAimTimer > 0 ? 1 : 0) - this._lanceOn) * Math.min(1, this._lastDt * LANCE_AIM.rate);
    if (this._lanceOn > 0.01) {
      const at = this._lanceAim.subtract(b.rightHand.getAbsolutePosition());
      const flat = Math.hypot(at.x, at.z);
      if (flat > 0.3 && at.x * fwd.x + at.z * fwd.z > 0) {
        const dip = COUCH.dip;
        const onto = new Vector3(at.x / flat * Math.cos(dip), -Math.sin(dip), at.z / flat * Math.cos(dip));
        axis.scaleInPlace(1 - this._lanceOn).addInPlace(onto.scale(this._lanceOn)).normalize();
      }
    }
    const x = Vector3.Cross(Vector3.Up(), axis).normalize();
    const z = Vector3.Cross(x, axis).normalize();
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, axis, z, world);
    const parentRot = new Quaternion();
    b.rightHand.getWorldMatrix().decompose(undefined, parentRot);
    const parent = Matrix.Identity();
    parentRot.toRotationMatrix(parent);
    lance.node.rotationQuaternion = Quaternion.Slerp(lance.rest, Quaternion.FromRotationMatrix(world.multiply(parent.transpose())), w);
  }

  /**
   * [S] heater held up (334; renaissance.jouster.red.png: a torso-sized yellow heater upright on the off arm, its point down beside the horse's neck, its
   * face out to his off side). The heater no longer rides the off hand at whatever angle the arm leaves it (it leant back ~30 deg with its point sunk behind
   * the horse's back, edge-on from the side): the off fist is solved onto a point HEATER_HOLD.fwd ahead of the off shoulder, .side out and .drop down, and
   * the board is stood in the world, its top up and its face turned HEATER_HOLD.turn from his off side toward his front. Limp or dead it rides the hand.
   */
  private _heater: { node: TransformNode; rest: Quaternion } | null | undefined = undefined;
  private _holdHeater(): void {
    if (this._heater === undefined) {
      const node = this._body.leftHand.getChildren().find((n): n is TransformNode => n.name === "hshield");
      this._heater = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z) } : null;
    }
    if (!this._heater || this.walkStyle === "quadruped") return;
    const k = this._state === AnimState.Dead ? 0 : 1 - Math.min(1, this._limp);
    if (k <= 0.01) {
      this._heater.node.rotationQuaternion = null;
      return;
    }
    const b = this._body;
    for (const n of [b.root, b.hip, b.torso, b.leftShoulder, b.rightShoulder]) n.computeWorldMatrix(true);
    const rootM = b.root.getWorldMatrix();
    const flat = (v: Vector3): Vector3 => { v.y = 0; return v.lengthSquared() < 1e-6 ? v.set(0, 0, 1) : v.normalize(); };
    const fwd = flat(Vector3.TransformNormal(new Vector3(0, 0, 1), rootM));
    const side = flat(Vector3.TransformNormal(new Vector3(Math.sign(b.leftShoulder.position.x) || -1, 0, 0), rootM));
    const height = b.metrics.overallHeight * b.root.scaling.y;
    const point = b.leftShoulder.getAbsolutePosition().add(fwd.scale(HEATER_HOLD.fwd * height)).addInPlace(side.scale(HEATER_HOLD.side * height))
      .addInPlace(new Vector3(0, -HEATER_HOLD.drop * height, 0));
    this._offArmTo(point, k, 2);
    for (const n of [b.leftShoulder, b.leftElbow, b.leftHand]) n.computeWorldMatrix(true);
    const y = Vector3.Up();
    const z = side.scale(Math.cos(HEATER_HOLD.turn)).addInPlace(fwd.scale(Math.sin(HEATER_HOLD.turn))).normalize();
    const x = Vector3.Cross(y, z).normalize();
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, y, z, world);
    const handRot = new Quaternion();
    b.leftHand.getWorldMatrix().decompose(undefined, handRot);
    const hand = Matrix.Identity();
    handRot.toRotationMatrix(hand);
    this._heater.node.rotationQuaternion = Quaternion.Slerp(this._heater.rest, Quaternion.FromRotationMatrix(world.multiply(hand.transpose())), k);
  }

  // The painter's palette arm (see PALETTE_HOLD and PALETTE_OUT): held out beside him over whatever the pose layers made of the off arm
  private _palette: { node: TransformNode; rest: Quaternion } | null | undefined = undefined;
  private _holdPalette(): void {
    if (this._palette === undefined) {
      const node = this._body.leftHand.getChildren().find((n): n is TransformNode => n.name === "palette");
      this._palette = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z) } : null;
    }
    if (!this._palette || this._state === AnimState.Dead || this.walkStyle === "quadruped") return;
    const k = 1 - Math.min(1, this._limp);
    if (k <= 0.01) {
      this._palette.node.rotationQuaternion = null;
      return;
    }
    const b = this._body;
    const sway = Math.sin((this._time + this._wobblePhase) * 2.1) * PALETTE_HOLD.sway;
    // The arm's rest first (the solve below starts from it), then the hand solved onto a point beside the off shoulder, set off the body's own frame and
    // not the trunk's, so the swing's twist does not carry the board round in front of him
    b.leftShoulder.rotation.x += (PALETTE_HOLD.raise + sway - b.leftShoulder.rotation.x) * k;
    b.leftShoulder.rotation.z += (PALETTE_HOLD.out - b.leftShoulder.rotation.z) * k;
    b.leftElbow.rotation.x += (PALETTE_HOLD.elbow - sway - b.leftElbow.rotation.x) * k;
    for (const n of [b.root, b.hip, b.torso, b.leftShoulder, b.rightShoulder]) n.computeWorldMatrix(true);
    const rootM = b.root.getWorldMatrix();
    const flat = (v: Vector3): Vector3 => { v.y = 0; return v.lengthSquared() < 1e-6 ? v.set(0, 0, 1) : v.normalize(); };
    const fwd = flat(Vector3.TransformNormal(new Vector3(0, 0, 1), rootM));
    const side = flat(Vector3.TransformNormal(new Vector3(Math.sign(b.leftShoulder.position.x) || -1, 0, 0), rootM));
    const height = b.metrics.overallHeight * b.root.scaling.y;
    const shoulder = b.leftShoulder.getAbsolutePosition();
    const point = shoulder.add(side.scale(PALETTE_OUT.side * height)).addInPlace(fwd.scale(PALETTE_OUT.fwd * height))
      .addInPlace(new Vector3(0, -PALETTE_OUT.drop * height + sway * 0.05, 0));
    this._offArmTo(point, k, 2);
    // The board stood in the world: face (its +z) up and tipped PALETTE_OUT.tip toward his front, its long way (+x) out from him, the thumb notch at the hand
    for (const n of [b.leftShoulder, b.leftElbow, b.leftHand]) n.computeWorldMatrix(true);
    const z = Vector3.Up().scale(Math.cos(PALETTE_OUT.tip)).addInPlace(fwd.scale(Math.sin(PALETTE_OUT.tip)));
    const x = side.subtract(z.scale(Vector3.Dot(side, z))).normalize();
    const y = Vector3.Cross(z, x).normalize();
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, y, z, world);
    const handRot = new Quaternion();
    b.leftHand.getWorldMatrix().decompose(undefined, handRot);
    const hand = Matrix.Identity();
    handRot.toRotationMatrix(hand);
    const local = Quaternion.FromRotationMatrix(world.multiply(hand.transpose()));
    this._palette.node.rotationQuaternion = Quaternion.Slerp(this._palette.rest, local, k);
  }

  // The board strapped to the shield hand, if this body carries one big enough to stand behind (a buckler is not). Looked up on first use: props go on after the animator is made.
  private _shield: TransformNode | null | undefined = undefined;
  private _shieldBoard(): TransformNode | null {
    if (this._shield === undefined) {
      this._shield = this._body.leftHand.getChildren().find((n): n is TransformNode => /shield$/.test(n.name)) ?? null;
    }
    return this._shield;
  }

  /**
   * In contact the shield stops riding the hand: it turns in the grip until it stands upright with its face square to the way the body is heading,
   * whatever the arm, the torso and the body's lean are doing under it, so a rank of them is one wall of boards and not boards pointing every way.
   * Runs after every pose overlay has written the joints; out of contact, limp or dead, the board goes back to hanging from the hand.
   */
  private _squareShield(): void {
    const shield = this._shieldBoard();
    if (!shield) return;
    // A board knocked off his face by a heavy blow leaves the wall and hangs from his flung arm until he has it up again
    const up = this._state === AnimState.Dead ? 0 : (1 - Math.min(1, this._limp)) * (1 - this._boardOffWeight());
    // A front-rank man in a wall holds his board on the wall's plane from the moment he is slotted, closing or in contact, not only while he shoves
    const lap = this._boardLap * up;
    const k = Math.max(this._shove * up, lap);
    const rest = (this._boardRest ??= shield.position.clone());
    if (k <= 0.01) {
      if (shield.rotationQuaternion) {
        shield.rotationQuaternion = null;
        shield.position.copyFrom(rest);
      }
      return;
    }
    const hand = this._body.leftHand;
    hand.computeWorldMatrix(true);
    // Square to the wall's heading, give or take the man's own turn, tilt and twist of it in his grip
    const br = (this._bracePose ??= this._buildBracePose());
    // ...and of the shoulders behind it: it turns with the lead shoulder and leans with the trunk
    const held = Quaternion.RotationYawPitchRoll(this._body.root.rotation.y + br.boardYaw + br.lead * br.twist * 0.7, br.boardTilt + br.pitch * 0.5, br.boardRoll);
    let world = held;
    if (lap > 0.01) world = Quaternion.Slerp(held, this._lapBoard(shield, hand, rest, br.boardRoll, lap), lap);
    else shield.position.copyFrom(rest);
    const square = Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(world);
    shield.rotationQuaternion = Quaternion.Slerp(Quaternion.Identity(), square, Math.min(1, k * 1.5));
  }

  /**
   * A board seated on its rank's strip is held, not floated: the shield arm is turned at the shoulder to point straight at the board's seat, elbow out straight, by
   * `lap`, so the fist is at the back of the board and the arm is hidden behind it instead of reaching past the rim with an empty mitt. Leaves the hand's world matrix
   * current for seating the board on it.
   */
  private _gripBoard(seat: Vector3, lap: number): void {
    const b = this._body;
    const shoulder = b.leftShoulder;
    const parent = shoulder.parent as TransformNode | null;
    if (!parent) return;
    parent.computeWorldMatrix(true);
    shoulder.computeWorldMatrix(true);
    const reach = Vector3.TransformNormal(seat.subtract(shoulder.getAbsolutePosition()), Matrix.Invert(parent.getWorldMatrix()));
    if (reach.lengthSquared() < 1e-6) return;
    const aim = Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), reach.normalize(), new Quaternion()).toEulerAngles();
    shoulder.rotation.x += (aim.x - shoulder.rotation.x) * lap;
    shoulder.rotation.y += (aim.y - shoulder.rotation.y) * lap;
    shoulder.rotation.z += (aim.z - shoulder.rotation.z) * lap;
    b.leftElbow.rotation.scaleInPlace(1 - lap);
    shoulder.computeWorldMatrix(true);
    b.leftElbow.computeWorldMatrix(true);
    b.leftHand.computeWorldMatrix(true);
  }

  /**
   * A front-rank board in a wall does not stand where his hand happens to be: it stands on the wall's plane, BOARD_PLANE_REACH ahead of the rank's line, on his own
   * line across it and at his own height, turned BOARD_LAP off square to the wall plus his own turn, lean, height and depth (WALL_BOARD_*). Boards about 0.8 m across on slots
   * 0.54 apart, all turned one way, lap rim over rim: each board's one rim stands in front of its neighbour's, into one scaled surface (tabs_screenshot_06). Moves the board
   * there by `lap` and returns the world attitude it is turned to.
   */
  private _lapBoard(shield: TransformNode, hand: TransformNode, rest: Vector3, roll: number, lap: number): Quaternion {
    const heading = this._wallHeading;
    const fx = Math.sin(heading);
    const fz = Math.cos(heading);
    const strapped = Vector3.TransformCoordinates(rest, hand.getWorldMatrix());
    const root = this._body.root.absolutePosition;
    const scale = this._body.root.absoluteScaling.y || 1;
    if (this._boardSlot && this._boardPlane !== null) {
      // On a rank's strip (see the spec at SimulationSystem._holdShieldFrames): on his slot across the wall, BOARD_PLANE_REACH ahead of the rank's line, at
      // BOARD_SEAT_HEIGHT of his stature, square to the heading plus BOARD_LAP, whatever his arms and trunk are doing
      if (this._boardSeat === null) {
        this._body.neck.computeWorldMatrix(true);
        this._boardSeat = (this._body.neck.getAbsolutePosition().y - root.y) * BOARD_SEAT_HEIGHT;
      }
      const slotSide = this._boardSlot.z * fx - this._boardSlot.x * fz;
      const br = this._bracePose;
      const depth = this._boardPlane + BOARD_PLANE_REACH * scale + (br ? br.wallDepth * scale : 0);
      const lift = br ? br.wallStep * scale : 0;
      const seat = new Vector3(depth * fx - slotSide * fz, root.y + this._boardSeat + lift, depth * fz + slotSide * fx);
      Vector3.LerpToRef(strapped, seat, lap, seat);
      // His fist goes to the board, not the board off his fist: the shield arm is reached straight out at the back of the board (see _gripBoard)
      this._gripBoard(new Vector3(seat.x - fx * BOARD_GRIP_BACK * scale, seat.y, seat.z - fz * BOARD_GRIP_BACK * scale), lap);
      shield.position.copyFrom(Vector3.TransformCoordinates(seat, Matrix.Invert(hand.getWorldMatrix())));
      // His board's own attitude on the strip (the spec at WALL_BOARD_*): his standing lean, back or forward, to which the press adds half BOARD_PRESS_TILT and a third
      // of his trunk pitch and a rock on his weight-shift beat; his own turn on top of BOARD_LAP, and his roll. Neighbouring boards differ by tenths of a radian, so
      // rims stand proud of one another at different angles into one battered surface (tabs_screenshot_06), not a row of identical tiles.
      const press = Math.min(1, this._shove);
      const lean = br ? br.wallLean + (BOARD_PRESS_TILT * 0.5 + br.pitch * 0.33) * press + Math.sin(this._time * br.shiftRate + br.shiftPhase) * 0.06 : BOARD_PRESS_TILT * press;
      return Quaternion.RotationYawPitchRoll(heading + BOARD_LAP + (br?.wallTurn ?? 0), lean, br?.boardRoll ?? 0);
    }
    // Out along the heading to the wall's plane from where the board is held, so its height and its place across the wall stay his own; and a hand's width toward his middle.
    // Pushed back off the line he keeps it there as far as his arm will carry it, BOARD_PLANE_MAX_OUT ahead of where he holds it
    const out = Math.max(-0.2 * scale, Math.min(BOARD_PLANE_MAX_OUT * scale, (this._boardPlane ?? 0) + BOARD_PLANE_REACH * scale - (strapped.x * fx + strapped.z * fz)));
    const across = (root.z * fx - root.x * fz) - (strapped.z * fx - strapped.x * fz);
    const target = new Vector3(strapped.x + fx * out - fz * across * 0.6, strapped.y, strapped.z + fz * out + fx * across * 0.6);
    Vector3.LerpToRef(strapped, target, lap, target);
    const local = Vector3.TransformCoordinates(target, Matrix.Invert(hand.getWorldMatrix()));
    shield.position.copyFrom(local);
    return Quaternion.RotationYawPitchRoll(heading + BOARD_LAP, 0.04, roll * 0.5);
  }

  /**
   * On the march the weapon does not ride the hand at the one angle it was strapped on with: it turns in the fist to the man's own carry attitude, whatever the arm is
   * doing under it, so a line of clubs is clubs on shoulders, stood up, slanted across chests and trailed, and not one club repeated level and parallel. The weapon's
   * middle sits as far along it from the fist as it was strapped on, and its head dips with the load's bob on each footfall. In contact, in a swing, limp or dead it
   * eases back to hanging from the hand as it was built.
   */
  /**
   * The stoner's boulder in both hands (see BOULDER_CARRY): the last arm layer, over the walk, the idle and the overhand throw. Carrying, both arms reach forward
   * and in round the rock at the belly; in a throw, the heave (BOULDER_DIP, then BOULDER_HEAVE) on the throw's own clock. The rock is set between the two
   * hands every frame, so it sits in both mitts whatever the arms are doing. With the hand empty after the let-go the arms still finish the heave.
   */
  private _carryBoulder(): void {
    const b = this._body;
    // The swordcaster's lockbox (units/spooky.swordcaster) rides the same two-hand carry at the belly
    const rock = b.rightHand.getChildren().find((n): n is TransformNode => n.name === "boulder" || n.name === "lockbox");
    if (!rock || this._state === AnimState.Dead) return;
    const w = 1 - Math.min(1, this._limp);
    if (w <= 0) return;
    let arm: { raise: number; inward: number; elbow: number } = BOULDER_CARRY;
    if (this._state === AnimState.Attacking && this._attackMotion === "throw") {
      const progress = Math.min(this._attackTimer / this._attackDuration, 1);
      const commit = this._resolveReleasePoint(0.45);
      const mix = (a: number, c: number, t: number) => a + (c - a) * t;
      let dip = 0;
      let heave = 0;
      if (progress < commit) {
        const u = progress / Math.max(commit, 0.001);
        dip = u * (2 - u);
      } else {
        const s = (progress - commit) / Math.max(1 - commit, 0.001);
        const v = Math.min(1, s / THROW_SWING);
        const f = v * v * (3 - 2 * v);
        const r = s > THROW_SWING ? (s - THROW_SWING) / (1 - THROW_SWING) : 0;
        const back = 1 - r * r * (3 - 2 * r);
        dip = (1 - f) * back;
        heave = f * back;
      }
      const from = { raise: mix(BOULDER_CARRY.raise, BOULDER_DIP.raise, dip), inward: mix(BOULDER_CARRY.inward, BOULDER_DIP.inward, dip), elbow: mix(BOULDER_CARRY.elbow, BOULDER_DIP.elbow, dip) };
      arm = { raise: mix(from.raise, BOULDER_HEAVE.raise, heave), inward: mix(from.inward, BOULDER_HEAVE.inward, heave), elbow: mix(from.elbow, BOULDER_HEAVE.elbow, heave) };
      // Folded over the rock on bent knees in the dip, up and leant back in the heave
      b.torso.rotation.x += (BOULDER_DIP.trunk * dip + BOULDER_HEAVE.trunk * heave - b.torso.rotation.x) * w;
      for (const [hip, knee] of [[b.leftHip, b.leftKnee], [b.rightHip, b.rightKnee]]) {
        hip.rotation.x += (BOULDER_DIP.thigh * dip - hip.rotation.x) * w;
        knee.rotation.x += (BOULDER_DIP.knee * dip - knee.rotation.x) * w;
      }
    }
    // The chest: elbows out at his sides, forearms bent forward and swung in round its ends at the navel (LOCKBOX_CARRY), through every state
    const chest = rock.name === "lockbox";
    if (chest) arm = { raise: LOCKBOX_CARRY.raise, inward: -LOCKBOX_CARRY.out, elbow: LOCKBOX_CARRY.elbow };
    const turn = chest ? LOCKBOX_CARRY.turn : 0;
    // Both arms alike, each turned in toward the middle (+z is out for the right arm, -z for the left)
    b.rightShoulder.rotation.x += (arm.raise - b.rightShoulder.rotation.x) * w;
    b.leftShoulder.rotation.x += (arm.raise - b.leftShoulder.rotation.x) * w;
    b.rightShoulder.rotation.z += (-arm.inward - b.rightShoulder.rotation.z) * w;
    b.leftShoulder.rotation.z += (arm.inward - b.leftShoulder.rotation.z) * w;
    b.rightShoulder.rotation.y += (-turn - b.rightShoulder.rotation.y) * w;
    b.leftShoulder.rotation.y += (turn - b.leftShoulder.rotation.y) * w;
    b.rightElbow.rotation.x += (arm.elbow - b.rightElbow.rotation.x) * w;
    b.leftElbow.rotation.x += (arm.elbow - b.leftElbow.rotation.x) * w;
    // The chest is fixed to his body, not to his hands (lockbox-body-anchor): its middle at the navel on his centreline, and each arm reaches to its own end
    const anchor = chest ? this._lockboxAnchor(rock, w) : null;
    if (!rock.isEnabled()) return;
    // The rock between the two mitts: bring both chains up to this frame and set its middle on their midpoint, in the right hand's space
    const settle = (): void => {
      for (const hand of [b.rightHand, b.leftHand]) {
        const chain: TransformNode[] = [];
        for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) chain.unshift(n);
        for (const n of chain) n.computeWorldMatrix(true);
      }
    };
    settle();
    if (!chest && rock instanceof Mesh) {
      // The hands onto the rock's sides (tribal.stoner.blue.png: a mitt on each side of the chunk, not two fists buried in it): the mitts are spread or closed
      // about the shoulders (rotation.z, each its own way) until they stand a rock's width apart, BOULDER_HOLD of it, by one solve a frame on the arms' length
      const ext = rock.getBoundingInfo().boundingBox.extendSize;
      const span = (ext.x + ext.y + ext.z) * (2 / 3) * rock.absoluteScaling.x * BOULDER_HOLD;
      const r = b.rightHand.getAbsolutePosition(), l = b.leftHand.getAbsolutePosition();
      const reach = (Vector3.Distance(r, b.rightShoulder.getAbsolutePosition()) + Vector3.Distance(l, b.leftShoulder.getAbsolutePosition())) * 0.5;
      const spread = Math.max(-0.5, Math.min(0.5, (span - Vector3.Distance(r, l)) / Math.max(0.05, 2 * reach))) * w;
      b.rightShoulder.rotation.z += spread;
      b.leftShoulder.rotation.z -= spread;
      settle();
    }
    const mid = anchor ?? Vector3.Center(b.rightHand.getAbsolutePosition(), b.leftHand.getAbsolutePosition());
    rock.position.copyFrom(Vector3.TransformCoordinates(mid, Matrix.Invert(b.rightHand.getWorldMatrix())));
    if (rock.name === "lockbox") {
      // A chest is held square across him, lid up and keyhole out, whatever the wrist's turn: its rotation in the hand is the torso's world turn less the hand's
      const handQ = new Quaternion();
      const torsoQ = new Quaternion();
      b.rightHand.getWorldMatrix().decompose(undefined, handQ);
      b.torso.getWorldMatrix().decompose(undefined, torsoQ);
      const local = Matrix.Identity();
      torsoQ.toRotationMatrix(local);
      const handM = Matrix.Identity();
      handQ.toRotationMatrix(handM);
      rock.rotationQuaternion = Quaternion.FromRotationMatrix(local.multiply(handM.transpose()));
    }
  }

  /**
   * The swordcaster's ring of standing swords ([R] swordcaster-blade-ring, built in propBuilder): each blade bobs on its own slow beat, a blade lifted out by
   * a cast (launchRingSword) comes back in its place once its refill time has run, and the whole ring is gone with him when he dies.
   */
  private _tendSwordRing(dt: number): void {
    if (this._ring === undefined) this._ring = this._body.root.getChildren().find((n): n is TransformNode => n.name === "swordRing") ?? null;
    const ring = this._ring;
    if (!ring) return;
    const alive = this._state !== AnimState.Dead && this._limp < 0.5;
    if (ring.isEnabled() !== alive) ring.setEnabled(alive);
    if (!alive) return;
    for (const slot of ring.getChildren() as TransformNode[]) {
      const m = slot.metadata as { restY: number; phase: number; refillIn: number };
      if (!slot.isEnabled(false)) {
        m.refillIn -= dt;
        if (m.refillIn <= 0) slot.setEnabled(true);
      }
      slot.position.y = m.restY + this._body.metrics.overallHeight * SWORD_RING_BOB.height * Math.sin(this._time * SWORD_RING_BOB.rate + m.phase);
    }
  }
  private _ring: TransformNode | null | undefined = undefined;

  /**
   * The lockbox's world middle (lockbox-body-anchor): on his centreline in the torso's own frame, LOCKBOX_NAVEL of his shoulder height up the trunk and
   * LOCKBOX_FRONT of it out before the belly, so it never rides off to the side however the arms fall. Each arm is then reached onto its own end of the box
   * (LOCKBOX_SIZE.wide across, the wrist LOCKBOX_GRIP of the shoulder height out past the end): shoulder raise, shoulder turn and elbow bend solved together
   * (damped least squares on the live chain), the elbows kept out at LOCKBOX_CARRY out. The solved pose is blended in by w.
   */
  private _lockboxAnchor(box: TransformNode, w: number): Vector3 {
    const b = this._body;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.torso; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const height = Math.abs(b.rightShoulder.position.y);
    const torsoM = b.torso.getWorldMatrix();
    const mid = Vector3.TransformCoordinates(new Vector3(0, height * LOCKBOX_NAVEL, height * LOCKBOX_FRONT), torsoM);
    // Half its width across him, off its own mesh
    const shell = box as Mesh;
    const half = typeof shell.getBoundingInfo === "function" ? shell.getBoundingInfo().boundingBox.extendSize.x * Math.abs(box.absoluteScaling.x) : 0.13 * height;
    const across = Vector3.TransformNormal(new Vector3(1, 0, 0), torsoM).normalize();
    const mitt = (this._body.metrics.hand?.width ?? 0.06) * Math.max(0.001, b.root.absoluteScaling.y);
    for (const [shoulder, elbow, hand, side] of [[b.rightShoulder, b.rightElbow, b.rightHand, 1], [b.leftShoulder, b.leftElbow, b.leftHand, -1]] as const) {
      const sx = Math.sign(shoulder.position.x) || side;
      const target = mid.add(across.scale(sx * (half + mitt * LOCKBOX_PALM_OUT)));
      const keep = [shoulder.rotation.x, shoulder.rotation.y, elbow.rotation.x];
      const p = [LOCKBOX_CARRY.raise, -sx * LOCKBOX_CARRY.turn, LOCKBOX_CARRY.elbow];
      // The palm: the mitt mesh's middle, hung below the wrist joint
      const palm = hand.getChildMeshes(true).find((m) => /HandM$/.test(m.name));
      const at = (q: number[]) => {
        shoulder.rotation.x = q[0];
        shoulder.rotation.y = q[1];
        elbow.rotation.x = q[2];
        shoulder.computeWorldMatrix(true);
        elbow.computeWorldMatrix(true);
        hand.computeWorldMatrix(true);
        return palm ? Vector3.TransformCoordinates(palm.position, hand.getWorldMatrix()) : hand.getAbsolutePosition().clone();
      };
      for (let it = 0; it < LOCKBOX_IK_STEPS; it++) {
        const f = at(p);
        const e = target.subtract(f);
        if (e.length() < half * 0.02) break;
        // Jacobian by finite differences, columns d(hand)/d(param)
        const J = [0, 1, 2].map((i) => {
          const q = p.slice();
          q[i] += 1e-3;
          return at(q).subtract(f).scale(1e3);
        });
        // (J^T J + l I) d = J^T e, a 3x3 solve
        const A = J.map((a) => J.map((c) => Vector3.Dot(a, c)));
        const damp = 0.01 * (A[0][0] + A[1][1] + A[2][2]);
        for (let i = 0; i < 3; i++) A[i][i] += damp;
        const g = J.map((a) => Vector3.Dot(a, e));
        const det = (m: number[][]) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        const D = det(A);
        if (Math.abs(D) < 1e-12) break;
        for (let i = 0; i < 3; i++) {
          const Ai = A.map((row, r) => row.map((v, c) => (c === i ? g[r] : v)));
          p[i] += det(Ai) / D;
        }
        // The elbow only folds forward, and never past a tight fold
        p[2] = Math.max(-2.6, Math.min(-0.1, p[2]));
      }
      shoulder.rotation.x = keep[0] + (p[0] - keep[0]) * w;
      shoulder.rotation.y = keep[1] + (p[1] - keep[1]) * w;
      elbow.rotation.x = keep[2] + (p[2] - keep[2]) * w;
    }
    return mid;
  }

  /**
   * Where a landed club rests on a man (press-landed-contact): the world point its shaft lies across, so it stops on him rather than running on into the turf.
   * His crown when the line from the fist falls onto it at least CONTACT_MIN_FALL below level; else (a crown at or over the fist) the top of his board, on his
   * near face: PRESS_BOARD_LINE of his height under the crown, CONTACT_FRONT of his height out of his axis toward the striker. The mark's chain is brought up here.
   */
  private _contactOn(mark: TransformNode, hand: Vector3, solved = false): Vector3 {
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = mark; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const scale = Math.max(0.001, this._body.rightHand.absoluteScaling.y);
    const crown = this._crownOf(mark).add(new Vector3(0, BLOW_CROWN * scale, 0));
    const across = Math.hypot(crown.x - hand.x, crown.z - hand.z);
    const onCrown = hand.y - crown.y >= Math.max(0.001, across) * Math.tan(CONTACT_MIN_FALL);
    // press-club-lands-on-board: the club's HEAD is pinned on him, not only its line. A crown a full weapon's length off takes it; a nearer man would let a
    // head laid along that line run on past him into the turf, so it stops on his near face where the shaft, one reach long from the fist, meets it.
    const reach = this._weaponReach() * scale;
    // A blow whose arm is solved onto the point (_aimBlow) takes the crown however near he stands: the fist is brought back a reach from it
    if (onCrown && (solved || Vector3.Distance(hand, crown) >= reach)) return crown;
    // His height over the ground the striker stands on (the field is near flat where men press)
    const tall = Math.max(0.001, crown.y - this._body.root.getAbsolutePosition().y);
    // A solved blow under a crown at or over the fist comes down across the top of his shoulders, on his axis, PRESS_BOARD_LINE of his height under the
    // crown: his near face lay under the fist, and the head slid down it to his belt (bench: two men both leaping into their blows, neither fist cleared
    // the other's helm); from a strike stand-off the arm solved onto his axis lays the club ~30 deg down across his shoulders
    if (solved) return new Vector3(crown.x, crown.y - tall * PRESS_BOARD_LINE, crown.z);
    const back = new Vector3(hand.x - crown.x, 0, hand.z - crown.z);
    if (back.lengthSquared() < 1e-6) back.set(0, 0, -1);
    back.normalize();
    const face = crown.add(back.scale(CONTACT_FRONT * tall));
    // Down his near face from the crown (or, a crown at or over the fist, from his board top) to where the head lands at full reach, never under CONTACT_LOWEST
    const flat = Math.hypot(face.x - hand.x, face.z - hand.z);
    const drop = Math.sqrt(Math.max(0, reach * reach - flat * flat));
    const top = onCrown ? crown.y : crown.y - tall * PRESS_BOARD_LINE;
    face.y = Math.max(crown.y - tall * CONTACT_LOWEST, Math.min(top, hand.y - drop));
    return face;
  }

  /** The landed press club's arc from straight up, and its exact way in his yaw frame (_pressTip): the shaft laid from the fist across _contactOn. */
  private _pressDownArc(mark: TransformNode, hand: Vector3): number {
    const dir = this._contactOn(mark, hand).subtract(hand);
    if (dir.lengthSquared() < 1e-6) dir.set(0, 0, 1);
    const local = Vector3.TransformNormal(dir.normalize(), Matrix.RotationY(-this._body.root.rotation.y)).normalize();
    // Never rising off him: at least CONTACT_MIN_FALL below level
    const flat = Math.hypot(local.x, local.z);
    if (local.y > -flat * Math.tan(CONTACT_MIN_FALL)) {
      local.y = -Math.max(0.001, flat) * Math.tan(CONTACT_MIN_FALL);
      local.normalize();
    }
    this._pressTip.copyFrom(local);
    return Math.atan2(Math.hypot(local.z, local.x), local.y);
  }
  private _pressTip = new Vector3(0, 0, 1);

  private _carryProp(dt: number): void {
    const ready = this._carry?.ready;
    const weapon = this._carry?.weapon ?? ready;
    if (!weapon?.prop) return;
    const { node, rest, grip, spin, seat, plant } = weapon.prop;
    // A caster's rod stays in its hold on the march and through the cast. A bow leaves its ready hold to be shot, but not the fist's keeping: while the bow arm is up it is stood upright.
    const shooting = weapon === ready && ready?.cast !== true && this._state === AnimState.Attacking && this._attackMotion === "bow_draw_release" ? this._bowUp : 0;
    const kept = this._state === AnimState.Idle || (this._state === AnimState.Walking && weapon !== ready) || (ready?.cast === true && this._state !== AnimState.Dead) || shooting > 0;
    const club = weapon === this._carry?.weapon && this._state !== AnimState.Dead ? this._clubHold * (1 - Math.min(1, this._limp)) : 0;
    // The harvester's low scythe stays in his low carry pressed or not (SCYTHE_SWEEP): let go to the fist's strapped angle it stood up over his head
    const lowHeld = this._lowScythe && this._state !== AnimState.Dead ? 1 - Math.min(1, this._limp) : 0;
    const marching = Math.max(club, lowHeld, kept ? (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp)) : 0);
    this._carryTurn = this._state === AnimState.Dead ? 0 : this._carryTurn + (marching - this._carryTurn) * Math.min(1, dt * 10);
    // A blow does not wait on the carry's easing: the head is on its arc from the first frame of the swing
    if (club > this._carryTurn) this._carryTurn = club;
    const k = this._carryTurn;
    if (k <= 0.01) {
      if (node.rotationQuaternion) {
        node.rotationQuaternion = null;
        // (the quaternion has zeroed the Euler turn: let go, the prop runs up the fist +y) a two-fisted sword keeps that line through the fist (FISTS_ON_GRIP)
        if (this._swordFists > 0) node.position.set(0, grip.length(), 0);
        else node.position.copyFrom(grip);
      }
      return;
    }
    const hand = this._body.rightHand;
    hand.computeWorldMatrix(true);
    const tip = new Vector3(weapon.tip.x, weapon.tip.y - this._carryDip * 1.5, weapon.tip.z + this._castReach).normalize();
    // Swinging or cocked: the head of the weapon is on its arc over the man, a touch out to his weapon side
    if (club > 0.01) {
      let arc = this._clubArc;
      // An in-reach press club landed: from the cock back over the shoulder, up over the top and down onto the man's board line (club-cocked-in-press)
      const pressed = this._pressAim();
      const landed = this._pressLand > 0.001 && pressed ? this._pressLand : 0;
      if (landed > 0 && pressed) arc += (this._pressDownArc(pressed, hand.getAbsolutePosition()) - arc) * landed;
      const swung = this._sweepTip ?? new Vector3(0.12 * (Math.sign(this._body.rightShoulder.position.x) || 1), Math.cos(arc), Math.sin(arc));
      Vector3.LerpToRef(tip, swung, Math.min(1, club), tip).normalize();
      // ...and, as it comes down, swung round onto the man wherever he stands, the shaft resting across his crown or board top (press-landed-contact)
      if (landed > 0) Vector3.LerpToRef(tip, this._pressTip, landed * landed * Math.min(1, club), tip).normalize();
    }
    // Coming down on a man (see _aimBlow): the head goes onto him, wherever he stands
    if (this._aimWeight > 0.01 && weapon === this._carry?.weapon) Vector3.LerpToRef(tip, this._aimTip, this._aimWeight, tip).normalize();
    // Driven at the enemy (see _animateCast): the staff is laid level along the thrust arm, head at him, and held there while its missile flies
    if (this._castLevel > 0.01 && weapon === ready) Vector3.LerpToRef(tip, this._castTip, this._castLevel, tip).normalize();
    // Shooting: upright in the fist, canted a little toward the mark
    if (shooting > 0) Vector3.LerpToRef(tip, new Vector3(0, 1, 0.12), shooting, tip).normalize();
    const attitude = Quaternion.RotationYawPitchRoll(this._body.root.rotation.y, 0, 0).multiply(Quaternion.FromUnitVectorsToRef(Vector3.UpReadOnly, tip, new Quaternion()));
    // The harvester's sweep lays the crescent flat as it cuts (SCYTHE_SWEEP.roll about the snath)
    const rolled = spin && this._sweepTip ? spin.multiply(Quaternion.RotationYawPitchRoll(SCYTHE_SWEEP.roll * (Math.sign(this._body.rightShoulder.position.x) || 1) * Math.min(1, club), 0, 0)) : spin;
    const turn = Quaternion.Slerp(rest, Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(rolled ? attitude.multiply(rolled) : attitude), k);
    node.rotationQuaternion = turn;
    const held = seat ? seat.clone() : new Vector3(0, grip.length(), 0);
    if (plant) {
      // Stood on the ground: the staff's middle sits as far above the fist as puts its butt at his feet, short of the fist running off either end of it
      const fist = (hand.absolutePosition.y - this._body.root.absolutePosition.y) / Math.max(0.001, hand.absoluteScaling.y);
      const stood = Math.max(-plant * 0.7, Math.min(plant * 0.7, plant - fist));
      held.y += (stood - held.y) * (1 - this._castLift);
    }
    held.rotateByQuaternionToRef(turn, held);
    // A two-fisted sword stays on its line through the fist while it turns in (FISTS_ON_GRIP); a lerp of the offset would swing it off the fist part way
    if (this._swordFists > 0) node.position.copyFrom(new Vector3(0, grip.length(), 0).rotateByQuaternionToRef(turn, new Vector3()));
    else Vector3.LerpToRef(grip, held, k, node.position);
  }

  // The scarecrow's T-pose (TPOSE): whether this body takes it (a crow in the weapon fist), its perched crows, and how far in it he stands
  private _tPose: { perches: TransformNode[] } | null | undefined = undefined;
  private _tPoseW = 1;
  // How far out from hanging his arms stand (rad), and the reload the last volley started: seconds left, seconds since it left
  private _tPoseOut = Math.PI / 2 - TPOSE.lift;
  private _reloadLeft = 0;
  private _sinceVolley = 0;
  /** An attack just went off and the next waits `seconds`: the scarecrow drops to his A-pose for that reload (TPOSE). */
  noteReload(seconds: number): void {
    this._reloadLeft = seconds;
    this._sinceVolley = 0;
  }
  // The scarecrow's hover (HOVER): how far up he is now (0-1), the beat's clock, and his wings with their spread
  private _hoverW = 0;
  private _hoverT = 0;
  private _wings: { node: TransformNode; spread: number }[] = [];
  private _holdTPose(dt: number): void {
    const b = this._body;
    if (this._tPose === undefined) {
      const on = b.rightHand.getChildren().some((n) => n.name === "crowHeldBody");
      this._tPose = on ? { perches: [b.leftShoulder, b.rightShoulder].flatMap((sh) => sh.getChildren().filter((n): n is TransformNode => n.name === "perchedCrow")) } : null;
      if (on) this._wings = b.torso.getChildren().filter((n): n is TransformNode => n.name === "wingRoot").map((node) => ({ node, spread: node.rotation.z }));
    }
    if (!this._tPose) return;
    this._hover(dt);
    // He holds his arms out through the attack too: only death lets them go
    const posed = this._state !== AnimState.Dead;
    this._tPoseW += ((posed ? 1 : 0) - this._tPoseW) * Math.min(1, dt * TPOSE.rate);
    const w = this._tPoseW * (1 - Math.min(1, this._limp));
    this._sinceVolley += dt;
    this._reloadLeft -= dt;
    const reloading = this._reloadLeft > 0 && this._sinceVolley > TPOSE.after;
    this._tPoseOut += ((reloading ? TPOSE.a : Math.PI / 2 - TPOSE.lift) - this._tPoseOut) * Math.min(1, dt * TPOSE.rate);
    for (const perch of this._tPose.perches) perch.setEnabled(!reloading);
    if (w > 0.01) {
      for (const [shoulder, elbow, out] of [[b.leftShoulder, b.leftElbow, -1], [b.rightShoulder, b.rightElbow, 1]] as const) {
        const side = Math.sign(shoulder.position.x) || out;
        shoulder.rotation.x += (-TPOSE.ahead - shoulder.rotation.x) * w;
        shoulder.rotation.y += (0 - shoulder.rotation.y) * w;
        shoulder.rotation.z += (side * this._tPoseOut - shoulder.rotation.z) * w;
        elbow.rotation.x += (0 - elbow.rotation.x) * w;
        elbow.rotation.z += (0 - elbow.rotation.z) * w;
      }
    }
    // The perched crows: upright, facing his front, sat on top of the arm at the elbow
    if (!this._tPose.perches.length) return;
    b.root.computeWorldMatrix(true);
    const facing = Quaternion.RotationYawPitchRoll(b.root.rotation.y, 0, 0);
    const lift = b.metrics.overallHeight * TPOSE.perch;
    for (const perch of this._tPose.perches) {
      const shoulder = perch.parent as TransformNode;
      const chain: TransformNode[] = [];
      for (let n: TransformNode | null = shoulder; n; n = n.parent as TransformNode | null) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      const inv = Quaternion.Inverse(shoulder.absoluteRotationQuaternion);
      perch.rotationQuaternion = inv.multiply(facing);
      const elbow = shoulder === b.leftShoulder ? b.leftElbow : b.rightElbow;
      const up = new Vector3(0, lift, 0).rotateByQuaternionToRef(inv, new Vector3()).scaleInPlace(1 / Math.max(0.001, shoulder.absoluteScaling.y));
      perch.position.copyFrom(elbow.position).addInPlace(up);
    }
  }

  /** The scarecrow held up on his wings (spec at HOVER). */
  private _hover(dt: number): void {
    const b = this._body;
    const up = this._state !== AnimState.Dead ? 1 - Math.min(1, this._limp) : 0;
    this._hoverW += (up - this._hoverW) * Math.min(1, dt * HOVER.rateIn);
    this._hoverT += dt * HOVER.rate;
    const beat = Math.sin(this._hoverT);
    const height = b.metrics.overallHeight;
    this._hipRest ??= b.hip.position.y;
    // the hip is set from its rest every frame (update), so the lift is laid on afresh each frame
    b.hip.position.y += height * (HOVER.lift + HOVER.bob * beat) * this._hoverW;
    for (const wing of this._wings) {
      const side = Math.sign(wing.node.position.x) || 1;
      wing.node.rotation.z = wing.spread + side * HOVER.beat * Math.cos(this._hoverT) * this._hoverW;
    }
  }

  // Whether the weapon hand's club is held in both hands (see the spec at OFFHAND_GRIP_UP): a club, no board and nothing else in the off hand. Set by _buildCarry.
  private _twoHanded = false;
  // A two-fisted sword's off-fist drop, in grip lengths below the weapon fist (TWO_FIST_SWORD); 0 for any other weapon. Set by _buildCarry.
  private _swordFists = 0;
  /** Both fists on a two-fisted sword's grip, solved to the spec at FISTS_ON_GRIP, in idle, the march and the swing. */
  private _swordInBothFists(): void {
    const prop = this._carry?.weapon?.prop;
    if (!prop || this.walkStyle === "quadruped") return;
    const s = this._state;
    if (s !== AnimState.Idle && s !== AnimState.Walking && s !== AnimState.Attacking) return;
    const w = 1 - Math.min(1, this._limp);
    if (w <= 0.01) return;
    const b = this._body;
    const blade = prop.node as Mesh;
    const grip = blade.getChildren().find((n): n is Mesh => n instanceof Mesh && n.name === "grip");
    if (!grip) return;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = grip; n; n = n.parent as TransformNode | null) chain.unshift(n);
    // The grip's line as the arm has just been posed: its middle, the blade's own +y (toward the point), its half length; the weapon fist along it
    const line = () => {
      for (const n of chain) n.computeWorldMatrix(true);
      const axis = Vector3.TransformNormal(Vector3.Up(), blade.getWorldMatrix()).normalize();
      const half = grip.getBoundingInfo().boundingBox.extendSize.y * grip.absoluteScaling.y;
      const mid = grip.getAbsolutePosition();
      const fistAt = Math.max(-half, Math.min(half, Vector3.Dot(b.rightHand.getAbsolutePosition().subtract(mid), axis)));
      // 1. the wanted point and the range it is kept in: the pommel end (a share of the drop clear of it) up to a share of the drop under the weapon fist
      const drop = this._swordFists * half * 2;
      const lo = -half + drop * FISTS_ON_GRIP.pommel;
      const hi = Math.max(lo, fistAt - drop * FISTS_ON_GRIP.gap);
      return { axis, mid, lo, hi, want: Math.max(lo, Math.min(hi, fistAt - drop)) };
    };
    b.leftShoulder.computeWorldMatrix(true);
    const reach = (b.leftElbow.position.length() + b.leftHand.position.length()) * b.leftShoulder.absoluteScaling.y * FISTS_ON_GRIP.reach;
    // 2. the stretch of the grip inside the off arm's reach, cut down to the range, or null when none of it is
    const inReach = (g: ReturnType<typeof line>): [number, number] | null => {
      const rel = b.leftShoulder.getAbsolutePosition().subtract(g.mid);
      const c = Vector3.Dot(rel, g.axis);
      const off2 = rel.lengthSquared() - c * c;
      if (off2 >= reach * reach) return null;
      const k = Math.sqrt(reach * reach - off2);
      const from = Math.max(g.lo, c - k), to = Math.min(g.hi, c + k);
      return from <= to ? [from, to] : null;
    };
    let g = line();
    let span = inReach(g);
    if (!span) {
      // 3. the weapon fist drawn in toward the off shoulder by the shortfall, the blade held to its attitude in the world
      const at = g.mid.add(g.axis.scale(g.want));
      const toShoulder = b.leftShoulder.getAbsolutePosition().subtract(at);
      const short = toShoulder.length() - reach;
      const handQ = new Quaternion();
      b.rightHand.getWorldMatrix().decompose(undefined, handQ);
      const fist = b.rightHand.getAbsolutePosition().add(toShoulder.normalize().scale(short));
      this._armTo(b.rightShoulder, b.rightElbow, b.rightHand, fist, w, 2);
      for (const n of [b.rightShoulder, b.rightElbow]) n.computeWorldMatrix(true);
      const elbowQ = new Quaternion();
      b.rightElbow.getWorldMatrix().decompose(undefined, elbowQ);
      const local = Quaternion.Inverse(elbowQ).multiply(handQ);
      const have = b.rightHand.rotationQuaternion ?? Quaternion.FromEulerAngles(b.rightHand.rotation.x, b.rightHand.rotation.y, b.rightHand.rotation.z);
      const set = Quaternion.Slerp(have, local, w);
      if (b.rightHand.rotationQuaternion) b.rightHand.rotationQuaternion.copyFrom(set);
      else set.toEulerAnglesToRef(b.rightHand.rotation);
      g = line();
      span = inReach(g);
    }
    const at = span ? Math.max(span[0], Math.min(span[1], g.want)) : g.want;
    this._offArmTo(g.mid.add(g.axis.scale(at)), w, 2);
  }
  /** The off hand onto the club's grip, just above the weapon fist, by the carry's own turn (two-handed grip). */
  private _offhandToGrip(): void {
    if (this._swordFists > 0) {
      this._swordInBothFists();
      return;
    }
    const prop = this._carry?.weapon?.prop;
    if (!this._twoHanded || !prop) return;
    const s = this._state;
    if (s !== AnimState.Idle && s !== AnimState.Walking && s !== AnimState.Attacking) return;
    const w = Math.min(1, this._carryTurn) * (1 - Math.min(1, this._limp));
    if (w <= 0.01) return;
    const b = this._body;
    const club = prop.node as Mesh;
    // The club as the weapon arm has just been posed: its chain up to the root brought up to date before its grip point is read
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = club; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const length = club.getBoundingInfo().boundingBox.extendSize.y * 2;
    const grip = Vector3.TransformCoordinates(new Vector3(0, length * OFFHAND_GRIP_UP, 0), club.getWorldMatrix());
    this._offArmTo(grip, w);
  }

  // The matchlock in the weapon fist (the pole node carrying the musketFore mark) and its rest there, looked up once
  private _musket: { node: Mesh; rest: Quaternion } | null | undefined = undefined;
  private _musketAim = 1;
  /** The shouldered aim (see MUSKET_AIM): the weapon fist ahead of the shoulder, the musket level along his front, held in every living state. */
  private _aimMusket(dt: number): void {
    if (this._musket === undefined) {
      const node = this._body.rightHand.getChildren().find((n): n is Mesh => n instanceof Mesh && n.getChildren().some((c) => c.name === "musketFore"));
      this._musket = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z) } : null;
    }
    const gun = this._musket;
    if (!gun) return;
    // The shot leaves at the very start of the attack, often from the march: the musket is kept at the shoulder in every living state, eased back up after a fall
    const firing = this._state === AnimState.Attacking && this._attackMotion === "firearm_recoil";
    const up = this._state !== AnimState.Dead && this.walkStyle !== "quadruped";
    this._musketAim += ((up ? 1 : 0) - this._musketAim) * Math.min(1, dt * MUSKET_AIM.rate);
    const w = this._musketAim * (1 - Math.min(1, this._limp));
    if (w <= 0.001) {
      gun.node.rotationQuaternion = null;
      return;
    }
    const b = this._body;
    for (const n of [b.root, b.hip, b.torso, b.rightShoulder]) n.computeWorldMatrix(true);
    const rootM = b.root.getWorldMatrix();
    const flat = (v: Vector3): Vector3 => { v.y = 0; return v.lengthSquared() < 1e-6 ? v.set(0, 0, 1) : v.normalize(); };
    const fwd = flat(Vector3.TransformNormal(new Vector3(0, 0, 1), rootM));
    const outward = flat(Vector3.TransformNormal(new Vector3(Math.sign(b.rightShoulder.position.x) || 1, 0, 0), rootM));
    const height = b.metrics.overallHeight * b.root.scaling.y;
    // The fist where the stock's wrist sits with the butt in the shoulder: ahead of the shoulder, a little in toward the cheek and down
    const fist = b.rightShoulder.getAbsolutePosition().add(fwd.scale(MUSKET_AIM.ahead * height))
      .addInPlace(outward.scale(-MUSKET_AIM.inward * height)).addInPlace(new Vector3(0, -MUSKET_AIM.drop * height, 0));
    this._armTo(b.rightShoulder, b.rightElbow, b.rightHand, fist, w, 2);
    // The barrel (+y) level along his front, the muzzle kicked up by the shot as the attack starts; the wood (+z) under it
    const kick = firing ? MUSKET_AIM.kick * Math.min(1, this._attackTimer * 30) * Math.exp(-this._attackTimer * MUSKET_AIM.settle) : 0;
    const y = fwd.scale(Math.cos(kick)).addInPlace(new Vector3(0, Math.sin(kick), 0)).normalize();
    const z = Vector3.Cross(y, outward).normalize();
    const zDown = z.y > 0 ? z.scale(-1) : z;
    const x = Vector3.Cross(y, zDown).normalize();
    for (const n of [b.rightShoulder, b.rightElbow, b.rightHand]) n.computeWorldMatrix(true);
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, y, zDown, world);
    const handRot = new Quaternion();
    b.rightHand.getWorldMatrix().decompose(undefined, handRot);
    const hand = Matrix.Identity();
    handRot.toRotationMatrix(hand);
    gun.node.rotationQuaternion = Quaternion.Slerp(gun.rest, Quaternion.FromRotationMatrix(world.multiply(hand.transpose())), w);
    // Committed on his aim: a blow on him snaps only his head back
    this._aimWeight = Math.max(this._aimWeight, w);
  }

  /**
   * [S] 373 the halberd at rest (critic 372: the upper gauntlet gripped the shaft at helm height and hid the slit and eyes, the shaft slanting off his
   * weapon side; renaissance.halberd.blue.png: the shaft stood upright in front of his middle, the lower fist across the belly, the upper one on the
   * shaft at the collar, the helm's front clear). Standing or walking (not in a chop, nor held down after one), the weapon fist is solved (_armTo) onto
   * a point HALBERD_REST.ahead of his height before the weapon shoulder, .inward of it toward his middle and .drop below it, and the halberd stood
   * .tilt rad off straight up toward his front (_poseHalberd); the off hand then rides the shaft where it passes the off shoulder (_twoHandPole), at the
   * collar. Eased off as he goes limp.
   */
  private _restHalberd(): void {
    const h = this._halberd();
    if (!h || this._chopDown || this.walkStyle === "quadruped") return;
    const s = this._state;
    if (s !== AnimState.Idle && s !== AnimState.Walking) return;
    const w = 1 - Math.min(1, this._limp);
    if (w <= 0.01) return;
    const b = this._body;
    for (const n of [b.root, b.hip, b.torso, b.rightShoulder]) n.computeWorldMatrix(true);
    const rootM = b.root.getWorldMatrix();
    const flat = (v: Vector3): Vector3 => { v.y = 0; return v.lengthSquared() < 1e-6 ? v.set(0, 0, 1) : v.normalize(); };
    const fwd = flat(Vector3.TransformNormal(new Vector3(0, 0, 1), rootM));
    const outward = flat(Vector3.TransformNormal(new Vector3(Math.sign(b.rightShoulder.position.x) || 1, 0, 0), rootM));
    const height = b.metrics.overallHeight * b.root.scaling.y;
    const R = HALBERD_REST;
    const fist = b.rightShoulder.getAbsolutePosition().add(fwd.scale(R.ahead * height))
      .addInPlace(outward.scale(-R.inward * height)).addInPlace(new Vector3(0, -R.drop * height, 0));
    this._armTo(b.rightShoulder, b.rightElbow, b.rightHand, fist, w, 2);
    this._poseHalberd(R.tilt, w);
  }

  // A pole or a long gun in the weapon fist (see POLE_GRIP), its span along the shaft from the fist, looked up once
  private _pole: { node: Mesh; span: readonly [number, number] } | null | undefined = undefined;
  /** The off hand onto the pole's shaft where it passes nearest the off shoulder, kept within POLE_GRIP's span (both fists on the shaft). */
  private _twoHandPole(): void {
    if (this._pole === undefined) {
      const marked = (n: Node): n is Mesh => n instanceof Mesh && n.getChildren().some((c) => c.name in POLE_GRIP);
      // the pole is in the fist, or one node down (a scythe's snath under its carry node, SCYTHE_LOW)
      const node = this._body.rightHand.getChildren().flatMap((n) => [n, ...n.getChildren()]).find(marked);
      const mark = node?.getChildren().find((c) => c.name in POLE_GRIP);
      this._pole = node && mark ? { node, span: POLE_GRIP[mark.name as keyof typeof POLE_GRIP] } : null;
    }
    if (!this._pole || this.walkStyle === "quadruped") return;
    const s = this._state;
    if (s !== AnimState.Idle && s !== AnimState.Walking && s !== AnimState.Attacking) return;
    const w = 1 - Math.min(1, this._limp);
    if (w <= 0.01) return;
    const { node, span } = this._pole;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = node; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const length = node.getBoundingInfo().boundingBox.extendSize.y * 2 * node.absoluteScaling.y;
    // Along the shaft's own line (the grip preset sets it off the wrist), measured from where the weapon fist sits on it
    const origin = node.getAbsolutePosition();
    const axis = Vector3.TransformNormal(Vector3.Up(), node.getWorldMatrix()).normalize();
    const fistAt = Vector3.Dot(this._body.rightHand.getAbsolutePosition().subtract(origin), axis);
    this._body.leftShoulder.computeWorldMatrix(true);
    const along = Vector3.Dot(this._body.leftShoulder.getAbsolutePosition().subtract(origin), axis);
    const at = Math.max(fistAt + span[0] * length, Math.min(fistAt + span[1] * length, along));
    this._offArmTo(origin.add(axis.scale(at)), w, 2);
  }

  /** His heading in the world, level: forward off the root's +z, his right from his left shoulder to his right one (world matrices already computed). */
  private _heading(): { fwd: Vector3; right: Vector3 } {
    const b = this._body;
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    const right = b.rightShoulder.getAbsolutePosition().subtract(b.leftShoulder.getAbsolutePosition());
    right.y = 0;
    right.subtractInPlace(fwd.scale(Vector3.Dot(right, fwd)));
    if (right.lengthSquared() < 1e-6) right.set(fwd.z, 0, -fwd.x);
    return { fwd, right: right.normalize() };
  }

  /**
   * [S] the flask hangs from the fist by its neck (379; farmer.potion_seller.red.png: a fist-sized pale-teal flask gripped by the neck, the bulb below and
   * a little ahead of the fist at the hip; critic 378: bulbs riding on top of or beside the fists, the off-hand one inverted in the windup). Whatever the
   * hand's angle, each flask holder in a fist (potionBall: origin the cork, the bulb along its +y) is turned so the bulb runs FLASK_HANG.down below the
   * fist and .ahead before it in the world, eased in by how far he stands (not limp or dead); a flask out of the fist (thrown) is left alone.
   */
  private _hangFlasks(): void {
    if (this.walkStyle === "quadruped") return;
    const w = this._state === AnimState.Dead ? 0 : 1 - Math.min(1, this._limp);
    const b = this._body;
    for (const hand of [b.rightHand, b.leftHand]) {
      const holder = hand.getChildren().find((n): n is TransformNode => n.name === "potionBall");
      if (!holder) continue;
      if (w <= 0.01) {
        holder.rotationQuaternion = null;
        continue;
      }
      for (const n of [b.root, b.hip, b.torso, b.rightShoulder, b.leftShoulder, hand]) n.computeWorldMatrix(true);
      const { fwd } = this._heading();
      const want = new Vector3(fwd.x * FLASK_HANG.ahead, -FLASK_HANG.down, fwd.z * FLASK_HANG.ahead).normalize();
      const along = Vector3.TransformNormal(want, Matrix.Invert(hand.getWorldMatrix())).normalize();
      const turn = Quaternion.FromUnitVectorsToRef(Vector3.Up(), along, new Quaternion());
      const rest = Quaternion.FromEulerAngles(holder.rotation.x, holder.rotation.y, holder.rotation.z);
      holder.rotationQuaternion = Quaternion.Slerp(rest, turn, w);
    }
  }

  /** Levels the pike in both fists (PIKE_LEVEL); set by the runtime for the sarissa. */
  levelsPike = false;
  private _pike: { shaft: Mesh; grip: Vector3 } | null | undefined = undefined;

  /** [S] the sarissa's pike levelled in both fists (spec at PIKE_LEVEL), every living state; the thrust runs both fists along its line. */
  private _levelPike(): void {
    if (!this.levelsPike || this.walkStyle === "quadruped") return;
    if (this._pike === undefined) {
      const find = (n: Node): Mesh | undefined => (n instanceof Mesh && n.name === "shaft" ? n : n.getChildren().map(find).find((m) => m));
      const shaft = find(this._body.rightHand);
      this._pike = shaft ? { shaft, grip: shaft.position.clone() } : null;
    }
    if (!this._pike) return;
    const { shaft, grip } = this._pike;
    const s = this._state;
    const w = s === AnimState.Dead ? 0 : 1 - Math.min(1, this._limp);
    if (w <= 0.01 || (s !== AnimState.Idle && s !== AnimState.Walking && s !== AnimState.Attacking)) {
      if (shaft.rotationQuaternion) {
        shaft.rotationQuaternion = null;
        shaft.position.copyFrom(grip);
      }
      return;
    }
    const b = this._body, P = PIKE_LEVEL;
    for (const n of [b.root, b.hip, b.torso, b.rightShoulder, b.leftShoulder]) n.computeWorldMatrix(true);
    const hip = b.hip.getAbsolutePosition();
    const u = Math.max(0.05, b.rightShoulder.getAbsolutePosition().y - hip.y);
    const { fwd, right } = this._heading();
    // the stroke: drawn back to the windup, driven out past the rest at the release, eased back after
    let stroke = 0;
    if (s === AnimState.Attacking && this._attackMotion === "thrust") {
      const p = Math.min(this._attackTimer / Math.max(this._attackDuration, 0.001), 1);
      const ext = this._resolveReleasePoint(0.5);
      const ease = (x: number) => x * x * (3 - 2 * x);
      const q = (p - ext) / Math.max(1 - ext, 0.001);
      stroke = p < ext ? -P.draw * ease(p / Math.max(ext, 0.001)) : q < 0.4 ? -P.draw + (P.draw + 1) * ease(q / 0.4) : 1 - ease((q - 0.4) / 0.6);
    }
    const dir = new Vector3(fwd.x * Math.cos(P.tilt), Math.sin(P.tilt), fwd.z * Math.cos(P.tilt));
    const fist = hip.add(fwd.scale(P.ahead * u)).add(right.scale(P.out * u)).add(new Vector3(0, P.up * u, 0)).add(dir.scale(P.stroke * u * stroke));
    this._armTo(b.rightShoulder, b.rightElbow, b.rightHand, fist, w, 2);
    this._offArmTo(fist.add(dir.scale(P.offAhead * u)), w, 2);
    // the shaft along that line through the fist, the fist .fistAt of its length up from the butt
    const hand = (shaft.parent as TransformNode) ?? b.rightHand;
    for (const n of [b.rightShoulder, b.rightElbow, b.rightHand, hand]) n.computeWorldMatrix(true);
    const along = Vector3.TransformNormal(dir, Matrix.Invert(hand.getWorldMatrix())).normalize();
    const turn = Quaternion.FromUnitVectorsToRef(Vector3.Up(), along, new Quaternion());
    shaft.rotationQuaternion = turn;
    const len = shaft.getBoundingInfo().boundingBox.extendSize.y * 2 * shaft.scaling.y;
    const held = new Vector3(0, len * (0.5 - P.fistAt), 0);
    held.rotateByQuaternionToRef(turn, held);
    shaft.position.copyFrom(held);
  }

  /** The off arm solved onto a world point: shoulder swing and elbow fold, the elbow out to his free side and down, eased in by `w`. */
  private _offArmTo(grip: Vector3, w: number, settle = 0): void {
    const b = this._body;
    this._armTo(b.leftShoulder, b.leftElbow, b.leftHand, grip, w, settle);
  }

  /** Either arm (shoulder, elbow, hand) solved onto a world point, as _offArmTo. */
  private _armTo(shoulderJoint: TransformNode, elbowJoint: TransformNode, handJoint: TransformNode, grip: Vector3, w: number, settle = 0): void {
    // Into the off shoulder's frame: its parent's (the torso's) space, where the joint rotations act
    const frame = shoulderJoint.parent as TransformNode;
    frame.computeWorldMatrix(true);
    const target = Vector3.TransformCoordinates(grip, frame.getWorldMatrix().clone().invert());
    const shoulder = shoulderJoint.position;
    const upper = elbowJoint.position.length();
    const fore = handJoint.position.length();
    const toTarget = target.subtract(shoulder);
    const reach = Math.max(Math.abs(upper - fore) + 0.01, Math.min(upper + fore - 0.01, toTarget.length()));
    const line = toTarget.normalize();
    // The elbow stands out to his free side and down, square to the line from shoulder to grip
    const hint = new Vector3(Math.sign(shoulder.x) || -1, -0.6, -0.2);
    let out = hint.subtract(line.scale(Vector3.Dot(hint, line)));
    if (out.lengthSquared() < 1e-4) out = new Vector3(0, 0, -1).subtract(line.scale(line.z));
    out.normalize();
    const clamp = (v: number): number => Math.max(-1, Math.min(1, v));
    // The triangle shoulder-elbow-grip: the upper arm's angle off the line, and the fold at the elbow
    const swing = Math.acos(clamp((upper * upper + reach * reach - fore * fore) / (2 * upper * reach)));
    const fold = Math.PI - Math.acos(clamp((upper * upper + fore * fore - reach * reach) / (2 * upper * fore)));
    // The upper arm hangs down its -y and the elbow folds the forearm toward its +z: -y onto the upper arm's line, +z onto the fold's way (back in toward the line)
    const arm = line.scale(Math.cos(swing)).add(out.scale(Math.sin(swing)));
    const bend = out.scale(-1);
    const across = Vector3.Cross(bend, arm);
    const m = Matrix.FromValues(across.x, across.y, across.z, 0, -arm.x, -arm.y, -arm.z, 0, bend.x, bend.y, bend.z, 0, 0, 0, 0, 1);
    const want = Quaternion.FromRotationMatrix(m);
    const have = Quaternion.FromEulerAngles(shoulderJoint.rotation.x, shoulderJoint.rotation.y, shoulderJoint.rotation.z);
    Quaternion.Slerp(have, want, w).toEulerAnglesToRef(shoulderJoint.rotation);
    elbowJoint.rotation.x += (-fold - elbowJoint.rotation.x) * w;
    elbowJoint.rotation.y *= 1 - w;
    elbowJoint.rotation.z *= 1 - w;
    // Settled: the solved arm can leave the hand some way round off the point (~20 deg on a pole held across him), so the whole arm is swung about the
    // shoulder from where the hand landed onto the point, `settle` times; the fold already set the reach
    for (let i = 0; i < settle; i++) {
      for (const n of [frame, shoulderJoint, elbowJoint, handJoint]) n.computeWorldMatrix(true);
      const s = shoulderJoint.getAbsolutePosition();
      const landed = handJoint.getAbsolutePosition().subtract(s).normalize();
      const aim = grip.subtract(s).normalize();
      const fix = Quaternion.Slerp(Quaternion.Identity(), Quaternion.FromUnitVectorsToRef(landed, aim, new Quaternion()), w);
      const parent = frame.absoluteRotationQuaternion;
      const local = Quaternion.FromEulerAngles(shoulderJoint.rotation.x, shoulderJoint.rotation.y, shoulderJoint.rotation.z);
      Quaternion.Inverse(parent).multiply(fix).multiply(parent).multiply(local).toEulerAnglesToRef(shoulderJoint.rotation);
    }
  }

  // The spear in a shield man's weapon hand, with the turn and the offset it was strapped on with. Looked up on first use, like the board.
  private _spear: { shaft: TransformNode; rest: Quaternion; grip: Vector3 } | null | undefined = undefined;
  private _spearShaft(): { shaft: TransformNode; rest: Quaternion; grip: Vector3 } | null {
    if (this._spear === undefined) {
      const shaft = this._shieldBoard() ? this._body.rightHand.getChildren().find((n): n is TransformNode => /shaft$/.test(n.name)) : undefined;
      this._spear = shaft ? { shaft, rest: Quaternion.FromEulerAngles(shaft.rotation.x, shaft.rotation.y, shaft.rotation.z), grip: shaft.position.clone() } : null;
    }
    return this._spear;
  }

  /**
   * A shield man's spear does not ride his hand any more than his board does: it turns in the fist to his carry, whatever the arm is doing (see the spec at the head of this file).
   * On the march out of a wall it stands upright, point to the sky. Slotted into a wall, or shoving, it goes to the hold: SPEAR_WALL_UP above level on the wall's heading, one
   * line for the whole wall, front rank (couched near the butt) and rear alike. He works it in strokes on his own beat, the shaft running through the fist along that line. Limp or dead, the spear goes back to hanging from the hand.
   */
  private _carrySpear(): void {
    const spear = this._spearShaft();
    if (!spear) return;
    const { shaft, rest, grip } = spear;
    const k = this._state === AnimState.Dead ? 0 : 1 - Math.min(1, this._limp);
    if (k <= 0.01) {
      if (shaft.rotationQuaternion) {
        shaft.rotationQuaternion = null;
        shaft.position.copyFrom(grip);
      }
      return;
    }
    const hand = this._body.rightHand;
    hand.computeWorldMatrix(true);
    // Shoving with no man handed to him he still brings it to his hold, and standing in a wall he holds it there from the moment he is slotted.
    const level = Math.max(this._spearLevel, Math.min(1, this._shove * 1.5), this._wallHold);
    const root = this._body.root;
    const br = (this._bracePose ??= this._buildBracePose());
    const handScale = Math.max(0.001, hand.absoluteScaling.y);
    // The shaft from the fist to its point and from the fist to its butt, as it was strapped on, in the hand's own measure
    const tip = shaft.getChildMeshes(true)[0];
    const aheadOfFist = grip.length() + (tip ? tip.position.y + tip.getBoundingInfo().boundingBox.maximum.y : 0) * shaft.scaling.y;
    const behindFist = (shaft as Mesh).getBoundingInfo().boundingBox.maximum.y * shaft.scaling.y - grip.length();
    this._spearNear = 0;
    // A front man takes the couched grip near the butt: the shaft runs forward through the fist by what that takes
    const toGrip = ((aheadOfFist + behindFist) * (1 - br.spearGrip) - aheadOfFist) * (1 - this._spearRearHold) * level;
    // The stroke's run through the fist, in the hand's measure
    const run = this._spearThrust * SPEAR_LUNGE / handScale;
    if (this._spearAimTimer > 0) {
      // In reach, or a stride and a half short of it: only then does he strike
      const from = hand.absolutePosition;
      const front = Math.hypot(this._spearAim.x - from.x, this._spearAim.z - from.z) - this._spearAimRadius;
      this._spearNear = Math.max(0, Math.min(1, aheadOfFist * handScale + SPEAR_LUNGE + 1.5 - front));
    }
    // The shaft's line in the world: on the march upright, a touch forward; at the hold SPEAR_WALL_UP above level on the wall's heading, not his body's, so every shaft in
    // the wall is parallel to every other, front rank and rear, and the stroke slides along it. No roll and no pitch of his own.
    const ownYaw = root.rotation.y;
    let yaw = ownYaw + Math.atan2(Math.sin(this._wallHeading - ownYaw), Math.cos(this._wallHeading - ownYaw)) * this._wallHold;
    let up = Math.PI / 2 - 0.06 + (SPEAR_WALL_UP - Math.PI / 2 + 0.06) * level;
    // Overhand over the boards (trailer_3_sheet_01 r3c1: spears levelled at shoulder height, pointed at the foe): a rear-rank man whose foe is in reach brings his
    // raised shaft down from the ear to SPEAR_OVERHAND_UP above level and onto the bearing of that foe, so it is thrust over the front rank's boards and heads; his
    // strokes run along that line. The front man keeps his couched raised hold (a level shaft from the waist would run through his own board).
    this._spearOverhand += ((this._spearAimTimer > 0 ? this._spearRearHold * this._spearNear : 0) - this._spearOverhand) * Math.min(1, this._lastDt * 6);
    if (this._spearOverhand > 0.01) {
      const at = hand.absolutePosition;
      const bearing = Math.atan2(this._spearAim.x - at.x, this._spearAim.z - at.z);
      yaw += Math.atan2(Math.sin(bearing - yaw), Math.cos(bearing - yaw)) * this._spearOverhand;
      up += (SPEAR_OVERHAND_UP - up) * this._spearOverhand;
    }
    const d = this._spearDir.set(Math.sin(yaw) * Math.cos(up), Math.sin(up), Math.cos(yaw) * Math.cos(up));
    // Set directly through the fist's whole world matrix: the trunk's on-hit squash scales it unevenly and shears the arm, and a rotation composed in the fist's frame
    // would come out up to 0.4 rad off the line in the world.
    const along = Vector3.TransformNormal(d, Matrix.Invert(hand.getWorldMatrix())).normalize();
    const turn = Quaternion.Slerp(rest, Quaternion.FromUnitVectorsToRef(Vector3.Up(), along, new Quaternion()), k);
    shaft.rotationQuaternion = turn;
    // The shaft's middle sits as far up the shaft from the fist as it was strapped on, and runs through the fist with the stroke.
    const held = new Vector3(0, grip.length() + toGrip + run, 0);
    held.rotateByQuaternionToRef(turn, held);
    Vector3.LerpToRef(grip, held, k, shaft.position);
  }

  private _resetPose(): void {
    for (const joint of this._body.allJoints) {
      joint.rotation.setAll(0);
    }
    this._body.torso.scaling.setAll(1);
  }

  private _updatePupilWobble(dt: number): void {
    const b = this._body;
    if (!b.leftPupil || !b.rightPupil) return;

    const neckRotX = b.neck.rotation.x;
    const neckRotZ = b.neck.rotation.z;

    // Head angular velocity drives pupil inertia (pupils lag behind)
    const angVelX = (neckRotX - this._prevNeckRotX) / Math.max(dt, 0.001);
    const angVelZ = (neckRotZ - this._prevNeckRotZ) / Math.max(dt, 0.001);
    this._prevNeckRotX = neckRotX;
    this._prevNeckRotZ = neckRotZ;

    // Impulse: pupils drift opposite to head rotation
    this._pupilVelX += -angVelZ * 0.012;
    this._pupilVelY += -angVelX * 0.012;

    // Spring back to center
    const spring = 18;
    const damping = 6;
    this._pupilVelX += (-spring * this._pupilOffX - damping * this._pupilVelX) * dt;
    this._pupilVelY += (-spring * this._pupilOffY - damping * this._pupilVelY) * dt;

    this._pupilOffX += this._pupilVelX * dt;
    this._pupilOffY += this._pupilVelY * dt;

    // Clamp to the white of the eye disc
    const maxOff = b.metrics.pupilTravel ?? 0.025 * (b.metrics.overallHeight / 1.4);
    const dist = Math.sqrt(this._pupilOffX * this._pupilOffX + this._pupilOffY * this._pupilOffY);
    if (dist > maxOff) {
      const ratio = maxOff / dist;
      this._pupilOffX *= ratio;
      this._pupilOffY *= ratio;
    }

    // On death, drift pupils outward for "knocked out" look
    if (this._state === AnimState.Dead) {
      const drift = 0.6;
      this._pupilOffX += (-maxOff * drift - this._pupilOffX) * dt * 2;
      this._pupilOffY += (maxOff * drift - this._pupilOffY) * dt * 2;
    }

    b.leftPupil.position.x = this._pupilOffX;
    b.leftPupil.position.y = this._pupilOffY;
    b.rightPupil.position.x = this._pupilOffX;
    b.rightPupil.position.y = this._pupilOffY;
  }

  private _animateIdle(_dt: number): void {
    if (this.walkStyle === "quadruped") {
      this._animateIdleQuadruped();
      return;
    }
    this._animateIdleHumanoid();
  }

  // Per-unit standing rest. A man does not stand to attention: he takes one of three stances of his own (hip-shot on one straight leg with a hand at the hip, sunk on both
  // bent knees with the hips let down and the free hand out in front, or at ease on easy knees with the free arm hung back), and on top of it his lean, which leg is the free one,
  // where the head is turned, and for an arm with nothing to hold its hang off the ribs and the reach, pace and phase of its swing. Hashed from the wobble phase like the shove pose, so it consumes no random numbers.
  private _idlePose: {
    lean: number; side: number; stride: number; tilt: number; turn: number; crouch: number; chin: number; cock: number; square: boolean;
    off: { raise: number; out: number; elbow: number };
    arms: Array<{ out: number; elbow: number; swing: number; rate: number; phase: number }>;
  } | null = null;
  private _idleSink = 0;
  private _buildIdlePose(): NonNullable<ProceduralAnimator["_idlePose"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const arm = (n: number) => ({ out: 0.08 + h(n) * 0.1, elbow: 0.4 + h(n + 1) * 0.4, swing: 0.14 + h(n + 2) * 0.18, rate: 0.9 + h(n + 3) * 0.7, phase: h(n + 4) * Math.PI * 2 });
    // [S] a javelin man stands tall (374; tribal.spear_thrower.red.png, tribal.jpg: a lanky Wobbler upright on long straight legs, never sunk on his
    // knees): he always takes the hip-shot stance, its crouch at most JAVELIN_UPRIGHT.crouch, and leans JAVELIN_UPRIGHT.lean (+ .lean2 hashed)
    // [S] so does the halberdier (376; renaissance.halberd.red.png, renaissance.jpg: tall and square on long straight legs, chest upright over the
    // hips, never bowed over bent knees): a halberd man in a sallet takes the same stance (the glaive's paladin, no sallet, keeps his own)
    const upright = Boolean(this._javelin()) || this._salletHalberd();
    const pick = upright ? h(121) * 0.35 : h(121);
    const stance = pick < 0.35
      ? { tilt: 0.17 + h(43) * 0.1, stride: 0.24 + h(46) * 0.14, crouch: 0.02 + h(122) * 0.08, chin: 0.05, cock: 0.14 + h(126) * 0.1, off: { raise: 0.3 + h(123) * 0.2, out: 0.5 + h(124) * 0.2, elbow: -1.5 - h(125) * 0.4 } }
      : pick < 0.7
        ? { tilt: 0.05 + h(43) * 0.06, stride: 0.1 + h(46) * 0.1, crouch: 0.25 + h(122) * 0.2, chin: -0.22, cock: 0.02 + h(126) * 0.06, off: { raise: -0.45 - h(123) * 0.3, out: 0.12 + h(124) * 0.2, elbow: -0.8 - h(125) * 0.5 } }
        : { tilt: 0.1 + h(43) * 0.07, stride: 0.14 + h(46) * 0.1, crouch: 0.16 + h(122) * 0.16, chin: -0.08, cock: -0.08 - h(126) * 0.08, off: { raise: 0.28 + h(123) * 0.22, out: 0.06 + h(124) * 0.12, elbow: -0.2 - h(125) * 0.3 } };
    if (upright) stance.crouch = Math.min(stance.crouch, JAVELIN_UPRIGHT.crouch);
    // the halberdier stands square, not hip-shot: both legs straight, hips level, a short stride, chest over the hips (HALBERD_SQUARE)
    const square = this._salletHalberd(); // (his halberd's pole is a "shaft" too, so _javelin() finds it: the sallet tells him apart)
    if (square) Object.assign(stance, { tilt: HALBERD_SQUARE.tilt, stride: HALBERD_SQUARE.stride, crouch: 0 });
    return {
      square,
      lean: square ? HALBERD_SQUARE.lean : upright ? JAVELIN_UPRIGHT.lean + h(41) * JAVELIN_UPRIGHT.lean2 : 0.26 + h(41) * 0.14, // at 0.22-0.38 some rear men stood near vertical; at 0.32-0.52 idle heroes bowed and half squatted
      side: h(42) < 0.5 ? -1 : 1,
      turn: (h(44) < 0.5 ? -1 : 1) * (0.2 + h(45) * 0.4),
      ...stance,
      arms: [arm(70), arm(80)],
    };
  }

  private _animateIdleHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.07; // TABS-style pronounced sway
    const p = (this._idlePose ??= this._buildIdlePose());
    const leftLeads = p.side < 0;
    // The stance is a man's own while nobody is on him: in a press the shove and the brace take the arms and legs over
    const ease = 1 - Math.min(1, this._shove);
    const c = (this._carry ??= this._buildCarry());
    const hold = ease * (1 - Math.min(1, this._limp));
    const ready = c.ready;

    // Weight on one leg: the pelvis drops on the side of the free leg and the chest rolls back the other way over the standing one, swaying about a slight forward slouch
    const tilt = (leftLeads ? 1 : -1) * (ready?.cast ? p.tilt + 0.08 : p.tilt * (ready ? 0.4 : 1)) + Math.sin(t * 0.7) * 0.03;
    const sway = Math.sin(t * 1.5) * wobble;
    b.hip.rotation.z = tilt;
    b.torso.rotation.z = -tilt * 1.5 + sway;
    b.torso.rotation.x = p.lean + Math.sin(t * 1.2 + 1) * wobble * 0.5;

    // The head rides back toward level a quarter of a sway behind the chest, turned off to its own side, cocked over one shoulder or carried up off a sunk chest as the stance has it
    b.neck.rotation.z = tilt * 0.5 + (leftLeads ? -1 : 1) * p.cock + Math.sin(t * 1.5 - Math.PI / 2) * wobble * 1.2;
    b.neck.rotation.y = p.turn + Math.sin(t * 0.6 + p.turn * 9) * 0.12;
    b.neck.rotation.x = p.chin * ease + Math.sin(t * 1.3 + 2) * wobble * 0.8;
    // A bowman at the ready stands half side-on: hips and chest turned off the line with his leading shoulder to the enemy, and the head left looking down it
    if (ready) {
      const yaw = (leftLeads ? 1 : -1) * ready.yaw * hold + Math.sin(t * 0.5 + ready.yaw * 7) * 0.05;
      b.hip.rotation.y = yaw * 0.45;
      b.torso.rotation.y = yaw * 0.55;
      b.neck.rotation.y = p.turn * 0.35 - yaw * 0.85 + Math.sin(t * 0.6 + p.turn * 9) * 0.12;
    }

    // An arm with nothing to do hangs from the shoulder under its own weight, plumb whatever the chest above it is doing, a little
    // off the ribs on an elbow bent enough to keep the hand at the thigh, and swings as its own pendulum with the forearm trailing the upper arm
    const roll = b.hip.rotation.z + b.torso.rotation.z;
    const [left, right] = p.arms;
    const leftSwing = Math.sin(t * left.rate + left.phase);
    const rightSwing = Math.sin(t * right.rate + right.phase);
    b.leftShoulder.rotation.x = -b.torso.rotation.x * 0.7 + leftSwing * left.swing;
    b.rightShoulder.rotation.x = -b.torso.rotation.x * 0.7 + rightSwing * right.swing;
    b.leftShoulder.rotation.z = -roll - left.out;
    b.rightShoulder.rotation.z = -roll + right.out;
    b.leftElbow.rotation.x = -left.elbow - (0.5 + 0.5 * Math.sin(t * left.rate + left.phase - 0.9)) * left.swing;
    b.rightElbow.rotation.x = -right.elbow - (0.5 + 0.5 * Math.sin(t * right.rate + right.phase - 0.9)) * right.swing;
    // ...but neither arm of a standing man is left to hang plumb beside the other. The weapon hand keeps the hold he marches with (shouldered, stood up, slanted across the chest or
    // trailed), a board arm stays folded across the body, and an empty hand goes where his stance puts it; each still breathes on its own pendulum. An aimed weapon takes both hands:
    // the bow hand holds it at the ready and the other comes across to it.
    this._carryDip = 0;
    const grip = c.weapon ?? ready;
    if (grip) {
      // A hand on a staff stood on the ground does not swing with the arm's pendulum
      const breathe = ready?.prop?.plant ? 0 : rightSwing * right.swing * 0.3;
      b.rightShoulder.rotation.x += (grip.raise + breathe - b.rightShoulder.rotation.x) * hold;
      b.rightShoulder.rotation.z += (grip.out - b.rightShoulder.rotation.z) * hold;
      b.rightElbow.rotation.x += (grip.elbow - b.rightElbow.rotation.x) * hold;
    }
    const off = c.board ?? ready?.left ?? (this._potionHang ? POTION_HANG.left : this.locomotionBias !== "aimed" ? p.off : null);
    if (off) {
      b.leftShoulder.rotation.x += (off.raise + leftSwing * left.swing * 0.3 - b.leftShoulder.rotation.x) * hold;
      b.leftShoulder.rotation.z += (-off.out - b.leftShoulder.rotation.z) * hold;
      b.leftElbow.rotation.x += (off.elbow - (0.5 + 0.5 * leftSwing) * left.swing * 0.3 - b.leftElbow.rotation.x) * hold;
    }

    // Staggered stance: the free leg is planted ahead with its knee bent (twice the hip angle, which keeps that foot
    // on the ground under its dropped hip); the standing leg trails slightly behind, nearly straight.
    // Both knees give under the forward lean (knee twice the hip, so the feet stay put): nobody leans on locked legs.
    // A sunk stance folds both knees further, the thighs coming forward by half of it, and lets the hips down by what that takes off the legs' height.
    const crouch = p.crouch * ease * (ready?.cast ? CASTER_CROUCH : 1);
    const sag = p.lean * 0.2 + crouch * 0.5;
    const lead = -p.stride - sag;
    const trail = p.stride * 0.45 - sag;
    b.leftHip.rotation.x = (leftLeads ? lead : trail) + Math.sin(t * 0.9) * wobble;
    b.rightHip.rotation.x = (leftLeads ? trail : lead) + Math.sin(t * 0.9 + Math.PI) * wobble;
    // The legs stay upright under the tilted pelvis: the standing foot comes in under the body and the free foot rests out to its side
    b.leftHip.rotation.z = -tilt + (leftLeads ? -0.08 : 0.06);
    b.rightHip.rotation.z = -tilt + (leftLeads ? -0.06 : 0.08);
    b.leftKnee.rotation.x = leftLeads ? (p.stride + sag) * 2 : 0.1 + sag * 2;
    b.rightKnee.rotation.x = leftLeads ? 0.1 + sag * 2 : (p.stride + sag) * 2;
    this._hipRest ??= b.hip.position.y;
    this._idleSink = this._hipRest * (1 - Math.cos(crouch * 0.5));
    // Ready stance: the feet are staggered fore and aft, not set side by side under the hips. The leading leg reaches out ahead on a knee that gives, the other is set
    // back nearly straight with its heel behind him, and the hips come down by what the spread takes off the legs' height. A caster keeps the stance he has.
    if (ready && !ready.cast) {
      const reach = ready.stagger * ease;
      const give = ready.give * ease + p.lean * 0.2;
      const ahead = -reach - give + Math.sin(t * 0.9) * wobble * 0.5;
      const behind = reach * 0.9 - give * 0.3 + Math.sin(t * 0.9 + Math.PI) * wobble * 0.5;
      b.leftHip.rotation.x = leftLeads ? ahead : behind;
      b.rightHip.rotation.x = leftLeads ? behind : ahead;
      b.leftKnee.rotation.x = leftLeads ? give * 2 + 0.1 : 0.15 + give * 0.6;
      b.rightKnee.rotation.x = leftLeads ? 0.15 + give * 0.6 : give * 2 + 0.1;
      this._idleSink = this._hipRest * (1 - Math.cos(reach) * Math.cos(give));
    }
    // The halberdier square on both legs (HALBERD_SQUARE): feet a little apart side by side, both knees all but straight, hips not let down
    if (p.square) {
      const sway = Math.sin(t * 0.9) * wobble * 0.4;
      b.leftHip.rotation.x = -p.stride * 0.5 + sway;
      b.rightHip.rotation.x = p.stride * 0.3 - sway;
      b.leftHip.rotation.z = -tilt - HALBERD_SQUARE.spread;
      b.rightHip.rotation.z = -tilt + HALBERD_SQUARE.spread;
      b.leftKnee.rotation.x = HALBERD_SQUARE.knee;
      b.rightKnee.rotation.x = HALBERD_SQUARE.knee;
      this._idleSink = 0;
    }
  }

  private _animateIdleQuadruped(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.02;

    // Gentle body breathing sway
    b.torso.rotation.z = Math.sin(t * 1.2) * wobble;
    b.torso.rotation.x = Math.sin(t * 0.9 + 1) * wobble * 0.5;

    // Head sways gently
    b.neck.rotation.x = Math.sin(t * 1.0 + 0.5) * wobble * 1.5;
    b.neck.rotation.z = Math.sin(t * 1.4 + 2) * wobble;

    // All four legs nearly still — just micro-shifts
    b.leftShoulder.rotation.x = Math.sin(t * 0.8) * wobble;
    b.rightShoulder.rotation.x = Math.sin(t * 0.8 + Math.PI) * wobble;
    b.leftHip.rotation.x = Math.sin(t * 0.7 + 1) * wobble;
    b.rightHip.rotation.x = Math.sin(t * 0.7 + 1 + Math.PI) * wobble;
    b.leftElbow.rotation.x = 0;
    b.rightElbow.rotation.x = 0;
    b.leftKnee.rotation.x = 0;
    b.rightKnee.rotation.x = 0;
  }

  private _animateWalk(_dt: number): void {
    if (this.walkStyle === "quadruped") {
      this._animateWalkQuadruped();
      return;
    }
    this._animateWalkHumanoid();
  }

  // Per-unit gait, so a column on the march is not one walk cycle caught at different moments: each man steps at his own cadence, brings the free leg through with the knee
  // folded and lifted to his own height (0.6-1.1 rad: to 1.5 the deep end was a crouched scuttle), steps longer on one side than the other, sinks to his own depth on the standing leg and swings his arms to his own reach, a beat off his legs.
  // Hashed from the wobble phase like the shove pose, so it consumes no random numbers.
  // The trunk is his own too: one shoulder carried lower than the other, the shoulders rolled over each standing leg by his own amount, the chest dipped on each footfall
  // and heaved back up, and the head set chin up or chin down on the neck and nodding behind the chest, a beat late.
  private _gait: { rate: number; lift: number; limp: number; sink: number; armLag: number; armSwing: number; slump: number; roll: number; nod: number; nodLag: number; chin: number; head: number; headLag: number } | null = null;
  private _buildGait(): NonNullable<ProceduralAnimator["_gait"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      rate: 6.8 + h(71) * 2.6,
      lift: 0.6 + h(72) * 0.5,
      limp: (h(73) - 0.5) * 0.36,
      sink: 0.05 + h(74) * 0.22,
      armLag: (h(75) - 0.5) * 1.4,
      armSwing: 0.5 + h(76) * 0.45,
      slump: (h(77) - 0.5) * 0.16,
      roll: 0.08 + h(78) * 0.12,
      nod: 0.03 + h(79) * 0.05,
      nodLag: h(80) * Math.PI,
      chin: -0.28 + h(89) * 0.32,
      head: 0.04 + h(90) * 0.1,
      headLag: 0.4 + h(91) * 1.2,
    };
  }

  private _animateWalkHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const gait = (this._gait ??= this._buildGait());
    const speed = gait.rate; // cycle speed
    const wobble = 0.08; // constant wobble overlay

    // Torso leans forward and sways side to side. Each man runs at his own lean, 0.28-0.54 (at 0.16-0.46 the shallow end ran near upright), hashed from the wobble phase like the idle slouch: at one 0.38 a charging rank was the same man stamped down its length
    const leanHash = Math.sin(this._wobblePhase * 12.9898 + 51 * 78.233) * 43758.5453;
    // The trunk moves on the step, not on a clock of its own: the chest dips twice a stride, on the footfalls, and the shoulders roll once a stride over the standing leg, about the man's own dropped shoulder.
    const stride = t * speed;
    const dip = Math.cos(stride * 2 + gait.nodLag);
    const shoulderRoll = gait.slump + Math.sin(stride) * gait.roll;
    b.torso.rotation.x = 0.28 + (leanHash - Math.floor(leanHash)) * 0.26 + dip * gait.nod;
    b.torso.rotation.z = shoulderRoll;

    // The head rides the roll part of the way back to level and wobbles on top of it
    b.neck.rotation.z = -shoulderRoll * 0.6 + Math.sin(t * speed * 0.7 + 1) * 0.05;
    // Each man carries his chin at his own height against the forward lean (0.28 up to 0.04 down), and the head nods after the chest.
    b.neck.rotation.x = gait.chin + Math.cos(stride * 2 + gait.nodLag - gait.headLag) * gait.head;

    // Alternating leg swing (TABS-style exaggerated)
    const legSwing = (this._shovePose ??= this._buildShovePose()).stride; // per-unit (0.6-0.85 rad), so a charge does not share one stride length
    // Both legs trail behind the hips, so the body tilts into the run from the feet up and the torso does not fold over upright legs. Per-unit (0.12-0.32 rad), so a charge does not share one lean.
    const trail = (this._shovePose ??= this._buildShovePose()).trail;
    // A step has two halves. Going back the leg is the standing leg: straight but for the man's own sink at the knee. Coming forward it is the free leg: the knee folds
    // and the thigh lifts as it passes under the hips, and it straightens again to reach the ground out in front. So a marcher is one straight leg and one bent, never a pair of compasses.
    const leftStep = t * speed;
    const rightStep = leftStep + Math.PI;
    const leftFold = Math.max(0, -Math.cos(leftStep));
    const rightFold = Math.max(0, -Math.cos(rightStep));
    b.leftHip.rotation.x = trail + Math.sin(leftStep) * legSwing * (1 + gait.limp) - leftFold * gait.lift * 0.35;
    b.rightHip.rotation.x = trail + Math.sin(rightStep) * legSwing * (1 - gait.limp) - rightFold * gait.lift * 0.35;
    b.leftKnee.rotation.x = gait.sink + leftFold * gait.lift;
    b.rightKnee.rotation.x = gait.sink + rightFold * gait.lift;

    // Arms swing opposite to legs, each man's a beat ahead of or behind his step
    const armStep = leftStep + gait.armLag;
    b.leftShoulder.rotation.x = Math.sin(armStep + Math.PI) * gait.armSwing;
    b.rightShoulder.rotation.x = Math.sin(armStep) * gait.armSwing;
    // Per-unit elbow bend (0.7-1.2 rad), so a rank on the move does not share one arm shape.
    const elbow = (this._shovePose ??= this._buildShovePose()).elbow;
    b.leftElbow.rotation.x = -elbow + Math.sin(armStep + Math.PI) * 0.2;
    b.rightElbow.rotation.x = -elbow + Math.sin(armStep) * 0.2;

    // Floppy arm Z rotation (TABS signature wobble)
    b.leftShoulder.rotation.z = -0.3 + Math.sin(t * speed * 1.3) * wobble * 3.5; // held 0.3 out from the ribs under the wobble: about zero the signed sine swung the arm in through the torso
    b.rightShoulder.rotation.z = 0.3 + Math.sin(t * speed * 1.3 + 1) * wobble * 3.5;

    // Hip bounce
    b.hip.rotation.z = Math.sin(t * speed) * 0.04;
    this._applyWalkBias(t);
  }

  /** Quadruped walk: diagonal pairs move together (trot gait). */
  private _animateWalkQuadruped(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const speed = 5; // slower, heavier cycle
    const legSwing = 0.3; // shorter swing for thick legs

    // Diagonal trot: front-left + back-right, then front-right + back-left
    // Front legs (mapped to shoulders)
    b.leftShoulder.rotation.x = Math.sin(t * speed) * legSwing;
    b.rightShoulder.rotation.x = Math.sin(t * speed + Math.PI) * legSwing;
    // Front knees bend on back-swing
    b.leftElbow.rotation.x = Math.max(0, -Math.sin(t * speed)) * 0.25;
    b.rightElbow.rotation.x = Math.max(0, -Math.sin(t * speed + Math.PI)) * 0.25;

    // Back legs (mapped to hips)
    b.leftHip.rotation.x = Math.sin(t * speed + Math.PI) * legSwing;
    b.rightHip.rotation.x = Math.sin(t * speed) * legSwing;
    // Back knees
    b.leftKnee.rotation.x = Math.max(0, -Math.sin(t * speed + Math.PI)) * 0.25;
    b.rightKnee.rotation.x = Math.max(0, -Math.sin(t * speed)) * 0.25;

    // Body sway — subtle side-to-side rock synced with gait
    b.torso.rotation.z = Math.sin(t * speed) * 0.03;
    // Slight forward lean
    b.torso.rotation.x = 0.04 + Math.sin(t * speed * 2) * 0.015;

    // Head bobs gently — slightly out of phase for natural feel
    b.neck.rotation.x = Math.sin(t * speed * 2 + 1) * 0.06;
    b.neck.rotation.z = Math.sin(t * speed + 0.5) * 0.04;

    // Hip slight vertical bounce
    b.hip.rotation.x = Math.sin(t * speed * 2) * 0.02;
  }

  private _applyWalkBias(t: number): void {
    const b = this._body;
    switch (this.locomotionBias) {
      case "heavy_carry": {
        // Per-unit carry: each body holds its weapon arm at its own height, fold and angle off the ribs, hashed from
        // the wobble phase like the idle pose, so a rank on the march is a ragged line of clubs and not one repeated pose
        const h = (n: number): number => {
          const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
          return v - Math.floor(v);
        };
        b.torso.rotation.x += 0.06;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.7 - 1.2 + (h(61) - 0.5) * 0.9;
        b.rightShoulder.rotation.z += (h(62) - 0.5) * 0.7;
        b.leftShoulder.rotation.x *= 0.82;
        // The elbow folds a little, to make a right angle with the raised upper arm between them, so the club stands upright off the forearm: folded further it tipped back over the shoulder to level
        b.rightElbow.rotation.x -= 0.4 + (h(63) - 0.5) * 0.4;
        break;
      }
      case "aimed":
        b.torso.rotation.x += 0.04;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.65 + 0.16;
        b.leftShoulder.rotation.x = b.leftShoulder.rotation.x * 0.6 - 0.18;
        b.leftElbow.rotation.x -= 0.12;
        b.rightElbow.rotation.x -= 0.06;
        b.torso.rotation.z += Math.sin(t * 4) * 0.02;
        break;
      case "braced":
        b.torso.rotation.x += 0.05;
        b.leftShoulder.rotation.x = b.leftShoulder.rotation.x * 0.65 - 0.08;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.65 + 0.08;
        b.leftElbow.rotation.x -= 0.08;
        b.rightElbow.rotation.x -= 0.12;
        break;
      default:
        break;
    }
  }

  private _resolveReleasePoint(defaultPoint: number): number {
    switch (this.releaseTimingProfile) {
      case "melee_commit":
        return 0.44;
      case "thrust_extend":
        return 0.5;
      case "bow_release":
        return 0.72;
      case "crossbow_release":
        return 0.55;
      case "firearm_recoil":
        return 0.5;
      case "throw_release":
        return 0.45;
      default:
        return defaultPoint;
    }
  }

  private _animateAttack(dt: number): void {
    if (this._attackMotion === "reload" || this._attackMotion === "crank" || this._attackMotion === "brace" || this._attackMotion === "carry" || this._attackMotion === "breath") {
      this._animateUtilityAction(dt);
      return;
    }
    if (this.attackStyle === "mammoth") {
      this._animateAttackMammoth(dt);
      return;
    }
    if (this.bullFists && this._attackMotion === "strike") {
      this._animateBullPunch(dt);
      return;
    }
    switch (this._attackMotion) {
      case "heavy_swing":
        this._animateHeavySwing(dt);
        return;
      case "blade_slash":
        this._animateBladeSlash(dt);
        return;
      case "thrust":
        this._animateThrust(dt);
        return;
      case "throw":
        this._animateThrow(dt);
        return;
      case "bow_draw_release":
        this._animateBowDrawRelease(dt);
        return;
      case "crossbow_snap":
        this._animateCrossbowSnap(dt);
        return;
      case "firearm_recoil":
        this._animateFirearmRecoil(dt);
        return;
      default:
        break;
    }
    this._animateAttackHumanoid(dt);
  }

  private _animateUtilityAction(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const t = this._time + this._wobblePhase;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const pulse = Math.sin(progress * Math.PI);
    const settle = 1 - progress;

    switch (this._attackMotion) {
      case "reload":
        b.torso.rotation.x = -0.05 + pulse * 0.08;
        b.rightShoulder.rotation.x = -0.18 + pulse * 0.28;
        b.rightElbow.rotation.x = -0.42 + pulse * 0.22;
        b.leftShoulder.rotation.x = -0.1 + pulse * 0.12;
        b.leftElbow.rotation.x = -0.24 + pulse * 0.1;
        b.neck.rotation.x = pulse * 0.05;
        break;
      case "crank": {
        const cycle = progress * Math.PI * 2.0;
        b.torso.rotation.z = Math.sin(cycle) * 0.06;
        b.rightShoulder.rotation.x = -0.2 + Math.sin(cycle) * 0.22;
        b.rightElbow.rotation.x = -0.38 + Math.cos(cycle) * 0.18;
        b.leftShoulder.rotation.x = -0.16 + Math.sin(cycle + Math.PI) * 0.12;
        b.leftElbow.rotation.x = -0.3 + Math.cos(cycle + Math.PI) * 0.1;
        b.neck.rotation.z = Math.sin(cycle * 0.5) * 0.04;
        break;
      }
      case "brace":
        b.torso.rotation.x = 0.1 + pulse * 0.08;
        b.leftShoulder.rotation.x = -0.12 + pulse * 0.08;
        b.rightShoulder.rotation.x = -0.12 + pulse * 0.08;
        b.leftElbow.rotation.x = -0.22;
        b.rightElbow.rotation.x = -0.22;
        b.leftHip.rotation.x = 0.08 * pulse;
        b.rightHip.rotation.x = 0.08 * pulse;
        break;
      case "carry":
        b.torso.rotation.x = 0.06 + pulse * 0.04;
        b.leftShoulder.rotation.x = -0.18;
        b.rightShoulder.rotation.x = -0.18;
        b.leftElbow.rotation.x = -0.34 + pulse * 0.08;
        b.rightElbow.rotation.x = -0.34 + pulse * 0.08;
        b.torso.rotation.z = Math.sin(t * 6) * 0.04 * settle;
        break;
      case "breath":
        b.torso.rotation.x = 0.08 + pulse * 0.12;
        b.neck.rotation.x = 0.14 + pulse * 0.18;
        b.leftShoulder.rotation.x = -0.08;
        b.rightShoulder.rotation.x = -0.08;
        b.leftElbow.rotation.x = -0.16;
        b.rightElbow.rotation.x = -0.16;
        break;
      default:
        break;
    }

    b.leftShoulder.rotation.z += Math.sin(t * 4.5) * 0.04 * settle;
    b.rightShoulder.rotation.z += Math.sin(t * 4.5 + 1.2) * 0.04 * settle;
    b.neck.rotation.z += Math.sin(t * 3.8) * 0.03 * settle;

    if (progress >= 1) {
      this._attackMotion = "strike";
      this._state = AnimState.Idle;
    }
  }

  /**
   * A cast is not a club swing from attention. The caster keeps his stance and his hold and works from them: the rod comes up off the ground and back over the shoulder
   * with the chest turned and leant away and the other hand thrown up and out at the enemy, then the rod is driven forward at him, arm near straight and the chest
   * after it, the other arm flung back, and he settles to the hold again.
   */
  private _animateCast(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    this._animateIdleHumanoid();
    const step = (from: number, to: number): number => {
      const u = Math.max(0, Math.min(1, (progress - from) / (to - from)));
      return u * u * (3 - 2 * u);
    };
    if (this._carry?.ready?.overhead) {
      // Staff up (CAST_RAISE_*): the staff arm goes straight up and holds there through the loose, the chest lifts and leans a little back under it, the
      // free arm hangs out and back at his side, the weight sits back over the rear foot
      const up = step(0, CAST_RAISE_UP) * (1 - step(CAST_HOLD, 1));
      const kk = 1 - Math.min(1, this._limp);
      const side = Math.sign(b.rightShoulder.position.x) || 1;
      const set = (joint: TransformNode, axis: "x" | "y" | "z", value: number): void => {
        joint.rotation[axis] += (value - joint.rotation[axis]) * up * kk;
      };
      set(b.rightShoulder, "x", CAST_RAISE_ARM.raise);
      set(b.rightShoulder, "z", CAST_RAISE_ARM.out);
      set(b.rightElbow, "x", CAST_RAISE_ARM.elbow);
      set(b.leftShoulder, "x", 0.25);
      set(b.leftShoulder, "z", -0.45);
      set(b.leftElbow, "x", -0.3);
      b.torso.rotation.x -= 0.16 * up * kk;
      b.neck.rotation.x -= 0.12 * up * kk;
      set(b.leftHip, "x", -0.28);
      set(b.leftKnee, "x", 0.12);
      set(b.rightHip, "x", 0.18);
      set(b.rightKnee, "x", 0.22);
      this._castLift = up;
      this._castReach = 0;
      this._castTip = new Vector3(CAST_RAISE_TIP.x * side, CAST_RAISE_TIP.y, CAST_RAISE_TIP.z);
      this._castLevel = up * kk;
      if (progress >= 1) this._state = AnimState.Idle;
      return;
    }
    this._castTip = CAST_LEVEL_TIP;
    const wind = step(0, 0.5) * (1 - step(0.55, CAST_LOOSE));
    // The missile leaves the staff's head at CAST_LOOSE; he holds the staff thrust level at the enemy until CAST_HOLD and only then lets it back to the hold
    const drive = step(0.55, CAST_LOOSE) * (1 - step(CAST_HOLD, 1));
    const k = 1 - Math.min(1, this._limp);
    const to = (joint: TransformNode, axis: "x" | "y" | "z", back: number, ahead: number): void => {
      joint.rotation[axis] += (back - joint.rotation[axis]) * wind * k;
      joint.rotation[axis] += (ahead - joint.rotation[axis]) * drive * k;
    };
    to(b.rightShoulder, "x", Math.max(-3.0, Math.min(b.rightShoulder.rotation.x, -1.2) - 0.9), -1.45);
    to(b.rightShoulder, "z", 0.4, 0.05);
    to(b.rightElbow, "x", -1.7, -0.15);
    to(b.leftShoulder, "x", -1.5, 0.55);
    to(b.leftShoulder, "z", -0.2, -0.55);
    to(b.leftElbow, "x", -0.45, -0.35);
    b.torso.rotation.x += (-0.24 * wind + 0.3 * drive) * k;
    b.torso.rotation.y += (0.32 * wind - 0.28 * drive) * k;
    b.neck.rotation.y -= (0.25 * wind - 0.2 * drive) * k;
    b.neck.rotation.x += 0.1 * drive * k;
    // The legs take it as a stride, not a squat: on the wind-up the weight goes back onto the rod-side leg, which folds a little while the other foot is set out ahead,
    // and the drive goes forward through that leading leg, its knee giving under him as the rear leg straightens out behind and pushes.
    to(b.leftHip, "x", -0.3, -0.52);
    to(b.leftKnee, "x", 0.18, 0.5);
    to(b.rightHip, "x", 0.1, 0.42);
    to(b.rightKnee, "x", 0.3, 0.06);
    to(b.leftHip, "z", 0, 0);
    to(b.rightHip, "z", 0, 0);
    this._castLift = Math.max(wind, drive);
    this._castReach = -0.45 * wind + 1.1 * drive;
    this._castLevel = drive * k;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateAttackHumanoid(dt: number): void {
    if ((this._carry ??= this._buildCarry()).ready?.cast) {
      this._animateCast(dt);
      return;
    }
    this._attackTimer += dt;
    const b = this._body;
    const t = this._time + this._wobblePhase;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const pulse = Math.sin(progress * Math.PI);
    const settle = 1 - progress;

    if (progress < 0.5) {
      const windUp = progress * 2;
      b.rightShoulder.rotation.x = -2.0 * windUp;
      b.rightShoulder.rotation.z = 0.3 * windUp;
      b.rightElbow.rotation.x = -0.8 * windUp;
      b.torso.rotation.x = -0.25 * windUp;
    } else {
      const swing = (progress - 0.5) * 2;
      const eased = 1 - Math.pow(1 - swing, 3);
      b.rightShoulder.rotation.x = -2.0 + 3.6 * eased;
      b.rightShoulder.rotation.z = 0.3 - 0.3 * eased;
      b.rightElbow.rotation.x = -0.8 + 0.8 * eased;
      b.torso.rotation.x = -0.25 + 0.65 * eased;
    }

    b.leftShoulder.rotation.x += Math.sin(t * 6) * 0.08 * settle;
    b.leftShoulder.rotation.z += Math.sin(t * 7 + 1) * 0.06 * settle;

    b.leftHip.rotation.x = Math.sin(t * 4) * 0.05;
    b.rightHip.rotation.x = 0.12 + pulse * 0.06;
    b.leftKnee.rotation.x = pulse * 0.04;
    b.rightKnee.rotation.x = 0.08 + pulse * 0.06;

    b.neck.rotation.x += 0.08 + pulse * 0.03;
    b.neck.rotation.z += Math.sin(t * 5) * 0.05 * settle;

    if (progress >= 1) {
      this._state = AnimState.Idle;
    }
  }

  /**
   * Heavy swing (club, mace, hammer, pan): an overhead blow, not a level shove of the arm (ref trailer_3_sheet_01 r2c3).
   * - Wind-up (0 -> commit): the weapon arm goes up past the head, shoulder to -2.75 rad (nearly vertical) with the elbow folded 1.25, so the fist is
   *   above and behind the crown; the trunk arches back 0.25 and twists 0.2 onto the weapon side; the head lifts to the mark. The head of the club points
   *   up and back over the shoulder, its arc angle CLUB_COCK (-0.4 rad from vertical, behind: at 0.85 a side view read it as level).
   * - Drop (commit -> 45% of what is left): a committed downswing, eased in hard. Shoulder to +0.5 (fist below and ahead of the chest), elbow out to -0.15,
   *   trunk folds forward 0.55 over a front knee bent 0.35; the club's arc runs through vertical to CLUB_LAND (+1.8 rad, head forward and a little down, at the
   *   target's chest: at 2.05 it was driven into the turf).
   * - Recover (the rest): he heaves it back up two thirds of the way to the cock, so a press between blows is clubs held up, not clubs left lying forward.
   * - Swung at a marked press man (press-mark-held, see _pressAim): the cock is PRESS_CLUB_COCK, back over the shoulder, from the first frame; the drop lands the
   *   club down on that man's board line (_pressLand) and the recover keeps it there, as the press beat does, instead of heaving it back up near vertical.
   * The club's arc is handed to _carryProp through _clubArc/_clubHold and turned in the fist there; the arm alone could not stand it up overhead.
   */
  /** True for the hay baler: his stick (id hayStick) is whacked from the shoulder (STICK_WHACK), not brought down from overhead. */
  private _whacks(): boolean {
    return (this._carry ??= this._buildCarry()).weapon?.prop?.node.id === "hayStick";
  }

  /** The hay baler's stick whack (spec at STICK_WHACK). */
  private _animateWhack(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const W = STICK_WHACK;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.45);
    const land = commit + (1 - commit) * W.land;
    const hold = commit + (1 - commit) * W.hold;
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    // c: 0 at rest, 1 cocked; h: 0 cocked, 1 landed; r: how far eased back to the carry
    let c = 0, h = 0;
    if (progress < commit) {
      const u = progress / Math.max(commit, 0.001);
      c = u * (2 - u);
    } else if (progress < land) {
      const u = (progress - commit) / Math.max(land - commit, 0.001);
      c = 1;
      h = u * u;
    } else {
      c = 1;
      h = 1;
    }
    const r = progress > hold ? (progress - hold) / Math.max(1 - hold, 0.001) : 0;
    const k = 1 - r * (2 - r);
    const shoulder = (W.cock + (W.hit - W.cock) * h) * c;
    b.rightShoulder.rotation.x = shoulder * k;
    b.rightShoulder.rotation.z = (W.out - W.out * 1.2 * h) * c * k;
    b.rightElbow.rotation.x = (W.fold + (W.reach - W.fold) * h) * c * k;
    b.leftShoulder.rotation.x = (-0.3 + (W.offSwing + 0.3) * h) * c * k;
    b.leftShoulder.rotation.z = -0.2 * c * k;
    b.leftElbow.rotation.x = -0.4 * c * k;
    b.torso.rotation.x = (-0.1 + (W.pitch + 0.1) * h) * c * k;
    b.torso.rotation.y = (W.twist - 2 * W.twist * h) * side * c * k;
    b.rightHip.rotation.x = 0.15 * h * k;
    b.leftHip.rotation.x = -0.25 * h * k;
    b.leftKnee.rotation.x = 0.2 * h * k;
    b.rightKnee.rotation.x = 0.1;
    this._clubArc = W.cockArc + (W.hitArc - W.cockArc) * h;
    this._clubHold = c * k;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  /** True for the harvester: his low-carried scythe sweeps level across his front (SCYTHE_SWEEP), not chopped from overhead. */
  private _sweeps(): boolean {
    this._carry ??= this._buildCarry();
    return this._lowScythe;
  }

  /** True for the farmer: his pitchfork (forkBar) is stabbed level at the enemy (FORK_STAB). */
  private _stabsFork(): boolean {
    return this._body.rightHand.getChildren().some((n) => n.getChildren().some((c) => c.name === "forkBar"));
  }

  /*
   * [R] The farmer's two-fisted low carry (349; farmer.farmer.red.png, .blue.png, farmer.farmer.png). Read off the renders: the weapon fist hangs at his
   * own hip, a little ahead of the thigh and just under the hip joint; the shaft runs from it low and near level across the front of his thighs to his off
   * side and forward, the head out past the off hip, tines forward; the off arm reaches across the belly and closes on the shaft a third of the way up.
   * Not set by joint angles (342/346 left the off fist floating): the shaft is a line laid in his own frame, and both arms are solved onto it every frame.
   *   weapon fist FORK_HOLD.out of the hip height out to his weapon side, .drop below the hip joint, .ahead in front of it;
   *   350 [S]: the shaft is the chord from that fist to a head seat at hip height (.up), FORK_HOLD.reach of the hip height out from the hip along
   *   (-.across to the off side, .forward ahead), laid in the world from the solved fist, so no hip or trunk pitch tips it (349 left the head 0.2 m under
   *   the hip at mid-thigh); turned about the shaft so the tines' curl faces (.curlAhead ahead, .curlDown down), hooked forward and down as on the
   *   renders, not left at whatever roll the shortest turn gave; the fork turned in the fist onto that line (_turnFork, as the stab turns it onto its own);
   *   off fist onto the shaft by _twoHandPole (POLE_GRIP.forkBar span). The stab blends the line over to its own by its weight, so the carry holds
   *   in idle, walking, the back-step and the draw, and comes back after the drive.
   */
  // The pitchfork in the weapon fist (the mesh carrying forkBar) and its strapped turn and seat there, looked up once
  private _forkProp: { node: TransformNode; rest: Quaternion; quat: boolean; pos: Vector3 } | null | undefined = undefined;
  /** The fork turned in the fist onto the carry's line (FORK_HOLD, the weapon arm solved onto its seat) or the stab's (FORK_STAB, _sweepTip) by the stab's weight; limp, back to its strap. */
  private _turnFork(): void {
    if (this._forkProp === undefined) {
      const node = this._body.rightHand.getChildren().find((n) => n.getChildren().some((c) => c.name === "forkBar")) as TransformNode | undefined;
      this._forkProp = node ? {
        node, quat: !!node.rotationQuaternion, pos: node.position.clone(),
        rest: node.rotationQuaternion?.clone() ?? Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z),
      } : null;
    }
    const f = this._forkProp;
    if (!f) return;
    const b = this._body;
    const stabbing = this._stabClock >= 0 && this._sweepTip !== null;
    const live = 1 - Math.min(1, this._limp);
    const st = this._state;
    const carrying = st === AnimState.Idle || st === AnimState.Walking || st === AnimState.Attacking;
    const stabW = stabbing ? Math.min(1, this._clubHold) : 0;
    // the carry's weight (spec at FORK_HOLD): whatever of him the stab has not taken
    const carryW = carrying ? (1 - stabW) * live : 0;
    const w = Math.min(1, stabW * live + carryW);
    if (w <= 0.001) {
      if (f.node.rotationQuaternion && !f.quat) f.node.rotationQuaternion = null;
      else if (f.quat) f.node.rotationQuaternion = f.rest.clone();
      f.node.position.copyFrom(f.pos);
      return;
    }
    const hand = b.rightHand;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const yaw = Quaternion.RotationYawPitchRoll(b.root.rotation.y, 0, 0);
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    const C = FORK_HOLD;
    if (carryW > 0.001) {
      // the weapon fist onto its seat before the hip, in his own frame
      b.hip.computeWorldMatrix(true);
      const hipAt = b.hip.getAbsolutePosition();
      const tall = Math.max(0.2, hipAt.y - b.root.getAbsolutePosition().y);
      const seat = hipAt.add(new Vector3(side * C.out, C.drop, C.ahead).scale(tall).rotateByQuaternionToRef(yaw, new Vector3()));
      this._armTo(b.rightShoulder, b.rightElbow, hand, seat, carryW, 2);
      for (const n of chain) n.computeWorldMatrix(true);
    }
    // the carry's chord in the world: the solved fist to the head seat at hip height past the off hip
    b.hip.computeWorldMatrix(true);
    const hipNow = b.hip.getAbsolutePosition();
    const tallNow = Math.max(0.2, hipNow.y - b.root.getAbsolutePosition().y);
    const headSeat = hipNow.add(new Vector3(-side * C.across, C.up, C.forward).scale(C.reach * tallNow).rotateByQuaternionToRef(yaw, new Vector3()));
    const shaftDir = headSeat.subtract(hand.getAbsolutePosition());
    if (shaftDir.lengthSquared() < 1e-6) shaftDir.set(-side * C.across, 0, C.forward);
    shaftDir.normalize();
    // ...turned about it so the tines (the prop's +z curl) hook ahead and down
    const curl = new Vector3(0, -C.curlDown, C.curlAhead).rotateByQuaternionToRef(yaw, new Vector3());
    curl.subtractInPlace(shaftDir.scale(Vector3.Dot(curl, shaftDir)));
    if (curl.lengthSquared() < 1e-6) curl.set(0, -1, 0);
    curl.normalize();
    const lay = Quaternion.RotationQuaternionFromAxis(Vector3.Cross(shaftDir, curl), shaftDir, curl);
    const attitude = stabbing ? Quaternion.Slerp(lay, yaw.multiply(Quaternion.FromUnitVectorsToRef(Vector3.UpReadOnly, this._sweepTip!, new Quaternion())), stabW) : lay;
    const turn = Quaternion.Slerp(f.rest, Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(attitude), w);
    f.node.rotationQuaternion = turn;
    const held = new Vector3(0, f.pos.length(), 0).rotateByQuaternionToRef(turn, new Vector3());
    Vector3.LerpToRef(f.pos, held, w, f.node.position);
  }

  // The banjo in the weapon fist (the mesh carrying banjoNeck) and its strapped turn and seat there, looked up once
  private _banjoProp: { node: TransformNode; rest: Quaternion; quat: boolean; pos: Vector3 } | null | undefined = undefined;
  /** The banjo laid across him (BANJO_HOLD): the weapon arm solved onto its seat at the hip and the banjo turned in the fist onto the neck's line. */
  private _holdBanjo(): void {
    if (this._banjoProp === undefined) {
      const node = this._body.rightHand.getChildren().find((n) => n.getChildren().some((c) => c.name === "banjoNeck")) as TransformNode | undefined;
      this._banjoProp = node ? {
        node, quat: !!node.rotationQuaternion, pos: node.position.clone(),
        rest: node.rotationQuaternion?.clone() ?? Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z),
      } : null;
    }
    const f = this._banjoProp;
    if (!f) return;
    const b = this._body;
    const st = this._state;
    const w = st === AnimState.Idle || st === AnimState.Walking ? 1 - Math.min(1, this._limp) : 0;
    if (w <= 0.001) {
      if (f.node.rotationQuaternion && !f.quat) f.node.rotationQuaternion = null;
      else if (f.quat) f.node.rotationQuaternion = f.rest.clone();
      f.node.position.copyFrom(f.pos);
      return;
    }
    const hand = b.rightHand;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const yaw = Quaternion.RotationYawPitchRoll(b.root.rotation.y, 0, 0);
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    const C = BANJO_HOLD;
    b.hip.computeWorldMatrix(true);
    const hipAt = b.hip.getAbsolutePosition();
    const tall = Math.max(0.2, hipAt.y - b.root.getAbsolutePosition().y);
    const seat = hipAt.add(new Vector3(side * C.out, C.up, C.ahead).scale(tall).rotateByQuaternionToRef(yaw, new Vector3()));
    this._armTo(b.rightShoulder, b.rightElbow, hand, seat, w, 2);
    for (const n of chain) n.computeWorldMatrix(true);
    // the neck up across his chest, the pot's face (the prop's +z) out before him
    const neckDir = new Vector3(-side * C.across, C.rise, C.forward).normalize().rotateByQuaternionToRef(yaw, new Vector3());
    const face = new Vector3(0, 0, 1).rotateByQuaternionToRef(yaw, new Vector3());
    face.subtractInPlace(neckDir.scale(Vector3.Dot(face, neckDir)));
    if (face.lengthSquared() < 1e-6) face.set(0, 0, 1);
    face.normalize();
    const lay = Quaternion.RotationQuaternionFromAxis(Vector3.Cross(neckDir, face), neckDir, face);
    const turn = Quaternion.Slerp(f.rest, Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(lay), w);
    f.node.rotationQuaternion = turn;
    const held = new Vector3(0, f.pos.length(), 0).rotateByQuaternionToRef(turn, new Vector3());
    Vector3.LerpToRef(f.pos, held, w, f.node.position);
  }

  /** The farmer's pitchfork stab (spec at FORK_STAB): the attack's own state only runs out the time; the pose is _holdForkStab's, on its own clock. */
  private _animateForkStab(dt: number): void {
    this._attackTimer += dt;
    if (this._attackTimer >= this._attackDuration) this._state = AnimState.Idle;
  }

  // The stab's own clock (s, -1 when none) and its length: a stab the walk cuts short in the animation still goes home on the man when the sim lands it
  private _stabClock = -1;
  private _stabDuration = 1;
  /** The stab laid over whatever the legs and arms are doing (a pose layer, after locomotion), from the trigger to FORK_STAB.back past the attack's end. */
  private _holdForkStab(dt: number): void {
    if (this._stabClock < 0) return;
    const b = this._body;
    const F = FORK_STAB;
    if (this._state === AnimState.Dead || this._stabClock > this._stabDuration * (1 + F.back)) {
      this._stabClock = -1;
      return;
    }
    const progress = this._stabClock / this._stabDuration;
    this._stabClock += dt;
    // the sim holds the blow for FORK_STAB.land of the attack (blowLandsIn): the drive is home on that frame
    const land = F.land;
    const commit = land * F.commit;
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    const smooth = (u: number): number => { const c = Math.max(0, Math.min(1, u)); return c * c * (3 - 2 * c); };
    // g: drawn back; e: driven out; r: eased back off the hold after the attack's end
    const g = smooth(progress / Math.max(commit, 0.001));
    const e = progress < commit ? 0 : 1 - Math.pow(1 - Math.min(1, (progress - commit) / Math.max(land - commit, 0.001)), 2.4);
    const r = smooth((progress - 1) / F.back);
    const w = (1 - r) * (1 - Math.min(1, this._limp));
    const out = e;
    const drawn = g * (1 - e);
    // the fork level at him, tines a touch up when drawn and down onto his chest when driven home
    this._sweepTip = new Vector3(0, F.cock * drawn + F.dip * out, 1).normalize();
    this._clubHold = Math.max(this._clubHold, w * Math.max(g, out));
    const set = (j: TransformNode, axis: "x" | "y" | "z", v: number): void => { j.rotation[axis] += (v - j.rotation[axis]) * w; };
    set(b.rightShoulder, "x", F.drawRaise * drawn + F.reach * out);
    set(b.rightShoulder, "z", 0.15 * drawn);
    set(b.rightElbow, "x", F.drawElbow * drawn - 0.12 * out);
    set(b.leftShoulder, "x", -0.75 * drawn + F.offReach * out);
    set(b.leftShoulder, "z", -0.3 * drawn - 0.15 * out);
    set(b.leftElbow, "x", -0.9 * drawn - 0.2 * out);
    set(b.torso, "y", side * F.turn * drawn - side * 0.12 * out);
    set(b.torso, "x", -0.1 * drawn + F.pitch * out);
    set(b.neck, "x", 0.08 * drawn - 0.15 * out);
    set(b.rightHip, "x", 0.2 * drawn + F.front * out);
    set(b.rightKnee, "x", 0.25 * drawn + F.knee * out);
    set(b.leftHip, "x", -0.15 * drawn + 0.35 * out);
    set(b.leftKnee, "x", 0.2 * drawn);
    this._hipRest ??= b.hip.position.y;
    this._lungeStep.set(0, 0, this._hipRest * (F.step * out - 0.08 * drawn) * w);
    b.hip.position.addInPlace(this._lungeStep);
  }

  /** The harvester's sweep (spec at SCYTHE_SWEEP). */
  private _animateSweep(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const S = SCYTHE_SWEEP;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.45);
    const through = commit + (1 - commit) * S.through;
    const hold = commit + (1 - commit) * S.hold;
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    // c: 0 at rest, 1 cocked; h: 0 cocked, 1 swept through
    let c = 0, h = 0;
    if (progress < commit) {
      const u = progress / Math.max(commit, 0.001);
      c = u * (2 - u);
    } else {
      const u = Math.min(1, (progress - commit) / Math.max(through - commit, 0.001));
      c = 1;
      h = u * u * (3 - 2 * u);
    }
    const r = progress > hold ? (progress - hold) / Math.max(1 - hold, 0.001) : 0;
    const k = 1 - r * (2 - r);
    const yaw = S.cock + (S.end - S.cock) * h;
    this._sweepTip = new Vector3(Math.sin(yaw) * side, -S.low, Math.cos(yaw)).normalize();
    const twist = S.twist * (1 - 2 * h) * side;
    b.torso.rotation.y = twist * c * k;
    b.torso.rotation.x = 0.18 * c * k;
    b.rightShoulder.rotation.x = S.arm * c * k;
    b.rightShoulder.rotation.z = 0.2 * c * k;
    b.rightElbow.rotation.x = -0.35 * c * k;
    b.leftShoulder.rotation.x = S.arm * c * k;
    b.leftShoulder.rotation.z = -0.25 * c * k;
    b.leftElbow.rotation.x = -0.45 * c * k;
    b.leftHip.rotation.x = -S.crouch * 0.6 * c * k;
    b.rightHip.rotation.x = -S.crouch * 0.6 * c * k;
    b.leftKnee.rotation.x = S.crouch * c * k;
    b.rightKnee.rotation.x = S.crouch * c * k;
    this._clubHold = c * k;
    if (progress >= 1) {
      this._state = this._afterSweep ?? AnimState.Idle;
      this._afterSweep = null;
      this._sweepTip = null;
    }
  }

  private _animateHeavySwing(dt: number): void {
    if (this._whacks()) {
      this._animateWhack(dt);
      return;
    }
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.45);
    const drop = commit + (1 - commit) * 0.45;
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    const pressed = this._pressAim() !== null;
    const cockElbow = pressed ? PRESS_AIM_ELBOW.cock : -1.25;
    // his own cock depth on a marked man (ready-club-upright)
    const depth = WAIT_CLUB_DEPTH.min + (1 - WAIT_CLUB_DEPTH.min) * (this._vary(8) * 0.5 + 0.5);
    if (progress < commit) {
      const w = progress / Math.max(commit, 0.001);
      const windUp = w * (2 - w); // eased out: up fast, slowing into the cock
      b.rightShoulder.rotation.x = -2.75 * windUp;
      b.rightShoulder.rotation.z = 0.3 * windUp;
      b.rightElbow.rotation.x = cockElbow * windUp;
      b.leftShoulder.rotation.x = -0.7 * windUp;
      b.leftShoulder.rotation.z = -0.35 * windUp;
      b.leftElbow.rotation.x = -0.5 * windUp;
      b.torso.rotation.x = -0.25 * windUp;
      b.torso.rotation.y = 0.2 * side * windUp;
      b.neck.rotation.x = -0.12 * windUp;
      b.rightHip.rotation.x = 0.18 * windUp;
      b.leftHip.rotation.x = -0.22 * windUp;
      b.leftKnee.rotation.x = 0.12 * windUp;
      // On a marked man the club comes up through upright and only tips back to his own cock (WAIT_CLUB_DEPTH of PRESS_CLUB_COCK, per man) as the windup
      // nears its commit (ready-club-upright), so neighbours a beat apart hold their clubs at different slopes, not all on the one cocked diagonal
      this._clubArc = pressed ? WAIT_CLUB.arc + (PRESS_CLUB_COCK * depth - WAIT_CLUB.arc) * windUp * windUp * windUp : CLUB_COCK * windUp;
    } else {
      const swing = Math.min(1, (progress - commit) / Math.max(drop - commit, 0.001));
      const eased = swing * swing * (3 - 2 * swing) * 0.4 + swing * swing * 0.6; // slow off the cock, fastest at the bottom
      const back = progress > drop && !pressed ? (progress - drop) / Math.max(1 - drop, 0.001) : 0;
      const e = eased - back * (2 - back) * 0.65;
      // On a marked press man the fist stops raised before the face (the press beat's landed arm), so the club laid down from it meets his board top
      b.rightShoulder.rotation.x = -2.75 + (pressed ? 0.25 + PRESS_AIM_ARM : 3.25) * e;
      b.rightShoulder.rotation.z = 0.3 - 0.4 * e;
      b.rightElbow.rotation.x = pressed ? cockElbow + (PRESS_AIM_ELBOW.land - cockElbow) * e : -1.25 + 1.1 * e;
      b.leftShoulder.rotation.x = -0.7 + 0.9 * e;
      b.leftShoulder.rotation.z = -0.35 + 0.1 * e;
      b.leftElbow.rotation.x = -0.5 + 0.1 * e;
      b.torso.rotation.x = -0.25 + 0.8 * e;
      b.torso.rotation.y = (0.2 - 0.35 * e) * side;
      b.neck.rotation.x = -0.12 + 0.1 * e;
      b.rightHip.rotation.x = 0.18 + 0.12 * e;
      b.leftHip.rotation.x = -0.22 - 0.2 * e;
      b.leftKnee.rotation.x = 0.12 + 0.23 * e;
      if (pressed) {
        this._clubArc = PRESS_CLUB_COCK * depth;
        this._pressLand = e;
      } else this._clubArc = CLUB_COCK + (CLUB_LAND - CLUB_COCK) * e;
    }
    this._clubHold = 1;
    b.rightKnee.rotation.x = 0.12;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  // The fencer's rapier, looked up on first use (props go on after the animator is made), and its rest in the fist
  private _rapierProp: { node: TransformNode; rest: Quaternion; grip: Vector3 } | null | undefined = undefined;
  private _rapier(): { node: TransformNode; rest: Quaternion; grip: Vector3 } | null {
    if (this._rapierProp === undefined) {
      const node = this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "rapier");
      this._rapierProp = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), grip: node.position.clone() } : null;
    }
    return this._rapierProp;
  }
  private readonly _lungeStep = new Vector3(0, 0, 0);
  private _lungeOut = 0;

  // The blade's lift above level that the lunge last asked for (see RAPIER_POINT), read by _pointRapier while the lunge runs
  private _rapierLift = 0;
  /** The rapier stood in the world point-first along his front (see RAPIER_POINT), its hilt kept in the fist, over every living state. */
  private _pointRapier(): void {
    const r = this._rapier();
    if (!r) return;
    const w = this._state === AnimState.Dead || this.walkStyle === "quadruped" ? 0 : 1 - Math.min(1, this._limp);
    if (w <= 0.001) {
      if (r.node.rotationQuaternion) {
        r.node.rotationQuaternion = null;
        r.node.position.copyFrom(r.grip);
      }
      return;
    }
    const lunging = this._state === AnimState.Attacking && this._attackMotion === "blade_slash";
    const lift = lunging ? this._rapierLift : RAPIER_POINT.guard;
    const b = this._body;
    for (const n of [b.root, b.hip, b.torso, b.rightShoulder, b.rightElbow, b.rightHand]) n.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    // The blade (+y) out along his front, lifted `lift`; the quillons (x) level across it
    const y = fwd.scale(Math.cos(lift)).addInPlace(new Vector3(0, Math.sin(lift), 0)).normalize();
    const x = Vector3.Cross(Vector3.Up(), y).normalize();
    const z = Vector3.Cross(x, y).normalize();
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, y, z, world);
    const handRot = new Quaternion();
    b.rightHand.getWorldMatrix().decompose(undefined, handRot);
    const hand = Matrix.Identity();
    handRot.toRotationMatrix(hand);
    const q = Quaternion.Slerp(r.rest, Quaternion.FromRotationMatrix(world.multiply(hand.transpose())), w);
    r.node.rotationQuaternion = q;
    // The hilt stays where it sat in the fist: the point of the blade's frame that rested on the hand's origin is kept on it
    const restInv = Matrix.Identity();
    Quaternion.Inverse(r.rest).toRotationMatrix(restInv);
    const turn = Matrix.Identity();
    q.toRotationMatrix(turn);
    r.node.position.copyFrom(Vector3.TransformCoordinates(Vector3.TransformCoordinates(r.grip, restInv), turn));
  }

  // The off-hand stone axe, looked up on first use (props go on after the animator is made), and its rest in the fist
  private _offAxeProp: { node: TransformNode; rest: Quaternion; grip: Vector3 } | null | undefined = undefined;
  private _offAxe(): { node: TransformNode; rest: Quaternion; grip: Vector3 } | null {
    if (this._offAxeProp === undefined) {
      const node = this._body.leftHand.getChildren().find((n): n is TransformNode => n.name === "handle" && n.getChildren().some((c) => c.name === "stoneAxeHead"));
      this._offAxeProp = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), grip: node.position.clone() } : null;
    }
    return this._offAxeProp;
  }
  /** The off-hand stone axe stood up in the world at his off side (see OFF_AXE), its grip kept in the fist, over every living state. */
  private _standOffhandAxe(): void {
    const r = this._offAxe();
    if (!r) return;
    const w = this._state === AnimState.Dead || this.walkStyle === "quadruped" ? 0 : 1 - Math.min(1, this._limp);
    if (w <= 0.001) {
      if (r.node.rotationQuaternion) {
        r.node.rotationQuaternion = null;
        r.node.position.copyFrom(r.grip);
      }
      return;
    }
    this._standAxe(r, this._body.leftShoulder, this._body.leftElbow, this._body.leftHand, w);
  }

  // The main-hand stone axe (looked up as the off one) and how far it is stood up (see MAIN_AXE)
  private _mainAxeProp: { node: TransformNode; rest: Quaternion; grip: Vector3 } | null | undefined = undefined;
  private _mainAxeUp = 0;
  /** The main-hand stone axe stood up at his main side, the main arm mirrored off the off arm, while he is not attacking (see MAIN_AXE). */
  private _standMainAxe(dt: number): void {
    if (this._mainAxeProp === undefined) {
      const node = this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "handle" && n.getChildren().some((c) => c.name === "stoneAxeHead"));
      this._mainAxeProp = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), grip: node.position.clone() } : null;
    }
    const r = this._mainAxeProp;
    if (!r) return;
    const live = this._state !== AnimState.Dead && this.walkStyle !== "quadruped";
    const target = live && this._state !== AnimState.Attacking ? 1 - Math.min(1, this._limp) : 0;
    this._mainAxeUp += (target - this._mainAxeUp) * Math.min(1, dt * MAIN_AXE.ease);
    const w = this._mainAxeUp;
    if (w <= 0.001) {
      if (r.node.rotationQuaternion) {
        r.node.rotationQuaternion = null;
        r.node.position.copyFrom(r.grip);
      }
      return;
    }
    const b = this._body;
    // The main arm takes the off arm's pose mirrored across his midline
    for (const [main, off] of [[b.rightShoulder, b.leftShoulder], [b.rightElbow, b.leftElbow]] as const) {
      main.rotation.x += (off.rotation.x - main.rotation.x) * w;
      main.rotation.y += (-off.rotation.y - main.rotation.y) * w;
      main.rotation.z += (-off.rotation.z - main.rotation.z) * w;
    }
    this._standAxe(r, b.rightShoulder, b.rightElbow, b.rightHand, w);
  }

  /** Stands a stone axe up in the world at the side of `shoulder` (see OFF_AXE), its grip kept in `hand`'s fist, `w` of the way from its rest. */
  private _standAxe(r: { node: TransformNode; rest: Quaternion; grip: Vector3 }, shoulder: TransformNode, elbow: TransformNode, handNode: TransformNode, w: number): void {
    const b = this._body;
    for (const n of [b.root, b.hip, b.torso, shoulder, elbow, handNode]) n.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    // His side, level: the way that shoulder sits from the middle
    const side = Math.sign(shoulder.position.x) || -1;
    const out = Vector3.TransformNormal(new Vector3(side, 0, 0), b.root.getWorldMatrix());
    out.y = 0;
    if (out.lengthSquared() < 1e-6) out.copyFrom(Vector3.Cross(fwd, Vector3.Up()));
    out.normalize();
    // The handle up, leant out and forward; the stone (+z) turned out ahead of him, squared off the handle
    const y = new Vector3(0, 1, 0).addInPlace(out.scale(OFF_AXE.out)).addInPlace(fwd.scale(OFF_AXE.ahead)).normalize();
    const face = fwd.scale(OFF_AXE.face[0]).addInPlace(out.scale(OFF_AXE.face[1]));
    const x = Vector3.Cross(y, face).normalize();
    const z = Vector3.Cross(x, y).normalize();
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, y, z, world);
    const handRot = new Quaternion();
    handNode.getWorldMatrix().decompose(undefined, handRot);
    const hand = Matrix.Identity();
    handRot.toRotationMatrix(hand);
    const q = Quaternion.Slerp(r.rest, Quaternion.FromRotationMatrix(world.multiply(hand.transpose())), w);
    r.node.rotationQuaternion = q;
    // The grip stays where it sat in the fist
    const restInv = Matrix.Identity();
    Quaternion.Inverse(r.rest).toRotationMatrix(restInv);
    const turn = Matrix.Identity();
    q.toRotationMatrix(turn);
    r.node.position.copyFrom(Vector3.TransformCoordinates(Vector3.TransformCoordinates(r.grip, restInv), turn));
  }

  /** The plank shield stood square before his face (see SLAB_FRONT), its eye hole at his eyes, over every living state. */
  private _holdSlab(): void {
    const shield = this._shieldBoard();
    // ...and the scutum (378): the same hold, its top rim under his eyes (its own holeUp, propBuilder SCUTUM)
    if (!shield || (shield.name !== "slabshield" && shield.name !== "scutumshield")) return;
    const rest = (this._boardRest ??= shield.position.clone());
    const w = this._state === AnimState.Dead || this.walkStyle === "quadruped" ? 0 : (1 - Math.min(1, this._limp)) * (1 - this._boardOffWeight());
    if (w <= 0.001) {
      if (shield.rotationQuaternion) {
        shield.rotationQuaternion = null;
        shield.position.copyFrom(rest);
      }
      return;
    }
    const b = this._body;
    for (const n of [b.root, b.hip, b.torso, b.neck]) n.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    const scale = b.root.absoluteScaling.y || 1;
    const stature = (b.metrics.overallHeight || 1.6) * scale / (b.root.scaling.y || 1);
    const p = this._state === AnimState.Attacking ? Math.min(1, this._attackTimer / Math.max(this._attackDuration, 0.001)) : 0;
    const reach = (SLAB_FRONT.reach + SLAB_FRONT.bash * Math.sin(Math.PI * p)) * stature;
    // The eye hole's world point: on his midline under the neck, at his eye, out ahead
    const neck = b.neck.getAbsolutePosition();
    const eye = (b.leftEye ?? b.neck).getAbsolutePosition();
    const hole = new Vector3(neck.x + fwd.x * reach, eye.y, neck.z + fwd.z * reach);
    // Square to his heading, upright, its mossy face out to the front (the battens on its back toward him)
    const world = Quaternion.FromLookDirectionLH(fwd.scale(-1), Vector3.Up());
    // The board's middle from the hole: the hole sits up its own height's share above the middle (read off its planks' extent in its own frame)
    shield.computeWorldMatrix(true);
    const sc = shield.absoluteScaling;
    const holeUp = (this._slabHoleUp ??= (shield.metadata as { holeUp?: number } | null)?.holeUp ?? this._slabHole(shield));
    const middle = hole.subtract(new Vector3(0, holeUp * sc.y, 0));
    // His fist to the back of the board, then the board on it: the arm runs straight, so it is aimed down steeply enough that its whole length ends
    // .grip behind the board, under the middle and in toward it, never through the planks
    b.leftShoulder.computeWorldMatrix(true);
    const sh = b.leftShoulder.getAbsolutePosition();
    const arm = (b.leftElbow.position.length() + b.leftHand.position.length()) * b.leftShoulder.absoluteScaling.y;
    const ahead = Math.max(0, Vector3.Dot(middle.subtract(sh), fwd) - SLAB_FRONT.grip * stature);
    const lat = middle.subtract(sh);
    lat.y = 0;
    lat.subtractInPlace(fwd.scale(Vector3.Dot(lat, fwd))).scaleInPlace(0.6);
    const drop = Math.sqrt(Math.max(0, arm * arm - ahead * ahead - lat.lengthSquared()));
    this._gripBoard(sh.add(fwd.scale(ahead)).addInPlace(lat).addInPlace(new Vector3(0, -drop, 0)), w);
    const hand = b.leftHand;
    hand.computeWorldMatrix(true);
    const square = Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(world);
    const strapped = Vector3.TransformCoordinates(rest, hand.getWorldMatrix());
    // (the strapped attitude stays in the Euler rotation, which the quaternion overrides)
    shield.rotationQuaternion = Quaternion.Slerp(Quaternion.FromEulerAngles(shield.rotation.x, shield.rotation.y, shield.rotation.z), square, w);
    shield.position.copyFrom(Vector3.TransformCoordinates(Vector3.Lerp(strapped, middle, w), Matrix.Invert(hand.getWorldMatrix())));
  }
  // How far the slab's eye hole sits above its middle (its origin), in its own units: the gap between the middle planks' lower and upper pieces
  private _slabHoleUp: number | null = null;
  private _slabHole(shield: TransformNode): number {
    const planks = shield.getChildren().filter((n): n is Mesh => n instanceof Mesh && n.name === "slabPlank");
    const outer = Math.max(0, ...planks.map((m) => Math.abs(m.position.x)));
    let gapLo = -Infinity, gapHi = Infinity;
    for (const m of planks) {
      if (Math.abs(m.position.x) > outer * 0.6) continue;
      const half = m.getBoundingInfo().boundingBox.extendSize.y;
      if (m.position.y < 0) gapLo = Math.max(gapLo, m.position.y + half);
      else gapHi = Math.min(gapHi, m.position.y - half);
    }
    return Number.isFinite(gapLo) && Number.isFinite(gapHi) ? (gapLo + gapHi) * 0.5 : 0;
  }

  /** The lunge legs (spec at LUNGE): the last leg layer, laid over whatever the press, brace, stride, limp or air layers made of the legs. */
  private _lungeLegs(): void {
    const out = this._lungeOut * (1 - Math.min(1, this._limp));
    if (out <= 0.01 || this._state === AnimState.Dead || this.walkStyle === "quadruped" || this._hipRest === null) return;
    const b = this._body;
    b.rightHip.rotation.x += (LUNGE.front - b.rightHip.rotation.x) * out;
    b.rightKnee.rotation.x += (LUNGE.knee - b.rightKnee.rotation.x) * out;
    b.leftHip.rotation.x += (LUNGE.back - b.leftHip.rotation.x) * out;
    b.leftKnee.rotation.x += (0.05 - b.leftKnee.rotation.x) * out;
    for (const hip of [b.leftHip, b.rightHip]) hip.rotation.z += (0 - hip.rotation.z) * out;
    b.hip.position.y = Math.min(b.hip.position.y, this._hipRest - this._hipRest * lungeSinkShare() * out);
  }

  /** The fencer's thrust and step back (see LUNGE). */
  private _animateLunge(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.4);
    const land = Math.max(commit + 0.05, this._blowLandFraction());
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    const smooth = (u: number): number => { const c = Math.max(0, Math.min(1, u)); return c * c * (3 - 2 * c); };
    // g: into the guard; e: out on the lunge; r: back off it
    const g = smooth(progress / Math.max(commit, 0.001));
    const e = progress < commit ? 0 : 1 - Math.pow(1 - Math.min(1, (progress - commit) / Math.max(land - commit, 0.001)), 2.2);
    const r = smooth((progress - land - LUNGE.hold) / Math.max(1 - land - LUNGE.hold, 0.001));
    const out = e * (1 - r);
    this._lungeOut = out;
    b.rightShoulder.rotation.x = LUNGE.guardRaise * g + (LUNGE.reach - LUNGE.guardRaise) * out;
    b.rightShoulder.rotation.z = 0.12 * g * (1 - out);
    b.rightElbow.rotation.x = LUNGE.guardElbow * g * (1 - out) - 0.05 * out;
    b.leftShoulder.rotation.x = 0.25 * g + 0.35 * out;
    b.leftShoulder.rotation.z = -0.35 * g - 0.4 * out;
    b.leftElbow.rotation.x = -0.6 * g;
    b.torso.rotation.y = -side * (LUNGE.turn * g + 0.15 * out);
    b.torso.rotation.x = -0.05 * g + LUNGE.pitch * out;
    b.neck.rotation.x = -0.2 * out;
    b.neck.rotation.y = side * LUNGE.turn * 0.7 * g;
    b.rightHip.rotation.x = -0.25 * g + (LUNGE.front + 0.25) * out;
    b.rightKnee.rotation.x = 0.2 * g + (LUNGE.knee - 0.2) * out;
    b.leftHip.rotation.x = 0.15 * g + (LUNGE.back - 0.15) * out;
    b.leftKnee.rotation.x = 0.1 * g * (1 - out);
    // The hip goes in with the lunge and back past its stand on the step back (forward is the body's +z)
    this._hipRest ??= b.hip.position.y;
    const reach = this._hipRest * (LUNGE.step * out - LUNGE.retreat * r * (1 - smooth((progress - 0.85) / 0.15)));
    this._lungeStep.set(0, 0, reach);
    b.hip.position.addInPlace(this._lungeStep);
    this._idleSink = Math.max(this._idleSink, this._hipRest * lungeSinkShare() * out);
    this._rapierLift = RAPIER_POINT.guard * (1 - out);
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateBladeSlash(dt: number): void {
    if (this._rapier()) {
      this._animateLunge(dt);
      return;
    }
    if (this._sweeps()) {
      this._animateSweep(dt);
      return;
    }
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.4);
    if (progress < commit) {
      const windUp = progress / Math.max(commit, 0.001);
      b.rightShoulder.rotation.x = -0.85 * windUp;
      b.rightShoulder.rotation.z = -0.55 * windUp;
      b.rightElbow.rotation.x = -0.48 * windUp;
      b.leftShoulder.rotation.x = 0.18 * windUp;
      b.leftShoulder.rotation.z = 0.12 * windUp;
      b.torso.rotation.z = 0.24 * windUp;
      b.torso.rotation.x = -0.08 * windUp;
      b.rightHip.rotation.x = 0.08 * windUp;
      b.leftHip.rotation.x = -0.04 * windUp;
    } else {
      const swing = (progress - commit) / Math.max(1 - commit, 0.001);
      const eased = 1 - Math.pow(1 - swing, 2.6);
      b.rightShoulder.rotation.x = -0.85 + 1.2 * eased;
      b.rightShoulder.rotation.z = -0.55 + 1.05 * eased;
      b.rightElbow.rotation.x = -0.48 + 0.62 * eased;
      b.leftShoulder.rotation.x = 0.18 - 0.32 * eased;
      b.leftShoulder.rotation.z = 0.12 - 0.24 * eased;
      b.torso.rotation.z = 0.24 - 0.44 * eased;
      b.torso.rotation.x = -0.08 + 0.24 * eased;
      b.neck.rotation.z = -0.08 * eased;
    }
    b.leftElbow.rotation.x = -0.18;
    b.rightKnee.rotation.x = 0.08;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  // The halberd in the weapon fist (a shaft carrying the axe plate), looked up on first use, and its rest turn about the fist
  private _halberdProp: { node: Mesh; rest: Quaternion } | null | undefined = undefined;
  /** The halberdier proper: a halberd in the fist and a sallet on the head (good.radiant_glaive carries the halberd under a laurel). */
  private _salletHalberd(): boolean {
    return this._halberd() !== null && this._body.root.getChildMeshes(false).some((m) => m.name === "salletShell");
  }

  private _halberd(): { node: Mesh; rest: Quaternion } | null {
    if (this._halberdProp === undefined) {
      const node = this._body.rightHand.getChildren().find((n): n is Mesh => n instanceof Mesh && n.getChildren().some((c) => c.name === "haxe"));
      this._halberdProp = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z) } : null;
    }
    return this._halberdProp;
  }

  // The halberd stood in the world at `theta` from straight up toward his front (in the plane through his front and up), the axe's edge leading the way it
  // swings, blended from its rest in the fist by w
  private _poseHalberd(theta: number, w: number): void {
    const h = this._halberd();
    if (!h) return;
    if (w <= 0.001) {
      h.node.rotationQuaternion = null;
      return;
    }
    const b = this._body;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.rightHand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    const up = Vector3.Up();
    const axis = up.scale(Math.cos(theta)).addInPlace(fwd.scale(Math.sin(theta)));
    // the edge (the plate's -z) along the swing; its +z, the back spike, behind
    const z = up.scale(Math.sin(theta)).subtractInPlace(fwd.scale(Math.cos(theta)));
    const x = Vector3.Cross(axis, z).normalize();
    const world = Matrix.Identity();
    Matrix.FromXYZAxesToRef(x, axis, z, world);
    const parentRot = new Quaternion();
    b.rightHand.getWorldMatrix().decompose(undefined, parentRot);
    const parent = Matrix.Identity();
    parentRot.toRotationMatrix(parent);
    const local = Quaternion.FromRotationMatrix(world.multiply(parent.transpose()));
    h.node.rotationQuaternion = Quaternion.Slerp(h.rest, local, w);
  }

  /**
   * [S] vertical chop (330; card Characteristics "a vertical chop that can deal devastating damage"; renaissance.halberd.jpg: both fists on the shaft). The
   * halberd is raised in both hands until its head stands back over his own head (CHOP.raised from straight up), the trunk leant back, then brought
   * straight down in front of him in his own vertical plane, axe edge first, to CHOP.landed (past level, the head at the foe's chest), the trunk pitched
   * into it and the off foot stepped in; the blow lands on the man there (blowLandsIn), held CHOP.hold, then carried back up to the rest in the fist.
   * The off hand rides the shaft (_twoHandPole) throughout.
   */
  private _animateHalberdChop(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.5);
    const land = this._blowLandFraction();
    const smooth = (u: number): number => { const c = Math.max(0, Math.min(1, u)); return c * c * (3 - 2 * c); };
    const up = smooth(progress / Math.max(commit, 0.001));
    const s = Math.max(0, Math.min(1, (progress - commit) / Math.max(land - commit, 0.001)));
    const down = s * s; // slow off the top, fastest onto the man
    // [S] blow held down (335): from the land the chop's own clock (CHOP_DOWN) lets it back, not the attack's share
    const back = this._chopDown ? 1 - this._chopDownWeight() : 0;
    // each joint from its raised value toward its landed one by `down`, the whole let back to the rest by `back`
    const pose = (raised: number, landed: number): number => (raised * up + (landed - raised) * down) * (1 - back);
    b.rightShoulder.rotation.x = pose(CHOP.armUp, CHOP.armDown);
    b.rightShoulder.rotation.z = pose(0.1, 0.05);
    b.rightElbow.rotation.x = pose(CHOP.elbowUp, CHOP.elbowDown);
    b.torso.rotation.x = pose(-0.2, CHOP.pitch);
    b.neck.rotation.x = pose(0.1, -0.15);
    b.leftHip.rotation.x = pose(-0.15, CHOP.step);
    b.leftKnee.rotation.x = pose(0.1, 0.3);
    b.rightHip.rotation.x = pose(0.1, 0.15);
    // the head: from the rest up and back over him, then down through the top onto the man
    this._slideHalberd(0);
    const w = smooth(progress / Math.max(commit * 0.4, 0.001)) * (1 - back);
    // [S] chop onto the man (334): the landing is aimed at his crown while the head comes down, then kept where it was at the land
    if (progress > commit && progress <= land) this._chopAim = this._chopOnto();
    const aim = this._chopAim;
    const theta = CHOP.raised + ((aim ? aim.theta : CHOP.landed) - CHOP.raised) * down;
    this._poseHalberd(theta, w);
    if (aim) this._slideHalberd(aim.slide * down * w);
    if (progress >= land && !this._chopDown) this._chopDown = { theta: aim ? aim.theta : CHOP.landed, slide: aim ? aim.slide : 0, t: 0 };
    if (progress >= 1) {
      // still held down on the man: _holdChopDown carries it on over the stand
      if (!this._chopDown) {
        this._poseHalberd(0, 0);
        this._slideHalberd(0);
      }
      this._chopAim = null;
      this._state = AnimState.Idle;
    }
  }

  // The landed chop's hold (spec at CHOP_DOWN): its tilt and slide at the land, and the seconds since
  private _chopDown: { theta: number; slide: number; t: number } | null = null;
  private _chopDownWeight(): number {
    const d = this._chopDown;
    if (!d) return 0;
    const u = Math.max(0, Math.min(1, (d.t - CHOP_DOWN.hold) / CHOP_DOWN.rise));
    return 1 - u * u * (3 - 2 * u);
  }

  // After the chop's attack is over, the blow stays on the man (CHOP_DOWN): the weapon arm, the trunk and the halberd are laid toward the landed pose by the
  // hold's weight over whatever the walk or the stand made of them; the off hand follows the shaft (_twoHandPole runs after)
  private _holdChopDown(dt: number): void {
    const d = this._chopDown;
    if (!d) return;
    d.t += dt;
    const w = this._chopDownWeight();
    if (w <= 0.001 || this._state === AnimState.Dead || this._limp >= 0.5) {
      this._chopDown = null;
      this._poseHalberd(0, 0);
      this._slideHalberd(0);
      return;
    }
    // the chop itself is still running and poses itself by the same weight
    if (this._state === AnimState.Attacking && this._attackMotion === "thrust") return;
    const b = this._body;
    const mix = (now: number, landed: number): number => now + (landed - now) * w;
    b.rightShoulder.rotation.x = mix(b.rightShoulder.rotation.x, CHOP.armDown);
    b.rightShoulder.rotation.z = mix(b.rightShoulder.rotation.z, 0.05);
    b.rightElbow.rotation.x = mix(b.rightElbow.rotation.x, CHOP.elbowDown);
    b.torso.rotation.x = mix(b.torso.rotation.x, CHOP.pitch);
    b.neck.rotation.x = mix(b.neck.rotation.x, -0.15);
    this._slideHalberd(0);
    this._poseHalberd(d.theta, w);
    this._slideHalberd(d.slide * w);
  }

  /**
   * [S] chop onto the man (334; card Characteristics "a vertical chop"; the axe head is brought down onto him, not a pole-length past him). The man the
   * chop is struck at (his head mark, from aimBlowAt) is read in the halberdier's own vertical plane from the weapon fist: the landing tilt is the line
   * from the fist to CHOP_ONTO.below under his crown (clamped to CHOP_ONTO.min..max from straight up), and when he stands nearer than the axe head is
   * from the fist the shaft is drawn back through both fists by the difference (at most CHOP_ONTO.slide of that reach), so the axe lands on his head and
   * shoulders and the butt runs out behind. The fists stay where the swing put them; the off hand follows the shaft (_twoHandPole).
   */
  private _chopMark: TransformNode | null = null;
  private _chopAim: { theta: number; slide: number } | null = null;
  private _halberdRestAt: Vector3 | undefined;
  private _chopOnto(): { theta: number; slide: number } | null {
    const h = this._halberd();
    const mark = this._chopMark;
    if (!h || !mark || mark.isDisposed()) return this._chopAim;
    const b = this._body;
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.rightHand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    for (const n of chain) n.computeWorldMatrix(true);
    const marks: TransformNode[] = [];
    for (let n: TransformNode | null = mark; n; n = n.parent as TransformNode | null) marks.unshift(n);
    for (const n of marks) n.computeWorldMatrix(true);
    const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), b.root.getWorldMatrix());
    fwd.y = 0;
    if (fwd.lengthSquared() < 1e-6) return this._chopAim;
    fwd.normalize();
    const fist = b.rightHand.getAbsolutePosition();
    const scale = Math.max(0.001, b.rightHand.absoluteScaling.y);
    const onto = this._crownOf(mark).subtract(new Vector3(0, CHOP_ONTO.below * scale, 0)).subtract(fist);
    const ahead = Vector3.Dot(onto, fwd);
    if (ahead < 0.05) return this._chopAim;
    const theta = Math.max(CHOP_ONTO.min, Math.min(CHOP_ONTO.max, Math.atan2(ahead, onto.y)));
    // the axe head's distance from the fist along the shaft, read off the shaft as it rests in the fist
    h.node.computeWorldMatrix(true);
    const axe = h.node.getChildren().find((c): c is Mesh => c.name === "haxe");
    if (!axe) return { theta, slide: 0 };
    axe.computeWorldMatrix(true);
    const axis = Vector3.TransformNormal(Vector3.Up(), h.node.getWorldMatrix()).normalize();
    const reach = Vector3.Dot(axe.getAbsolutePosition().subtract(fist), axis);
    const slide = Math.max(0, Math.min(reach * CHOP_ONTO.slide, reach - Math.hypot(ahead, onto.y)));
    return { theta, slide };
  }

  // The halberd drawn back through the fists by `by` (m, in the world) along its own shaft, from where it rests in the fist; 0 puts it back
  private _slideHalberd(by: number): void {
    const h = this._halberd();
    if (!h) return;
    const rest = (this._halberdRestAt ??= h.node.position.clone());
    if (by <= 0.0001) {
      h.node.position.copyFrom(rest);
      return;
    }
    const hand = this._body.rightHand;
    hand.computeWorldMatrix(true);
    h.node.position.copyFrom(rest);
    h.node.computeWorldMatrix(true);
    const axis = Vector3.TransformNormal(Vector3.Up(), h.node.getWorldMatrix()).normalize();
    const local = Vector3.TransformNormal(axis.scale(-by), hand.getWorldMatrix().clone().invert());
    h.node.position.addInPlace(local);
  }

  private _animateThrust(dt: number): void {
    if (this._halberd()) {
      this._animateHalberdChop(dt);
      return;
    }
    if (this._stabsFork()) {
      this._animateForkStab(dt);
      return;
    }
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const extend = this._resolveReleasePoint(0.5);
    if (b.rightHand.getChildren().some((n) => n.name === "harpoonGun")) {
      // A harpoon gun is fired from the hip, not thrust (units/pirate.harpooner): both hands on the canister low at the belt, the nozzle forward and a
      // little down, the trunk rocked back by the kick at the release
      const set = Math.min(1, progress / Math.max(extend * 0.5, 0.001));
      const kick = progress > extend ? Math.max(0, 1 - (progress - extend) / Math.max(1 - extend, 0.001)) : 0;
      b.rightShoulder.rotation.x = HARPOON_HIP.raise * set;
      b.rightShoulder.rotation.z = HARPOON_HIP.out * set;
      b.rightElbow.rotation.x = HARPOON_HIP.elbow * set;
      b.leftShoulder.rotation.x = HARPOON_HIP.offRaise * set;
      b.leftShoulder.rotation.z = HARPOON_HIP.offIn * set;
      b.leftElbow.rotation.x = HARPOON_HIP.offElbow * set;
      b.torso.rotation.x = -HARPOON_HIP.kick * kick;
      b.rightHip.rotation.x = 0.12 * set;
      b.leftHip.rotation.x = -0.12 * set;
      if (progress >= 1) this._state = AnimState.Idle;
      return;
    }
    if (progress < extend) {
      const windUp = progress / Math.max(extend, 0.001);
      b.rightShoulder.rotation.x = -0.42 * windUp;
      b.rightShoulder.rotation.z = 0.08 * windUp;
      b.rightElbow.rotation.x = -0.3 * windUp;
      b.leftShoulder.rotation.x = -0.3 * windUp;
      b.leftElbow.rotation.x = -0.12 * windUp;
      b.torso.rotation.x = 0.04 * windUp;
      b.torso.rotation.z = 0.1 * windUp;
      b.rightHip.rotation.x = 0.16 * windUp;
      b.rightKnee.rotation.x = 0.08 * windUp;
    } else {
      const thrust = (progress - extend) / Math.max(1 - extend, 0.001);
      const eased = 1 - Math.pow(1 - thrust, 3);
      b.rightShoulder.rotation.x = -0.42 + 1.18 * eased;
      b.rightShoulder.rotation.z = 0.08 - 0.18 * eased;
      b.rightElbow.rotation.x = -0.3 + 0.52 * eased;
      b.leftShoulder.rotation.x = -0.3 + 0.56 * eased;
      b.leftElbow.rotation.x = -0.12 - 0.12 * eased;
      b.torso.rotation.x = 0.04 + 0.26 * eased;
      b.torso.rotation.z = 0.1 - 0.12 * eased;
      b.rightHip.rotation.x = 0.16 + 0.08 * eased;
      b.neck.rotation.x = 0.06 * eased;
    }
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateThrow(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.45);
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    // A javelin is stood up over the head at the cock (JAVELIN_COCK, the shaft turned about in the fist); a bomb or any other missile is cocked behind the head
    const jav = this._javelin();
    const c = jav ? { ...THROW_COCK, ...JAVELIN_COCK } : THROW_COCK;
    let stand = 0;
    if (progress < releasePoint) {
      // Up and back: the fist behind the head, the chest turned off the line and leant away, the other arm out at the foe
      const u = progress / Math.max(releasePoint, 0.001);
      const w = u * (2 - u);
      stand = w;
      b.rightShoulder.rotation.x = c.raise * w;
      b.rightShoulder.rotation.z = c.out * w;
      b.rightElbow.rotation.x = c.elbow * w;
      b.leftShoulder.rotation.x = c.lead * w;
      b.leftElbow.rotation.x = -0.12;
      b.torso.rotation.y = c.turn * side * w;
      b.torso.rotation.x = c.lean * w;
      b.neck.rotation.y = -c.turn * side * w * 0.8;
      b.leftHip.rotation.x = -0.25 * w;
      b.rightHip.rotation.x = 0.2 * w;
    } else {
      // Over the top and forward through THROW_SWING of what is left, then back to the ready
      const s = (progress - releasePoint) / Math.max(1 - releasePoint, 0.001);
      const v = Math.min(1, s / THROW_SWING);
      const f = v * v * (3 - 2 * v);
      const r = s > THROW_SWING ? (s - THROW_SWING) / (1 - THROW_SWING) : 0;
      const k = 1 - r * r * (3 - 2 * r);
      // The stood javelin turns back in the fist over the whip, square again at the let-go
      const un = Math.max(0, Math.min(1, (v - JAVELIN_UNTURN) / Math.max(0.001, THROW_LET_GO - JAVELIN_UNTURN)));
      stand = 1 - un * un * (3 - 2 * un);
      b.rightShoulder.rotation.x = (c.raise + (THROW_FOLLOW.raise - c.raise) * f) * k;
      b.rightShoulder.rotation.z = c.out * (1 - f) * k;
      b.rightElbow.rotation.x = c.elbow * Math.max(0, 1 - f * 1.5) * k - 0.1 * k;
      b.leftShoulder.rotation.x = c.lead * (1 - f * 0.8) * k;
      b.leftElbow.rotation.x = -0.12;
      b.torso.rotation.y = c.turn * side * (1 - 2 * f) * k;
      b.torso.rotation.x = (c.lean + (THROW_FOLLOW.lean - c.lean) * f) * k;
      b.neck.rotation.y = -c.turn * side * (1 - 2 * f) * k * 0.8;
      b.neck.rotation.x = 0.06 * f * k;
      b.leftHip.rotation.x = -0.25 * k;
      b.rightHip.rotation.x = 0.2 * (1 - f) * k;
    }
    if (jav) this._standJavelin(jav, stand);
    if (progress >= 1) this._state = AnimState.Idle;
  }

  // The javelin in the throwing hand (the prop named "shaft", units/tribal.spear_thrower) with the turn and the seat it was strapped on with, looked up once:
  // it keeps its name hidden after the let-go. null for any other hand.
  private _javelinProp: { shaft: TransformNode; rest: Quaternion; grip: Vector3 } | null | undefined = undefined;
  private _javelin(): { shaft: TransformNode; rest: Quaternion; grip: Vector3 } | null {
    if (this._javelinProp === undefined) {
      const shaft = this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "shaft");
      this._javelinProp = shaft ? { shaft, rest: Quaternion.FromEulerAngles(shaft.rotation.x, shaft.rotation.y, shaft.rotation.z), grip: shaft.position.clone() } : null;
    }
    return this._javelinProp;
  }
  // How far the javelin is turned about in the fist (0 strapped on, 1 stood up out of it); see JAVELIN_COCK
  private _javelinStand = 0;
  /** The javelin turned `k` of pi about the fist (the hand's x axis through the wrist), its seat carried round with it, so at 1 it runs out past the fingers. */
  private _standJavelin(jav: { shaft: TransformNode; rest: Quaternion; grip: Vector3 }, k: number): void {
    this._javelinStand = k;
    const turn = Quaternion.RotationAxis(Vector3.Right(), Math.PI * k);
    jav.shaft.rotationQuaternion = jav.rest.multiply(turn);
    jav.grip.rotateByQuaternionToRef(turn, jav.shaft.position);
  }

  /**
   * A bowman does not shoot from attention with the bow at his hip. He shoots from his ready stance, turned further until he stands side-on with the bow shoulder to the enemy
   * (BOW_TURN off the line, shared between hips and chest, the head left looking down the arrow): the bow arm comes up straight and level along the line of the shot, the
   * other hand comes across to the string and draws it back to the cheek with the elbow carried out behind at shoulder height, the chest leans back off the bow, the leg
   * under the bow is set ahead on a knee that gives and the other is dropped back straight. At the loose the string hand flies back off the cheek and the chest follows the
   * arrow a little; he holds the bow up a moment and lets it down to the ready.
   */
  private _animateBowDrawRelease(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.72);
    const drawPoint = Math.max(0.28, releasePoint - 0.32);
    this._animateIdleHumanoid();
    const step = (from: number, to: number): number => {
      const u = Math.max(0, Math.min(1, (progress - from) / Math.max(0.001, to - from)));
      return u * u * (3 - 2 * u);
    };
    const up = step(0, drawPoint * 0.5) * (1 - step(releasePoint + (1 - releasePoint) * 0.55, 1));
    const draw = step(drawPoint * 0.4, drawPoint);
    const loose = step(releasePoint, releasePoint + (1 - releasePoint) * 0.3);
    const k = up * (1 - Math.min(1, this._limp));
    this._bowUp = k;
    // His own turn, lean and height of the string elbow, hashed from the wobble phase like every other stance
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const BOW_TURN = BOW_TURN_MIN + h(131) * (BOW_TURN_MAX - BOW_TURN_MIN);
    const lean = 0.06 + h(132) * 0.16;
    const elbowHigh = (h(133) - 0.5) * 0.4;
    const set = (joint: TransformNode, axis: "x" | "y" | "z", value: number): void => {
      joint.rotation[axis] += (value - joint.rotation[axis]) * k;
    };
    // Side-on, bow shoulder leading
    set(b.hip, "y", -BOW_TURN * 0.45);
    set(b.torso, "y", -BOW_TURN * 0.55);
    set(b.neck, "y", BOW_TURN * 0.9);
    set(b.neck, "x", 0.04);
    set(b.neck, "z", 0);
    set(b.torso, "x", -0.02 - lean * draw + 0.1 * loose);
    set(b.torso, "z", 0.1 * draw - 0.06 * loose);
    // Bow arm: straight and level down the line of the shot
    set(b.rightShoulder, "x", -Math.PI / 2);
    set(b.rightShoulder, "y", 0);
    set(b.rightShoulder, "z", BOW_TURN);
    set(b.rightElbow, "x", -0.1);
    // String arm: across to the bow, back to the cheek, off it at the loose
    set(b.leftShoulder, "x", -1.5 + elbowHigh);
    set(b.leftShoulder, "y", 0);
    set(b.leftShoulder, "z", 0.6 - 0.9 * draw - 0.55 * loose);
    set(b.leftElbow, "x", -2.2 + 1.2 * loose);
    // Legs: the leg under the bow ahead on a giving knee, the other dropped back straight
    set(b.rightHip, "x", -0.3 - 0.06 * draw);
    set(b.rightKnee, "x", 0.34);
    set(b.leftHip, "x", 0.36);
    set(b.leftKnee, "x", 0.1);
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateCrossbowSnap(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.55);
    if (progress < releasePoint) {
      const brace = progress / Math.max(releasePoint, 0.001);
      b.leftShoulder.rotation.x = -0.28 - 0.08 * brace;
      b.leftShoulder.rotation.z = -0.12;
      b.leftElbow.rotation.x = -0.22 - 0.06 * brace;
      b.rightShoulder.rotation.x = -0.26 - 0.1 * brace;
      b.rightShoulder.rotation.z = 0.16 + 0.06 * brace;
      b.rightElbow.rotation.x = -0.45 - 0.1 * brace;
      b.torso.rotation.x = 0.05 + 0.03 * brace;
      b.torso.rotation.z = -0.04 * brace;
    } else {
      const snap = (progress - releasePoint) / Math.max(1 - releasePoint, 0.001);
      const eased = 1 - Math.pow(1 - snap, 2.5);
      b.leftShoulder.rotation.x = -0.36 + 0.18 * eased;
      b.leftShoulder.rotation.z = -0.12 + 0.06 * eased;
      b.leftElbow.rotation.x = -0.28 + 0.14 * eased;
      b.rightShoulder.rotation.x = -0.36 + 0.34 * eased;
      b.rightShoulder.rotation.z = 0.22 - 0.16 * eased;
      b.rightElbow.rotation.x = -0.55 + 0.32 * eased;
      b.torso.rotation.x = 0.08 - 0.02 * eased;
      b.torso.rotation.z = -0.04 + 0.06 * eased;
    }
    b.rightHip.rotation.x = 0.04;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateFirearmRecoil(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const recoilPoint = this._resolveReleasePoint(0.5);
    if (progress < recoilPoint) {
      const aim = progress / Math.max(recoilPoint, 0.001);
      b.leftShoulder.rotation.x = -0.24 - 0.08 * aim;
      b.leftShoulder.rotation.z = -0.12;
      b.leftElbow.rotation.x = -0.22 - 0.06 * aim;
      b.rightShoulder.rotation.x = -0.22 - 0.1 * aim;
      b.rightShoulder.rotation.z = 0.2 + 0.04 * aim;
      b.rightElbow.rotation.x = -0.5 - 0.08 * aim;
      b.torso.rotation.x = 0.06 + 0.03 * aim;
      b.neck.rotation.x = 0.04 * aim;
    } else {
      const recoil = (progress - recoilPoint) / Math.max(1 - recoilPoint, 0.001);
      const eased = 1 - Math.pow(1 - recoil, 2.8);
      b.leftShoulder.rotation.x = -0.32 + 0.12 * eased;
      b.leftShoulder.rotation.z = -0.12 + 0.04 * eased;
      b.leftElbow.rotation.x = -0.28 + 0.1 * eased;
      b.rightShoulder.rotation.x = -0.32 + 0.26 * eased;
      b.rightShoulder.rotation.z = 0.24 - 0.08 * eased;
      b.rightElbow.rotation.x = -0.58 + 0.2 * eased;
      b.torso.rotation.x = 0.09 - 0.05 * eased;
      b.torso.rotation.z = -0.08 * Math.sin(recoil * Math.PI) * (1 - recoil * 0.2);
      b.neck.rotation.x = 0.04 + 0.04 * eased;
    }
    b.rightHip.rotation.x = 0.08;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  /** Mammoth stomp/charge: rear up, slam down, shake on impact. */
  private _animateAttackMammoth(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);

    if (progress < 0.3) {
      // Rear up: tilt whole body backward, raise front
      const rearUp = progress / 0.3;
      const eased = 1 - Math.pow(1 - rearUp, 2);
      b.torso.rotation.x = -0.35 * eased;
      b.neck.rotation.x = -0.25 * eased;
      // Front legs lift
      b.leftShoulder.rotation.x = -0.5 * eased;
      b.rightShoulder.rotation.x = -0.5 * eased;
    } else if (progress < 0.5) {
      // Slam down: fast forward tilt
      const slam = (progress - 0.3) / 0.2;
      const eased = 1 - Math.pow(1 - slam, 3);
      b.torso.rotation.x = -0.35 + 0.7 * eased;
      b.neck.rotation.x = -0.25 + 0.6 * eased;
      // Front legs slam down
      b.leftShoulder.rotation.x = -0.5 + 0.7 * eased;
      b.rightShoulder.rotation.x = -0.5 + 0.7 * eased;
    } else {
      // Recovery: shake and settle back to neutral
      const recover = (progress - 0.5) / 0.5;
      const shake = Math.sin(recover * Math.PI * 6) * 0.12 * (1 - recover);
      b.torso.rotation.x = 0.35 * (1 - recover) + shake;
      b.torso.rotation.z = shake * 0.8;
      b.neck.rotation.x = 0.35 * (1 - recover);
      b.neck.rotation.z = -shake;
      b.leftShoulder.rotation.x = 0.2 * (1 - recover);
      b.rightShoulder.rotation.x = 0.2 * (1 - recover);
    }

    if (progress >= 1) {
      // Reset rotations
      b.torso.rotation.x = 0;
      b.torso.rotation.z = 0;
      b.neck.rotation.x = 0;
      b.neck.rotation.z = 0;
      b.leftShoulder.rotation.x = 0;
      b.rightShoulder.rotation.x = 0;
      this._state = AnimState.Idle;
    }
  }

  private _initDeathRagdoll(): void {
    const joints = this._body.allJoints;
    this._deathJointAngles = [];
    this._deathAngularVelocities = [];
    // Corpses come to rest crumpled in the same per-unit limp pose a downed body uses, until they land and it is known which face is up.
    this._deathRestAngles = new Array(joints.length * 3).fill(0);
    this._landedFace = 0;
    if (this.walkStyle !== "quadruped") {
      this._writeDeathRest(0);
      // A corpse still in the air sags toward its flight shape and only crumples once it lands.
      this._deathAirAngles = this._deathRestAngles.slice();
      for (const [joint, x, y, z] of (this._airPose ??= this._buildAirPose())) {
        const index = joints.indexOf(joint as (typeof joints)[number]);
        if (index < 0) continue;
        this._deathAirAngles[index * 3] = x;
        this._deathAirAngles[index * 3 + 1] = y;
        this._deathAirAngles[index * 3 + 2] = z;
      }
    } else {
      this._deathAirAngles = this._deathRestAngles;
    }

    for (let i = 0; i < joints.length; i++) {
      // Current angle + random spin
      this._deathJointAngles.push(
        joints[i].rotation.x,
        joints[i].rotation.y,
        joints[i].rotation.z,
      );
      // Random angular velocity (TABS-style floppy)
      this._deathAngularVelocities.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12,
      );
    }
  }

  /**
   * Rest angles of a corpse. Not yet landed (0) it is the per-unit limp pose, every fold in the plane of the body. Landed on its back (1) or its
   * front (-1), the folds that can stand up off the ground on the open side replace the flat ones, so the body is not a flat strip.
   */
  private _writeDeathRest(landed: number): void {
    const joints = this._body.allJoints;
    const b = this._body;
    const p = this._limpPose;
    const rest = (joint: unknown, x: number, z = 0, y = 0): void => {
      const index = joints.indexOf(joint as (typeof joints)[number]);
      if (index < 0) return;
      this._deathRestAngles[index * 3] = x;
      this._deathRestAngles[index * 3 + 1] = y;
      this._deathRestAngles[index * 3 + 2] = z;
    };
    rest(b.torso, p.torsoX, p.torsoZ, p.torsoY);
    rest(b.neck, p.neckX);
    rest(b.leftShoulder, p.leftArmX, p.leftArmZ);
    rest(b.rightShoulder, p.rightArmX, p.rightArmZ);
    rest(b.leftElbow, p.leftElbowX, p.leftElbowZ);
    rest(b.rightElbow, p.rightElbowX, p.rightElbowZ);
    rest(b.leftHip, p.leftHipX, p.leftHipZ);
    rest(b.rightHip, p.rightHipX, p.rightHipZ);
    rest(b.leftKnee, p.leftKneeX, p.leftKneeZ);
    rest(b.rightKnee, p.rightKneeX, p.rightKneeZ);
    if (landed === 0) return;
    // Everything below comes from the body's own limp numbers: no random draws, and a corpse thrown again lands in its own shape.
    const u = p.torsoX * 5; // 0..1
    const roll = p.torsoY < 0 ? -1 : 1;
    const both = u > 0.66;
    const raised = u < 0.4;
    // The leg that lay splayed is the one that stands up, and the arm that lay at the side is the one that lifts. Left is -x.
    const leg = p.leftSplayed ? -1 : 1;
    const [upHip, upKnee, otherHip, otherKnee] = p.leftSplayed
      ? [b.leftHip, b.leftKnee, b.rightHip, b.rightKnee]
      : [b.rightHip, b.rightKnee, b.leftHip, b.leftKnee];
    const arm = p.leftFlung ? 1 : -1;
    const [upShoulder, upElbow] = p.leftFlung ? [b.rightShoulder, b.rightElbow] : [b.leftShoulder, b.leftElbow];
    // The head lolls over onto one cheek whichever way up the body is.
    rest(b.neck, p.neckX, 0, roll * (0.7 + 0.4 * u));
    if (landed > 0) {
      // On its back. One knee stands propped: the thigh up at 55 to 70 degrees and the shin straight back down to the foot. One body in three props
      // the other knee half as high. The arm from the side lies across the chest, elbow lifted off the ground and forearm over the ribs,
      // and two bodies in five lie with head and shoulders lifted, folded at the waist.
      const thigh = 0.95 + 0.3 * u;
      rest(upHip, -thigh, leg * 0.08);
      rest(upKnee, thigh * 2);
      if (both) {
        rest(otherHip, -0.6, -leg * 0.15);
        rest(otherKnee, 1.2);
      }
      rest(upShoulder, -0.1, arm * 0.5, -arm * 1.57);
      rest(upElbow, -1.7);
      if (raised) rest(b.torso, 0.3 + 0.6 * u, p.torsoZ, p.torsoY);
    } else {
      // On its front nothing may fold forward, which is into the ground. One shin stands kicked up from the knee, in one body in three both do. The arm
      // from the side is a wing: elbow up over the back, hand down by the ribs. Two bodies in five lie arched, chest and head off the ground.
      rest(upHip, 0, leg * 0.1);
      rest(upKnee, 1.3 + 0.4 * u);
      rest(otherHip, 0.05, -leg * 0.05);
      rest(otherKnee, both ? 0.9 : 0.1);
      rest(upShoulder, 0.7, arm * 0.6);
      rest(upElbow, -1.3);
      rest(b.torso, raised ? -0.3 : 0, p.torsoZ, p.torsoY);
    }
  }

  private _animateDead(dt: number): void {
    const joints = this._body.allJoints;
    const air = this._air;
    const restAt = (index: number): number =>
      this._deathRestAngles[index] + (this._deathAirAngles[index] - this._deathRestAngles[index]) * air;

    for (let i = 0; i < joints.length; i++) {
      const base = i * 3;

      // Apply angular velocity
      this._deathJointAngles[base] += this._deathAngularVelocities[base] * dt;
      this._deathJointAngles[base + 1] += this._deathAngularVelocities[base + 1] * dt;
      this._deathJointAngles[base + 2] += this._deathAngularVelocities[base + 2] * dt;

      // Dampen
      this._deathAngularVelocities[base] *= this._deathDamping;
      this._deathAngularVelocities[base + 1] *= this._deathDamping;
      this._deathAngularVelocities[base + 2] *= this._deathDamping;

      // Flop first, then sag into the crumpled rest pose and stay there; a corpse in flight takes its shape at once
      const sag = Math.min(1, dt * (3.5 + 8 * air));
      this._deathJointAngles[base] += (restAt(base) - this._deathJointAngles[base]) * sag;
      this._deathJointAngles[base + 1] += (restAt(base + 1) - this._deathJointAngles[base + 1]) * sag;
      this._deathJointAngles[base + 2] += (restAt(base + 2) - this._deathJointAngles[base + 2]) * sag;

      // Apply to joint
      joints[i].rotation.x = this._deathJointAngles[base];
      joints[i].rotation.y = this._deathJointAngles[base + 1];
      joints[i].rotation.z = this._deathJointAngles[base + 2];
    }
    // A dead body thrashes half as hard as a live one
    if (air > 0.01 && this.walkStyle !== "quadruped") this._flailInAir(air * 0.5);
  }

  /** A body in flight never holds its shape: arms and legs thrash either way about the flight pose, each limb at its own rate, with no fold held on top, so it flies open and not curled. */
  private _flailInAir(amount: number): void {
    const b = this._body;
    const t = this._time * 1.6 + this._wobblePhase;
    // One arm is thrown ahead and the other trails, which one differing per body, so a flyer is lopsided and not a spread-eagle star
    const lead = Math.sin(this._wobblePhase * 5.3) < 0 ? -0.6 : 0.6;
    b.leftShoulder.rotation.x += (Math.sin(t * 9.1) * 0.7 + lead) * amount;
    b.rightShoulder.rotation.x += (Math.sin(t * 7.3 + 2.1) * 0.7 - lead) * amount;
    b.leftElbow.rotation.x -= 0.45 * Math.sin(t * 11.7 + 0.8) * amount;
    b.rightElbow.rotation.x -= 0.45 * Math.sin(t * 10.3 + 3.4) * amount;
    b.leftHip.rotation.x += Math.sin(t * 6.7 + 1.2) * 0.45 * amount;
    b.rightHip.rotation.x += Math.sin(t * 8.3 + 4.0) * 0.45 * amount;
    b.leftKnee.rotation.x += 0.5 * Math.sin(t * 9.7 + 2.6) * amount;
    b.rightKnee.rotation.x += 0.5 * Math.sin(t * 12.1 + 5.2) * amount;
    // The waist breaks too, slowly and either way: each body has its own lean, forward or back, and rocks about it,
    // so a flung line is some jack-knifed, some arched and some straight, never a row of the same flat plank
    const fold = (Math.sin(this._wobblePhase * 3.7) * 0.8 + Math.sin(t * 3.1) * 0.45) * amount;
    b.torso.rotation.x += fold;
    b.neck.rotation.x -= fold * 0.4;
  }
}
