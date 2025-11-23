import * as config from 'config';
import { IMicroservicesConfig } from './interfaces';
import { IRedisConfig } from './interfaces';

export const QueueConfig = config.get<IRedisConfig>('queue') as IRedisConfig;
