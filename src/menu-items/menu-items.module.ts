import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from 'src/entities/menu-item.entity';
import { Menu } from 'src/entities/menu.entity';
import { Restaurant } from 'src/entities/restaurant.entity';
import { MenuItemController } from './menu-items.controller';
import { MenuItemService } from './menu-items.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'; // <- import this

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem, Menu, Restaurant]),
    CloudinaryModule, // <- add here
  ],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}
