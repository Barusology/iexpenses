import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, Loader2, ArrowRight } from "lucide-react";

/**
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
function googleLogin() {
  const redirectUrl = window.location.origin + "/dashboard";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default function Signup() {
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-mesh grain-overlay flex items-center justify-center p-4 relative">
      <div className="fixed inset-0 grid-backdrop pointer-events-none opacity-40" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[var(--surface-1)]/80 backdrop-blur-xl p-8 lg:p-10 fade-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00FF9D] text-black flex items-center justify-center">
            <Wallet className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg">Ledgerly</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">/ Create account</div>
          </div>
        </div>

        <h2 className="font-display text-3xl font-bold tracking-tight">Start your ledger</h2>
        <p className="text-sm text-zinc-400 mt-1 mb-6">Free forever. No cards, no gimmicks.</p>

        <Button
          type="button"
          onClick={googleLogin}
          data-testid="signup-google-btn"
          className="w-full h-11 rounded-full bg-white text-black hover:bg-zinc-200 font-semibold mb-6"
        >
          Continue with Google
        </Button>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Full name</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              data-testid="signup-name-input"
              className="mt-1.5 bg-transparent border-white/15 h-11"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              data-testid="signup-email-input"
              className="mt-1.5 bg-transparent border-white/15 h-11"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-zinc-500">Password</Label>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              data-testid="signup-password-input"
              className="mt-1.5 bg-transparent border-white/15 h-11"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            data-testid="signup-submit-btn"
            className="w-full h-11 rounded-full bg-[#00FF9D] text-black hover:bg-[#00e58c] font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ArrowRight className="w-4 h-4 mr-1" />}
            Create account
          </Button>
        </form>

        <p className="mt-6 text-sm text-zinc-400 text-center">
          Already have an account?{" "}
          <Link to="/login" data-testid="link-to-login" className="text-[#00FF9D] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
