import { KafkaSubscribe } from '@libs/kafka';
import { BookingApiTransportDto } from '@libs/shared';
import { Controller } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';

@Controller()
export class BookingWorkerController {
  @KafkaSubscribe('booking.created')
  async handleBookingCreated(
    message: BookingApiTransportDto.createdBooking.EventDto,
  ) {
    console.log(message);
  }
}
