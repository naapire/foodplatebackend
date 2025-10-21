import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Menu } from './menu.entity';
import { MenuItem } from './menu-item.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurant_name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  location: string; // optionally store geo as POINT or lat/lng columns

  @OneToMany(() => Menu, (m) => m.restaurant)
  menus: Menu[];

  @OneToMany(() => MenuItem, (mi) => mi.restaurant)
  menuItems: MenuItem[];
}
