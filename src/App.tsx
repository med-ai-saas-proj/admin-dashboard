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
import AdminOrganizations from "./routes/admin-organizations";
import AdminOrganizationsOverview from "./features/admin-organizations/components/admin-organizations-overview";
import AdminOrganizationDetails from "./routes/admin-organization-details";
import AdminOrganizationDetailsUsers from "./features/admin-organization-details/components/admin-organization-details-users";
import AdminOrganizationDetailsSettings from "./features/admin-organization-details/components/admin-organization-details-settings";
import AdminOrganizationPermissions from "./features/admin-organizations/components/admin-organization-permissions";
import AdminProjectsOrganization from "./features/admin-projects/components/admin-projects-organization";
import AdminProjects from "./routes/admin-projects";
import AdminProjectsPermissions from "./features/admin-projects/components/admin-projects-permissions";

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
								<Route path="organizations" element={<AdminOrganizations />}>
									<Route
										index={true}
										element={<Navigate to="overview" replace />}
									/>
									<Route
										path="overview"
										element={<AdminOrganizationsOverview />}
									/>
									<Route
										path="permissions"
										element={<AdminOrganizationPermissions />}
									/>
								</Route>
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
							<Route
								path="organizations/:orgId"
								element={<AdminOrganizationDetails />}
							>
								{/* Redirects /organizations/123 to /organizations/123/users */}
								<Route index element={<Navigate to="users" replace />} />

								<Route
									path="users"
									element={<AdminOrganizationDetailsUsers />}
								/>
								<Route path="projects" element={<AdminProjects />}>
									<Route index element={<Navigate to="overview" replace />} />
									<Route
										path="overview"
										element={<AdminProjectsOrganization />}
									/>
									<Route
										path="permissions"
										element={<AdminProjectsPermissions />}
									/>
								</Route>
								<Route
									path="settings"
									element={<AdminOrganizationDetailsSettings />}
								/>
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
