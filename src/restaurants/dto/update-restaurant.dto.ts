// src/restaurants/dto/update-restaurant.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @ApiProperty({ example: 'New Name', description: 'New restaurant name', required: false })
  @IsOptional()
  @IsString()
  restaurant_name?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../restaurant.jpg', description: 'Image url (after upload)', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}
