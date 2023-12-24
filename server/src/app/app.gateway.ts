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
      user,
      receiveId,
      channelId,
      chatId,
    }: {
      messages?: MessageCreateDto;
      fileCreateDto?: FileCreateDto;
      user?: any;
      receiveId?: string;
      channelId?: string;
      chatId?: string;
    } = data;
    const rs = await this.threadService.createThread(
      messages,
      fileCreateDto,
      user.id,
      receiveId,
      channelId,
      chatId,
    );
    console.log(rs);
    this.server.emit('sendThread', data);
    // if (rs.success) {
    // }
  }

  @SubscribeMessage('updateThread')
  async handleSendUpdateThread(@MessageBody() data: any): Promise<void> {
    const {
      threadId,
      messageCreateDto,
      fileCreateDto,
      senderId,
      receiveId,
      channelId,
      chatId,
    }: {
      threadId: string;
      messageCreateDto?: MessageCreateDto;
      fileCreateDto?: FileCreateDto;
      senderId?: string;
      receiveId?: string;
      channelId?: string;
      chatId?: string;
    } = data;
    await this.threadService.updateThread(
      threadId,
      messageCreateDto,
      fileCreateDto,
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
      reactToDb,
      threadId,
      senderId,
    }: {
      reactToDb: string;
      threadId: string;
      senderId: string;
    } = data;
    await this.threadService.addReact(reactToDb, threadId, senderId);
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
