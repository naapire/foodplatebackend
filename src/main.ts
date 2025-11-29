import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true, // ✅ enables transformation of incoming data to DTO classes
    transformOptions: { enableImplicitConversion: true }, // ✅ automatically converts string → number
  }),
);

   
  const config = new DocumentBuilder()
    .setTitle('Foodplace API')
    .setDescription('API documentation for Foodplace backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const configService = app.get(ConfigService);

  const allowed = (configService.get<string>('CORS_ORIGIN') || '')
    .split(',')
    .map((o) => o.trim())
    .filter((o) => !!o);

  const corsOptions: CorsOptions = {
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin || allowed.includes(incomingOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: ${incomingOrigin} not allowed`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 5000);
  console.log(`⚡️ Listening on http://localhost:${process.env.PORT || 5000}`);
  console.log(
    `📚 Swagger docs at http://localhost:${process.env.PORT || 5000}/api`,
  );
}
bootstrap();
