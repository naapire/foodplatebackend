import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsEmail, MinLength, IsPhoneNumber } from 'class-validator';
import { TrimAndNullify } from 'src/common/utils/shared-phone-transform';
import { IsPhoneForCountry } from 'src/common/validators/is-phone-for-country.validator';


export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '0591552809',
    description: 'Phone number (local format for Ghana)',
  })
  @IsOptional()
  @IsString()
  @TrimAndNullify()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsPhoneForCountry('phoneCountryCode', {
    message:
      'Invalid Ghana phone number. Must be 10 digits and start with a valid Ghana prefix (e.g. 059,024).',
  })
  phoneNumber?: string;

  @ApiProperty({ example: 'supersecret', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
