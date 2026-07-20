import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Крок 1. Створюємо NestJS застосунок на основі AppModule.
  const app = await NestFactory.create(AppModule);

  // Крок 2. Увімкнути CORS, щоб фронтенд Next.js міг звертатися до API.
  app.enableCors({ origin: true, credentials: true });

  // Крок 3. Запускаємо сервер на порту 3001 або на тому, що вказано в середовищі.
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
