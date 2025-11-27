import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsEnum } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({
    example: 3,
    description: 'Updated quantity of the cart item',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiProperty({
    example: 'checked_out',
    description: 'Status of the cart item',
    required: false,
    enum: ['active', 'checked_out'],
  })
  @IsOptional()
  @IsEnum(['active', 'checked_out'])
  status?: 'active' | 'checked_out';
}
