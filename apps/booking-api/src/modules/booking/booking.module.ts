import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity, TableEntity } from '@libs/database';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from './repositories/booking.repositories';
import { OutBoxModule } from '../outbox/outbox.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    BookingModule,
    OutBoxModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
