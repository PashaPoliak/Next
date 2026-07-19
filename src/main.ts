import * as util from 'util';
(util as any).isNullOrUndefined = (value: any) => value === null || value === undefined;
(util as any).isObject = (value: any) => value !== null && typeof value === 'object';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getConnection } from 'typeorm';

import { METADATA_AUTHORIZED_KEY } from '@core/core-module.config';

import * as packageJson from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    const connection = getConnection();
    console.log('Starting database migrations...');
    await connection.runMigrations();
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration execution failed:', error);
    process.exit(1);
  }

  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'headers' },
      METADATA_AUTHORIZED_KEY,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors();
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
