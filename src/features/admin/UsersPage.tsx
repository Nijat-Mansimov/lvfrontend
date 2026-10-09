import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  KeyRound,
  Unlock,
  UserX,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { adminEndpoints } from '@/api/endpoints/admin';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import type { User, Role } from '@/api/schemas/auth';
import { ApiError } from '@/api/schemas/common';
import { formatRelativeTime } from '@/lib/formatting';

export function UsersPage() {
  const queryClient = useQueryClient();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resetModalUser, setResetModalUser] = useState<User | null>(null);
  const [tempPasswordInput, setTempPasswordInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState<Role>('analyst');
  const [newPassword, setNewPassword] = useState('Temporary-P@ssw0rd!');

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: adminEndpoints.getUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: adminEndpoints.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
      setCreateModalOpen(false);
      setFeedbackMessage({ text: 'User created successfully.', type: 'success' });
      setNewUsername('');
      setNewDisplayName('');
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.code === 'username_taken') {
        setFeedbackMessage({ text: 'Username is already taken.', type: 'error' });
      } else {
        setFeedbackMessage({ text: 'Failed to create user.', type: 'error' });
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { role?: Role; is_active?: boolean } }) =>
      adminEndpoints.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
      setFeedbackMessage({ text: 'User updated successfully.', type: 'success' });
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError && err.code === 'last_admin') {
        setFeedbackMessage({ text: 'Cannot modify or deactivate the last active administrator.', type: 'error' });
      } else {
        setFeedbackMessage({ text: 'Failed to update user.', type: 'error' });
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, temporary_password }: { id: string; temporary_password: string }) =>
      adminEndpoints.resetPassword(id, { temporary_password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
      setResetModalUser(null);
      setFeedbackMessage({ text: 'Temporary password reset successfully.', type: 'success' });
    },
    onError: () => {
      setFeedbackMessage({ text: 'Failed to reset password.', type: 'error' });
    },
  });

  const unlockUserMutation = useMutation({
    mutationFn: (id: string) => adminEndpoints.updateUser(id, { is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
      setFeedbackMessage({ text: 'Account unlocked successfully.', type: 'success' });
    },
  });

  const revokeSessionsMutation = useMutation({
    mutationFn: adminEndpoints.revokeSessions,
    onSuccess: () => {
      setFeedbackMessage({ text: 'All active sessions for user revoked.', type: 'success' });
    },
  });

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Administration</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">User Management</span>
          </div>
        }
      />

      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        <PageHeader
          title="User Accounts & Access Control"
          description="Manage analyst credentials, RBAC roles (Admin, Analyst, Viewer), and enforce password resets."
          actions={
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="gap-1.5 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add User
            </Button>
          }
        />

        {feedbackMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between shadow-2xs animate-in fade-in-0 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300'
            }`}
          >
            <span>{feedbackMessage.text}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {error ? (
          <ErrorState
            title="Failed to load users"
            message={error.message}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Password State</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {users.map((u) => {
                    const isLocked = u.locked_until && new Date(u.locked_until) > new Date();

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        {/* User identity */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{u.display_name}</div>
                          <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500">@{u.username}</div>
                        </td>

                        {/* Role selector */}
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateUserMutation.mutate({
                                id: u.id,
                                data: { role: e.target.value as Role },
                              })
                            }
                            className="text-xs font-semibold px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 capitalize text-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            <option value="admin">Admin</option>
                            <option value="analyst">Analyst</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        </td>

                        {/* Active / Locked status */}
                        <td className="py-3 px-4">
                          {isLocked ? (
                            <Badge variant="blocked">Locked</Badge>
                          ) : u.is_active ? (
                            <Badge variant="allowed">Active</Badge>
                          ) : (
                            <Badge variant="neutral">Deactivated</Badge>
                          )}
                        </td>

                        {/* Password state */}
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                          {u.must_change_password ? (
                            <span className="text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded font-medium border border-amber-200 dark:border-amber-900/60">
                              Must change password
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">Standard</span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {u.last_login_at ? formatRelativeTime(u.last_login_at) : 'Never'}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isLocked && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => unlockUserMutation.mutate(u.id)}
                                title="Unlock account"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setResetModalUser(u);
                                setTempPasswordInput('Temporary-P@ssw0rd!');
                              }}
                              title="Reset temporary password"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateUserMutation.mutate({
                                  id: u.id,
                                  data: { is_active: !u.is_active },
                                })
                              }
                              title={u.is_active ? 'Deactivate user' : 'Activate user'}
                            >
                              {u.is_active ? <UserX className="w-3.5 h-3.5 text-red-500" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => revokeSessionsMutation.mutate(u.id)}
                              title="Revoke all sessions"
                            >
                              <LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create an account. The user will be required to change their password on first sign-in.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. jdoe"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
              <Input
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="e.g. John Doe (SOC Tier 1)"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="analyst">Analyst (read + trigger risk analysis)</option>
                <option value="viewer">Viewer (read only)</option>
                <option value="admin">Administrator (full administrative access)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Temporary Password</label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!newUsername || !newDisplayName || newPassword.length < 12}
              isLoading={createUserMutation.isPending}
              onClick={() =>
                createUserMutation.mutate({
                  username: newUsername,
                  display_name: newDisplayName,
                  role: newRole,
                  password: newPassword,
                })
              }
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESET PASSWORD MODAL */}
      <Dialog open={!!resetModalUser} onOpenChange={(open) => !open && setResetModalUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Temporary Password</DialogTitle>
            <DialogDescription>
              Assign a temporary password for @{resetModalUser?.username}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 text-xs space-y-2">
            <label className="block font-medium text-slate-700 dark:text-slate-300">Temporary Password</label>
            <Input
              type="text"
              value={tempPasswordInput}
              onChange={(e) => setTempPasswordInput(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setResetModalUser(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={tempPasswordInput.length < 12}
              isLoading={resetPasswordMutation.isPending}
              onClick={() => {
                if (resetModalUser) {
                  resetPasswordMutation.mutate({
                    id: resetModalUser.id,
                    temporary_password: tempPasswordInput,
                  });
                }
              }}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            >
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
