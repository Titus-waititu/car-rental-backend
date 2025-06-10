import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({
    origin: '*', // Allow all origins, adjust as needed for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, // Allow credentials if needed
    preflightContinue: false,
    optionsSuccessStatus: 204, // For legacy browser support
  });

  app.setGlobalPrefix('api/v1');



  





  const { httpAdapter } = app.get(HttpAdapterHost);
  // Register the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('Car Rental API')
    .setDescription('Car Rental API description')
    .setVersion('1.0')
    .setDescription(
      `Car Rental API is a RESTful API for managing car rentals, users, and vehicles.`,
    )
    .addTag('auth','Authentication endpoints')
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
    .addTag('seed', 'Database seeding endpoints')
    .addTag('logs', 'Logging endpoints')
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
  customSiteTitle: '🚗 Premium Car Rental API',  // Custom title here
  customfavIcon: 'https://example.com/favicon.ico',
  customCss: `
    .information-container .title { 
      color: #2c3e50;
      font-size: 1.8rem;
      font-weight: 600;
    }`
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
