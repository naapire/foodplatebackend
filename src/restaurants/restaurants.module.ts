import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/entities/restaurant.entity';
import { Menu } from 'src/entities/menu.entity';

@Module({
imports: [
    TypeOrmModule.forFeature([Restaurant, Menu]),
    CloudinaryModule, // provides CloudinaryService
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
