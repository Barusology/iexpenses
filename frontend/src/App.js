import React, { useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CookieConsentProvider, useCookieConsent } from "@/context/CookieConsentContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Toaster } from "sonner";
import CookieConsent from "@/components/CookieConsent";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthCallback from "@/components/AuthCallback";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Home from "@/pages/Home";
import ExpenseTrackingGuide from "@/pages/ExpenseTrackingGuide";
import Privacy from "@/pages/Privacy";
import CookiePolicy from "@/pages/CookiePolicy";
import { PageTransition } from "@/components/motion";
import {
  getAnalyticsPageLocation,
  shouldTrackAnalyticsPageView,
} from "@/lib/analyticsPrivacy";
import {
  getPageMetadata,
  shouldLoadAdsense,
  shouldLoadPostHog,
} from "@/lib/sitePolicy";
import {
  initializeAdsense,
  initializeGoogleAnalytics,
  initializePostHog,
} from "@/lib/optionalScripts";

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
      <Route path="/" element={<Home />} />
      <Route path="/expense-tracking-guide" element={<ExpenseTrackingGuide />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<CookiePolicy />} />
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
  const { consent } = useCookieConsent();
  const pageLocation = getAnalyticsPageLocation(location.pathname);
  const metadata = getPageMetadata(location.pathname);
  const lastPageLocation = useRef(null);
  const wasAdsEligible = useRef(shouldLoadAdsense(window.location.pathname));
  useEffect(() => {
    document.title = metadata.title;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = metadata.description;

    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = metadata.index ? "index,follow" : "noindex,nofollow";

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${metadata.path}`;

    const adsEligible = shouldLoadAdsense(location.pathname);
    const leftAdsEligiblePage = wasAdsEligible.current && !adsEligible;
    wasAdsEligible.current = adsEligible;

    if (consent === "accepted") {
      if (leftAdsEligiblePage) {
        window.location.reload();
        return;
      }
      initializeGoogleAnalytics(pageLocation);
      if (shouldLoadPostHog(location.pathname)) initializePostHog();
      if (adsEligible) initializeAdsense();
    }
  }, [
    location.pathname,
    pageLocation,
    consent,
    metadata.title,
    metadata.description,
    metadata.index,
    metadata.path,
  ]);

  useEffect(() => {
    if (consent !== "accepted") return;
    if (!shouldTrackAnalyticsPageView(location)) return;
    if (pageLocation === lastPageLocation.current) return;
    lastPageLocation.current = pageLocation;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", { page_location: pageLocation });
  }, [location, pageLocation, consent]);

  const hasCode = new URLSearchParams(location.search).has("code");
  const hasToken = location.hash && (location.hash.includes("access_token=") || location.hash.includes("id_token="));
  if (hasCode || hasToken) {
    return <AuthCallback />;
  }

  return <AppRoutes />;
}

function App() {
  return (
    <CookieConsentProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
            <ThemedToaster />
            <CookieConsent />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </CookieConsentProvider>
  );
}

export default App;
