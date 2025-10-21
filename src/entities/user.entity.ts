import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { Order } from './order.entity';

export enum UserRole { CUSTOMER = 'customer', ADMIN = 'admin', RECEPTIONIST = 'receptionist', CHEF = 'chef', RIDER = 'rider' }

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

//   @OneToMany(() => Cart, (c) => c.user)
//   carts: Cart[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
