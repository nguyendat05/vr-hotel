import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/** Vòng đồng tâm nằm trên mặt phẳng XZ — kiểu “đĩa” di chuyển tour VR. */
const FLOOR_RING_SPECS = [
  { inner: 0.1, outer: 0.18, opacity: 0.82 },
  { inner: 0.18, outer: 0.31, opacity: 0.56 },
  { inner: 0.31, outer: 0.48, opacity: 0.34 },
  { inner: 0.48, outer: 0.68, opacity: 0.2 },
]

const HIT_RADIUS = 0.74
const ANGLE_HOTSPOT_DISTANCE = 8
const ANGLE_HOTSPOT_RADIUS = 0.28
const HOTEL_LOGO_URL = '/logo.png'

function toRadians(value) {
  return (value * Math.PI) / 180
}

/**
 * Convert yaw/pitch (degrees) in panorama space to 3D coordinates.
 * yaw=0 faces forward (-Z), yaw=90 points right (+X), pitch=90 points up (+Y).
 */
function yawPitchToPosition(yaw, pitch, distance = ANGLE_HOTSPOT_DISTANCE) {
  const yawRad = toRadians(yaw)
  const pitchRad = toRadians(pitch)
  const cosPitch = Math.cos(pitchRad)
  const x = distance * Math.sin(yawRad) * cosPitch
  const y = distance * Math.sin(pitchRad)
  const z = -distance * Math.cos(yawRad) * cosPitch
  return [x, y, z]
}

/**
 * Marker điều hướng: các vòng trắng mờ trên sàn (XZ), luôn dùng `floorY` để đồng mặt phẳng.
 * `hotspot.position`: [x, y, z] — chỉ x,z dùng đặt marker; y trong data bị thay bằng floorY.
 */
