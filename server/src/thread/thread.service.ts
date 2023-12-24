import { Injectable } from '@nestjs/common';
import { FileCreateDto } from './dto/fileCreate.dto';
import { MessageCreateDto } from './dto/messageCreate.dto';
import { ReactToDBDto } from './dto/relateDB/reactToDB.dto';
import { ThreadToDBDto } from './dto/relateDB/threadToDB.dto';
import { ThreadRepository } from './thread.repository';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class ThreadService {
  constructor(
    private threadRepository: ThreadRepository,
    private commonService: CommonService,
  ) {}

  async createThread(
    messageCreateDto?: MessageCreateDto,
    fileCreateDto?: FileCreateDto,
    senderId?: string,
    receiveId?: string,
    channelId?: string,
    chatId?: string,
  ) {
    const threadToDb = this.compareToCreateThread(
      messageCreateDto,
      fileCreateDto,
      senderId,
      receiveId,
      channelId,
      chatId,
    );
    if (fileCreateDto) {
      const limitFileSize = this.limitFileSize(fileCreateDto.size);
      if (!limitFileSize) {
        return {
          success: false,
          message: 'File size is too large',
          errors: 'File size is too large',
          thread: null,
        };
      }
    }

    const thread = await this.threadRepository.createThread(threadToDb);
    return {
      thread,
    };
  }

  async updateThread(
    threadId: string,
    messageCreateDto?: MessageCreateDto,
    fileCreateDto?: FileCreateDto,
    senderId?: string,
    receiveId?: string,
    channelId?: string,
    chatId?: string,
  ) {
    const threadToDb = this.compareToCreateThread(
      messageCreateDto,
      fileCreateDto,
      senderId,
      receiveId,
      channelId,
      chatId,
      threadId,
    );

    const thread = await this.threadRepository.updateThread(threadToDb);
    const limitFileSize = this.limitFileSize(fileCreateDto.size);

    if (!limitFileSize) {
      return {
        success: false,
        message: 'File size is too large',
        errors: 'File size is too large',
        thread: null,
      };
    }
    return {
      thread,
    };
  }

  async deleteThread(threadId: string) {
    const thread = await this.threadRepository.deleteThread(threadId);
    return {
      thread,
    };
  }

  async createReplyThread(
    threadId: string,
    senderId?: string,
    messageCreateDto?: MessageCreateDto,
    fileCreateDto?: FileCreateDto,
  ) {
    const thread = this.compareToCreateThread(
      messageCreateDto,
      fileCreateDto,
      senderId,
      null,
      null,
      null,
      threadId,
    );

    await this.threadRepository.createReplyThread(thread);
    if (fileCreateDto) {
      const limitFileSize = this.limitFileSize(fileCreateDto.size);

      if (!limitFileSize) {
        return {
          success: false,
          message: 'File size is too large',
          errors: 'File size is too large',
          thread: null,
        };
      }
    }
    return {
      success: true,
      message: 'Create reply thread success',
      errors: null,
      thread: null,
    };
  }

  async addReact(react: string, threadId: string, senderId: string) {
    const reactToDb = this.compareToCreateReact(react, threadId, senderId);
    const thread = await this.threadRepository.addReact(reactToDb);
    return {
      thread,
    };
  }

  async removeReact(threadId: string, senderId: string) {
    const reactToDb = this.compareToCreateReact(null, threadId, senderId);
    const thread = await this.threadRepository.removeReact(reactToDb);
    return {
      thread,
    };
  }

  async getAllThread(type: string, id: string, req) {
    const threads = await this.threadRepository.getAllThread(type, id);
    const newThreads = threads.map((item) => {
      const newAvatar = this.commonService.transferImageToUrl(
        req,
        item.user?.avatar,
      );
      delete item.user?.password;
      return {
        ...item,
        files: item.files.map((file) => {
          return {
            ...file,
            size: this.convertToMB(file.size),
          };
        }),
        user: {
          ...item.user,
          avatar: newAvatar,
        },
        replys:
          item.replys.length > 0 &&
          item.replys.map((rep) => {
            delete rep.user?.password;
            return {
              ...rep,
              user: {
                ...rep.user,
                avatar: this.commonService.transferImageToUrl(
                  req,
                  rep.user.avatar,
                ),
              },
              files: rep.files.map((file) => {
                return {
                  ...file,
                  size: this.convertToMB(file.size),
                };
              }),
            };
          }),
      };
    });
    return newThreads;
  }

  async getThreadById(threadId: string) {
    const thread = await this.threadRepository.getThreadById(threadId);
    return thread;
  }

  async getThreadByReceiveId(receiveId: string) {
    const thread = await this.threadRepository.getThreadByReceiveId(receiveId);
    return thread;
  }

  async findByText(text: string) {
    const findByText = await this.threadRepository.findByText(text);
    const data = findByText.map((item) => {
      return {
        ...item,
      };
    });
    return data;
  }

  async findByDate(from: string, to?: string) {
    const threads = await this.threadRepository.findByDate(from, to);
    return threads;
  }

  private compareToCreateThread(
    messageCreateDto?: MessageCreateDto,
    fileCreateDto?: FileCreateDto,
    senderId?: string,
    receiveId?: string,
    channelId?: string,
    chatId?: string,
    threadId?: string,
  ): ThreadToDBDto {
    return {
      messages: messageCreateDto,
      file: fileCreateDto
        ? {
            ...fileCreateDto,
          }
        : null,
      senderId,
      receiveId,
      channelId,
      chatId,
      threadId,
    };
  }

  private compareToCreateReact(
    reactCreateDto?: string,
    threadId?: string,
    userId?: string,
  ): ReactToDBDto {
    return {
      react: reactCreateDto,
      threadId,
      userId,
    };
  }

  private convertDateToDB(date: string) {
    const convert = new Date(date);
    const year = convert.getFullYear();
    const month =
      convert.getMonth() + 1 < 10
        ? `0${convert.getMonth() + 1}`
        : convert.getMonth() + 1;

    const day = convert.getDate();

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  private convertToMB = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    return mb.toFixed(2);
  };

  private limitFileSize = (bytes: number) => {
    const fileSize = bytes / 1024 / 1024; // MB
    if (fileSize > 10) {
      return false;
    }
    return true;
  };
  transformFile(file) {
    return {
      ...file,
      size: this.convertToMB(file.size),
    };
  }

  transformUser(req, user) {
    return {
      ...user,
      avatar: this.commonService.transferImageToUrl(req, user.avatar),
    };
  }

  transformReply(req, reply) {
    return {
      ...reply,
      user: this.transformUser(req, reply.user),
      files: reply.files.map((file) => this.transformFile(file)),
    };
  }

  transformThread(req, thread) {
    return {
      ...thread,
      files: thread.files.map((file) => this.transformFile(file)),
      user: this.transformUser(req, thread.user),
      replys: thread.replys.map((reply) => this.transformReply(req, reply)),
    };
  }
}
