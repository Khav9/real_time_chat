import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../typeorm/entities/RefreshToken';
import { User } from '../typeorm/entities/User';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const hashedToken = await bcrypt.hash(token, 10);
    const refreshToken = this.refreshTokenRepository.create({
      token: hashedToken,
      expiresAt,
      user,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async findRefreshToken(
    token: string,
    userId: number,
  ): Promise<RefreshToken | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { user: { user_id: userId } },
      relations: ['user'],
    });

    if (!refreshToken) {
      return null;
    }

    const isTokenValid = await bcrypt.compare(token, refreshToken.token);
    if (!isTokenValid) {
      return null;
    }

    return refreshToken;
  }

  async deleteRefreshToken(token: string, userId: number): Promise<void> {
    const refreshToken = await this.findRefreshToken(token, userId);
    if (refreshToken) {
      await this.refreshTokenRepository.remove(refreshToken);
    }
  }

  async deleteAllRefreshTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.delete({ user: { user_id: userId } });
  }
}
