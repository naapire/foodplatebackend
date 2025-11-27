import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from 'src/entities/cart.entity';
import { MenuItem } from 'src/entities/menu-item.entity';
import { User } from 'src/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, MenuItem, User])
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}
