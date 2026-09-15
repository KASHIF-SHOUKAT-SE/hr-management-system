'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      window.alert('Please enter your email and password.');
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
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Team collaborating"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        
        {/* Green Separator Line */}
        <div className="h-1.5 w-full bg-[#219653]"></div>

        {/* Dark Branding Box (35%) */}
        <div className="flex-1 bg-[#111827] text-white px-12 xl:px-20 py-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-[#219653]">
              <span className="text-2xl font-bold">H</span>
              <div className="ml-1.5 h-5 w-[2px] bg-gray-600"></div>
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

        <div className="w-full max-w-[400px]">
          <h1 className="text-[1.75rem] font-bold text-center text-gray-900 mb-8 pt-6">
            Login first to your account
          </h1>

          <form className="space-y-5" onSubmit={handleLogin} noValidate>
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
                <input type="checkbox" className="rounded border-gray-300 w-[14px] h-[14px] text-emerald-500 focus:ring-0" />
                <span className="text-[13px]">Remember Me</span>
              </label>
            </div>

            {/* Login Button */}
            <div className="pt-4">
               <button
                type="submit"
                className="w-full py-3.5 rounded-lg text-[15px] font-semibold bg-black text-white transition hover:bg-gray-800"
              >
                Login
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
        <div className="absolute bottom-6 w-full px-8 sm:px-20 lg:px-12 xl:px-20 flex justify-between text-[11px] text-gray-400 max-w-[800px] mx-auto">
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


// import Link from 'next/link';
// import Input from '@/components/ui/Input';
// import Button from '@/components/ui/Button';

// export default function LoginPage() {
//   return (
//     // GRID LAYOUT: Screen ko strictly 2 hisson mein divide karega (Left aur Right)
//     <div className="grid min-h-screen w-full lg:grid-cols-2 font-sans bg-white">
      
//       {/* =========================================================
//           LEFT COLUMN: Image (Top) & Dark Box (Bottom)
//           ========================================================= */}
//       <div className="hidden lg:flex w-full flex-col h-screen relative">
        
//         {/* Top 65% - Image Area */}
//         <div className="relative h-[65%] w-full bg-gray-200">
//           {/* Exact image placeholder to match the vibe */}
//           <img 
//             src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
//             alt="Team Working" 
//             className="absolute inset-0 h-full w-full object-cover"
//           />
//         </div>

//         {/* Thin Green Separator Line */}
//         <div className="h-1.5 w-full bg-[#219653]"></div>

//         {/* Bottom 35% - Dark Navy Branding Area */}
//         <div className="flex h-[35%] flex-col justify-center bg-[#161a23] px-12 xl:px-20 text-white">
//           {/* Logo Section */}
//           <div className="mb-6 flex items-center gap-2">
//             <div className="flex items-center text-[#219653]">
//               <span className="text-2xl font-bold">H</span>
//               <div className="ml-1.5 h-5 w-[2px] bg-gray-600"></div>
//             </div>
//             <span className="text-lg font-semibold tracking-wide">HRDashboard</span>
//           </div>

//           {/* Heading */}
//           <h1 className="mb-4 text-4xl xl:text-[2.75rem] font-bold leading-tight">
//             Let's empower your<br />employees today.
//           </h1>
          
//           {/* Subheading */}
//           <p className="text-[15px] text-gray-400">
//             We help to complete all your conveyancing needs easily
//           </p>
//         </div>
//       </div>


//       {/* =========================================================
//           RIGHT COLUMN: Login Form Area
//           ========================================================= */}
//       <div className="relative flex w-full flex-col items-center justify-center px-8 lg:px-16 overflow-y-auto">
        
//         {/* Hand-drawn Arrow (Exactly where it is in the image) */}
//         <div className="absolute left-16 top-32 hidden xl:block opacity-30">
//           <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M5 9S9.5 15.5 16 16" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
//             <path d="M16 16L12 12" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
//             <path d="M16 16L14 20" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round"/>
//           </svg>
//         </div>

//         {/* Form Wrapper */}
//         <div className="w-full max-w-[420px]">
//           <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
//             Login first to your account
//           </h2>

//           <form className="space-y-6">
//             {/* Email Input - Border is Green/Teal as per image */}
//             <Input 
//               label="Email Address" 
//               type="email" 
//               placeholder="Input your registered email" 
//               required
//               className="border-[#5db3a1] focus:border-[#219653] focus:ring-[#219653]" 
//             />

