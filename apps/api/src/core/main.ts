import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { GlobalExceptionsFilter } from '../common/filters/global.filter';
import { ResponseFilter } from '../common/filters/response.filter';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { ErrorsInterceptor } from '../common/interceptors/errors.interceptor';
import {
  CORE_SERVER_API_DEFAULT_VERSION,
  CORE_SERVER_PORT,
} from '../common/config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import {
  privateDocsConfig,
  privateDocsOptions,
} from 'src/common/config/api-docs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new GlobalExceptionsFilter(httpAdapter),
    new ResponseFilter(),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: CORE_SERVER_API_DEFAULT_VERSION,
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const adminApiDoc = SwaggerModule.createDocument(
    app,
    privateDocsConfig,
    privateDocsOptions,
  );
  SwaggerModule.setup('api/docs', app, adminApiDoc);

  await app.listen(CORE_SERVER_PORT);
  console.log(`Server is running on port ${CORE_SERVER_PORT}`);
}
bootstrap();
