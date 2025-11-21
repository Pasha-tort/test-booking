import { IDatabaseConfig } from "./database-config.interface";

export interface IMicroservice {
  readonly swaggerEnable?: boolean;
  readonly prefix?: string;
  readonly url: string;
  readonly port: string;
  readonly database?: IDatabaseConfig;
  readonly host?: string;
}

export interface IMicroservicesConfig {
  api: IMicroservice;
  booking: IMicroservice;
}

export type AppKey = keyof IMicroservicesConfig;
