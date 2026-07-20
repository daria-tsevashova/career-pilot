import { Injectable } from '@nestjs/common';

// Крок 1. Сервіс містить бізнес-логіку для контролера.
// Крок 2. getHello повертає простий текст, щоб перевірити, що API працює.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
