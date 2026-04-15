import hotelPanorama from '../assets/images/room-hotel.jpg'
import suitePanorama from '../assets/images/room-suite.jpg'
import lobbyPanorama from '../assets/images/room-lobby.jpg'

/**
 * Ảnh 360° nội thất: Poly Haven (CC0) — tonemapped JPG, không cần backend.
 * Nguồn: https://polyhaven.com/ (hotel_room, kiara_interior, cinema_lobby)
 */
export const rooms = [
  {
    id: 'hotel',
    name: 'Phòng nghỉ khách sạn',
    description:
      'Panorama 360° phòng ngủ kiểu khách sạn (asset “Hotel Room”). Kéo để xoay, bấm chấm xanh ngọc để xem gợi ý.',
    image: hotelPanorama,
    hotspots: [
      {
        id: 'bed',
        position: [1.0, -0.2, -2.5],
        label: 'Giường',
        description: 'Khu vực giường — phù hợp để giới thiệu loại phòng, chất liệu drap và gối.',
      },
      {
        id: 'window',
        position: [-1.6, 0.15, -2.2],
        label: 'Cửa sổ / ánh sáng',
        description: 'Hướng sáng tự nhiên trong ảnh 360° — có thể gắn nội dung “view” hoặc rèm thông minh.',
      },
      {
        id: 'desk',
        position: [2.0, -0.15, -1.6],
        label: 'Góc làm việc',
        description: 'Bàn nhỏ hoặc kệ — demo tiện ích cho khách công tác.',
      },
    ],
  },
  {
    id: 'suite',
    name: 'Suite sinh hoạt',
    description:
      'Không gian phòng khách / nội thất hiện đại (asset “Kiara Interior”). Trực quan hơn cảnh ngoài trời demo cũ.',
    image: suitePanorama,
    hotspots: [
      {
        id: 'sofa',
        position: [-1.5, -0.25, -2.4],
        label: 'Khu sofa',
        description: 'Khu tiếp khách — có thể mô tả bố cục ghế, bàn và ánh sáng.',
      },
      {
        id: 'dining',
        position: [2.0, -0.2, -2.0],
        label: 'Khu bếp / bàn ăn',
        description: 'Gợi ý minibar, bữa sáng in-room hoặc tiện ích gia đình.',
      },
      {
        id: 'lighting',
        position: [0.2, 0.5, -2.8],
        label: 'Trần & đèn',
        description: 'Đèn trần / đèn tường trong ảnh — phù hợp để nói về mood lighting.',
      },
    ],
  },
  {
    id: 'lobby',
    name: 'Sảnh / không gian chung',
    description:
      'Không gian sảnh rộng (asset “Cinema Lobby”) — dùng làm demo “đại sảnh khách sạn / khu chờ”.',
    image: lobbyPanorama,
    hotspots: [
      {
        id: 'reception',
        position: [0.3, -0.2, -2.8],
        label: 'Quầy lễ tân',
        description: 'Vị trí trung tâm — map sang concierge, check-in nhanh hoặc hướng dẫn.',
      },
      {
        id: 'seating',
        position: [-2.2, -0.3, -1.8],
        label: 'Khu chờ',
        description: 'Ghế chờ / lounge — nội dung về giờ cao điểm hoặc đặt xe.',
      },
      {
        id: 'circulation',
        position: [2.3, -0.25, -2.2],
        label: 'Lối đi & thang máy',
        description: 'Gợi ý điều hướng khách lên tầng phòng.',
      },
    ],
  },
]
