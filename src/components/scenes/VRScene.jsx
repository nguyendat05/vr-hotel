import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Hotspot } from '../vr/Hotspot'

const SPHERE_RADIUS = 120

/**
 * Inner-facing panorama: camera sits near the origin; texture maps on the sphere interior.
 */
function PanoramaSphere({ texture }) {
  const meshRef = useRef(null)

  // Do not steal pointer events from hotspots — only markers should be clickable.
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.raycast = () => {}
  }, [])

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
      {texture ? (
        <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
      ) : (
        <meshBasicMaterial color="#0b1220" side={THREE.BackSide} toneMapped={false} />
      )}
    </mesh>
  )
}

/**
 * R3F scene: inverted sphere, damping controls, optional hotspot markers.
 */
export function VRScene({ texture, hotspots, onHotspotSelect }) {
  const list = hotspots ?? []

  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 6, 2]} intensity={0.8} />
      <PanoramaSphere texture={texture} />
      {list.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} onSelect={onHotspotSelect} />
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={-0.32}
        dampingFactor={0.08}
        enableDamping
        minPolarAngle={0.08}
        maxPolarAngle={Math.PI - 0.08}
      />
    </>
  )
}
