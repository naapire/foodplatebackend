import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Mama K Restaurant', description: 'Human-friendly restaurant name' })
  @IsString()
  restaurant_name: string;

  @ApiProperty({ example: 'No. 5 High Street, Accra', description: 'Full address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '5.6037, -0.1870', description: 'Location coordinates or human-readable location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  // image will be uploaded via multipart/form-data; API docs benefit from a url example
  @ApiProperty({ example: 'https://res.cloudinary.com/.../restaurant.jpg', description: 'Image url (after upload)', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}
