import { Module } from '@nestjs/common';
import { MessageStrategy } from './domain/messageStratergy';
import { WhatsappService } from './services/whatsapp.service';
import { ConfigModule } from '@nestjs/config';

const providers = [
  {
    provide: MessageStrategy.name,
    useClass: WhatsappService,
  },
];

@Module({
  imports: [ConfigModule],
  providers,
  exports: [...providers],
})
export class MessageGatewayModule {}
