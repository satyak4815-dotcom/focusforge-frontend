import React, { useState } from 'react';
import { Loader2, Zap, ArrowLeft, User, Users, Plus, Trash2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { auth, parents } from '../services/api';
import AuthHelpPage from './AuthHelpPage';

type ViewState = 'role_select' | 'login_kid' | 'login_parent' | 'signup_kid' | 'signup_parent';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<ViewState>('role_select');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [kidLinks, setKidLinks] = useState([{ username: '', password: '' }]);
  const [showHelp, setShowHelp] = useState(false);

  const { login } = useAppContext();

  const resetForms = () => {
    setIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setEmail('');
    setKidLinks([{ username: '', password: '' }]);
    setError('');
    setShowPassword(false);
  };

  const handleSwitchView = (view: ViewState) => {
    resetForms();
    setCurrentView(view);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier && !username && !email) {
      setError('Please fill in the required fields.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    if (
      (currentView === 'signup_kid' || currentView === 'signup_parent') &&
      password !== confirmPassword &&
      currentView === 'signup_kid'
    ) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      let authRes;

      if (currentView === 'login_kid' || currentView === 'login_parent') {
        authRes = await auth.login(identifier || username || email, password);
      } else if (currentView === 'signup_kid') {
        authRes = await auth.register(username, email, password);
      } else if (currentView === 'signup_parent') {
        authRes = await auth.registerParent(username, email, password);
      }

      if (!authRes) throw new Error('Authentication failed.');

      if (authRes.token) {
        localStorage.setItem('focusforge_token', authRes.token);
      }

      const linkingErrors: string[] = [];
      if (currentView === 'signup_parent') {
        const validLinks = kidLinks.filter((k) => k.username.trim() !== '');
        for (const link of validLinks) {
          try {
            await parents.linkChild(link.username);
          } catch (err: any) {
            console.error('Failed to link child:', link.username, err);
            linkingErrors.push(err.message || link.username);
          }
        }
      }

      if (linkingErrors.length > 0) {
        setError(`Warning: Parent account created, but failed to link some kids: ${linkingErrors.join(', ')}`);
        setIsLoading(false);
        return;
      }

      const role = currentView.includes('parent') ? 'parent' : 'kid';
      localStorage.setItem('focusforge_role', role);

      login(authRes.token, authRes.user);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const addKidLink = () => {
    if (kidLinks.length < 10) {
      setKidLinks([...kidLinks, { username: '', password: '' }]);
    }
  };

  const removeKidLink = (index: number) => {
    setKidLinks(kidLinks.filter((_, i) => i !== index));
  };

  const updateKidLink = (index: number, field: 'username' | 'password', value: string) => {
    const newLinks = [...kidLinks];
    newLinks[index][field] = value;
    setKidLinks(newLinks);
  };

  const renderInput = (label: string, value: string, setter: (v: string) => void, type = 'text', placeholder = '') => (
    <div className="flex w-full flex-col gap-1.5">
      <label className="font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder={placeholder}
        className="input-pop"
      />
    </div>
  );

  const renderPasswordInput = (label: string, value: string, setter: (v: string) => void, placeholder = '••••••••') => (
    <div className="flex w-full flex-col gap-1.5">
      <label className="font-display text-xs font-bold uppercase tracking-widest text-pop-maroon">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={placeholder}
          className="input-pop pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 text-pop-maroon transition-opacity hover:opacity-70"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  const errorBox = (extra = '') => (
    <div
      className={`rounded-3xl border-2 border-pop-maroon bg-pop-mustard/40 p-3 font-sans text-sm font-semibold text-pop-maroon shadow-pop ${extra}`}
    >
      {error}
    </div>
  );

  if (showHelp) {
    return <AuthHelpPage onClose={() => setShowHelp(false)} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-pop-cream">
      <section className="bg-pop-teal py-10 text-center text-pop-white sm:py-14">
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-pop-white/90">Retro-modern focus</p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-pop-white sm:text-5xl">FocusForge</h1>
        <p className="mx-auto mt-3 max-w-md px-4 font-sans text-sm font-medium text-pop-white/95 sm:text-base">
          Pill buttons, flat color blocks, and clarity first. Sign in and own your attention.
        </p>
      </section>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-pop-maroon bg-pop-white shadow-pop-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-pop-hover">
          <div className="relative border-b-4 border-pop-maroon bg-pop-mustard px-6 py-10 text-pop-maroon sm:px-10 sm:py-12">
            {currentView !== 'role_select' && (
              <button
                type="button"
                onClick={() => handleSwitchView('role_select')}
                className="brutalist-button absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-pop-white p-0 sm:left-8 sm:top-8"
                aria-label="Back to role selection"
              >
                <ArrowLeft className="h-5 w-5 text-pop-maroon" />
              </button>
            )}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-pop-maroon bg-pop-maroon shadow-pop">
                <Zap className="h-7 w-7 text-pop-mustard" fill="currentColor" />
              </div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-pop-maroon sm:text-4xl">
                {currentView === 'role_select'
                  ? 'Choose your lane'
                  : currentView.includes('login')
                    ? 'Welcome back'
                    : 'Create your account'}
              </h2>
              <p className="mt-2 font-sans text-sm font-semibold uppercase tracking-widest text-pop-maroon/85">
                {currentView === 'role_select'
                  ? 'Select your role'
                  : currentView.includes('login')
                    ? 'Sign in to continue'
                    : 'Join the crew'}
              </p>
            </div>
          </div>

          <div className="bg-pop-cream px-6 py-8 sm:px-10 sm:py-10">
            {currentView === 'role_select' && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleSwitchView('login_kid')}
                  className="brutalist-card flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-pop-maroon bg-pop-teal/25 p-8 text-pop-maroon transition-all duration-200 ease-in-out hover:-translate-y-0.5"
                >
                  <div className="rounded-full border-2 border-pop-maroon bg-pop-white p-4 shadow-pop transition-transform duration-200 group-hover:scale-105">
                    <User className="h-8 w-8 text-pop-maroon" />
                  </div>
                  <span className="font-display text-xl font-bold uppercase">Login as Kid</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchView('login_parent')}
                  className="brutalist-card flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-pop-maroon bg-pop-mustard/50 p-8 text-pop-maroon transition-all duration-200 ease-in-out hover:-translate-y-0.5"
                >
                  <div className="rounded-full border-2 border-pop-maroon bg-pop-white p-4 shadow-pop transition-transform duration-200 group-hover:scale-105">
                    <Users className="h-8 w-8 text-pop-maroon" />
                  </div>
                  <span className="font-display text-xl font-bold uppercase">Login as Parent</span>
                </button>
              </div>
            )}

            {(currentView === 'login_kid' || currentView === 'login_parent') && (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
                <div className="mb-1 flex items-center justify-center gap-2">
                  {currentView === 'login_kid' ? (
                    <User className="h-5 w-5 text-pop-maroon" />
                  ) : (
                    <Users className="h-5 w-5 text-pop-maroon" />
                  )}
                  <h3 className="font-display text-xl font-bold uppercase text-pop-maroon">
                    {currentView === 'login_kid' ? 'Kid Portal' : 'Parent Portal'}
                  </h3>
                </div>

                {renderInput('Username / Email', identifier, setIdentifier, 'text', 'warrior99 or you@example.com')}
                {renderPasswordInput('Password', password, setPassword)}

                {error && errorBox('mt-1')}

                <button type="submit" disabled={isLoading} className="btn-pop-primary mt-2 w-full py-4 disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enter Portal'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => handleSwitchView(currentView === 'login_kid' ? 'signup_kid' : 'signup_parent')}
                    className="btn-pop-secondary w-full sm:w-auto"
                  >
                    Need an account? Sign up
                  </button>
                </div>
              </form>
            )}

            {currentView === 'signup_kid' && (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <User className="h-5 w-5 text-pop-maroon" />
                  <h3 className="font-display text-xl font-bold uppercase text-pop-maroon">Create Kid Account</h3>
                </div>

                {renderInput('Username', username, setUsername, 'text', 'focus_master')}
                {renderInput('Email (Optional)', email, setEmail, 'email', 'kid@example.com')}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {renderPasswordInput('Password', password, setPassword)}
                  {renderPasswordInput('Confirm', confirmPassword, setConfirmPassword)}
                </div>

                {error && errorBox()}

                <button type="submit" disabled={isLoading} className="btn-pop-primary mt-2 w-full py-4 disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login_kid')}
                    className="font-display text-xs font-bold uppercase tracking-wider text-pop-maroon underline-offset-4 transition-opacity hover:opacity-80"
                  >
                    Already registered? Sign in
                  </button>
                </div>
              </form>
            )}

            {currentView === 'signup_parent' && (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-6">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-pop-maroon" />
                  <h3 className="font-display text-xl font-bold uppercase text-pop-maroon">Create Parent Account</h3>
                </div>

                <div className="rounded-3xl border-2 border-pop-maroon bg-pop-mustard/35 p-6 shadow-pop">
                  <h4 className="mb-4 border-b-2 border-pop-maroon pb-2 font-display text-sm font-bold uppercase tracking-widest text-pop-maroon">
                    Parent details
                  </h4>
                  <div className="flex flex-col gap-4">
                    {renderInput('Parent Username', username, setUsername, 'text', 'parent_user')}
                    {renderInput('Parent Email', email, setEmail, 'email', 'parent@example.com')}
                    {renderPasswordInput('Password', password, setPassword)}
                  </div>
                </div>

                <div className="rounded-3xl border-2 border-pop-maroon bg-pop-teal/20 p-6 text-pop-maroon shadow-pop">
                  <div className="mb-4 flex items-center justify-between border-b-2 border-pop-maroon pb-2">
                    <h4 className="font-display text-sm font-bold uppercase tracking-widest">Link kid accounts</h4>
                    <span className="rounded-full border-2 border-pop-maroon bg-pop-maroon px-3 py-1 font-display text-xs font-bold text-pop-white">
                      {kidLinks.length} / 10
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {kidLinks.map((link, index) => (
                      <div
                        key={index}
                        className="relative rounded-2xl border-2 border-pop-maroon bg-pop-white p-4 shadow-pop sm:rounded-3xl"
                      >
                        {kidLinks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKidLink(index)}
                            className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-pop-maroon bg-zen-terracotta text-pop-white shadow-pop transition-transform hover:scale-105"
                            aria-label="Remove kid row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <div className="flex-1 space-y-3 sm:flex sm:items-end sm:gap-3 sm:space-y-0">
                          <div className="min-w-0 flex-1">{renderInput(`Kid ${index + 1} username`, link.username, (v) => updateKidLink(index, 'username', v))}</div>
                          <div className="min-w-0 flex-1">{renderPasswordInput(`Kid ${index + 1} password`, link.password, (v) => updateKidLink(index, 'password', v))}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-2">
                    {kidLinks.length < 10 ? (
                      <button type="button" onClick={addKidLink} className="btn-pop-secondary flex items-center gap-2 px-5 py-2 text-xs">
                        <Plus className="h-4 w-4" /> Add another kid
                      </button>
                    ) : (
                      <p className="rounded-full border-2 border-pop-maroon bg-pop-white px-3 py-2 font-sans text-xs font-semibold text-pop-maroon">
                        Maximum of 10 kid accounts reached.
                      </p>
                    )}
                  </div>
                </div>

                {error && errorBox()}

                <button type="submit" disabled={isLoading} className="btn-pop-primary w-full py-4 disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Parent Account'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => handleSwitchView('login_parent')}
                    className="font-display text-xs font-bold uppercase tracking-wider text-pop-maroon underline-offset-4 transition-opacity hover:opacity-80"
                  >
                    Already have a parent account? Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t-4 border-pop-maroon bg-pop-maroon py-6 text-center font-display text-xs font-bold uppercase tracking-widest text-pop-white">
        FocusForge · Built for deep work
      </footer>

      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className="brutalist-button fixed bottom-5 left-4 z-50 flex items-center gap-2 rounded-full border-2 border-pop-maroon bg-pop-mustard px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-pop-maroon shadow-pop-md transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-pop-mustard/95 sm:bottom-6 sm:left-6"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        aria-label="Open help and user guide"
      >
        <HelpCircle className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
        HELP!
      </button>
    </div>
  );
}
