import { MicroservicesConfig } from '@libs/configuration';
import {
  getDataSourceOptions,
  RestaurantEntity,
  TableEntity,
} from '@libs/database';
import { BookingEntity } from '@libs/database';

const dataSourceObj = getDataSourceOptions(
  MicroservicesConfig.bookingWorker.database,
  {
    entities: [BookingEntity, RestaurantEntity, TableEntity],
  },
);

export const { dataSourceOptions } = dataSourceObj;

export default dataSourceObj.dataSource;
