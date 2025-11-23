import { Inject, Injectable } from '@nestjs/common';
import { OutBoxEntity } from '../../entities';
import { OutBoxRepository } from './repositories/outbox.repositories';
import { QUEUE_CONTROL, QUEUE_OUTBOX } from '../queue';
import { Queue as QueueBullMQ } from 'bullmq';
import Queue from 'queue';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueEvent, TypeOutBoxEventEnum } from './types';
import pLimit from 'p-limit';

@Injectable()
export class OutBoxService {
  private readonly batchSize = 500;
  constructor(
    private readonly outBoxRepository: OutBoxRepository,
    @Inject(QUEUE_CONTROL)
    private readonly queueControl: Queue,
    @InjectQueue(QUEUE_OUTBOX)
    private readonly queueOutBox: QueueBullMQ<QueueEvent>,
  ) {}

  @Cron('0 */30 * * * *') // every 30 min
  private async handleDeleteOldOutbox() {
    await this.outBoxRepository.deleteAllOldEvents();
  }

  @Cron('0 */1 * * * *') // every one min
  private async handleOutboxCronJob() {
    await this.processPendingOutboxEvents();
  }

  private async processPendingOutboxEvents() {
    const batch: OutBoxEntity[] = [];

    for await (const event of this.outBoxRepository.getAllEventsNoProcessingGenerator()) {
      batch.push(event);
      if (batch.length >= this.batchSize) {
        const copyBatch = [...batch];
        await this.createJobs(copyBatch);
        batch.length = 0;
      }
    }
    if (batch.length > 0) await this.createJobs(batch);
  }

  private async createJobs(events: OutBoxEntity[]) {
    const limit = pLimit(50);
    await Promise.all(
      events.map(event =>
        limit(() =>
          this.createJob({
            eventId: event.id,
            eventType: event.eventType,
            payload: event.payload,
          }),
        ),
      ),
    );
  }

  /**
   * !! В идеале для атомарности здесь использовать lua скрипты для проверки сущ-ие jobId в redis и при отсутствии создавать job с указанным jobId
   * !! но не хотелось грамоздить еще и lua скрипты
   * !! а проблему подсветить хотелось
   */
  async createJob({
    eventId,
    eventType,
    payload,
  }: {
    eventId: string;
    eventType: TypeOutBoxEventEnum;
    payload: object;
  }) {
    this.queueControl.push(async () => {
      const jobId = `${eventType}.${eventId}`;
      const job = await this.queueOutBox.getJob(jobId);
      if (!job)
        await this.queueOutBox
          .add(
            eventType,
            {
              eventId: eventId,
              payload: payload,
            },
            { jobId },
          )
          .then(() => {});
    });
  }
}
