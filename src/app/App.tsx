import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ExperimentsPage } from "@/features/experiments/ExperimentsPage";
import { VariantsPage } from "@/features/variants/VariantsPage";
import { MetricsPage } from "@/features/metrics/MetricsPage";
import { ResultsPage } from "@/features/results/ResultsPage";
import { FeatureFlagsPage } from "@/features/feature-flags/FeatureFlagsPage";
import { AssignmentsPage } from "@/features/assignments/AssignmentsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="experiments" element={<ExperimentsPage />} />
        <Route path="variants" element={<VariantsPage />} />
        <Route path="metrics" element={<MetricsPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="feature-flags" element={<FeatureFlagsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
