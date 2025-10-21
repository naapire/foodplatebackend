import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUrl, IsUUID, IsIn } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Vida Menu', description: 'Menu display name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '20% off on all pancakes', description: 'Promotion details', required: false })
  @IsOptional()
  @IsString()
  promotionDetails?: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive'], description: 'Menu availability status' })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  is_available?: 'active' | 'inactive';

  @ApiProperty({ example: 'https://cdn.example.com/images/menu.jpg', description: 'Menu image url', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ example: 'restaurant-uuid', description: 'Restaurant UUID this menu belongs to' })
  @IsUUID()
  restaurantId: string;
}
