import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
      toast.success(`Welcome, ${user.name || user.email}`);
    }
  }, [user, navigate]);

  useEffect(() => {
    // Timeout fallback after 10s of spinner
    const t = setTimeout(() => {
      if (!user) {
        toast.error("Authentication timed out.");
        navigate("/login", { replace: true });
      }
    }, 10000);
    return () => clearTimeout(t);
  }, [user, navigate]);

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
