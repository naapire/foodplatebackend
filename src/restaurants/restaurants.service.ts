// src/restaurants/restaurants.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create restaurant. Accepts optional imageBuffer (from multipart file)
   * If imageBuffer provided, upload to Cloudinary and store url + public_id
   */
  async create(dto: CreateRestaurantDto, imageBuffer?: Buffer): Promise<Restaurant> {
    let image_url = dto.image_url;

    if (imageBuffer) {
      const uploadResult = await this.cloudinaryService.upload(imageBuffer, { folder: 'restaurants' });
      image_url = uploadResult.secure_url;
    }

    const payload: DeepPartial<Restaurant> = {
      restaurant_name: dto.restaurant_name,
      address: dto.address,
      location: dto.location,
      image_url,
    };

    const restaurant = this.restaurantRepo.create(payload);
    return this.restaurantRepo.save(restaurant);
  }

  /**
   * List restaurants with pagination and optional search
   */
   async findAll() {
    return this.restaurantRepo.find();
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id }, relations: ['menus', 'menuItems'] });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  /**
   * Update restaurant. If imageBuffer present, upload new and delete old image (if present).
   */
  async update(id: string, dto: UpdateRestaurantDto, imageBuffer?: Buffer): Promise<Restaurant> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // handle image replacement
    if (imageBuffer) {
      // upload new
      const uploadRes = await this.cloudinaryService.upload(imageBuffer, { folder: 'restaurants' });

      // delete old image from cloudinary if present
     

      restaurant.image_url = uploadRes.secure_url;
    } else if (typeof dto.image_url !== 'undefined') {
      // allow setting an image_url manually (not recommended if you're using uploads)
      restaurant.image_url = dto.image_url ?? null;
      // if setting manual image_url, clear public id (can't delete)
    }

    if (typeof dto.restaurant_name !== 'undefined') restaurant.restaurant_name = dto.restaurant_name;
    if (typeof dto.address !== 'undefined') restaurant.address = dto.address ?? null;
    if (typeof dto.location !== 'undefined') restaurant.location = dto.location ?? null;

    return this.restaurantRepo.save(restaurant);
  }

  /**
   * Remove restaurant and delete Cloudinary image if present.
   */
  async remove(id: string): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantRepo.findOne({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // delete cloudinary image if public id present
  
    const result = await this.restaurantRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Restaurant not found');
    return { deleted: true };
  }
  
}
