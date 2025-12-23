import { File } from '@app/domain/models/file.model';
import { UploadFileCommand } from '@app/application/file/command/upload-file.command';
import { FileResponseDto } from '../dto/file-response.dto';

export class FileMapper {
  static toUploadCommand(file: any): UploadFileCommand {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const originalname = file.originalname as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const mimetype = file.mimetype as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const buffer = file.buffer as Buffer;

    return new UploadFileCommand(originalname, mimetype, buffer);
  }

  static toResponse(file: File): FileResponseDto {
    return {
      id: file.id!,
      name: file.name,
      path: file.path,
      type: file.type,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
