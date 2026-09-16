"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setCompanyInfo } from "@/features/onboarding/onboardingSlice";
import StepProgress from "@/components/common/StepProgress";

const companySizes = ["1-10", "11-50", "51-100", "101-200", "201-500", "500+"];

export default function CompanyInfoPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedSize, setSelectedSize] = useState("1-10");
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setCompanyInfo({
        companyName,
        domain,
        companySize: selectedSize,
      })
    );
    router.push("/workspace-setup");
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-65px)]">
      {/* Left side - step info */}
      <div className="flex flex-col justify-center px-10 sm:px-20 py-12">
        <StepProgress current={1} />
        <p className="text-xs font-semibold text-gray-400 tracking-wide mb-4">
          STEP 1 OF 4
        </p>

        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
          We need some of your Company Information
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-10">
          This data is needed so that we can easily provide solutions
          according to your company&apos;s capacity
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="company-info-form"
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Right side - form card */}
      <div className="flex items-center justify-center px-8 py-12 bg-gray-50">
        <form
          id="company-info-form"
          onSubmit={handleContinue}
          className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 p-8"
        >
          <h2 className="font-semibold text-gray-900 mb-6">
            Type the name of your company
          </h2>

          <div className="mb-5">
            <label className="block text-sm text-gray-700 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm text-gray-700 mb-1.5">
              Company Domain name
            </label>
            <div className="flex">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="unpixel"
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              />
              <span className="px-4 py-2.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-500">
                .hrline.com
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            ⓘ We will create a unique company URL for you to log into
            HRDashboard
          </p>

          <label className="block text-sm text-gray-700 mb-3">
            What is the size of your company
          </label>
          <div className="grid grid-cols-4 gap-3">
            {companySizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition ${
                  selectedSize === size
                    ? "border-emerald-400 text-gray-900"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedSize === size
                      ? "border-emerald-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedSize === size && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </span>
                {size}
              </button>
            ))}
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


