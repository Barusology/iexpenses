import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, Loader2, ArrowRight } from "lucide-react";
import { AmbientStage, MaskLine, EASE_CINEMATIC } from "@/components/motion";

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
      toast.error(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grain-overlay relative flex items-center justify-center p-4 bg-surface-0 text-ink-1">
      <AmbientStage intensity={1.15} />

      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.85, ease: EASE_CINEMATIC, delay: 0.1 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-hairline glass p-8 lg:p-10 shadow-key"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl grid place-items-center shadow-lift"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            <Wallet className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-tight">iEXPENSES</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-3">/ Create account</div>
          </div>
        </div>

        <h2 className="font-display text-3xl font-bold tracking-tight">
          <MaskLine delay={0.2}>Start your ledger</MaskLine>
        </h2>
        <p className="text-sm text-ink-2 mt-1 mb-6">Free forever. No cards, no gimmicks.</p>

        <Button
          type="button"
          onClick={googleLogin}
          data-testid="signup-google-btn"
          className="w-full h-11 rounded-full font-semibold mb-6 border border-hairline"
          style={{ background: "var(--ink-1)", color: "var(--surface-0)" }}
        >
          Continue with Google
        </Button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-hairline" />
          <div className="text-[10px] uppercase tracking-widest text-ink-3 font-mono-tab">or email</div>
          <div className="h-px flex-1 bg-hairline" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest text-ink-3">Full name</Label>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              data-testid="signup-name-input"
              className="mt-1.5 bg-transparent border-hairline-strong h-11 text-ink-1 placeholder:text-ink-3"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-ink-3">Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              data-testid="signup-email-input"
              className="mt-1.5 bg-transparent border-hairline-strong h-11 text-ink-1 placeholder:text-ink-3"
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-ink-3">Password</Label>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              data-testid="signup-password-input"
              className="mt-1.5 bg-transparent border-hairline-strong h-11 text-ink-1 placeholder:text-ink-3"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            data-testid="signup-submit-btn"
            className="w-full h-11 rounded-full font-semibold border-0"
            style={{ background: "var(--brand)", color: "var(--brand-fg)" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <ArrowRight className="w-4 h-4 mr-1" />}
            Create account
          </Button>
        </form>

        <p className="mt-6 text-sm text-ink-2 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            data-testid="link-to-login"
            className="hover:underline font-medium"
            style={{ color: "var(--brand)" }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
