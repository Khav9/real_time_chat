import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'access-token-xyz' })
  accessToken: string;
}


export class UserProfileDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh-token-xyz' })
  refreshToken: string;
}