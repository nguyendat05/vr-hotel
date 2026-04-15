export function RoomHeader({ room }) {
  return (
    <header className="room-header">
      <div>
        <h1 className="room-header__title">{room.name}</h1>
        <p className="room-header__description">{room.description}</p>
      </div>
    </header>
  )
}
