import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repositories';
import { ApiBookingDto } from './dto';
import { KafkaService } from '@libs/kafka';
import { BookingApiTransportDto } from '@libs/shared';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async createBooking(
    bookingData: ApiBookingDto.createBooking.CreateBookingRequestDto,
  ) {
    const booking = await this.bookingRepository.createBooking(bookingData);
    await this.kafkaService.publishMessage<BookingApiTransportDto.createdBooking.EventDto>(
      BookingApiTransportDto.createdBooking.topic,
      { key: booking.id, payload: { bookingId: booking.id } },
    );
    return { bookingId: booking.id };
  }

  async getBookingById(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
