import { MicroservicesConfig } from '@libs/configuration';
import { getDataSourceOptions } from '@libs/database';
import { BookingEntity } from './modules';

const dataSourceObj = getDataSourceOptions(
  MicroservicesConfig.bookingApi.database,
  {
    entities: [BookingEntity],
  },
);

export const { dataSourceOptions } = dataSourceObj;

export default dataSourceObj.dataSource;
