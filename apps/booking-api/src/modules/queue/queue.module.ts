import { QueueConfig } from '@libs/configuration';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { QUEUE_CONTROL, QUEUE_OUTBOX } from './constants';
import Queue from 'queue';

@Global()
@Module({
  imports: [
    BullModule.forRoot({ connection: QueueConfig }),
    BullModule.registerQueue({
      name: QUEUE_OUTBOX,
      defaultJobOptions: {
        removeOnComplete: true,
        backoff: 3000,
        attempts: 5,
      },
    }),
  ],
  providers: [
    {
      provide: QUEUE_CONTROL,
      useValue: new Queue({
        concurrency: 1,
        autostart: true,
      }),
    },
  ],
  exports: [BullModule, QUEUE_CONTROL],
})
export class QueueModule {}
