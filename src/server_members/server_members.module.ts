import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMembersService } from './server_members.service';
import { ServerMembersController } from './server_members.controller';
import { ServerMember } from '../typeorm/entities/ServerMember';

@Module({
  imports: [TypeOrmModule.forFeature([ServerMember])],
  providers: [ServerMembersService],
  controllers: [ServerMembersController],
  exports: [ServerMembersService],
})
export class ServerMembersModule {}
