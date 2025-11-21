import { BookingEntity } from '@libs/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingWorkerController } from './booking-worker.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity])],
  controllers: [BookingWorkerController],
})
export class BookingWorkerModule {}
