"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registration failed.");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Server se connection nahi ho saka.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - register form */}
      <div className="flex flex-col justify-center px-8 sm:px-20 py-12 relative">
        <div className="w-full max-w-100 mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-2">
          Manage employees easily<br />starting from now!
        </h1>
        <p className="text-sm text-gray-500 mb-8">Get started for free today!</p>

        <form className="w-full" onSubmit={handleRegister} noValidate>
          {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Input your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full px-4 py-2.5 border border-emerald-400 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1.5">
              Work Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="example@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Input your password account"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
              >
                👁
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or register with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>G</span> Google
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              <span></span> Apple
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1DA97A] font-medium">
              Login Here
            </Link>
          </p>
        </form>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-between px-8 sm:px-20 text-xs text-gray-400">
          <span>© 2025 HRDashboard. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="#">Terms & Conditions</Link>
            <Link href="#">Privacy Policy</Link>
          </span>
        </div>
      </div>

      {/* Right side - green dashboard preview panel (image) */}
      <div className="hidden lg:block relative">
        <Image
          src="/images/register-banner.jpg"
          alt="HR Dashboard preview"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}