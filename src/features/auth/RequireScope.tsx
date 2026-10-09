import React from 'react';
import { useAuth } from './useSession';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function RequireScope({
  scope,
  children,
}: {
  scope: string;
  children: React.ReactNode;
}) {
  const { hasScope } = useAuth();
  const navigate = useNavigate();

  if (!hasScope(scope)) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center mt-12">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Access Restricted</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          You do not have the required permission scope (<code className="font-mono text-slate-800">{scope}</code>) to access this view. Contact your administrator if you believe this is an error.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
