import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerMember } from 'src/typeorm/entities/ServerMember';
import { Repository } from 'typeorm';
import { ServerMembersDto } from './dto/server-members.dto';

@Injectable()
export class ServerMembersService {
  constructor(
    @InjectRepository(ServerMember)
    private serverMembersRepository: Repository<ServerMember>,
  ) {}

  async create(serverMemberDto: ServerMembersDto): Promise<void> {
    // Check if user is already a member of the server
    const existingMember = await this.serverMembersRepository.findOne({
      where: {
        server_id: serverMemberDto.serverId,
        user_id: serverMemberDto.userId,
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this server');
    }

    const newServerMember = this.serverMembersRepository.create({
      server_id: serverMemberDto.serverId,
      user_id: serverMemberDto.userId,
    });
    await this.serverMembersRepository.save(newServerMember);
  }

  async remove(serverId: number, userId: number): Promise<void> {
    const result = await this.serverMembersRepository.delete({
      server_id: serverId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Server member not found for server ${serverId} and user ${userId}`,
      );
    }
  }

  async findAll(serverId: number): Promise<ServerMember[]> {
    const serverMembers = await this.serverMembersRepository.find({
      where: {
        server_id: serverId,
      },
      relations: ['user'],
      select: {
        user: {
          username: true,
          email: true,
        },
      },
    });
    return serverMembers;
  }
}
