import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winsonConfig } from './configs/winston-configs';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winsonConfig);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
