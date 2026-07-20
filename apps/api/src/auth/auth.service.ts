import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { AuthResponse, LoginDto, PublicUser, RegisterDto, TokenPayload } from './dto/auth.dto.js';

type StoredUser = PublicUser & {
  passwordHash: string;
};

@Injectable()
export class AuthService {
  private readonly users = new Map<string, StoredUser>();
  private readonly secret = process.env.JWT_SECRET ?? 'career-pilot-dev-secret';

  // Крок 1. Реєстрація: отримуємо дані від користувача.
  // Крок 2. Перевіряємо, чи такого email ще немає в системі.
  // Крок 3. Якщо все добре — створюємо об'єкт користувача.
  // Крок 4. Хешуємо пароль, щоб не зберігати його у відкритому вигляді.
  // Крок 5. Генеруємо accessToken і refreshToken і повертаємо їх клієнту.
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = Array.from(this.users.values()).find(
      (user) => user.email === dto.email,
    );

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user: StoredUser = {
      id: `user_${Date.now()}`,
      name: dto.name,
      email: dto.email,
      passwordHash: this.hashPassword(dto.password),
    };

    this.users.set(user.id, user);

    return {
      user: this.toPublicUser(user),
      accessToken: this.signToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        type: 'access',
      }),
      refreshToken: this.signToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        type: 'refresh',
      }),
    };
  }

  // Крок 1. Логін: шукаємо користувача за email.
  // Крок 2. Перевіряємо пароль.
  // Крок 3. Якщо пароль вірний — видаємо нові токени.
  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = Array.from(this.users.values()).find(
      (candidate) => candidate.email === dto.email,
    );

    if (!user || user.passwordHash !== this.hashPassword(dto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: this.toPublicUser(user),
      accessToken: this.signToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        type: 'access',
      }),
      refreshToken: this.signToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        type: 'refresh',
      }),
    };
  }

  // Крок 1. /me: отримуємо токен від клієнта.
  // Крок 2. Перевіряємо його підпис і термін дії.
  // Крок 3. Якщо токен валідний — повертаємо профіль користувача.
  async getMe(token: string): Promise<PublicUser> {
    const payload = this.verifyToken(this.normalizeToken(token));
    const user = this.users.get(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.toPublicUser(user);
  }

  private normalizeToken(token: string): string {
    // Крок 1. Забираємо слово Bearer, якщо клієнт надіслав токен у форматі Authorization: Bearer ...
    return token.replace(/^Bearer\s+/i, '').trim();
  }

  private hashPassword(password: string): string {
    // Крок 2. Хешуємо пароль, щоб не зберігати його у відкритому вигляді.
    return createHash('sha256').update(password).digest('hex');
  }

  // Крок 1. Створюємо payload — це дані користувача, які ми хочемо “запакувати” в токен.
  // Крок 2. Додаємо час видачі і час закінчення дії.
  // Крок 3. Кодируємо header і payload у base64url.
  // Крок 4. Підписуємо їх секретним ключем, щоб токен було неможливо підробити.
  private signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiration = payload.type === 'refresh'
      ? issuedAt + 60 * 60 * 24 * 7
      : issuedAt + 60 * 60;

    const fullPayload: TokenPayload = {
      ...payload,
      iat: issuedAt,
      exp: expiration,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(fullPayload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = this.base64UrlEncode(
      createHmac('sha256', this.secret).update(signingInput).digest(),
    );

    return `${signingInput}.${signature}`;
  }

  // Крок 1. Розділяємо токен на три частини: header, payload і signature.
  // Крок 2. Пересобираємо те, що було підписано.
  // Крок 3. Перевіряємо, чи підпис збігається з нашим секретом.
  // Крок 4. Перевіряємо, чи токен ще не прострочений.
  private verifyToken(token: string): TokenPayload {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.base64UrlEncode(
      createHmac('sha256', this.secret).update(signingInput).digest(),
    );

    if (expectedSignature !== signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as TokenPayload;

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    return payload;
  }

  private base64UrlEncode(value: string | Buffer): string {
    return Buffer.from(value).toString('base64url');
  }

  private toPublicUser(user: StoredUser): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
