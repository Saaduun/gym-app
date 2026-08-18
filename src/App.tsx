import React, { useState, useEffect } from 'react';
import { UserProfile, TrainingPlan, ScheduledSession, WorkoutLogEntry } from './types';
import { generateTrainingPlan } from './utils/planGenerator';
import { HomeScreen } from './components/HomeScreen';
import { ActiveWorkoutScreen } from './components/ActiveWorkoutScreen';
import { AnatomyAtlasScreen } from './components/AnatomyAtlasScreen';
import { RecoveryNutritionScreen } from './components/RecoveryNutritionScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { AICoachModal } from './components/AICoachModal';
import {
  Flame,
  Dumbbell,
  Swords,
  Activity,
  User,
  HeartPulse,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Shield,
} from 'lucide-react';

type TabType = 'home' | 'workout' | 'anatomy' | 'recovery' | 'progress' | 'profile';

const DEFAULT_PROFILE: UserProfile = {
  id: 'default-user',
  name: 'Alex Rivera',
  trainingMode: 'hybrid',
  experienceLevel: 'intermediate',
  goal: 'martial_arts_performance',
  daysPerWeek: 4,
  sessionDuration: 60,
  equipment: ['full_gym', 'combat_gym'],
  martialArt: 'muay_thai',
  hasCompletedOnboarding: false,
  recoveryReadinessScore: 92,
  createdAt: new Date().toISOString(),
};

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('kinetic_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kinetic_workout_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'sample-log-1',
        sessionId: 'session-hybrid-1',
        sessionTitle: 'Hybrid Day 1: Max Upper Body & Punch Kinetic Power',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        mode: 'hybrid',
        durationMinutes: 55,
        completedExercisesCount: 6,
        totalExercisesCount: 6,
        rpeRating: 8,
        notes: 'Great rotational power transfer on landmine punch presses.',
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.hasCompletedOnboarding);
  const [showAICoach, setShowAICoach] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<ScheduledSession | null>(null);

  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan>(() => generateTrainingPlan(profile));

  useEffect(() => {
    const newPlan = generateTrainingPlan(profile);
    setTrainingPlan(newPlan);
    localStorage.setItem('kinetic_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('kinetic_workout_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setShowOnboarding(false);
  };

  const handleStartWorkout = (session: ScheduledSession) => {
    if (session.isRestDay) return;
    setActiveSession(session);
  };

  const handleFinishWorkout = (log: WorkoutLogEntry) => {
    setWorkoutLogs((prev) => [log, ...prev]);
    setActiveSession(null);
    setActiveTab('progress');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#D4FF00] selection:text-black flex flex-col justify-between">
      {/* HIGH DENSITY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div
            id="brand-logo"
            onClick={() => {
              setActiveSession(null);
              setActiveTab('home');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D4FF00] text-black flex items-center justify-center font-black shadow-lg shadow-[#D4FF00]/15 group-hover:scale-105 transition">
              <div className="w-5 h-5 border-2 border-black rounded-sm flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">KINETIC</span>
                <span className="text-[9px] uppercase font-black tracking-tighter text-black bg-[#D4FF00] px-1.5 py-0.5 rounded">
                  High Density
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono -mt-0.5 hidden sm:block">
                Gym & Martial Arts Training System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#141414] p-1.5 rounded-2xl border border-white/5">
            <button
              id="nav-home"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('home');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition tracking-tight ${
                activeTab === 'home' && !activeSession
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              HOME
            </button>
            <button
              id="nav-workout"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('workout');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition tracking-tight ${
                activeTab === 'workout' || activeSession
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              WORKOUT
            </button>
            <button
              id="nav-anatomy"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('anatomy');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition tracking-tight ${
                activeTab === 'anatomy' && !activeSession
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3D ANATOMY
            </button>
            <button
              id="nav-recovery"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('recovery');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition tracking-tight ${
                activeTab === 'recovery' && !activeSession
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              RECOVERY & FUEL
            </button>
            <button
              id="nav-progress"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('progress');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition tracking-tight ${
                activeTab === 'progress' && !activeSession
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PROGRESS
            </button>
            <button
              id="nav-profile"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('profile');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition tracking-tight ${
                activeTab === 'profile' && !activeSession
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PROFILE
            </button>
          </nav>

          {/* Right Action: AI Assistant Pill & User Profile */}
          <div className="flex items-center gap-3">
            <button
              id="btn-nav-ai-coach"
              onClick={() => setShowAICoach(true)}
              className="px-3.5 py-1.5 bg-[#141414] hover:bg-[#1c1c1c] border border-white/10 rounded-full text-xs font-bold text-zinc-200 flex items-center gap-2 transition cursor-pointer"
            >
              <div className="w-2 h-2 bg-[#D4FF00] rounded-full animate-pulse"></div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wide">
                AI COACH
              </span>
            </button>

            <button
              id="btn-user-avatar"
              onClick={() => {
                setActiveSession(null);
                setActiveTab('profile');
              }}
              className="w-9 h-9 rounded-full border border-white/20 bg-gradient-to-tr from-zinc-800 to-zinc-600 text-white font-bold text-xs flex items-center justify-center transition hover:border-[#D4FF00]"
            >
              {profile.name.charAt(0)}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeSession ? (
          <ActiveWorkoutScreen
            session={activeSession}
            onFinishWorkout={handleFinishWorkout}
            onCancel={() => setActiveSession(null)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                profile={profile}
                plan={trainingPlan}
                onStartSession={handleStartWorkout}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAICoach={() => setShowAICoach(true)}
              />
            )}

            {activeTab === 'workout' && (
              <div className="space-y-6 max-w-5xl mx-auto pb-20">
                <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
                  <div className="flex items-center gap-2 text-[#D4FF00] text-xs font-bold uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" /> Full Workout Schedule
                  </div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Weekly Training Sessions
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                    Select any day's session below to view full exercise lists, technique cues, and launch the active workout timer.
                  </p>
                </div>

                <div className="space-y-3.5">
                  {trainingPlan.weeklySchedule.map((session) => (
                    <div
                      key={session.id}
                      className={`p-5 sm:p-6 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
                        session.isRestDay
                          ? 'bg-[#141414]/40 border-white/5 text-zinc-500'
                          : 'bg-[#141414] border-white/5 hover:border-white/15 text-white'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#D4FF00]">
                            {session.dayName}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-400">{session.category}</span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-400 font-mono">{session.durationMin} mins</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {session.sessionTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                          {session.trainingPurpose}
                        </p>
                        {!session.isRestDay && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {session.exercises.map((e, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-lg bg-[#0A0A0A] text-zinc-300 text-[11px] border border-white/5 font-mono"
                              >
                                {e.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {!session.isRestDay ? (
                        <button
                          id={`btn-launch-session-${session.id}`}
                          onClick={() => handleStartWorkout(session)}
                          className="px-6 py-3 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#D4FF00]/10 shrink-0"
                        >
                          START WORKOUT <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="px-4 py-2 rounded-xl bg-[#0A0A0A] text-zinc-500 text-xs font-semibold border border-white/5 shrink-0 text-center font-mono">
                          REST & REPAIR
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'anatomy' && <AnatomyAtlasScreen />}

            {activeTab === 'recovery' && <RecoveryNutritionScreen />}

            {activeTab === 'progress' && (
              <ProgressScreen logs={workoutLogs} profile={profile} />
            )}

            {activeTab === 'profile' && (
              <ProfileScreen
                profile={profile}
                onUpdateProfile={(updated) => setProfile(updated)}
                onReopenOnboarding={() => setShowOnboarding(true)}
              />
            )}
          </>
        )}
      </main>

      {/* HIGH DENSITY FOOTER */}
      <footer className="border-t border-white/5 bg-[#0A0A0A] py-4 px-6 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium hidden sm:flex justify-between items-center max-w-7xl mx-auto w-full">
        <div>Physiological and Biomechanical educational models • Not clinical EMG sensors</div>
        <div className="flex gap-8">
          <span>Safety Guidelines</span>
          <span>Privacy Vault</span>
          <span className="text-zinc-500 font-mono">V1.0.4-BETA</span>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            setActiveSession(null);
            setActiveTab('home');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'home' && !activeSession ? 'text-[#D4FF00]' : 'text-zinc-500'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5 uppercase tracking-tight">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveSession(null);
            setActiveTab('workout');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'workout' || activeSession ? 'text-[#D4FF00]' : 'text-zinc-500'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5 uppercase tracking-tight">Workout</span>
        </button>

        <button
          onClick={() => {
            setActiveSession(null);
            setActiveTab('anatomy');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'anatomy' && !activeSession ? 'text-[#D4FF00]' : 'text-zinc-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5 uppercase tracking-tight">Anatomy</span>
        </button>

        <button
          onClick={() => {
            setActiveSession(null);
            setActiveTab('recovery');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'recovery' && !activeSession ? 'text-[#D4FF00]' : 'text-zinc-500'
          }`}
        >
          <HeartPulse className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5 uppercase tracking-tight">Recovery</span>
        </button>

        <button
          onClick={() => {
            setActiveSession(null);
            setActiveTab('progress');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'progress' && !activeSession ? 'text-[#D4FF00]' : 'text-zinc-500'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-0.5 uppercase tracking-tight">Progress</span>
        </button>
      </div>

      {/* ONBOARDING MODAL */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={handleCompleteOnboarding}
          initialProfile={profile}
        />
      )}

      {/* AI COACH ASSISTANT MODAL */}
      <AICoachModal
        isOpen={showAICoach}
        onClose={() => setShowAICoach(false)}
        profile={profile}
        plan={trainingPlan}
      />
    </div>
  );
};

export default App;
