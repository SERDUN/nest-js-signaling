import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Імпортуємо Fastify адаптер
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  // Створюємо екземпляр FastifyAdapter
  const adapter = new FastifyAdapter();
  // Створюємо додаток NestJS з типом NestFastifyApplication та передаємо адаптер
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  // Явно вказуємо використання WsAdapter для WebSocket
  app.useWebSocketAdapter(new WsAdapter(app));

  // Налаштування CORS, якщо потрібно
  // app.enableCors();

  // Важливо для Fastify, щоб він слухав на 0.0.0.0 для роботи в Docker
  await app.listen(8080, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();