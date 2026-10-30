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
import Home from "@/pages/Home";
import ExpenseTrackingGuide from "@/pages/ExpenseTrackingGuide";
import Privacy from "@/pages/Privacy";
import { PageTransition } from "@/components/motion";
import {
  getAnalyticsPageLocation,
  shouldTrackAnalyticsPageView,
} from "@/lib/analyticsPrivacy";
import {
  getPageMetadata,
  shouldLoadAdsense,
} from "@/lib/sitePolicy";

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
  const metadata = getPageMetadata(location.pathname);
  const lastPageLocation = useRef(
    getAnalyticsPageLocation(window.location.pathname),
  );
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

    const adsenseScript = document.getElementById("google-adsense-script");
    if (shouldLoadAdsense(location.pathname)) {
      if (!adsenseScript) {
        const script = document.createElement("script");
        script.id = "google-adsense-script";
        script.async = true;
        script.crossOrigin = "anonymous";
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5817549134036094";
        script.addEventListener("error", () => {
          console.error("Failed to load the Google AdSense script.");
        }, { once: true });
        document.head.appendChild(script);
      }
    } else {
      adsenseScript?.remove();
    }
  }, [
    location.pathname,
    metadata.title,
    metadata.description,
    metadata.index,
    metadata.path,
  ]);

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
