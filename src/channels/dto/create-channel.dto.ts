import { IsString, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ChannelType } from 'src/typeorm/entities/Channel';

export class CreateChannelDto {
  @ApiProperty({
    description: 'The name of the channel',
    maxLength: 100,
    example: 'general',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The type of the channel',
    enum: ChannelType,
    example: ChannelType.TEXT,
  })
  @IsEnum(ChannelType)
  @IsNotEmpty()
  type: ChannelType;
}

export class ChannelResponseDto {
  @ApiProperty({
    description: 'The ID of the channel',
    example: 1,
  })
  server_id: number;

  @ApiProperty({
    description: 'The ID of the channel',
    example: 1,
  })
  channel_id: number;

  @ApiProperty({
    description: 'The name of the channel',
    example: 'general',
  })
  name: string;

  @ApiProperty({
    description: 'The type of the channel',
    enum: ChannelType,
    example: ChannelType.TEXT,
  })
  type: ChannelType;

  @ApiProperty({
    description: 'The created date of the channel',
    example: '2021-01-01',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The updated date of the channel',
    example: '2021-01-01',
  })
  updated_at: Date;
}

export class CreateChannelResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Channel created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    description: 'The created channel',
    type: ChannelResponseDto,
  })
  data: ChannelResponseDto;
}

export class getChannelByIdResponseDto {
  @ApiProperty({
    description: 'The ID of the server',
    example: 1,
  })
  channel_id: number;

  @ApiProperty({
    description: 'The name of the channel',
    example: 'general',
  })
  name: string;

  @ApiProperty({
    description: 'The type of the channel',
    enum: ChannelType,
    example: ChannelType.TEXT,
  })
  type: ChannelType;

  @ApiProperty({
    description: 'The created date of the channel',
    example: '2021-01-01',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The updated date of the channel',
    example: '2021-01-01',
  })
  updated_at: Date;
}

export class DeleteChannelResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Channel deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
  @ApiProperty({
    description: 'The name of the channel',
    example: "news",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The type of the channel',
    enum: ChannelType,
    example: ChannelType.TEXT,
  })
  type: ChannelType;
}