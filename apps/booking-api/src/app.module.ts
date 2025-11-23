import { Module } from '@nestjs/common';
import { BookingModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { Bootstrappable } from '@libs/bootstrap';
import { KafkaModule } from '@libs/kafka';
import { QueueModule } from './modules/queue';
import { RestaurantModule } from './modules/restuarant';

@Bootstrappable('bookingApi')
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    KafkaModule.forRoot({
      brokers: ['localhost:9092'],
      clientId: 'broker-api',
    }),
    QueueModule,
    BookingModule,
    RestaurantModule,
  ],
})
export class AppModule {}
