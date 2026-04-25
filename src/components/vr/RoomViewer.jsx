import { useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRScene } from '../scenes/VRScene'
import { useRoomTexture } from '../../hooks/useRoomTexture'
import { LoadingOverlay } from '../ui/LoadingOverlay'

const CAMERA_FAR = 1000

/**
 * Owns WebGL lifecycle + room texture loading. Canvas stays mounted for smoother room switches.
 * @param {{ room: object, onHotspotSelect: function, onDirectionPick?: function, preloadImageUrls?: string[], roomDimmed?: boolean, transitionState?: string }} props
 */
export function RoomViewer({
  room,
  cameraFov = 68,
  onHotspotSelect,
  onDirectionPick,
  onViewAnglesChange,
  preloadImageUrls = [],
  roomDimmed = false,
  transitionState = 'idle',
}) {
  const { texture, cubeTexture, loading } = useRoomTexture(room.image, preloadImageUrls)

  const handleHotspot = useCallback(
    (hotspot) => {
      onHotspotSelect(hotspot)
    },
    [onHotspotSelect],
  )

  const hotspots = useMemo(() => (room.hotspots ?? []).map((item) => ({ ...item, __roomId: room.id })), [room])
  const floorY = room.floorY ?? -1.36

  return (
    <div className="room-viewer">
      <div
        className={`room-viewer__canvas-wrap${loading ? ' room-viewer__canvas-wrap--loading' : ''}${
          transitionState === 'zoom' ? ' room-viewer__canvas-wrap--zoom' : ''
        }`}
      >
        <Canvas
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          camera={{ position: [0, 0.12, 0.06], fov: 68, near: 0.01, far: CAMERA_FAR }}
        >
          <VRScene
            sceneId={room.id}
            defaultView={room.defaultView}
            texture={texture}
            cubeTexture={cubeTexture}
            cameraFov={cameraFov}
            hotspots={hotspots}
            floorY={floorY}
            onHotspotSelect={handleHotspot}
            onDirectionPick={onDirectionPick}
            onViewAnglesChange={onViewAnglesChange}
          />
        </Canvas>
      </div>
      <div
        className={`room-viewer__transition-shade${roomDimmed ? ' room-viewer__transition-shade--on' : ''}`}
        aria-hidden="true"
      />
      {loading && <LoadingOverlay />}
    </div>
  )
}
