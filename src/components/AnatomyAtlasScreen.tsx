import React, { useState } from 'react';
import { AnatomyMuscleDetail, MuscleId, ExerciseDefinition } from '../types';
import { ANATOMY_MUSCLES } from '../data/anatomyData';
import { EXERCISES_DATABASE } from '../data/exercises';
import { Anatomy3DViewer } from './Anatomy3DViewer';
import { ExerciseAnatomySimulator } from './ExerciseAnatomySimulator';
import {
  Search,
  Sparkles,
  Layers,
  Dumbbell,
  Swords,
  ShieldAlert,
  ChevronRight,
  Info,
  Flame,
  Activity,
  Compass,
  Play,
} from 'lucide-react';

export const AnatomyAtlasScreen: React.FC = () => {
  const [atlasMode, setAtlasMode] = useState<'atlas' | 'exercises'>('exercises');
  const [selectedMuscle, setSelectedMuscle] = useState<AnatomyMuscleDetail>(
    ANATOMY_MUSCLES.pectoralis_major
  );
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition>(
    EXERCISES_DATABASE[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [layerFilter, setLayerFilter] = useState<'all' | 'superficial' | 'deep'>('all');
  const [exerciseFilterCategory, setExerciseFilterCategory] = useState<string>('all');

  const allMuscles = Object.values(ANATOMY_MUSCLES);

  const filteredMuscles = allMuscles.filter((muscle) => {
    const matchesSearch =
      muscle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      muscle.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      muscle.primaryFunction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'all' || muscle.region === selectedRegion;
    const matchesLayer = layerFilter === 'all' || muscle.layer === layerFilter;

    return matchesSearch && matchesRegion && matchesLayer;
  });

  const filteredExercises = EXERCISES_DATABASE.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      exerciseFilterCategory === 'all' ||
      (exerciseFilterCategory === 'weight_training' && ex.modeCategory === 'weight_training') ||
      (exerciseFilterCategory === 'martial_arts' && ex.modeCategory === 'martial_arts');

    return matchesSearch && matchesCat;
  });

  return (
    <div id="anatomy-atlas-screen" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#D4FF00] text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" /> 3D Biomechanics & Anatomy Lab
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Anatomical Movement & Kinematics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Simulate real-time muscular contraction in each exercise, or inspect the 360° musculoskeletal atlas.
          </p>
        </div>

        {/* Lab Switcher Mode */}
        <div className="flex bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setAtlasMode('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
              atlasMode === 'exercises'
                ? 'bg-[#D4FF00] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Exercise Simulations</span>
          </button>
          <button
            type="button"
            onClick={() => setAtlasMode('atlas')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
              atlasMode === 'atlas'
                ? 'bg-[#D4FF00] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3D Muscle Atlas</span>
          </button>
        </div>
      </div>

      {atlasMode === 'exercises' ? (
        /* EXERCISE ANATOMY SIMULATION LAB VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Simulation Viewport */}
          <div className="lg:col-span-8 space-y-4">
            <ExerciseAnatomySimulator
              exercise={selectedExercise}
              height="480px"
            />
          </div>

          {/* Exercise Selector & Categorized Directory */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center justify-between">
                <span>Select Exercise To Simulate</span>
                <span className="text-[10px] text-[#D4FF00] font-mono">{filteredExercises.length} Exercises</span>
              </h3>

              {/* Category Pills */}
              <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setExerciseFilterCategory('all')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    exerciseFilterCategory === 'all' ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setExerciseFilterCategory('weight_training')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    exerciseFilterCategory === 'weight_training' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Lifting
                </button>
                <button
                  type="button"
                  onClick={() => setExerciseFilterCategory('martial_arts')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    exerciseFilterCategory === 'martial_arts' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Combat
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bench, squat, punch..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-[#D4FF00] outline-none font-mono"
                />
              </div>

              {/* Exercise List */}
              <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1">
                {filteredExercises.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selectedExercise.id === ex.id
                        ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white shadow-lg shadow-[#D4FF00]/5'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{ex.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize text-zinc-400">{ex.subCategory}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {ex.primaryMuscles.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-[#D4FF00] capitalize"
                          >
                            {m.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Play
                      className={`w-4 h-4 shrink-0 transition ${
                        selectedExercise.id === ex.id ? 'text-[#D4FF00] fill-current' : 'text-zinc-600'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3D MUSCULOSKELETAL ATLAS VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Viewport & Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
                  Active Focus: <span className="text-[#D4FF00] font-black">{selectedMuscle.name}</span>
                </div>
                <span className="text-[10px] text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-mono">
                  {selectedMuscle.layer} Layer
                </span>
              </div>

              <Anatomy3DViewer
                highlightedMuscles={[selectedMuscle.id]}
                selectedMuscleId={selectedMuscle.id}
                onSelectMuscle={(m) => m && setSelectedMuscle(m)}
                height="460px"
                showControls={true}
              />

              {/* Quick Select Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                <span className="text-zinc-500 font-bold uppercase text-[10px] py-1 mr-1">Quick Focus:</span>
                {allMuscles.slice(0, 7).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMuscle(m)}
                    className={`px-2.5 py-1 rounded-lg border transition text-xs font-bold ${
                      selectedMuscle.id === m.id
                        ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Selected Muscle Details & Search Directory */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4FF00] font-mono">
                  {selectedMuscle.region} • {selectedMuscle.layer} layer
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                  {selectedMuscle.name}
                </h2>
                <p className="text-xs text-zinc-400 italic font-mono">{selectedMuscle.latinName}</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Anatomical Function</h4>
                <p className="text-xs text-zinc-300 leading-relaxed bg-[#0A0A0A] p-3.5 rounded-2xl border border-white/5">
                  {selectedMuscle.primaryFunction}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Primary Joint Actions</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300">
                  {selectedMuscle.mainMovements.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-[#D4FF00]" /> Resistance Exercises
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMuscle.exercises.map((ex, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200 text-xs font-mono font-medium"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-xs space-y-1">
                <div className="font-bold text-[#D4FF00] flex items-center gap-1.5 uppercase tracking-wide">
                  <Swords className="w-3.5 h-3.5" /> Combat Kinetic Application
                </div>
                <p className="text-zinc-200 leading-relaxed">
                  {selectedMuscle.martialArtsImpact}
                </p>
              </div>
            </div>

            {/* Search Directory */}
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-5 shadow-2xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Anatomical Muscle Index
              </h3>

              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="input-anatomy-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search muscle or Latin term..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs text-white placeholder-zinc-500 focus:border-[#D4FF00] outline-none font-mono"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {['all', 'chest', 'shoulders', 'arms', 'back', 'core', 'legs'].map((reg) => (
                  <button
                    key={reg}
                    id={`btn-reg-${reg}`}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${
                      selectedRegion === reg
                        ? 'bg-[#D4FF00] text-black'
                        : 'bg-[#0A0A0A] border border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                {filteredMuscles.map((muscle) => (
                  <div
                    key={muscle.id}
                    onClick={() => setSelectedMuscle(muscle)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      selectedMuscle.id === muscle.id
                        ? 'bg-[#D4FF00]/15 border-[#D4FF00] text-white'
                        : 'bg-[#0A0A0A] border-white/5 text-zinc-300 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{muscle.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono capitalize">
                        {muscle.region} • {muscle.layer} layer
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
