import { useState } from 'react';

const AUTH_USER_STORAGE_KEY = 'financial-twin-ai:user';

function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);

    if (!storedUser) {
      setError('No account found. Please sign up first.');
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.email !== email || parsedUser.password !== password) {
      setError('Invalid email or password.');
      return;
    }

    setError('');
    onLoginSuccess({ email: parsedUser.email });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <section className="glass-panel w-full rounded-[2rem] p-8 shadow-2xl shadow-cyan-950/30">
          <div className="mb-8 space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">Welcome Back</p>
            <h1 className="text-3xl font-semibold text-white">Login</h1>
            <p className="text-sm text-slate-400">Access your Financial Twin AI dashboard.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
            />
            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}
            <button
              type="submit"
              className="neon-button w-full rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100"
            >
              Login
            </button>
          </form>

          <button
            type="button"
            onClick={onSwitchToSignup}
            className="mt-5 text-sm text-slate-400 transition hover:text-cyan-200"
          >
            Need an account? Sign up
          </button>
        </section>
      </div>
    </main>
  );
}

export default Login;
