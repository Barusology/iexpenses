import React, { useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Toaster } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthCallback from "@/components/AuthCallback";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import { PageTransition } from "@/components/motion";
import {
  getAnalyticsPageLocation,
  shouldTrackAnalyticsPageView,
} from "@/lib/analyticsPrivacy";

/**
 * Sonner is frozen to dark in the original build (theme="dark" + !bg-[#0A0A0A]).
 * Bind it to ThemeContext so toasts follow the surface they're appearing over.
 */
function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      theme={theme}
      className="iexpenses-toaster"
      toastOptions={{
        classNames: {
          toast: "iexpenses-toast",
          title: "iexpenses-toast-title",
          description: "iexpenses-toast-desc",
          success: "iexpenses-toast--success",
          error: "iexpenses-toast--error",
        },
      }}
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><PageTransition><Dashboard /></PageTransition></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout><PageTransition><Transactions /></PageTransition></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout><PageTransition><Analytics /></PageTransition></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout><PageTransition><Profile /></PageTransition></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function AppRouter() {
  const location = useLocation();
  const pageLocation = getAnalyticsPageLocation(location.pathname);
  const lastPageLocation = useRef(
    getAnalyticsPageLocation(window.location.pathname),
  );
  useEffect(() => {
    if (!shouldTrackAnalyticsPageView(location)) return;
    if (pageLocation === lastPageLocation.current) return;
    lastPageLocation.current = pageLocation;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", { page_location: pageLocation });
  }, [location, pageLocation]);

  const hasCode = new URLSearchParams(location.search).has("code");
  const hasToken = location.hash && (location.hash.includes("access_token=") || location.hash.includes("id_token="));
  if (hasCode || hasToken) {
    return <AuthCallback />;
  }

  return <AppRoutes />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <ThemedToaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
