import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('UC-GasHound')
    .setDescription('API Description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerPath = 'api';

  SwaggerModule.setup(swaggerPath, app, document);

  const port = 3000;

  await app.listen(port);

  Logger.debug(
    '==========================================================================',
  );
  Logger.warn(
    `⚓️ SWAGGER HAS BEEN STARTED: http://localhost:${port}/${swaggerPath} ⚓️`,
  );
  Logger.debug(
    '==========================================================================',
  );
  Logger.warn(`⚡ PROJECT HAS BEEN STARTED: http://localhost:${port} ⚡`);
  Logger.debug(
    '==========================================================================',
  );
  Logger.debug('HAPPY HACKING 👾');
}

bootstrap();
