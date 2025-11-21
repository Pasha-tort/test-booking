import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '@libs/database';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from './repositories/booking.repositories';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), BookingModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
})
export class BookingModule {}
