import React, { useState, useRef } from 'react';
import { Loader2, Eye, EyeOff, Zap, Shield, UserPlus } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { auth, AuthResponse } from '../services/api';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs for direct DOM access to bypass any React state synchronization issues with autofill
  const idRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const userRef = useRef<HTMLInputElement>(null);

  const { login } = useAppContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // FORCE SYNC: Programmatically touch the inputs to ensure password managers commit values
    // Some browsers only sync to the DOM node on focus/blur events
    idRef.current?.focus();
    passRef.current?.focus();
    // Move focus back to the form or submit button (or just blur)
    (e.target as HTMLFormElement).focus();

    // 1. Read values directly from DOM nodes (highest reliability for autofill)
    const currentIdentifier = idRef.current?.value.trim() || '';
    const currentPassword = passRef.current?.value.trim() || '';
    const currentUsername = userRef.current?.value.trim() || '';

    // 2. Validation
    if (!currentIdentifier || !currentPassword) {
      setError('Please enter your credentials.');
      return;
    }
    if (!isLoginView && !currentUsername) {
      setError('Username is required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let response: AuthResponse;
      if (isLoginView) {
        // Send to backend via service
        response = await auth.login(currentIdentifier, currentPassword);
      } else {
        response = await auth.register(currentUsername, currentIdentifier, currentPassword);
      }
      login(response.token, response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = () => {
    setIsLoginView(v => !v);
    setError('');
    setShowPassword(false);
  };

  return (
    <div
      style={{ background: '#F9FAFB', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}
      className="flex items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 brutalist-card overflow-hidden rounded-3xl">
        {/* LEFT PANEL */}
        <div
          style={{ backgroundColor: 'var(--neo-yellow)', padding: '48px 40px' }}
          className="flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--neo-border)', border: '2px solid var(--neo-border)', boxShadow: '3px 3px 0px rgba(0,0,0,0.4)' }}
              >
                <Zap className="w-6 h-6" style={{ color: 'var(--neo-yellow)', fill: 'var(--neo-yellow)' }} />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--neo-border)' }}>
                FocusForge
              </h1>
            </div>
            <h2 className="text-4xl font-black uppercase leading-tight mb-4" style={{ color: 'var(--neo-border)' }}>
              {isLoginView ? 'Welcome\nBack,\nWarrior.' : 'Join The\nResistance.'}
            </h2>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div style={{ backgroundColor: '#fff', padding: '48px 40px' }} className="flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-black uppercase" style={{ color: 'var(--neo-border)' }}>
              {isLoginView ? 'Log In To Dashboard' : 'New Warrior Setup'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {!isLoginView && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase tracking-widest">Username</label>
                <input
                  ref={userRef}
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="focus_master_99"
                  className="w-full rounded-full px-5 py-3 font-bold focus:outline-none"
                  style={{ backgroundColor: '#F9FAFB', border: '2px solid var(--neo-border)', boxShadow: '3px 3px 0px var(--neo-border)' }}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-widest">
                {isLoginView ? 'Email or Username' : 'Email'}
              </label>
              <input
                ref={idRef}
                name="identifier"
                type="text"
                autoComplete={isLoginView ? 'username email' : 'email'}
                placeholder={isLoginView ? 'you@example.com or warrior99' : 'you@example.com'}
                className="w-full rounded-full px-5 py-3 font-bold focus:outline-none"
                style={{ backgroundColor: '#F9FAFB', border: '2px solid var(--neo-border)', boxShadow: '3px 3px 0px var(--neo-border)' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  ref={passRef}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLoginView ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="w-full rounded-full px-5 py-3 pr-20 font-bold focus:outline-none"
                  style={{ backgroundColor: '#F9FAFB', border: '2px solid var(--neo-border)', boxShadow: '3px 3px 0px var(--neo-border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm font-bold bg-red-100 text-red-600 border-2 border-black shadow-[2px_2px_0px_black]">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="brutalist-button w-full py-4 rounded-full flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] mt-2 group"
              style={{ backgroundColor: 'var(--neo-border)', color: 'var(--neo-yellow)' }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  {isLoginView ? 'Enter The Forge' : 'Begin Your Legacy'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={switchView} className="text-xs font-black uppercase tracking-wider hover:underline">
              {isLoginView ? "Don't have an account? → Create one" : 'Already a warrior? → Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
