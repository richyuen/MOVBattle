import { Matrix, Quaternion, Vector3, type Mesh, type TransformNode } from "@babylonjs/core";
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
/** A heavy weapon's arc in the fist, radians from straight up: cocked up and back over the shoulder, landed forward and down on the mark. */
const CLUB_COCK = -0.4;
const CLUB_LAND = 1.8;
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
const BLOW_AIM_FROM = 0.75;
const BLOW_HOLD = 0.6;
const BLOW_HOLD_FADE = 0.15;
// The hold is let go early once the fist stands farther than this many weapon reaches from the point the blow struck (the striker walked or turned away)
const BLOW_HOLD_SLIP = 1.25;
const BLOW_ELBOW = -0.15;
const BLOW_PITCH = 0.4;
// The weapon falls on a man too tall to crown from the fist this far under the fist (r2c3: the club falls on the man from above), the mark this far over
// the head top (BLOW_CROWN; hand-scale units)
const BLOW_DROP = 0.25;
// The weapon arm in the blow: straight up over his head, this far forward of vertical (rad)
const BLOW_OVERHEAD = 0.5;
const BLOW_CROWN = 0.04;
// The weapon on the frame it lands falls at least this far below level (rad), onto the crown or on down through the shoulders and board; a man farther off than
// the fist and that falling weapon reach is lunged at, the hip carried at most BLOW_STEP of the striker's standing height toward him (r2c3: the clubber steps
// into the man, the club coming down through him)
const BLOW_FALL = 0.95;
const BLOW_STEP = 0.4;
// Highest the striker springs to bring his fist over a taller man's crown, in shares of his own standing height (see _aimBlow)
const BLOW_LEAP = 0.5;
// The striker's legs in the blow: front thigh forward, back thigh behind, knees near straight (hip/knee rotation.x)
const BLOW_LUNGE = { front: -0.4, back: 0.3, knee: 0.1 };
// Farthest a man's head may be from the striker's shoulder, in weapon reaches + one arm, for the blow to be aimed at him at all
const BLOW_AIM_SLACK = 2.5;
// A flinch holds its full snap this long before it eases off (see update)
const FLINCH_HOLD = 0.12;
// The blow does not stop on the crown (trailer_3_sheet_01 r2c3: the club ends low after its arc, the striker bent into it): from the landing the fist goes on
// down its arc, over BLOW_FOLLOW s, from straight up to BLOW_FOLLOW_ARM rad past the vertical toward the man (forward and below level), the trunk pitched a
// further BLOW_FOLLOW_PITCH into it, and the weapon head runs on from the crown down onto his board top (see press-landed-contact), where it is held out the
// rest of BLOW_HOLD.
const BLOW_FOLLOW = 0.12;
const BLOW_FOLLOW_ARM = 2.05;
const BLOW_FOLLOW_PITCH = 0.3;

// Overhand throw (trailer_3_sheet_01 r3c3: the spear in flight, the thrower's arm out ahead and the hand empty; units/tribal.spear_thrower): through the windup the
// throwing arm goes up and back until the fist is behind the head (THROW_COCK: shoulder raise, out, elbow folded, chest turned back and leant away, the other arm
// pointed at the foe); at the commit it whips over the top and forward, the elbow straightening, the chest turning through and pitching in, and the missile leaves
// the fist THROW_LET_GO of the way through that swing, with the arm out ahead near shoulder height; the arm follows through low and the man comes back to the ready.
const THROW_COCK = { raise: -2.9, out: 0.3, elbow: -1.6, turn: 0.4, lean: -0.15, lead: -1.3 };
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
 */
