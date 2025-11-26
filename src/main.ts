// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Pipes - تطبيق Validation Pipe على كل التطبيق
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // حذف الخصائص الغير موجودة في DTO
      forbidNonWhitelisted: true, // رفض الطلب إذا كان فيه خصائص إضافية
      transform: true, // تحويل التايبات تلقائياً
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS - السماح بالطلبات من مصادر مختلفة
  app.enableCors();

  app.setGlobalPrefix('api/v1');

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(` Application is running on: http://localhost:${PORT}`);
  console.log(` API Documentation: http://localhost:${PORT}/api/v1`);
}

void bootstrap();
