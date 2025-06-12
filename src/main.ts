import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({
    origin: '*', // Allow all origins in dev mode only
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.setGlobalPrefix('api');

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Register the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Car Rental API')
    .setDescription('Car Rental API description')
    .setVersion('1.0')
    .setDescription(
      `
# 🚗 Car Rental Management System API

A robust RESTful API for managing end-to-end operations of a modern car rental business. This system supports booking management, fleet tracking, user access control, and payment integration — built with scalability and security in mind.

## 🔧 Core Features

This API enables seamless handling of:

- **📦 Vehicle Inventory** – Register, update, and manage cars available for rent
- **📅 Booking & Reservations** – Create, view, and manage customer bookings and rental history
- **👥 User & Role Management** – Admin, customer, and agent roles with secure access control
- **💳 Payment Processing** – M-Pesa integration for smooth mobile payments
- **📈 Rental Analytics** – Track revenue, usage patterns, and customer activity

`,
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('vehicles', 'Vehicle management endpoints')
    .addTag('vehicle brands', 'Vehicle brand management endpoints')
    .addTag('subscribers', 'Subscriber management endpoints')
    .addTag('testimonials', 'Testimonial management endpoints')
    .addTag('bookings', 'Booking management endpoints')
    .addTag('payments', 'Payment management endpoints')
    .addTag('guest users', 'Guest user management endpoints')
    .addTag('contact us', 'Contact Us management endpoints')
    .addTag('ratings', 'Rating management endpoints')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      displayOperationId: true,
      docExpansion: 'none',
      filter: true,
      maxDisplayedTags: 50,
      filterTags: true,
    },
    customSiteTitle: '🚗 Premium Car Rental API', // a Custom title
    customfavIcon: 'https://example.com/favicon.ico',
    customCss: `
    .information-container .title { 
      color: #2c3e50;
      font-size: 1.8rem;
      font-weight: 600;
    }`,
  });

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT);
  console.log('🚗 Car Rental API is running on http://localhost:8000');
  console.log('📚 Swagger docs available at http://localhost:8000/docs');
}
bootstrap();
