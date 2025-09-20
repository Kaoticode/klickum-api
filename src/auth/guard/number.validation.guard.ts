import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MessageStrategy } from 'src/messageGateway/domain/messageStratergy';

@Injectable()
export class NumberValidationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(MessageStrategy.name)
    private readonly messageStrategy: MessageStrategy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { phone } = request.body;

    if (!phone) {
      throw new BadRequestException('Phone number is required');
    }

    const numberExists = await this.messageStrategy.exists({ number: phone });

    if (!numberExists) {
      throw new BadRequestException('Phone number is not valid');
    }
    return true;
  }
}
