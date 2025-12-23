import { UploadFileCommand } from '@app/application/file/command/upload-file.command';
import type { File } from '@app/domain/models/file.model';
import { CommandBus } from '@app/infrastructure/config/command-bus.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileResponseDto } from './dto/file-response.dto';
import { FileMapper } from './mappers/file.mapper';

@Controller('files')
export class FileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('upload')
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
}
