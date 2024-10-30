import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { HashService } from 'src/common/services/hash.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RoleService } from 'src/role/role.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role } from 'src/role/model/role.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
        global: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  providers: [
    AuthService,
    UserService,
    HashService,
    LocalStrategy,
    JwtStrategy,
    RoleService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
