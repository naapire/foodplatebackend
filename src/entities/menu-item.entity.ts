import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Menu } from './menu.entity';
import { Restaurant } from './restaurant.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  deliverySpeed: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Menu, m => m.items)
  menu: Menu;

  @ManyToOne(() => Restaurant, r => r.menuItems)
  restaurant: Restaurant;
}