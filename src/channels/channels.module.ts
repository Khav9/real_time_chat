import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { Channel } from '../typeorm/entities/Channel';
import { Server } from '../typeorm/entities/Server';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Server])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
