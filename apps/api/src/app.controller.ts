import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Крок 1. Контролер приймає HTTP-запити.
// Крок 2. GET / повертає базову відповідь з AppService.
// Крок 3. Контролер не містить бізнес-логіки — лише делегує роботу сервісу.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
