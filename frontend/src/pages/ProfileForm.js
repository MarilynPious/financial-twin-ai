import { useState } from 'react';

const DEFAULT_PROFILE = {
  name: '',
  age: '',
  jobStability: 'Medium',
  dependents: '0',
  existingEMI: '0',
  healthInsurance: 'Yes',
  investments: '0',
  income: '125000',
  expenses: '68000',
  savings: '57000',
  risk: 'Balanced',
};

function ProfileForm({ initialValues, userEmail, onSubmit }) {
  const [formValues, setFormValues] = useState({
    ...DEFAULT_PROFILE,
    ...initialValues,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveProfile();
  };

  const saveProfile = async () => {
    const userData = {
      ...formValues,
      age: formValues.age || '0',
      dependents: formValues.dependents || '0',
      existingEMI: formValues.existingEMI || '0',
      investments: formValues.investments || '0',
      income: formValues.income || '0',
      expenses: formValues.expenses || '0',
      savings: formValues.savings || '0',
    };

    try {
      const response = await fetch('http://localhost:5000/saveProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Unable to save profile');
      }

      await response.json();
      window.alert('Profile Saved');
      onSubmit(userData);
    } catch (error) {
      console.error('PROFILE SAVE ERROR:', error);
      window.alert('Unable to save profile right now.');
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-6 py-12 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-[140%] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-28 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center">
        <section className="glass-panel w-full rounded-[2rem] p-8 shadow-2xl shadow-cyan-950/30">
          <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6">
            <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.32em] text-cyan-200">
              Profile Setup
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-4xl">Build your financial profile</h1>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Add your personal and financial details so the dashboard and simulation can use richer context.
              </p>
            </div>
            <p className="text-sm text-slate-500">{userEmail}</p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <section className="glass-card rounded-3xl p-6">
              <div className="mb-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Personal Info</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Who you are</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Name</span>
                  <input
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Age</span>
                  <input
                    name="age"
                    type="number"
                    value={formValues.age}
                    onChange={handleChange}
                    placeholder="32"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Job Stability</span>
                  <select
                    name="jobStability"
                    value={formValues.jobStability}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Dependents</span>
                  <input
                    name="dependents"
                    type="number"
                    value={formValues.dependents}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-6">
              <div className="mb-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Financial Info</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Cash flow and obligations</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Income</span>
                  <input
                    name="income"
                    type="number"
                    value={formValues.income}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Expenses</span>
                  <input
                    name="expenses"
                    type="number"
                    value={formValues.expenses}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Savings</span>
                  <input
                    name="savings"
                    type="number"
                    value={formValues.savings}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Existing EMI</span>
                  <input
                    name="existingEMI"
                    type="number"
                    value={formValues.existingEMI}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Investments</span>
                  <input
                    name="investments"
                    type="number"
                    value={formValues.investments}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Health Insurance</span>
                  <select
                    name="healthInsurance"
                    value={formValues.healthInsurance}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="glass-card rounded-3xl p-6">
              <div className="mb-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Risk Profile</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Decision comfort level</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm text-slate-300">Risk</span>
                  <select
                    name="risk"
                    value={formValues.risk}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40"
                  >
                    <option>Conservative</option>
                    <option>Balanced</option>
                    <option>Aggressive</option>
                  </select>
                </label>
              </div>
            </section>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                This profile is stored locally and reused for the dashboard and simulations.
              </p>
              <button
                type="submit"
                className="neon-button rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-100"
              >
                Continue to Dashboard
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ProfileForm;
