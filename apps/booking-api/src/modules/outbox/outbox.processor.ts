import { KafkaService } from '@libs/kafka';
import { BookingApiTransportDto } from '@libs/shared';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_OUTBOX } from '../queue/constants';
import { QueueEvent, TypeOutBoxEventEnum } from './types';
import { OutBoxRepository } from './repositories/outbox.repositories';
import {
  OutBoxProcessStatusEnum,
  OutBoxSendingStatusEnum,
} from '@libs/database';
import { BookingRepository } from '../booking/repositories/booking.repositories';

@Processor(QUEUE_OUTBOX)
export class OutBoxProcessor extends WorkerHost {
  private readonly logger = new Logger(OutBoxProcessor.name);
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly outBoxRepository: OutBoxRepository,
  ) {
    super();
  }

  async process(job: Job) {
    if (this[job.name]) this[job.name](job.data);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }

  async [TypeOutBoxEventEnum.BOOKING_CREATED](
    data: QueueEvent<BookingApiTransportDto.createdBooking.EventDto>,
  ) {
    await this.outBoxRepository.updateStatus({
      outboxId: data.eventId,
      statusProcess: OutBoxProcessStatusEnum.PROCESSED,
    });
    await this.kafkaService.publishMessage<BookingApiTransportDto.createdBooking.EventDto>(
      BookingApiTransportDto.createdBooking.topic,
      {
        key: data.payload.bookingId,
        payload: { bookingId: data.payload.bookingId },
      },
    );
    await this.outBoxRepository
      .updateStatus({
        outboxId: data.eventId,
        statusSending: OutBoxSendingStatusEnum.SENT,
        statusProcess: OutBoxProcessStatusEnum.FINISH,
      })
      .catch(err => this.logger.error(err));
  }
}
