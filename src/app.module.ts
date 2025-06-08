import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServersModule } from './servers/servers.module';
import { User } from './typeorm/entities/User';
import { RefreshToken } from './typeorm/entities/RefreshToken';
import { Server } from './typeorm/entities/Server';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        return {
          type: isProduction ? 'postgres' : 'mysql',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [User, RefreshToken, Server],
          autoLoadEntities: true,
          synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
        };
      },
    }),
    AuthModule,
    UsersModule,
    ServersModule,
  ],
})
export class AppModule {}
