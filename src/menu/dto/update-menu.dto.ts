import { PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  // If you want the restaurant to be updatable, keep restaurantId optional here
  @ApiProperty({ example: 'restaurant-uuid', description: 'Restaurant UUID (if changing menu owner)', required: false })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;
}
