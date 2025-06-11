import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, this is a test message!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}



export class MessageResponseDto {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, this is a test message!',
  })
  content: string;

  @ApiProperty({
    description: 'The created_at of the message',
    example: '2025-06-11T09:31:50.306Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'The updated_at of the message',
    example: '2025-06-11T09:31:50.306Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: 'The user of the message',
    example: {
      username: 'luffy',
    },
  })
  user: {
    username: string;
  };
}