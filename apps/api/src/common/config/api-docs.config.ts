import { DocumentBuilder, type SwaggerDocumentOptions } from '@nestjs/swagger';
import { routes } from '../routes/routes';
import { getSpecificRouteModules } from '../routes/routes.util';

export const privateDocsConfig = new DocumentBuilder()
  .setTitle('App API')
  .setDescription('This is an internal app api documentation')
  .setVersion('1.0')
  .addTag('app')
  .addBearerAuth({
    in: 'header',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })
  .build();

export const privateDocsOptions = {
  include: getSpecificRouteModules(routes, '', []),
} satisfies SwaggerDocumentOptions;
