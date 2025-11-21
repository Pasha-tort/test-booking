import { Module } from '@nestjs/common';
import { BookingWorkerModule } from './modules/booking-worker/booking-worker.module';
import { Bootstrappable } from '@libs/bootstrap';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { KafkaModule } from '@libs/kafka';

@Bootstrappable('bookingWorker')
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    KafkaModule.forRoot({
      brokers: ['localhost:9092'],
      clientId: 'broker-worker',
    }),
    BookingWorkerModule,
  ],
})
export class AppModule {}
