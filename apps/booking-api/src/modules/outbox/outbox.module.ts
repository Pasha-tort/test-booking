import { Module } from '@nestjs/common';
import { OutBoxProcessor } from './outbox.processor';
import { OutBoxService } from './outbox.service';
import { OutBoxRepository } from './repositories/outbox.repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutBoxEntity } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([OutBoxEntity])],
  providers: [OutBoxProcessor, OutBoxService, OutBoxRepository],
  exports: [OutBoxService],
})
export class OutBoxModule {}
