import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { KAFKA_PROGRAM } from './constants';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private producer: Producer;

  constructor(
    @Inject(KAFKA_PROGRAM)
    private readonly kafka: Kafka,
  ) {}

  async onModuleInit() {
    this.producer = this.kafka.producer();
    this.logger.log('[Kafka] Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async publish(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
