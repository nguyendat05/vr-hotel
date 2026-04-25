import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { rooms as roomCatalog, tourGroups as sourceTourGroups } from './data/rooms'
import { RoomViewer } from './components/vr/RoomViewer'
import { RoomSidebar } from './components/ui/RoomSidebar'
import { HotspotOverlay } from './components/ui/HotspotOverlay'
import { PositionGuide } from './components/ui/PositionGuide'
import './App.css'

const MIN_CAMERA_FOV = 38
const MAX_CAMERA_FOV = 92
const CAMERA_FOV_STEP = 6
const DEFAULT_CAMERA_FOV = MIN_CAMERA_FOV + CAMERA_FOV_STEP * 2

function directionToYawPitch([x, y, z]) {
  const yaw = (Math.atan2(x, -z) * 180) / Math.PI
  const pitch = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI
  return {
    yaw: Number(yaw.toFixed(2)),
    pitch: Number(pitch.toFixed(2)),
  }
}

const ZONE_CONFIGS = sourceTourGroups.map((group) => ({
  id: group.id,
  name: group.name,
  hint: `Khám phá khu ${group.name}.`,
  defaultTarget: group.roomIds[0],
  roomIds: group.roomIds,
}))

const RECOMMENDED_JOURNEY = sourceTourGroups.flatMap((group) => group.roomIds.slice(0, 2))

