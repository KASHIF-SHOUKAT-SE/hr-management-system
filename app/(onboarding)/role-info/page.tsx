"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setRole } from "@/features/onboarding/onboardingSlice";
import StepProgress from "@/components/common/StepProgress";

const roles = [
  "CEO/Owner",
  "HR Manager",
  "HR Staff",
  "IT/Tech Manager",
  "IT/Tech Staff",
  "Other",
];

export default function RoleInfoPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const domain = useAppSelector((state) => state.onboarding.domain);
  const fullDomain = domain ? `${domain}.hrline.com` : "yourcompany.hrline.com";

  const [selectedRole, setSelectedRole] = useState("CEO/Owner/Founder");
  const [customRole, setCustomRole] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setRole({ role: selectedRole, customRole }));
    router.push("/use-case");
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-65px)]">
      {/* Left side - step info */}
      <div className="flex flex-col justify-center px-10 sm:px-20 py-12">
        <StepProgress current={3} />
        <p className="text-xs font-semibold text-gray-400 tracking-wide mb-4">
          STEP 3 OF 4
        </p>

        <h1 className="text-3xl font-bold text-gray-900 leading-snug mb-4">
          What is your role in your company?
        </h1>
        <p className="text-sm text-gray-500 max-w-sm mb-10">
          This data is needed so that we can easily provide solutions
          according to your company&apos;s capacity
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/workspace-setup")}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Go Back
          </button>
          <button
            type="submit"
            form="role-info-form"
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      </div>

      {/* Right side - form card */}
      <div className="flex items-center justify-center px-8 py-12 bg-gray-50">
        <form
          id="role-info-form"
          onSubmit={handleContinue}
          className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 p-8"
        >
          <p className="text-xs text-gray-400 mb-1">Your Domain Name</p>
          <p className="font-semibold text-gray-900 mb-6">{fullDomain}</p>
          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm text-gray-700 mb-3">
              Choose role
            </label>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {roles.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-sm transition ${
                    selectedRole === role
                      ? "border-emerald-400 text-gray-900"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {role}
                  <span
                    className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === role
                        ? "border-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedRole === role && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {selectedRole === "Other" && (
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Input Your Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Lead Designer"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>
            )}
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