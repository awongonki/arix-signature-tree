import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  OrbitControls,
  Environment,
  Float,
  ContactShadows,
} from "@react-three/drei";

// --- CONFIGURATION ---
const PALETTE = {
  emerald: "#046307",
  gold: "#FFD700",
  accent: "#bfa362",
};

const LEAF_COUNT = 1500;
const ORNAMENT_COUNT = 150;
const SCATTER_RADIUS = 15;
const TREE_HEIGHT = 12;
const TREE_RADIUS = 4.5;

// --- MATH HELPERS ---
const calculateTreePos = (index, total, isOrnament) => {
  const y = (index / total) * TREE_HEIGHT - TREE_HEIGHT / 2;
  const radiusAtHeight =
    TREE_RADIUS * (1 - (y + TREE_HEIGHT / 2) / TREE_HEIGHT);
  const angle = index * 2.39996; // Golden Angle
  const noise = isOrnament ? 0.2 : 0.5;

  return new THREE.Vector3(
    Math.cos(angle) * radiusAtHeight + (Math.random() - 0.5) * noise,
    y,
    Math.sin(angle) * radiusAtHeight + (Math.random() - 0.5) * noise
  );
};

const calculateScatterPos = () => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * SCATTER_RADIUS;
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// --- COMPONENT: PARTICLES ---
const SignatureParticles = ({ mode }) => {
  const leafMesh = useRef();
  const ornamentMesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate Data
  const leafData = useMemo(
    () =>
      Array.from({ length: LEAF_COUNT }, (_, i) => ({
        scatter: calculateScatterPos(),
        tree: calculateTreePos(i, LEAF_COUNT, false),
        scale: Math.random() * 0.3 + 0.1,
        rotationPhase: Math.random() * Math.PI,
      })),
    []
  );

  const ornamentData = useMemo(
    () =>
      Array.from({ length: ORNAMENT_COUNT }, (_, i) => ({
        scatter: calculateScatterPos(),
        tree: calculateTreePos(i, ORNAMENT_COUNT, true),
        scale: Math.random() * 0.4 + 0.3,
      })),
    []
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const isTree = mode === "TREE";

    // Animate Leaves
    if (leafMesh.current) {
      leafData.forEach((data, i) => {
        const target = isTree ? data.tree : data.scatter;

        leafMesh.current.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        // Lerp Position
        dummy.position.lerp(target, isTree ? 0.04 : 0.02);

        // Rotation/Float
        if (isTree) {
          dummy.rotation.y += 0.01;
        } else {
          dummy.rotation.x += 0.01;
          dummy.rotation.y += 0.01;
        }

        dummy.scale.setScalar(data.scale);
        dummy.updateMatrix();
        leafMesh.current.setMatrixAt(i, dummy.matrix);
      });
      leafMesh.current.instanceMatrix.needsUpdate = true;
    }

    // Animate Ornaments
    if (ornamentMesh.current) {
      ornamentData.forEach((data, i) => {
        const target = isTree ? data.tree : data.scatter;

        ornamentMesh.current.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

        dummy.position.lerp(target, isTree ? 0.05 : 0.03);
        dummy.scale.setScalar(data.scale);

        dummy.updateMatrix();
        ornamentMesh.current.setMatrixAt(i, dummy.matrix);
      });
      ornamentMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Emeralds */}
      <instancedMesh ref={leafMesh} args={[null, null, LEAF_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={PALETTE.emerald}
          emissive={PALETTE.emerald}
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1}
        />
      </instancedMesh>

      {/* Ornaments */}
      <instancedMesh ref={ornamentMesh} args={[null, null, ORNAMENT_COUNT]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={PALETTE.gold}
          emissive={PALETTE.gold}
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={1}
        />
      </instancedMesh>
    </group>
  );
};

// --- MAIN UI LAYOUT ---
export default function App() {
  const [mode, setMode] = useState("TREE");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#050505",
        position: "relative",
      }}
    >
      {/* 3D SCENE */}
      <Canvas shadows camera={{ position: [0, 0, 25], fov: 35 }}>
        <color attach="background" args={["#050505"]} />

        {/* LIGHTS */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 20, 10]}
          angle={0.5}
          penumbra={1}
          intensity={200}
          color="#fff5b6"
        />
        <pointLight
          position={[-10, -5, -10]}
          intensity={50}
          color={PALETTE.emerald}
        />
        <Environment preset="city" />

        {/* CONTENT */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <SignatureParticles mode={mode} />
        </Float>

        <ContactShadows
          opacity={0.5}
          scale={30}
          blur={2}
          far={10}
          color="#000"
        />

        <OrbitControls
          enablePan={false}
          autoRotate={mode === "TREE"}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* OVERLAY UI */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            color: PALETTE.gold,
            textTransform: "uppercase",
            letterSpacing: "4px",
            fontSize: "1.5rem",
            textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            marginBottom: "20px",
            fontFamily: "serif",
          }}
        >
          Arix Signature Tree
        </h1>

        <button
          onClick={() => setMode(mode === "SCATTER" ? "TREE" : "SCATTER")}
          style={{
            pointerEvents: "auto",
            background: "rgba(0, 20, 5, 0.8)",
            border: `1px solid ${PALETTE.gold}`,
            color: PALETTE.gold,
            padding: "15px 40px",
            fontSize: "0.9rem",
            letterSpacing: "2px",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          {mode === "SCATTER" ? "ASSEMBLE" : "DISPERSE"}
        </button>
      </div>
    </div>
  );
}
