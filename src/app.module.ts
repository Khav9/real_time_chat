import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/entities/User';
import { RefreshToken } from './typeorm/entities/RefreshToken';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Makes env config available across all modules
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, RefreshToken],
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Use only in development
      }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
