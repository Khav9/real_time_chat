import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/typeorm/entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, user: User, channelId: number): Promise<Message> {
    const message = this.messagesRepository.create({
      ...createMessageDto,
      user_id: user.user_id,
      channel_id: channelId,
    });
    return await this.messagesRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return await this.messagesRepository.find({
      relations: ['user', 'channel'],
    });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { message_id: id },
      relations: ['user', 'channel'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async findByChannel(channelId: number): Promise<any[]> {
    const messages = await this.messagesRepository.find({
      where: { channel_id: channelId },
      relations: ['user', 'channel'],
      order: { created_at: 'ASC' },
    });

    return messages.map((message) => ({
      message_id: message.message_id,
      content: message.content,
      created_at: message.created_at,
      updated_at: message.updated_at,
      user: {
        username: message.user.username,
      },
    }));
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return await this.messagesRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messagesRepository.remove(message);
  }
}
