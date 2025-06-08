import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from '../typeorm/entities/Server';
import { CreateServerDto } from './dto/server.dto';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Server)
    private serversRepository: Repository<Server>,
  ) {}

  async create(
    createServerDto: CreateServerDto,
    ownerId: number,
  ): Promise<Server> {
    const server = this.serversRepository.create({
      ...createServerDto,
      owner_id: ownerId,
    });
    return this.serversRepository.save(server);
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
    return this.serversRepository.find({
      where: { owner_id: ownerId },
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
