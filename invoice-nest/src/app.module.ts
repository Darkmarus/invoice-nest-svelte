import { RestModule } from '@app/infrastructure/in/rest/rest.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RestModule,
  ],
})
export class AppModule {}
