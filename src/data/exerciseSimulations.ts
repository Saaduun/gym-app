import { MuscleId } from '../types';

export type SimulationKinematicType =
  | 'bench_press'
  | 'overhead_press'
  | 'incline_press'
  | 'pushups'
  | 'dips'
  | 'squat'
  | 'romanian_deadlift'
  | 'conventional_deadlift'
  | 'pullup'
  | 'lat_pulldown'
  | 'bent_over_row'
  | 'bicep_curl'
  | 'tricep_extension'
  | 'face_pull'
  | 'bulgarian_split_squat'
  | 'pallof_press'
  | 'farmer_carry'
  | 'shadowboxing_cross'
  | 'heavy_bag_strike'
  | 'muay_thai_kick'
  | 'grappling_sprawl'
  | 'generic_compound';

export interface MuscleRecruitmentCurve {
  muscleId: MuscleId;
  name: string;
  role: 'primary' | 'synergist' | 'stabilizer';
  /** Activation percentage at start (0%), peak concentric (50%), and end of eccentric (100%) */
  eccentricTension: number; // 0 - 100
  inflectionTension: number; // 0 - 100 (bottom stretch or peak squeeze)
  concentricTension: number; // 0 - 100
}

export interface JointAngleFrame {
  jointName: string;
  startDeg: number;
  peakDeg: number;
  endDeg: number;
}

export interface ExerciseSimulationData {
  exerciseId: string;
  kinematicType: SimulationKinematicType;
  movementName: string;
  tempo: string; // e.g. "3-1-1-0"
  cadenceSeconds: number; // total cycle time in seconds
  primaryPlane: 'Sagittal' | 'Frontal' | 'Transverse' | 'Multi-planar';
  equipmentType: 'barbell' | 'dumbbells' | 'cable_rope' | 'pullup_bar' | 'heavy_bag' | 'bodyweight';
  phases: {
    start: { name: string; cue: string; durationPct: number };
    eccentric: { name: string; cue: string; durationPct: number };
    pause: { name: string; cue: string; durationPct: number };
    concentric: { name: string; cue: string; durationPct: number };
  };
  muscleRecruitment: MuscleRecruitmentCurve[];
  jointAngles: JointAngleFrame[];
  biomechanicsHighlights: string[];
}

