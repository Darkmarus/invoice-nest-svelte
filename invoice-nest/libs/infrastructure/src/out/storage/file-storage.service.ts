import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class FileStorageService {
  constructor(private readonly configService: ConfigService) {}

  async saveFile(originalName: string, buffer: Buffer): Promise<string> {
    const uploadFolder = this.configService.get<string>(
      'UPLOAD_FOLDER',
      './uploads',
    );

    // Ensure upload folder exists
    await fs.mkdir(uploadFolder, { recursive: true });

    // Generate unique filename
    const fileExtension = originalName.split('.').pop();
    const uniqueName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadFolder, uniqueName);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    return filePath;
  }
}
