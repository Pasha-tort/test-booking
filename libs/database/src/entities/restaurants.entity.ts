import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TableEntity } from './table.entity';

@Entity('restaurants')
export class RestaurantEntity {
  @PrimaryColumn('uuid')
  id: string;

  @OneToMany(() => TableEntity, table => table.restaurant, {
    cascade: ['insert', 'update'],
  })
  tables: TableEntity[];
}
