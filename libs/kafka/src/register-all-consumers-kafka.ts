import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { KAFKA_SUBSCRIBER, Subscriber } from './decorators';
import { KafkaConsumerService } from './kafka-consumer.service';

export function registerAllConsumersKafka(
  app: NestExpressApplication,
  reflector?: Reflector,
) {
  if (!reflector) reflector = app.get(Reflector);

  const kafkaConsumerService = app.get(KafkaConsumerService);
  const modules = (app as any).container.getModules();

  for (const module of modules.values()) {
    searchSubscriberAndRegisterConsumer(
      module.providers.values(),
      reflector,
      kafkaConsumerService,
    );
    searchSubscriberAndRegisterConsumer(
      module.controllers.values(),
      reflector,
      kafkaConsumerService,
    );
  }
}

function searchSubscriberAndRegisterConsumer(
  objects: any,
  reflector: Reflector,
  kafkaConsumerService: KafkaConsumerService,
) {
  for (const item of objects) {
    const instance = item.instance;
    if (!instance) continue;

    const prototype = Object.getPrototypeOf(instance);
    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
      if (!descriptor) continue;

      if (descriptor.get || descriptor.set) continue;

      const method = descriptor.value;
      if (!method || typeof method !== 'function') continue;

      const subscriber = reflector.get<Subscriber>(KAFKA_SUBSCRIBER, method);
      if (subscriber?.topic) {
        kafkaConsumerService.registerConsumer(
          subscriber.topic,
          `group-${subscriber.groupId ? subscriber.groupId : subscriber.topic}`,
          method.bind(instance),
        );
      }
    }
  }
}
