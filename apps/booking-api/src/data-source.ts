import { MicroservicesConfig } from '@libs/configuration';
import { OutBoxEntity } from './entities';
import {
  BookingEntity,
  getDataSourceOptions,
  RestaurantEntity,
  TableEntity,
} from '@libs/database';

const dataSourceObj = getDataSourceOptions(
  MicroservicesConfig.bookingApi.database,
  {
    entities: [BookingEntity, OutBoxEntity, TableEntity, RestaurantEntity],
  },
);

export const { dataSourceOptions } = dataSourceObj;

export default dataSourceObj.dataSource;
