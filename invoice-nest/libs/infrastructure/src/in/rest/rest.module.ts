import { CommandModule } from '@app/infrastructure/config/command.module';
import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../out/persistence/persistence.module';
import { FileController } from './file.controller';
import { ProductController } from './product.controller';

@Module({
  imports: [PersistenceModule, CommandModule],
  controllers: [ProductController, FileController],
})
export class RestModule {}
