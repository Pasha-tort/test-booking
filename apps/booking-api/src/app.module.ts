import { Module } from '@nestjs/common';
import { BookingModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { Bootstrappable } from '@libs/bootstrap';
import { KafkaModule } from '@libs/kafka';

@Bootstrappable('bookingApi')
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    KafkaModule.forRoot({
      brokers: ['localhost:9092'],
      clientId: 'broker-api',
    }),
    BookingModule,
  ],
})
export class AppModule {}
