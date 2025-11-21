import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BookingEntity } from '@libs/database';
import { BookingStatusEnum } from '@libs/shared';
import { CustomError } from '@libs/common';

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

  async updateStatusInTransaction({
    bookingId,
    status,
  }: {
    bookingId: string;
    status: BookingStatusEnum;
  }) {
    return this.dataSource.transaction(async em => {
      const booking = await em.findOneBy(BookingEntity, { id: bookingId });
      const allowed = this.allowedStatus[booking.status] || [];
      if (!allowed.includes(status)) {
        throw new CustomError(
          `Invalid status transition: ${booking.status} → ${status}`,
        );
      }

      booking.status = status;
      return em.save(BookingEntity, booking);
    });
  }
}
