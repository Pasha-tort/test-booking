import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Logger,
} from '@nestjs/common';
import { Kafka, Message, Producer, ProducerRecord } from 'kafkajs';
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
    await this.producer.connect();
    this.logger.log('[Kafka] Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async publishMessage<T extends object>(
    topic: string,
    { payload, key }: { payload: T; key?: string },
  ) {
    const message: Pick<Message, 'value' | 'key'> = {
      value: JSON.stringify(payload),
    };
    if (key) message.key = key;
    await this.producer.send({
      topic,
      messages: [message],
    });
  }
}
