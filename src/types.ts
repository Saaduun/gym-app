export type TrainingMode = 'weight_training' | 'martial_arts' | 'hybrid';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal =
  | 'strength'
  | 'muscle'
  | 'power'
  | 'conditioning'
  | 'martial_arts_performance'
  | 'general_fitness';

export type MartialArtDiscipline =
  | 'boxing'
  | 'kickboxing'
  | 'muay_thai'
  | 'mma'
  | 'wrestling'
  | 'bjj_grappling'
  | 'other_combat';

export type EquipmentOption =
  | 'full_gym'
  | 'barbell_dumbbells'
  | 'dumbbells_only'
  | 'bodyweight'
  | 'combat_gym'
  | 'home_bag';

export type SessionDurationMinutes = 30 | 45 | 60 | 90;

export type MartialArtCategory =
  | 'Technique'
  | 'Footwork'
  | 'Conditioning'
  | 'Speed'
  | 'Power'
  | 'Mobility'
  | 'Recovery';

export interface UserProfile {
  id: string;
  name: string;
  trainingMode: TrainingMode;
  experienceLevel: ExperienceLevel;
  goal: FitnessGoal;
  daysPerWeek: number; // 2 - 6
  sessionDuration: SessionDurationMinutes;
  equipment: EquipmentOption[];
  martialArt?: MartialArtDiscipline;
  secondaryMartialArt?: MartialArtDiscipline;
  hasCompletedOnboarding: boolean;
  recoveryReadinessScore?: number; // 1-100
  createdAt: string;
}

export type MuscleId =
  | 'pectoralis_major'
  | 'pectoralis_minor'
  | 'anterior_deltoid'
  | 'lateral_deltoid'
  | 'posterior_deltoid'
  | 'rotator_cuff'
  | 'latissimus_dorsi'
  | 'trapezius'
  | 'rhomboids'
  | 'erector_spinae'
  | 'biceps_brachii'
  | 'triceps_brachii'
  | 'forearms'
  | 'rectus_abdominis'
  | 'obliques'
  | 'transverse_abdominis'
  | 'gluteus_maximus'
  | 'gluteus_medius'
  | 'quadriceps'
  | 'hamstrings'
  | 'gastrocnemius_soleus'
  | 'hip_flexors'
  | 'tibialis_anterior'
  | 'neck_extensors';

export interface ExerciseDefinition {
  id: string;
  name: string;
  modeCategory: 'weight_training' | 'martial_arts' | 'hybrid' | 'mobility';
  subCategory: string; // e.g. "Compound Push", "Footwork Drill", "Rotational Core"
  martialCategory?: MartialArtCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  defaultSets: number;
  defaultRepsOrTime: string;
  defaultRestSec: number;
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
  jointMovements: string[];
  rangeOfMotion: string;
  startingPosition: string;
  movementPattern: string;
  techniqueInstructions: string[];
  commonMistakes: string[];
  safetyConsiderations: string[];
  biomechanicsNotes: {
    primaryMover: string;
    stabilizers: string;
    movementPlane: string;
    forceVector: string;
  };
  combatApplication?: string;
  equipmentRequired: EquipmentOption[];
}

export interface SetLog {
  setNumber: number;
  targetReps: string;
  weightLbs: number;
  actualReps: number;
  isCompleted: boolean;
}

export interface ScheduledExercise {
  exerciseId: string;
  name: string;
  sets: number;
  repsOrTime: string;
  restPeriodSec: number;
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
  techniqueNotes: string;
  safetyNotes: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  purpose: string;
  category?: string;
  logs: SetLog[];
}

export interface ScheduledSession {
  id: string;
  dayIndex: number; // 0 = Monday, 6 = Sunday
  dayName: string;
  sessionTitle: string;
  mode: TrainingMode;
  category: MartialArtCategory | 'Strength' | 'Hypertrophy' | 'Power' | 'Hybrid Conditioning' | 'Rest & Recovery';
  durationMin: number;
  isRestDay: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  mainMuscles: MuscleId[];
  trainingPurpose: string;
  techniqueNotes: string;
  safetyNotes: string;
  exercises: ScheduledExercise[];
  isCompleted?: boolean;
}

export interface TrainingPlan {
  id: string;
  userId: string;
  title: string;
  mode: TrainingMode;
  weeklySchedule: ScheduledSession[];
  aiInsights?: {
    coachingSummary: string;
    hybridAdvice: string;
    warmupProtocol: string[];
    recoveryTip: string;
  };
  createdAt: string;
}

export interface WorkoutLogEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  date: string;
  mode: TrainingMode;
  durationMinutes: number;
  completedExercisesCount: number;
  totalExercisesCount: number;
  rpeRating: number; // 1-10
  notes: string;
}

export interface AnatomyMuscleDetail {
  id: MuscleId;
  name: string;
  latinName: string;
  layer: 'superficial' | 'deep';
  system: 'muscular' | 'skeletal';
  region: 'chest' | 'shoulders' | 'arms' | 'back' | 'core' | 'legs';
  primaryFunction: string;
  mainMovements: string[];
  exercises: string[];
  martialArtsImpact: string;
  activationEstPercentage?: number; // 0 - 100
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
