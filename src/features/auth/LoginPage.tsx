import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, User as UserIcon, ShieldAlert, Sun, Moon } from 'lucide-react';
import { LoginRequest, LoginRequestSchema } from '@/api/schemas/auth';
import { authEndpoints } from '@/api/endpoints/auth';
import { useAuth } from './useSession';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isMockMode } from '@/api/client';
import { ApiError } from '@/api/schemas/common';
import { useTheme } from '@/app/theme';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/';
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const { refetchSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await authEndpoints.login(data);
      await refetchSession();
      const me = await authEndpoints.getMe();
      if (me.must_change_password) {
        navigate('/account/password?forced=1', { replace: true });
      } else {
        navigate(next, { replace: true });
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setServerError('Invalid username or password');
        } else if (err.status === 429) {
          setServerError(err.message || 'Too many attempts. Please try again later.');
        } else {
          setServerError(err.message || 'An error occurred during sign in');
        }
      } else {
        setServerError('Unable to connect to the authentication service');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPresetUser = (u: string, p: string) => {
    setValue('username', u);
    setValue('password', p);
    setServerError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative">
      <button
        type="button"
        onClick={toggleTheme}
        title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
        className="absolute top-4 right-4 p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
      </button>

      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl font-black tracking-tight text-rose-600 font-sans">
              KOI
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              SOC
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Local Visibility</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Endpoint Software Supply Chain Security</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400 animate-in fade-in-0">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Username
              </label>
              <Input
                {...register('username')}
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                icon={<UserIcon className="w-4 h-4" />}
              />
              {errors.username && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  icon={<Lock className="w-4 h-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          {/* Quick preset credentials for testing */}
          {isMockMode && (
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                Demo Accounts (Click to fill):
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPresetUser('admin', 'Admin-Passw0rd!')}
                  className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 text-center font-medium transition-colors cursor-pointer"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setPresetUser('analyst', 'Analyst-Passw0rd!')}
                  className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 text-center font-medium transition-colors cursor-pointer"
                >
                  Analyst
                </button>
                <button
                  type="button"
                  onClick={() => setPresetUser('auditor', 'Viewer-Passw0rd!')}
                  className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 text-center font-medium transition-colors cursor-pointer"
                >
                  Auditor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
