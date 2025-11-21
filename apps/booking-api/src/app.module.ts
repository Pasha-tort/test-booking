import { Module } from '@nestjs/common';
import { BookingModule } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './datasource';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), BookingModule],
})
export class AppModule {}
