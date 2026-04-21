import { useCallback, useMemo, useState } from 'react'
import { rooms as roomCatalog } from './data/rooms'
import { RoomViewer } from './components/vr/RoomViewer'
import { RoomSidebar } from './components/ui/RoomSidebar'
import { HotspotOverlay } from './components/ui/HotspotOverlay'
import './App.css'

export default function App() {
  const [activeRoomId, setActiveRoomId] = useState(roomCatalog[0].id)
  const [activeHotspot, setActiveHotspot] = useState(null)
  const roomIdSet = useMemo(() => new Set(roomCatalog.map((room) => room.id)), [])

  const activeRoom = useMemo(
    () => roomCatalog.find((r) => r.id === activeRoomId) ?? roomCatalog[0],
    [activeRoomId],
  )

  const handleSelectRoom = useCallback((roomId) => {
    setActiveRoomId(roomId)
    setActiveHotspot(null)
  }, [])

  const handleHotspotSelect = useCallback(
    (hotspot) => {
      const isNavigation = hotspot?.type === 'navigation' && typeof hotspot?.target === 'string'

      if (isNavigation && roomIdSet.has(hotspot.target)) {
        setActiveRoomId(hotspot.target)
        setActiveHotspot(null)
        return
      }

      setActiveHotspot(hotspot)
    },
    [roomIdSet],
  )

  const closeHotspot = useCallback(() => setActiveHotspot(null), [])

  return (
    <div className="app-shell">
      <main className="app-main">
        <div className="app-viewer-stage">
          <RoomViewer room={activeRoom} onHotspotSelect={handleHotspotSelect} />
          <RoomSidebar rooms={roomCatalog} activeRoomId={activeRoom.id} onSelectRoom={handleSelectRoom} />
        </div>
      </main>
      <HotspotOverlay hotspot={activeHotspot} roomName={activeRoom.name} onClose={closeHotspot} />
    </div>
  )
}
