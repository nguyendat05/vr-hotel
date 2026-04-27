import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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

function CameraFovSync({ cameraFov }) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (!camera || typeof camera.fov !== 'number') return
    camera.fov = cameraFov
    camera.updateProjectionMatrix()
  }, [camera, cameraFov])

  return null
}

function CameraDirectionReporter({ onViewAnglesChange }) {
  const camera = useThree((state) => state.camera)
  const lastSentAtRef = useRef(0)
  const directionRef = useRef(new THREE.Vector3())

  useFrame(({ clock }) => {
    if (!onViewAnglesChange) return
    const now = clock.getElapsedTime()
    if (now - lastSentAtRef.current < 0.12) return
    lastSentAtRef.current = now
    camera.getWorldDirection(directionRef.current)
    onViewAnglesChange([directionRef.current.x, directionRef.current.y, directionRef.current.z])
  })

  return null
}

function DefaultViewSync({ sceneId, defaultView, controlsRef }) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    if (!camera || !defaultView) return
    const yaw = defaultView?.yaw
    const pitch = defaultView?.pitch
    if (!Number.isFinite(yaw) || !Number.isFinite(pitch)) return

    const yawRad = (yaw * Math.PI) / 180
    const pitchRad = (pitch * Math.PI) / 180
    const cosPitch = Math.cos(pitchRad)
    const dir = new THREE.Vector3(Math.sin(yawRad) * cosPitch, Math.sin(pitchRad), -Math.cos(yawRad) * cosPitch).normalize()

    if (controlsRef.current) {
      // Keep OrbitControls center stable; only set viewing angles.
      const pos = dir.clone().multiplyScalar(-1)
      const azimuth = Math.atan2(pos.x, pos.z)
      const polar = Math.acos(Math.max(-1, Math.min(1, pos.y)))
      controlsRef.current.setAzimuthalAngle(azimuth)
      controlsRef.current.setPolarAngle(polar)
      controlsRef.current.update()
    } else {
      const target = camera.position.clone().addScaledVector(dir, 10)
      camera.lookAt(target)
    }
  }, [camera, controlsRef, defaultView, sceneId])

  return null
}

function KeyboardLookControls({ controlsRef }) {
  const pressedRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
  })

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    const { left, right, up, down } = pressedRef.current
    if (!left && !right && !up && !down) return

    const ROTATE_SPEED = 15.35
    const MIN_POLAR = 0.08
    const MAX_POLAR = Math.PI - 0.08
    const step = ROTATE_SPEED * delta

    const currentAzimuth = controls.getAzimuthalAngle()
    const currentPolar = controls.getPolarAngle()
    let nextAzimuth = currentAzimuth
    let nextPolar = currentPolar

    if (left) nextAzimuth += step
    if (right) nextAzimuth -= step
    if (up) nextPolar += step
    if (down) nextPolar -= step

    controls.setAzimuthalAngle(nextAzimuth)
    controls.setPolarAngle(Math.max(MIN_POLAR, Math.min(MAX_POLAR, nextPolar)))
    controls.update()
  })

  useEffect(() => {
    const shouldIgnore = (target) => {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
    }

    const setPressed = (key, value) => {
      if (key === 'ArrowLeft') pressedRef.current.left = value
      else if (key === 'ArrowRight') pressedRef.current.right = value
      else if (key === 'ArrowUp') pressedRef.current.up = value
      else if (key === 'ArrowDown') pressedRef.current.down = value
      else return false
      return true
    }

    const handleKeyDown = (event) => {
      if (shouldIgnore(event.target)) return
      const matched = setPressed(event.key, true)
      if (!matched) return
      event.preventDefault()
    }

    const handleKeyUp = (event) => {
      const matched = setPressed(event.key, false)
      if (!matched) return
      event.preventDefault()
    }

    const handleWindowBlur = () => {
      pressedRef.current.left = false
      pressedRef.current.right = false
      pressedRef.current.up = false
      pressedRef.current.down = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [controlsRef])

  return null
}

function ClickNavigationSurface({ onDirectionPick }) {
  const camera = useThree((state) => state.camera)
  const pointerStartRef = useRef(null)

  const handlePointerDown = (event) => {
    const native = event.nativeEvent
    pointerStartRef.current = {
      x: native.clientX,
      y: native.clientY,
      t: performance.now(),
    }
  }

  const handleClick = (event) => {
    if (!onDirectionPick) return
    const start = pointerStartRef.current
    pointerStartRef.current = null
    if (start) {
      const native = event.nativeEvent
      const dx = native.clientX - start.x
      const dy = native.clientY - start.y
      const dt = performance.now() - start.t
      const movedSq = dx * dx + dy * dy
      // Ignore drag/long-press; only treat as intentional click/tap.
      if (movedSq > 36 || dt > 450) return
    }
    event.stopPropagation()
    const direction = event.point.clone().sub(camera.position).normalize()
    onDirectionPick([direction.x, direction.y, direction.z])
  }

  return (
    <mesh onPointerDown={handlePointerDown} onClick={handleClick}>
      <sphereGeometry args={[SPHERE_RADIUS - 6, 40, 40]} />
      <meshBasicMaterial side={THREE.BackSide} transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

/** Độ cao mặt “sàn” ảo trong scene — marker luôn nằm trên XZ tại Y này (chỉnh theo từng tour nếu lệch). */
const DEFAULT_FLOOR_Y = -1.36

export function VRScene({
  sceneId,
  defaultView,
  texture,
  cubeTexture,
  cameraFov = 68,
  hotspots,
  onHotspotSelect,
  onDirectionPick,
  onViewAnglesChange,
  floorY = DEFAULT_FLOOR_Y,
}) {
  const list = hotspots ?? []
  const controlsRef = useRef(null)
  const isCubeStrip =
    Boolean(texture?.image?.width) &&
    Boolean(texture?.image?.height) &&
    texture.image.width / texture.image.height > 5

  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 6, 2]} intensity={0.8} />
      <CameraFovSync cameraFov={cameraFov} />
      <DefaultViewSync sceneId={sceneId} defaultView={defaultView} controlsRef={controlsRef} />
      <KeyboardLookControls controlsRef={controlsRef} />
      <CameraDirectionReporter onViewAnglesChange={onViewAnglesChange} />
      {cubeTexture ? (
        <CubeBackground cubeTexture={cubeTexture} />
      ) : isCubeStrip ? (
        <CubeStripPanorama texture={texture} />
      ) : (
        <PanoramaSphere texture={texture} />
      )}
      {list.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} floorY={floorY} onSelect={onHotspotSelect} />
      ))}
      <ClickNavigationSurface onDirectionPick={onDirectionPick} />
      <OrbitControls
        ref={controlsRef}
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
