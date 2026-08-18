import React from 'react';
import { WorkoutLogEntry, UserProfile } from '../types';
import {
  Activity,
  Trophy,
  Flame,
  Clock,
  Dumbbell,
  Swords,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface ProgressScreenProps {
  logs: WorkoutLogEntry[];
  profile: UserProfile;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ logs, profile }) => {
  const totalMinutesTrained = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalCompletedSessions = logs.length;
  const avgRpe =
    logs.length > 0
      ? (logs.reduce((acc, l) => acc + (l.rpeRating || 7), 0) / logs.length).toFixed(1)
      : '7.5';

  return (
    <div id="progress-screen" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-2">
        <div className="flex items-center gap-2 text-[#D4FF00] text-xs font-bold uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5" /> Performance Analytics
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Training History & Milestones
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Track session consistency, volume, perceived exertion (RPE), and athletic adaptations over time.
        </p>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-xl space-y-1">
          <div className="text-zinc-500 font-mono text-[10px] uppercase font-bold tracking-wider">
            Completed Sessions
          </div>
          <div className="text-3xl font-black font-mono text-white mt-1">
            {totalCompletedSessions}
          </div>
          <div className="text-xs text-[#D4FF00] font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Consistent athlete
          </div>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-xl space-y-1">
          <div className="text-zinc-500 font-mono text-[10px] uppercase font-bold tracking-wider">
            Time Under Tension
          </div>
          <div className="text-3xl font-black font-mono text-white mt-1">
            {totalMinutesTrained}m
          </div>
          <div className="text-xs text-zinc-400 font-mono">Total minutes logged</div>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-xl space-y-1">
          <div className="text-zinc-500 font-mono text-[10px] uppercase font-bold tracking-wider">
            Avg Perceived Exertion
          </div>
          <div className="text-3xl font-black font-mono text-[#D4FF00] mt-1">
            {avgRpe} <span className="text-sm font-mono text-zinc-500">/ 10</span>
          </div>
          <div className="text-xs text-zinc-400">Optimal stimulus zone</div>
        </div>

        <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-xl space-y-1">
          <div className="text-zinc-500 font-mono text-[10px] uppercase font-bold tracking-wider">
            Active Discipline
          </div>
          <div className="text-xl font-bold text-white mt-1 capitalize truncate">
            {profile.trainingMode.replace('_', ' ')}
          </div>
          <div className="text-xs text-zinc-400 capitalize">{profile.martialArt || 'Gym Athlete'}</div>
        </div>
      </div>

      {/* Recent Workout Logs List */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4FF00]" /> Recent Activity Log
          </h3>
          <span className="text-xs text-zinc-500 font-mono">{logs.length} Total Records</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center text-zinc-500 text-xs">
            No workouts completed yet. Start your first session on the Home screen!
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-[#D4FF00] font-bold uppercase">{log.mode}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">
                      {new Date(log.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">{log.sessionTitle}</div>
                  {log.notes && <p className="text-xs text-zinc-400">{log.notes}</p>}
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div>
                    <div className="text-xs font-mono font-bold text-white">
                      {log.durationMinutes} min
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase">Duration</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#D4FF00]">
                      RPE {log.rpeRating || 7}/10
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase">Exertion</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
