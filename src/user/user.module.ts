import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserTransaccionService } from './user.transaccion.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepository, UserTransaccionService],
  exports: [UserService, UserTransaccionService],
  controllers: [UserController],
})
export class UserModule {}
