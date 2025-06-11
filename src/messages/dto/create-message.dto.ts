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
