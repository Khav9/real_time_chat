import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  async createUser(
    username: string,
    password_hash: string,
    email: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      username,
      password_hash,
      email,
    });
    return this.usersRepository.save(user);
  }

  async findById(userId: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { user_id: userId },
    });
    return user || undefined;
  }
}
