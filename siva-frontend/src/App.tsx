import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { LoadingBlock } from './components/ui/LoadingBlock';
import { RequireAdmin } from './features/admin/guards/RequireAdmin';
import { AdminLayout } from './features/admin/layout/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * A área administrativa é carregada sob demanda: as telas públicas (landing e
 * login) não precisam pagar o custo de `motion` e das tabelas administrativas.
 */
const AdminDashboardPage = lazy(() =>
  import('./features/admin/dashboard/AdminDashboardPage').then((m) => ({
    default: m.default,
  })),
);
const CompaniesPage = lazy(() =>
  import('./features/admin/companies/CompaniesPage').then((m) => ({ default: m.default })),
);
const CompanyDetailPage = lazy(() =>
  import('./features/admin/companies/CompanyDetailPage').then((m) => ({ default: m.default })),
);
const UsersPage = lazy(() =>
  import('./features/admin/users/UsersPage').then((m) => ({ default: m.default })),
);
const SensorsPage = lazy(() =>
  import('./features/admin/sensors/SensorsPage').then((m) => ({ default: m.default })),
);

function AdminFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingBlock label="Carregando painel…" minHeight="12rem" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="empresas"
          element={
            <Suspense fallback={<AdminFallback />}>
              <CompaniesPage />
            </Suspense>
          }
        />
        <Route
          path="empresas/:id"
          element={
            <Suspense fallback={<AdminFallback />}>
              <CompanyDetailPage />
            </Suspense>
          }
        />
        <Route
          path="usuarios"
          element={
            <Suspense fallback={<AdminFallback />}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path="sensores"
          element={
            <Suspense fallback={<AdminFallback />}>
              <SensorsPage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
