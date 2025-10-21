import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from '../entities/menu.entity';
import { Restaurant } from '../entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Restaurant])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
