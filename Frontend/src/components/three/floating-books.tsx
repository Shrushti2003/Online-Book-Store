"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, Text } from "@react-three/drei";

function BookMesh({ color, position, label }: { color: string; position: [number, number, number]; label: string }) {
  return (
    <Float speed={1.6} rotationIntensity={0.42} floatIntensity={1.2}>
      <group position={position} rotation={[0.18, -0.52, 0.08]}>
        <RoundedBox args={[1.35, 1.9, 0.18]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.34} metalness={0.18} />
        </RoundedBox>
        <Text position={[0, 0, 0.12]} fontSize={0.18} color="#FFF7ED" anchorX="center" anchorY="middle">
          {label}
        </Text>
      </group>
    </Float>
  );
}

export function FloatingBooks() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 42 }} className="!absolute inset-0">
      <ambientLight intensity={1.2} />
      <pointLight position={[3, 3, 4]} intensity={40} color="#FF4ECD" />
      <pointLight position={[-3, -2, 4]} intensity={26} color="#3AEFFF" />
      <BookMesh color="#7B61FF" position={[-1.25, 0.55, 0]} label="WONDER" />
      <BookMesh color="#FF4ECD" position={[1.05, -0.15, -0.2]} label="MOOD" />
      <BookMesh color="#FF7B54" position={[0.1, -1.28, 0.15]} label="AI" />
      <BookMesh color="#1E1E1E" position={[0.52, 1.35, -0.55]} label="READ" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}
