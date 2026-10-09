import React, { useState } from 'react';
import { Shield, CheckCircle2, Settings2 } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PlatformLogo } from '@/components/ui/PlatformLogo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';

interface CooldownRule {
  id: string;
  name: string;
  enabled: boolean;
  duration: string;
}

export function GovernancePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cooldownRules, setCooldownRules] = useState<CooldownRule[]>([
    { id: 'edge', name: 'Edge Add-ons', enabled: false, duration: '2 days [Default]' },
    { id: 'windsurf', name: 'Windsurf', enabled: false, duration: '2 days [Default]' },
    { id: 'pypi', name: 'PyPI', enabled: false, duration: '1 day [Default]' },
    { id: 'openvsx', name: 'Open VSX Registry', enabled: true, duration: '7 days' },
    { id: 'cws', name: 'Chrome Web Store', enabled: false, duration: '2 days [Default]' },
    { id: 'vscode', name: 'VS Code Marketplace', enabled: true, duration: '7 days' },
  ]);

  const [appliedToast, setAppliedToast] = useState(false);

  const toggleRule = (id: string) => {
    setCooldownRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const setRuleDuration = (id: string, duration: string) => {
    setCooldownRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, duration } : r))
    );
  };

  const handleApply = () => {
    setModalOpen(false);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 3000);
  };

  return (
    <div className="min-h-full pb-12">
      {/* Topbar with Breadcrumbs */}
      <Topbar
        breadcrumbs={
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Governance</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Guardrails</span>
          </div>
        }
      />

      <div className="p-6 max-w-[1280px] mx-auto space-y-6">
        {/* Top Header Strip with Protection Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Supply Chain Guardrails
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Turn on advanced guardrails to maximize security with minimal effort
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Protection score</span>
            <div className="w-32 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[100%]" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">100%</span>
          </div>
        </div>

        {appliedToast && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Guardrail cooldown configurations updated and saved.</span>
          </div>
        )}

        {/* Guardrail Rules List */}
        <div className="space-y-3">
          {/* Rule 1: Malware Protection */}
          <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-not-allowed opacity-80"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Malware Protection</h3>
                  <Badge variant="neutral" size="sm">
                    Mandatory
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Block known malware identified across threat feeds and internal intelligence.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="allowed" size="sm">
                    Active
                  </Badge>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-blocks matched hashes and domains
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Rule 2: Version Update Cooldown */}
          <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Version update cooldown</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Delay adoption of newly released packages until they pass community quarantine.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="allowed" size="sm">
                    Active
                  </Badge>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protects against hijacked accounts and typo-squatting
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="text-xs gap-1.5 shrink-0"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Configure Cooldown
            </Button>
          </Card>

          {/* Rule 3: Scan-first protection */}
          <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scan-first protection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prevent execution of freshly installed binaries until local static AST analysis and threat intel lookup completes.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="allowed" size="sm">
                    Analysis Pre-check
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Rule 4: Agent credential protection */}
          <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Agent credential protection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Prevents IDE agents and LLM extensions from reading sensitive environment keys (.env, AWS, SSH keys) unprompted.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="allowed" size="sm">
                    FS Guardrail Active
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* VERSION UPDATE COOLDOWN CONFIGURATION MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Version update cooldown configuration
            </DialogTitle>
            <DialogDescription>
              Configure quarantine durations for freshly updated packages across developer registries.
            </DialogDescription>
          </DialogHeader>

          {/* Registries Toggles List with Platform Logos */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 py-2">
            {cooldownRules.map((rule) => (
              <div key={rule.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Switch Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-100 dark:peer-checked:after:bg-slate-900"></div>
                  </label>

                  {/* Platform Logo + Name */}
                  <div className="flex items-center gap-2">
                    <PlatformLogo platform={rule.id} size={16} />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{rule.name}</span>
                  </div>
                </div>

                {/* Duration selector */}
                <select
                  value={rule.duration}
                  onChange={(e) => setRuleDuration(rule.id, e.target.value)}
                  className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 cursor-pointer"
                >
                  <option value="1 day [Default]">1 day [Default]</option>
                  <option value="2 days [Default]">2 days [Default]</option>
                  <option value="3 days">3 days</option>
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                </select>
              </div>
            ))}
          </div>

          {/* Endpoints groups tag dropdown */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Endpoints groups
            </label>
            <div className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                Developers <span className="cursor-pointer text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">✕</span>
              </span>
              <span className="text-xs text-slate-400">▾</span>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
