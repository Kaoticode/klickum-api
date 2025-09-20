import { MessagePayload } from './messagePayload';

export abstract class MessageStrategy {
  abstract sendMessage(payload: MessagePayload): Promise<void>;
  abstract exists(payload: Partial<MessagePayload>): Promise<boolean>;
}
