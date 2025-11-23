import { Injectable, Logger } from '@nestjs/common';
import { BookingRepository } from './repositories';
import { BookingStatusEnum } from '@libs/shared';
import { CustomError } from '@libs/common';

@Injectable()
export class BookingWorkerService {
  private readonly logger = new Logger(BookingWorkerService.name);
  constructor(private readonly bookingRepository: BookingRepository) {}
  async bookingCreated(bookingId: string) {
    await this.bookingRepository
      .updateStatus(bookingId, BookingStatusEnum.CHECKING_AVAILABILITY)
      .catch(err => {
        if (err instanceof CustomError) this.logger.error(err);
        else throw err;
      });
    await this.bookingRepository.checkTableForBooking(bookingId);
  }
}
