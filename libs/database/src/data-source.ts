import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './strategy';
import { IDatabaseConfig } from '@libs/configuration/interfaces';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export function getDataSourceOptions(
  databaseConfig: IDatabaseConfig,
  extra: Omit<Partial<PostgresConnectionOptions>, 'type' | 'driver'> = {},
) {
  const dataSourceOptions: DataSourceOptions = {
    ...databaseConfig,
    logging: false,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    ...extra,
  };
  return {
    dataSourceOptions,
    dataSource: new DataSource(dataSourceOptions),
  };
}
