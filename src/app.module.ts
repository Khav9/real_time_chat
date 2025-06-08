import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ⬅️ Import TypeOrmModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/entities/User';
import { RefreshToken } from './typeorm/entities/RefreshToken';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      entities: [User, RefreshToken],
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // ✅ your MySQL username
      password: '@My#db2025!', // ✅ your MySQL password
      database: 'real_time_chat', // ✅ your database name
      autoLoadEntities: true, // ✅ automatically load entities from all modules
      synchronize: true, // ⚠️ true for dev only; don't use in production
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
