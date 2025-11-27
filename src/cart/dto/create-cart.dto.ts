import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: '68194069-041b-4999-adda-f4965d4c3a2f',
    description: 'The UUID of the menu item being added to the cart',
  })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the menu item to add',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
