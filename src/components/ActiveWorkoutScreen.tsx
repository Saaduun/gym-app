import React, { useState, useEffect } from 'react';
import { ScheduledSession, ScheduledExercise, WorkoutLogEntry } from '../types';
import { EXERCISES_DATABASE } from '../data/exercises';
import { Anatomy3DViewer } from './Anatomy3DViewer';
import { ExerciseAnatomySimulator } from './ExerciseAnatomySimulator';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  ShieldAlert,
  Flame,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Trophy,
  Activity,
  Maximize2,
  X,
} from 'lucide-react';

interface ActiveWorkoutScreenProps {
  session: ScheduledSession;
  onFinishWorkout: (log: WorkoutLogEntry) => void;
  onCancel: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  session,
  onFinishWorkout,
  onCancel,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [exercisesState, setExercisesState] = useState<ScheduledExercise[]>(session.exercises);
  const [activeTab, setActiveTab] = useState<'technique' | 'biomechanics' | 'safety'>('technique');
  const [anatomyViewMode, setAnatomyViewMode] = useState<'simulation' | 'atlas'>('simulation');
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState<boolean>(false);

  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState<boolean>(false);
  const [timerTotalDuration, setTimerTotalDuration] = useState<number>(90);

  // Overall workout timer
  const [workoutElapsedSec, setWorkoutElapsedSec] = useState<number>(0);
  const [rpeRating, setRpeRating] = useState<number>(7);
  const [workoutFinished, setWorkoutFinished] = useState<boolean>(false);

