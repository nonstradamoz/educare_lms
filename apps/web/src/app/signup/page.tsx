"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      // Cookie is automatically set
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-border-soft p-8">
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-brand-blue rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">EL</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create an Account</h1>
          <p className="text-sm text-text-secondary mt-2">Sign up to get started with Educare LMS</p>
        </div>

        {error && (
          <div className="bg-brand-red/10 text-brand-red text-sm font-bold p-3 rounded-lg mb-6 border border-brand-red/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">First Name</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 rounded-lg border border-border-soft bg-surface-2 px-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
                placeholder="John" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Last Name</label>
              <input 
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 rounded-lg border border-border-soft bg-surface-2 px-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
                placeholder="Doe" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-lg border border-border-soft bg-surface-2 px-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
              placeholder="you@example.com" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">Password</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-lg border border-border-soft bg-surface-2 px-4 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 rounded-lg bg-text-primary text-white text-sm font-bold shadow-sm hover:bg-black transition-colors disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-brand-blue hover:text-brand-blue-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
