import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsIn } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Classic Pancakes', description: 'Name of the menu item' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 7.99, description: 'Price of the menu item' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Delicious homemade pancakes served with syrup',
    description: 'Description of the menu item',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'restaurant-uuid', description: 'Restaurant UUID this item belongs to' })
  @IsUUID()
  restaurantId: string;

   @ApiProperty({ example: 'active', enum: ['active', 'inactive'], description: 'Menu availability status' })
    @IsOptional()
    @IsIn(['active', 'inactive'])
    is_available?: 'active' | 'inactive';

  @ApiProperty({ example: 'menu-uuid', description: 'Menu UUID this item belongs to' })
  @IsUUID()
  menuId: string;

  @ApiProperty({
    example: 'https://cdn.example.com/images/pancake.jpg',
    description: 'Optional image URL if no file uploaded',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
