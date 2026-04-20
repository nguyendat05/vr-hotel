import { useEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Hotspot } from '../vr/Hotspot'

const SPHERE_RADIUS = 120
const BOX_SIZE = 240

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
 * Panotour preview.jpg is a 6x1 cube strip (FRBLUD), not equirectangular.
 * This maps each strip segment to a skybox face from inside.
 */
function CubeStripPanorama({ texture }) {
  const meshRef = useRef(null)

  const materials = useMemo(() => {
    if (!texture?.image) return null

    const buildFaceTexture = (segmentIndex) => {
      const t = texture.clone()
      t.needsUpdate = true
      t.repeat.set(1 / 6, 1)
      t.offset.set(segmentIndex / 6, 0)
      t.wrapS = THREE.ClampToEdgeWrapping
      t.wrapT = THREE.ClampToEdgeWrapping
      return t
    }

    // three.js box face order: [right, left, top, bottom, front, back]
    // strip order: [front, right, back, left, up, down]
    const maps = [
      buildFaceTexture(1), // right
      buildFaceTexture(3), // left
      buildFaceTexture(4), // top (up)
      buildFaceTexture(5), // bottom (down)
      buildFaceTexture(0), // front
      buildFaceTexture(2), // back
    ]

    return maps.map(
      (map) =>
        new THREE.MeshBasicMaterial({
          map,
          side: THREE.BackSide,
          toneMapped: false,
        }),
    )
  }, [texture])

  useEffect(() => {
    return () => {
      if (!materials) return
      materials.forEach((m) => {
        if (m.map) m.map.dispose()
        m.dispose()
      })
    }
  }, [materials])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.raycast = () => {}
  }, [])

  if (!materials) return null

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[BOX_SIZE, BOX_SIZE, BOX_SIZE]} />
      {materials.map((mat, index) => (
        <primitive key={index} object={mat} attach={`material-${index}`} />
      ))}
    </mesh>
  )
}

/**
 * R3F scene: inverted sphere, damping controls, optional hotspot markers.
 */
function CubeBackground({ cubeTexture }) {
  const scene = useThree((state) => state.scene)

  useEffect(() => {
    const previous = scene.background
    scene.background = cubeTexture
    return () => {
      scene.background = previous ?? null
    }
  }, [scene, cubeTexture])

  return null
}

export function VRScene({ texture, cubeTexture, hotspots, onHotspotSelect }) {
  const list = hotspots ?? []
  const isCubeStrip =
    Boolean(texture?.image?.width) &&
    Boolean(texture?.image?.height) &&
    texture.image.width / texture.image.height > 5

  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 6, 2]} intensity={0.8} />
      {cubeTexture ? (
        <CubeBackground cubeTexture={cubeTexture} />
      ) : isCubeStrip ? (
        <CubeStripPanorama texture={texture} />
      ) : (
        <PanoramaSphere texture={texture} />
      )}
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
