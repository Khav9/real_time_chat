import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body(new ValidationPipe({ transform: true })) signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto.username, signInDto.password, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(
    @Body(new ValidationPipe({ transform: true })) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.email,
      res,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    return this.authService.refreshTokens(refreshToken, res);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;
    return this.authService.logout(refreshToken, req.user.sub, res);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.authService.getUserProfile(req.user.sub);
    return {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
