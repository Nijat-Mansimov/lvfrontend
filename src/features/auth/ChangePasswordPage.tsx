import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { authEndpoints } from '@/api/endpoints/auth';
import { useAuth } from './useSession';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/schemas/common';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isForced = searchParams.get('forced') === '1';

  const { user, refetchSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');

  // Policy checks
  const hasMinLength = (newPassword || '').length >= 12;
  const hasUpper = /[A-Z]/.test(newPassword || '');
  const hasLower = /[a-z]/.test(newPassword || '');
  const hasDigit = /[0-9]/.test(newPassword || '');
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword || '');
  const charClassCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;
  const meetsComplexity = charClassCount >= 3;
  const notContainsUsername =
    !user?.username || !(newPassword || '').toLowerCase().includes(user.username.toLowerCase());

  const onSubmit = async (data: { current_password: string; new_password: string; confirm_password: string }) => {
    setServerError(null);

    if (data.new_password !== data.confirm_password) {
      setServerError('New passwords do not match');
      return;
    }

    if (!hasMinLength || !meetsComplexity || !notContainsUsername) {
      setServerError('Password does not meet security policy requirements');
      return;
    }

    setIsSubmitting(true);
    try {
      await authEndpoints.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      await refetchSession();
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setServerError(err.message || 'Failed to change password');
      } else {
        setServerError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isForced ? 'Password Change Required' : 'Change Account Password'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isForced
                ? 'Your account requires an updated password before accessing the dashboard.'
                : 'Update your login credentials.'}
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Password Changed Successfully</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Session rotated. Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2 text-xs text-red-700 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <Input
                {...register('current_password', { required: 'Current password is required' })}
                type="password"
                autoComplete="current-password"
                placeholder="Enter current password"
              />
              {errors.current_password && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{errors.current_password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <Input
                {...register('new_password', { required: 'New password is required' })}
                type="password"
                autoComplete="new-password"
                placeholder="At least 12 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <Input
                {...register('confirm_password', { required: 'Please confirm new password' })}
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter new password"
              />
            </div>

            {/* Password Policy Checklist */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block text-[11px]">Security Requirements:</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least 12 characters long</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                {meetsComplexity ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                <span>At least 3 character classes (uppercase, lowercase, numbers, symbols)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]">
                {notContainsUsername ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                <span>Must not contain your username</span>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