//             {/* Password Input - Normal Border */}
//             <Input 
//               label="Password" 
//               type="password" 
//               placeholder="Input your password account" 
//               required
//               className="border-gray-200 focus:border-gray-400"
//               icon={
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
//                   <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
//                   <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
//                   <line x1="2" y1="2" x2="22" y2="22"></line>
//                 </svg>
//               }
//             />

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between !mt-3">
//               <label className="flex cursor-pointer items-center gap-2">
//                 <input type="checkbox" className="h-[14px] w-[14px] rounded border-gray-300 text-emerald-500 focus:ring-0" />
//                 <span className="text-[13px] text-gray-500">Remember Me</span>
//               </label>
//               <Link href="#" className="text-[13px] text-gray-400 hover:text-gray-600">
//                 Forgot Password
//               </Link>
//             </div>

//             {/* Login Button */}
//             <div className="!mt-8">
//               <Button variant="primary" type="button">
//                 Login
//               </Button>
//             </div>
//           </form>

//           {/* Divider */}
//           <div className="my-8 flex items-center gap-4">
//             <div className="h-px flex-1 bg-gray-100"></div>
//             <span className="text-[13px] text-gray-400">Or login with</span>
//             <div className="h-px flex-1 bg-gray-100"></div>
//           </div>

//           {/* Social Buttons */}
//           <div className="grid grid-cols-2 gap-4">
//             <Button variant="social" icon={<span className="font-bold text-red-500 text-lg">G</span>}>
//               Google
//             </Button>
//             <Button variant="social" icon={<span className="font-bold text-lg"></span>}>
//               Apple
//             </Button>
//           </div>

//           {/* Register Link */}
//           <p className="mt-10 text-center text-[13px] text-gray-400">
//             You're new in here?{' '}
//             <Link href="/register" className="font-semibold text-[#5db3a1] hover:underline">
//               Create Account
//             </Link>
//           </p>
//         </div>

//         {/* Footer (Terms & Privacy) */}
//         <div className="absolute bottom-6 flex w-full flex-wrap justify-between px-10 text-[11px] text-gray-400 lg:px-12 xl:px-20">
//           <span>© 2026 HRDashboard. All rights reserved.</span>
//           <div className="space-x-4 font-medium text-gray-500">
//             <Link href="#" className="hover:text-gray-800">Terms & Conditions</Link>
//             <Link href="#" className="hover:text-gray-800">Privacy Policy</Link>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// import Link from "next/link";
// import Input from "@/components/ui/Input";
// import Button from "@/components/ui/Button";

// export default function LoginPage() {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left side - image panel */}
//       <div className="relative hidden lg:block bg-gray-300">
//         {/* TODO: yahan real image add karni hai (public/images/auth-banner.jpg) */}
//         <div className="absolute bottom-0 left-0 right-0 bg-[#0F3D2E]/95 text-white p-10">
//           <p className="text-sm font-semibold mb-2 flex items-center gap-2">
//             <span className="w-2 h-2 bg-emerald-400 rounded-full" /> HRDashboard
//           </p>
//           <h2 className="text-2xl font-semibold mb-2">
//             Let&apos;s empower your employees today.
//           </h2>
//           <p className="text-sm text-gray-300">
//             We help to complete all your conveyancing needs easily
//           </p>
//         </div>
//       </div>

//       {/* Right side - form */}
//       <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
//         <h1 className="text-2xl font-semibold mb-8">
//           Login first to your account
//         </h1>

//         <form className="max-w-sm w-full">
//           <Input label="Email Address *" type="email" placeholder="Enter your email address" />
//           <Input label="Password *" type="password" placeholder="Enter your password" />

//           <div className="flex items-center justify-between text-sm mb-6">
//             <label className="flex items-center gap-2 text-gray-600">
//               <input type="checkbox" className="rounded border-gray-300" />
//               Remember Me
//             </label>
//             <Link href="#" className="text-[#0F3D2E] font-medium">
//               Forgot Password
//             </Link>
//           </div>

//           <Button type="submit">Login</Button>

//           <div className="flex items-center gap-3 my-6">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400">Or login with</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           <div className="flex gap-3">
//             <Button type="button" variant="outline">Google</Button>
//             <Button type="button" variant="outline">Apple</Button>
//           </div>

//           <p className="text-center text-sm text-gray-500 mt-8">
//             You have not registered yet?{" "}
//             <Link href="/register" className="text-[#0F3D2E] font-medium">
//               Create Account
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

















