import { DiscoveryModule, Reflector } from '@nestjs/core';
import { Kafka } from 'kafkajs';
import { KAFKA_PROGRAM } from './constants';
import { KafkaService } from './kafka.service';
import { KafkaConsumerService } from './kafka-consumer.service';
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class KafkaModule {
  static forRoot({
    clientId,
    brokers,
  }: {
    clientId: string;
    brokers: string[];
  }): DynamicModule {
    if (!brokers.length)
      throw new Error('The number of brokers cannot be zero');

    return {
      module: KafkaModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: KAFKA_PROGRAM,
          useValue: new Kafka({
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
