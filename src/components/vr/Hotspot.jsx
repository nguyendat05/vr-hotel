import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/**
 * Clickable marker in room space. Label copy lives in the overlay after selection.
 */
function HotspotImpl({ hotspot, onSelect }) {
  const { position, label } = hotspot
  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef(null)

  const ringMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#5eead4',
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
  }, [])

  useEffect(() => {
    return () => {
      ringMaterial.dispose()
    }
  }, [ringMaterial])

  const setCursor = useCallback((value) => {
    document.body.style.cursor = value
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  const handlePointerOver = useCallback(
    (e) => {
      e.stopPropagation()
      setCursor('pointer')
      setHovered(true)
    },
    [setCursor],
  )

  const handlePointerOut = useCallback(
    (e) => {
      e.stopPropagation()
      setCursor('')
      setHovered(false)
    },
    [setCursor],
  )

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation()
      onSelect(hotspot)
    },
    [hotspot, onSelect],
  )

  useFrame(({ clock }) => {
    const m = pulseRef.current
    if (!m) return
    const t = clock.getElapsedTime()
    const s = 1 + 0.18 * Math.sin(t * 2.4)
    m.scale.setScalar(s)
    m.material.opacity = 0.35 + 0.18 * (0.5 + 0.5 * Math.sin(t * 2.4))
  })

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* facing the camera: ring + pulse reads better than a floating ball */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} material={ringMaterial}>
          <ringGeometry args={[0.12, 0.18, 48]} />
        </mesh>
        <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.19, 0.27, 48]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.4} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={hovered ? '#ffffff' : '#cbd5e1'} depthWrite={false} />
        </mesh>
      </group>

      {hovered && (
        <Html
          position={[0, 0.28, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="hotspot-label">{label}</div>
        </Html>
      )}
    </group>
  )
}

export const Hotspot = memo(HotspotImpl)
