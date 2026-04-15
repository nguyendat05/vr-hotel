import { useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRScene } from '../scenes/VRScene'
import { useRoomTexture } from '../../hooks/useRoomTexture'
import { LoadingOverlay } from '../ui/LoadingOverlay'

const CAMERA_FAR = 1000

/**
 * Owns WebGL lifecycle + room texture loading. Canvas stays mounted for smoother room switches.
 */
export function RoomViewer({ room, onHotspotSelect }) {
  const { texture, loading } = useRoomTexture(room.image)

  const handleHotspot = useCallback(
    (hotspot) => {
      onHotspotSelect(hotspot)
    },
    [onHotspotSelect],
  )

  const hotspots = useMemo(() => room.hotspots ?? [], [room])

  return (
    <div className="room-viewer">
      <div className={`room-viewer__canvas-wrap${loading ? ' room-viewer__canvas-wrap--loading' : ''}`}>
        <Canvas
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          camera={{ position: [0, 0.12, 0.06], fov: 68, near: 0.01, far: CAMERA_FAR }}
        >
          <VRScene texture={texture} hotspots={hotspots} onHotspotSelect={handleHotspot} />
        </Canvas>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  )
}
