export function PositionGuide({
  visible,
  zoneOptions,
  zoneId,
  onChangeZone,
  zoneHint,
  rooms,
  currentRoomId,
  targetRoomId,
  onChangeTarget,
  onStart,
  onStartRecommended,
  onStop,
  guiding,
  guidedRoute,
  guidedStep,
}) {
  if (!visible || rooms.length === 0) return null

  const currentRoomName = rooms.find((room) => room.id === currentRoomId)?.name ?? 'Điểm hiện tại'
  const targetRoomName = rooms.find((room) => room.id === targetRoomId)?.name ?? 'Điểm đích'
  const routeHint =
    guidedRoute.length > 1
      ? `${guidedStep + 1}/${guidedRoute.length} • ${currentRoomName} -> ${targetRoomName}`
      : `${currentRoomName} -> ${targetRoomName}`

  return (
    <section className="position-guide" aria-label="Đi tới vị trí trong không gian">
      <p className="position-guide__title">Di chuyển trong không gian</p>
      <p className="position-guide__hint">{zoneHint}</p>
      <div className="position-guide__controls">
        <label className="position-guide__label" htmlFor="position-guide-zone">
          Khu trải nghiệm
        </label>
        <select
          id="position-guide-zone"
          className="position-guide__select"
          value={zoneId}
          onChange={(event) => onChangeZone(event.target.value)}
          disabled={guiding}
        >
          {zoneOptions.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>
      <div className="position-guide__controls">
        <label className="position-guide__label" htmlFor="position-guide-target">
          Vị trí mục tiêu
        </label>
        <select
          id="position-guide-target"
          className="position-guide__select"
          value={targetRoomId}
          onChange={(event) => onChangeTarget(event.target.value)}
          disabled={guiding}
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>
      <div className="position-guide__actions">
        {!guiding ? (
          <>
            <button
              type="button"
              className="position-guide__button position-guide__button--primary"
              onClick={onStartRecommended}
            >
              Trải nghiệm đề xuất
            </button>
            <button type="button" className="position-guide__button position-guide__button--ghost" onClick={onStart}>
              Đi tới điểm này
            </button>
          </>
        ) : (
          <button type="button" className="position-guide__button position-guide__button--ghost" onClick={onStop}>
            Dừng dẫn đường
          </button>
        )}
      </div>
      <p className="position-guide__status">{guiding ? `Đang di chuyển: ${routeHint}` : `Sẵn sàng: ${routeHint}`}</p>
    </section>
  )
}
