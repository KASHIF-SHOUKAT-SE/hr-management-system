"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUseCase } from "@/features/onboarding/onboardingSlice";
import StepProgress from "@/components/common/StepProgress";

const useCases = [
  {
    title: "Onboarding new employees",
    desc: "I want to onboard a lot of new employees in a consistent and systematic way.",
  },
  {
    title: "Online time tracking",
    desc: "I want to track and approve time attendance and time off online, from anywhere.",
  },
  {
    title: "Performance management",
    desc: "I want to manage and maintain employee performance in a continuous and objective way.",
  },
  {
    title: "Employee engagement",
    desc: "I want to keep my employees happy, engaged, active, and motivated.",
  },
  {
    title: "Recruitment",
    desc: "I want to hire the best talents to improve business performance and employer branding.",
  },
];

export default function UseCasePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const state = useAppSelector((state) => state.onboarding);
  const domain = state.domain;
  const fullDomain = domain ? `${domain}.hrline.com` : "yourcompany.hrline.com";

  const [selected, setSelected] = useState("Onboarding new employees");
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUseCase(selected));
    setLoading(true);

    try {
      // POST all onboarding data to our API
      const response = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: state.companyName,
          domain: state.domain,
          companySize: state.companySize,
          industry: state.industry,
          role: state.role,
          customRole: state.customRole,
          useCase: selected, // using the local state since dispatch might be async
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        window.alert(data.error || "Failed to create company");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create company:", error);
      window.alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grid lg:grid-cols-2 flex-1">
        {/* Left side - step info */}
        <div className="flex flex-col justify-center px-10 sm:px-20 py-12">
          <StepProgress current={4} />
          <p className="text-xs font-semibold text-gray-400 tracking-wide mb-4">
            STEP 4 OF 4
          </p>

          <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
            What will you mainly use Grove HR for?
          </h1>
          <p className="text-sm text-gray-500 max-w-sm mb-10">
            This data is needed so that we can easily provide solutions
            according to your company&apos;s capacity
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/role-info")}
              className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              type="submit"
              form="use-case-form"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Continue"}
            </button>
          </div>
        </div>

        {/* Right side - form card */}
        <div className="flex items-center justify-center px-8 py-12 bg-gray-50">
          <form
            id="use-case-form"
            onSubmit={handleContinue}
            className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 p-8"
          >
            <p className="text-xs text-gray-400 mb-1">Your Domain Name</p>
            <p className="font-semibold text-gray-900 mb-6">{fullDomain}</p>
            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm text-gray-700 mb-3">
                Choose according to your needs
              </label>
              <div className="flex flex-col gap-3">
                {useCases.map((item) => (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setSelected(item.title)}
                    className={`text-left flex items-start justify-between gap-3 px-4 py-3 rounded-lg border transition ${
                      selected === item.title
                        ? "border-emerald-400"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <span
                      className={`w-4 h-4 shrink-0 mt-1 rounded-full border-2 flex items-center justify-center ${
                        selected === item.title
                          ? "border-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selected === item.title && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-between px-8 sm:px-20 py-6 text-xs text-gray-400">
        <span>© 2025 HRDashboard. All rights reserved.</span>
        <span className="flex gap-4">
          <Link href="#">Terms & Conditions</Link>
          <Link href="#">Privacy Policy</Link>
        </span>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#1DA97A] text-white flex items-center justify-center shadow-lg hover:bg-[#178c65]"
      >
        💬
      </button>
    </div>
  );
}