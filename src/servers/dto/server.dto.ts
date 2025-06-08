import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateServerDto {
  @ApiProperty({
    description: 'The name of the server',
    example: 'My Discord Server',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

export class OwnerDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  user_id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The creation timestamp of the user',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The last update timestamp of the user',
  })
  updated_at: Date;
}

export class ServerResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Server updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}

export class CreateServerResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Server created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;
}

export class ServerListResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Servers retrieved successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'List of servers',
    type: [ServerResponseDto],
  })
  data: ServerResponseDto[];
}
