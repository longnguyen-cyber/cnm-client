import { FileCreateDto } from '../fileCreate.dto';
import { MessageCreateDto } from '../messageCreate.dto';
import { ThreadCreateDto } from '../threadCreate.dto';

export class ThreadToDBDto extends ThreadCreateDto {
  senderId: string;
  chatId: string;
  channelId: string;
  threadId?: string;
  messages: MessageCreateDto;
  file: FileCreateDto;
}
