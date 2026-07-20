'use client';

import { FormEvent, useState } from 'react';

type AuthMode = 'register' | 'login';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function Home() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState<{ id: string; name: string; email: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setProfile(null);

    const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? 'Щось пішло не так');
      return;
    }

    setToken(data.accessToken);
    setMessage(mode === 'register' ? 'Реєстрацію завершено' : 'Вхід успішний');
    setProfile(data.user);
  }

  async function loadProfile() {
    if (!token) {
      setMessage('Спочатку виконайте логін або реєстрацію');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message ?? 'Не вдалося завантажити профіль');
      return;
    }

    setProfile(data);
    setMessage('Профіль завантажено');
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">AI Job Tracker</p>
          <h1 className="mt-3 text-4xl font-semibold">Перший крок — авторизація</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Тут ми показуємо, як користувач реєструється, входить у систему і отримує доступ до свого профілю через JWT.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-full px-4 py-2 text-sm font-medium ${mode === 'register' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
              >
                Реєстрація
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2 text-sm font-medium ${mode === 'login' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
              >
                Вхід
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'register' ? (
                <div>
                  <label className="mb-2 block text-sm text-slate-400">Ім'я</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-0"
                    placeholder="Аня Коваль"
                    required
                  />
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-sm text-slate-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-0"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-0"
                  placeholder="********"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                {mode === 'register' ? 'Створити акаунт' : 'Увійти'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold">Крок 2: перевірка профілю</h2>
            <p className="mt-2 text-sm text-slate-400">
              Після логіну або реєстрації токен зберігається в браузері й використовується для запиту до /me.
            </p>

            <button
              type="button"
              onClick={loadProfile}
              className="mt-6 w-full rounded-xl border border-cyan-500 px-4 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
            >
              Отримати профіль
            </button>

            {message ? <p className="mt-4 text-sm text-cyan-300">{message}</p> : null}

            {profile ? (
              <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                {JSON.stringify(profile, null, 2)}
              </pre>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Що це означає простими словами</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-semibold text-cyan-400">Реєстрація</h3>
              <p className="mt-2 text-sm text-slate-400">
                Це коли користувач створює акаунт: ім&apos;я, email і пароль.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-semibold text-cyan-400">Логін</h3>
              <p className="mt-2 text-sm text-slate-400">
                Це коли користувач входить у систему і отримує токен доступу.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="font-semibold text-cyan-400">JWT і /me</h3>
              <p className="mt-2 text-sm text-slate-400">
                JWT — це “пропуск” для підтвердження користувача. /me повертає профіль цього користувача.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
