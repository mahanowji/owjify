import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// General Public Marketplace Pages
import HomePage from '../pages/Home/HomePage';
import ExplorePage from '../pages/Explore/ExplorePage';
import ServiceDetailsPage from '../pages/ServiceDetails/ServiceDetailsPage';
import ProfessionalProfilePage from '../pages/ProfessionalProfile/ProfessionalProfilePage';
import SupportPage from '../pages/Support/SupportPage';

// Operator & Admin Consoles
import OperatorDashboardPage from '../pages/Operator/OperatorDashboardPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';

// Token-Protected User & Specialist Pages
import CreateAdPage from '../pages/CreateAdvertisement/CreateAdPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import MessagesPage from '../pages/Messages/MessagesPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import EditProfilePage from '../pages/Settings/EditProfilePage';
import FavoritesPage from '../pages/Settings/FavoritesPage';

// Authentication Pages
import LoginPage from '../pages/Auth/LoginPage';
import SignUpPage from '../pages/Auth/SignUpPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import VerifySuccessPage from '../pages/Auth/VerifySuccessPage';
import AuthErrorPage from '../pages/Auth/AuthErrorPage';

// General Static & Editorial Pages
import CategoriesPage from '../pages/Static/CategoriesPage';
import HowItWorksPage from '../pages/Static/HowItWorksPage';
import AboutPage from '../pages/Static/AboutPage';
import ContactPage from '../pages/Static/ContactPage';
import HelpFaqPage from '../pages/Static/HelpFaqPage';
import TermsPage from '../pages/Static/TermsPage';
import PrivacyPage from '../pages/Static/PrivacyPage';
import NotFoundPage from '../pages/Static/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main Application Shell */}
      <Route element={<MainLayout />}>
        {/* Public / General Routes (Accessible with or without token) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/professionals/:id" element={<ProfessionalProfilePage />} />
        <Route path="/support" element={<SupportPage />} />

        {/* Operator Support Console (Includes built-in API Login Gate + Operator Desk) */}
        <Route path="/operator" element={<OperatorDashboardPage />} />

        {/* Software Admin & Full Website CRM Dashboard (Mahan Owji) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Strictly Provider-Only Routes (Adding/Editing Ads ONLY for Providers) */}
        <Route
          path="/create-ad"
          element={
            <ProtectedRoute requireRole="professional">
              <CreateAdPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-ad/:id"
          element={
            <ProtectedRoute requireRole="professional">
              <CreateAdPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated User & Provider Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Public Static & Legal Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpFaqPage />} />
        <Route path="/faq" element={<HelpFaqPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Convenience Redirects */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/register" element={<Navigate to="/auth/signup" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Authentication Split-Screen Shell */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="register" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="verify-success" element={<VerifySuccessPage />} />
        <Route path="error" element={<AuthErrorPage />} />
      </Route>
    </Routes>
  );
}
