import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');


  const { httpAdapter } = app.get(HttpAdapterHost);
  // Register the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Car Rental API')
    .setDescription('Car Rental API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory,{
    swaggerOptions: {
      persistAuthorization: true, // 👈 keeps token between refreshes
    },
  });

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

 

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT);
  console.log('🚗 Car Rental API is running on http://localhost:8000/api');
  console.log('📚 Swagger docs available at http://localhost:8000/api/docs');
}
bootstrap();
