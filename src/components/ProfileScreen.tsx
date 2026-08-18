import React, { useState } from 'react';
import { UserProfile, TrainingMode, ExperienceLevel, FitnessGoal, MartialArtDiscipline } from '../types';
import {
  User,
  Settings,
  Shield,
  RotateCcw,
  CheckCircle2,
  Dumbbell,
  Swords,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onReopenOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onReopenOnboarding,
}) => {
  const [name, setName] = useState<string>(profile.name);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>(profile.trainingMode);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile.experienceLevel);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(profile.daysPerWeek);
  const [sessionDuration, setSessionDuration] = useState<number>(profile.sessionDuration);
  const [martialArt, setMartialArt] = useState<MartialArtDiscipline | undefined>(profile.martialArt);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    const updated: UserProfile = {
      ...profile,
      name,
      trainingMode,
      experienceLevel,
      goal,
      daysPerWeek,
      sessionDuration: sessionDuration as any,
      martialArt,
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="profile-screen" className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-2">
        <div className="flex items-center gap-2 text-[#D4FF00] text-xs font-bold uppercase tracking-widest">
          <User className="w-3.5 h-3.5" /> Athlete Profile
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Training Settings & Biomechanics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Fine-tune your training mode, weekly frequency, discipline focus, and duration targets.
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Athlete Name</label>
          <input
            id="input-profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4FF00] outline-none font-mono"
          />
        </div>

        {/* Training Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Training Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'weight_training', label: 'Weight Training', desc: 'Strength & Hypertrophy' },
              { id: 'martial_arts', label: 'Martial Arts', desc: 'Striking & Grappling' },
              { id: 'hybrid', label: 'Hybrid Athlete', desc: 'Synergistic Integration' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setTrainingMode(m.id as TrainingMode)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                  trainingMode === m.id
                    ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white ring-1 ring-[#D4FF00]'
                    : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:border-white/10'
                }`}
              >
                <div className="font-bold text-xs text-white">{m.label}</div>
                <div className="text-[10px] text-zinc-500">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Martial Art (if applicable) */}
        {(trainingMode === 'martial_arts' || trainingMode === 'hybrid') && (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Combat Discipline</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'boxing', label: 'Boxing' },
                { id: 'kickboxing', label: 'Kickboxing' },
                { id: 'muay_thai', label: 'Muay Thai' },
                { id: 'mma', label: 'MMA' },
                { id: 'bjj', label: 'BJJ / Grappling' },
                { id: 'wrestling', label: 'Wrestling' },
              ].map((art) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => setMartialArt(art.id as MartialArtDiscipline)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                    martialArt === art.id
                      ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                      : 'bg-[#0A0A0A] border-white/5 text-zinc-300 hover:text-white'
                  }`}
                >
                  {art.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Frequency & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Weekly Frequency ({daysPerWeek} Days / Week)
            </label>
            <input
              id="input-days-per-week"
              type="range"
              min={2}
              max={6}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
              className="w-full accent-[#D4FF00]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Session Duration ({sessionDuration} Mins)
            </label>
            <div className="flex gap-2">
              {[30, 45, 60, 90].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSessionDuration(dur)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition ${
                    sessionDuration === dur
                      ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                      : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {dur}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <button
            id="btn-relaunch-wizard"
            type="button"
            onClick={onReopenOnboarding}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Relaunch Setup Wizard
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-[#D4FF00] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Profile Updated!
              </span>
            )}
            <button
              id="btn-save-profile"
              type="button"
              onClick={handleSave}
              className="px-8 py-3 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-black text-xs font-black tracking-tight transition shadow-lg shadow-[#D4FF00]/10"
            >
              SAVE SETTINGS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
