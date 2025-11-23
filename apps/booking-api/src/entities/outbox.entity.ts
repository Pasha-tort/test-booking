import { OutBoxAbstractEntity } from '@libs/database';
import { TypeOutBoxEventEnum } from '../modules/outbox/types';
import { Column, Entity } from 'typeorm';

@Entity('outbox')
export class OutBoxEntity<
  T extends object = any,
> extends OutBoxAbstractEntity<T> {
  @Column({ type: 'enum', enum: TypeOutBoxEventEnum, enumName: 'outbox_event' })
  eventType: TypeOutBoxEventEnum;
}
