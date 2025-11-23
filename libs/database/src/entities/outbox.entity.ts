import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OutBoxSendingStatusEnum {
  PENDING = 'PENDING',
  SENT = 'SENT',
}

export enum OutBoxProcessStatusEnum {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FINISH = 'FINISH',
}

export abstract class OutBoxAbstractEntity<T extends object = any> {
  @PrimaryColumn('uuid')
  id: string;

  @Column('jsonb')
  payload: T;

  abstract eventType: string;

  @Column({
    type: 'enum',
    enum: OutBoxSendingStatusEnum,
    default: OutBoxSendingStatusEnum.PENDING,
  })
  statusSending: OutBoxSendingStatusEnum;

  @Column({
    type: 'enum',
    enum: OutBoxProcessStatusEnum,
    default: OutBoxProcessStatusEnum.PENDING,
  })
  statusProcess: OutBoxProcessStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
