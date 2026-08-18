import React from 'react';
import { UserProfile, TrainingPlan, ScheduledSession } from '../types';
import {
  Play,
  Calendar,
  Clock,
  Dumbbell,
  Swords,
  Zap,
  Flame,
  Shield,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Apple,
} from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  plan: TrainingPlan;
  onStartSession: (session: ScheduledSession) => void;
  onNavigateTab: (tab: 'home' | 'workout' | 'anatomy' | 'progress' | 'profile' | 'recovery') => void;
  onOpenAICoach: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  plan,
  onStartSession,
  onNavigateTab,
  onOpenAICoach,
}) => {
  const currentDayJs = new Date().getDay();
  const normalizedDay = currentDayJs === 0 ? 6 : currentDayJs - 1;

  const todaySession =
    plan.weeklySchedule.find((s) => s.dayIndex === normalizedDay) ||
    plan.weeklySchedule[0];

  const currentDateFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div id="home-screen" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* High Density Header */}
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h2 className="text-zinc-500 text-xs font-bold tracking-widest uppercase">
            {currentDateFormatted}
          </h2>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Welcome back, {profile.name}
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <button
            id="btn-open-ai-coach"
            onClick={onOpenAICoach}
            className="px-4 py-2 bg-[#141414] hover:bg-[#1f1f1f] transition rounded-full border border-white/10 flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-2 h-2 bg-[#D4FF00] rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold tracking-wide text-zinc-200 group-hover:text-white">
              AI ASSISTANT READY
            </span>
          </button>
        </div>
      </header>

      {/* Main Grid: Hero Section & Side Anatomy Snapshot */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Hero & Exercise Previews) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* TODAY'S WORKOUT HERO CARD */}
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111111] p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-2xl">
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-[#D4FF00] text-black text-[10px] font-black rounded uppercase tracking-tighter">
                  {profile.trainingMode.replace('_', ' ')} • {todaySession.category}
                </span>
                <span className="text-zinc-400 text-xs font-mono">
                  Est. {todaySession.durationMin} mins
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-none">
                  {todaySession.sessionTitle}
                </h3>
                <p className="text-zinc-400 mt-2.5 text-xs sm:text-sm max-w-md leading-relaxed">
                  {todaySession.trainingPurpose}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 mt-6">
              <button
                id="btn-start-today-workout"
                onClick={() => onStartSession(todaySession)}
                className="px-8 py-3.5 bg-[#D4FF00] text-black font-bold rounded-xl text-xs sm:text-sm tracking-tight hover:bg-[#bce300] transition flex items-center gap-2 shadow-lg shadow-[#D4FF00]/10"
              >
                <Play className="w-4 h-4 fill-current" /> START WORKOUT
              </button>
              <button
                id="btn-view-plan-details"
                onClick={() => onNavigateTab('workout')}
                className="px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-white/10 transition"
              >
                PLAN DETAILS
              </button>
            </div>

            {/* High Density Radial Glow */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#D4FF00] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
          </div>

          {/* NEXT SESSION PREVIEWS */}
          <div className="bg-[#141414] rounded-3xl p-6 border border-white/5 flex flex-col space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Session Routine ({todaySession.exercises.length} Movements)
              </h4>
              <button
                onClick={() => onNavigateTab('workout')}
                className="text-xs text-[#D4FF00] font-semibold hover:underline"
              >
                View Full Week
              </button>
            </div>

            <div className="space-y-2.5">
              {todaySession.exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 p-3.5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 transition"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center font-mono text-zinc-400 text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{ex.name}</div>
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {ex.category || 'Compound'} • {ex.sets} Sets × {ex.repsOrTime}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-[#D4FF00] font-bold">
                      {ex.restPeriodSec}s
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase">Rest</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Anatomy Preview & Weekly Schedule) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Anatomy Visualization Card */}
          <div
            onClick={() => onNavigateTab('anatomy')}
            className="bg-[#141414] rounded-3xl border border-white/5 p-6 flex flex-col space-y-4 cursor-pointer group shadow-2xl"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Anatomy Visualization
              </h4>
              <div className="flex gap-1.5">
                <div className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] uppercase font-bold text-zinc-400">
                  3D Atlas
                </div>
                <div className="px-2 py-1 bg-white/10 rounded border border-[#D4FF00]/30 text-[10px] uppercase font-bold text-[#D4FF00]">
                  Muscular
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col justify-between space-y-3">
              <div className="text-[10px] text-[#D4FF00] font-bold uppercase tracking-widest">
                Primary Target Groups
              </div>
              <div className="flex flex-wrap gap-1.5">
                {todaySession.exercises.slice(0, 4).map((ex, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-zinc-200 capitalize"
                  >
                    {ex.primaryMuscles[0]?.replace('_', ' ') || 'Core'}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs text-zinc-400 group-hover:text-white transition">
                <span>Explore 360° Anatomical Biomechanics</span>
                <ChevronRight className="w-4 h-4 text-[#D4FF00]" />
              </div>
            </div>
          </div>

          {/* Recovery Readiness Status */}
          <div
            onClick={() => onNavigateTab('recovery')}
            className="bg-[#141414] rounded-3xl border border-white/5 p-6 cursor-pointer shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Recovery Status
              </h4>
              <span className="text-xs font-mono font-bold text-[#D4FF00]">
                {profile.recoveryReadinessScore || 92}% Optimal
              </span>
            </div>

            {/* Bar Chart Visualizer */}
            <div className="flex items-end gap-2 h-16">
              <div className="flex-1 bg-white/5 h-10 rounded-t-sm"></div>
              <div className="flex-1 bg-white/10 h-12 rounded-t-sm"></div>
              <div className="flex-1 bg-white/15 h-11 rounded-t-sm"></div>
              <div className="flex-1 bg-[#D4FF00] h-16 rounded-t-sm"></div>
              <div className="flex-1 bg-white/20 h-10 rounded-t-sm"></div>
              <div className="flex-1 bg-white/5 h-8 rounded-t-sm"></div>
              <div className="flex-1 bg-white/10 h-12 rounded-t-sm"></div>
            </div>

            <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500 uppercase">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span className="text-[#D4FF00]">Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => onNavigateTab('recovery')}
              className="p-4 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/10 transition cursor-pointer space-y-1"
            >
              <HeartPulse className="w-4 h-4 text-[#D4FF00]" />
              <div className="text-xs font-bold text-white">Fuel & Nutrition</div>
              <div className="text-[10px] text-zinc-400">Pre/Post Meal Guides</div>
            </div>

            <div
              onClick={() => onNavigateTab('progress')}
              className="p-4 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/10 transition cursor-pointer space-y-1"
            >
              <Zap className="w-4 h-4 text-[#D4FF00]" />
              <div className="text-xs font-bold text-white">History & Logs</div>
              <div className="text-[10px] text-zinc-400">RPE & Set Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY SCHEDULE RIBBON */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4FF00]" /> Weekly Training Schedule
          </h3>
          <span className="text-xs text-zinc-400">{profile.daysPerWeek} Active Training Days</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {plan.weeklySchedule.map((session) => {
            const isToday = session.dayIndex === normalizedDay;
            return (
              <div
                key={session.id}
                onClick={() => onStartSession(session)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between min-h-[130px] relative ${
                  isToday
                    ? 'bg-[#1A1A1A] border-[#D4FF00] text-white shadow-lg shadow-[#D4FF00]/5 ring-1 ring-[#D4FF00]'
                    : session.isRestDay
                    ? 'bg-[#141414]/40 border-white/5 text-zinc-500 hover:border-white/10'
                    : 'bg-[#141414] border-white/5 text-zinc-300 hover:border-white/10'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-[#D4FF00] text-black font-black text-[9px] uppercase tracking-tighter">
                    Today
                  </span>
                )}
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    {session.dayName.slice(0, 3)}
                  </div>
                  <div className="font-bold text-xs text-white mt-1 line-clamp-2">
                    {session.sessionTitle.replace(/^(Hybrid Day \d+:|Full Body [A-Z]:)/, '')}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className={session.isRestDay ? 'text-zinc-500' : 'text-[#D4FF00] font-bold'}>
                    {session.isRestDay ? 'REST' : `${session.durationMin}M`}
                  </span>
                  {!session.isRestDay && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
