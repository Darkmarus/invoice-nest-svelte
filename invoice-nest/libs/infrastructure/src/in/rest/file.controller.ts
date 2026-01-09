import { UploadFileCommand } from '@app/application/file/command/upload-file.command';
import type { File } from '@app/domain/models/file.model';
import { CommandBus } from '@app/infrastructure/config/command-bus.service';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { FileResponseDto } from './dto/file-response.dto';
import { FileMapper } from './mappers/file.mapper';

@Controller()
export class FileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
  ) {}

  @Post('files/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file or data' })
  async upload(@UploadedFile() file: any): Promise<FileResponseDto> {
    const command = FileMapper.toUploadCommand(file);
    const uploadedFile = await this.commandBus.execute<UploadFileCommand, File>(
      command,
    );
    return FileMapper.toResponse(uploadedFile);
  }

  @Get('uploads/:filename')
  @ApiOperation({ summary: 'Get uploaded file' })
  @ApiResponse({
    status: 200,
    description: 'File served successfully',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const uploadFolder = this.configService.get<string>(
      'UPLOAD_FOLDER',
      './uploads',
    );
    const filePath = join(process.cwd(), uploadFolder, filename);

    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        throw new NotFoundException('File not found');
      }

      res.sendFile(filePath);
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
