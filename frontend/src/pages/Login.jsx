import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, Loader2, ArrowRight } from "lucide-react";
import { AmbientStage, MaskLine, Fade, Stagger, Reveal, EASE_CINEMATIC } from "@/components/motion";

import { supabase } from "@/lib/supabase";

async function googleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/dashboard",
    },
  });
  if (error) {
    toast.error(error.message);
  }
}

const PROOF = [
  { k: "Receipts", v: "AI OCR" },
  { k: "Charts", v: "Pie / Bar / Line" },
  { k: "Currency", v: "9 supported" },
];

export default function Login() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grain-overlay relative flex items-center justify-center p-4 bg-surface-0 text-ink-1">
      <AmbientStage intensity={1.15} />

      <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center w-full max-w-6xl">
        {/* Left brand pane */}
        <div className="hidden lg:block">
          <Fade>
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-11 h-11 rounded-xl grid place-items-center shadow-lift"
                style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
              >
                <Wallet className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold text-2xl tracking-tight">iEXPENSES</div>
            </div>
          </Fade>

          <h1 className="font-display text-5xl xl:text-6xl font-bold leading-[1.02]">
            <MaskLine delay={0.12}>Your money,</MaskLine>
            <MaskLine delay={0.24}>
              <span style={{ color: "var(--brand)" }}>observed.</span>
            </MaskLine>
          </h1>

          <Fade delay={0.42}>
            <p className="mt-6 text-ink-2 text-base max-w-md leading-relaxed">
              High-signal expense tracking with receipt OCR, precise analytics, and multi-currency
              support. Built for people who hate spreadsheets.
            </p>
          </Fade>

          <Stagger className="grid grid-cols-3 gap-4 max-w-md mt-10" delay={0.1}>
            {PROOF.map((s) => (
              <Reveal key={s.k}>
                <div className="rounded-xl border border-hairline p-3 bg-surface-1/40 backdrop-blur-sm theme-fade">
                  <div className="text-[10px] uppercase tracking-widest text-ink-3">{s.k}</div>
                  <div className="mt-1 font-mono-tab text-sm text-ink-1">{s.v}</div>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>

        {/* Right form pane */}
        <motion.div
          initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: EASE_CINEMATIC, delay: 0.15 }}
          className="rounded-3xl border border-hairline glass p-8 lg:p-10 shadow-key"
        >
          <div className="mb-6">
            <div className="kicker mb-2">/ Sign in</div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Access your ledger</h2>
            <p className="text-sm text-ink-2 mt-1">Continue with Google or use your email.</p>
          </div>

          <Button
            type="button"
            onClick={googleLogin}
            data-testid="login-google-btn"
            className="w-full h-11 rounded-full font-semibold border border-hairline"
            style={{ background: "var(--ink-1)", color: "var(--surface-0)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.12A6.98 6.98 0 0 1 5.46 12c0-.74.13-1.45.36-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.96l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.12 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-hairline" />
            <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">or email</div>
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-widest text-ink-3">Email</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                data-testid="login-email-input"
                className="mt-1.5 bg-transparent border-hairline-strong h-11 text-ink-1 placeholder:text-ink-3"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-ink-3">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                data-testid="login-password-input"
                className="mt-1.5 bg-transparent border-hairline-strong h-11 text-ink-1 placeholder:text-ink-3"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="w-full h-11 rounded-full font-semibold border-0"
              style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ArrowRight className="w-4 h-4 mr-1" />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-2 text-center">
            New here?{" "}
            <Link
              to="/signup"
              data-testid="link-to-signup"
              className="hover:underline font-medium"
              style={{ color: "var(--brand)" }}
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
