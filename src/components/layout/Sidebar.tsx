import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Layers,
  Laptop,
  History,
  Shield,
  ShieldAlert,
  Users,
  KeyRound,
  FileText,
  Moon,
  Sun,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BookCheck,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/features/auth/useSession';
import { useTheme } from '@/app/theme';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user, logout, hasScope } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [governanceOpen, setGovernanceOpen] = useState(true);
  const [showPlaybook, setShowPlaybook] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const isDarkMode = theme === 'dark';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isInventoryActive = location.pathname.startsWith('/inventory') || location.pathname.startsWith('/assets');

  return (
    <aside
      className={cn(
        'h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-200 z-30',
        collapsed ? 'w-18' : 'w-64'
      )}
    >
      {/* Top Brand & Header */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* KOI Brand Wordmark */}
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-rose-600 font-sans">
                KOI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                SOC
              </span>
            </div>
          </div>
          <button
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight className={cn('w-4 h-4 transition-transform duration-200', !collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* POV Progress Widget */}
        {!collapsed && (
          <div className="mx-3 my-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                POV progress
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">Day 1 / 30</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2.5">
              <div className="bg-emerald-500 h-full w-[12%]" />
            </div>
            <button
              onClick={() => setShowPlaybook(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              <BookCheck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              POV Playbook
            </button>
          </div>
        )}

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1 text-xs">
          {/* Dashboard */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )
            }
          >
            <LayoutGrid className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          {/* Endpoints */}
          <NavLink
            to="/endpoints"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )
            }
          >
            <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            {!collapsed && <span>Endpoints</span>}
          </NavLink>

          {/* Inventory Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setInventoryOpen(!inventoryOpen)}
              className={cn(
                'w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer',
                isInventoryActive && 'text-slate-900 dark:text-slate-100 font-semibold'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                {!collapsed && <span>Inventory</span>}
              </div>
              {!collapsed && (
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                    !inventoryOpen && '-rotate-90'
                  )}
                />
              )}
            </button>

            {!collapsed && inventoryOpen && (
              <div className="ml-5 pl-2.5 border-l border-slate-200 dark:border-slate-800 space-y-0.5 mt-0.5 text-slate-600 dark:text-slate-400">
                <NavLink
                  to="/inventory?category=all"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                      isActive && location.search.includes('category=all') && 'text-slate-900 dark:text-slate-100 font-semibold bg-slate-100 dark:bg-slate-800'
                    )
                  }
                >
                  <span>All Items</span>
                </NavLink>
                <NavLink
                  to="/inventory?category=browser_extension"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                      isActive && location.search.includes('category=browser_extension') && 'text-slate-900 dark:text-slate-100 font-semibold bg-slate-100 dark:bg-slate-800'
                    )
                  }
                >
                  <span>Extensions</span>
                </NavLink>
                <NavLink
                  to="/inventory?category=ai_skill"
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>Agentic AI</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded-xs">Preview</span>
                </NavLink>
                <NavLink
                  to="/inventory?category=mcp_server"
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>MCP Servers</span>
                </NavLink>
                <NavLink
                  to="/inventory?category=ide_extension"
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>IDE Extensions</span>
                </NavLink>
                <NavLink
                  to="/inventory?category=package"
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>Code Packages</span>
                </NavLink>
                <NavLink
                  to="/inventory?category=ai_model"
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>AI Models</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Scans & Changes */}
          <NavLink
            to="/runs"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )
            }
          >
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            {!collapsed && <span>Scans & Changes</span>}
          </NavLink>

          {/* Threat Intelligence */}
          <NavLink
            to="/intel"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )
            }
          >
            <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            {!collapsed && <span>Threat Intel</span>}
          </NavLink>

          {/* Governance */}
          <div>
            <button
              type="button"
              onClick={() => setGovernanceOpen(!governanceOpen)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                {!collapsed && <span>Governance</span>}
              </div>
              {!collapsed && (
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
                    !governanceOpen && '-rotate-90'
                  )}
                />
              )}
            </button>
            {!collapsed && governanceOpen && (
              <div className="ml-5 pl-2.5 border-l border-slate-200 dark:border-slate-800 space-y-0.5 mt-0.5 text-slate-600 dark:text-slate-400">
                <NavLink
                  to="/governance"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2 py-1.5 rounded-md hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                      isActive && 'text-slate-900 dark:text-slate-100 font-semibold bg-slate-100 dark:bg-slate-800'
                    )
                  }
                >
                  <span>Guardrails</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Admin Navigation Section (Requires admin scope) */}
          {hasScope('admin') && (
            <div className="pt-2">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Administration
                </div>
              )}
              <div className="space-y-0.5">
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )
                  }
                >
                  <Users className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  {!collapsed && <span>Users</span>}
                </NavLink>

                <NavLink
                  to="/admin/api-keys"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )
                  }
                >
                  <KeyRound className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  {!collapsed && <span>API Keys</span>}
                </NavLink>

                <NavLink
                  to="/admin/audit"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg font-medium transition-colors',
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    )
                  }
                >
                  <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  {!collapsed && <span>Audit Log</span>}
                </NavLink>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
        {/* Settings */}
        <NavLink
          to="/account/password"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
              isActive && 'text-slate-900 dark:text-slate-100 font-semibold bg-slate-100 dark:bg-slate-800'
            )
          }
        >
          <Settings className="w-4 h-4 text-slate-400 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500 shrink-0" /> : <Moon className="w-4 h-4 text-slate-400 shrink-0" />}
          {!collapsed && <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        {/* Documentation / SOC Guidelines */}
        <button
          type="button"
          onClick={() => setShowDocs(true)}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
          {!collapsed && <span>Docs</span>}
        </button>

        {/* User Workspace Profile Card */}
        <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                P
              </div>
              {!collapsed && (
                <div className="min-w-0 truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user?.display_name || 'Palo Testing'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                    {user?.role || 'SOC Admin'}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* POV Playbook Modal */}
      <Dialog open={showPlaybook} onOpenChange={setShowPlaybook}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookCheck className="w-5 h-5 text-emerald-600" />
              SOC Evaluation POV Playbook
            </DialogTitle>
            <DialogDescription>
              30-day proof-of-value workflow for Local Visibility software supply chain security.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Phase 1: Inventory Discovery (Days 1–7)</span>
              <p>Deploy read-only collectors to developer macOS endpoints. Inventory browser & IDE extensions, MCP servers, and models.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Phase 2: Threat Intel Enrichment (Days 8–18)</span>
              <p>Correlate assets against TPCI malicious feeds, OSV vulnerabilities, and detect unsanctioned code flows.</p>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1.5">
              <span className="font-semibold text-slate-900 dark:text-slate-100">Phase 3: Governance Policies (Days 19–30)</span>
              <p>Configure guardrail cooldowns on newly published extensions and prevent shadow AI exfiltration.</p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setShowPlaybook(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Docs Modal */}
      <Dialog open={showDocs} onOpenChange={setShowDocs}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Compass className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              Local Visibility SOC Analyst Guide
            </DialogTitle>
            <DialogDescription>
              Architecture & threat-hunting workflow documentation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-h-96 overflow-y-auto">
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Endpoint Collector:</strong> Runs locally on macOS endpoints with read-only permissions. Discovers browser extensions, IDE extensions, packages, and AI models.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Threat Intelligence Feeds:</strong> The backend enriches discovered artifacts with TPCI malicious feeds, OSV vulnerability databases, VirusTotal hashes, and AbuseIPDB network indicators.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-100">Risk Assessment Bands:</strong>
              <br />
              • <strong className="text-red-600 dark:text-red-400">Critical (80–100):</strong> Known malware match in threat feed or active credential exfiltration.
              <br />
              • <strong className="text-orange-600 dark:text-orange-400">High (50–79):</strong> Dangerous AST patterns, unprompted filesystem scans, or store delisting.
              <br />
              • <strong className="text-amber-600 dark:text-amber-400">Medium (20–49):</strong> High privilege requests or third-party proxy redirects.
              <br />
              • <strong className="text-sky-600 dark:text-sky-400">Low (1–19):</strong> Minor advisories or prototype pollution warnings.
              <br />
              • <strong className="text-slate-600 dark:text-slate-400">Informational (0):</strong> Verified publisher package with no threat indicators.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setShowDocs(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
