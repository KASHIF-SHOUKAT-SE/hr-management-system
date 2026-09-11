import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  companyName: string;
  domain: string;
  companySize: string;
  industry: string;
  role: string;
  customRole: string;
  useCase: string;
}

const initialState: OnboardingState = {
  companyName: "",
  domain: "",
  companySize: "1-10",
  industry: "",
  role: "",
  customRole: "",
  useCase: "",
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setCompanyInfo: (
      state,
      action: PayloadAction<{
        companyName: string;
        domain: string;
        companySize: string;
      }>
    ) => {
      state.companyName = action.payload.companyName;
      state.domain = action.payload.domain;
      state.companySize = action.payload.companySize;
    },
    setIndustry: (state, action: PayloadAction<string>) => {
      state.industry = action.payload;
    },
    setRole: (
      state,
      action: PayloadAction<{ role: string; customRole?: string }>
    ) => {
      state.role = action.payload.role;
      state.customRole = action.payload.customRole ?? "";
    },
    setUseCase: (state, action: PayloadAction<string>) => {
      state.useCase = action.payload;
    },
  },
});

export const { setCompanyInfo, setIndustry, setRole, setUseCase } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;