import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { MuscleId, ExerciseDefinition } from '../types';
import { ANATOMY_MUSCLES } from '../data/anatomyData';
import { getExerciseSimulation, ExerciseSimulationData } from '../data/exerciseSimulations';
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Flame,
  ShieldAlert,
  Layers,
  Eye,
  Activity,
  Gauge,
  Compass,
  Zap,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ExerciseAnatomySimulatorProps {
  exercise: ExerciseDefinition;
  height?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const ExerciseAnatomySimulator: React.FC<ExerciseAnatomySimulatorProps> = ({
  exercise,
  height = '480px',
  isExpanded = false,
  onToggleExpand,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Kinetic Rig Hierarchies
  const bodyRootRef = useRef<THREE.Group | null>(null);
  const torsoGroupRef = useRef<THREE.Group | null>(null);
  const leftArmGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const leftForearmGroupRef = useRef<THREE.Group | null>(null);
  const rightForearmGroupRef = useRef<THREE.Group | null>(null);
  const leftLegGroupRef = useRef<THREE.Group | null>(null);
  const rightLegGroupRef = useRef<THREE.Group | null>(null);
  const leftShinGroupRef = useRef<THREE.Group | null>(null);
  const rightShinGroupRef = useRef<THREE.Group | null>(null);
  const equipmentGroupRef = useRef<THREE.Group | null>(null);

  const muscleMeshesMapRef = useRef<Map<MuscleId, THREE.Mesh[]>>(new Map());

  // Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simProgress, setSimProgress] = useState<number>(0); // 0.0 to 1.0
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 0.5x, 1x, 2x
  const [viewAngle, setViewAngle] = useState<'3d' | 'front' | 'side' | 'back'>('3d');
  const [displayMode, setDisplayMode] = useState<'muscular' | 'skeletal' | 'hybrid'>('muscular');
  const [showTensionOverlay, setShowTensionOverlay] = useState<boolean>(true);

  const simulationData: ExerciseSimulationData = useMemo(() => {
    return getExerciseSimulation(exercise.id, exercise.name, exercise.primaryMuscles, exercise.secondaryMuscles);
  }, [exercise]);

  // Derived current phase & tensions
  const currentPhaseInfo = useMemo(() => {
    const p = simProgress;
    const { start, eccentric, pause, concentric } = simulationData.phases;
    
    // In standard eccentric-first compound: 0.0 -> start, start..eccentric, pause, concentric
    if (p < start.durationPct) {
      return { phase: 'START & BRACE', cue: start.cue, color: 'text-blue-400', progressPct: (p / start.durationPct) * 100 };
    } else if (p < start.durationPct + eccentric.durationPct) {
      return { phase: 'ECCENTRIC • CONTROLLED LOAD', cue: eccentric.cue, color: 'text-amber-400', progressPct: ((p - start.durationPct) / eccentric.durationPct) * 100 };
    } else if (p < start.durationPct + eccentric.durationPct + pause.durationPct) {
      return { phase: 'PEAK TENSION • INFLECTION', cue: pause.cue, color: 'text-[#D4FF00]', progressPct: 100 };
    } else {
      const remaining = 1.0 - (start.durationPct + eccentric.durationPct + pause.durationPct);
      return { phase: 'CONCENTRIC • EXPLOSIVE DRIVE', cue: concentric.cue, color: 'text-emerald-400', progressPct: ((p - (start.durationPct + eccentric.durationPct + pause.durationPct)) / remaining) * 100 };
    }
  }, [simProgress, simulationData]);

  // Real-time muscle tension readouts
  const liveTensions = useMemo(() => {
    const p = simProgress;
    return simulationData.muscleRecruitment.map((curve) => {
      let currentTension = 50;
      if (p <= 0.5) {
        // From eccentric start to peak (0.0 -> 0.5)
        const factor = p / 0.5;
        currentTension = curve.eccentricTension + (curve.inflectionTension - curve.eccentricTension) * factor;
      } else {
        // From peak to concentric finish (0.5 -> 1.0)
        const factor = (p - 0.5) / 0.5;
        currentTension = curve.inflectionTension - (curve.inflectionTension - curve.concentricTension) * (1 - factor);
      }
      return {
        ...curve,
        currentTension: Math.round(Math.max(20, Math.min(100, currentTension))),
      };
    });
  }, [simProgress, simulationData]);

  // Main Three.js Kinematic Rig Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || 480;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.2, 4.4);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4ff00, 1.1);
    rimLight.position.set(-2, 3, -3);
    scene.add(rimLight);

    // Floor Grid & Platform
    const grid = new THREE.GridHelper(8, 16, 0x27272a, 0x141414);
    grid.position.y = -2.1;
    scene.add(grid);

    // 5. KINEMATIC RIG HIERARCHY
    const bodyRoot = new THREE.Group();
    bodyRootRef.current = bodyRoot;
    scene.add(bodyRoot);

    const muscleMap = new Map<MuscleId, THREE.Mesh[]>();

    const addMuscleMeshToGroup = (
      muscleId: MuscleId,
      geometry: THREE.BufferGeometry,
      parentGroup: THREE.Group,
      position: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1]
    ) => {
      const isTarget = exercise.primaryMuscles.includes(muscleId) || exercise.secondaryMuscles.includes(muscleId);
      const isPrimary = exercise.primaryMuscles.includes(muscleId);

      const mat = new THREE.MeshStandardMaterial({
        color: isPrimary ? 0xd4ff00 : isTarget ? 0xa3e635 : 0x711515,
        emissive: isPrimary ? 0xa8d900 : 0x000000,
        emissiveIntensity: isPrimary ? 0.6 : 0.0,
        roughness: 0.3,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.scale.set(...scale);
      mesh.userData = { muscleId, isPrimary, isTarget };

      parentGroup.add(mesh);

      const list = muscleMap.get(muscleId) || [];
      list.push(mesh);
      muscleMap.set(muscleId, list);
      return mesh;
    };

    const addBoneMeshToGroup = (
      geometry: THREE.BufferGeometry,
      parentGroup: THREE.Group,
      position: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1]
    ) => {
      const boneMat = new THREE.MeshStandardMaterial({
        color: 0xe4e4e7,
        roughness: 0.4,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geometry, boneMat);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.scale.set(...scale);
      parentGroup.add(mesh);
      return mesh;
    };

    // PELVIS & SPINE
    const pelvisGeom = new THREE.CylinderGeometry(0.26, 0.22, 0.22, 16);
    pelvisGeom.scale(1.1, 1, 0.75);
    addBoneMeshToGroup(pelvisGeom, bodyRoot, [0, 0.2, 0]);

    // Glutes on Pelvis
    const gluteGeom = new THREE.SphereGeometry(0.18, 16, 16);
    gluteGeom.scale(0.9, 1.1, 0.85);
    addMuscleMeshToGroup('gluteus_maximus', gluteGeom, bodyRoot, [-0.15, 0.15, -0.12]);
    addMuscleMeshToGroup('gluteus_maximus', gluteGeom, bodyRoot, [0.15, 0.15, -0.12]);

    const gluteMedGeom = new THREE.SphereGeometry(0.13, 14, 14);
    addMuscleMeshToGroup('gluteus_medius', gluteMedGeom, bodyRoot, [-0.25, 0.22, -0.04]);
    addMuscleMeshToGroup('gluteus_medius', gluteMedGeom, bodyRoot, [0.25, 0.22, -0.04]);

    // TORSO GROUP (Hinges on Pelvis)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.3, 0);
    bodyRoot.add(torsoGroup);
    torsoGroupRef.current = torsoGroup;

    // Spine & Ribcage
    const spineGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12);
    addBoneMeshToGroup(spineGeom, torsoGroup, [0, 0.4, -0.08]);

    const ribcageGeom = new THREE.CylinderGeometry(0.27, 0.21, 0.5, 16);
    ribcageGeom.scale(1.15, 1, 0.7);
    addBoneMeshToGroup(ribcageGeom, torsoGroup, [0, 0.55, 0]);

    // Head
    const skullGeom = new THREE.SphereGeometry(0.22, 20, 20);
    skullGeom.scale(0.85, 1.1, 0.95);
    addBoneMeshToGroup(skullGeom, torsoGroup, [0, 1.15, 0]);

    // Pecs (Chest)
    const pecGeom = new THREE.BoxGeometry(0.2, 0.18, 0.11);
    addMuscleMeshToGroup('pectoralis_major', pecGeom, torsoGroup, [-0.13, 0.62, 0.12], [0, -0.15, 0.05]);
    addMuscleMeshToGroup('pectoralis_major', pecGeom, torsoGroup, [0.13, 0.62, 0.12], [0, 0.15, -0.05]);

    // Abs & Obliques
    const absUpperGeom = new THREE.BoxGeometry(0.17, 0.13, 0.07);
    addMuscleMeshToGroup('rectus_abdominis', absUpperGeom, torsoGroup, [0, 0.45, 0.11]);
    const absLowerGeom = new THREE.BoxGeometry(0.17, 0.13, 0.07);
    addMuscleMeshToGroup('rectus_abdominis', absLowerGeom, torsoGroup, [0, 0.28, 0.11]);

    const obliqueGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.35, 12);
    obliqueGeom.scale(0.8, 1, 0.6);
    addMuscleMeshToGroup('obliques', obliqueGeom, torsoGroup, [-0.21, 0.32, 0.04], [0, 0, -0.15]);
    addMuscleMeshToGroup('obliques', obliqueGeom, torsoGroup, [0.21, 0.32, 0.04], [0, 0, 0.15]);

    // Lats & Back
    const latGeom = new THREE.BoxGeometry(0.16, 0.38, 0.09);
    addMuscleMeshToGroup('latissimus_dorsi', latGeom, torsoGroup, [-0.17, 0.48, -0.11], [0, -0.2, -0.1]);
    addMuscleMeshToGroup('latissimus_dorsi', latGeom, torsoGroup, [0.17, 0.48, -0.11], [0, 0.2, 0.1]);

    const rhomboidGeom = new THREE.BoxGeometry(0.18, 0.2, 0.05);
    addMuscleMeshToGroup('rhomboids', rhomboidGeom, torsoGroup, [0, 0.68, -0.1]);

    const erectorGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.55, 12);
    addMuscleMeshToGroup('erector_spinae', erectorGeom, torsoGroup, [-0.07, 0.35, -0.11]);
    addMuscleMeshToGroup('erector_spinae', erectorGeom, [0.07, 0.35, -0.11]);

    const trapGeom = new THREE.ConeGeometry(0.32, 0.4, 8);
    trapGeom.scale(1.2, 0.8, 0.4);
    addMuscleMeshToGroup('trapezius', trapGeom, torsoGroup, [0, 0.82, -0.07], [Math.PI, 0, 0]);

    // SHOULDERS & ARMS
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.35, 0.75, 0);
    torsoGroup.add(leftArmGroup);
    leftArmGroupRef.current = leftArmGroup;

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.35, 0.75, 0);
    torsoGroup.add(rightArmGroup);
    rightArmGroupRef.current = rightArmGroup;

    // Deltoids
    const deltGeom = new THREE.SphereGeometry(0.11, 16, 16);
    deltGeom.scale(0.9, 1.2, 0.9);
    addMuscleMeshToGroup('anterior_deltoid', deltGeom, leftArmGroup, [0, 0, 0.04]);
    addMuscleMeshToGroup('anterior_deltoid', deltGeom, rightArmGroup, [0, 0, 0.04]);

    addMuscleMeshToGroup('lateral_deltoid', deltGeom, leftArmGroup, [-0.05, -0.02, 0]);
    addMuscleMeshToGroup('lateral_deltoid', deltGeom, rightArmGroup, [0.05, -0.02, 0]);

    addMuscleMeshToGroup('posterior_deltoid', deltGeom, leftArmGroup, [0, 0, -0.04]);
    addMuscleMeshToGroup('posterior_deltoid', deltGeom, rightArmGroup, [0, 0, -0.04]);

    // Biceps & Triceps on Upper Arm
    const bicepGeom = new THREE.CylinderGeometry(0.075, 0.065, 0.28, 16);
    addMuscleMeshToGroup('biceps_brachii', bicepGeom, leftArmGroup, [0, -0.2, 0.02]);
    addMuscleMeshToGroup('biceps_brachii', bicepGeom, rightArmGroup, [0, -0.2, 0.02]);

    const tricepGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.3, 16);
    addMuscleMeshToGroup('triceps_brachii', tricepGeom, leftArmGroup, [0, -0.2, -0.03]);
    addMuscleMeshToGroup('triceps_brachii', tricepGeom, rightArmGroup, [0, -0.2, -0.03]);

    // Forearms (Hinge at Elbow)
    const leftForearmGroup = new THREE.Group();
    leftForearmGroup.position.set(0, -0.36, 0);
    leftArmGroup.add(leftForearmGroup);
    leftForearmGroupRef.current = leftForearmGroup;

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.set(0, -0.36, 0);
    rightArmGroup.add(rightForearmGroup);
    rightForearmGroupRef.current = rightForearmGroup;

    const forearmGeom = new THREE.CylinderGeometry(0.065, 0.05, 0.3, 16);
    addMuscleMeshToGroup('forearms', forearmGeom, leftForearmGroup, [0, -0.15, 0]);
    addMuscleMeshToGroup('forearms', forearmGeom, rightForearmGroup, [0, -0.15, 0]);

    // LEGS & LOWER BODY
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.16, 0.1, 0);
    bodyRoot.add(leftLegGroup);
    leftLegGroupRef.current = leftLegGroup;

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.16, 0.1, 0);
    bodyRoot.add(rightLegGroup);
    rightLegGroupRef.current = rightLegGroup;

    // Quads & Hamstrings
    const quadGeom = new THREE.CylinderGeometry(0.14, 0.1, 0.52, 16);
    quadGeom.scale(1, 1, 0.9);
    addMuscleMeshToGroup('quadriceps', quadGeom, leftLegGroup, [0, -0.26, 0.03]);
    addMuscleMeshToGroup('quadriceps', quadGeom, rightLegGroup, [0, -0.26, 0.03]);

    const hamstringGeom = new THREE.CylinderGeometry(0.13, 0.09, 0.5, 16);
    hamstringGeom.scale(0.95, 1, 0.85);
    addMuscleMeshToGroup('hamstrings', hamstringGeom, leftLegGroup, [0, -0.26, -0.05]);
    addMuscleMeshToGroup('hamstrings', hamstringGeom, rightLegGroup, [0, -0.26, -0.05]);

    // Lower Leg / Shins (Knee Hinge)
    const leftShinGroup = new THREE.Group();
    leftShinGroup.position.set(0, -0.54, 0);
    leftLegGroup.add(leftShinGroup);
    leftShinGroupRef.current = leftShinGroup;

    const rightShinGroup = new THREE.Group();
    rightShinGroup.position.set(0, -0.54, 0);
    rightLegGroup.add(rightShinGroup);
    rightShinGroupRef.current = rightShinGroup;

    const calfGeom = new THREE.CylinderGeometry(0.1, 0.065, 0.5, 16);
    addMuscleMeshToGroup('gastrocnemius_soleus', calfGeom, leftShinGroup, [0, -0.25, -0.03]);
    addMuscleMeshToGroup('gastrocnemius_soleus', calfGeom, rightShinGroup, [0, -0.25, -0.03]);

    const tibialisGeom = new THREE.CylinderGeometry(0.055, 0.04, 0.48, 12);
    addMuscleMeshToGroup('tibialis_anterior', tibialisGeom, leftShinGroup, [0, -0.25, 0.04]);
    addMuscleMeshToGroup('tibialis_anterior', tibialisGeom, rightShinGroup, [0, -0.25, 0.04]);

    // EQUIPMENT ATTACHMENT
    const equipmentGroup = new THREE.Group();
    bodyRoot.add(equipmentGroup);
    equipmentGroupRef.current = equipmentGroup;

    if (simulationData.equipmentType === 'barbell') {
      const barGeom = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 16);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      const barMesh = new THREE.Mesh(barGeom, barMat);
      barMesh.rotation.z = Math.PI / 2;

      const plateGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24);
      const plateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
      const leftPlate = new THREE.Mesh(plateGeom, plateMat);
      leftPlate.rotation.z = Math.PI / 2;
      leftPlate.position.x = -0.75;
      const rightPlate = new THREE.Mesh(plateGeom, plateMat);
      rightPlate.rotation.z = Math.PI / 2;
      rightPlate.position.x = 0.75;

      equipmentGroup.add(barMesh);
      equipmentGroup.add(leftPlate);
      equipmentGroup.add(rightPlate);
    } else if (simulationData.equipmentType === 'pullup_bar') {
      const pullupBarGeom = new THREE.CylinderGeometry(0.03, 0.03, 2.0, 16);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
      const pBar = new THREE.Mesh(pullupBarGeom, barMat);
      pBar.rotation.z = Math.PI / 2;
      pBar.position.y = 1.9;
      scene.add(pBar);
    } else if (simulationData.equipmentType === 'heavy_bag') {
      const bagGeom = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 24);
      const bagMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      const bagMesh = new THREE.Mesh(bagGeom, bagMat);
      bagMesh.position.set(0, 0.3, 0.7);
      scene.add(bagMesh);
    }

    muscleMeshesMapRef.current = muscleMap;

    // Direct Canvas Orbit & Drag Listeners
    let isPointerDown = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isPointerDown) {
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        bodyRoot.rotation.y += deltaX * 0.008;
        bodyRoot.rotation.x = Math.max(-0.6, Math.min(0.6, bodyRoot.rotation.x + deltaY * 0.005));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onPointerUp = () => {
      isPointerDown = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    // Animation & Kinematics Engine
    let lastFrameTime = performance.now();
    let currentT = 0;

    const animateKinematics = (timestamp: number) => {
      animationFrameRef.current = requestAnimationFrame(animateKinematics);
      const deltaSec = (timestamp - lastFrameTime) * 0.001;
      lastFrameTime = timestamp;

      if (isPlaying) {
        currentT = (currentT + (deltaSec / simulationData.cadenceSeconds) * simSpeed) % 1.0;
        setSimProgress(currentT);
      }

      // KINEMATIC SOLVER BASED ON EXERCISE TYPE
      const progress = isPlaying ? currentT : simProgress;
      const kType = simulationData.kinematicType;

      // Smooth cosine oscillation (0 = top/start, 1 = bottom/peak inflection)
      // 0.0 -> 0.5: moves 0 -> 1; 0.5 -> 1.0: moves 1 -> 0
      const phaseArc = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);

      if (bodyRootRef.current && torsoGroupRef.current) {
        // RESET DEFAULT TRANSFORMATIONS
        bodyRootRef.current.position.set(0, 0, 0);
        torsoGroupRef.current.rotation.set(0, 0, 0);
        if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(0, 0, 0);
        if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(0, 0, 0);
        if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.set(0, 0, 0);
        if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.set(0, 0, 0);
        if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.set(0, 0, 0);
        if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.set(0, 0, 0);
        if (leftShinGroupRef.current) leftShinGroupRef.current.rotation.set(0, 0, 0);
        if (rightShinGroupRef.current) rightShinGroupRef.current.rotation.set(0, 0, 0);

        if (kType === 'bench_press') {
          // Supine on bench
          bodyRootRef.current.rotation.x = -Math.PI / 2;
          bodyRootRef.current.position.set(0, -0.2, 0);

          // Arms lower and press
          const armAngle = 0.2 + phaseArc * 0.9;
          const forearmAngle = -0.1 - phaseArc * 0.85;

          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(armAngle, 0, -0.35);
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(armAngle, 0, 0.35);
          if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.x = forearmAngle;
          if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.x = forearmAngle;

          if (equipmentGroupRef.current) {
            equipmentGroupRef.current.position.set(0, 0.95 - phaseArc * 0.32, 0.22);
          }
        } else if (kType === 'squat') {
          // Squat descent & drive
          const hipDrop = phaseArc * 0.42;
          bodyRootRef.current.position.y = -hipDrop;

          // Torso forward lean
          torsoGroupRef.current.rotation.x = phaseArc * 0.45;

          // Knee and Hip flexion
          const thighAngle = -phaseArc * 1.35;
          const shinAngle = phaseArc * 1.45;

          if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.set(thighAngle, 0, -0.15);
          if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.set(thighAngle, 0, 0.15);
          if (leftShinGroupRef.current) leftShinGroupRef.current.rotation.x = shinAngle;
          if (rightShinGroupRef.current) rightShinGroupRef.current.rotation.x = shinAngle;

          // Upper body bar position
          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(-0.6, 0, -0.4);
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(-0.6, 0, 0.4);
          if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.x = 1.2;
          if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.x = 1.2;

          if (equipmentGroupRef.current) {
            equipmentGroupRef.current.position.set(0, 1.05, -0.06);
          }
        } else if (kType === 'romanian_deadlift') {
          // Hip hinge
          const torsoTilt = phaseArc * 1.25;
          torsoGroupRef.current.rotation.x = torsoTilt;

          // Hips push back
          bodyRootRef.current.position.z = -phaseArc * 0.25;
          bodyRootRef.current.position.y = -phaseArc * 0.12;

          // Slight knee unlock (15 deg)
          if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.x = -phaseArc * 0.25;
          if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.x = -phaseArc * 0.25;
          if (leftShinGroupRef.current) leftShinGroupRef.current.rotation.x = phaseArc * 0.25;
          if (rightShinGroupRef.current) rightShinGroupRef.current.rotation.x = phaseArc * 0.25;

          // Arms hang down holding bar
          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = -phaseArc * 1.1;
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.x = -phaseArc * 1.1;

          if (equipmentGroupRef.current) {
            equipmentGroupRef.current.position.set(0, 0.25 - phaseArc * 0.55, 0.18 + phaseArc * 0.05);
          }
        } else if (kType === 'overhead_press') {
          // Standing vertical press
          const pressArc = phaseArc; // 0 = rack, 1 = overhead
          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(-pressArc * 2.8, 0, -0.2);
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(-pressArc * 2.8, 0, 0.2);
          if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.x = (1 - pressArc) * 1.4;
          if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.x = (1 - pressArc) * 1.4;

          if (equipmentGroupRef.current) {
            equipmentGroupRef.current.position.set(0, 1.0 + pressArc * 0.65, 0.12 - pressArc * 0.1);
          }
        } else if (kType === 'pullup') {
          // Pull-up ascent & deadhang
          const pullArc = phaseArc;
          bodyRootRef.current.position.y = pullArc * 0.55;

          // Elbow drive
          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(-2.6 + pullArc * 1.8, 0, -0.6 + pullArc * 0.3);
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(-2.6 + pullArc * 1.8, 0, 0.6 - pullArc * 0.3);
          if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.x = pullArc * 1.4;
          if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.x = pullArc * 1.4;
        } else if (kType === 'bent_over_row') {
          // Hinged torso
          torsoGroupRef.current.rotation.x = 0.85;

          // Rowing arms
          const rowPull = phaseArc;
          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(-0.85 + rowPull * 0.8, 0, -0.2);
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(-0.85 + rowPull * 0.8, 0, 0.2);
          if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.x = rowPull * 1.3;
          if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.x = rowPull * 1.3;

          if (equipmentGroupRef.current) {
            equipmentGroupRef.current.position.set(0, 0.15 + rowPull * 0.25, 0.25 - rowPull * 0.15);
          }
        } else if (kType === 'shadowboxing_cross') {
          // Boxing kinetic chain rotation
          const strikeArc = phaseArc;
          torsoGroupRef.current.rotation.y = strikeArc * 0.7; // Torso twists 40 deg
          bodyRootRef.current.rotation.y = strikeArc * 0.3;

          // Lead hand guard
          if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.set(-0.8, 0.4, -0.2);
          if (leftForearmGroupRef.current) leftForearmGroupRef.current.rotation.x = 1.6;

          // Rear Cross extension
          if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.set(-strikeArc * 1.4, 0, 0.1);
          if (rightForearmGroupRef.current) rightForearmGroupRef.current.rotation.x = (1 - strikeArc) * 1.5;
        } else {
          // Generic compound motion
          const bounce = Math.sin(progress * Math.PI * 2) * 0.05;
          bodyRootRef.current.position.y = bounce;
        }
      }

      // REAL-TIME MUSCLE GLOW & EMG TENSION HEATMAP
      if (muscleMap) {
        muscleMap.forEach((meshes, mId) => {
          const isPrimary = exercise.primaryMuscles.includes(mId);
          const isSecondary = exercise.secondaryMuscles.includes(mId);
          const curve = simulationData.muscleRecruitment.find((c) => c.muscleId === mId);

          let tensionLevel = 0.3;
          if (curve) {
            if (progress <= 0.5) {
              const factor = progress / 0.5;
              tensionLevel = (curve.eccentricTension + (curve.inflectionTension - curve.eccentricTension) * factor) / 100;
            } else {
              const factor = (progress - 0.5) / 0.5;
              tensionLevel = (curve.inflectionTension - (curve.inflectionTension - curve.concentricTension) * (1 - factor)) / 100;
            }
          }

          meshes.forEach((mesh) => {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (isPrimary) {
              mat.color.setHex(0xd4ff00);
              mat.emissive.setHex(0xa8d900);
              mat.emissiveIntensity = 0.3 + tensionLevel * 0.85;
            } else if (isSecondary) {
              mat.color.setHex(0x84cc16);
              mat.emissive.setHex(0x65a30d);
              mat.emissiveIntensity = 0.2 + tensionLevel * 0.5;
            } else {
              mat.color.setHex(0x711515);
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
            }
          });
        });
      }

      renderer.render(scene, camera);
    };

    animationFrameRef.current = requestAnimationFrame(animateKinematics);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [exercise, simulationData, isPlaying, simSpeed, simProgress]);

  // View Angle Switcher
  const handleSetViewAngle = (angle: '3d' | 'front' | 'side' | 'back') => {
    setViewAngle(angle);
    if (!bodyRootRef.current || !cameraRef.current) return;
    const body = bodyRootRef.current;
    const cam = cameraRef.current;

    if (angle === 'front') {
      body.rotation.set(0, 0, 0);
      cam.position.set(0, 0.2, 4.2);
    } else if (angle === 'side') {
      body.rotation.set(0, -Math.PI / 2, 0);
      cam.position.set(0, 0.2, 4.2);
    } else if (angle === 'back') {
      body.rotation.set(0, Math.PI, 0);
      cam.position.set(0, 0.2, 4.2);
    } else {
      body.rotation.set(0.15, -0.4, 0);
      cam.position.set(0, 0.2, 4.4);
    }
  };

  return (
    <div
      id="exercise-anatomy-simulator-container"
      className="w-full flex flex-col space-y-4 bg-[#141414] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl"
    >
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4FF00] uppercase tracking-wider mb-0.5">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Real-Time Biomechanical Anatomy Simulation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {simulationData.movementName}
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
            <span>Plane: {simulationData.primaryPlane}</span>
            <span>•</span>
            <span>Tempo: {simulationData.tempo}</span>
          </div>
        </div>

        {/* Action / Expand */}
        <div className="flex items-center gap-2">
          {onToggleExpand && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition"
              title={isExpanded ? 'Minimize' : 'Expand full screen'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas Box */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl flex items-center justify-center select-none">
        <div
          ref={mountRef}
          className="w-full cursor-grab active:cursor-grabbing touch-none"
          style={{ height }}
        />

        {/* Live Phase HUD Overlay */}
        <div className="absolute top-3 left-3 bg-[#141414]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 text-xs shadow-xl space-y-1 max-w-[260px] sm:max-w-xs pointer-events-none">
          <div className="flex items-center justify-between gap-2">
            <span className={`font-black font-mono uppercase tracking-wider ${currentPhaseInfo.color} flex items-center gap-1.5`}>
              <Zap className="w-3.5 h-3.5" />
              {currentPhaseInfo.phase}
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-tight">
            {currentPhaseInfo.cue}
          </p>
        </div>

        {/* Angle Presets */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#141414]/90 backdrop-blur-md p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => handleSetViewAngle('3d')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
              viewAngle === '3d' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            3D Orbit
          </button>
          <button
            type="button"
            onClick={() => handleSetViewAngle('front')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
              viewAngle === 'front' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => handleSetViewAngle('side')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
              viewAngle === 'side' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Side
          </button>
          <button
            type="button"
            onClick={() => handleSetViewAngle('back')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
              viewAngle === 'back' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Back
          </button>
        </div>

        {/* Orbit Helper */}
        <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] text-zinc-500 font-mono bg-[#0A0A0A]/80 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#D4FF00]" />
          <span>Drag canvas to rotate 360° • Scrub timeline below</span>
        </div>
      </div>

      {/* Kinetic Scrubbing & Playback Controller */}
      <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          {/* Play/Pause & Speed */}
          <div className="flex items-center gap-2">
            <button
              id="btn-play-pause-sim"
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="p-2.5 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-black font-black transition shadow-lg shadow-[#D4FF00]/10 flex items-center gap-1.5 text-xs"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'SIMULATE'}</span>
            </button>

            {/* Speed Presets */}
            <div className="flex bg-[#141414] rounded-xl p-0.5 border border-white/10 text-xs">
              {[0.5, 1.0, 2.0].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSimSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                    simSpeed === spd ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Rep Progress Indicator */}
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block">Rep Cycle Arc</span>
            <span className="text-xs font-bold font-mono text-[#D4FF00]">
              {Math.round(simProgress * 100)}% Completed
            </span>
          </div>
        </div>

        {/* Scrubbing Slider */}
        <div className="space-y-1">
          <input
            id="sim-scrubber-slider"
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={simProgress}
            onChange={(e) => {
              setIsPlaying(false);
              setSimProgress(parseFloat(e.target.value));
            }}
            className="w-full h-2 bg-[#1e1e1e] rounded-lg appearance-none cursor-pointer accent-[#D4FF00]"
          />
          <div className="flex justify-between text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
            <span>0% (Setup)</span>
            <span>45% (Eccentric Load)</span>
            <span>60% (Inflection)</span>
            <span>100% (Concentric Lockout)</span>
          </div>
        </div>
      </div>

      {/* Live Muscular Fiber Recruitment & EMG Heatmap */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>Muscular Fiber Recruitment Heatmap (Real-Time EMG)</span>
          </h4>
          <span className="text-[10px] text-zinc-500 font-mono">Dynamic %</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {liveTensions.map((muscle) => (
            <div
              key={muscle.muscleId}
              className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white capitalize flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      muscle.role === 'primary'
                        ? 'bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]'
                        : 'bg-lime-400'
                    }`}
                  />
                  {muscle.name}
                </span>
                <span className="font-mono font-bold text-[#D4FF00] text-xs">
                  {muscle.currentTension}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-75 rounded-full ${
                    muscle.role === 'primary'
                      ? 'bg-gradient-to-r from-lime-500 to-[#D4FF00]'
                      : 'bg-zinc-400'
                  }`}
                  style={{ width: `${muscle.currentTension}%` }}
                />
              </div>

              <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-mono">
                <span>{muscle.role}</span>
                <span>{muscle.role === 'primary' ? 'Prime Mover' : 'Stabilizer / Synergist'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biomechanical Joint Highlights */}
      <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
        <h4 className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#D4FF00]" />
          <span>Biomechanical & Kinetic Notes</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-zinc-400 text-xs">
          {simulationData.biomechanicsHighlights.map((highlight, idx) => (
            <li key={idx}>{highlight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
