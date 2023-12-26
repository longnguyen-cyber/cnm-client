import { Req } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'socket.io';
import { FileCreateDto } from 'src/thread/dto/fileCreate.dto';
import { MessageCreateDto } from 'src/thread/dto/messageCreate.dto';
import { ReactCreateDto } from 'src/thread/dto/reactCreate.dto';
import { ThreadService } from 'src/thread/thread.service';
@WebSocketGateway(8002, {
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  constructor(private threadService: ThreadService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendThread')
  async handleSendThread(@MessageBody() data: any): Promise<void> {
    const {
      messages,
      fileCreateDto,
      react,
      user,
      receiveId,
      channelId,
      chatId,
    }: {
      messages?: MessageCreateDto;
      fileCreateDto?: FileCreateDto;
      react?: ReactCreateDto;
      user?: any;
      receiveId?: string;
      channelId?: string;
      chatId?: string;
    } = data;
    console.log(data);
    const rs = await this.threadService.createThread(
      messages,
      fileCreateDto,
      react,
      user.id,
      receiveId,
      channelId,
      chatId,
    );
    this.server.emit('sendThread', data);
  }

  @SubscribeMessage('updateThread')
  async handleSendUpdateThread(@MessageBody() data: any): Promise<void> {
    const {
      threadId,
      messageCreateDto,
      fileCreateDto,
      reactCreateDto,
      senderId,
      receiveId,
      channelId,
      chatId,
    }: {
      threadId: string;
      messageCreateDto?: MessageCreateDto;
      fileCreateDto?: FileCreateDto;
      reactCreateDto?: ReactCreateDto;
      senderId?: string;
      receiveId?: string;
      channelId?: string;
      chatId?: string;
    } = data;
    await this.threadService.updateThread(
      threadId,
      messageCreateDto,
      fileCreateDto,
      reactCreateDto,
      senderId,
      receiveId,
      channelId,
      chatId,
    );
    this.server.emit('updateThread', data);
  }
  @SubscribeMessage('deleteThread')
  async handleDeleteThread(
    @MessageBody() data: any,
    @Req() req: Request,
  ): Promise<void> {
    const { id: threadId } = data;
    await this.threadService.deleteThread(threadId);
    const index = (
      await this.threadService.getAllThread('channelId', '2', req)
    ).findIndex((item) => item.threadId === threadId);
    this.server.emit('deleteThread', index);
  }
  @SubscribeMessage('addReact')
  async handleAddReact(@MessageBody() data: any): Promise<void> {
    const {
      react,
      quantity,
      threadId,
      senderId,
    }: {
      react: string;
      quantity: number;
      threadId: string;
      senderId: string;
    } = data;
    await this.threadService.addReact(react, quantity, threadId, senderId);
    this.server.emit('addReact', null);
  }
  @SubscribeMessage('unReact')
  async handleUnReact(@MessageBody() data: any): Promise<void> {
    const {
      threadId,
      senderId,
    }: {
      threadId: string;
      senderId: string;
    } = data;
    await this.threadService.removeReact(threadId, senderId);
    this.server.emit('unReact', null);
  }
}
