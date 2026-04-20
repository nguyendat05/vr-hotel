/**
 * Dữ liệu một khách sạn duy nhất tại Nha Trang:
 * Regalia Gold Hotel (tour 360 công khai cùng hệ thống ảnh).
 */
export const rooms = [
  {
    id: 'regalia-overview',
    name: 'Toàn cảnh khách sạn',
    description: 'Góc nhìn bao quát Regalia Gold Hotel Nha Trang.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/overview_15/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/overview_15/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/overview/0.jpg',
        '/images/regalia-gold/cubefaces/overview/1.jpg',
        '/images/regalia-gold/cubefaces/overview/2.jpg',
        '/images/regalia-gold/cubefaces/overview/3.jpg',
        '/images/regalia-gold/cubefaces/overview/4.jpg',
        '/images/regalia-gold/cubefaces/overview/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'overview-lobby',
        position: [0.8, -0.1, -2.8],
        label: 'Bắt đầu tour: vào sảnh',
        type: 'navigation',
        target: 'regalia-lobby',
        description: 'Nhấn để bắt đầu lộ trình tham quan chính từ khu sảnh đón khách.',
      },
      {
        id: 'overview-info',
        position: [-1.6, 0.2, -2.3],
        label: 'Thông tin khách sạn',
        description: 'Khách sạn trung tâm Nha Trang, thuận tiện di chuyển ra biển.',
      },
    ],
  },                  
  {
    id: 'regalia-lobby',
    name: 'Cửa vào khách sạn (Tầng 1)',
    description: 'Điểm vào đầu tiên từ bên ngoài trước khi bước vào trung tâm tầng 1.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/fronthall_12/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/fronthall_12/mobile/{0..5}.jpg
    image: {                                                                   
      type: 'cubefaces',
      faces: [                                                                                 
        '/images/regalia-gold/cubefaces/lobby/0.jpg',
        '/images/regalia-gold/cubefaces/lobby/1.jpg',
        '/images/regalia-gold/cubefaces/lobby/2.jpg',
        '/images/regalia-gold/cubefaces/lobby/3.jpg',
        '/images/regalia-gold/cubefaces/lobby/4.jpg',
        '/images/regalia-gold/cubefaces/lobby/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'lobby-desk',
        position: [1.2, -0.1, -2.6],
        label: 'Biển chỉ dẫn cửa vào',
        description: 'Từ vị trí này, bạn sẽ di chuyển vào sảnh trung tâm tầng 1.',
      },
      {
        id: 'lobby-hallway',
        position: [-1.9, -0.2, -2.0],
        label: 'Bước 2: đi vào trung tâm tầng 1',
        type: 'navigation',
        target: 'regalia-main-lobby',
        description: 'Nhấn để đi xuyên qua cửa vào khu sảnh trung tâm tầng 1.',
      },
      {
        id: 'lobby-overview',
        position: [0.1, -0.25, -2.9],
        label: 'Quay lại điểm bắt đầu',
        type: 'navigation',
        target: 'regalia-overview',
        description: 'Nhấn để quay về góc nhìn tổng quan phía ngoài khách sạn.',
      },
    ],
  },
  {
    id: 'regalia-main-lobby',
    name: 'Trung tâm tầng 1',
    description: 'Hub điều hướng chính ở tầng 1: từ đây đi lễ tân, ghế chờ, quầy bar và hướng vệ sinh.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/lobbybar_19/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/lobbybar_19/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/main-lobby/0.jpg',
        '/images/regalia-gold/cubefaces/main-lobby/1.jpg',
        '/images/regalia-gold/cubefaces/main-lobby/2.jpg',
        '/images/regalia-gold/cubefaces/main-lobby/3.jpg',
        '/images/regalia-gold/cubefaces/main-lobby/4.jpg',
        '/images/regalia-gold/cubefaces/main-lobby/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'main-lobby-frontdesk',
        position: [0, 0, -3],
        label: 'Đi tới quầy lễ tân',
        type: 'navigation',
        target: 'regalia-frontdesk',
        description: 'Khu check-in/check-out và hỗ trợ thông tin.',
      },
      {
        id: 'main-lobby-waiting',
        position: [-3, 0, 0],
        label: 'Đi tới ghế chờ',
        type: 'navigation',
        target: 'regalia-waiting-area',
        description: 'Khu ghế chờ cho khách trước khi nhận phòng hoặc gặp lễ tân.',
      },
      {
        id: 'main-lobby-bar',
        position: [3, 0, 0],
        label: 'Đi tới quầy bar',
        type: 'navigation',
        target: 'regalia-lobby-bar',
        description: 'Không gian đồ uống và thư giãn tại tầng 1.',
      },
      {
        id: 'main-lobby-restroom',
        position: [0, -1.5, -2.5],
        label: 'Hướng đi vệ sinh',
        type: 'navigation',
        target: 'regalia-restroom-way',
        description: 'Lối đi nội bộ dẫn tới khu vệ sinh công cộng.',
      },
      {
        id: 'main-lobby-back-reception',
        position: [0, 0, 3],
        label: 'Quay lại cửa vào tầng 1',
        type: 'navigation',
        target: 'regalia-lobby',
        description: 'Nhấn để quay lại khu lễ tân ban đầu.',
      },
    ],
  },
  {
    id: 'regalia-frontdesk',
    name: 'Quầy lễ tân',
    description: 'Khu vực check-in/check-out và hỗ trợ thông tin khách lưu trú.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/reception_34/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/reception_34/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/frontdesk/0.jpg',
        '/images/regalia-gold/cubefaces/frontdesk/1.jpg',
        '/images/regalia-gold/cubefaces/frontdesk/2.jpg',
        '/images/regalia-gold/cubefaces/frontdesk/3.jpg',
        '/images/regalia-gold/cubefaces/frontdesk/4.jpg',
        '/images/regalia-gold/cubefaces/frontdesk/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'frontdesk-back-main-lobby',
        position: [0, 0, 3],
        label: 'Quay lại trung tâm tầng 1',
        type: 'navigation',
        target: 'regalia-main-lobby',
      },
      {
        id: 'frontdesk-next-hallway',
        position: [0, 0, -3],
        label: 'Tiếp tục sang hành lang phòng',
        type: 'navigation',
        target: 'regalia-hallway',
      },
    ],
  },
  {
    id: 'regalia-waiting-area',
    name: 'Khu ghế chờ',
    description: 'Không gian ghế chờ tại tầng 1 trước khu tiện ích và phòng chức năng.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/conference_01_71/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/conference_01_71/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/waiting/0.jpg',
        '/images/regalia-gold/cubefaces/waiting/1.jpg',
        '/images/regalia-gold/cubefaces/waiting/2.jpg',
        '/images/regalia-gold/cubefaces/waiting/3.jpg',
        '/images/regalia-gold/cubefaces/waiting/4.jpg',
        '/images/regalia-gold/cubefaces/waiting/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'waiting-back-main-lobby',
        position: [0, 0, 3],
        label: 'Quay lại trung tâm tầng 1',
        type: 'navigation',
        target: 'regalia-main-lobby',
      },
      {
        id: 'waiting-to-bar',
        position: [0, 0, -3],
        label: 'Đi tiếp tới quầy bar',
        type: 'navigation',
        target: 'regalia-lobby-bar',
      },
    ],
  },
  {
    id: 'regalia-lobby-bar',
    name: 'Quầy bar tầng 1',
    description: 'Khu đồ uống và nghỉ chân dành cho khách tại tầng 1.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/starnight_01_20/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/starnight_01_20/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/bar/0.jpg',
        '/images/regalia-gold/cubefaces/bar/1.jpg',
        '/images/regalia-gold/cubefaces/bar/2.jpg',
        '/images/regalia-gold/cubefaces/bar/3.jpg',
        '/images/regalia-gold/cubefaces/bar/4.jpg',
        '/images/regalia-gold/cubefaces/bar/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'bar-back-main-lobby',
        position: [0, 0, 3],
        label: 'Quay lại trung tâm tầng 1',
        type: 'navigation',
        target: 'regalia-main-lobby',
      },
      {
        id: 'bar-to-restroom-way',
        position: [0, -1.5, -2.5],
        label: 'Đi theo hướng vệ sinh',
        type: 'navigation',
        target: 'regalia-restroom-way',
      },
    ],
  },
  {
    id: 'regalia-restroom-way',
    name: 'Hướng đi vệ sinh',
    description: 'Lối dẫn nội bộ tới khu vệ sinh công cộng của tầng 1.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/sauna_35/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/sauna_35/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/restroom/0.jpg',
        '/images/regalia-gold/cubefaces/restroom/1.jpg',
        '/images/regalia-gold/cubefaces/restroom/2.jpg',
        '/images/regalia-gold/cubefaces/restroom/3.jpg',
        '/images/regalia-gold/cubefaces/restroom/4.jpg',
        '/images/regalia-gold/cubefaces/restroom/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'restroom-way-back-main-lobby',
        position: [0, 0, 3],
        label: 'Quay lại trung tâm tầng 1',
        type: 'navigation',
        target: 'regalia-main-lobby',
      },
      {
        id: 'restroom-way-to-hallway',
        position: [0, 0, -3],
        label: 'Tiếp tục sang hành lang phòng',
        type: 'navigation',
        target: 'regalia-hallway',
      },
    ],
  },
  {
    id: 'regalia-hallway',
    name: 'Hành lang tầng phòng',
    description: 'Hành lang kết nối các hạng phòng nghỉ.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/corridor_11/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/corridor_11/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/hallway/0.jpg',
        '/images/regalia-gold/cubefaces/hallway/1.jpg',
        '/images/regalia-gold/cubefaces/hallway/2.jpg',
        '/images/regalia-gold/cubefaces/hallway/3.jpg',
        '/images/regalia-gold/cubefaces/hallway/4.jpg',
        '/images/regalia-gold/cubefaces/hallway/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'hallway-standard',
        position: [1.9, -0.2, -1.9],
        label: 'Rẽ trái: vào phòng Superior',
        type: 'navigation',
        target: 'regalia-superior',
        description: 'Nhấn để vào hạng phòng tiêu chuẩn (Superior With Window).',
      },
      {
        id: 'hallway-suite',
        position: [-1.7, -0.2, -2.1],
        label: 'Rẽ phải: vào phòng Suite',
        type: 'navigation',
        target: 'regalia-suite',
        description: 'Nhấn để chuyển sang phòng Suite cao cấp.',
      },
      {
        id: 'hallway-back-lobby',
        position: [0.2, -0.25, -2.9],
        label: 'Quay lại sảnh lễ tân',
        type: 'navigation',
        target: 'regalia-lobby',
        description: 'Nhấn để quay lại lobby khi cần kết thúc nhánh tham quan phòng.',
      },
    ],
  },
  {
    id: 'regalia-superior',
    name: 'Superior With Window',
    description: 'Hạng phòng tiêu chuẩn có cửa sổ, phù hợp lưu trú ngắn ngày.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/superior_01_68/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/superior_01_68/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/superior/0.jpg',
        '/images/regalia-gold/cubefaces/superior/1.jpg',
        '/images/regalia-gold/cubefaces/superior/2.jpg',
        '/images/regalia-gold/cubefaces/superior/3.jpg',
        '/images/regalia-gold/cubefaces/superior/4.jpg',
        '/images/regalia-gold/cubefaces/superior/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'superior-bed',
        position: [0.9, -0.3, -2.6],
        label: 'Khu giường ngủ',
        description: 'Giường đôi với ánh sáng tự nhiên từ cửa sổ.',
      },
      {
        id: 'superior-to-suite',
        position: [2.1, -0.2, -1.6],
        label: 'Nâng hạng: sang phòng Suite',
        type: 'navigation',
        target: 'regalia-suite',
        description: 'Nhấn để so sánh trực tiếp Superior với Suite trong cùng tour.',
      },
      {
        id: 'superior-back-hall',
        position: [-2.0, -0.2, -1.9],
        label: 'Quay lại hành lang phòng',
        type: 'navigation',
        target: 'regalia-hallway',
        description: 'Nhấn để trở ra hành lang và chọn không gian khác.',
      },
    ],
  },
  {
    id: 'regalia-suite',
    name: 'Suite Room',
    description: 'Không gian suite rộng, tiện nghi cao cấp hơn.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/suite_01_64/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/suite_01_64/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/suite/0.jpg',
        '/images/regalia-gold/cubefaces/suite/1.jpg',
        '/images/regalia-gold/cubefaces/suite/2.jpg',
        '/images/regalia-gold/cubefaces/suite/3.jpg',
        '/images/regalia-gold/cubefaces/suite/4.jpg',
        '/images/regalia-gold/cubefaces/suite/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'suite-living',
        position: [-1.2, -0.25, -2.5],
        label: 'Khu tiếp khách',
        description: 'Không gian ngồi thư giãn trong phòng suite.',
      },
      {
        id: 'suite-jacuzzi',
        position: [2.0, -0.2, -1.8],
        label: 'Đi tiếp: khu Jacuzzi',
        type: 'navigation',
        target: 'regalia-jacuzzi',
        description: 'Nhấn để sang khu thư giãn nước nóng (Jacuzzi).',
      },
      {
        id: 'suite-back-hall',
        position: [-2.1, -0.2, -1.8],
        label: 'Quay lại hành lang phòng',
        type: 'navigation',
        target: 'regalia-hallway',
        description: 'Nhấn để quay lại trục chính phòng nghỉ.',
      },
    ],
  },
  {
    id: 'regalia-buffet',
    name: 'Khu buffet sáng',
    description: 'Không gian buffet phục vụ bữa sáng cho khách lưu trú.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/buffet_01_17/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/buffet_01_17/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/buffet/0.jpg',
        '/images/regalia-gold/cubefaces/buffet/1.jpg',
        '/images/regalia-gold/cubefaces/buffet/2.jpg',
        '/images/regalia-gold/cubefaces/buffet/3.jpg',
        '/images/regalia-gold/cubefaces/buffet/4.jpg',
        '/images/regalia-gold/cubefaces/buffet/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'buffet-counter',
        position: [1.1, -0.15, -2.6],
        label: 'Quầy buffet',
        description: 'Khu lấy món nóng/lạnh cho bữa sáng.',
      },
      {
        id: 'buffet-restaurant',
        position: [-1.8, -0.2, -2.0],
        label: 'Tiếp tục: vào nhà hàng The Sun',
        type: 'navigation',
        target: 'regalia-restaurant-sun',
        description: 'Nhấn để sang khu nhà hàng chính phục vụ cả ngày.',
      },
      {
        id: 'buffet-back-lobby',
        position: [0.3, -0.25, -2.9],
        label: 'Quay lại sảnh lễ tân',
        type: 'navigation',
        target: 'regalia-lobby',
        description: 'Nhấn để về lobby và chuyển qua nhánh tiện ích khác.',
      },
    ],
  },
  {
    id: 'regalia-restaurant-sun',
    name: 'Nhà hàng The Sun',
    description: 'Không gian nhà hàng chính phục vụ ăn uống cả ngày.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/thesun_01_25/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/thesun_01_25/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/restaurant/0.jpg',
        '/images/regalia-gold/cubefaces/restaurant/1.jpg',
        '/images/regalia-gold/cubefaces/restaurant/2.jpg',
        '/images/regalia-gold/cubefaces/restaurant/3.jpg',
        '/images/regalia-gold/cubefaces/restaurant/4.jpg',
        '/images/regalia-gold/cubefaces/restaurant/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'sun-dining',
        position: [1.0, -0.2, -2.6],
        label: 'Khu bàn ăn',
        description: 'Không gian phục vụ khách lẻ và gia đình.',
      },
      {
        id: 'sun-gym',
        position: [2.0, -0.2, -1.8],
        label: 'Đi tiếp: tới phòng Gym',
        type: 'navigation',
        target: 'regalia-gym',
        description: 'Nhấn để chuyển sang khu tập luyện thể chất.',
      },
      {
        id: 'sun-back-buffet',
        position: [-2.1, -0.2, -1.8],
        label: 'Quay lại khu buffet sáng',
        type: 'navigation',
        target: 'regalia-buffet',
        description: 'Nhấn để quay lại không gian buffet.',
      },
    ],
  },
  {
    id: 'regalia-gym',
    name: 'Phòng Gym',
    description: 'Khu tập luyện thể chất dành cho khách lưu trú.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/gym_01_73/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/gym_01_73/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/gym/0.jpg',
        '/images/regalia-gold/cubefaces/gym/1.jpg',
        '/images/regalia-gold/cubefaces/gym/2.jpg',
        '/images/regalia-gold/cubefaces/gym/3.jpg',
        '/images/regalia-gold/cubefaces/gym/4.jpg',
        '/images/regalia-gold/cubefaces/gym/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'gym-equipment',
        position: [0.9, -0.2, -2.7],
        label: 'Máy tập',
        description: 'Khu cardio và thiết bị tập cơ bản.',
      },
      {
        id: 'gym-pool',
        position: [2.2, -0.2, -1.7],
        label: 'Đi tiếp: tới hồ bơi vô cực',
        type: 'navigation',
        target: 'regalia-pool',
        description: 'Nhấn để chuyển sang khu tiện ích hồ bơi.',
      },
      {
        id: 'gym-back-restaurant',
        position: [-2.0, -0.2, -1.8],
        label: 'Quay lại nhà hàng The Sun',
        type: 'navigation',
        target: 'regalia-restaurant-sun',
        description: 'Nhấn để quay về khu ẩm thực.',
      },
    ],
  },
  {
    id: 'regalia-pool',
    name: 'Hồ bơi vô cực',
    description: 'Không gian hồ bơi với tầm nhìn mở thoáng.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/pool_01_76/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/pool_01_76/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/pool/0.jpg',
        '/images/regalia-gold/cubefaces/pool/1.jpg',
        '/images/regalia-gold/cubefaces/pool/2.jpg',
        '/images/regalia-gold/cubefaces/pool/3.jpg',
        '/images/regalia-gold/cubefaces/pool/4.jpg',
        '/images/regalia-gold/cubefaces/pool/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'pool-view',
        position: [0.5, -0.15, -2.8],
        label: 'Khu thư giãn hồ bơi',
        description: 'Không gian nghỉ ngơi và ngắm cảnh.',
      },
      {
        id: 'pool-jacuzzi',
        position: [2.1, -0.2, -1.8],
        label: 'Tiếp tục: sang khu Jacuzzi',
        type: 'navigation',
        target: 'regalia-jacuzzi',
        description: 'Nhấn để sang khu thư giãn nước nóng ngay cạnh hồ bơi.',
      },
      {
        id: 'pool-back-gym',
        position: [-2.2, -0.2, -1.7],
        label: 'Quay lại phòng Gym',
        type: 'navigation',
        target: 'regalia-gym',
      },
    ],
  },
  {
    id: 'regalia-jacuzzi',
    name: 'Khu Jacuzzi',
    description: 'Khu thư giãn nước nóng thuộc cụm tiện ích spa.',
    // Source preview: https://duan.vrtour360.vn/RegaliaGold/Tour360data/jacuzzi_31/preview.jpg
    // Source cube faces: https://duan.vrtour360.vn/RegaliaGold/Tour360data/jacuzzi_31/mobile/{0..5}.jpg
    image: {
      type: 'cubefaces',
      faces: [
        '/images/regalia-gold/cubefaces/jacuzzi/0.jpg',
        '/images/regalia-gold/cubefaces/jacuzzi/1.jpg',
        '/images/regalia-gold/cubefaces/jacuzzi/2.jpg',
        '/images/regalia-gold/cubefaces/jacuzzi/3.jpg',
        '/images/regalia-gold/cubefaces/jacuzzi/4.jpg',
        '/images/regalia-gold/cubefaces/jacuzzi/5.jpg',
      ],
    },
    hotspots: [
      {
        id: 'jacuzzi-note',
        position: [0.8, -0.2, -2.7],
        label: 'Bể sục Jacuzzi',
        description: 'Không gian thư giãn sau khi bơi hoặc tập luyện.',
      },
      {
        id: 'jacuzzi-back-pool',
        position: [-2.0, -0.2, -1.9],
        label: 'Quay lại hồ bơi vô cực',
        type: 'navigation',
        target: 'regalia-pool',
        description: 'Nhấn để quay về khu hồ bơi.',
      },
      {
        id: 'jacuzzi-back-suite',
        position: [2.0, -0.2, -1.8],
        label: 'Quay lại phòng Suite',
        type: 'navigation',
        target: 'regalia-suite',
        description: 'Nhấn để quay về nhánh phòng nghỉ cao cấp.',
      },
    ],
  },
]
