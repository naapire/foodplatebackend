import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUrl, IsUUID } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Vida Menu', description: 'Menu display name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '20% off on all pancakes', description: 'Promotion details', required: false })
  @IsOptional()
  @IsString()
  promotionDetails?: string;

  @ApiProperty({ example: true, description: 'Is menu available?' })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @ApiProperty({ example: 'https://cdn.example.com/images/menu.jpg', description: 'Menu image url', required: false })
  @IsOptional()
  @IsUrl()
  image_url?: string;

  @ApiProperty({ example: 'restaurant-uuid', description: 'Restaurant UUID this menu belongs to' })
  @IsUUID()
  restaurantId: string;
}
