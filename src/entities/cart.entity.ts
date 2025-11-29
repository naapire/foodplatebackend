import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';
import { MenuItem } from './menu-item.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => MenuItem, menuItem => menuItem.cartItems, { eager: true })
  menuItem: MenuItem;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ['active', 'checked_out', 'removed'],
    default: 'active',
  })
  status: 'active' | 'checked_out' | 'removed';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}