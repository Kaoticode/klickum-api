import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { CreateUserAuthDto } from './createUser.auth.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserAuthDto extends PartialType(CreateUserAuthDto) {}
