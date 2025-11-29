import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class LoginDto {
  // allow either email or phoneNumber for login
  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '+233201234567', required: false })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'supersecret' })
  @IsString()
  @MinLength(6)
  password: string;
}
