import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  KeyRound,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { adminEndpoints } from '@/api/endpoints/admin';
import { inventoryEndpoints } from '@/api/endpoints/inventory';
import { queryKeys } from '@/api/queryKeys';
import { Topbar } from '@/components/layout/Topbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CopyButton } from '@/components/ui/CopyButton';
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
import type { ApiKeyScope } from '@/api/schemas/admin';
import { formatDateTime, formatRelativeTime } from '@/lib/formatting';

export function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [includeRevoked, setIncludeRevoked] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [revokeKeyId, setRevokeKeyId] = useState<string | null>(null);

  // Plaintext key shown ONLY once modal state
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Form state
  const [keyName, setKeyName] = useState('');
  const [scopes, setScopes] = useState<ApiKeyScope[]>(['inventory:write', 'read']);
  const [deviceId, setDeviceId] = useState<string>('');
  const [expiresInDays, setExpiresInDays] = useState<number>(365);

  const {
    data: keys = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.apiKeys(includeRevoked),
    queryFn: () => adminEndpoints.getApiKeys(includeRevoked),
  });

  const { data: endpointsData } = useQuery({
    queryKey: queryKeys.inventory.endpoints,
    queryFn: inventoryEndpoints.getEndpoints,
  });

  const createKeyMutation = useMutation({
    mutationFn: adminEndpoints.createApiKey,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.apiKeys(includeRevoked) });
      setCreateModalOpen(false);
      setNewlyCreatedKey(res.key);
      setKeyName('');
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: adminEndpoints.revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.apiKeys(includeRevoked) });
      setRevokeKeyId(null);
    },
  });

  const toggleScope = (scope: ApiKeyScope) => {
    if (scopes.includes(scope)) {
      setScopes(scopes.filter((s) => s !== scope));
    } else {
      setScopes([...scopes, scope]);
    }
  };

  return (
    <div className="min-h-full pb-12">
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span>Administration</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              API Key Management
            </span>
          </div>
        }
      />

      <div className="p-6 max-w-[1560px] mx-auto space-y-6">
        <PageHeader
          title="Endpoint Collector & Integration API Keys"
          description="Issue scoped bearer credentials for automated collectors and SIEM integrations."
          actions={
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="gap-1.5 text-xs bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            >
              <Plus className="w-3.5 h-3.5" />
              Generate API Key
            </Button>
          }
        />

        {/* Filters row */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeRevoked}
              onChange={(e) => setIncludeRevoked(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-900"
            />
            <span>Show revoked and expired keys</span>
          </label>
        </div>

        {error ? (
          <ErrorState
            title="Failed to load API keys"
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
                    <th className="py-3 px-4">Key Name</th>
                    <th className="py-3 px-4">Key Prefix</th>
                    <th className="py-3 px-4">Bound Endpoint</th>
                    <th className="py-3 px-4">Scopes</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Expires</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {k.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                        {k.prefix}...
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                        {k.device_id ? (
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {k.device_id}
                          </span>
                        ) : (
                          <span className="text-slate-400">Any endpoint</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {k.scopes.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {formatDateTime(k.created_at)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {k.expires_at ? formatDateTime(k.expires_at) : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        {k.revoked_at ? (
                          <Badge variant="blocked">Revoked</Badge>
                        ) : (
                          <Badge variant="allowed">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!k.revoked_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRevokeKeyId(k.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-slate-200 dark:border-slate-700"
                            title="Revoke key"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE API KEY MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create credentials for collectors. The plaintext token will be displayed only once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Key Description / Purpose</label>
              <Input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Production Endpoint Agent - MBP 16"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">Scopes & Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'inventory:write', label: 'inventory:write (Ingest scans)' },
                  { id: 'read', label: 'read (View items & endpoints)' },
                  { id: 'intel:run', label: 'intel:run (Trigger recalculations)' },
                  { id: 'admin', label: 'admin (Full administrative access)' },
                ].map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={scopes.includes(s.id as ApiKeyScope)}
                      onChange={() => toggleScope(s.id as ApiKeyScope)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Device Binding (Optional)</label>
              <select
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="">No binding (Any collector device)</option>
                {endpointsData?.endpoints.map((ep) => (
                  <option key={ep.device_id} value={ep.device_id}>
                    {ep.hostname} ({ep.device_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Validity Period</label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(parseInt(e.target.value, 10))}
                className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
                <option value={365}>1 Year [Recommended]</option>
                <option value={730}>2 Years</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!keyName || scopes.length === 0}
              isLoading={createKeyMutation.isPending}
              onClick={() =>
                createKeyMutation.mutate({
                  name: keyName,
                  scopes,
                  device_id: deviceId || undefined,
                  expires_in_days: expiresInDays,
                })
              }
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
            >
              Generate Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PLAINTEXT KEY ONE-TIME DISPLAY MODAL */}
      <Dialog open={!!newlyCreatedKey} onOpenChange={() => setNewlyCreatedKey(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              API Key Generated Successfully
            </DialogTitle>
            <DialogDescription>
              Copy and store this token now. For security purposes, it will never be displayed again.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs break-all relative flex items-center justify-between border border-slate-800">
              <span>{newlyCreatedKey}</span>
              <CopyButton value={newlyCreatedKey || ''} className="text-slate-300 hover:text-white" />
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setNewlyCreatedKey(null)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REVOKE CONFIRMATION MODAL */}
      <Dialog open={!!revokeKeyId} onOpenChange={(open) => !open && setRevokeKeyId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              Confirm Revocation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke this API key? Any collector or automated workflow using it will immediately cease to authenticate.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="secondary" size="sm" onClick={() => setRevokeKeyId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={revokeKeyMutation.isPending}
              onClick={() => revokeKeyId && revokeKeyMutation.mutate(revokeKeyId)}
            >
              Revoke Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
