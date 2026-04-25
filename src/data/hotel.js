/**
 * Thông tin trải nghiệm khách — đặt phòng (Agoda), tour web ngoài (tùy chọn).
 * Tour 360° trong app dùng ảnh cube từ `rooms.js`.
 */
export const hotelExperience = {
  hotelName: 'Regalia Gold Hotel Nha Trang',
  location: 'Nha Trang, Khánh Hòa',
  tagline: 'Tham quan 360° — điều hướng theo điểm, giống trải nghiệm VR360 Virtual Tour.',
  /** Ảnh & giá tham khảo (Agoda). */
  agodaBookingUrl:
    'https://www.agoda.com/vi-vn/regalia-gold-hotel/hotel/nha-trang-vn.html?countryId=38&finalPriceView=1&isShowMobileAppPrice=false&cid=1955391&numberOfBedrooms=&familyMode=false&adults=1&children=0&rooms=1&maxRooms=0&checkIn=2026-04-30&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=-1&showReviewSubmissionEntry=false&currencyCode=VND&isFreeOccSearch=false&tag=4abc6784-4930-4d3b-ad3d-8b18821fa05b&los=1&searchrequestid=ec22d934-5e95-47a0-9d2e-98ae599ff3e3&utm_medium=cpc&utm_source=bing&utm_campaign=VNM%7CEN%7CEN%7CDOM_005&utm_content=VNM%7CEN%7CEN%7CDOM%7CGeneral%7CNA_MPB%7CHN%3ARegalia+Gold+Hotel_10681625%7CNUM001&utm_term=Regalia+Gold+Hotel+Nha+Trang&ds=ibz1ZRxgCIzmVp%2F6',
  /** Trang mẫu điều hướng / VR (tham khảo UX). */
  inspirationVrLandingUrl: 'https://vr360.com.vn/cam-ranh-bay-hotels-resorts',
  /**
   * Tour web đầy đủ (iframe). Cùng hệ ảnh nguồn với cube trong repo.
   * Có thể ghi đè: `VITE_REGALIA_TOUR_URL` trong `.env`.
   */
  fullTourPageUrl: import.meta.env.VITE_REGALIA_TOUR_URL || 'https://duan.vrtour360.vn/RegaliaGold/',
}
