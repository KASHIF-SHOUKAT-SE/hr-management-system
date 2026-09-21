'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.error || "Failed to login");
        return;
      }

      setEmail('');
      setPassword('');
      setShowPassword(false);
      
      if (data.hasCompany) {
        router.push('/dashboard');
      } else {
        router.push('/company-info');
      }
    } catch (error) {
      console.error("Login error:", error);
      window.alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-white font-sans text-gray-900">
      
      {/* =======================================
          LEFT SIDE: IMAGE & DARK BOX
          ======================================= */}
      <div className="hidden lg:flex flex-col h-screen">
        
        {/* Working External Image Area (65%) */}
        <div className="relative h-[65%] w-full bg-gray-100">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Team collaborating"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            loading="eager"
            unoptimized
            className="object-cover"
          />
        </div>
        
        {/* Green Separator Line */}
        <div className="h-1.5 w-full bg-[#219653]"></div>

        {/* Dark Branding Box (35%) */}
        <div className="flex-1 bg-[#111827] text-white px-12 xl:px-20 py-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-[#219653]">
              <span className="text-2xl font-bold">H</span>
              <div className="ml-1.5 h-5 w-0.5 bg-gray-600"></div>
            </div>
            <span className="font-semibold text-[15px] tracking-wide">HRDashboard</span>
          </div>
          <h2 className="text-[2.5rem] font-bold leading-tight mb-3">
            Let&apos;s empower your<br />employees today.
          </h2>
          <p className="text-[14px] text-gray-400">
            We help to complete all your conveyancing needs easily
          </p>
        </div>
      </div>

      {/* =======================================
          RIGHT SIDE: LOGIN FORM
          ======================================= */}
      <div className="flex flex-col items-center justify-center px-8 sm:px-20 py-12 relative h-screen overflow-y-auto">
        
        {/* Decorator Arrow */}
        <svg
          className="absolute top-16 left-12 sm:left-24 lg:left-16 xl:left-32 w-8 h-8 text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M4 4c0 8 4 12 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M13 15l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="w-full max-w-100">
          <h1 className="text-[1.75rem] font-bold text-center text-gray-900 mb-8 pt-6">
            Login first to your account
          </h1>

          <form className="space-y-5" onSubmit={handleLogin} noValidate>
            {searchParams.get('registered') && (
              <p className="text-sm text-emerald-600" role="status">Account created successfully. Please login with your credentials.</p>
            )}
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Input your registered email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 border border-[#5db3a1] rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#219653] focus:border-[#219653]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Input your password account"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 w-3.5 h-3.5 text-emerald-500 focus:ring-0" />
                <span className="text-[13px]">Remember Me</span>
              </label>
            </div>

            {/* Login Button */}
            <div className="pt-4">
               <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg text-[15px] font-semibold bg-black text-white transition hover:bg-gray-800"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[13px] text-gray-400">Or login with</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              {/* === GOOGLE BUTTON MODIFIED HERE === */}
             <button 
                type="button" 
                // Jab hum NextAuth setup karenge, toh yahan signIn('google') aayega
                onClick={() => alert("Google Authentication NextAuth ke zariye yahan connect hogi")}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Google
              </button>
              
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                <span className="font-bold text-base"></span> Apple
              </button>
            </div>

            <p className="text-center text-[13px] text-gray-400 mt-8">
              You&apos;re new in here?{" "}
              <Link href="/register" className="text-[#219653] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>

        {/* Footer - Right Side */}
        <div className="absolute bottom-6 w-full px-8 sm:px-20 lg:px-12 xl:px-20 flex justify-between text-[11px] text-gray-400 max-w-200 mx-auto">
          <span>© 2026 HRDashboard. All rights reserved.</span>
          <span className="flex gap-4 font-medium text-gray-500">
            <Link href="#" className="hover:text-gray-800">Terms & Conditions</Link>
            <Link href="#" className="hover:text-gray-800">Privacy Policy</Link>
          </span>
        </div>
      </div>

    </div>
  );
}