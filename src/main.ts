import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import { registerHelpers } from './utils/handlebars-helpder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Bookshop API')
    .setDescription('Bookshop API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: 'http://localhost:5173', // React app URL
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  app.setViewEngine('hbs');
  registerHelpers();

  await app.listen(configService.get('PORT'), () => {
    const logger = app.get(Logger);
    logger.log('App is running');
    logger.log(
      `Server is running on http://localhost:${configService.get('PORT')}`,
    );
    logger.log(
      `Swagger is running on http://localhost:${configService.get('PORT')}/api`,
    );
    logger.log(
      `GraphQL is running on http://localhost:${configService.get('PORT')}/graphql`,
    );
    logger.log(`Redis is running on port: ${configService.get('redis.port')} `);
  });
}
bootstrap();
