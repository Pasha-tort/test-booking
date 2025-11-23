import { BookingEntity, RestaurantEntity, TableEntity } from '@libs/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingWorkerConsumer } from './booking-worker.consumer';
import { BookingRepository, MockRepository } from './repositories';
import { BookingWorkerService } from './booking-worker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, RestaurantEntity, TableEntity]),
  ],
  providers: [
    BookingRepository,
    MockRepository,
    BookingWorkerService,
    BookingWorkerConsumer,
  ],
})
export class BookingWorkerModule {}
