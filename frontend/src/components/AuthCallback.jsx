import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

/**
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 * Handles the Emergent OAuth callback. Reads session_id from URL fragment,
 * exchanges via backend, then navigates to /dashboard.
 */
export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = location.hash || window.location.hash || "";
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const { data } = await api.post("/auth/session", { session_id: sessionId });
        setUser(data.user);
        // Clear the fragment
        window.history.replaceState({}, document.title, "/dashboard");
        navigate("/dashboard", { replace: true, state: { user: data.user } });
        toast.success(`Welcome, ${data.user.name || data.user.email}`);
      } catch (e) {
        toast.error("Google sign-in failed. Please try again.");
        navigate("/login", { replace: true });
      }
    })();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface-0)]">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#00FF9D] animate-spin mx-auto" />
        <p className="mt-4 text-zinc-400 font-mono-tab text-sm" data-testid="auth-callback-status">
          Securing your session…
        </p>
      </div>
    </div>
  );
}
