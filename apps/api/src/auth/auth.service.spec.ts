import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
  });

  it('registers a user and returns access and refresh tokens', async () => {
    const result = await service.register({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'super-secret',
    });

    expect(result.user.email).toBe('ada@example.com');
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('logs in an existing user and exposes the profile through me', async () => {
    await service.register({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'password123',
    });

    const result = await service.login({
      email: 'grace@example.com',
      password: 'password123',
    });

    const profile = await service.getMe(result.accessToken);

    expect(profile.email).toBe('grace@example.com');
    expect(profile.name).toBe('Grace Hopper');
  });
});
