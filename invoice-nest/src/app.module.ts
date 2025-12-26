import { RestModule } from '@app/infrastructure/in/rest/rest.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { staticFilesFactory } from '../libs/infrastructure/src/config/static-files.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RestModule,
    ServeStaticModule.forRootAsync({
      useFactory: staticFilesFactory,
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
