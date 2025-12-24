import type { ICommand } from '@app/application/utils/command.interface';

interface FileData {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
}

export class CreateProductWithFilesCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly details: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly files?: FileData[],
  ) {}
}
