import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import {
  absoluteUrl,
  formatCategory,
  formatDate,
  formatName,
  formatPrice,
  indexOne,
  showNum,
} from './utils/handlebars-helpder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  app.setViewEngine('hbs');
  hbs.registerHelper('showNum', showNum);
  hbs.registerHelper('inc', indexOne);
  hbs.registerHelper('formatDate', formatDate);
  hbs.registerHelper('absoluteUrl', absoluteUrl);
  hbs.registerHelper('lowerCase', (str: string) => str.toLowerCase());
  hbs.registerHelper('formatName', formatName);
  hbs.registerHelper('json', (context: any) => JSON.stringify(context));
  hbs.registerHelper('formatPrice', formatPrice);
  hbs.registerHelper('formatCategory', formatCategory);

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
  });
}
bootstrap();
