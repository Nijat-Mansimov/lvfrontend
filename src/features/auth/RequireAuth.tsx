import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useSession';
import { Skeleton } from '@/components/ui/Skeleton';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md p-6 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (session.must_change_password && !location.pathname.startsWith('/account/password')) {
    return <Navigate to="/account/password?forced=1" replace />;
  }

  return <>{children}</>;
}
