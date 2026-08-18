import { ExerciseDefinition } from '../types';

export const EXERCISES_DATABASE: ExerciseDefinition[] = [
  // WEIGHT TRAINING / STRENGTH EXERCISES
  {
    id: 'barbell_bench_press',
    name: 'Barbell Flat Bench Press',
    modeCategory: 'weight_training',
    subCategory: 'Compound Horizontal Push',
    difficulty: 'Intermediate',
    defaultSets: 4,
    defaultRepsOrTime: '6 - 8 reps',
    defaultRestSec: 120,
    primaryMuscles: ['pectoralis_major', 'anterior_deltoid', 'triceps_brachii'],
    secondaryMuscles: ['pectoralis_minor', 'rotator_cuff', 'latissimus_dorsi'],
    jointMovements: ['Glenohumeral Horizontal Adduction', 'Elbow Extension', 'Scapular Retraction & Depression'],
    rangeOfMotion: 'Full ROM from touching mid-sternum to complete elbow extension without unlocking scapular retraction.',
    startingPosition: 'Lie flat with eyes beneath the racked barbell. Set feet firmly flat on the floor, grip the bar slightly wider than shoulder-width, pinch shoulder blades together, and create a moderate natural arch in the lumbar spine.',
    movementPattern: 'Unrack with straight arms. Inhale and lower the bar in a controlled diagonal arc toward the lower chest/sternum, keeping elbows tucked at ~45-75 degrees. Lightly touch the chest, then press explosively upward and slightly back over the shoulder joint while exhaling.',
    techniqueInstructions: [
      'Maintain continuous leg drive by pushing through your heels into the ground.',
      'Keep your wrists neutral and stacked directly over your forearms.',
      'Squeeze the bar hard to maximize muscular irradiation and shoulder joint stability.',
      'Do not allow the elbows to flare out at a 90-degree angle to the torso.'
    ],
    commonMistakes: [
      'Bouncing the bar off the ribcage.',
      'Flaring elbows outward excessively, causing anterior shoulder impingement strain.',
      'Lifting hips and glutes off the bench during the press phase.'
    ],
    safetyConsiderations: [
      'Always use safety catch pins if lifting without a spotter.',
      'Ensure thumb wraps securely around the bar (avoid open/suicide grip).',
      'If anterior shoulder discomfort occurs, narrow the grip width slightly and reduce load.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Pectoralis Major (sternocostal head) & Triceps Brachii',
      stabilizers: 'Rotator Cuff complex, Latissimus Dorsi, Posterior Deltoid',
      movementPlane: 'Transverse',
      forceVector: 'Anterior-superior push relative to the supine torso'
    },
    combatApplication: 'Builds foundational upper-body pushing power necessary for maintaining dominant collar ties, stiff-arming opponents, and delivering heavy straight strikes.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells']
  },
  {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    modeCategory: 'weight_training',
    subCategory: 'Compound Bilateral Squat',
    difficulty: 'Intermediate',
    defaultSets: 4,
    defaultRepsOrTime: '6 - 8 reps',
    defaultRestSec: 150,
    primaryMuscles: ['quadriceps', 'gluteus_maximus', 'erector_spinae'],
    secondaryMuscles: ['hamstrings', 'transverse_abdominis', 'gluteus_medius', 'gastrocnemius_soleus'],
    jointMovements: ['Hip Flexion/Extension', 'Knee Flexion/Extension', 'Ankle Dorsiflexion/Plantarflexion'],
    rangeOfMotion: 'Descend until hip crease is parallel to or slightly below the top of the patella (parallel depth).',
    startingPosition: 'Position the barbell across the upper trapezius (high bar) or across the posterior deltoids (low bar). Stand with feet slightly wider than shoulder-width, toes turned outward 15-30 degrees.',
    movementPattern: 'Take a deep diaphragmatic breath and brace the core (Valsalva). Break simultaneously at hips and knees, sitting down between the thighs while driving knees out in line with toes. Drive out of the bottom through mid-foot to stand erect.',
    techniqueInstructions: [
      'Keep chest elevated and maintain a neutral cervical/thoracic spine throughout.',
      'Ensure knees track directly in line with your second and third toes.',
      'Drive the floor away aggressively on the ascent while maintaining core tension.'
    ],
    commonMistakes: [
      'Allowing knees to cave inward (valgus collapse).',
      'Rounding the lower back (lumbar flexion or "butt wink") under heavy loads.',
      'Rising onto the toes and letting the center of mass shift excessively forward.'
    ],
    safetyConsiderations: [
      'Set squat rack safety bars at just below your parallel depth.',
      'Warm up ankle dorsiflexion and hip capsule mobility prior to heavy loading.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Quadriceps Femoris & Gluteus Maximus',
      stabilizers: 'Erector Spinae, Transverse Abdominis, Gluteus Medius',
      movementPlane: 'Sagittal',
      forceVector: 'Vertical axial compression and ground reaction force'
    },
    combatApplication: 'Provides the foundation for explosive hip extension and level changes in wrestling double/single-leg takedowns, and lower body base stability.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells']
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    modeCategory: 'weight_training',
    subCategory: 'Posterior Chain Hip Hinge',
    difficulty: 'Intermediate',
    defaultSets: 3,
    defaultRepsOrTime: '8 - 10 reps',
    defaultRestSec: 120,
    primaryMuscles: ['hamstrings', 'gluteus_maximus', 'erector_spinae'],
    secondaryMuscles: ['latissimus_dorsi', 'trapezius', 'forearms', 'transverse_abdominis'],
    jointMovements: ['Hip Flexion & Extension (Pure Hinge)', 'Minimal Knee Flexion (15-20 deg locked)'],
    rangeOfMotion: 'From standing tall to mid-shin depth where hamstring tension is maximum before lumbar flexion occurs.',
    startingPosition: 'Stand tall holding a barbell with an overhand grip at hip height, shoulder blades retracted, feet hip-width apart.',
    movementPattern: 'Unlock knees slightly and keep them fixed at that angle. Hinge back at the hips, pushing glutes toward the wall behind you while keeping the bar in contact with your thighs and shins. When you reach maximum hamstring stretch, contract glutes and hamstrings to drive hips forward to the starting position.',
    techniqueInstructions: [
      'Keep the bar shaving against your legs throughout the entire movement.',
      'Maintain an isometric neutral spine; do not let the upper or lower back round.',
      'Focus on pushing your hips back rather than bending forward at the waist.'
    ],
    commonMistakes: [
      'Squatting down by bending the knees excessively instead of hinging hips back.',
      'Letting the barbell drift away from the shins, drastically increasing lumbar shear force.',
      'Hyperextending the lower back at the top lockout.'
    ],
    safetyConsiderations: [
      'Stop descending immediately once your hips stop traveling backward to preserve lumbar health.',
      'Ensure proper grip and core bracing before initiating the hinge.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Biceps Femoris, Semitendinosus, Semimembranosus, Gluteus Maximus',
      stabilizers: 'Erector Spinae, Lats, Rhomboids, Deep Core',
      movementPlane: 'Sagittal',
      forceVector: 'Horizontal-posterior hip displacement against vertical gravity load'
    },
    combatApplication: 'Builds bulletproof hamstring deceleration resilience for high kick returns, sprawl defense power, and bridge power in grappling.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells', 'dumbbells_only']
  },
  {
    id: 'overhead_barbell_press',
    name: 'Standing Overhead Barbell Press (OHP)',
    modeCategory: 'weight_training',
    subCategory: 'Vertical Push',
    difficulty: 'Intermediate',
    defaultSets: 3,
    defaultRepsOrTime: '6 - 8 reps',
    defaultRestSec: 120,
    primaryMuscles: ['anterior_deltoid', 'triceps_brachii', 'trapezius'],
    secondaryMuscles: ['lateral_deltoid', 'rotator_cuff', 'pectoralis_major', 'transverse_abdominis', 'gluteus_maximus'],
    jointMovements: ['Glenohumeral Flexion & Abduction', 'Elbow Extension', 'Scapular Upward Rotation'],
    rangeOfMotion: 'From resting across the clavicle / upper chest to full lockout overhead with head moving slightly forward into the window.',
    startingPosition: 'Stand with feet shoulder-width apart. Rest the barbell across the front deltoids and clavicles, hands just outside shoulders, elbows slightly in front of the bar.',
    movementPattern: 'Brace glutes and abs tight. Tilt head back slightly to clear the chin and press the bar vertically in a straight path. Once the bar passes the forehead, push head forward into neutral alignment and lock out arms directly over the midfoot.',
    techniqueInstructions: [
      'Squeeze glutes and quads hard to create a solid, immovable base.',
      'Do not lean backward excessively to turn the lift into an incline press.',
      'Finish with the barbell balanced directly over the crown of the head and midfoot.'
    ],
    commonMistakes: [
      'Excessive hyperextension of the lumbar spine.',
      'Pressing the bar out in front rather than in a tight vertical trajectory.',
      'Flaring elbows completely to the sides on the initial push.'
    ],
    safetyConsiderations: [
      'If shoulder impingement is present, substitute with neutral-grip dumbbell press or landmine press.',
      'Maintain rigid abdominal pressure to protect the lower back.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Anterior Deltoid & Triceps Brachii',
      stabilizers: 'Upper/Lower Trapezius, Serratus Anterior, Gluteals, Core',
      movementPlane: 'Frontal & Sagittal',
      forceVector: 'Direct vertical upward thrust'
    },
    combatApplication: 'Develops shoulder endurance for maintaining a high defensive guard in late rounds, and vertical frames in wrestling tie-ups.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells']
  },
  {
    id: 'pull_ups',
    name: 'Strict Pull-Ups (Overhand Grip)',
    modeCategory: 'weight_training',
    subCategory: 'Vertical Pull',
    difficulty: 'Intermediate',
    defaultSets: 4,
    defaultRepsOrTime: '6 - 10 reps',
    defaultRestSec: 90,
    primaryMuscles: ['latissimus_dorsi', 'biceps_brachii', 'rhomboids'],
    secondaryMuscles: ['trapezius', 'posterior_deltoid', 'forearms', 'rectus_abdominis'],
    jointMovements: ['Glenohumeral Adduction & Extension', 'Elbow Flexion', 'Scapular Depression & Retraction'],
    rangeOfMotion: 'From a full dead hang with scapulae depressed to chin clearing the bar at the top.',
    startingPosition: 'Hang from an overhead pull-up bar with an overhand grip slightly wider than shoulder-width, legs straight or crossed, core braced in a hollow body position.',
    movementPattern: 'Initiate the movement by pulling shoulder blades down and back. Pull your chest toward the bar by driving your elbows down toward your hips. Hold briefly at the top with chin over bar, then lower with control to the dead hang position.',
    techniqueInstructions: [
      'Avoid swinging or kipping legs for momentum.',
      'Focus on driving elbows into your back pockets.',
      'Lower under control for a full 2-second eccentric phase.'
    ],
    commonMistakes: [
      'Cutting the range of motion short at the bottom.',
      'Craning the neck forward over the bar rather than pulling the upper chest up.',
      'Shrugging the shoulders up into the ears during the pull.'
    ],
    safetyConsiderations: [
      'Warm up the rotator cuff and shoulder capsules before doing heavy weighted pull-ups.',
      'Use resistance bands or lat pulldowns if unable to perform strict full ROM reps.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Latissimus Dorsi & Biceps Brachii',
      stabilizers: 'Rhomboids, Lower Trapezius, Core musculature, Grip flexors',
      movementPlane: 'Frontal',
      forceVector: 'Vertical body displacement pulling upward'
    },
    combatApplication: 'Essential upper body pulling power for breaking posture in closed guard, snapping an opponent down in wrestling, and Thai clinch control.',
    equipmentRequired: ['full_gym', 'bodyweight', 'combat_gym']
  },
  {
    id: 'barbell_bent_over_row',
    name: 'Barbell Bent-Over Row (Pendlay / Standard)',
    modeCategory: 'weight_training',
    subCategory: 'Horizontal Pull',
    difficulty: 'Intermediate',
    defaultSets: 3,
    defaultRepsOrTime: '8 - 10 reps',
    defaultRestSec: 90,
    primaryMuscles: ['latissimus_dorsi', 'rhomboids', 'trapezius', 'posterior_deltoid'],
    secondaryMuscles: ['biceps_brachii', 'erector_spinae', 'forearms', 'hamstrings'],
    jointMovements: ['Glenohumeral Extension & Horizontal Abduction', 'Elbow Flexion', 'Scapular Retraction'],
    rangeOfMotion: 'From full arm extension with barbell below knees to touching lower ribcage/navel.',
    startingPosition: 'Hinge at hips with torso angled between 45 degrees and parallel to the floor, back straight, holding bar with overhand grip.',
    movementPattern: 'Brace core and pull the barbell toward the lower abdomen/hip crease by driving elbows backward. Squeeze shoulder blades together at the apex, pause for a split second, and lower with control.',
    techniqueInstructions: [
      'Keep your torso static; avoid jerking your upper body upward to cheat the weight.',
      'Pull with your elbows, not just your hands.',
      'Keep your cervical spine neutral (look at the floor a few feet ahead).'
    ],
    commonMistakes: [
      'Standing too upright and turning the movement into a shrug.',
      'Rounding the lumbar spine under heavy load.',
      'Bouncing or using heavy hip drive to move the bar.'
    ],
    safetyConsiderations: [
      'Maintain strong intra-abdominal bracing to protect the lumbar spine.',
      'Lower the weight if you cannot achieve a brief pause at peak contraction.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Latissimus Dorsi, Rhomboids, Mid/Lower Traps',
      stabilizers: 'Erector Spinae, Hamstrings, Gluteus Maximus, Forearms',
      movementPlane: 'Sagittal',
      forceVector: 'Horizontal-anterior to posterior pull against gravity'
    },
    combatApplication: 'Develops row grip and back thickness necessary for underhook battles, body locks, and pulling an opponent into submission setups.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells']
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    modeCategory: 'weight_training',
    subCategory: 'Unilateral Knee/Hip Dominant',
    difficulty: 'Intermediate',
    defaultSets: 3,
    defaultRepsOrTime: '8 - 10 reps / leg',
    defaultRestSec: 90,
    primaryMuscles: ['quadriceps', 'gluteus_maximus', 'gluteus_medius'],
    secondaryMuscles: ['hamstrings', 'hip_flexors', 'gastrocnemius_soleus', 'transverse_abdominis'],
    jointMovements: ['Unilateral Hip Flexion/Extension', 'Knee Flexion/Extension', 'Pelvic Frontal Plane Stabilization'],
    rangeOfMotion: 'Descend until back knee hovers just an inch above the floor.',
    startingPosition: 'Stand in a lunge stance with the top of your rear foot elevated on a bench or sturdy box 12-18 inches high, holding dumbbells by your sides.',
    movementPattern: 'Lower the hips straight down and slightly backward, keeping the front shin relatively vertical and front foot planted firmly. Drive through the mid-foot of the front leg to return to the top position.',
    techniqueInstructions: [
      'Distribute 85% of your weight through the front leg.',
      'Keep torso upright with a slight forward lean from the hip.',
      'Do not allow the front knee to collapse inward.'
    ],
    commonMistakes: [
      'Pushing too much weight into the elevated rear foot.',
      'Taking too short or too long a stride, stressing the patellar tendon or hip flexor.',
      'Losing pelvic balance and tilting sideways.'
    ],
    safetyConsiderations: [
      'Begin with bodyweight only until hip stability and balance are proficient.',
      'Keep eyes focused on a stationary point ahead for balance.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Quadriceps & Gluteus Maximus (Front leg)',
      stabilizers: 'Gluteus Medius/Minimus, Core stabilizers, Ankle evertors',
      movementPlane: 'Sagittal with high Frontal stability demand',
      forceVector: 'Unilateral vertical drive'
    },
    combatApplication: 'Directly reinforces single-leg balance and hip stability required for head kicks, spinning back kicks, and single-leg takedown defense.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells', 'dumbbells_only', 'bodyweight']
  },
  {
    id: 'face_pulls',
    name: 'Cable / Band Face Pulls',
    modeCategory: 'weight_training',
    subCategory: 'Postural & Rotator Cuff Health',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '12 - 15 reps',
    defaultRestSec: 60,
    primaryMuscles: ['posterior_deltoid', 'rotator_cuff', 'rhomboids', 'trapezius'],
    secondaryMuscles: ['biceps_brachii', 'neck_extensors'],
    jointMovements: ['Shoulder Horizontal Abduction', 'Shoulder External Rotation', 'Scapular Retraction'],
    rangeOfMotion: 'From full arm extension to hands separated at ear level with external rotation.',
    startingPosition: 'Attach a rope to a cable pulley at eye level or secure a loop band. Grip the rope ends with thumbs pointing backward or upward, stand in a staggered stance.',
    movementPattern: 'Pull the center of the rope toward your bridge of the nose while actively flaring your elbows high and pulling your hands backward into external rotation (making a "double bicep" flex pose). Squeeze rear delts and mid-traps for a full second, then return under control.',
    techniqueInstructions: [
      'Emphasize external rotation: your hands should finish behind your elbows.',
      'Keep your neck relaxed and do not jut the chin forward.',
      'Focus on mind-muscle connection rather than moving heavy weight.'
    ],
    commonMistakes: [
      'Using too much weight and turning it into a sloppy row with zero external rotation.',
      'Arching the lower back to compensate for poor shoulder mobility.',
      'Dropping elbows below the wrists.'
    ],
    safetyConsiderations: [
      'Maintain moderate, controlled weight to target the small rotator cuff and rear deltoid stabilizers effectively.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Posterior Deltoid, Infraspinatus, Teres Minor',
      stabilizers: 'Middle/Lower Trapezius, Rhomboids',
      movementPlane: 'Transverse & Frontal',
      forceVector: 'Horizontal pull with external rotational torque'
    },
    combatApplication: 'The #1 preventative exercise for martial artists: offsets the internal shoulder rotation caused by thousands of punches, protecting the rotator cuff.',
    equipmentRequired: ['full_gym', 'combat_gym', 'bodyweight']
  },
  {
    id: 'pallof_press',
    name: 'Pallof Press (Anti-Rotation Core)',
    modeCategory: 'weight_training',
    subCategory: 'Anti-Rotation Core Stability',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '10 reps / side (or 20s hold)',
    defaultRestSec: 60,
    primaryMuscles: ['obliques', 'transverse_abdominis', 'rectus_abdominis'],
    secondaryMuscles: ['gluteus_medius', 'anterior_deltoid', 'rotator_cuff'],
    jointMovements: ['Isometric Anti-Rotation', 'Elbow Extension with Static Torso'],
    rangeOfMotion: 'Pressing hands straight out from mid-sternum to full extension and holding against rotational pull.',
    startingPosition: 'Stand perpendicular to a cable station or resistance band anchored at chest height. Hold the handle/band with both hands tight against your sternum with an athletic knee bend and feet shoulder-width apart.',
    movementPattern: 'Brace your core tight. Press the cable/band straight out in front of your chest until arms are fully extended. Resist the rotational torque pulling you toward the anchor. Hold for 2 seconds at full extension, then return slowly to your chest.',
    techniqueInstructions: [
      'Do not allow your shoulders or hips to rotate toward the anchor point.',
      'Keep your glutes squeezed and pelvis level.',
      'Breathe into your diaphragm while maintaining full core stiffness.'
    ],
    commonMistakes: [
      'Letting the torso twist or tilt with the band tension.',
      'Shrugging the shoulders upward toward the ears during the press.',
      'Standing too close to the anchor with zero tension.'
    ],
    safetyConsiderations: [
      'Keep the weight manageable so that zero torso twisting occurs.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Internal/External Obliques & Transverse Abdominis (Isometric)',
      stabilizers: 'Gluteus Medius, Pectorals, Scapular retractors',
      movementPlane: 'Transverse (Anti-Rotational)',
      forceVector: 'Lateral rotational shear resistance'
    },
    combatApplication: 'Builds iron rotational stiffness to absorb heavy body hooks and resist getting spun around during clinch tie-ups.',
    equipmentRequired: ['full_gym', 'combat_gym', 'bodyweight']
  },
  {
    id: 'farmer_carries',
    name: 'Heavy Farmer Carries / Walks',
    modeCategory: 'weight_training',
    subCategory: 'Loaded Carry & Work Capacity',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '40 - 50 meters (or 40s)',
    defaultRestSec: 90,
    primaryMuscles: ['forearms', 'trapezius', 'transverse_abdominis', 'obliques'],
    secondaryMuscles: ['gluteus_medius', 'quadriceps', 'erector_spinae', 'gastrocnemius_soleus'],
    jointMovements: ['Locomotion with Static Grip and Trunk Bracing'],
    rangeOfMotion: 'Continuous walking over set distance with zero trunk swaying.',
    startingPosition: 'Stand between two heavy dumbbells, kettlebells, or trap bar. Deadlift the weights up with a flat back, stand tall with proud chest, shoulders back and down.',
    movementPattern: 'Take short, quick, controlled heel-to-toe steps forward. Maintain tall posture without leaning forward, backward, or swaying side-to-side.',
    techniqueInstructions: [
      'Crush the handles with your grip to activate the forearm and shoulder stabilizers.',
      'Keep ribs locked down over your pelvis (no rib flaring).',
      'Walk in a straight line with deliberate, controlled strides.'
    ],
    commonMistakes: [
      'Letting the weights pull the shoulders forward into internal rotation.',
      'Taking giant, uncontrolled strides that cause hip drop.',
      'Holding breath instead of rhythmically breathing under tension.'
    ],
    safetyConsiderations: [
      'Deadlift the weights up with safe technique; do not round the back to pick them up.',
      'Clear the walking path of any tripping hazards.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Forearm flexors & Trapezius (Isometric)',
      stabilizers: 'Quadratus Lumborum, Obliques, Gluteus Medius',
      movementPlane: 'Frontal & Sagittal stabilization during linear gait',
      forceVector: 'Downward gravitational drag resisted by vertical structural integrity'
    },
    combatApplication: 'Develops crushing grip endurance for grappling and the mental and physical grit required for deep championship combat rounds.',
    equipmentRequired: ['full_gym', 'barbell_dumbbells', 'dumbbells_only', 'combat_gym']
  },

  // MARTIAL ARTS DRILLS & SESSIONS
  {
    id: 'shadowboxing_combinations',
    name: 'Shadowboxing: Combinations & Head Movement',
    modeCategory: 'martial_arts',
    subCategory: 'Technique & Striking Fluidity',
    martialCategory: 'Technique',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '3-minute rounds (1 min rest)',
    defaultRestSec: 60,
    primaryMuscles: ['anterior_deltoid', 'obliques', 'gastrocnemius_soleus', 'rectus_abdominis'],
    secondaryMuscles: ['pectoralis_major', 'posterior_deltoid', 'gluteus_maximus', 'hip_flexors'],
    jointMovements: ['Multi-planar kinetic chain rotation', 'Ankle Plantarflexion bounce', 'Thoracic rotation'],
    rangeOfMotion: 'Fluid combat stance striking and slipping angles through full rotational range.',
    startingPosition: 'Take an athletic boxing stance (orthodox or southpaw), hands protecting chin, elbows tucked, knees relaxed, chin down.',
    movementPattern: 'Flow through fundamental punch combinations (1-2 Jab-Cross, 1-2-3 Jab-Cross-Lead Hook, 1-1-2) integrated with defensive slips, rolls, and pivot steps. Visualize an opponent in front of you.',
    techniqueInstructions: [
      'Turn the back hip and heel over completely on the cross to generate power from the floor.',
      'Snap punches out and bring your hands right back to your cheekbones.',
      'Move your head off the centerline before and immediately after throwing combinations.',
      'Exhale sharply with each strike.'
    ],
    commonMistakes: [
      'Dropping the non-punching hand when throwing a strike.',
      'Reaching forward off balance rather than pivoting weight smoothly between feet.',
      'Stiffening up and forgetting to stay light on the balls of the feet.'
    ],
    safetyConsiderations: [
      'Do not hyperextend your elbows when punching the air; stop just shy of full lockout.',
      'Stay relaxed to prevent acute shoulder tightness.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Ground reaction force transferred through Kinetic Chain (Hips -> Core -> Shoulders -> Fist)',
      stabilizers: 'Rotator Cuff, Transverse Abdominis, Ankle evertors',
      movementPlane: 'Multi-planar',
      forceVector: 'Rotational torque and linear horizontal projection'
    },
    combatApplication: 'Hones timing, spatial awareness, punch accuracy, and fluid defensive transitions without joint impact.',
    equipmentRequired: ['bodyweight', 'combat_gym', 'home_bag']
  },
  {
    id: 'heavy_bag_power_intervals',
    name: 'Heavy Bag: Power & Speed Intervals',
    modeCategory: 'martial_arts',
    subCategory: 'Combat Conditioning & Power Endurance',
    martialCategory: 'Power',
    difficulty: 'Intermediate',
    defaultSets: 4,
    defaultRepsOrTime: '3-minute rounds (30s high power / 30s volume)',
    defaultRestSec: 60,
    primaryMuscles: ['pectoralis_major', 'obliques', 'gluteus_maximus', 'triceps_brachii', 'latissimus_dorsi'],
    secondaryMuscles: ['anterior_deltoid', 'quadriceps', 'forearms', 'gastrocnemius_soleus'],
    jointMovements: ['High-Velocity Impact Kinetic Chain', 'Rotational Torso Power', 'Plantarflexion drive'],
    rangeOfMotion: 'High-impact strikes into the heavy bag at mid to close range.',
    startingPosition: 'Stand at punching distance from the heavy bag in combat stance with hand wraps and boxing gloves securely fastened.',
    movementPattern: 'Alternate between 30 seconds of high-frequency volume punching/combinations and 30 seconds of maximal power shots (rear hooks, body rips, heavy crosses). Circle the bag between combinations.',
    techniqueInstructions: [
      'Align the first two knuckles with your forearm to prevent wrist collapse on impact.',
      'Sit down on your punches and engage your hips for maximal kinetic energy transfer.',
      'Maintain active footwork around the moving bag rather than standing static.'
    ],
    commonMistakes: [
      'Pushing the bag rather than snapping your strikes into it.',
      'Neglecting wrist alignment and bending wrists upon heavy impact.',
      'Battering the bag while holding your breath and gassing out early.'
    ],
    safetyConsiderations: [
      'Always wrap hands properly with 180-inch wraps and wear at least 12-16 oz gloves.',
      'If wrist or thumb pain develops, stop immediately and check glove fit/wrapping.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Rotational kinetic chain from Gluteus Maximus/Obliques to Upper Extremity',
      stabilizers: 'Wrist flexors/extensors, Cervical stabilizers, Rotator cuff',
      movementPlane: 'Multi-planar',
      forceVector: 'Impulse impact force into stationary/swinging bag'
    },
    combatApplication: 'Builds genuine bone density, wrist impact resilience, and high-lactate combat endurance for late-fight knockouts.',
    equipmentRequired: ['combat_gym', 'home_bag']
  },
  {
    id: 'muay_thai_teep_roundhouse',
    name: 'Muay Thai: Teep & Roundhouse Kicking Drills',
    modeCategory: 'martial_arts',
    subCategory: 'Lower Limb Striking & Hip Rotation',
    martialCategory: 'Technique',
    difficulty: 'Intermediate',
    defaultSets: 4,
    defaultRepsOrTime: '20 kicks / leg (or 3-min round)',
    defaultRestSec: 60,
    primaryMuscles: ['hip_flexors', 'gluteus_medius', 'obliques', 'quadriceps'],
    secondaryMuscles: ['gastrocnemius_soleus', 'tibialis_anterior', 'rectus_abdominis', 'hamstrings'],
    jointMovements: ['Hip Flexion & Internal/External Rotation', 'Standing Leg Ankle Plantarflexion Pivot', 'Knee Extension'],
    rangeOfMotion: 'Full 180-degree hip turnover on roundhouse kicks and rapid linear hip thrust on teeps.',
    startingPosition: 'Muay Thai high stance, weight slightly more on the rear leg, hands high at eye level.',
    movementPattern: 'For Teep (Push Kick): Chamber the knee straight to chest, thrust the hips forward, stabbing the ball of the foot into target. For Roundhouse Kick: Step out 45 degrees, pivot high on the ball of the supporting foot, turn the hip over completely like chopping a tree, and impact with the lower third of the shin bone.',
    techniqueInstructions: [
      'Swing the same-side arm down while turning the hip to counterbalance the kick.',
      'Keep the non-kicking hand glued to your temple for defensive protection.',
      'Pivot on the ball of the base foot at least 90 to 180 degrees to open the hip.'
    ],
    commonMistakes: [
      'Kicking with the fragile foot bones instead of the dense shin bone.',
      'Failing to pivot the supporting foot, putting dangerous torsion on the standing knee.',
      'Leaning the head too low and leaving the chin exposed to counters.'
    ],
    safetyConsiderations: [
      'Warm up adductors, hamstrings, and hip internal rotators thoroughly before high kicking.',
      'Use Thai pads or heavy bag; never kick hard objects with unconditioned shins.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Iliopsoas (Teep), Gluteus Medius & Obliques (Roundhouse)',
      stabilizers: 'Single-leg ankle complex, Contralateral gluteus medius, Core',
      movementPlane: 'Sagittal (Teep) & Transverse/Rotational (Roundhouse)',
      forceVector: 'Forward linear thrust vs angular rotational whip'
    },
    combatApplication: 'Teeps control distance and drain opponent stamina; roundhouse kicks damage opponent arms, ribs, and legs (low kicks).',
    equipmentRequired: ['combat_gym', 'home_bag', 'bodyweight']
  },
  {
    id: 'takedown_penetration_steps',
    name: 'Wrestling: Double Leg Penetration Steps & Sprawls',
    modeCategory: 'martial_arts',
    subCategory: 'Grappling Level Change & Explosiveness',
    martialCategory: 'Conditioning',
    difficulty: 'Intermediate',
    defaultSets: 4,
    defaultRepsOrTime: '10 penetrations + 10 sprawls / set',
    defaultRestSec: 60,
    primaryMuscles: ['quadriceps', 'gluteus_maximus', 'hip_flexors', 'hamstrings'],
    secondaryMuscles: ['erector_spinae', 'transverse_abdominis', 'neck_extensors', 'tibialis_anterior'],
    jointMovements: ['Rapid Knee Flexion/Level Change', 'Hip Thrust & Drive', 'Explosive Hip Extension Sprawl'],
    rangeOfMotion: 'Deep level change with lead knee touching mat, driving through followed by rapid hip-down sprawl.',
    startingPosition: 'Low wrestling staggered stance, elbows tucked inside, chest over knees, hands ready to pummel.',
    movementPattern: 'Change levels with knees (not bending at waist). Step deep between opponent imaginary feet with lead leg, trail knee drops lightly, head stays up against imaginary opponent ribs. Drive through at a 45-degree angle. Immediately transition to defensive sprawl by throwing both hips flat to the mat and circling out.',
    techniqueInstructions: [
      'Keep your head up and back straight during penetration; do not look at the mat.',
      'Drive off the rear toes and cut the angle as you come up.',
      'On the sprawl, drive your hips violently into the mat and snap your feet back.'
    ],
    commonMistakes: [
      'Bending at the waist to reach for legs rather than lowering levels with the hips and knees.',
      'Banging the lead knee hard into the mat with zero forward momentum.',
      'Looking down on the shot, allowing opponent an easy front headlock/guillotine.'
    ],
    safetyConsiderations: [
      'Practice on wrestling mats or padded surface to protect the patella.',
      'Wear knee sleeves if you have patellar sensitivity.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Quadriceps Femoris & Gluteus Maximus',
      stabilizers: 'Erector Spinae, Deep Hip External Rotators, Cervical Spine Extensors',
      movementPlane: 'Sagittal with multi-directional drive',
      forceVector: 'Forward-upward drive on shot; downward-backward hip impulse on sprawl'
    },
    combatApplication: 'Fundamental engine of MMA and wrestling takedowns and defense against being taken down.',
    equipmentRequired: ['bodyweight', 'combat_gym']
  },
  {
    id: 'bjj_hip_escapes_guard_retention',
    name: 'BJJ: Hip Escapes (Shrimping) & Guard Retention Drills',
    modeCategory: 'martial_arts',
    subCategory: 'Ground Mobility & Core Decoupling',
    martialCategory: 'Mobility',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '20 shrimps + 10 granby rolls / set',
    defaultRestSec: 60,
    primaryMuscles: ['obliques', 'rectus_abdominis', 'hip_flexors', 'gluteus_maximus'],
    secondaryMuscles: ['hamstrings', 'latissimus_dorsi', 'pectoralis_major'],
    jointMovements: ['Thoracic and Lumbar lateral flexion', 'Hip Flexion & Posterior Pelvic Tilt', 'Shoulder framing'],
    rangeOfMotion: 'Ground movement shifting hips away from an imaginary top opponent while maintaining structural frames.',
    startingPosition: 'Lie on your back on a mat, knees bent, feet flat on the floor, elbows tight creating frames.',
    movementPattern: 'Turn onto your side shoulder. Plant the ball of one foot and shrimp your hips backward toward your head, creating a gap between your elbows and knees. Re-insert your bottom knee to establish open guard. Reverse to the other side.',
    techniqueInstructions: [
      'Never stay flat on your back; always engage onto one shoulder blade.',
      'Keep your elbows glued to your ribs to protect your inside space.',
      'Use your planted foot to push your hips, not your shoulders.'
    ],
    commonMistakes: [
      'Trying to shrimp while completely flat on both shoulder blades.',
      'Reaching arms out away from body and getting arm-dragged or armbarred.',
      'Leaving hips lazy instead of shooting them far back.'
    ],
    safetyConsiderations: [
      'Perform on clean mats to prevent friction burns and back irritation.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Obliques, Rectus Abdominis, Iliopsoas',
      stabilizers: 'Gluteals, Latissimus Dorsi, Posterior Scapular group',
      movementPlane: 'Transverse & Frontal (Ground plane)',
      forceVector: 'Horizontal sliding vector on mat creating defensive frames'
    },
    combatApplication: 'The #1 foundational defensive movement in Brazilian Jiu-Jitsu to escape side control, mount, and retain guard against heavy pressure.',
    equipmentRequired: ['bodyweight', 'combat_gym']
  },
  {
    id: 'clinch_knees_and_pummeling',
    name: 'Muay Thai / MMA: Clinch Pummeling & Knee Strikes',
    modeCategory: 'martial_arts',
    subCategory: 'Close-Quarters Control & Core Power',
    martialCategory: 'Technique',
    difficulty: 'Intermediate',
    defaultSets: 3,
    defaultRepsOrTime: '3-minute rounds (or 30 knees / side)',
    defaultRestSec: 60,
    primaryMuscles: ['hip_flexors', 'rectus_abdominis', 'latissimus_dorsi', 'trapezius'],
    secondaryMuscles: ['gluteus_maximus', 'obliques', 'biceps_brachii', 'gastrocnemius_soleus'],
    jointMovements: ['Upper body over-under pummeling', 'High hip flexion and pelvic thrust knee drive'],
    rangeOfMotion: 'Upper body isometric clinch grip combined with explosive vertical/curving knee strike.',
    startingPosition: 'Square combat stance, hands holding the crown of the heavy bag (Thai plum) or in over-under grip with partner/bag.',
    movementPattern: 'Pull the bag down slightly using your lats and traps while rising onto the ball of the base foot. Drive the striking knee straight through the target or curve it into the ribs, pointing the toes down to tighten the knee joint. Alternate sides with continuous flow.',
    techniqueInstructions: [
      'Point your toes down on the striking leg to make the patellar bone sharp and stable.',
      'Thrust your hips forward at the moment of impact to maximize strike penetration.',
      'Use forearm frames on the neck/collarbone to control opponent posture.'
    ],
    commonMistakes: [
      'Lifting the knee with zero hip thrust, producing a weak tap instead of a devastating strike.',
      'Pulling opponent into yourself while staying flat-footed.',
      'Leaving your head unprotected while kneeing.'
    ],
    safetyConsiderations: [
      'Keep your base foot stable to avoid twisting the supporting knee.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Iliopsoas, Rectus Abdominis, Gluteus Maximus (supporting)',
      stabilizers: 'Latissimus Dorsi, Trapezius, Cervical stabilizers',
      movementPlane: 'Sagittal & Frontal',
      forceVector: 'Dual converging vector: downward collar pull + upward knee drive'
    },
    combatApplication: 'Devastating close-range weapon that breaks opponent posture, damages ribs, and terminates fights against the cage/ropes.',
    equipmentRequired: ['combat_gym', 'home_bag', 'bodyweight']
  },
  {
    id: 'combat_slip_pivot_footwork',
    name: 'Footwork: Slip & 90-Degree Pivot Drills',
    modeCategory: 'martial_arts',
    subCategory: 'Defensive Angles & Agility',
    martialCategory: 'Footwork',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '3-minute rounds',
    defaultRestSec: 60,
    primaryMuscles: ['gastrocnemius_soleus', 'gluteus_medius', 'obliques', 'tibialis_anterior'],
    secondaryMuscles: ['quadriceps', 'hamstrings', 'transverse_abdominis'],
    jointMovements: ['Ankle Plantarflexion/Dorsiflexion', 'Lead Leg 90-degree Pivot', 'Thoracic slipping'],
    rangeOfMotion: 'Light agile hops, lateral shifts, and rapid 90-degree angle rotations.',
    startingPosition: 'Athletic fighting stance behind a tape line or agility grid on the floor.',
    movementPattern: 'Slip left, step lead foot slightly outside, pivot rear foot 90 degrees around the lead foot like a compass, establishing a dominant flanking angle. Fire a counter 2-3 (Cross-Hook) and reset.',
    techniqueInstructions: [
      'Keep your center of gravity low between your feet.',
      'Do not cross your feet at any point during lateral movement.',
      'Stay light on the balls of your feet with heels slightly floating.'
    ],
    commonMistakes: [
      'Crossing feet, which leaves you completely vulnerable to sweeps and knockdowns.',
      'Pivoting too wide and drifting out of punching range.',
      'Standing tall and losing your athletic base.'
    ],
    safetyConsiderations: [
      'Wear appropriate boxing shoes or train barefoot on clean mats to prevent ankle sprains.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Calf complex (Triceps Surae) & Gluteus Medius',
      stabilizers: 'Peroneals, Tibialis Anterior, Core anti-lateral flexion',
      movementPlane: 'Transverse & Frontal',
      forceVector: 'Rapid multidirectional ground shear decoupling'
    },
    combatApplication: 'Allows fighters like Lomachenko or Canelo to disappear off the centerline and land devastating flank counters.',
    equipmentRequired: ['bodyweight', 'combat_gym']
  },
  {
    id: 'neck_and_trap_armor',
    name: 'Combat Armor: Isometric Neck & Scapular Bridge',
    modeCategory: 'martial_arts',
    subCategory: 'Cervical Spine Protection & Anti-Concussion',
    martialCategory: 'Conditioning',
    difficulty: 'Beginner',
    defaultSets: 3,
    defaultRepsOrTime: '30s hold / direction (4 directions)',
    defaultRestSec: 45,
    primaryMuscles: ['neck_extensors', 'trapezius'],
    secondaryMuscles: ['erector_spinae', 'rhomboids', 'posterior_deltoid'],
    jointMovements: ['Isometric Cervical Flexion, Extension, Lateral Flexion'],
    rangeOfMotion: 'Isometric static resistance in neutral spinal alignment.',
    startingPosition: 'Sit or stand tall. Place your palm or a resistance band against your forehead.',
    movementPattern: 'Press your hand/band into your forehead while your neck resists with equal force (isometric 10-15s). Repeat on the back of the head (extension), left temple, and right temple. Never move into pain; keep spine neutral.',
    techniqueInstructions: [
      'Apply steady, gradual resistance; do not jerk or slam into the hold.',
      'Breathe steadily throughout the isometric holds.',
      'Keep shoulders depressed away from the ears.'
    ],
    commonMistakes: [
      'Applying excessive force that forces the cervical spine into hyperextension.',
      'Holding breath and spiking blood pressure.'
    ],
    safetyConsiderations: [
      'Do NOT perform high-risk uncontrolled gymnast bridges if you have prior cervical issues.',
      'Always prioritize controlled isometric holds to safely build neck circumference.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Sternocleidomastoid, Splenius Capitis, Trapezius',
      stabilizers: 'Deep Cervical Flexors, Rhomboids',
      movementPlane: 'Isometric 3-dimensional stabilization',
      forceVector: 'Multi-angle rotational and linear impact deceleration'
    },
    combatApplication: 'Strengthens the neck to reduce rotational head acceleration from punches, decreasing concussion risk and resisting guillotine chokes.',
    equipmentRequired: ['bodyweight', 'combat_gym']
  },
  {
    id: 'dynamic_combat_hip_mobility',
    name: 'Dynamic Combat Mobility: 90/90 Hips & Thoracic Flow',
    modeCategory: 'mobility',
    subCategory: 'Joint Decompression & Active Recovery',
    martialCategory: 'Mobility',
    difficulty: 'Beginner',
    defaultSets: 2,
    defaultRepsOrTime: '8 - 10 transitions / side',
    defaultRestSec: 45,
    primaryMuscles: ['gluteus_medius', 'hip_flexors', 'hamstrings', 'latissimus_dorsi'],
    secondaryMuscles: ['erector_spinae', 'obliques'],
    jointMovements: ['Hip Internal & External Rotation', 'Thoracic Spine Rotation & Extension'],
    rangeOfMotion: 'Full active joint mobility through 90/90 hip transitions and thread-the-needle thoracic rotations.',
    startingPosition: 'Sit on the mat with lead leg bent at 90 degrees in front (external rotation) and trail leg bent at 90 degrees to the side (internal rotation).',
    movementPattern: 'Keep chest proud. Hinge slightly over the front shin to stretch the glute. Sit tall, lift knees and transition smoothly to the other side without using hands if possible. Follow with quadrupeds thoracic thread-the-needle rotations.',
    techniqueInstructions: [
      'Move slowly with deep diaphragmatic breaths.',
      'Keep your pelvis anchored to the floor during the stretch phase.',
      'Relax into tight zones without forcing range.'
    ],
    commonMistakes: [
      'Slouching through the thoracic spine instead of hinging from the hip.',
      'Rushing through the movement without breathing.'
    ],
    safetyConsiderations: [
      'If knee strain occurs, reduce the 90-degree angle slightly.'
    ],
    biomechanicsNotes: {
      primaryMover: 'Piriformis, Gluteus Medius, Obturator Internus, Iliopsoas',
      stabilizers: 'Core stabilizers',
      movementPlane: 'Transverse & Sagittal',
      forceVector: 'Active joint decompression and synovial fluid circulation'
    },
    combatApplication: 'Restores hip capsule mobility after heavy kicking or wrestling sessions, relieving lower back tension and preventing groin pulls.',
    equipmentRequired: ['bodyweight']
  }
];
