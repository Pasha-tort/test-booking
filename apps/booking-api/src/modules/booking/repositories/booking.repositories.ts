import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookingEntity } from '@libs/database';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  // async createBooking({
  //   restaurantId,
  //   guestCount,
  //   date,
  // }: {
  //   restaurantId: string;
  //   guestCount: number;
  //   date: Date;
  // }) {
  //   return this.bookingRepository.save({
  //     restaurantId,
  //     guestCount,
  //     date,
  //   });
  // }

  async getBookingById(
    bookingId: string,
    relations?: Partial<{
      [k in keyof Pick<BookingEntity, 'table' | 'restaurant'>]: boolean;
    }>,
  ) {
    return this.bookingRepository.findOne({
      where: { id: bookingId },
      relations,
    });
  }
}
