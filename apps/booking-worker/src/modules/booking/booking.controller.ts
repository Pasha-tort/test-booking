import { KafkaSubscribe } from '@libs/kafka';
import { EachMessagePayload } from 'kafkajs';

export class BookingControllerKafka {
  @KafkaSubscribe('booking-created')
  async handleBookingCreated({ message }: EachMessagePayload) {
    const event = JSON.parse(message.value.toString());
    console.log('[Booking] Event received:', event);
  }
}
