import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repositories';
import { ApiBookingDto } from './dto';
import { DataSource } from 'typeorm';
import { BookingEntity, RestaurantEntity } from '@libs/database';
import { TypeOutBoxEventEnum } from '../outbox';
import { OutBoxEntity } from '../../entities';
import { OutBoxService } from '../outbox/outbox.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly dataSource: DataSource,
    private readonly outBoxService: OutBoxService,
  ) {}

  async createBooking(
    bookingData: ApiBookingDto.createBooking.CreateBookingRequestDto,
  ) {
    const { booking, event } = await this.dataSource.transaction(async em => {
      const restaurant = await em.findOneBy(RestaurantEntity, {
        id: bookingData.restaurantId,
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
      const booking = await em.save(
        em.create(BookingEntity, { ...bookingData, restaurant }),
      );
      const eventId = booking.id;
      const event = await em.save(
        OutBoxEntity,
        em.create(OutBoxEntity, {
          id: eventId,
          payload: { bookingId: booking.id },
          eventType: TypeOutBoxEventEnum.BOOKING_CREATED,
        }),
      );
      return { booking, event };
    });

    await this.outBoxService.createJob({
      eventId: event.id,
      eventType: TypeOutBoxEventEnum.BOOKING_CREATED,
      payload: event.payload,
    });

    return { bookingId: booking.id };
  }

  async getBookingById(bookingId: string) {
    const booking = await this.bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
