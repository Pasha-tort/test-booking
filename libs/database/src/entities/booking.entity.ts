import { BookingStatusEnum } from '@libs/shared';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn('uuid')
  restaurantId: string;

  @Column('int4')
  guestCount: number;

  @Column('timestamptz')
  date: Date;

  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.CREATED,
  })
  status: BookingStatusEnum;
}