export const EXERCISE_SIMULATIONS: Record<string, ExerciseSimulationData> = {
  barbell_bench_press: {
    exerciseId: 'barbell_bench_press',
    kinematicType: 'bench_press',
    movementName: 'Barbell Flat Bench Press',
    tempo: '3-1-1-0 (Controlled Lower • 1s Pause • Explosive Press)',
    cadenceSeconds: 5.0,
    primaryPlane: 'Transverse',
    equipmentType: 'barbell',
    phases: {
      start: { name: 'Setup & Unrack', cue: 'Retract scapulae, pack lats, stack wrists over forearms.', durationPct: 0.1 },
      eccentric: { name: 'Eccentric Lowering', cue: 'Tuck elbows at ~45-70°, control descent to lower sternum.', durationPct: 0.45 },
      pause: { name: 'Chest Touch / Inflection', cue: 'Maintain strict tension on sternocostal pec fibers without bouncing.', durationPct: 0.15 },
      concentric: { name: 'Concentric Drive', cue: 'Drive feet into floor, press bar up and slightly back over shoulders.', durationPct: 0.3 },
    },
    muscleRecruitment: [
      { muscleId: 'pectoralis_major', name: 'Pectoralis Major', role: 'primary', eccentricTension: 65, inflectionTension: 98, concentricTension: 94 },
      { muscleId: 'anterior_deltoid', name: 'Anterior Deltoid', role: 'primary', eccentricTension: 50, inflectionTension: 75, concentricTension: 88 },
      { muscleId: 'triceps_brachii', name: 'Triceps Brachii', role: 'primary', eccentricTension: 40, inflectionTension: 60, concentricTension: 92 },
      { muscleId: 'latissimus_dorsi', name: 'Latissimus Dorsi', role: 'stabilizer', eccentricTension: 60, inflectionTension: 70, concentricTension: 45 },
      { muscleId: 'rotator_cuff', name: 'Rotator Cuff (Infraspinatus/Subscap)', role: 'stabilizer', eccentricTension: 55, inflectionTension: 65, concentricTension: 55 },
    ],
    jointAngles: [
      { jointName: 'Elbow Joint', startDeg: 180, peakDeg: 75, endDeg: 180 },
      { jointName: 'Shoulder Horizontal Abduction', startDeg: 0, peakDeg: 65, endDeg: 10 },
      { jointName: 'Scapular Retraction', startDeg: 90, peakDeg: 95, endDeg: 90 },
    ],
    biomechanicsHighlights: [
      'Sternocostal pectoralis fibers reach maximum active stretch and tension at bottom reversal.',
      'Triceps lateral and medial heads produce peak torque during the final 30% of lockout extension.',
      'Lats and rotator cuff maintain continuous glenohumeral stability throughout the press arc.',
    ],
  },

  barbell_back_squat: {
    exerciseId: 'barbell_back_squat',
    kinematicType: 'squat',
    movementName: 'Barbell Back Squat',
    tempo: '3-1-1-0 (Controlled Descent • Hole Pause • Drive)',
    cadenceSeconds: 5.2,
    primaryPlane: 'Sagittal',
    equipmentType: 'barbell',
    phases: {
      start: { name: 'Top Brace', cue: 'Valsalva diaphragmatic breath, clamp upper back against bar.', durationPct: 0.1 },
      eccentric: { name: 'Descent (Knees & Hips)', cue: 'Break hips & knees simultaneously, track knees with toes.', durationPct: 0.45 },
      pause: { name: 'Parallel Depth (In the Hole)', cue: 'Hit parallel crease, stay rigid with zero lumbar flexion.', durationPct: 0.15 },
      concentric: { name: 'Ascent Drive', cue: 'Drive midfoot through floor, push traps into bar aggressively.', durationPct: 0.3 },
    },
    muscleRecruitment: [
      { muscleId: 'quadriceps', name: 'Quadriceps (Vastus Lateralis/Medialis)', role: 'primary', eccentricTension: 70, inflectionTension: 96, concentricTension: 98 },
      { muscleId: 'gluteus_maximus', name: 'Gluteus Maximus', role: 'primary', eccentricTension: 60, inflectionTension: 94, concentricTension: 96 },
      { muscleId: 'erector_spinae', name: 'Erector Spinae', role: 'stabilizer', eccentricTension: 80, inflectionTension: 88, concentricTension: 85 },
      { muscleId: 'hamstrings', name: 'Hamstrings (Co-contraction)', role: 'synergist', eccentricTension: 45, inflectionTension: 65, concentricTension: 60 },
      { muscleId: 'transverse_abdominis', name: 'Transverse Abdominis (Core)', role: 'stabilizer', eccentricTension: 75, inflectionTension: 90, concentricTension: 85 },
    ],
    jointAngles: [
      { jointName: 'Knee Flexion', startDeg: 180, peakDeg: 80, endDeg: 180 },
      { jointName: 'Hip Flexion', startDeg: 180, peakDeg: 75, endDeg: 180 },
      { jointName: 'Ankle Dorsiflexion', startDeg: 90, peakDeg: 65, endDeg: 90 },
    ],
    biomechanicsHighlights: [
      'Vastus medialis and lateralis withstand massive eccentric stretch load at 90° knee angle.',
      'Gluteus maximus creates primary hip extension torque accelerating out of the bottom reversal.',
      'Spinal erectors and deep abdominal wall create a rigid hydraulic cylinder resisting forward shear.',
    ],
  },

  romanian_deadlift: {
    exerciseId: 'romanian_deadlift',
    kinematicType: 'romanian_deadlift',
    movementName: 'Romanian Deadlift (RDL)',
    tempo: '3-1-1-0 (Pure Posterior Chain Hinge)',
    cadenceSeconds: 5.0,
    primaryPlane: 'Sagittal',
    equipmentType: 'barbell',
    phases: {
      start: { name: 'Top Lockout', cue: 'Stand tall with neutral pelvis and shoulder blades locked back.', durationPct: 0.1 },
      eccentric: { name: 'Hip Hinge Descent', cue: 'Push hips to back wall, shave bar down thighs with knees locked at 15°.', durationPct: 0.45 },
      pause: { name: 'Hamstring Stretch Depth', cue: 'Maximum tension at mid-shin before any spinal rounding occurs.', durationPct: 0.15 },
      concentric: { name: 'Glute / Hip Drive', cue: 'Drive hips forward, squeeze glutes and hamstrings into standing lockout.', durationPct: 0.3 },
    },
    muscleRecruitment: [
      { muscleId: 'hamstrings', name: 'Hamstrings (Biceps Femoris/Semitendinosus)', role: 'primary', eccentricTension: 75, inflectionTension: 99, concentricTension: 92 },
      { muscleId: 'gluteus_maximus', name: 'Gluteus Maximus', role: 'primary', eccentricTension: 60, inflectionTension: 90, concentricTension: 98 },
      { muscleId: 'erector_spinae', name: 'Erector Spinae', role: 'stabilizer', eccentricTension: 85, inflectionTension: 92, concentricTension: 88 },
      { muscleId: 'latissimus_dorsi', name: 'Lats & Upper Back', role: 'stabilizer', eccentricTension: 65, inflectionTension: 75, concentricTension: 70 },
      { muscleId: 'forearms', name: 'Forearm Grip Flexors', role: 'stabilizer', eccentricTension: 70, inflectionTension: 80, concentricTension: 80 },
    ],
    jointAngles: [
      { jointName: 'Hip Hinge Angle', startDeg: 180, peakDeg: 80, endDeg: 180 },
      { jointName: 'Knee Angle', startDeg: 175, peakDeg: 160, endDeg: 175 },
      { jointName: 'Lumbar Angle', startDeg: 0, peakDeg: 0, endDeg: 0 },
    ],
    biomechanicsHighlights: [
      'Maximizes hamstring recruitment via long-muscle-length eccentric loading and zero knee drift.',
      'Spinal erectors work purely isometrically against horizontal gravitational torque.',
    ],
  },

  overhead_barbell_press: {
    exerciseId: 'overhead_barbell_press',
    kinematicType: 'overhead_press',
    movementName: 'Standing Overhead Barbell Press',
    tempo: '2-1-1-0 (Vertical Thrust • Lockout)',
    cadenceSeconds: 4.5,
    primaryPlane: 'Frontal',
    equipmentType: 'barbell',
    phases: {
      start: { name: 'Rack Position', cue: 'Rest bar on front delts, squeeze glutes and abs tight.', durationPct: 0.1 },
      concentric: { name: 'Upward Drive', cue: 'Tilt head slightly back, press straight up, pull head through window.', durationPct: 0.35 },
      pause: { name: 'Overhead Lockout', cue: 'Lock elbows directly over crown of head, shrug traps upward.', durationPct: 0.15 },
      eccentric: { name: 'Controlled Descent', cue: 'Lower bar back to clavicle along tight vertical path.', durationPct: 0.4 },
    },
    muscleRecruitment: [
      { muscleId: 'anterior_deltoid', name: 'Anterior Deltoid', role: 'primary', eccentricTension: 55, inflectionTension: 95, concentricTension: 92 },
      { muscleId: 'triceps_brachii', name: 'Triceps Brachii', role: 'primary', eccentricTension: 45, inflectionTension: 96, concentricTension: 90 },
      { muscleId: 'trapezius', name: 'Trapezius (Upper/Mid)', role: 'synergist', eccentricTension: 50, inflectionTension: 88, concentricTension: 80 },
      { muscleId: 'transverse_abdominis', name: 'Transverse Abdominis & Glutes', role: 'stabilizer', eccentricTension: 70, inflectionTension: 85, concentricTension: 80 },
    ],
    jointAngles: [
      { jointName: 'Elbow Extension', startDeg: 60, peakDeg: 180, endDeg: 60 },
      { jointName: 'Shoulder Flexion', startDeg: 20, peakDeg: 180, endDeg: 20 },
    ],
    biomechanicsHighlights: [
      'Anterior deltoids produce peak force in the first 60° of vertical drive.',
      'Serratus anterior and trapezius upwardly rotate the scapula to prevent subacromial impingement.',
    ],
  },

  pull_ups: {
    exerciseId: 'pull_ups',
    kinematicType: 'pullup',
    movementName: 'Strict Pull-Ups',
    tempo: '2-1-2-1 (Full Deadhang to Chin Over Bar)',
    cadenceSeconds: 4.8,
    primaryPlane: 'Frontal',
    equipmentType: 'pullup_bar',
    phases: {
      start: { name: 'Deadhang', cue: 'Depress shoulder blades down and back before bending elbows.', durationPct: 0.1 },
      concentric: { name: 'Ascent Pull', cue: 'Drive elbows down into back pockets, pull chest toward bar.', durationPct: 0.35 },
      pause: { name: 'Peak Squeeze', cue: 'Chin over bar, clamp lats and rhomboids at maximum contraction.', durationPct: 0.15 },
      eccentric: { name: 'Controlled Descent', cue: '2-second slow lowering back to deadhang under full lat stretch.', durationPct: 0.4 },
    },
    muscleRecruitment: [
      { muscleId: 'latissimus_dorsi', name: 'Latissimus Dorsi', role: 'primary', eccentricTension: 70, inflectionTension: 98, concentricTension: 95 },
      { muscleId: 'biceps_brachii', name: 'Biceps Brachii', role: 'synergist', eccentricTension: 45, inflectionTension: 88, concentricTension: 85 },
      { muscleId: 'rhomboids', name: 'Rhomboids & Mid Traps', role: 'synergist', eccentricTension: 50, inflectionTension: 94, concentricTension: 90 },
      { muscleId: 'forearms', name: 'Forearms & Grip', role: 'stabilizer', eccentricTension: 75, inflectionTension: 85, concentricTension: 80 },
    ],
    jointAngles: [
      { jointName: 'Elbow Flexion', startDeg: 180, peakDeg: 45, endDeg: 180 },
      { jointName: 'Shoulder Adduction', startDeg: 180, peakDeg: 30, endDeg: 180 },
    ],
    biomechanicsHighlights: [
      'Latissimus dorsi fibers generate massive downward pulling torque across humeral adduction.',
      'Scapular retractors lock the shoulder girdle into optimal biomechanical alignment.',
    ],
  },

  barbell_bent_over_row: {
    exerciseId: 'barbell_bent_over_row',
    kinematicType: 'bent_over_row',
    movementName: 'Barbell Bent-Over Row',
    tempo: '2-1-1-0 (Hinged Back Squeeze)',
    cadenceSeconds: 4.5,
    primaryPlane: 'Sagittal',
    equipmentType: 'barbell',
    phases: {
      start: { name: 'Hinged Stance', cue: 'Lock torso at 45°, core tight, bar hanging below knees.', durationPct: 0.1 },
      concentric: { name: 'Row Pull', cue: 'Pull elbows toward hip crease, touch bar to lower ribcage.', durationPct: 0.35 },
      pause: { name: 'Scapular Squeeze', cue: 'Hold peak retraction, pinch shoulder blades together.', durationPct: 0.15 },
      eccentric: { name: 'Controlled Extension', cue: 'Lower bar under full lat control without losing torso angle.', durationPct: 0.4 },
    },
    muscleRecruitment: [
      { muscleId: 'latissimus_dorsi', name: 'Latissimus Dorsi', role: 'primary', eccentricTension: 60, inflectionTension: 96, concentricTension: 92 },
      { muscleId: 'rhomboids', name: 'Rhomboids', role: 'primary', eccentricTension: 55, inflectionTension: 98, concentricTension: 90 },
      { muscleId: 'trapezius', name: 'Trapezius (Mid/Lower)', role: 'synergist', eccentricTension: 50, inflectionTension: 92, concentricTension: 85 },
      { muscleId: 'erector_spinae', name: 'Erector Spinae', role: 'stabilizer', eccentricTension: 80, inflectionTension: 85, concentricTension: 85 },
      { muscleId: 'biceps_brachii', name: 'Biceps Brachii', role: 'synergist', eccentricTension: 40, inflectionTension: 75, concentricTension: 70 },
    ],
    jointAngles: [
      { jointName: 'Elbow Flexion', startDeg: 180, peakDeg: 70, endDeg: 180 },
      { jointName: 'Shoulder Extension', startDeg: 90, peakDeg: 20, endDeg: 90 },
    ],
    biomechanicsHighlights: [
      'Directly activates mid-back thickness (rhomboids and lower traps) to counteract rounded fight guard postures.',
      'Spinal erectors and hamstrings maintain isometric stiffness throughout the set.',
    ],
  },

  shadowboxing_combinations: {
    exerciseId: 'shadowboxing_combinations',
    kinematicType: 'shadowboxing_cross',
    movementName: 'Shadowboxing: 1-2 Kinetic Chain Cross',
    tempo: 'High-Speed Kinetic Pulse (Pivoting Foot • Core Twist • Strike)',
    cadenceSeconds: 2.4,
    primaryPlane: 'Multi-planar',
    equipmentType: 'bodyweight',
    phases: {
      start: { name: 'Combat Guard', cue: 'Chin down, hands up at cheekbones, weight 50/50 on balls of feet.', durationPct: 0.15 },
      concentric: { name: 'Rear Cross Extension', cue: 'Pivot rear foot, turn hip 90°, extend cross with shoulder protecting chin.', durationPct: 0.35 },
      pause: { name: 'Terminal Impact Lock', cue: 'First two knuckles aligned with forearm, sharp exhale.', durationPct: 0.15 },
      eccentric: { name: 'Recoil / Guard Recovery', cue: 'Snap fist back to guard immediately along same trajectory.', durationPct: 0.35 },
    },
    muscleRecruitment: [
      { muscleId: 'obliques', name: 'Internal & External Obliques', role: 'primary', eccentricTension: 40, inflectionTension: 98, concentricTension: 95 },
      { muscleId: 'anterior_deltoid', name: 'Anterior Deltoid & Pecs', role: 'primary', eccentricTension: 35, inflectionTension: 92, concentricTension: 90 },
      { muscleId: 'gastrocnemius_soleus', name: 'Calves (Plantarflexion Pivot)', role: 'primary', eccentricTension: 60, inflectionTension: 95, concentricTension: 90 },
      { muscleId: 'triceps_brachii', name: 'Triceps Brachii (Punch Snap)', role: 'synergist', eccentricTension: 20, inflectionTension: 90, concentricTension: 85 },
      { muscleId: 'transverse_abdominis', name: 'Transverse Abdominis (Torque Transfer)', role: 'stabilizer', eccentricTension: 70, inflectionTension: 95, concentricTension: 90 },
    ],
    jointAngles: [
      { jointName: 'Torso Rotation', startDeg: 0, peakDeg: 45, endDeg: 0 },
      { jointName: 'Rear Elbow Extension', startDeg: 60, peakDeg: 175, endDeg: 60 },
      { jointName: 'Rear Ankle Plantarflexion', startDeg: 90, peakDeg: 120, endDeg: 90 },
    ],
    biomechanicsHighlights: [
      '80% of punch power originates in ground reaction force from the rear calf and hip rotational torque.',
      'Core musculature acts as a high-velocity power conduit connecting lower body drive to the fist.',
    ],
  },

  heavy_bag_power_intervals: {
    exerciseId: 'heavy_bag_power_intervals',
    kinematicType: 'heavy_bag_strike',
    movementName: 'Heavy Bag Power Strikes',
    tempo: 'Explosive Power Cadence (Rotational Impact Transfer)',
    cadenceSeconds: 2.8,
    primaryPlane: 'Transverse',
    equipmentType: 'heavy_bag',
    phases: {
      start: { name: 'Combat Stance', cue: 'Staggered stance, core primed for explosive rotation.', durationPct: 0.15 },
      concentric: { name: 'Power Drive & Rotation', cue: 'Drive from back hip, rotate shoulders into the bag.', durationPct: 0.35 },
      pause: { name: 'Bag Impact Transfer', cue: 'Solid wrist lock, transmit maximum kinetic energy.', durationPct: 0.2 },
      eccentric: { name: 'Recoil & Circle', cue: 'Snap back to guard and circle the bag.', durationPct: 0.3 },
    },
    muscleRecruitment: [
      { muscleId: 'pectoralis_major', name: 'Pectoralis Major', role: 'primary', eccentricTension: 40, inflectionTension: 96, concentricTension: 90 },
      { muscleId: 'obliques', name: 'Obliques & Core Rotators', role: 'primary', eccentricTension: 50, inflectionTension: 99, concentricTension: 95 },
      { muscleId: 'gluteus_maximus', name: 'Gluteus Maximus (Drive Leg)', role: 'primary', eccentricTension: 55, inflectionTension: 94, concentricTension: 92 },
      { muscleId: 'triceps_brachii', name: 'Triceps Brachii', role: 'synergist', eccentricTension: 30, inflectionTension: 88, concentricTension: 85 },
      { muscleId: 'forearms', name: 'Forearms (Wrist Lock)', role: 'stabilizer', eccentricTension: 75, inflectionTension: 98, concentricTension: 90 },
    ],
    jointAngles: [
      { jointName: 'Torso Angle', startDeg: 0, peakDeg: 40, endDeg: 0 },
      { jointName: 'Elbow Angle', startDeg: 70, peakDeg: 120, endDeg: 70 },
    ],
    biomechanicsHighlights: [
      'High-impact energy transfer requires instant wrist co-contraction to prevent hyperflexion.',
      'Glutes and obliques create rotational shear force translating directly to impact kilograms.',
    ],
  },

  pallof_press: {
    exerciseId: 'pallof_press',
    kinematicType: 'pallof_press',
    movementName: 'Pallof Press (Anti-Rotation Core)',
    tempo: '2-2-2-0 (Anti-Rotational Lockout)',
    cadenceSeconds: 4.5,
    primaryPlane: 'Transverse',
    equipmentType: 'cable_rope',
    phases: {
      start: { name: 'Chest Anchor', cue: 'Hold cable tight against sternum with knees athletic.', durationPct: 0.15 },
      concentric: { name: 'Forward Press', cue: 'Press straight out, resisting lateral rotational pull.', durationPct: 0.35 },
      pause: { name: 'Isometric Anti-Rotation Lock', cue: 'Hold at full arm extension with zero torso twist for 2s.', durationPct: 0.3 },
      eccentric: { name: 'Controlled Return', cue: 'Bring hands back to sternum under full core control.', durationPct: 0.2 },
    },
    muscleRecruitment: [
      { muscleId: 'obliques', name: 'Internal / External Obliques', role: 'primary', eccentricTension: 70, inflectionTension: 99, concentricTension: 95 },
      { muscleId: 'transverse_abdominis', name: 'Transverse Abdominis', role: 'primary', eccentricTension: 75, inflectionTension: 98, concentricTension: 95 },
      { muscleId: 'rectus_abdominis', name: 'Rectus Abdominis', role: 'synergist', eccentricTension: 60, inflectionTension: 85, concentricTension: 80 },
      { muscleId: 'gluteus_medius', name: 'Gluteus Medius (Stance Hip)', role: 'stabilizer', eccentricTension: 65, inflectionTension: 88, concentricTension: 85 },
    ],
    jointAngles: [
      { jointName: 'Elbow Extension', startDeg: 60, peakDeg: 180, endDeg: 60 },
      { jointName: 'Torso Deviation', startDeg: 0, peakDeg: 0, endDeg: 0 },
    ],
    biomechanicsHighlights: [
      'Lever arm increases dramatically as hands extend forward, multiplying rotational shear on the spine.',
      'Obliques and transverse abdominis fire isometrically to preserve pristine spinal neutral.',
    ],
  },

  face_pulls: {
    exerciseId: 'face_pulls',
    kinematicType: 'face_pull',
    movementName: 'Cable / Band Face Pulls',
    tempo: '2-1-2-0 (External Rotation & Scapular Squeeze)',
    cadenceSeconds: 4.2,
    primaryPlane: 'Transverse',
    equipmentType: 'cable_rope',
    phases: {
      start: { name: 'Arms Extended', cue: 'Grip rope ends with thumbs back, arms straight at eye level.', durationPct: 0.1 },
      concentric: { name: 'Pull & Flare', cue: 'Pull center of rope to bridge of nose, flaring elbows high and wide.', durationPct: 0.35 },
      pause: { name: 'External Rotation Peak', cue: 'Hands finish behind elbows in double-bicep flex, squeeze rear delts.', durationPct: 0.2 },
      eccentric: { name: 'Controlled Extension', cue: 'Slowly return to start position without losing shoulder posture.', durationPct: 0.35 },
    },
    muscleRecruitment: [
      { muscleId: 'posterior_deltoid', name: 'Posterior Deltoid', role: 'primary', eccentricTension: 50, inflectionTension: 98, concentricTension: 92 },
      { muscleId: 'rotator_cuff', name: 'Infraspinatus & Teres Minor', role: 'primary', eccentricTension: 55, inflectionTension: 99, concentricTension: 94 },
      { muscleId: 'rhomboids', name: 'Rhomboids & Mid Trapezius', role: 'synergist', eccentricTension: 45, inflectionTension: 92, concentricTension: 88 },
      { muscleId: 'neck_extensors', name: 'Neck & Upper Spine Stabilizers', role: 'stabilizer', eccentricTension: 40, inflectionTension: 60, concentricTension: 55 },
    ],
    jointAngles: [
      { jointName: 'Shoulder Horizontal Abduction', startDeg: 0, peakDeg: 90, endDeg: 0 },
      { jointName: 'Shoulder External Rotation', startDeg: 0, peakDeg: 80, endDeg: 0 },
      { jointName: 'Elbow Flexion', startDeg: 180, peakDeg: 80, endDeg: 180 },
    ],
    biomechanicsHighlights: [
      'The premier protective exercise for fighters: neutralizes internal shoulder rotation caused by repetitive punches.',
      'Activates posterior rotator cuff muscles in their true anatomical external rotation path.',
    ],
  },
};

