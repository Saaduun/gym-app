import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MuscleId, AnatomyMuscleDetail } from '../types';
import { ANATOMY_MUSCLES } from '../data/anatomyData';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  Touchpad,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface Anatomy3DViewerProps {
  highlightedMuscles?: MuscleId[];
  selectedMuscleId?: MuscleId | null;
  onSelectMuscle?: (muscle: AnatomyMuscleDetail | null) => void;
  viewMode?: 'muscular' | 'skeletal' | 'hybrid';
  layerMode?: 'superficial' | 'deep';
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
}

export const Anatomy3DViewer: React.FC<Anatomy3DViewerProps> = ({
  highlightedMuscles = [],
  selectedMuscleId = null,
  onSelectMuscle,
  viewMode: initialViewMode = 'muscular',
  layerMode: initialLayerMode = 'superficial',
  height = '460px',
  showControls = true,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const muscleMeshesRef = useRef<Map<MuscleId, THREE.Mesh[]>>(new Map());
  const skeletalMeshesRef = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [viewMode, setViewMode] = useState<'muscular' | 'skeletal' | 'hybrid'>(initialViewMode);
  const [layerMode, setLayerMode] = useState<'superficial' | 'deep'>(initialLayerMode);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [hoveredMuscleName, setHoveredMuscleName] = useState<string | null>(null);
  const [lastSelectedName, setLastSelectedName] = useState<string | null>(null);
  const [touchActive, setTouchActive] = useState<boolean>(false);

  // Sync internal state with props
  useEffect(() => {
    if (initialViewMode) setViewMode(initialViewMode);
  }, [initialViewMode]);

  useEffect(() => {
    if (initialLayerMode) setLayerMode(initialLayerMode);
  }, [initialLayerMode]);

  useEffect(() => {
    if (selectedMuscleId && ANATOMY_MUSCLES[selectedMuscleId]) {
      setLastSelectedName(ANATOMY_MUSCLES[selectedMuscleId].name);
    }
  }, [selectedMuscleId]);

  // Main Three.js Scene Setup & Direct WebGL Canvas Pointer Listeners
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const heightPx = container.clientHeight || 460;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0a0a); // Deep High Density Canvas
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.35, 4.3);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x71717a, 0.85);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4ff00, 0.9);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Ground Grid
    const grid = new THREE.GridHelper(10, 20, 0x27272a, 0x18181b);
    grid.position.y = -2.1;
    scene.add(grid);

    // 5. Anatomical Body Group
    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    const muscleMap = new Map<MuscleId, THREE.Mesh[]>();
    const skeletalList: THREE.Mesh[] = [];

    const createMuscleMesh = (
      muscleId: MuscleId,
      geometry: THREE.BufferGeometry,
      position: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1]
    ) => {
      const isDeep = ANATOMY_MUSCLES[muscleId]?.layer === 'deep';
      const baseColor = isDeep ? 0x7f1d1d : 0x991b1b;

      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.35,
        metalness: 0.15,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.scale.set(...scale);
      mesh.userData = { muscleId, isMuscle: true, isDeep };

      bodyGroup.add(mesh);

      const existing = muscleMap.get(muscleId) || [];
      existing.push(mesh);
      muscleMap.set(muscleId, existing);
      return mesh;
    };

    const createBoneMesh = (
      geometry: THREE.BufferGeometry,
      position: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1]
    ) => {
      const boneMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        roughness: 0.5,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geometry, boneMaterial);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.scale.set(...scale);
      mesh.userData = { isBone: true };
      bodyGroup.add(mesh);
      skeletalList.push(mesh);
      return mesh;
    };

    // GEOMETRIES (Surface & Deep Anatomical Structures)
    const skullGeom = new THREE.SphereGeometry(0.24, 24, 24);
    skullGeom.scale(0.85, 1.1, 0.95);
    createBoneMesh(skullGeom, [0, 1.45, 0]);

    const neckGeom = new THREE.CylinderGeometry(0.12, 0.16, 0.22, 16);
    createMuscleMesh('neck_extensors', neckGeom, [0, 1.25, -0.02]);

    const trapGeom = new THREE.ConeGeometry(0.35, 0.45, 8);
    trapGeom.scale(1.2, 0.8, 0.4);
    createMuscleMesh('trapezius', trapGeom, [0, 1.15, -0.08], [Math.PI, 0, 0]);

    const ribcageGeom = new THREE.CylinderGeometry(0.28, 0.22, 0.55, 16);
    ribcageGeom.scale(1.15, 1, 0.7);
    createBoneMesh(ribcageGeom, [0, 0.85, 0]);

    const spineGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.95, 12);
    createBoneMesh(spineGeom, [0, 0.65, -0.1]);

    const pelvisGeom = new THREE.CylinderGeometry(0.28, 0.24, 0.25, 16);
    pelvisGeom.scale(1.1, 1, 0.75);
    createBoneMesh(pelvisGeom, [0, 0.2, 0]);

    // Surface Chest
    const pecGeom = new THREE.BoxGeometry(0.22, 0.2, 0.12);
    createMuscleMesh('pectoralis_major', pecGeom, [-0.14, 0.92, 0.12], [0, -0.15, 0.05]);
    createMuscleMesh('pectoralis_major', pecGeom, [0.14, 0.92, 0.12], [0, 0.15, -0.05]);

    // Deep Chest
    const pecMinorGeom = new THREE.BoxGeometry(0.16, 0.14, 0.06);
    createMuscleMesh('pectoralis_minor', pecMinorGeom, [-0.13, 0.94, 0.07], [0, -0.1, 0]);
    createMuscleMesh('pectoralis_minor', pecMinorGeom, [0.13, 0.94, 0.07], [0, 0.1, 0]);

    // Surface Shoulders
    const antDeltGeom = new THREE.SphereGeometry(0.11, 16, 16);
    antDeltGeom.scale(0.9, 1.2, 0.9);
    createMuscleMesh('anterior_deltoid', antDeltGeom, [-0.36, 1.02, 0.06]);
    createMuscleMesh('anterior_deltoid', antDeltGeom, [0.36, 1.02, 0.06]);

    const latDeltGeom = new THREE.SphereGeometry(0.12, 16, 16);
    latDeltGeom.scale(0.8, 1.3, 0.9);
    createMuscleMesh('lateral_deltoid', latDeltGeom, [-0.42, 1.0, 0]);
    createMuscleMesh('lateral_deltoid', latDeltGeom, [0.42, 1.0, 0]);

    const postDeltGeom = new THREE.SphereGeometry(0.11, 16, 16);
    postDeltGeom.scale(0.9, 1.2, 0.9);
    createMuscleMesh('posterior_deltoid', postDeltGeom, [-0.37, 1.01, -0.07]);
    createMuscleMesh('posterior_deltoid', postDeltGeom, [0.37, 1.01, -0.07]);

    // Deep Rotator Cuff
    const rotatorGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12);
    createMuscleMesh('rotator_cuff', rotatorGeom, [-0.33, 1.04, -0.02], [0, 0, Math.PI / 4]);
    createMuscleMesh('rotator_cuff', rotatorGeom, [0.33, 1.04, -0.02], [0, 0, -Math.PI / 4]);

    // Back
    const latGeom = new THREE.BoxGeometry(0.18, 0.42, 0.1);
    createMuscleMesh('latissimus_dorsi', latGeom, [-0.18, 0.72, -0.12], [0, -0.2, -0.1]);
    createMuscleMesh('latissimus_dorsi', latGeom, [0.18, 0.72, -0.12], [0, 0.2, 0.1]);

    const rhomboidGeom = new THREE.BoxGeometry(0.2, 0.22, 0.06);
    createMuscleMesh('rhomboids', rhomboidGeom, [0, 0.95, -0.11]);

    const erectorGeom = new THREE.CylinderGeometry(0.06, 0.07, 0.6, 12);
    createMuscleMesh('erector_spinae', erectorGeom, [-0.07, 0.58, -0.12]);
    createMuscleMesh('erector_spinae', erectorGeom, [0.07, 0.58, -0.12]);

    // Arms
    const bicepGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.32, 16);
    createMuscleMesh('biceps_brachii', bicepGeom, [-0.44, 0.76, 0.03], [0, 0, 0.05]);
    createMuscleMesh('biceps_brachii', bicepGeom, [0.44, 0.76, 0.03], [0, 0, -0.05]);

    const tricepGeom = new THREE.CylinderGeometry(0.085, 0.075, 0.34, 16);
    createMuscleMesh('triceps_brachii', tricepGeom, [-0.45, 0.76, -0.04], [0, 0, 0.05]);
    createMuscleMesh('triceps_brachii', tricepGeom, [0.45, 0.76, -0.04], [0, 0, -0.05]);

    const forearmGeom = new THREE.CylinderGeometry(0.075, 0.055, 0.35, 16);
    createMuscleMesh('forearms', forearmGeom, [-0.48, 0.42, 0], [0, 0, 0.1]);
    createMuscleMesh('forearms', forearmGeom, [0.48, 0.42, 0], [0, 0, -0.1]);

    // Core
    const absUpperGeom = new THREE.BoxGeometry(0.18, 0.14, 0.08);
    createMuscleMesh('rectus_abdominis', absUpperGeom, [0, 0.72, 0.12]);
    const absMidGeom = new THREE.BoxGeometry(0.18, 0.14, 0.08);
    createMuscleMesh('rectus_abdominis', absMidGeom, [0, 0.56, 0.12]);
    const absLowerGeom = new THREE.BoxGeometry(0.18, 0.14, 0.08);
    createMuscleMesh('rectus_abdominis', absLowerGeom, [0, 0.4, 0.12]);

    const obliqueGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.38, 12);
    obliqueGeom.scale(0.8, 1, 0.6);
    createMuscleMesh('obliques', obliqueGeom, [-0.22, 0.55, 0.05], [0, 0, -0.15]);
    createMuscleMesh('obliques', obliqueGeom, [0.22, 0.55, 0.05], [0, 0, 0.15]);

    const transverseGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.32, 16);
    transverseGeom.scale(0.9, 1, 0.65);
    createMuscleMesh('transverse_abdominis', transverseGeom, [0, 0.52, 0.02]);

    // Lower Body
    const gluteMaxGeom = new THREE.SphereGeometry(0.2, 16, 16);
    gluteMaxGeom.scale(0.9, 1.1, 0.85);
    createMuscleMesh('gluteus_maximus', gluteMaxGeom, [-0.15, 0.14, -0.12], [0.2, 0, 0]);
    createMuscleMesh('gluteus_maximus', gluteMaxGeom, [0.15, 0.14, -0.12], [0.2, 0, 0]);

    const gluteMedGeom = new THREE.SphereGeometry(0.14, 14, 14);
    gluteMedGeom.scale(0.7, 1.2, 0.8);
    createMuscleMesh('gluteus_medius', gluteMedGeom, [-0.26, 0.22, -0.04], [0, 0, -0.2]);
    createMuscleMesh('gluteus_medius', gluteMedGeom, [0.26, 0.22, -0.04], [0, 0, 0.2]);

    const hipFlexorGeom = new THREE.CylinderGeometry(0.08, 0.07, 0.26, 12);
    createMuscleMesh('hip_flexors', hipFlexorGeom, [-0.14, 0.2, 0.08], [0.2, 0, -0.1]);
    createMuscleMesh('hip_flexors', hipFlexorGeom, [0.14, 0.2, 0.08], [0.2, 0, 0.1]);

    const quadGeom = new THREE.CylinderGeometry(0.15, 0.11, 0.58, 16);
    quadGeom.scale(1, 1, 0.9);
    createMuscleMesh('quadriceps', quadGeom, [-0.17, -0.25, 0.04], [0.05, 0, -0.04]);
    createMuscleMesh('quadriceps', quadGeom, [0.17, -0.25, 0.04], [0.05, 0, 0.04]);

    const hamstringGeom = new THREE.CylinderGeometry(0.14, 0.1, 0.56, 16);
    hamstringGeom.scale(0.95, 1, 0.85);
    createMuscleMesh('hamstrings', hamstringGeom, [-0.17, -0.25, -0.06], [-0.05, 0, -0.04]);
    createMuscleMesh('hamstrings', hamstringGeom, [0.17, -0.25, -0.06], [-0.05, 0, 0.04]);

    const calfGeom = new THREE.CylinderGeometry(0.11, 0.07, 0.54, 16);
    calfGeom.scale(1, 1, 0.9);
    createMuscleMesh('gastrocnemius_soleus', calfGeom, [-0.17, -0.88, -0.04], [0, 0, 0]);
    createMuscleMesh('gastrocnemius_soleus', calfGeom, [0.17, -0.88, -0.04], [0, 0, 0]);

    const tibialisGeom = new THREE.CylinderGeometry(0.06, 0.045, 0.5, 12);
    createMuscleMesh('tibialis_anterior', tibialisGeom, [-0.16, -0.88, 0.05], [0, 0, 0]);
    createMuscleMesh('tibialis_anterior', tibialisGeom, [0.16, -0.88, 0.05], [0, 0, 0]);

    muscleMeshesRef.current = muscleMap;
    skeletalMeshesRef.current = skeletalList;

    // 6. Direct Pointer Event Handling on the Canvas
    let isPointerDown = false;
    let pointerStartPos = { x: 0, y: 0 };
    let pointerStartTime = 0;
    let lastPointerPos = { x: 0, y: 0 };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const getNormalizedPointerPos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
      };
    };

    const performRaycastHit = (clientX: number, clientY: number) => {
      const pos = getNormalizedPointerPos(clientX, clientY);
      pointer.x = pos.x;
      pointer.y = pos.y;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(bodyGroup.children);
      const hit = intersects.find((i) => i.object.userData?.isMuscle);

      if (hit && hit.object.userData?.muscleId) {
        const mId = hit.object.userData.muscleId as MuscleId;
        return ANATOMY_MUSCLES[mId] || null;
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isPointerDown = true;
      setTouchActive(true);
      pointerStartPos = { x: e.clientX, y: e.clientY };
      lastPointerPos = { x: e.clientX, y: e.clientY };
      pointerStartTime = Date.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isPointerDown && interactive) {
        const deltaX = e.clientX - lastPointerPos.x;
        const deltaY = e.clientY - lastPointerPos.y;

        bodyGroup.rotation.y += deltaX * 0.008;
        bodyGroup.rotation.x = Math.max(-0.6, Math.min(0.6, bodyGroup.rotation.x + deltaY * 0.005));

        lastPointerPos = { x: e.clientX, y: e.clientY };
      } else {
        const hitMuscle = performRaycastHit(e.clientX, e.clientY);
        if (hitMuscle) {
          setHoveredMuscleName(hitMuscle.name);
        } else {
          setHoveredMuscleName(null);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isPointerDown && interactive) {
        const totalDeltaX = Math.abs(e.clientX - pointerStartPos.x);
        const totalDeltaY = Math.abs(e.clientY - pointerStartPos.y);
        const duration = Date.now() - pointerStartTime;

        // If tap or click had small movement (< 15px) or was quick (< 400ms), trigger selection
        if (totalDeltaX < 15 && totalDeltaY < 15 && duration < 400) {
          const hitMuscle = performRaycastHit(e.clientX, e.clientY);
          if (hitMuscle) {
            setLastSelectedName(hitMuscle.name);
            if (onSelectMuscle) {
              onSelectMuscle(hitMuscle);
            }
          }
        }
      }
      isPointerDown = false;
    };

    const onPointerCancel = () => {
      isPointerDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.z = Math.max(2.0, Math.min(6.5, camera.position.z + e.deltaY * 0.003));
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop (using standard performance timestamp without deprecated THREE.Clock)
    const startTime = performance.now();
    const animate = (timestamp: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = (timestamp - startTime) * 0.001;

      if (isAutoRotating) {
        bodyGroup.rotation.y += 0.006;
      }

      const breathScale = 1 + Math.sin(elapsedTime * 1.5) * 0.01;
      bodyGroup.scale.set(breathScale, 1, breathScale);

      renderer.render(scene, camera);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

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
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [interactive, onSelectMuscle]);

  // Update Meshes on highlight or selection changes
  useEffect(() => {
    const muscleMap = muscleMeshesRef.current;
    const skeletalList = skeletalMeshesRef.current;
    if (!muscleMap) return;

    skeletalList.forEach((bone) => {
      bone.visible = viewMode === 'skeletal' || viewMode === 'hybrid';
      const mat = bone.material as THREE.MeshStandardMaterial;
      if (viewMode === 'hybrid') {
        mat.transparent = true;
        mat.opacity = 0.45;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
      }
    });

    muscleMap.forEach((meshes, mId) => {
      const isTargeted = highlightedMuscles.includes(mId);
      const isSelected = selectedMuscleId === mId;
      const detail = ANATOMY_MUSCLES[mId];
      const isDeep = detail?.layer === 'deep';

      meshes.forEach((mesh) => {
        if (viewMode === 'skeletal') {
          mesh.visible = false;
          return;
        }

        if (layerMode === 'superficial' && isDeep && !isTargeted && !isSelected) {
          mesh.visible = false;
        } else {
          mesh.visible = true;
        }

        const mat = mesh.material as THREE.MeshStandardMaterial;

        if (isSelected) {
          mat.color.setHex(0xd4ff00); // Electric Volt
          mat.emissive.setHex(0xa8d900);
          mat.emissiveIntensity = 0.95;
          mat.roughness = 0.2;
        } else if (isTargeted) {
          mat.color.setHex(0xd4ff00);
          mat.emissive.setHex(0x84cc16);
          mat.emissiveIntensity = 0.75;
          mat.roughness = 0.25;
        } else {
          const defaultHex = isDeep ? 0x7f1d1d : 0x991b1b;
          mat.color.setHex(defaultHex);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
          mat.roughness = 0.35;
        }
      });
    });
  }, [highlightedMuscles, selectedMuscleId, viewMode, layerMode]);

  // Orbit & Camera helper handlers
  const handleRotate = (dir: 'left' | 'right' | 'up' | 'down') => {
    if (!bodyGroupRef.current) return;
    const body = bodyGroupRef.current;
    if (dir === 'left') body.rotation.y -= 0.3;
    if (dir === 'right') body.rotation.y += 0.3;
    if (dir === 'up') body.rotation.x = Math.max(-0.6, body.rotation.x - 0.2);
    if (dir === 'down') body.rotation.x = Math.min(0.6, body.rotation.x + 0.2);
  };

  const handleReset = () => {
    if (bodyGroupRef.current) {
      bodyGroupRef.current.rotation.set(0, 0, 0);
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0.35, 4.3);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    cam.position.z = direction === 'in' ? Math.max(2.0, cam.position.z - 0.5) : Math.min(6.5, cam.position.z + 0.5);
  };

  const handleQuickConnect = (muscleId: MuscleId) => {
    const detail = ANATOMY_MUSCLES[muscleId];
    if (detail) {
      setLastSelectedName(detail.name);
      if (onSelectMuscle) {
        onSelectMuscle(detail);
      }
    }
  };

  return (
    <div
      id="anatomy-3d-wrapper"
      className="w-full flex flex-col space-y-3"
    >
      {/* 3D Canvas Box */}
      <div
        id="anatomy-3d-container"
        className="relative w-full rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl flex items-center justify-center touch-none select-none"
      >
        <div
          ref={mountRef}
          className="w-full cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ height }}
        />

        {/* Surface Selection Indicator */}
        {lastSelectedName && (
          <div className="absolute top-3 left-3 pointer-events-none bg-[#141414]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#D4FF00]/50 text-xs font-bold text-white shadow-xl flex items-center gap-2 animate-fade-in">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]" />
            <span>
              Connected: <strong className="text-[#D4FF00]">{lastSelectedName}</strong>
            </span>
          </div>
        )}

        {/* Hover Muscle Tag */}
        {hoveredMuscleName && !lastSelectedName && (
          <div className="absolute top-3 left-3 pointer-events-none bg-[#141414]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D4FF00]/30 text-xs font-bold text-[#D4FF00] shadow-lg flex items-center gap-2 animate-fade-in">
            <Touchpad className="w-3.5 h-3.5 text-[#D4FF00]" />
            <span>Target: {hoveredMuscleName}</span>
          </div>
        )}

        {/* Top Right Model Status */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className="bg-[#141414]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[9px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-3 h-3 text-[#D4FF00]" />
            <span>3D Surface</span>
          </div>
        </div>

        {/* Interactive Orbit Overlay Helper */}
        <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] text-zinc-500 font-mono flex items-center gap-1 bg-[#0A0A0A]/80 px-2 py-1 rounded-md border border-white/5">
          <Touchpad className="w-3 h-3 text-[#D4FF00]" />
          <span>Drag to 360° rotate • Tap muscle to inspect</span>
        </div>

        {/* Floating Mini Directional Controls */}
        {showControls && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#141414]/95 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-xl">
            <button
              type="button"
              onClick={() => handleRotate('left')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition"
              title="Rotate Left"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleRotate('right')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition"
              title="Rotate Right"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Surface Quick-Connect Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] text-zinc-500 font-mono uppercase shrink-0">Connect Surface:</span>
        {[
          { id: 'pectoralis_major', label: 'Chest' },
          { id: 'anterior_deltoid', label: 'Shoulders' },
          { id: 'rectus_abdominis', label: 'Abs' },
          { id: 'latissimus_dorsi', label: 'Back' },
          { id: 'biceps_brachii', label: 'Biceps' },
          { id: 'quadriceps', label: 'Quads' },
          { id: 'hamstrings', label: 'Hamstrings' },
          { id: 'gluteus_maximus', label: 'Glutes' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleQuickConnect(item.id as MuscleId)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shrink-0 transition ${
              selectedMuscleId === item.id
                ? 'bg-[#D4FF00] text-black border-[#D4FF00]'
                : 'bg-[#141414] border-white/10 text-zinc-300 hover:text-white hover:border-[#D4FF00]/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Lower Toolbar: Modes, Layers, Zoom */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#141414] p-2 rounded-2xl border border-white/5 text-xs">
          {/* View Mode Toggle */}
          <div className="flex bg-[#0A0A0A] rounded-xl p-1 border border-white/5">
            <button
              id="btn-mode-muscular"
              type="button"
              onClick={() => setViewMode('muscular')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'muscular' ? 'bg-[#D4FF00] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Muscular
            </button>
            <button
              id="btn-mode-skeletal"
              type="button"
              onClick={() => setViewMode('skeletal')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'skeletal' ? 'bg-[#D4FF00] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Skeletal
            </button>
            <button
              id="btn-mode-hybrid"
              type="button"
              onClick={() => setViewMode('hybrid')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                viewMode === 'hybrid' ? 'bg-[#D4FF00] text-black shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Hybrid
            </button>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5">
            {/* Layer Toggle */}
            <button
              id="btn-toggle-layer"
              type="button"
              onClick={() => setLayerMode((prev) => (prev === 'superficial' ? 'deep' : 'superficial'))}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                layerMode === 'superficial'
                  ? 'bg-[#D4FF00]/15 border-[#D4FF00]/40 text-[#D4FF00]'
                  : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
              title="Toggle between Surface (Superficial) and Deep Stabilizer muscles"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{layerMode === 'superficial' ? 'Surface' : 'Deep Layer'}</span>
            </button>

            {/* Auto Rotate */}
            <button
              id="btn-auto-rotate"
              type="button"
              onClick={() => setIsAutoRotating((prev) => !prev)}
              className={`p-2 rounded-xl border transition ${
                isAutoRotating
                  ? 'bg-[#D4FF00]/20 border-[#D4FF00]/60 text-[#D4FF00]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
              title="Toggle 360° auto-rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
            </button>

            {/* Zoom In / Out */}
            <button
              id="btn-zoom-in"
              type="button"
              onClick={() => handleZoom('in')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-zoom-out"
              type="button"
              onClick={() => handleZoom('out')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
