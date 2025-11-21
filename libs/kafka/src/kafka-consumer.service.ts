import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { Kafka, EachMessagePayload } from 'kafkajs';
import { KAFKA_PROGRAM } from './constants';

type ConsumerCallback = (payload: EachMessagePayload) => Promise<void>;
type ConsumerConfig = {
  topic: string;
  groupId: string;
  handler: ConsumerCallback;
};

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumers = new Map<string, ConsumerConfig>();

  constructor(
    @Inject(KAFKA_PROGRAM)
    private readonly kafka: Kafka,
  ) {}

  registerConsumer(topic: string, groupId: string, handler: ConsumerCallback) {
    if (this.consumers.has(topic))
      this.logger.warn(
        `[Kafka] Consumer for topic ${topic} already registered`,
      );
    this.consumers.set(topic, { topic, groupId, handler });
  }

  async onModuleInit() {
    for (const [topic, { groupId, handler }] of this.consumers.entries()) {
      const consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        autoCommit: false,
        eachMessage: async payload => {
          try {
            await handler(payload);
            await consumer.commitOffsets([
              {
                topic: payload.topic,
                partition: payload.partition,
                offset: (Number(payload.message.offset) + 1).toString(),
              },
            ]);
          } catch (err) {
            this.logger.error(`[Kafka] Error processing ${topic}`, err);
          }
        },
      });

      this.logger.log(
        `[Kafka] Consumer started — topic=${topic}, group=${groupId}`,
      );
    }
  }
}