/**
 * Fallback generator for any exercise not explicitly defined in table
 */
export function getExerciseSimulation(exerciseId: string, fallbackName?: string, primaryMuscles?: MuscleId[], secondaryMuscles?: MuscleId[]): ExerciseSimulationData {
  if (EXERCISE_SIMULATIONS[exerciseId]) {
    return EXERCISE_SIMULATIONS[exerciseId];
  }

  // Derive smart simulation from exercise name or primary muscles
  const pMuscles: MuscleId[] = primaryMuscles && primaryMuscles.length > 0 ? primaryMuscles : ['quadriceps', 'gluteus_maximus'];
  const sMuscles: MuscleId[] = secondaryMuscles && secondaryMuscles.length > 0 ? secondaryMuscles : ['transverse_abdominis', 'erector_spinae'];

  let inferredKinematic: SimulationKinematicType = 'generic_compound';
  const lowerId = exerciseId.toLowerCase();

  if (lowerId.includes('squat') || lowerId.includes('leg_press')) inferredKinematic = 'squat';
  else if (lowerId.includes('bench') || lowerId.includes('press_flat')) inferredKinematic = 'bench_press';
  else if (lowerId.includes('overhead') || lowerId.includes('shoulder_press')) inferredKinematic = 'overhead_press';
  else if (lowerId.includes('deadlift') || lowerId.includes('rdl') || lowerId.includes('hinge')) inferredKinematic = 'romanian_deadlift';
  else if (lowerId.includes('pull') || lowerId.includes('chin') || lowerId.includes('lat')) inferredKinematic = 'pullup';
  else if (lowerId.includes('row')) inferredKinematic = 'bent_over_row';
  else if (lowerId.includes('curl')) inferredKinematic = 'bicep_curl';
  else if (lowerId.includes('tricep') || lowerId.includes('pushdown')) inferredKinematic = 'tricep_extension';
  else if (lowerId.includes('box') || lowerId.includes('punch') || lowerId.includes('strike')) inferredKinematic = 'shadowboxing_cross';
  else if (lowerId.includes('bag')) inferredKinematic = 'heavy_bag_strike';
  else if (lowerId.includes('kick')) inferredKinematic = 'muay_thai_kick';
  else if (lowerId.includes('core') || lowerId.includes('pallof') || lowerId.includes('twist')) inferredKinematic = 'pallof_press';

  return {
    exerciseId,
    kinematicType: inferredKinematic,
    movementName: fallbackName || exerciseId.replace(/_/g, ' ').toUpperCase(),
    tempo: '3-1-1-0 (Controlled Eccentric • Peak Contraction • Drive)',
    cadenceSeconds: 4.5,
    primaryPlane: 'Sagittal',
    equipmentType: 'barbell',
    phases: {
      start: { name: 'Initial Alignment', cue: 'Set baseline posture, brace intra-abdominal core pressure.', durationPct: 0.1 },
      eccentric: { name: 'Controlled Phase', cue: 'Load the target muscles with steady tempo through full range of motion.', durationPct: 0.45 },
      pause: { name: 'Peak Contraction', cue: 'Squeeze target muscle fibers with strict joint stability.', durationPct: 0.15 },
      concentric: { name: 'Dynamic Drive', cue: 'Accelerate through the primary force vector to lockout.', durationPct: 0.3 },
    },
    muscleRecruitment: [
      ...pMuscles.map((m) => ({
        muscleId: m,
        name: m.replace(/_/g, ' '),
        role: 'primary' as const,
        eccentricTension: 65,
        inflectionTension: 96,
        concentricTension: 92,
      })),
      ...sMuscles.map((m) => ({
        muscleId: m,
        name: m.replace(/_/g, ' '),
        role: 'synergist' as const,
        eccentricTension: 45,
        inflectionTension: 75,
        concentricTension: 70,
      })),
    ],
    jointAngles: [
      { jointName: 'Primary Joint Axis', startDeg: 180, peakDeg: 80, endDeg: 180 },
      { jointName: 'Stabilizer Joint Axis', startDeg: 0, peakDeg: 0, endDeg: 0 },
    ],
    biomechanicsHighlights: [
      'Agonist muscles experience high mechanical tension at the turnaround point.',
      'Synergists and core stabilizers maintain joint integrity and prevent energy dissipation.',
    ],
  };
}
