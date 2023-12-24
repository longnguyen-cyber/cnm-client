/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
//porker
@ApiTags('uploads')
@Controller('uploads')
export class UploadController {
  @Get(':filename')
  async serveFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    res.sendFile(filename, { root: './uploads' });
  }
  @Get(':filename')
  getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const file = createReadStream(
      join(__dirname, '..', '..', 'uploads', filename),
    );
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return new StreamableFile(file);
  }
  //get All file
  @Get()
  async serveFiles(@Res() res: Response): Promise<void> {
    console.log('get all file');
    res.sendFile('uploads', { root: './' });
  }
}
