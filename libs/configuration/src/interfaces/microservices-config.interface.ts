import { IDatabaseConfig } from './database-config.interface';
import { IKafkaConfig } from './kafka-config.interface';

export interface IMicroservice {
  readonly swaggerEnable?: boolean;
  readonly prefix?: string;
  readonly url: string;
  readonly port: string;
  readonly database?: IDatabaseConfig;
  readonly kafka?: IKafkaConfig;
  readonly host?: string;
}

export interface IMicroservicesConfig {
  bookingApi: IMicroservice;
  bookingWorker: IMicroservice;
}

export type AppKey = keyof IMicroservicesConfig;
