import { CommandModule } from '@app/infrastructure/config/command.module';
import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../out/persistence/persistence.module';
import { ProductController } from './product.controller';

@Module({
  imports: [PersistenceModule, CommandModule],
  controllers: [ProductController],
})
export class RestModule {}
