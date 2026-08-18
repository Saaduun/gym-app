import React, { useState } from 'react';
import {
  HeartPulse,
  Apple,
  Moon,
  Droplets,
  Activity,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export const RecoveryNutritionScreen: React.FC = () => {
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sorenessLevel, setSorenessLevel] = useState<number>(3); // 1-10
  const [hydrationLitres, setHydrationLitres] = useState<number>(3.0);
  const [readinessScore, setReadinessScore] = useState<number>(88);

  const calculateReadiness = (sleep: number, soreness: number, hydro: number) => {
    let score = 50;
    score += (sleep / 8) * 30;
    score -= (soreness / 10) * 20;
    score += (hydro / 3.5) * 20;
    return Math.min(100, Math.max(10, Math.round(score)));
  };

  const handleUpdate = (sleep: number, soreness: number, hydro: number) => {
    setSleepHours(sleep);
    setSorenessLevel(soreness);
    setHydrationLitres(hydro);
    setReadinessScore(calculateReadiness(sleep, soreness, hydro));
  };

  return (
    <div id="recovery-nutrition-screen" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-2">
        <div className="flex items-center gap-2 text-[#D4FF00] text-xs font-bold uppercase tracking-widest">
          <HeartPulse className="w-3.5 h-3.5" /> Physiology & Recovery Science
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Recovery & Athletic Fueling
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Scientific fatigue management, systemic nervous system recovery, and nutrition protocols for combat & resistance athletes.
        </p>
      </div>

      {/* Prominent Medical Warning Box */}
      <div className="p-4 rounded-3xl bg-[#141414] border border-amber-500/30 flex items-start gap-3.5 shadow-xl">
        <ShieldAlert className="w-5 h-5 text-[#D4FF00] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-white uppercase tracking-wider">
            Medical & Physiological Notice
          </div>
          <p className="text-zinc-400 leading-relaxed">
            This application provides educational sports science models and biomechanical estimates. It does not provide medical diagnoses. If you experience persistent sharp pain, joint swelling, neurological tingling, or suspected injuries, stop all training immediately and consult a qualified medical professional.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Readiness Calculator */}
        <div className="lg:col-span-6 bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D4FF00]" /> Daily Readiness Check-In
            </h3>
            <span className="text-xs font-mono font-bold text-[#D4FF00]">
              {readinessScore}% READINESS
            </span>
          </div>

          {/* Readiness Dial */}
          <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-around gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-[#D4FF00] flex flex-col items-center justify-center text-center shadow-lg shadow-[#D4FF00]/10">
              <span className="text-2xl font-black font-mono text-white leading-none">
                {readinessScore}%
              </span>
              <span className="text-[9px] uppercase font-bold text-[#D4FF00] mt-1 tracking-tighter">
                {readinessScore >= 80 ? 'Optimal' : readinessScore >= 60 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="text-xs text-zinc-300 max-w-xs space-y-1">
              <div className="font-bold text-white">Systemic Capacity</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                {readinessScore >= 80
                  ? 'CNS recovery is fully primed. You are ready for high-intensity lifting and high-velocity sparring.'
                  : readinessScore >= 60
                  ? 'Moderate fatigue detected. Maintain target lifting volume, avoid maximal 1RM failures.'
                  : 'High systemic strain. Prioritize light mobility, technique drills, and sleep hygiene.'}
              </p>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Sleep Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-[#D4FF00]" /> Sleep Duration
                </span>
                <span className="font-mono text-white font-bold">{sleepHours} Hours</span>
              </div>
              <input
                id="slider-sleep"
                type="range"
                min={4}
                max={10}
                step={0.5}
                value={sleepHours}
                onChange={(e) => handleUpdate(parseFloat(e.target.value), sorenessLevel, hydrationLitres)}
                className="w-full accent-[#D4FF00]"
              />
            </div>

            {/* Soreness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#D4FF00]" /> Muscular Soreness / Stiffness
                </span>
                <span className="font-mono text-white font-bold">{sorenessLevel} / 10</span>
              </div>
              <input
                id="slider-soreness"
                type="range"
                min={1}
                max={10}
                value={sorenessLevel}
                onChange={(e) => handleUpdate(sleepHours, parseInt(e.target.value), hydrationLitres)}
                className="w-full accent-[#D4FF00]"
              />
            </div>

            {/* Hydration Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#D4FF00]" /> Daily Water Intake
                </span>
                <span className="font-mono text-white font-bold">{hydrationLitres} Litres</span>
              </div>
              <input
                id="slider-hydration"
                type="range"
                min={1.0}
                max={5.0}
                step={0.25}
                value={hydrationLitres}
                onChange={(e) => handleUpdate(sleepHours, sorenessLevel, parseFloat(e.target.value))}
                className="w-full accent-[#D4FF00]"
              />
            </div>
          </div>
        </div>

        {/* Right: Nutrition Protocols */}
        <div className="lg:col-span-6 bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Apple className="w-4 h-4 text-[#D4FF00]" /> Performance Fueling Guide
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono uppercase bg-white/5 px-2 py-0.5 rounded">
              Evidence-Based
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center">
              <div className="text-zinc-500 font-mono text-[9px] uppercase">Protein</div>
              <div className="text-white font-bold text-sm mt-0.5 font-mono">1.6-2.2g</div>
              <div className="text-zinc-500 text-[9px]">per kg bodyweight</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center">
              <div className="text-zinc-500 font-mono text-[9px] uppercase">Carbohydrates</div>
              <div className="text-[#D4FF00] font-bold text-sm mt-0.5 font-mono">3.0-5.0g</div>
              <div className="text-zinc-500 text-[9px]">glycogen replenishment</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 text-center">
              <div className="text-zinc-500 font-mono text-[9px] uppercase">Healthy Fats</div>
              <div className="text-white font-bold text-sm mt-0.5 font-mono">0.8-1.2g</div>
              <div className="text-zinc-500 text-[9px]">hormonal health</div>
            </div>
          </div>

          {/* Timing Windows */}
          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4FF00]" /> Pre-Workout (1-2 Hours Before)
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Consume easily digestible complex carbs with moderate protein (e.g. oatmeal with banana & whey protein, or rice cakes with nut butter). Ensure 500ml water.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4FF00]" /> Post-Workout (Within 45 Mins)
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                25-40g high-leucine protein to stimulate Muscle Protein Synthesis (MPS) + simple fast carbohydrates to accelerate glycogen resynthesis and lower cortisol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
