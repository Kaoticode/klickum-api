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
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    RoleModule,
    AddressModule,
  ],
  providers: [UserService, UserRepository, UserTransaccionService, HashService],
  exports: [UserService, UserTransaccionService],
  controllers: [UserController],
})
export class UserModule {}
