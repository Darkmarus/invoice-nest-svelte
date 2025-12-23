import type { ICommandHandler } from '@app/application/utils/command-handler.interface';
import { File } from '@app/domain/models/file.model';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { FileStorageService } from '@app/infrastructure/out/storage/file-storage.service';
import { UploadFileCommand } from '../upload-file.command';

export class UploadFileHandler implements ICommandHandler<
  UploadFileCommand,
  File
> {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async execute(command: UploadFileCommand): Promise<File> {
    // Save file to disk using infrastructure service
    const filePath = await this.fileStorageService.saveFile(
      command.originalName,
      command.buffer,
    );

    // Create file entity
    const file = File.create({
      name: command.originalName,
      path: filePath,
      type: command.mimeType,
    });

    // Save to database
    return await this.fileRepository.save(file);
  }
}
