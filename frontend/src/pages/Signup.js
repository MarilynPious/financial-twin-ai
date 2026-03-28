import { useState } from 'react';

const AUTH_USER_STORAGE_KEY = 'financial-twin-ai:user';

function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    window.localStorage.setItem(
      AUTH_USER_STORAGE_KEY,
      JSON.stringify({
        email,
        password,
      })
    );

    setSuccess('Account created. You can log in now.');
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center">
        <section className="glass-panel w-full rounded-[2rem] p-8 shadow-2xl shadow-cyan-950/30">
          <div className="mb-8 space-y-2">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">Create Account</p>
            <h1 className="text-3xl font-semibold text-white">Sign Up</h1>
            <p className="text-sm text-slate-400">Create a local account to access the dashboard.</p>
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
            {success ? (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                {success}
              </div>
            ) : null}
            <button
              type="submit"
              className="neon-button w-full rounded-full border border-violet-400/30 bg-violet-400/10 px-5 py-3 text-sm font-medium text-violet-100"
            >
              Sign Up
            </button>
          </form>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="mt-5 text-sm text-slate-400 transition hover:text-cyan-200"
          >
            Already have an account? Login
          </button>
        </section>
      </div>
    </main>
  );
}

export default Signup;