export default function App() {
  const [activeRoomId, setActiveRoomId] = useState(roomCatalog[0].id)
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [roomDimmed, setRoomDimmed] = useState(false)
  const [transitionState, setTransitionState] = useState('idle')
  const [guideZoneId, setGuideZoneId] = useState(ZONE_CONFIGS[0]?.id ?? '')
  const [guideTargetRoomId, setGuideTargetRoomId] = useState(ZONE_CONFIGS[0]?.defaultTarget ?? roomCatalog[0].id)
  const [guidedRoute, setGuidedRoute] = useState([])
  const [guidedStep, setGuidedStep] = useState(0)
  const [isGuiding, setIsGuiding] = useState(false)
  const [cameraFov, setCameraFov] = useState(DEFAULT_CAMERA_FOV)
  const [activeGroupId, setActiveGroupId] = useState(sourceTourGroups[0]?.id ?? '')
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewAngles, setViewAngles] = useState({ yaw: 0, pitch: 0 })
  const [pickedAngles, setPickedAngles] = useState(null)
  const roomNavTimers = useRef([])
  const guideRunRef = useRef(0)
  const roomIdSet = useMemo(() => new Set(roomCatalog.map((room) => room.id)), [])
  const zoneMap = useMemo(() => new Map(ZONE_CONFIGS.map((zone) => [zone.id, zone])), [])
  const activeZone = zoneMap.get(guideZoneId) ?? ZONE_CONFIGS[0]
  const validTourGroups = useMemo(
    () =>
      sourceTourGroups.map((group) => ({
        ...group,
        roomIds: group.roomIds.filter((id) => roomIdSet.has(id)),
      })).filter((group) => group.roomIds.length > 0),
    [roomIdSet],
  )
  const roomGroupMap = useMemo(() => {
    const map = new Map()
    validTourGroups.forEach((group) => {
      group.roomIds.forEach((roomId) => {
        map.set(roomId, group.id)
      })
    })
    return map
  }, [validTourGroups])
  const guideRooms = useMemo(
    () => roomCatalog.filter((room) => activeZone.roomIds.includes(room.id)),
    [activeZone.roomIds],
  )

  const activeRoom = useMemo(
    () => roomCatalog.find((r) => r.id === activeRoomId) ?? roomCatalog[0],
    [activeRoomId],
  )

  const clearRoomNavTimers = useCallback(() => {
    roomNavTimers.current.forEach((id) => window.clearTimeout(id))
    roomNavTimers.current = []
  }, [])

  useEffect(() => () => clearRoomNavTimers(), [clearRoomNavTimers])
  useEffect(() => {
    if (!guideRooms.find((room) => room.id === guideTargetRoomId)) {
      setGuideTargetRoomId(activeZone.defaultTarget)
    }
  }, [activeZone.defaultTarget, guideRooms, guideTargetRoomId])
  useEffect(() => {
    // Keep group aligned with the current room only when room changes.
    // Do not force-reset when user is manually browsing another tab.
    const ownerGroup = roomGroupMap.get(activeRoomId)
    if (ownerGroup) setActiveGroupId(ownerGroup)
  }, [activeRoomId, roomGroupMap])

  /** Chuyển cảnh có fade — cảm giác “đi” hơn là đổi ảnh tức thì. */
  const transitionToRoom = useCallback(
    (roomId, onComplete) => {
      if (!roomIdSet.has(roomId) || roomId === activeRoomId) {
        onComplete?.()
        return
      }
      clearRoomNavTimers()
      setTransitionState('zoom')
      const t0 = window.setTimeout(() => {
        setRoomDimmed(true)
      }, 170)
      const t1 = window.setTimeout(() => {
        setActiveRoomId(roomId)
        setActiveHotspot(null)
        const t2 = window.setTimeout(() => {
          setRoomDimmed(false)
          setTransitionState('idle')
          roomNavTimers.current = []
          onComplete?.()
        }, 320)
        roomNavTimers.current.push(t2)
      }, 220)
      roomNavTimers.current.push(t0)
      roomNavTimers.current.push(t1)
    },
    [activeRoomId, clearRoomNavTimers, roomIdSet],
  )

  const cancelGuidedMove = useCallback(() => {
    guideRunRef.current += 1
    setIsGuiding(false)
    setGuidedStep(0)
    setGuidedRoute([])
  }, [])

  const navigationGraph = useMemo(() => {
    const graph = new Map()
    roomCatalog.forEach((room) => {
      graph.set(room.id, new Set())
    })
    roomCatalog.forEach((room) => {
      ;(room.hotspots ?? []).forEach((hotspot) => {
        if (hotspot?.type === 'navigation' && typeof hotspot?.target === 'string' && roomIdSet.has(hotspot.target)) {
          graph.get(room.id)?.add(hotspot.target)
          graph.get(hotspot.target)?.add(room.id)
        }
      })
    })
    return graph
  }, [roomIdSet])

  const findRoute = useCallback(
    (startRoomId, targetRoomId) => {
      if (!navigationGraph.has(startRoomId) || !navigationGraph.has(targetRoomId)) return null
      if (startRoomId === targetRoomId) return [startRoomId]
      const queue = [[startRoomId]]
      const visited = new Set([startRoomId])
      while (queue.length > 0) {
        const path = queue.shift()
        const last = path[path.length - 1]
        const nextSet = navigationGraph.get(last)
        if (!nextSet) continue
        for (const next of nextSet) {
          if (visited.has(next)) continue
          const nextPath = [...path, next]
          if (next === targetRoomId) return nextPath
          visited.add(next)
          queue.push(nextPath)
        }
      }
      return null
    },
    [navigationGraph],
  )

  const runGuidedRoute = useCallback(
    (route) => {
      if (!route || route.length < 2) return

      const runId = guideRunRef.current + 1
      guideRunRef.current = runId
      setGuidedRoute(route)
      setGuidedStep(0)
      setIsGuiding(true)
      setActiveHotspot(null)

      const walkNext = (index) => {
        if (guideRunRef.current !== runId) return
        const nextRoomId = route[index + 1]
        if (!nextRoomId) {
          setIsGuiding(false)
          return
        }

        setGuidedStep(index + 1)
        transitionToRoom(nextRoomId, () => {
          if (guideRunRef.current !== runId) return
          if (index + 1 >= route.length - 1) {
            setIsGuiding(false)
            return
          }
          walkNext(index + 1)
        })
      }

      walkNext(0)
    },
    [transitionToRoom],
  )

  const startGuidedMove = useCallback(() => {
    if (!guideTargetRoomId || !roomIdSet.has(guideTargetRoomId) || guideTargetRoomId === activeRoomId) return
    const route = findRoute(activeRoomId, guideTargetRoomId)
    if (!route || route.length < 2) return
    runGuidedRoute(route)
  }, [activeRoomId, findRoute, guideTargetRoomId, roomIdSet, runGuidedRoute])

  const startRecommendedJourney = useCallback(() => {
    const waypoints = RECOMMENDED_JOURNEY.filter((id) => roomIdSet.has(id))
    if (waypoints.length === 0) return

    const stitched = [activeRoomId]
    let from = activeRoomId
    for (const destination of waypoints) {
      const segment = findRoute(from, destination)
      if (!segment || segment.length < 2) continue
      stitched.push(...segment.slice(1))
      from = destination
    }

    if (stitched.length < 2) return
    runGuidedRoute(stitched)
  }, [activeRoomId, findRoute, roomIdSet, runGuidedRoute])

  const handleSelectRoom = useCallback(
    (roomId) => {
      cancelGuidedMove()
      transitionToRoom(roomId)
    },
    [cancelGuidedMove, transitionToRoom],
  )

  const handleHotspotSelect = useCallback(
    (hotspot) => {
      const isNavigation = hotspot?.type === 'navigation' && typeof hotspot?.target === 'string'

      if (isNavigation && roomIdSet.has(hotspot.target)) {
        cancelGuidedMove()
        transitionToRoom(hotspot.target)
        return
      }

      setActiveHotspot(hotspot)
    },
    [cancelGuidedMove, roomIdSet, transitionToRoom],
  )

  const closeHotspot = useCallback(() => setActiveHotspot(null), [])
  const clampFov = useCallback((value) => Math.min(MAX_CAMERA_FOV, Math.max(MIN_CAMERA_FOV, value)), [])
  useEffect(() => {
    const sceneFov = activeRoom?.defaultView?.fov
    if (Number.isFinite(sceneFov)) {
      setCameraFov(clampFov(sceneFov))
    } else {
      setCameraFov(DEFAULT_CAMERA_FOV)
    }
  }, [activeRoom?.defaultView?.fov, clampFov])
  const handleViewerWheel = useCallback(
    (event) => {
      event.preventDefault()
      const delta = Math.sign(event.deltaY)
      if (delta === 0) return
      const step = 2
      setCameraFov((prev) => clampFov(prev + delta * step))
    },
    [clampFov],
  )
  const handleDirectionPick = useCallback((direction) => {
    setPickedAngles(directionToYawPitch(direction))
  }, [])
  const handleViewAnglesChange = useCallback((direction) => {
    setViewAngles(directionToYawPitch(direction))
  }, [])
  const copyDefaultViewSnippet = useCallback(async () => {
    const source = viewAngles
    const snippet = `defaultView: {
  yaw: ${source.yaw},
  pitch: ${source.pitch},
  fov: ${cameraFov},
},`
    try {
      await navigator.clipboard.writeText(snippet)
    } catch {
      console.log('[VR Hotel] Copy defaultView snippet:', snippet)
    }
  }, [cameraFov, viewAngles])

  const adjacentPreloadUrls = useMemo(() => {
    const nextRoomIds = Array.from(navigationGraph.get(activeRoomId) ?? [])
    const urls = []
    nextRoomIds.forEach((roomId) => {
      const room = roomCatalog.find((item) => item.id === roomId)
      if (!room) return
      if (room.image && typeof room.image === 'object' && room.image.type === 'cubefaces') {
        urls.push(...room.image.faces)
      } else if (typeof room.image === 'string') {
        urls.push(room.image)
      }
    })
    return urls
  }, [activeRoomId, navigationGraph])

  return (
    <div className="app-shell">
      <main className="app-main">
        <div id="hotel-tour" className="app-viewer-stage">
          <div onWheel={handleViewerWheel} className="viewer-wheel-capture">
            <RoomViewer
              room={activeRoom}
              cameraFov={cameraFov}
              roomDimmed={roomDimmed}
              transitionState={transitionState}
              preloadImageUrls={adjacentPreloadUrls}
              onHotspotSelect={handleHotspotSelect}
              onDirectionPick={handleDirectionPick}
              onViewAnglesChange={handleViewAnglesChange}
            />
          </div>
          <button
            type="button"
            className={`viewer-menu-toggle${menuOpen ? ' viewer-menu-toggle--open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? 'Close menu' : 'Menu'}
          </button>
          <PositionGuide
            visible={false}
            zoneOptions={ZONE_CONFIGS}
            zoneId={guideZoneId}
            onChangeZone={setGuideZoneId}
            zoneHint={activeZone.hint}
            rooms={guideRooms}
            currentRoomId={activeRoomId}
            targetRoomId={guideTargetRoomId}
            onChangeTarget={setGuideTargetRoomId}
            onStart={startGuidedMove}
            onStartRecommended={startRecommendedJourney}
            onStop={cancelGuidedMove}
            guiding={isGuiding}
            guidedRoute={guidedRoute}
            guidedStep={guidedStep}
          />
          <section className="hotspot-debug-panel" aria-label="Debug default view pano">
            <p className="hotspot-debug-panel__title">Default view pano</p>
            <p className="hotspot-debug-panel__line">
              Tâm camera: yaw <b>{viewAngles.yaw}</b>, pitch <b>{viewAngles.pitch}</b>
            </p>
            <p className="hotspot-debug-panel__line">
              Điểm bấm gần nhất: yaw <b>{(pickedAngles ?? viewAngles).yaw}</b>, pitch <b>{(pickedAngles ?? viewAngles).pitch}</b>
            </p>
            <p className="hotspot-debug-panel__line">
              FOV hiện tại: <b>{cameraFov}</b>
            </p>
            <button type="button" className="hotspot-debug-panel__copy" onClick={copyDefaultViewSnippet}>
              Copy snippet defaultView
            </button>
          </section>
          <RoomSidebar
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            rooms={roomCatalog}
            groups={validTourGroups}
            activeGroupId={activeGroupId}
            onSelectGroup={setActiveGroupId}
            activeRoomId={activeRoom.id}
            activeRoomName={activeRoom.name}
            onSelectRoom={(roomId) => {
              handleSelectRoom(roomId)
              setMenuOpen(false)
            }}
          />
        </div>
      </main>
      <HotspotOverlay hotspot={activeHotspot} roomName={activeRoom.name} onClose={closeHotspot} />
    </div>
  )
}
