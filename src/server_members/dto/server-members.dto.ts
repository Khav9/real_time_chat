import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { User } from 'src/typeorm/entities/User';

export class ServerMembersDto {
  @ApiProperty({
    description: 'The server id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  serverId: number;

  @ApiProperty({
    description: 'The user id to add to the server',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}


export class ServerMembersResponseDto {
  @ApiProperty({
    description: 'The server member id',
    example: 1,
  })
  serverMemberId: number;

  @ApiProperty({
    description: 'The user id',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'The server id',
    example: 1,
  })
  serverId: number;

  @ApiProperty({
    description: 'The user',
    example: {
      username: 'test',
      email: 'test@gmail.com',
    },
  })
  user: User;

  @ApiProperty({
    description: 'The created at',
    example: '2025-06-14T16:31:03.205Z',
  })
  createdAt: Date;
}