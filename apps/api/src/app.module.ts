import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

// Крок 1. Це головний модуль бекенду.
// Крок 2. Ми підключаємо AuthModule, щоб маршрути авторизації були доступні.
// Крок 3. AppController і AppService відповідають за базовий маршрут "/".
@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
