import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repositories';
import { ApiBookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async createBooking(
    bookingData: ApiBookingDto.createBooking.CreateBookingRequestDto,
  ) {
    const booking = await this.bookingRepository.createBooking(bookingData);
    //TODO send kafka event
    return { bookingId: booking.id };
  }

  async getBookingById(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
