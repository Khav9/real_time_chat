import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { Server } from '../typeorm/entities/Server';
import { ChannelsModule } from '../channels/channels.module';
import { ServerMembersModule } from '../server_members/server_members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Server]),
    ChannelsModule,
    ServerMembersModule,
  ],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
