import { Injectable } from '@nestjs/common';
import { Between, DataSource, In } from 'typeorm';
import { BookingEntity, RestaurantEntity } from '@libs/database';
import { BookingStatusEnum } from '@libs/shared';
import { changingHoursDate, CustomError } from '@libs/common';

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

  constructor(private readonly dataSource: DataSource) {}

  async updateStatus(bookingId: string, status: BookingStatusEnum) {
    return this.dataSource.transaction(async em => {
      const booking = await em.findOneBy(BookingEntity, { id: bookingId });

      const allowed = this.allowedStatus[booking.status] || [];
      if (!allowed.includes(status)) {
        throw new CustomError(
          `Invalid status transition: ${booking.status} → ${status}`,
        );
      }
      booking.status = status;
      return em.save(booking);
    });
  }

  async checkTableForBooking(bookingId: string) {
    await this.dataSource.transaction(async em => {
      const booking = await em.findOneBy(BookingEntity, { id: bookingId });
      if (
        !booking ||
        booking.status === BookingStatusEnum.REJECTED ||
        booking.status === BookingStatusEnum.CONFIRMED
      )
        return;
      const restaurant = await em.findOne(RestaurantEntity, {
        where: { id: booking.restaurantId },
        relations: { tables: true },
      });
      const suitableTable = restaurant.tables.filter(
        t => t.numberSeats >= booking.guestCount,
      );
      if (!suitableTable.length) {
        booking.status = BookingStatusEnum.REJECTED;
        return em.save(booking);
      }
      const existBookings = await em.find(BookingEntity, {
        where: {
          restaurantId: booking.restaurantId,
          tableId: In(suitableTable.map(t => t.id)),
          status: BookingStatusEnum.CONFIRMED,
          date: Between(
            changingHoursDate(booking.date, 2, 'subtraction'),
            changingHoursDate(booking.date, 2, 'addition'),
          ),
        },
      });
      const occupiedTableIds = existBookings.map(b => b.tableId);
      const [table] = suitableTable
        .filter(t => !occupiedTableIds.includes(t.id))
        .sort((t1, t2) => t1.numberSeats - t2.numberSeats);
      if (!table) {
        booking.status = BookingStatusEnum.REJECTED;
      } else {
        booking.status = BookingStatusEnum.CONFIRMED;
        booking.table = table;
      }
      return em.save(booking);
    });
  }
}
