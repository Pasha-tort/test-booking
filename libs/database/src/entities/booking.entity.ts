import { BookingStatusEnum } from '@libs/shared';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableEntity } from './table.entity';
import { RestaurantEntity } from './restaurants.entity';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int4')
  guestCount: number;

  @Column('timestamptz')
  date: Date;

  @ManyToOne(() => RestaurantEntity)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantEntity;

  @Column('uuid')
  restaurantId: string;

  @ManyToOne(() => TableEntity, { nullable: true })
  @JoinColumn({ name: 'table_id' })
  table?: TableEntity;

  @Column('uuid', { nullable: true })
  tableId?: string;

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.CREATED,
  })
  status: BookingStatusEnum;
}
