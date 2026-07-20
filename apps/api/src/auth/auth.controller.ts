import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { LoginDto, RegisterDto } from './dto/auth.dto.js';

// Крок 1. Контролер авторизації приймає запити від фронтенду.
// Крок 2. POST /auth/register створює нового користувача.
// Крок 3. POST /auth/login перевіряє дані для входу.
// Крок 4. GET /me повертає профіль користувача, якщо токен валідний.
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  getMe(@Headers('authorization') authorization?: string) {
    return this.authService.getMe(authorization ?? '');
  }
}
