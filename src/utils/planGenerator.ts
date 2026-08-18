import {
  UserProfile,
  TrainingPlan,
  ScheduledSession,
  ScheduledExercise,
  TrainingMode,
  MartialArtDiscipline,
} from '../types';
import { EXERCISES_DATABASE } from '../data/exercises';

function getExercise(id: string) {
  return EXERCISES_DATABASE.find((e) => e.id === id) || EXERCISES_DATABASE[0];
}

function buildScheduledExercise(id: string, customSets?: number, customReps?: string, customRest?: number): ScheduledExercise {
  const def = getExercise(id);
  const sets = customSets || def.defaultSets;
  const reps = customReps || def.defaultRepsOrTime;
  const rest = customRest || def.defaultRestSec;

  const logs = Array.from({ length: sets }, (_, i) => ({
    setNumber: i + 1,
    targetReps: reps,
    weightLbs: 0,
    actualReps: parseInt(reps) || 10,
    isCompleted: false,
  }));

  return {
    exerciseId: def.id,
    name: def.name,
    sets,
    repsOrTime: reps,
    restPeriodSec: rest,
    primaryMuscles: def.primaryMuscles,
    secondaryMuscles: def.secondaryMuscles,
    techniqueNotes: def.techniqueInstructions[0] || 'Maintain strict form.',
    safetyNotes: def.safetyConsiderations[0] || 'Warm up adequately.',
    difficulty: def.difficulty,
    purpose: def.combatApplication || 'Strength and hypertrophy stimulus.',
    category: def.subCategory,
    logs,
  };
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function generateTrainingPlan(profile: UserProfile): TrainingPlan {
  const { trainingMode, experienceLevel, goal, daysPerWeek, sessionDuration, martialArt } = profile;

  const weeklySchedule: ScheduledSession[] = [];

  // Determine active days vs rest days based on daysPerWeek (2-6)
  // For 3 days: Mon (0), Wed (2), Fri (4)
  // For 4 days: Mon (0), Tue (1), Thu (3), Fri (4)
  // For 5 days: Mon (0), Tue (1), Wed (2), Fri (4), Sat (5)
  // For 6 days: Mon (0), Tue (1), Wed (2), Thu (3), Fri (4), Sat (5)
  // For 2 days: Tue (1), Thu (3)
  const activeDayIndices: number[] = [];
  if (daysPerWeek === 2) activeDayIndices.push(1, 4);
  else if (daysPerWeek === 3) activeDayIndices.push(0, 2, 4);
  else if (daysPerWeek === 4) activeDayIndices.push(0, 1, 3, 4);
  else if (daysPerWeek === 5) activeDayIndices.push(0, 1, 2, 4, 5);
  else if (daysPerWeek >= 6) activeDayIndices.push(0, 1, 2, 3, 4, 5);
  else activeDayIndices.push(0, 2, 4);

  // Generate 7 days
  for (let day = 0; day < 7; day++) {
    const dayName = DAY_NAMES[day];
    const isActive = activeDayIndices.includes(day);

    if (!isActive) {
      // Rest Day
      weeklySchedule.push({
        id: `day-${day}-${Date.now()}`,
        dayIndex: day,
        dayName,
        sessionTitle: 'Active Recovery & Mobility Flow',
        mode: 'hybrid',
        category: 'Rest & Recovery',
        durationMin: 20,
        isRestDay: true,
        difficulty: 'Beginner',
        mainMuscles: ['gluteus_medius', 'hip_flexors', 'latissimus_dorsi'],
        trainingPurpose: 'Promote active blood flow, reduce muscle soreness, and restore joint ranges of motion.',
        techniqueNotes: 'Hydrate well, perform light walking, and complete gentle hip and spinal decompression.',
        safetyNotes: 'Never force painful joint angles during recovery. Rest completely if feeling run down.',
        exercises: [
          buildScheduledExercise('dynamic_combat_hip_mobility', 2, '10 transitions / side', 30),
          buildScheduledExercise('face_pulls', 2, '15 reps (light band)', 45),
        ],
      });
      continue;
    }

    // Active session logic
    const sessionNum = activeDayIndices.indexOf(day);

    if (trainingMode === 'weight_training') {
      if (daysPerWeek <= 3) {
        // Full Body Rotations
        if (sessionNum === 0) {
          weeklySchedule.push({
            id: `day-${day}-${Date.now()}`,
            dayIndex: day,
            dayName,
            sessionTitle: 'Full Body A: Heavy Compound Foundation',
            mode: 'weight_training',
            category: 'Strength',
            durationMin: sessionDuration,
            isRestDay: false,
            difficulty: experienceLevel === 'advanced' ? 'Advanced' : 'Intermediate',
            mainMuscles: ['pectoralis_major', 'quadriceps', 'latissimus_dorsi', 'triceps_brachii'],
            trainingPurpose: 'Develop maximal strength and bone density with primary barbell compound movements.',
            techniqueNotes: 'Maintain intra-abdominal brace and complete full range of motion on each rep.',
            safetyNotes: 'Warm up thoroughly with lighter ramp-up sets before your working weight.',
            exercises: [
              buildScheduledExercise('barbell_back_squat', 4, '6 reps', 150),
              buildScheduledExercise('barbell_bench_press', 4, '6 reps', 120),
              buildScheduledExercise('barbell_bent_over_row', 3, '8 reps', 90),
              buildScheduledExercise('face_pulls', 3, '15 reps', 60),
              buildScheduledExercise('pallof_press', 3, '10 reps / side', 60),
            ],
          });
        } else if (sessionNum === 1) {
          weeklySchedule.push({
            id: `day-${day}-${Date.now()}`,
            dayIndex: day,
            dayName,
            sessionTitle: 'Full Body B: Posterior Chain & Overhead Power',
            mode: 'weight_training',
            category: 'Hypertrophy',
            durationMin: sessionDuration,
            isRestDay: false,
            difficulty: 'Intermediate',
            mainMuscles: ['hamstrings', 'gluteus_maximus', 'anterior_deltoid', 'biceps_brachii'],
            trainingPurpose: 'Build posterior chain power, hamstring durability, and overhead pushing strength.',
            techniqueNotes: 'Hinge deeply at hips on RDL without rounding lower back.',
            safetyNotes: 'Control the lowering eccentric phase to safeguard the hamstrings and lower back.',
            exercises: [
              buildScheduledExercise('romanian_deadlift', 3, '8 reps', 120),
              buildScheduledExercise('overhead_barbell_press', 3, '8 reps', 120),
              buildScheduledExercise('pull_ups', 4, '8 reps', 90),
              buildScheduledExercise('bulgarian_split_squat', 3, '8 reps / leg', 90),
              buildScheduledExercise('farmer_carries', 3, '40 meters', 90),
            ],
          });
        } else {
          weeklySchedule.push({
            id: `day-${day}-${Date.now()}`,
            dayIndex: day,
            dayName,
            sessionTitle: 'Full Body C: Unilateral & Work Capacity',
            mode: 'weight_training',
            category: 'Strength',
            durationMin: sessionDuration,
            isRestDay: false,
            difficulty: 'Intermediate',
            mainMuscles: ['quadriceps', 'pectoralis_major', 'rhomboids', 'obliques'],
            trainingPurpose: 'Address muscular imbalances with unilateral loading and core stability.',
            techniqueNotes: 'Control the eccentric phase and emphasize mind-muscle connection.',
            safetyNotes: 'Adjust dumbbell weights if balance becomes compromised.',
            exercises: [
              buildScheduledExercise('barbell_back_squat', 3, '8 reps', 120),
              buildScheduledExercise('barbell_bench_press', 3, '8 reps', 120),
              buildScheduledExercise('pull_ups', 3, '8 reps', 90),
              buildScheduledExercise('face_pulls', 3, '15 reps', 60),
              buildScheduledExercise('pallof_press', 3, '12 reps / side', 60),
            ],
          });
        }
      } else {
        // Upper / Lower Split for 4+ days
        const isUpper = sessionNum % 2 === 0;
        if (isUpper) {
          weeklySchedule.push({
            id: `day-${day}-${Date.now()}`,
            dayIndex: day,
            dayName,
            sessionTitle: `Upper Body ${sessionNum === 0 ? 'Strength' : 'Hypertrophy'}`,
            mode: 'weight_training',
            category: sessionNum === 0 ? 'Strength' : 'Hypertrophy',
            durationMin: sessionDuration,
            isRestDay: false,
            difficulty: 'Intermediate',
            mainMuscles: ['pectoralis_major', 'latissimus_dorsi', 'anterior_deltoid', 'triceps_brachii'],
            trainingPurpose: 'Maximize upper torso pushing and pulling power, shoulder stability, and muscular hypertrophy.',
            techniqueNotes: 'Maintain retracted scapula on all pressing movements.',
            safetyNotes: 'Keep wrist joints straight and thumbs wrapped securely around bars.',
            exercises: [
              buildScheduledExercise('barbell_bench_press', 4, '6-8 reps', 120),
              buildScheduledExercise('pull_ups', 4, '8 reps', 90),
              buildScheduledExercise('overhead_barbell_press', 3, '8 reps', 90),
              buildScheduledExercise('barbell_bent_over_row', 3, '10 reps', 90),
              buildScheduledExercise('face_pulls', 3, '15 reps', 60),
            ],
          });
        } else {
          weeklySchedule.push({
            id: `day-${day}-${Date.now()}`,
            dayIndex: day,
            dayName,
            sessionTitle: `Lower Body & Core ${sessionNum === 1 ? 'Power' : 'Durability'}`,
            mode: 'weight_training',
            category: 'Strength',
            durationMin: sessionDuration,
            isRestDay: false,
            difficulty: 'Intermediate',
            mainMuscles: ['quadriceps', 'hamstrings', 'gluteus_maximus', 'obliques'],
            trainingPurpose: 'Build powerful legs, bulletproof hamstrings, and iron anti-rotational core.',
            techniqueNotes: 'Drive through midfoot and keep core braced.',
            safetyNotes: 'Use safety squat pins at parallel depth.',
            exercises: [
              buildScheduledExercise('barbell_back_squat', 4, '6 reps', 150),
              buildScheduledExercise('romanian_deadlift', 3, '8 reps', 120),
              buildScheduledExercise('bulgarian_split_squat', 3, '8 reps / leg', 90),
              buildScheduledExercise('farmer_carries', 3, '50 meters', 90),
              buildScheduledExercise('pallof_press', 3, '10 reps / side', 60),
            ],
          });
        }
      }
    } else if (trainingMode === 'martial_arts') {
      const artName = martialArt ? martialArt.replace('_', ' ').toUpperCase() : 'COMBAT ARTS';
      const disciplines: { title: string; cat: any; mainMuscles: any[]; exercises: string[] }[] = [
        {
          title: `${artName}: Technical Combinations & Angle Mastery`,
          cat: 'Technique',
          mainMuscles: ['anterior_deltoid', 'obliques', 'gastrocnemius_soleus'],
          exercises: ['shadowboxing_combinations', 'combat_slip_pivot_footwork', 'dynamic_combat_hip_mobility'],
        },
        {
          title: `${artName}: Heavy Bag Power & Explosive Output`,
          cat: 'Power',
          mainMuscles: ['pectoralis_major', 'gluteus_maximus', 'obliques', 'triceps_brachii'],
          exercises: ['heavy_bag_power_intervals', 'muay_thai_teep_roundhouse', 'neck_and_trap_armor'],
        },
        {
          title: `${artName}: Combat Speed & Footwork Agility`,
          cat: 'Speed',
          mainMuscles: ['gastrocnemius_soleus', 'tibialis_anterior', 'gluteus_medius'],
          exercises: ['combat_slip_pivot_footwork', 'shadowboxing_combinations', 'face_pulls'],
        },
        {
          title: `${artName}: Grappling, Clinch & Takedown Conditioning`,
          cat: 'Conditioning',
          mainMuscles: ['quadriceps', 'latissimus_dorsi', 'hip_flexors', 'rectus_abdominis'],
          exercises: ['takedown_penetration_steps', 'clinch_knees_and_pummeling', 'bjj_hip_escapes_guard_retention'],
        },
      ];

      const pattern = disciplines[sessionNum % disciplines.length];
      weeklySchedule.push({
        id: `day-${day}-${Date.now()}`,
        dayIndex: day,
        dayName,
        sessionTitle: pattern.title,
        mode: 'martial_arts',
        category: pattern.cat,
        durationMin: sessionDuration,
        isRestDay: false,
        difficulty: 'Intermediate',
        mainMuscles: pattern.mainMuscles,
        trainingPurpose: `Develop combat-ready ${pattern.cat.toLowerCase()} specific to ${artName}.`,
        techniqueNotes: 'Focus on precision, breathing on impact, and defensive hand placement.',
        safetyNotes: 'Always wrap hands securely and wear protective gear during high-impact bag drills.',
        exercises: pattern.exercises.map((exId) => buildScheduledExercise(exId)),
      });
    } else {
      // HYBRID MODE: The flagship balanced protocol
      // Smart Rule: Alternate Weight Training & Martial Arts sessions to prevent fatigue accumulation
      // Day 0: Heavy Upper Push/Pull (Weight)
      // Day 1: Martial Arts Striking & Agility (Martial Arts)
      // Day 2: Lower Body & Core Strength (Weight)
      // Day 3: Martial Arts Clinch, Bag Power & Grappling (Martial Arts)
      // Day 4: Hybrid Conditioning & Combat Armor (Hybrid)
      // Day 5: Dynamic Movement & Technical Flow (Martial Arts)
      const hybridRoutines = [
        {
          title: 'Hybrid Day 1: Upper Torso Strength & Punching Pulls',
          category: 'Strength' as const,
          mode: 'weight_training' as TrainingMode,
          mainMuscles: ['pectoralis_major', 'latissimus_dorsi', 'anterior_deltoid', 'posterior_deltoid'],
          purpose: 'Build upper body punching and wrestling frame power without overloading leg fatigue before combat drills.',
          techNotes: 'Keep pulling-to-pushing balance 1:1 to safeguard the shoulders from martial arts forward posture.',
          safetyNotes: 'Keep elbows tucked at 45 degrees on presses.',
          exercises: ['barbell_bench_press', 'pull_ups', 'face_pulls', 'overhead_barbell_press'],
        },
        {
          title: 'Hybrid Day 2: Striking Fluidity, Footwork & Speed',
          category: 'Speed' as const,
          mode: 'martial_arts' as TrainingMode,
          mainMuscles: ['gastrocnemius_soleus', 'obliques', 'anterior_deltoid'],
          purpose: 'Sharpen footwork agility, punch combinations, and defensive slipping angles while legs are fresh.',
          techNotes: 'Stay light on the balls of your feet; snap strikes out and recover the high guard instantly.',
          safetyNotes: 'Do not hyperextend elbows on shadow strikes.',
          exercises: ['shadowboxing_combinations', 'combat_slip_pivot_footwork', 'dynamic_combat_hip_mobility'],
        },
        {
          title: 'Hybrid Day 3: Lower Body Power & Iron Core (Separated from Sparring)',
          category: 'Power' as const,
          mode: 'weight_training' as TrainingMode,
          mainMuscles: ['quadriceps', 'gluteus_maximus', 'hamstrings', 'obliques'],
          purpose: 'Develop explosive hip drive and sprawl power with strategic buffer before intense combat rounds.',
          techNotes: 'Drive through the midfoot on squats and hinge smoothly on Romanian Deadlifts.',
          safetyNotes: 'Stop if lower back rounding occurs; maintain strict neutral spine.',
          exercises: ['barbell_back_squat', 'romanian_deadlift', 'bulgarian_split_squat', 'pallof_press'],
        },
        {
          title: 'Hybrid Day 4: Heavy Bag Output, Teeps & Clinch Power',
          category: 'Conditioning' as const,
          mode: 'martial_arts' as TrainingMode,
          mainMuscles: ['hip_flexors', 'obliques', 'pectoralis_major', 'gluteus_maximus'],
          purpose: 'Translate gym power into rotational strike impact, knee penetration, and high anaerobic endurance.',
          techNotes: 'Align knuckles properly on heavy bag impact; thrust hips forward into clinch knees.',
          safetyNotes: 'Wear 14-16 oz gloves with 180" wraps.',
          exercises: ['heavy_bag_power_intervals', 'muay_thai_teep_roundhouse', 'clinch_knees_and_pummeling', 'neck_and_trap_armor'],
        },
        {
          title: 'Hybrid Day 5: Combat Armor, Takedowns & Grappling Durability',
          category: 'Hybrid Conditioning' as const,
          mode: 'hybrid' as TrainingMode,
          mainMuscles: ['forearms', 'neck_extensors', 'latissimus_dorsi', 'quadriceps'],
          purpose: 'Reinforce grip endurance, neck stability against concussions, and level change athleticism.',
          techNotes: 'Keep head up on penetration steps and maintain crushed grip on carries.',
          safetyNotes: 'Perform neck isometrics with steady pressure, never jerking.',
          exercises: ['takedown_penetration_steps', 'farmer_carries', 'bjj_hip_escapes_guard_retention', 'neck_and_trap_armor'],
        },
      ];

      const chosen = hybridRoutines[sessionNum % hybridRoutines.length];
      weeklySchedule.push({
        id: `day-${day}-${Date.now()}`,
        dayIndex: day,
        dayName,
        sessionTitle: chosen.title,
        mode: chosen.mode,
        category: chosen.category,
        durationMin: sessionDuration,
        isRestDay: false,
        difficulty: 'Intermediate',
        mainMuscles: chosen.mainMuscles as any,
        trainingPurpose: chosen.purpose,
        techniqueNotes: chosen.techNotes,
        safetyNotes: chosen.safetyNotes,
        exercises: chosen.exercises.map((id) => buildScheduledExercise(id)),
      });
    }
  }

  return {
    id: `plan-${Date.now()}`,
    userId: profile.id,
    title: `${profile.trainingMode === 'hybrid' ? 'Hybrid Combat & Strength' : profile.trainingMode === 'weight_training' ? 'Apex Weight Training' : 'Combat Martial Arts'} Routine`,
    mode: profile.trainingMode,
    weeklySchedule,
    aiInsights: {
      coachingSummary: `Personalized ${profile.trainingMode.toUpperCase()} routine calibrated for ${profile.goal.replace('_', ' ')} with smart fatigue management.`,
      hybridAdvice: 'Lower body resistance is scheduled with adequate buffer prior to high-impact martial arts kicking and wrestling drills to prevent joint overload.',
      warmupProtocol: ['5 min dynamic joint circles & hip openers', '3 min progressive shadow movements or light bar ramping', '2 sets of core activation (Pallof press or deadbugs)'],
      recoveryTip: 'Aim for 7.5 - 9 hours of quality sleep and ensure adequate water and electrolyte intake before every session.',
    },
    createdAt: new Date().toISOString(),
  };
}
