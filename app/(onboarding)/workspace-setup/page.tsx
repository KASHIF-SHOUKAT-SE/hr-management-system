"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setIndustry } from "@/features/onboarding/onboardingSlice";
import StepProgress from "@/components/common/StepProgress";

const industries = [
  "Crypto",
  "E-Commerce",
  "Fintech",
  "Health Tech",
  "Software Outsourcing",
  "Service",
  "Product",
  "Domain base",
];

export default function WorkspaceSetupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const companyName = useAppSelector((state) => state.onboarding.companyName);
  const domain = useAppSelector((state) => state.onboarding.domain);

  const [selectedIndustry, setSelectedIndustry] = useState("Crypto");

  const fullDomain = domain ? `${domain}.hrline.com` : "yourcompany.hrline.com";

 const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIndustry(selectedIndustry));
    router.push("/role-info");
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-65px)]">
      {/* Left side - step info */}
      <div className="flex flex-col justify-center px-10 sm:px-20 py-12">
        <StepProgress current={2} />
        <p className="text-xs font-semibold text-gray-400 tracking-wide mb-4">
          STEP 2 OF 4
        </p>

        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
          We can now create a workspace for your team.
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-10">
          This data is needed so that we can easily provide solutions
          according to your company&apos;s capacity
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/company-info")}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            type="submit"
            form="workspace-setup-form"
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Right side - form card */}
      <div className="flex items-center justify-center px-8 py-12 bg-gray-50">
        <form
          id="workspace-setup-form"
          onSubmit={handleContinue}
          className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 p-8"
        >
          <label className="block text-sm text-gray-700 mb-1.5">
            Domain Name <span className="text-red-500">*</span>
          </label>
          <div className="relative mb-6">
            <input
              type="text"
              value={fullDomain}
              readOnly
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 outline-none cursor-not-allowed"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔒
            </span>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm text-gray-700 mb-3">
              What is your industry?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {industries.map((industry) => (
                <button
                  type="button"
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-sm transition ${
                    selectedIndustry === industry
                      ? "border-emerald-400 text-gray-900"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {industry}
                  <span
                    className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                      selectedIndustry === industry
                        ? "border-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedIndustry === industry && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </form>
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



