import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../typeorm/entities/Server';
import { CreateServerDto } from './dto/server.dto';
import { ChannelsService } from '../channels/channels.service';
import { ChannelType } from '../typeorm/entities/Channel';
import { ServerMembersService } from '../server_members/server_members.service';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private serversRepository: Repository<Server>,
    private channelsService: ChannelsService,
    private serverMembersService: ServerMembersService,
  ) {}

  async create(
    createServerDto: CreateServerDto,
    ownerId: number,
  ): Promise<Server> {
    const server = this.serversRepository.create({
      ...createServerDto,
      owner_id: ownerId,
    });
    const savedServer = await this.serversRepository.save(server);

    // Create default channels
    await this.channelsService.create(savedServer.server_id, {
      name: 'Welcome and Role',
      type: ChannelType.TEXT,
    });

    await this.channelsService.create(savedServer.server_id, {
      name: 'General',
      type: ChannelType.TEXT,
    });

    return savedServer;
  }

  async findAll(): Promise<Server[]> {
    return this.serversRepository.find({
      relations: {
        owner: true,
      },
      select: {
        server_id: true,
        name: true,
        owner_id: true,
        created_at: true,
        updated_at: true,
        owner: {
          user_id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Server> {
    const server = await this.serversRepository.findOne({
      where: { server_id: id },
      relations: {
        owner: true,
      },
      select: {
        server_id: true,
        name: true,
        owner_id: true,
        created_at: true,
        updated_at: true,
        owner: {
          user_id: true,
          username: true,
          email: true,
          created_at: true,
          updated_at: true,
        },
      },
    });

    if (!server) {
      throw new NotFoundException(`Server with ID ${id} not found`);
    }

    return server;
  }

  async findByOwnerId(ownerId: number): Promise<Server[]> {
    // Get servers owned by the user
    const ownedServers = await this.serversRepository.find({
      where: { owner_id: ownerId },
      relations: {
        owner: false,
      },
      select: {
        server_id: true,
        name: true,
        owner_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Get servers where user is a member
    const memberServers = await this.serversRepository
      .createQueryBuilder('server')
      .innerJoin(
        'server_members',
        'member',
        'member.server_id = server.server_id',
      )
      .where('member.user_id = :userId', { userId: ownerId })
      .andWhere('server.owner_id != :userId', { userId: ownerId })
      .select([
        'server.server_id',
        'server.name',
        'server.owner_id',
        'server.created_at',
        'server.updated_at',
      ])
      .getMany();

    // Combine both arrays and remove duplicates
    const allServers = [...ownedServers, ...memberServers];
    return allServers;
  }

  async update(id: number, updateServerDto: CreateServerDto): Promise<Server> {
    const server = await this.findOne(id);
    Object.assign(server, updateServerDto);
    return this.serversRepository.save(server);
  }

  async remove(id: number): Promise<void> {
    const server = await this.findOne(id);
    await this.serversRepository.remove(server);
  }
}
