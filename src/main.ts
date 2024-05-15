import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Bookshop API')
    .setDescription('Bookshop API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(configService.get('PORT'), () => {
    const logger = app.get(Logger);
    logger.log(
      `Server is running on http://localhost:${configService.get('PORT')}`,
    );
    logger.log(
      `Swagger is running on http://localhost:${configService.get('PORT')}/api`,
    );
    logger.log(
      `GraphQL is running on http://localhost:${configService.get('PORT')}/graphql`,
    );
  });
}
bootstrap();
