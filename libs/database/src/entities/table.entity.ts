import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RestaurantEntity } from './restaurants.entity';

@Entity('tables')
@Unique('UQ_RESTAURANT_TABLE_SEQUENCE', ['restaurantId', 'sequenceNumber'])
export class TableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestaurantEntity, restaurant => restaurant.tables)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantEntity;

  @Column('uuid')
  restaurantId: string;

  @Column('int4')
  sequenceNumber: number;

  @Column('int4')
  numberSeats: number;
}
