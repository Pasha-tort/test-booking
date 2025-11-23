import { KafkaSubscribe } from '@libs/kafka';
import { BookingApiTransportDto } from '@libs/shared';
import { Injectable } from '@nestjs/common';
import { BookingWorkerService } from './booking-worker.service';

@Injectable()
export class BookingWorkerConsumer {
  constructor(private readonly bookingWorkerService: BookingWorkerService) {}

  @KafkaSubscribe(BookingApiTransportDto.createdBooking.topic)
  async handleBookingCreated(
    payload: BookingApiTransportDto.createdBooking.EventDto,
  ) {
    return this.bookingWorkerService.bookingCreated(payload.bookingId);
  }
}
