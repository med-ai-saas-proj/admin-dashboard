import "./config/i18n";

import { KeycloakProvider } from "@/features/auth/providers/keycloak-provider";
import { query_client } from "@/query/query-client";
import LoginPage from "@/routes/login";
import { ProtectedRoute } from "@/routes/protected-route";

import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { AppLayout } from "@/layouts/app-layout";
import { PublicRoute } from "./routes/public-route";
import BillingDashboard from "./routes/billing";
import BillingOverview from "./features/billing/components/billing-overview";
import BillingCredit from "./features/billing/components/billing-credit";
import BillingInvoice from "./features/billing/components/billing-invoice";
import ChartDashboard from "./routes/chart-dashboard";
import DashboardBilling from "./features/dashboard/components/dashboard-billing";
import GeneralAdmin from "./routes/admin-dashboard-admin";
import GeneralUsers from "./routes/admin-dashboard-users";

function App() {
	return (
		<QueryClientProvider client={query_client}>
			<KeycloakProvider>
				<BrowserRouter>
					<Toaster />
					<Routes>
						<Route
							path="/login"
							element={
								<PublicRoute>
									<LoginPage />
								</PublicRoute>
							}
						/>
						{/* TODO: Replace with main home page later, temporarily redirecting to /chat for now */}
						<Route path="/" element={<Navigate to="/management" replace />} />

						{/* App layout wraps all protected routes and provides persistent sidebar */}
						<Route
							element={
								<ProtectedRoute>
									<AppLayout />
								</ProtectedRoute>
							}
						>
							<Route path="admin-dashboard">
								<Route path="admin" element={<GeneralAdmin />} />
								<Route path="users" element={<GeneralUsers />} />
							</Route>
							<Route path="dashboard" element={<ChartDashboard />}>
								<Route
									index={true}
									element={<Navigate to="billing" replace />}
								/>
								<Route path="billing" element={<DashboardBilling />} />
							</Route>
							<Route path="management">
								<Route
									index={true}
									element={<Navigate to="billing" replace />}
								/>
								<Route path="billing" element={<BillingDashboard />}>
									<Route
										index={true}
										element={<Navigate to="overview" replace />}
									/>
									<Route path="overview" element={<BillingOverview />} />
									<Route path="invoices" element={<BillingInvoice />} />
									<Route path="credits" element={<BillingCredit />} />
								</Route>
							</Route>
						</Route>

						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</BrowserRouter>
			</KeycloakProvider>
		</QueryClientProvider>
	);
}

export default App;
