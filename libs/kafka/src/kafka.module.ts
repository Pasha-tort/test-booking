import { DiscoveryModule, Reflector } from '@nestjs/core';
import { Kafka } from 'kafkajs';
import { KAFKA_CONSUMERS, KAFKA_PRODUCER, KAFKA_PROGRAM } from './constants';
import { KafkaService } from './kafka.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { appConfig, MicroservicesConfig } from '@libs/configuration';

export class KafkaModule {
  static forRoot({
    clientId,
    brokers,
  }: {
    clientId: string;
    brokers: string[];
  }) {
    if (!brokers.length)
      throw new Error('The number of brokers cannot be zero');
    return {
      module: KafkaModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: KAFKA_PROGRAM,
          useClass: new Kafka({
            clientId,
            brokers,
          }),
        },
        Reflector,
        KafkaService,
        KafkaConsumerService,
      ],
      exports: [KafkaService, KafkaConsumerService],
      global: true,
    };
  }
}
