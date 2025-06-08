import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../typeorm/entities/Server';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/create-channel.dto';
import { Channel } from 'src/typeorm/entities/Channel';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Server)
    private serversRepository: Repository<Server>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async create(
    serverId: number,
    createChannelDto: CreateChannelDto,
  ): Promise<Channel> {
    const channel = this.channelsRepository.create({
      ...createChannelDto,
      server_id: serverId,
    });
    return this.channelsRepository.save(channel);
  }

  async findAll(): Promise<Channel[]> {
    return this.channelsRepository.find({
      select: {
        server_id: true,
        name: true,
        type: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async findOne(id: number): Promise<Channel> {
    const channel = await this.channelsRepository.findOne({
      where: { channel_id: id },
      select: {
        channel_id: true,
        server_id: true,
        name: true,
        type: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }

    return channel;
  }

  async findByServerId(serverId: number): Promise<Channel[]> {
    return this.channelsRepository.find({
      where: { server_id: serverId },
      select: {
        channel_id: true,
        server_id: true,
        name: true,
        type: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<Channel> {
    const channel = await this.findOne(id);
    Object.assign(channel, updateChannelDto);
    return this.channelsRepository.save(channel);
  }

  async remove(id: number): Promise<void> {
    const channel = await this.findOne(id);
    await this.channelsRepository.remove(channel);
  }
}
