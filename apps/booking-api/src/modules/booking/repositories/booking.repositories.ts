import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookingEntity } from '../../../../../../libs/database/src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingStatusEnum } from '@libs/shared';

@Injectable()
export class BookingRepository {
  private readonly allowedStatus: Record<
    BookingStatusEnum,
    BookingStatusEnum[]
  > = {
    [BookingStatusEnum.CREATED]: [BookingStatusEnum.CHECKING_AVAILABILITY],
    [BookingStatusEnum.CHECKING_AVAILABILITY]: [
      BookingStatusEnum.CONFIRMED,
      BookingStatusEnum.REJECTED,
    ],
    [BookingStatusEnum.CONFIRMED]: [],
    [BookingStatusEnum.REJECTED]: [],
  };

  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async createBooking({
    restaurantId,
    guestCount,
    date,
  }: {
    restaurantId: string;
    guestCount: number;
    date: Date;
  }) {
    return this.bookingRepository.save({
      restaurantId,
      guestCount,
      date,
    });
  }

  async getBookingById(bookingId: string) {
    return this.bookingRepository.findOneBy({ id: bookingId });
  }
}