const BOULDER_CARRY = { raise: -0.6, inward: 0.42, elbow: -0.75 };
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
// Thrown back off his feet by a heavy blow, hip-led (trailer_3_sheet_01 r2c3, the red man leaving the clubbers, read off the frame: he goes seat-first, the
// pelvis the lowest point of him and the one the blow carries; the trunk is tipped ~57 deg from upright the way he goes, head still above the hips; one leg
// trails straight down and a little the way he goes, ~40 deg from vertical; the other knee is kicked up toward the striker to hip height, the shin hanging;
// arms out wide). The root's pitch (RuntimeUnit BLOW_THROW_TRUNK, about the root origin at his feet) is turned into a pitch about the pelvis by anchoring
// the hip THROWN.seat of its standing height straight over the root (an offset in the root frame, undone at the top of the next update like the blow lunge),
// and the thighs are laid out in the flight frame, not swept by a fixed amount: the trailing thigh .legTrail rad from straight down toward where he goes
// and the kicked one .legKick (past horizontal toward the striker), each as a world angle the root's live pitch is taken out of, knees .kneeTrail/.kneeKick.
// Shoulders out .armsOut and back .armsBack rad, elbows straight, trunk .trunk and head .head rad over the root's pitch. Laid on the land frame, eased out
// with the body's throw.
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
const THROWN = { armsOut: 1.35, armsBack: 0.45, trunk: 0.1, head: 0.1, seat: 0.92, legTrail: 0.7, legKick: -1.9, kneeTrail: 0.15, kneeKick: 1.4 };

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
    this._state = state;
    if (state === AnimState.Dead) {
      this._initDeathRagdoll();
    }
  }

  triggerAttack(windupTime: number, motion?: AttackMotion): void {
    this._state = AnimState.Attacking;
    this._attackTimer = 0;
    this._attackDuration = windupTime + 0.25;
    this._attackMotion = motion ?? this.defaultAttackMotion;
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
    this._blowMark = mark;
    this._blowLandsAt = landsIn;
    this._blowClock = 0;
    this._blowStruck = null;
  }
  private _blowMark: TransformNode | null = null;
  // Where the blow struck, in the world, taken by blowStruck on the land step: the hold and follow-through stay on that point, not on the man's live crown,
  // which the blow has just thrown over and away (probed: tracking him live ran the club down after his flipped head to shin height, into the turf)
  private _blowStruck: { head: Vector3; contact: Vector3 } | null = null;

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
    this._blowStruck = { head: this._crownOf(mark).add(new Vector3(0, BLOW_CROWN * scale, 0)), contact: this._contactOn(mark, hand) };
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
    return (this._attackMotion === "heavy_swing" || this._attackMotion === "blade_slash") && this.attackStyle !== "mammoth" && this.walkStyle !== "quadruped";
  }

  // The share of the attack at which the blow is fully on the man: BLOW_LAND of the way through the drop after the commit
  private _blowLandFraction(): number {
    if (this._attackMotion === "heavy_swing") {
      const commit = this._resolveReleasePoint(0.45);
      return commit + (1 - commit) * 0.45 * BLOW_LAND;
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
    this._aimWeight = 0;
    // Last frame's lunge comes off the hip first: nothing else poses the hip across the ground
    const lunged = this._blowLunge;
    if (lunged.x !== 0 || lunged.z !== 0) {
      this._body.hip.position.subtractInPlace(lunged);
      lunged.setAll(0);
    }
    if (w <= 0.01 || !mark) return;
    // How far past the landing the blow has followed through (BLOW_FOLLOW)
    const fu = Math.max(0, Math.min(1, (this._blowClock - this._blowLandsAt) / BLOW_FOLLOW));
    const follow = fu * fu * (3 - 2 * fu);
    const b = this._body;
    // The pose this frame, top down, so the shoulder and the hand are where this frame puts them and not where the last one did
    const chain: TransformNode[] = [];
    for (let n: TransformNode | null = b.rightHand; n; n = n.parent as TransformNode | null) chain.unshift(n);
    b.torso.rotation.x += (BLOW_PITCH + BLOW_FOLLOW_PITCH * follow - b.torso.rotation.x) * w;
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
    // A man whose crown stands over the raised fist is leapt at (r2c3: the clubber comes off his feet into the blow): the striker springs up until his fist is
    // BLOW_DROP over that crown, at most BLOW_LEAP of his own standing height, so the weapon still falls onto the helm and not into the face under it
    const need = (head.y + BLOW_DROP * scale - b.rightHand.getAbsolutePosition().y) * (struck ? 1 : 1 - follow);
    if (need > 0) {
      const rootScale = Math.max(0.001, b.root.absoluteScaling.y);
      this._hipRest ??= b.hip.position.y;
      const lift = Math.min(need, BLOW_LEAP * this._hipRest * 2 * rootScale) * w;
      b.hip.position.y += lift / rootScale;
      for (const n of chain) n.computeWorldMatrix(true);
    }
    // Struck: through the hold the weapon's head stays on the point it hit and the arm is carried on through only as far as keeps it there. The fist lies an
    // arm from the shoulder and a reach from that point: of the two such places in the vertical plane through both, the upper one (the arm came over the top)
    if (struck) {
      const shoulderNow = b.rightShoulder.getAbsolutePosition();
      const armNow = Vector3.Distance(shoulderNow, b.rightHand.getAbsolutePosition());
      const d = struck.contact.subtract(shoulderNow);
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
        b.rightShoulder.rotation.x += (Math.atan2(-armHold.z, -armHold.y) - b.rightShoulder.rotation.x) * w * follow;
        for (const n of chain) n.computeWorldMatrix(true);
      }
      // Walked or turned off the point meanwhile (the sim has him on to the next man) so the fist cannot stand a reach from it: the hold is let go now, over
      // its fade, rather than held on a point the club is not on
      if (follow >= 1 && Vector3.Distance(b.rightHand.getAbsolutePosition(), struck.contact) > reach * BLOW_HOLD_SLIP) {
        this._blowClock = Math.max(this._blowClock, this._blowLandsAt + BLOW_HOLD - BLOW_HOLD_FADE);
      }
    }
    // Weapon: laid DOWN from the raised fist, at least BLOW_FALL below level. Onto his crown when it lies that steep under the fist; a crown flatter than that,
    // the weapon comes down the BLOW_FALL line at full reach, through his shoulders and board top, not level across his face
    const hand = b.rightHand.getAbsolutePosition();
    const across = Math.max(0.001, Vector3.Dot(head.subtract(hand), toward));
    // Pinned on him every frame from where he stands now, after any knockback (press-club-lands-on-board): the head on his crown or, a man nearer than the
    // weapon is long, on his near face where the shaft meets it, and the follow-through runs on to that pinned point, never past him into the turf
    const contact = struck ? struck.contact : this._contactOn(mark, hand);
    const onto = hand.y - head.y >= across * Math.tan(BLOW_FALL)
      ? contact
      : hand.add(toward.scale(Math.cos(BLOW_FALL) * reach)).addInPlace(new Vector3(0, -Math.sin(BLOW_FALL) * reach, 0));
    const end = follow > 0 ? Vector3.Lerp(onto, contact, follow) : onto;
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

    this._idleSink = 0;
    this._clubHold = 0;
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
      if (this._clubHold <= 0.01) {
        this._clubArc = aimed ? PRESS_CLUB_COCK + heave : CLUB_COCK * 0.9 + heave + (PRESS_BLOW_CLUB - CLUB_COCK * 0.9 - heave) * blow;
        this._pressLand = aimed ? blow : 0;
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
    this._carryBoulder();
    this._tendSwordRing(dt);
    // Flinch overlay (additive), the very last pose layer: laid over the brace, the board's squaring and the carries, so a man behind a board still goes back
    // under the blow. It holds full for the first FLINCH_HOLD of its time, so the frame the blow lands on shows it whole.
    if (this._flinchTimer > 0 && this._state !== AnimState.Dead) {
      this._flinchTimer -= dt;
      const intensity = Math.max(0, Math.min(1, this._flinchTimer / (0.35 - FLINCH_HOLD)));
      const b = this._body;
      // A man struck while his own blow comes down on his man carries it through (r2c3): his trunk and weapon arm stay on the blow, only his head goes back
      const committed = intensity * (1 - this._aimWeight);
      // Snap torso backward and to the side
      b.torso.rotation.x -= FLINCH_PITCH * committed;
      b.torso.rotation.z += 0.3 * committed;
      // Head whips back
      b.neck.rotation.x -= FLINCH_HEAD * intensity;
      // Arms flail out
      b.leftShoulder.rotation.z -= 0.5 * intensity;
      b.rightShoulder.rotation.z += 0.5 * committed;
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
      b.torso.rotation.x -= THROWN.trunk * thrown;
      b.neck.rotation.x -= THROWN.head * thrown;
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
    const prop = node ? {
      node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), grip: node.position.clone(),
      spin: scythe ? Quaternion.RotationYawPitchRoll(SCYTHE_SPIN * side, 0, 0) : undefined,
    } : null;
    if (scythe) this._carryTurn = 1;
    // The tree's bowed side (its own +x) is turned about the trunk to face back against the way the trunk runs out, which the carry's turn then brings round to face up
    if (node?.name === "treeClubCarry" && prop) prop.spin = Quaternion.RotationYawPitchRoll(Math.atan2(-TREE_HIP_TIP.z, TREE_HIP_TIP.x * side) + Math.PI, 0, 0);
    const lean = (x: number, y: number, z: number): Vector3 => new Vector3((x + (h(93) - 0.5) * 0.3) * side, y + (h(94) - 0.5) * 0.3, z + (h(95) - 0.5) * 0.3).normalize();
    const pick = h(92);
    // An uprooted tree has one carry, not four (units/secret.tree_giant): the fist at the hip ahead of the thigh, the trunk run out near level to his own side and a
    // little forward, the crown hip-high at his flank, not shouldered or stood up over the line beside him
    const tree = node?.name === "treeClubCarry";
    // and he stands in it from the first frame: a whole tree does not ease round out of the fist's strapped angle
    if (tree) this._carryTurn = 1;
    const attitude = scythe
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
    const rodHold = !rod ? null : staff
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
    for (const hand of [b.rightHand, b.leftHand]) {
      const chain: TransformNode[] = [];
      for (let n: TransformNode | null = hand; n; n = n.parent as TransformNode | null) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
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
  private _contactOn(mark: TransformNode, hand: Vector3): Vector3 {
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
    if (onCrown && Vector3.Distance(hand, crown) >= reach) return crown;
    // His height over the ground the striker stands on (the field is near flat where men press)
    const tall = Math.max(0.001, crown.y - this._body.root.getAbsolutePosition().y);
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
    const marching = Math.max(club, kept ? (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp)) : 0);
    this._carryTurn = this._state === AnimState.Dead ? 0 : this._carryTurn + (marching - this._carryTurn) * Math.min(1, dt * 10);
    // A blow does not wait on the carry's easing: the head is on its arc from the first frame of the swing
    if (club > this._carryTurn) this._carryTurn = club;
    const k = this._carryTurn;
    if (k <= 0.01) {
      if (node.rotationQuaternion) {
        node.rotationQuaternion = null;
        node.position.copyFrom(grip);
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
      Vector3.LerpToRef(tip, new Vector3(0.12 * (Math.sign(this._body.rightShoulder.position.x) || 1), Math.cos(arc), Math.sin(arc)), Math.min(1, club), tip).normalize();
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
    const turn = Quaternion.Slerp(rest, Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(spin ? attitude.multiply(spin) : attitude), k);
    node.rotationQuaternion = turn;
    const held = seat ? seat.clone() : new Vector3(0, grip.length(), 0);
    if (plant) {
      // Stood on the ground: the staff's middle sits as far above the fist as puts its butt at his feet, short of the fist running off either end of it
      const fist = (hand.absolutePosition.y - this._body.root.absolutePosition.y) / Math.max(0.001, hand.absoluteScaling.y);
      const stood = Math.max(-plant * 0.7, Math.min(plant * 0.7, plant - fist));
      held.y += (stood - held.y) * (1 - this._castLift);
    }
    held.rotateByQuaternionToRef(turn, held);
    Vector3.LerpToRef(grip, held, k, node.position);
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
    lean: number; side: number; stride: number; tilt: number; turn: number; crouch: number; chin: number; cock: number;
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
    const pick = h(121);
    const stance = pick < 0.35
      ? { tilt: 0.17 + h(43) * 0.1, stride: 0.24 + h(46) * 0.14, crouch: 0.02 + h(122) * 0.08, chin: 0.05, cock: 0.14 + h(126) * 0.1, off: { raise: 0.3 + h(123) * 0.2, out: 0.5 + h(124) * 0.2, elbow: -1.5 - h(125) * 0.4 } }
      : pick < 0.7
        ? { tilt: 0.05 + h(43) * 0.06, stride: 0.1 + h(46) * 0.1, crouch: 0.25 + h(122) * 0.2, chin: -0.22, cock: 0.02 + h(126) * 0.06, off: { raise: -0.45 - h(123) * 0.3, out: 0.12 + h(124) * 0.2, elbow: -0.8 - h(125) * 0.5 } }
        : { tilt: 0.1 + h(43) * 0.07, stride: 0.14 + h(46) * 0.1, crouch: 0.16 + h(122) * 0.16, chin: -0.08, cock: -0.08 - h(126) * 0.08, off: { raise: 0.28 + h(123) * 0.22, out: 0.06 + h(124) * 0.12, elbow: -0.2 - h(125) * 0.3 } };
    return {
      lean: 0.26 + h(41) * 0.14, // at 0.22-0.38 some rear men stood near vertical; at 0.32-0.52 idle heroes bowed and half squatted
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
    const off = c.board ?? ready?.left ?? (this.locomotionBias !== "aimed" ? p.off : null);
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
  private _animateHeavySwing(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.45);
    const drop = commit + (1 - commit) * 0.45;
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    const pressed = this._pressAim() !== null;
    const cockElbow = pressed ? PRESS_AIM_ELBOW.cock : -1.25;
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
      this._clubArc = pressed ? PRESS_CLUB_COCK : CLUB_COCK * windUp;
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
        this._clubArc = PRESS_CLUB_COCK;
        this._pressLand = e;
      } else this._clubArc = CLUB_COCK + (CLUB_LAND - CLUB_COCK) * e;
    }
    this._clubHold = 1;
    b.rightKnee.rotation.x = 0.12;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateBladeSlash(dt: number): void {
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

  private _animateThrust(dt: number): void {
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
    const c = THROW_COCK;
    if (progress < releasePoint) {
      // Up and back: the fist behind the head, the chest turned off the line and leant away, the other arm out at the foe
      const u = progress / Math.max(releasePoint, 0.001);
      const w = u * (2 - u);
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
    if (progress >= 1) this._state = AnimState.Idle;
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