function HotspotImpl({ hotspot, floorY, onSelect }) {
  const { position, label, yaw, pitch } = hotspot
  const isNavigation = hotspot?.type === 'navigation'
  const [px, , pz] = Array.isArray(position) && position.length >= 3 ? position : [0, 0, 0]
  const floorPos = useMemo(() => [px, floorY, pz], [px, pz, floorY])
  const hasAngularPosition = hotspot?.coordType === 'angular' && Number.isFinite(yaw) && Number.isFinite(pitch)
  const isPano15StaticNote = hotspot?.__roomId === 'pano15' && hasAngularPosition && !isNavigation
  const isInfoCallout = isPano15StaticNote
  const calloutHeight = Number.isFinite(hotspot?.calloutHeight) ? Math.max(44, hotspot.calloutHeight) : 86
  const spatialPos = useMemo(
    () => (hasAngularPosition ? yawPitchToPosition(yaw, pitch) : floorPos),
    [floorPos, hasAngularPosition, pitch, yaw],
  )

  const [hovered, setHovered] = useState(false)
  const pulseGroupRef = useRef(null)
  const markerGroupRef = useRef(null)
  const { camera } = useThree()

  const materials = useMemo(
    () =>
      FLOOR_RING_SPECS.map(
        (spec) =>
          new THREE.MeshBasicMaterial({
            color: '#ffd36b',
            transparent: true,
            opacity: spec.opacity,
            depthWrite: false,
          }),
      ),
    [],
  )

  const hoverRingMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffb347',
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  )

  useEffect(() => {
    return () => {
      materials.forEach((m) => m.dispose())
      hoverRingMaterial.dispose()
    }
  }, [materials, hoverRingMaterial])

  useEffect(() => {
    hoverRingMaterial.opacity = hovered ? 0.6 : 0.18
  }, [hovered, hoverRingMaterial])

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
    const g = pulseGroupRef.current
    if (!g) return
    if (isNavigation) {
      g.scale.setScalar(1)
    } else {
      const t = clock.getElapsedTime()
      const breathe = 1 + 0.08 * Math.sin(t * 2.5)
      g.scale.setScalar(breathe)
    }

    if (hasAngularPosition) {
      const marker = markerGroupRef.current
      if (!marker) return
      marker.lookAt(camera.position)
    }
  })

  if (hasAngularPosition) {
    if (isPano15StaticNote) {
      return (
        <group ref={markerGroupRef} position={spatialPos}>
          <mesh renderOrder={2}>
            <circleGeometry args={[0.035, 20]} />
            <meshBasicMaterial color="#def3ff" transparent opacity={0.9} depthWrite={false} />
          </mesh>
          {label ? (
            <Html position={[0, 0, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
              <div className="hotspot-callout hotspot-callout--landmark" style={{ '--callout-height': `${calloutHeight}px` }}>
                <span className="hotspot-callout__stem" />
                <div className="hotspot-label hotspot-label--callout hotspot-label--landmark">{label}</div>
              </div>
            </Html>
          ) : null}
        </group>
      )
    }

    if (isNavigation) {
      return (
        <group
          ref={markerGroupRef}
          position={spatialPos}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <mesh renderOrder={1}>
            <circleGeometry args={[ANGLE_HOTSPOT_RADIUS * 1.02, 30]} />
            <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
          </mesh>
          <group ref={pulseGroupRef} />
          <Html position={[0, 0, 0]} center distanceFactor={8.8} style={{ pointerEvents: 'none' }}>
            <span className={`hotspot-logo hotspot-logo--nav hotspot-logo--rmark${hovered ? ' hotspot-logo--hovered' : ''}`}>
              <img src={HOTEL_LOGO_URL} alt="" />
            </span>
          </Html>
          {hovered && label ? (
            <Html position={[0, 0, 0]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
              <div className="hotspot-callout hotspot-callout--pano15" style={{ '--callout-height': '56px' }}>
                <span className="hotspot-callout__stem" />
                <div className="hotspot-label hotspot-label--callout hotspot-label--pano15">{label}</div>
              </div>
            </Html>
          ) : null}
        </group>
      )
    }

    return (
      <group
        ref={markerGroupRef}
        position={spatialPos}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <mesh renderOrder={1}>
          <circleGeometry args={[ANGLE_HOTSPOT_RADIUS * 1.9, 36]} />
          <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
        </mesh>
        <group ref={pulseGroupRef}>
          <mesh renderOrder={2}>
            <circleGeometry args={[ANGLE_HOTSPOT_RADIUS * 0.48, 32]} />
            <meshBasicMaterial color="#fff1c2" transparent opacity={0.96} depthWrite={false} />
          </mesh>
          <mesh renderOrder={2}>
            <ringGeometry args={[ANGLE_HOTSPOT_RADIUS * 0.55, ANGLE_HOTSPOT_RADIUS * 0.9, 42]} />
            <meshBasicMaterial color="#ffd36b" transparent opacity={0.9} depthWrite={false} />
          </mesh>
          <mesh renderOrder={2}>
            <ringGeometry args={[ANGLE_HOTSPOT_RADIUS * 0.95, ANGLE_HOTSPOT_RADIUS * 1.35, 42]} />
            <meshBasicMaterial color="#ffc85c" transparent opacity={0.56} depthWrite={false} />
          </mesh>
          <mesh renderOrder={3} material={hoverRingMaterial}>
            <ringGeometry args={[ANGLE_HOTSPOT_RADIUS * 1.45, ANGLE_HOTSPOT_RADIUS * 1.8, 42]} />
          </mesh>
        </group>
        <Html position={[0, ANGLE_HOTSPOT_RADIUS * 1.05, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <span className={`hotspot-logo${hovered ? ' hotspot-logo--hovered' : ''}`}>
            <img src={HOTEL_LOGO_URL} alt="" />
          </span>
        </Html>
        {label && (hovered || isInfoCallout) ? (
          <Html
            position={isInfoCallout ? [0.95, ANGLE_HOTSPOT_RADIUS * 2.05, 0] : [0, ANGLE_HOTSPOT_RADIUS * 1.25, 0]}
            center={!isInfoCallout}
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div className={`hotspot-label${isInfoCallout ? ' hotspot-label--callout' : ''}`}>{label}</div>
          </Html>
        ) : null}
      </group>
    )
  }

  return (
    <group position={floorPos} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      {/* Vùng bấm rộng, gần như trong suốt — dễ chạm trên mobile */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <circleGeometry args={[HIT_RADIUS, 48]} />
        <meshBasicMaterial transparent opacity={0.001} depthWrite={false} />
      </mesh>

      {isNavigation ? (
        <group ref={pulseGroupRef} rotation={[-Math.PI / 2, 0, 0]} />
      ) : (
        <group ref={pulseGroupRef} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh renderOrder={2}>
            <circleGeometry args={[0.09, 48]} />
            <meshBasicMaterial color="#fff1c2" transparent opacity={0.96} depthWrite={false} />
          </mesh>
          {FLOOR_RING_SPECS.map((ring, i) => (
            <mesh key={i} material={materials[i]} renderOrder={2}>
              <ringGeometry args={[ring.inner, ring.outer, 56]} />
            </mesh>
          ))}
          <mesh rotation={[0, 0, 0]} renderOrder={3} material={hoverRingMaterial}>
            <ringGeometry args={[0.58, 0.62, 48]} />
          </mesh>
        </group>
      )}
      <Html position={[0, 0.13, 0]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        {isNavigation ? (
          <span className={`hotspot-logo hotspot-logo--nav hotspot-logo--rmark${hovered ? ' hotspot-logo--hovered' : ''}`}>
            <img src={HOTEL_LOGO_URL} alt="" />
          </span>
        ) : (
          <span className={`hotspot-logo${hovered ? ' hotspot-logo--hovered' : ''}`}>
            <img src={HOTEL_LOGO_URL} alt="" />
          </span>
        )}
      </Html>

      {hovered && label ? (
        <Html position={[0, 0.08, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="hotspot-label">{label}</div>
        </Html>
      ) : null}
    </group>
  )
}

export const Hotspot = memo(HotspotImpl)
