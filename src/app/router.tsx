import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from './ErrorBoundary';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { RequireScope } from '@/features/auth/RequireScope';

import { LoginPage } from '@/features/auth/LoginPage';
import { ChangePasswordPage } from '@/features/auth/ChangePasswordPage';
import { OverviewPage } from '@/features/overview/OverviewPage';
import { EndpointsPage } from '@/features/endpoints/EndpointsPage';
import { EndpointDetailPage } from '@/features/endpoints/EndpointDetailPage';
import { InventoryPage } from '@/features/assets/InventoryPage';
import { GovernancePage } from '@/features/governance/GovernancePage';
import { RunsPage } from '@/features/runs/RunsPage';
import { ThreatIntelPage } from '@/features/intel/ThreatIntelPage';
import { UsersPage } from '@/features/admin/UsersPage';
import { ApiKeysPage } from '@/features/admin/ApiKeysPage';
import { AuditLogPage } from '@/features/admin/AuditLogPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary><LoginPage /></ErrorBoundary>,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <ErrorBoundary><div className="p-6">View Error</div></ErrorBoundary>,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'endpoints',
        element: <EndpointsPage />,
      },
      {
        path: 'endpoints/:deviceId',
        element: <EndpointDetailPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'governance',
        element: <GovernancePage />,
      },
      {
        path: 'runs',
        element: <RunsPage />,
      },
      {
        path: 'intel',
        element: <ThreatIntelPage />,
      },
      {
        path: 'account/password',
        element: <ChangePasswordPage />,
      },
      {
        path: 'admin/users',
        element: (
          <RequireScope scope="admin">
            <UsersPage />
          </RequireScope>
        ),
      },
      {
        path: 'admin/api-keys',
        element: (
          <RequireScope scope="admin">
            <ApiKeysPage />
          </RequireScope>
        ),
      },
      {
        path: 'admin/audit',
        element: (
          <RequireScope scope="admin">
            <AuditLogPage />
          </RequireScope>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
