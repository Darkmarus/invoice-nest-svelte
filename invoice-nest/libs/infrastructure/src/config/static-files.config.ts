import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';

export const staticFilesFactory = (
  configService: ConfigService,
): ServeStaticModuleOptions[] => {
  const uploadsPath = configService.get<string>(
    'UPLOAD_FOLDER',
    join(__dirname, '..', 'uploads'),
  );
  const logger = new Logger('ServeStatic');
  logger.log(`rootPath: ${uploadsPath}`);
  return [
    {
      rootPath: uploadsPath,
      serveRoot: '/uploads',
    },
  ];
};