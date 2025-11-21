export namespace BookingApiTransportDto {
  export namespace createdBooking {
    export class EventDto {
      restaurantId: string;
      guestCount: number;
      date: string;
    }
  }
}
