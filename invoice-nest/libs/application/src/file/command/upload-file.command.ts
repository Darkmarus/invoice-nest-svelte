import type { ICommand } from '@app/application/utils/command.interface';

export class UploadFileCommand implements ICommand {
  constructor(
    public readonly originalName: string,
    public readonly mimeType: string,
    public readonly buffer: Buffer,
  ) {}
}
