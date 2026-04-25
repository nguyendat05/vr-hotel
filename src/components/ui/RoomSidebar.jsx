import { RoomList } from './RoomList'

export function RoomSidebar({ open, onClose, rooms, groups, activeGroupId, onSelectGroup, activeRoomId, activeRoomName, onSelectRoom }) {
  return (
    <aside className={`room-sidebar${open ? ' room-sidebar--open' : ''}`}>
      <div className="room-sidebar__body">
        <RoomList
          onClose={onClose}
          rooms={rooms}
          groups={groups}
          activeGroupId={activeGroupId}
          onSelectGroup={onSelectGroup}
          activeRoomId={activeRoomId}
          activeRoomName={activeRoomName}
          onSelectRoom={onSelectRoom}
        />
      </div>
    </aside>
  )
}
