import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserTransaccionService } from './user.transaccion.service';
import { AuthModule } from '../auth/auth.module';
import { RoleModule } from '../role/role.module';
import { HashService } from '../common/services/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, RoleModule],
  providers: [UserService, UserRepository, UserTransaccionService, HashService],
  exports: [UserService, UserTransaccionService],
  controllers: [UserController],
})
export class UserModule {}
