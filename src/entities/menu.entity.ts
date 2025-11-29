import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  promotionDetails: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  is_available: 'active' | 'inactive';

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => Restaurant, r => r.menus)
  restaurant: Restaurant;

  @OneToMany(() => MenuItem, mi => mi.menu)
  items: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}