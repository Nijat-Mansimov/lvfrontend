import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authEndpoints } from '@/api/endpoints/auth';
import { queryKeys } from '@/api/queryKeys';
import type { MeResponse } from '@/api/schemas/auth';

interface AuthContextType {
  session: MeResponse | undefined;
  user: MeResponse['user'] | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasScope: (scope: string) => boolean;
  logout: () => Promise<void>;
  refetchSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: session, isLoading, refetch } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authEndpoints.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: authEndpoints.logout,
    onSuccess: () => {
      queryClient.clear();
      refetch();
    },
  });

  const hasScope = (scope: string): boolean => {
    if (!session) return false;
    return session.scopes.includes(scope) || session.role === 'admin';
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      queryClient.clear();
    }
  };

  const refetchSession = async () => {
    await refetch();
  };

  const value: AuthContextType = {
    session,
    user: session?.user,
    isLoading,
    isAuthenticated: !!session,
    hasScope,
    logout,
    refetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
