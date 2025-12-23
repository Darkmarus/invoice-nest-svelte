import { FileRepository } from '@app/domain/repositories/file.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { FileStorageService } from '@app/infrastructure/out/storage/file-storage.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { FileRepositoryImpl } from './file.repository.impl';
import { ProductRepositoryImpl } from './product.repository.impl';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: 'pg',
          connection: {
            host: configService.get<string>('DB_HOST', 'localhost'),
            port: configService.get<number>('DB_PORT', 5432),
            user: configService.get<string>('DB_USER', 'postgres'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME', 'invoice'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl,
    },
    FileStorageService,
  ],
  exports: [ProductRepository, FileRepository, FileStorageService],
})
export class PersistenceModule {}
