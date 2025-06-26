import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenService } from './refresh-token.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  private async generateTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '15m', // Access token expires in 15 minutes
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: '7d', // Refresh token expires in 7 days
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signIn(
    username: string,
    pass: string,
    res: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.user_id, user.username);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await this.refreshTokenService.createRefreshToken(
      user,
      tokens.refresh_token,
      expiresAt,
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      access_token: tokens.access_token,
    };
  }

  async register(
    username: string,
    password: string,
    email: string,
    res: Response,
  ) {
    // Check if user already exists
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await this.usersService.createUser(
      username,
      password_hash,
      email,
    );

    // Generate tokens
    const tokens = await this.generateTokens(newUser.user_id, newUser.username);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await this.refreshTokenService.createRefreshToken(
      newUser,
      tokens.refresh_token,
      expiresAt,
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      access_token: tokens.access_token,
    };
  }

  async refreshTokens(refreshToken: string, res: Response) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findOne(payload.username);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verify token exists in database
      const storedToken = await this.refreshTokenService.findRefreshToken(
        refreshToken,
        user.user_id,
      );
      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user.user_id, user.username);

      // Update refresh token in database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
      await this.refreshTokenService.deleteRefreshToken(
        refreshToken,
        user.user_id,
      );
      await this.refreshTokenService.createRefreshToken(
        user,
        tokens.refresh_token,
        expiresAt,
      );

      // Set new refresh token in HTTP-only cookie
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        access_token: tokens.access_token,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string, userId: number, res: Response) {
    // Delete refresh token from database
    await this.refreshTokenService.deleteRefreshToken(refreshToken, userId);

    // Clear refresh token cookie
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  async getUserProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // return user.username, email, created_at, updated_at
    // Note: Adjust the return type as per your UserProfileDto definition
    return {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
