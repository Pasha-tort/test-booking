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
    // for (const provider of module.providers.values()) {
    //   const instance = provider.instance;
    //   if (!instance) continue;

    //   const prototype = Object.getPrototypeOf(instance);
    //   for (const methodName of Object.getOwnPropertyNames(prototype)) {
    //     const method = prototype[methodName];
    //     if (!method) continue;

    //     const topic = reflector.get<string>(KAFKA_SUBSCRIBER, method);
    //     if (topic) {
    //       kafkaConsumerService.registerConsumer(
    //         topic,
    //         `group-${topic}`,
    //         method.bind(instance),
    //       );
    //     }
    //   }
    // }
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
    // for (const controller of module.controllers.values()) {
    //   const instance = controller.instance;
    //   if (!instance) continue;

    //   const prototype = Object.getPrototypeOf(instance);
    //   for (const methodName of Object.getOwnPropertyNames(prototype)) {
    //     const method = prototype[methodName];
    //     if (!method) continue;

    //     const topic = reflector.get<string>(KAFKA_SUBSCRIBER, method);
    //     if (topic) {
    //       kafkaConsumerService.registerConsumer(
    //         topic,
    //         `group-${topic}`,
    //         method.bind(instance),
    //       );
    //     }
    //   }
    // }
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
      const method = prototype[methodName];
      if (!method) continue;

      const { topic, groupId } = reflector.get<Subscriber>(
        KAFKA_SUBSCRIBER,
        method,
      );
      if (topic) {
        kafkaConsumerService.registerConsumer(
          topic,
          `group-${groupId ? groupId : topic}`,
          method.bind(instance),
        );
      }
    }
  }
}
