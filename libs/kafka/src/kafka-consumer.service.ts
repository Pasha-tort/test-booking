import { Injectable, OnModuleInit, Inject, Logger, Type } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KAFKA_PROGRAM } from './constants';
import { plainToInstance } from 'class-transformer';

type ConsumerCallback = (payload: any) => Promise<void>;
type ConsumerConfig = {
  topic: string;
  groupId: string;
  handler: ConsumerCallback;
  dto?: Type;
};

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private consumers = new Map<string, ConsumerConfig>();

  constructor(
    @Inject(KAFKA_PROGRAM)
    private readonly kafka: Kafka,
  ) {}

  registerConsumer(
    topic: string,
    groupId: string,
    handler: ConsumerCallback,
    dto?: Type,
  ) {
    if (this.consumers.has(topic))
      this.logger.warn(
        `[Kafka] Consumer for topic ${topic} already registered`,
      );
    this.consumers.set(topic, { topic, groupId, handler, dto });
  }

  async onModuleInit() {
    for (const [topic, { groupId, handler, dto }] of this.consumers.entries()) {
      const consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        autoCommit: false,
        eachBatch: async ({
          batch,
          resolveOffset,
          commitOffsetsIfNecessary,
        }) => {
          for (const message of batch.messages) {
            const plain = JSON.parse(message.value.toString());
            try {
              const payload = dto ? plainToInstance(dto, plain) : plain;
              await handler(payload);
            } catch (err) {
              this.logger.error('[Kafka] error in event processing');
              this.logger.error(err);
              return;
            }
            resolveOffset(message.offset);
          }

          await commitOffsetsIfNecessary();
        },
      });

      this.logger.log(
        `[Kafka] Consumer started - topic=${topic}, group=${groupId}`,
      );
    }
  }
}
