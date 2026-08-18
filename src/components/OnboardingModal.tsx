import React, { useState } from 'react';
import {
  UserProfile,
  TrainingMode,
  ExperienceLevel,
  FitnessGoal,
  MartialArtDiscipline,
  SessionDurationMinutes,
  EquipmentOption,
} from '../types';
import {
  Dumbbell,
  Swords,
  Zap,
  Shield,
  Clock,
  Calendar,
  Check,
  ChevronRight,
  Flame,
  Info,
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onComplete,
  initialProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(initialProfile?.name || 'Alex');
  const [trainingMode, setTrainingMode] = useState<TrainingMode>(
    initialProfile?.trainingMode || 'hybrid'
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialProfile?.experienceLevel || 'intermediate'
  );
  const [goal, setGoal] = useState<FitnessGoal>(
    initialProfile?.goal || 'martial_arts_performance'
  );
  const [daysPerWeek, setDaysPerWeek] = useState<number>(initialProfile?.daysPerWeek || 4);
  const [sessionDuration, setSessionDuration] = useState<SessionDurationMinutes>(
    initialProfile?.sessionDuration || 60
  );
  const [martialArt, setMartialArt] = useState<MartialArtDiscipline>(
    initialProfile?.martialArt || 'muay_thai'
  );
  const [equipment, setEquipment] = useState<EquipmentOption[]>(
    initialProfile?.equipment || ['full_gym', 'combat_gym']
  );

  const handleFinish = () => {
    const newProfile: UserProfile = {
      id: initialProfile?.id || `user-${Date.now()}`,
      name: name.trim() || 'Athlete',
      trainingMode,
      experienceLevel,
      goal,
      daysPerWeek,
      sessionDuration,
      equipment,
      martialArt: trainingMode !== 'weight_training' ? martialArt : undefined,
      hasCompletedOnboarding: true,
      recoveryReadinessScore: 92,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
    };
    onComplete(newProfile);
  };

  const toggleEquipment = (eq: EquipmentOption) => {
    if (equipment.includes(eq)) {
      setEquipment(equipment.filter((e) => e !== eq));
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  return (
    <div
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="onboarding-modal-card"
        className="w-full max-w-2xl bg-[#141414] border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 relative"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4FF00] text-black font-black flex items-center justify-center text-xs font-mono">
              0{step}
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                Step 0{step} of 04
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {step === 1 && 'Select Your Primary Training Mode'}
                {step === 2 && 'Discipline, Experience & Equipment'}
                {step === 3 && 'Frequency, Schedule & Time Targets'}
                {step === 4 && 'Athlete Profile Confirmation'}
              </h2>
            </div>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-5 h-1 rounded-full transition-all ${
                  step === s ? 'bg-[#D4FF00] w-8' : step > s ? 'bg-zinc-600' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: THE THREE MODES */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Select how you want your training scheduled. All routines adapt scientifically based on joint recovery and kinetic energy.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {/* Option 1: Weight Training */}
              <div
                id="mode-opt-weights"
                onClick={() => setTrainingMode('weight_training')}
                className={`p-5 rounded-2xl border transition cursor-pointer flex items-center gap-4 ${
                  trainingMode === 'weight_training'
                    ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white ring-1 ring-[#D4FF00]'
                    : 'bg-[#0A0A0A] border-white/5 text-zinc-300 hover:border-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Dumbbell className="w-6 h-6 text-[#D4FF00]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">WEIGHT TRAINING</h3>
                    {trainingMode === 'weight_training' && (
                      <span className="px-2 py-0.5 rounded bg-[#D4FF00] text-black text-[9px] font-black uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    For users focused primarily on maximal strength, muscle hypertrophy, progressive overload, and barbell/dumbbell power.
                  </p>
                </div>
              </div>

              {/* Option 2: Martial Arts */}
              <div
                id="mode-opt-martial"
                onClick={() => setTrainingMode('martial_arts')}
                className={`p-5 rounded-2xl border transition cursor-pointer flex items-center gap-4 ${
                  trainingMode === 'martial_arts'
                    ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white ring-1 ring-[#D4FF00]'
                    : 'bg-[#0A0A0A] border-white/5 text-zinc-300 hover:border-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Swords className="w-6 h-6 text-[#D4FF00]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">MARTIAL ARTS</h3>
                    {trainingMode === 'martial_arts' && (
                      <span className="px-2 py-0.5 rounded bg-[#D4FF00] text-black text-[9px] font-black uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    For fighters and martial artists (Boxing, Kickboxing, Muay Thai, BJJ, MMA) focusing on technique, speed, and endurance.
                  </p>
                </div>
              </div>

              {/* Option 3: Hybrid Athlete */}
              <div
                id="mode-opt-hybrid"
                onClick={() => setTrainingMode('hybrid')}
                className={`p-5 rounded-2xl border transition cursor-pointer flex items-center gap-4 ${
                  trainingMode === 'hybrid'
                    ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white ring-1 ring-[#D4FF00]'
                    : 'bg-[#0A0A0A] border-white/5 text-zinc-300 hover:border-white/10'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Zap className="w-6 h-6 text-[#D4FF00]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">HYBRID ATHLETE (FLAGSHIP)</h3>
                    {trainingMode === 'hybrid' && (
                      <span className="px-2 py-0.5 rounded bg-[#D4FF00] text-black text-[9px] font-black uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Combines strength training and combat arts into an intelligent weekly routine with zero conflicting muscular fatigue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DISCIPLINE & EQUIPMENT */}
        {step === 2 && (
          <div className="space-y-4">
            {trainingMode !== 'weight_training' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Select Martial Art Discipline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'boxing', name: 'Boxing' },
                    { id: 'kickboxing', name: 'Kickboxing' },
                    { id: 'muay_thai', name: 'Muay Thai' },
                    { id: 'mma', name: 'MMA' },
                    { id: 'bjj', name: 'BJJ / Grappling' },
                    { id: 'wrestling', name: 'Wrestling' },
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
                      {art.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Beginner', desc: '< 1 Year' },
                  { id: 'intermediate', label: 'Intermediate', desc: '1 - 3 Years' },
                  { id: 'advanced', label: 'Advanced', desc: '3+ Years' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperienceLevel(exp.id as ExperienceLevel)}
                    className={`p-3 rounded-xl border text-xs transition text-center ${
                      experienceLevel === exp.id
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00] font-bold'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold">{exp.label}</div>
                    <div className="text-[10px] opacity-75 font-mono">{exp.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment checklist */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Available Equipment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bodyweight', label: 'Bodyweight & Calisthenics' },
                  { id: 'dumbbells', label: 'Dumbbells' },
                  { id: 'barbell_rack', label: 'Barbell & Squat Rack' },
                  { id: 'full_gym', label: 'Commercial Gym' },
                  { id: 'heavy_bag', label: 'Heavy Bag' },
                  { id: 'combat_gym', label: 'Dojo / Combat Gym' },
                ].map((eq) => {
                  const isChecked = equipment.includes(eq.id as EquipmentOption);
                  return (
                    <div
                      key={eq.id}
                      onClick={() => toggleEquipment(eq.id as EquipmentOption)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                        isChecked
                          ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white'
                          : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:border-white/10'
                      }`}
                    >
                      <span>{eq.label}</span>
                      {isChecked && <Check className="w-4 h-4 text-[#D4FF00]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE & TARGETS */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-400">
                  Training Frequency
                </span>
                <span className="font-mono text-[#D4FF00] font-bold text-sm">
                  {daysPerWeek} Days / Week
                </span>
              </div>
              <input
                id="input-onboarding-days"
                type="range"
                min={2}
                max={6}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                className="w-full accent-[#D4FF00]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>2 Days (Minimal)</span>
                <span>4 Days (Balanced)</span>
                <span>6 Days (Athlete)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Session Duration Target
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setSessionDuration(dur as SessionDurationMinutes)}
                    className={`py-3 rounded-xl text-xs font-mono font-bold border transition ${
                      sessionDuration === dur
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {dur} Mins
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                What should we call you?
              </label>
              <input
                id="input-onboarding-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-2xl bg-[#0A0A0A] border border-white/10 text-sm text-white focus:border-[#D4FF00] outline-none font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-2 text-xs">
              <div className="text-[#D4FF00] font-bold uppercase tracking-wider font-mono">
                Program Blueprint Summary
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-300">
                <div>
                  <span className="text-zinc-500">Mode:</span>{' '}
                  <strong className="text-white capitalize">{trainingMode.replace('_', ' ')}</strong>
                </div>
                <div>
                  <span className="text-zinc-500">Frequency:</span>{' '}
                  <strong className="text-white">{daysPerWeek} Days / Week</strong>
                </div>
                <div>
                  <span className="text-zinc-500">Duration:</span>{' '}
                  <strong className="text-white">{sessionDuration} Mins</strong>
                </div>
                <div>
                  <span className="text-zinc-500">Level:</span>{' '}
                  <strong className="text-white capitalize">{experienceLevel}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {step > 1 ? (
            <button
              id="btn-onboarding-back"
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 transition"
            >
              BACK
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              id="btn-onboarding-next"
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-black text-xs font-black tracking-tight flex items-center gap-1.5 transition shadow-lg shadow-[#D4FF00]/10"
            >
              CONTINUE <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-onboarding-finish"
              type="button"
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-black text-xs font-black tracking-tight flex items-center gap-1.5 transition shadow-lg shadow-[#D4FF00]/10"
            >
              GENERATE TRAINING PROGRAM <Flame className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
