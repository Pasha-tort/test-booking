import { SetMetadata } from '@nestjs/common';

export const KAFKA_SUBSCRIBER = 'KAFKA_SUBSCRIBER';

export type Subscriber = { topic: string; groupId?: string };
export const KafkaSubscribe = (topic: string, groupId?: string) =>
  SetMetadata(KAFKA_SUBSCRIBER, { topic, groupId });
