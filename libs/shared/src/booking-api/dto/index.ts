export namespace BookingApiTransportDto {
  export namespace createdBooking {
    export const topic = 'booking.created';
    export class EventDto {
      bookingId: string;
      // restaurantId: string;
      // guestCount: number;
      // date: string;
    }
  }
}
