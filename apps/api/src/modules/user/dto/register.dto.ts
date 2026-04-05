import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { UserApi } from '@solverse/shared'

export class FullNameDto implements UserApi.Register.FullName {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName!: string

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName!: string
}

export class RegisterDto implements UserApi.Register.Request {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  username!: string

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string

  @ApiProperty({ type: FullNameDto })
  @ValidateNested()
  @Type(() => FullNameDto)
  name!: FullNameDto

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ enum: ['superAdmin', 'businessOwner', 'locationOwner'] })
  @IsEnum(['superAdmin', 'businessOwner', 'locationOwner'])
  role!: 'superAdmin' | 'businessOwner' | 'locationOwner'

  @ApiProperty({ example: 'America/New_York' })
  @IsNotEmpty()
  @IsString()
  timezone!: string

  @ApiPropertyOptional({ example: '+12025551234' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string
}