  const currentScheduled = exercisesState[currentExerciseIndex] || exercisesState[0];
  const currentDef =
    EXERCISES_DATABASE.find((e) => e.id === currentScheduled.exerciseId) ||
    EXERCISES_DATABASE[0];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!workoutFinished) {
        setWorkoutElapsedSec((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [workoutFinished]);

  useEffect(() => {
    let timer: any = null;
    if (isRestTimerRunning && restTimerSeconds > 0) {
      timer = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRestTimerRunning(false);
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime);
              osc.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.35);
            } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRestTimerRunning, restTimerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerTotalDuration(seconds);
    setRestTimerSeconds(seconds);
    setIsRestTimerRunning(true);
  };

  const handleSetToggle = (setIndex: number) => {
    const updatedExercises = [...exercisesState];
    const currentEx = { ...updatedExercises[currentExerciseIndex] };
    const currentLogs = [...currentEx.logs];

    const currentCompleted = currentLogs[setIndex].isCompleted;
    currentLogs[setIndex].isCompleted = !currentCompleted;

    currentEx.logs = currentLogs;
    updatedExercises[currentExerciseIndex] = currentEx;
    setExercisesState(updatedExercises);

    if (!currentCompleted) {
      startRestTimer(currentScheduled.restPeriodSec || 90);
    }
  };

  const handleWeightChange = (setIndex: number, weight: number) => {
    const updatedExercises = [...exercisesState];
    const currentEx = { ...updatedExercises[currentExerciseIndex] };
    const currentLogs = [...currentEx.logs];
    currentLogs[setIndex].weightLbs = Math.max(0, weight);
    currentEx.logs = currentLogs;
    updatedExercises[currentExerciseIndex] = currentEx;
    setExercisesState(updatedExercises);
  };

  const handleRepsChange = (setIndex: number, reps: number) => {
    const updatedExercises = [...exercisesState];
    const currentEx = { ...updatedExercises[currentExerciseIndex] };
    const currentLogs = [...currentEx.logs];
    currentLogs[setIndex].actualReps = Math.max(0, reps);
    currentEx.logs = currentLogs;
    updatedExercises[currentExerciseIndex] = currentEx;
    setExercisesState(updatedExercises);
  };

  const completedExercisesCount = exercisesState.filter((ex) =>
    ex.logs.every((l) => l.isCompleted)
  ).length;

  const handleCompleteWorkout = () => {
    setWorkoutFinished(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const durationMin = Math.max(1, Math.round(workoutElapsedSec / 60));
    const log: WorkoutLogEntry = {
      id: `log-${Date.now()}`,
      sessionId: session.id,
      sessionTitle: session.sessionTitle,
      date: new Date().toISOString(),
      mode: session.mode,
      durationMinutes: durationMin,
      completedExercisesCount,
      totalExercisesCount: exercisesState.length,
      rpeRating,
      notes: `Completed ${session.sessionTitle} in ${durationMin} min.`,
    };

    onFinishWorkout(log);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div id="active-workout-screen" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Session Progress Bar */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#D4FF00] text-black font-mono font-black text-base flex items-center justify-center shadow-lg shadow-[#D4FF00]/10">
            0{currentExerciseIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-[#D4FF00]">
                {session.category}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-zinc-400" />
                {formatTimer(workoutElapsedSec)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{session.sessionTitle}</h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-cancel-workout"
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 transition"
          >
            EXIT
          </button>
          <button
            id="btn-finish-workout"
            type="button"
            onClick={handleCompleteWorkout}
            className="px-6 py-2.5 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-black text-xs font-black tracking-tight flex items-center gap-2 transition shadow-lg shadow-[#D4FF00]/10"
          >
            <Trophy className="w-4 h-4" /> FINISH WORKOUT
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Anatomical Simulation & Activation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              {/* Mode Toggle: Simulation vs Static 3D Map */}
              <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setAnatomyViewMode('simulation')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
                    anatomyViewMode === 'simulation'
                      ? 'bg-[#D4FF00] text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Kinetic Sim</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnatomyViewMode('atlas')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
                    anatomyViewMode === 'atlas'
                      ? 'bg-[#D4FF00] text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Map</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsSimulatorModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] uppercase font-mono text-zinc-300 flex items-center gap-1.5 transition"
                title="Expand Full Screen Biomechanical Simulator"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#D4FF00]" />
                <span>Full Sim</span>
              </button>
            </div>

            {anatomyViewMode === 'simulation' ? (
              <ExerciseAnatomySimulator
                exercise={currentDef}
                height="380px"
              />
            ) : (
              <>
                <Anatomy3DViewer
                  highlightedMuscles={[...currentScheduled.primaryMuscles, ...currentScheduled.secondaryMuscles]}
                  height="360px"
                  showControls={true}
                />

                {/* Target Muscle Pills */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                    Activated Groups
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentScheduled.primaryMuscles.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-lg bg-[#D4FF00]/15 border border-[#D4FF00]/30 text-[#D4FF00] text-xs font-bold capitalize flex items-center gap-1"
                      >
                        <Flame className="w-3 h-3 text-[#D4FF00]" />
                        {m.replace('_', ' ')} (Primary)
                      </span>
                    ))}
                    {currentScheduled.secondaryMuscles.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium capitalize"
                      >
                        {m.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Active Exercise Logger, Rest Timer & Technique Hub */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Exercise Card Header */}
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#D4FF00] uppercase tracking-wider mb-1">
                  <span>Exercise 0{currentExerciseIndex + 1} / 0{exercisesState.length}</span>
                  <span className="text-zinc-600">•</span>
                  <span>{currentDef.subCategory}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {currentDef.name}
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  TARGET: {currentScheduled.sets} SETS × {currentScheduled.repsOrTime}
                </p>
              </div>

              {/* Prev / Next Exercise quick navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-prev-exercise"
                  type="button"
                  disabled={currentExerciseIndex === 0}
                  onClick={() => setCurrentExerciseIndex((i) => Math.max(0, i - 1))}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-20 text-zinc-300 transition"
                  title="Previous exercise"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  id="btn-next-exercise"
                  type="button"
                  disabled={currentExerciseIndex === exercisesState.length - 1}
                  onClick={() =>
                    setCurrentExerciseIndex((i) => Math.min(exercisesState.length - 1, i + 1))
                  }
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-20 text-zinc-300 transition"
                  title="Next exercise"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* REST TIMER COMPONENT */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono font-black text-xl transition ${
                    isRestTimerRunning
                      ? 'bg-[#D4FF00] text-black animate-pulse'
                      : 'bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {formatTimer(restTimerSeconds)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    {isRestTimerRunning ? 'Rest Interval Active' : 'Rest Interval'}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    Target rest: {currentScheduled.restPeriodSec}s between working sets
                  </div>
                </div>
              </div>

              {/* Timer Control Buttons */}
              <div className="flex items-center gap-1.5">
                {isRestTimerRunning ? (
                  <button
                    id="btn-pause-rest"
                    type="button"
                    onClick={() => setIsRestTimerRunning(false)}
                    className="px-3 py-2 rounded-xl bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 hover:bg-[#D4FF00]/25 transition text-xs font-bold flex items-center gap-1.5"
                  >
                    <Pause className="w-4 h-4" /> PAUSE
                  </button>
                ) : (
                  <button
                    id="btn-start-rest"
                    type="button"
                    onClick={() => startRestTimer(restTimerSeconds || currentScheduled.restPeriodSec || 90)}
                    className="px-4 py-2 rounded-xl bg-[#D4FF00] text-black hover:bg-[#bce300] transition text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-4 h-4 fill-current" /> START
                  </button>
                )}
                <button
                  id="btn-add-30s"
                  type="button"
                  onClick={() => setRestTimerSeconds((s) => s + 30)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 text-xs font-mono font-bold"
                >
                  +30S
                </button>
                <button
                  id="btn-reset-rest"
                  type="button"
                  onClick={() => {
                    setIsRestTimerRunning(false);
                    setRestTimerSeconds(currentScheduled.restPeriodSec || 90);
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                  title="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SETS LOGGING TABLE */}
            <div className="space-y-2.5">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                <span>Working Sets</span>
                <span>Tap Checkmark When Completed</span>
              </div>

              <div className="space-y-2">
                {currentScheduled.logs.map((setLog, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${
                      setLog.isCompleted
                        ? 'bg-[#D4FF00]/10 border-[#D4FF00]/40 text-white'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-zinc-800 text-zinc-300 font-mono font-bold text-xs flex items-center justify-center">
                        0{setLog.setNumber}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        Target: {setLog.targetReps}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {currentDef.modeCategory === 'weight_training' && (
                        <div className="flex items-center gap-1 text-xs">
                          <input
                            id={`input-weight-${idx}`}
                            type="number"
                            value={setLog.weightLbs || ''}
                            onChange={(e) => handleWeightChange(idx, parseFloat(e.target.value) || 0)}
                            placeholder="kg/lbs"
                            className="w-16 px-2 py-1 rounded-lg bg-[#141414] border border-white/10 text-center text-xs font-bold font-mono text-white focus:border-[#D4FF00] outline-none"
                          />
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">lbs</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs">
                        <input
                          id={`input-reps-${idx}`}
                          type="number"
                          value={setLog.actualReps || ''}
                          onChange={(e) => handleRepsChange(idx, parseInt(e.target.value) || 0)}
                          placeholder="reps"
                          className="w-14 px-2 py-1 rounded-lg bg-[#141414] border border-white/10 text-center text-xs font-bold font-mono text-white focus:border-[#D4FF00] outline-none"
                        />
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">reps</span>
                      </div>

                      <button
                        id={`btn-complete-set-${idx}`}
                        type="button"
                        onClick={() => handleSetToggle(idx)}
                        className={`p-2 rounded-xl transition ${
                          setLog.isCompleted
                            ? 'bg-[#D4FF00] text-black shadow-md shadow-[#D4FF00]/20'
                            : 'bg-white/5 border border-white/10 text-zinc-500 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabbed Guidance */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <button
                  id="tab-technique"
                  onClick={() => setActiveTab('technique')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition ${
                    activeTab === 'technique'
                      ? 'bg-[#D4FF00] text-black font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Technique
                </button>
                <button
                  id="tab-biomechanics"
                  onClick={() => setActiveTab('biomechanics')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition ${
                    activeTab === 'biomechanics'
                      ? 'bg-[#D4FF00] text-black font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Biomechanics
                </button>
                <button
                  id="tab-safety"
                  onClick={() => setActiveTab('safety')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition ${
                    activeTab === 'safety'
                      ? 'bg-[#D4FF00] text-black font-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Safety
                </button>
              </div>

              {activeTab === 'technique' && (
                <div className="space-y-3 text-xs text-zinc-300 animate-fade-in">
                  <div>
                    <strong className="text-white">Starting Position:</strong> {currentDef.startingPosition}
                  </div>
                  <div>
                    <strong className="text-white">Movement Pattern:</strong> {currentDef.movementPattern}
                  </div>
                  <div className="space-y-1 mt-2">
                    <strong className="text-white">Execution Cues:</strong>
                    <ul className="list-disc list-inside space-y-1 text-zinc-300">
                      {currentDef.techniqueInstructions.map((cue, i) => (
                        <li key={i}>{cue}</li>
                      ))}
                    </ul>
                  </div>
                  {currentDef.combatApplication && (
                    <div className="p-3.5 rounded-2xl bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-[#D4FF00] text-xs mt-2">
                      <strong>Combat Application:</strong> {currentDef.combatApplication}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'biomechanics' && (
                <div className="space-y-3 text-xs animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-white/5">
                      <div className="text-zinc-500 font-mono text-[10px] uppercase">Primary Agonist Mover</div>
                      <div className="text-white font-bold mt-0.5">{currentDef.biomechanicsNotes.primaryMover}</div>
                    </div>
                    <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-white/5">
                      <div className="text-zinc-500 font-mono text-[10px] uppercase">Joint Stabilizers</div>
                      <div className="text-white font-bold mt-0.5">{currentDef.biomechanicsNotes.stabilizers}</div>
                    </div>
                    <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-white/5">
                      <div className="text-zinc-500 font-mono text-[10px] uppercase">Plane of Motion</div>
                      <div className="text-[#D4FF00] font-bold mt-0.5">{currentDef.biomechanicsNotes.movementPlane}</div>
                    </div>
                    <div className="bg-[#0A0A0A] p-3.5 rounded-2xl border border-white/5">
                      <div className="text-zinc-500 font-mono text-[10px] uppercase">Force Vector</div>
                      <div className="text-zinc-200 font-bold mt-0.5">{currentDef.biomechanicsNotes.forceVector}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'safety' && (
                <div className="space-y-3 text-xs animate-fade-in">
                  <div className="space-y-1.5">
                    <strong className="text-rose-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> Common Mistakes:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-zinc-300">
                      {currentDef.commonMistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    <strong className="text-[#D4FF00] flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" /> Safety Directives:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-zinc-300">
                      {currentDef.safetyConsiderations.map((safety, i) => (
                        <li key={i}>{safety}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Exercise Anatomy Simulator Modal */}
      {isSimulatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 sm:p-6 flex items-center justify-center animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Full Biomechanical Motion Lab • {currentDef.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulatorModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ExerciseAnatomySimulator
              exercise={currentDef}
              height="500px"
              isExpanded={true}
              onToggleExpand={() => setIsSimulatorModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
