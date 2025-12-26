import { FileRepository } from '@app/domain/repositories/file.repository';
import { ImageProductRepository } from '@app/domain/repositories/image-product.repository';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { UnitOfWork } from '@app/domain/repositories/unit-of-work.interface';
import { FileStorageService } from '@app/infrastructure/out/storage/file-storage.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { DatabaseHealthService } from './database-health.service';
import { FileRepositoryImpl } from './file.repository.impl';
import { ImageProductRepositoryImpl } from './image-product.repository.impl';
import { ProductRepositoryImpl } from './product.repository.impl';
import { UnitOfWorkImpl } from './unit-of-work.impl';

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
    {
      provide: ImageProductRepository,
      useClass: ImageProductRepositoryImpl,
    },
    {
      provide: UnitOfWork,
      useClass: UnitOfWorkImpl,
    },
    FileStorageService,
    DatabaseHealthService,
  ],
  exports: [
    ProductRepository,
    FileRepository,
    ImageProductRepository,
    UnitOfWork,
    FileStorageService,
    DatabaseHealthService,
  ],
})
export class PersistenceModule {}
