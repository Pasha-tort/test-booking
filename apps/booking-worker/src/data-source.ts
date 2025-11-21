import { MicroservicesConfig } from '@libs/configuration';
import { getDataSourceOptions } from '@libs/database';
import { BookingEntity } from '@libs/database';

const dataSourceObj = getDataSourceOptions(
  MicroservicesConfig.bookingWorker.database,
  {
    entities: [BookingEntity],
  },
);

export const { dataSourceOptions } = dataSourceObj;

export default dataSourceObj.dataSource;
