import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import ProfileForm from './pages/ProfileForm';
import Signup from './pages/Signup';

const MAX_ALERT_HEADLINE_LENGTH = 88;
const PREVIOUS_ALERT_STORAGE_KEY = 'financial-twin-ai:last-alert';
const AUTH_SESSION_STORAGE_KEY = 'financial-twin-ai:session';
const ALERTS = [
  '\u26A0 Market Alert: Over \u20B910 lakh crore wiped out, indicating high volatility',
  '\u26A0 RBI has increased interest rates, impacting loans and EMIs',
  '\u26A0 Gold prices are rising rapidly amid economic uncertainty',
];
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

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400/40 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.2)]';

const normalizeBetterOptions = (value) => {
  if (Array.isArray(value)) {
    const cleaned = value.filter(Boolean);
    return cleaned.length ? cleaned : ['Consider alternatives'];
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return ['Consider alternatives'];
};

const getProfileStorageKey = (email) => `financial-twin-ai:profile:${email}`;

function Field({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function Section({ eyebrow, title, children }) {
  return (
    <section>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>
        {title ? <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3> : null}
      </div>
      {children}
    </section>
  );
}

function ProfileSidebar({
  editOpen,
  setEditOpen,
  formValues,
  loggedInUser,
  onLogout,
  handleChange,
  handleSave,
  saveStatus,
  notificationPermission,
}) {
  return (
    <aside className="sidebar glass-panel">
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-5">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200">Profile</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Financial Twin AI</h1>
          <p className="mt-2 text-sm text-slate-400">{loggedInUser.email}</p>
          <button
            type="button"
            onClick={onLogout}
            className="logout-btn hover:text-white transition"
          >
            Logout
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-summary">
            <div className="profile-mini-box">
              <span className="block text-slate-400 mb-1 opacity-80 text-[10px] uppercase tracking-wider">Name</span>
              <span className="block font-medium text-slate-100 truncate">{formValues.name?.split(' ')[0] || '-'}</span>
            </div>
            <div className="profile-mini-box">
              <span className="block text-slate-400 mb-1 opacity-80 text-[10px] uppercase tracking-wider">Age</span>
              <span className="block font-medium text-slate-100">{formValues.age || '-'}</span>
            </div>
            <div className="profile-mini-box">
              <span className="block text-slate-400 mb-1 opacity-80 text-[10px] uppercase tracking-wider">Income</span>
              <span className="block font-medium text-slate-100">{formValues.income ? `₹${(Number(formValues.income)/1000).toFixed(0)}k` : '-'}</span>
            </div>
            <div className="profile-mini-box">
              <span className="block text-slate-400 mb-1 opacity-80 text-[10px] uppercase tracking-wider">Expenses</span>
              <span className="block font-medium text-slate-100">{formValues.expenses ? `₹${(Number(formValues.expenses)/1000).toFixed(0)}k` : '-'}</span>
            </div>
            <div className="profile-mini-box">
              <span className="block text-slate-400 mb-1 opacity-80 text-[10px] uppercase tracking-wider">Savings</span>
              <span className="block font-medium text-slate-100">{formValues.savings ? `₹${(Number(formValues.savings)/1000).toFixed(0)}k` : '-'}</span>
            </div>
            <div className="profile-mini-box">
              <span className="block text-slate-400 mb-1 opacity-80 text-[10px] uppercase tracking-wider">Risk</span>
              <span className="block font-medium text-slate-100">{formValues.risk || '-'}</span>
            </div>
          </div>
        </div>

        <div className="pb-4">
          <button
            type="button"
            onClick={() => setEditOpen((current) => !current)}
            className="edit-btn neon-button w-full px-4 py-3 text-sm"
          >
            {editOpen ? 'Hide Profile Details' : 'Edit Profile Details'}
          </button>
        </div>

        {editOpen ? (
          <form className="space-y-8 border-t border-white/10 pt-6" onSubmit={handleSave}>
            <Section eyebrow="Personal Info">
              <div className="grid gap-4">
                <Field label="Name"><input name="name" value={formValues.name} onChange={handleChange} className={inputClass} /></Field>
                <Field label="Age"><input name="age" type="number" value={formValues.age} onChange={handleChange} className={inputClass} /></Field>
                <Field label="Job Stability">
                  <select name="jobStability" value={formValues.jobStability} onChange={handleChange} className={inputClass}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </Field>
                <Field label="Dependents"><input name="dependents" type="number" value={formValues.dependents} onChange={handleChange} className={inputClass} /></Field>
              </div>
            </Section>

            <Section eyebrow="Financial Info">
              <div className="grid gap-4">
                <Field label="Income"><input name="income" type="number" value={formValues.income} onChange={handleChange} className={inputClass} /></Field>
                <Field label="Expenses"><input name="expenses" type="number" value={formValues.expenses} onChange={handleChange} className={inputClass} /></Field>
                <Field label="Savings"><input name="savings" type="number" value={formValues.savings} onChange={handleChange} className={inputClass} /></Field>
                <Field label="Existing EMI"><input name="existingEMI" type="number" value={formValues.existingEMI} onChange={handleChange} className={inputClass} /></Field>
                <Field label="Health Insurance">
                  <select name="healthInsurance" value={formValues.healthInsurance} onChange={handleChange} className={inputClass}>
                    <option>Yes</option><option>No</option>
                  </select>
                </Field>
                <Field label="Investments"><input name="investments" type="number" value={formValues.investments} onChange={handleChange} className={inputClass} /></Field>
              </div>
            </Section>

            <Section eyebrow="Risk Profile">
              <div className="grid gap-4">
                <Field label="Risk">
                  <select name="risk" value={formValues.risk} onChange={handleChange} className={inputClass}>
                    <option>Conservative</option><option>Balanced</option><option>Aggressive</option>
                  </select>
                </Field>
              </div>
            </Section>

            <div className="space-y-3 border-t border-white/10 pt-5">
              <button
                type="submit"
                disabled={saveStatus === 'loading'}
                className="neon-button w-full rounded-full border border-violet-400/30 bg-violet-400/10 px-5 py-3 text-sm font-medium text-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saveStatus === 'loading' ? 'Saving...' : 'Save'}
              </button>
              <p className="text-xs text-slate-500">Notifications: {notificationPermission}</p>
            </div>
          </form>
        ) : null}
      </div>
    </aside>
  );
}

function Simulation({ userData, currentAlert, cardTransition, staggerGroup }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    console.log('SIMULATE CLICKED');
    console.log('UserData:', userData);
    console.log('Query:', query);
    if (!query || query.trim() === '') {
      console.warn('Query is empty');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData,
          userQuery: query,
          news: currentAlert || 'No news',
        }),
      });
      console.log('REQUEST SENT');
      const data = await res.json();
      console.log('RESPONSE RECEIVED:', data);
      setResult({
        impact: data.impact || 'No impact returned',
        recommendation: data.recommendation || 'No recommendation returned',
        betterOption: normalizeBetterOptions(data.betterOption),
      });
      setHasSimulated(true);
    } catch (error) {
      console.error('SIMULATION ERROR:', error);
      setResult({
        impact: 'Unable to simulate this scenario right now.',
        recommendation: 'Please try again after checking the backend connection.',
        betterOption: ['Retry once the simulation service is available.'],
      });
      setHasSimulated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="desktop-main min-h-0 gap-5" variants={staggerGroup}>
      <motion.article className="scenario-box glass-card rounded-3xl p-6" variants={cardTransition}>
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Simulation</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Scenario sandbox</h2>
        </div>
        <div className="flex h-full flex-col gap-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask a financial scenario..."
            className={`${inputClass} placeholder:text-slate-500`}
          />
          <div className="example-box text-sm text-slate-300">
            <p className="font-medium text-white">Example scenarios:</p>
            <p>- What if I invest &#x20B9;5,000 more monthly?</p>
            <p>- What if I buy a car worth &#x20B9;8 lakh?</p>
            <p>- Should I invest in Tata shares?</p>
            <p>- What happens if I take a home loan?</p>
          </div>
          <motion.button
            type="button"
            onClick={handleSimulate}
            disabled={loading}
            className="neon-button rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
            whileHover={loading ? undefined : { scale: 1.02, boxShadow: '0 0 24px rgba(34, 211, 238, 0.24)' }}
            whileTap={loading ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {loading ? 'Simulating...' : 'Simulate'}
          </motion.button>
        </div>
      </motion.article>
      <motion.article className="glass-card flex min-h-0 flex-col rounded-3xl p-6" variants={cardTransition}>
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Simulation Output</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Projected outcome</h2>
        </div>
        {loading ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">Analyzing scenario...</div>
        ) : null}
        {hasSimulated && result ? (
          <div className="sim-output-container desktop-output-grid min-h-0 gap-4">
            <div className="sim-card output-card rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Impact</p>
              <p className="mt-2 text-sm leading-7 text-slate-200 break-words [overflow-wrap:anywhere]">{result.impact}</p>
            </div>
            <div className="sim-card output-card rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Recommendation</p>
              <p className="mt-2 text-sm leading-7 text-slate-200 break-words [overflow-wrap:anywhere]">{result.recommendation}</p>
            </div>
            <div className="sim-card output-card rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Better Options</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-200">
                {normalizeBetterOptions(result.betterOption).map((option, i) => (
                  <li key={`${option}-${i}`} className="break-words [overflow-wrap:anywhere]">
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </motion.article>
    </motion.div>
  );
}

function App() {
  const [formValues, setFormValues] = useState(DEFAULT_PROFILE);
  const [hasProfile, setHasProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [analyzeStatus, setAnalyzeStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [loggedInUser, setLoggedInUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const savedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    return savedSession ? JSON.parse(savedSession) : null;
  });
  const [previousAlertText, setPreviousAlertText] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(PREVIOUS_ALERT_STORAGE_KEY) || '';
  });
  const [analysis, setAnalysis] = useState({
    impact: 'Higher rates may reduce borrowing flexibility while improving yield on low-risk savings.',
    action: 'Rebalance toward fixed-income holdings and keep a stronger cash buffer for short-term needs.',
    confidence: '87%',
  });

  const pageTransition = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], when: 'beforeChildren', staggerChildren: 0.12 } },
  };
  const staggerGroup = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const cardTransition = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  const formatAlertHeadline = (headline) => {
    const cleanedHeadline = String(headline || ALERTS[0]).replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanedHeadline.length <= MAX_ALERT_HEADLINE_LENGTH) {
      return cleanedHeadline;
    }
    return `${cleanedHeadline.slice(0, MAX_ALERT_HEADLINE_LENGTH - 3).trimEnd()}...`;
  };

  useEffect(() => {
    if (!loggedInUser?.email || typeof window === 'undefined') {
      setFormValues(DEFAULT_PROFILE);
      setHasProfile(false);
      return;
    }
    const savedProfile = window.localStorage.getItem(getProfileStorageKey(loggedInUser.email));
    if (!savedProfile) {
      setFormValues(DEFAULT_PROFILE);
      setHasProfile(false);
      return;
    }
    try {
      const parsedProfile = JSON.parse(savedProfile);
      setFormValues({ ...DEFAULT_PROFILE, ...parsedProfile });
      setHasProfile(true);
    } catch (error) {
      setFormValues(DEFAULT_PROFILE);
      setHasProfile(false);
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationPermission('unsupported');
      return;
    }
    const requestNotifications = async () => {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    };
    requestNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ALERTS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const alertText = formatAlertHeadline(ALERTS[index]);
    if (notificationPermission !== 'granted') {
      console.log('[Financial Twin AI] Notification skipped: permission is not granted.', {
        notificationPermission,
        alertText,
      });
      return;
    }
    if (previousAlertText === alertText) {
      console.log('[Financial Twin AI] Notification skipped: alert unchanged.', { alertText });
      return;
    }
    console.log('[Financial Twin AI] Sending notification for new alert.', { alertText });
    setPreviousAlertText(alertText);
    window.localStorage.setItem(PREVIOUS_ALERT_STORAGE_KEY, alertText);
    const notification = new Notification('Financial Twin AI Alert', { body: alertText });
    return () => notification.close();
  }, [index, notificationPermission, previousAlertText]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = (profile) => {
    const nextProfile = { ...DEFAULT_PROFILE, ...profile };
    if (typeof window !== 'undefined' && loggedInUser?.email) {
      window.localStorage.setItem(getProfileStorageKey(loggedInUser.email), JSON.stringify(nextProfile));
    }
    setFormValues(nextProfile);
    setHasProfile(true);
  };

  const alertText = formatAlertHeadline(ALERTS[index]);
  const createPayload = () => ({ userData: formValues, alertText, news: alertText });

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveStatus('loading');
    setErrorMessage('');
    if (typeof window !== 'undefined' && loggedInUser?.email) {
      window.localStorage.setItem(getProfileStorageKey(loggedInUser.email), JSON.stringify(formValues));
    }
    try {
      const response = await fetch('http://localhost:5000/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createPayload()),
      });
      if (!response.ok) {
        throw new Error('Unable to save user data right now.');
      }
      await response.json();
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzeStatus('loading');
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createPayload()),
      });
      if (!response.ok) {
        throw new Error('Unable to analyze the alert right now.');
      }
      const result = await response.json();
      setAnalysis({
        impact: result.impact || 'No impact returned.',
        action: result.action || 'No action returned.',
        confidence: result.confidence || 'N/A',
      });
      setAnalyzeStatus('success');
    } catch (error) {
      setAnalyzeStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setHasProfile(false);
    setSidebarOpen(false);
    setFormValues(DEFAULT_PROFILE);
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  };

  if (!loggedInUser) {
    return authMode === 'signup' ? (
      <Signup onSwitchToLogin={() => setAuthMode('login')} />
    ) : (
      <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setAuthMode('signup')} />
    );
  }

  if (!hasProfile) {
    return <ProfileForm initialValues={formValues} userEmail={loggedInUser.email} onSubmit={handleProfileSubmit} />;
  }

  return (
    <main className="dashboard-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-[140%] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-28 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="main-container relative">
        <ProfileSidebar
        editOpen={sidebarOpen}
        setEditOpen={setSidebarOpen}
        formValues={formValues}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
        handleChange={handleChange}
        handleSave={handleSave}
        saveStatus={saveStatus}
        notificationPermission={notificationPermission}
      />

      <div className="content">
        <motion.section
          className="glass-panel content-panel h-full rounded-[2rem] p-5 shadow-2xl shadow-cyan-950/30 md:p-6"
          variants={pageTransition}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="scenario-box space-y-4" variants={cardTransition}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.32em] text-cyan-200">
                  Dashboard
                </span>
                <div className="space-y-1">
                  <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">Financial Twin AI</h1>
                  <p className="text-sm text-slate-300">AI-powered decision engine</p>
                </div>
              </div>
              <motion.button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzeStatus === 'loading'}
                className="neon-button rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={analyzeStatus === 'loading' ? undefined : { scale: 1.03, boxShadow: '0 0 24px rgba(34, 211, 238, 0.24)' }}
                whileTap={analyzeStatus === 'loading' ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {analyzeStatus === 'loading' ? 'Analyzing...' : 'Analyze Impact'}
              </motion.button>
            </div>

          <motion.article className="glass-card neon-border rounded-3xl p-5 md:p-6" variants={cardTransition}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-base font-medium text-slate-100">{alertText}</p>
                <p className="text-xs text-slate-400">Source: Demo Alert Feed</p>
              </div>
            </div>
          </motion.article>

            <div className="output-container">
              <div className="card border border-white/10 bg-white/5">
                <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">Impact</h4>
                <p className="mt-3 text-slate-200 break-words [overflow-wrap:anywhere]">{analysis.impact}</p>
              </div>
              <div className="card border border-white/10 bg-white/5">
                <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">Action</h4>
                <p className="mt-3 text-slate-200 break-words [overflow-wrap:anywhere]">{analysis.action}</p>
              </div>
              <div className="card border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
                <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400">Confidence</h4>
                <div className="mt-4 text-3xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{analysis.confidence}</div>
                {errorMessage ? <div className="mt-3 text-xs text-rose-200">{errorMessage}</div> : null}
              </div>
            </div>
          </motion.div>

          <div className="content-body mt-5 min-h-0 flex-1">
            <Simulation userData={formValues} currentAlert={alertText} cardTransition={cardTransition} staggerGroup={staggerGroup} />
          </div>
        </motion.section>
      </div>
      </div>
    </main>
  );
}

export default App;
