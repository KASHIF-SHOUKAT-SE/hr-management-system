import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "@/features/onboarding/onboardingSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import { dashboardApi } from "@/features/dashboard/dashboardApi";
import { employeesApi } from "@/features/employees/employeesApi";
import { timeOffApi } from "@/features/time-off/timeOffApi";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [timeOffApi.reducerPath]: timeOffApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      dashboardApi.middleware,
      employeesApi.middleware,
      timeOffApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// export const store = { status: "not-configured" as const };
