// Крок 1. RegisterDto описує ті дані, які клієнт надсилає при реєстрації.
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

// Крок 2. LoginDto описує дані, які клієнт надсилає при вході в систему.
export interface LoginDto {
  email: string;
  password: string;
}

// Крок 3. PublicUser — це те, що можна безпечно повернути клієнту про користувача.
export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

// Крок 4. AuthResponse — це відповідь після реєстрації або логіну.
export interface AuthResponse {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

// Крок 5. TokenPayload — це структура даних, які ми вкладаємо в JWT.
export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}
