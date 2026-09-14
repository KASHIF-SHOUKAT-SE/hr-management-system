import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardUIState {
  chartRange: string;
  employeeChartRange: string;
  tableSearch: string;
  filterOffice: string;
  filterJobTitle: string;
  filterStatus: string;
}

const initialState: DashboardUIState = {
  chartRange: "Last 7 month",
  employeeChartRange: "All Time",
  tableSearch: "",
  filterOffice: "All Offices",
  filterJobTitle: "All Job Titles",
  filterStatus: "All Status",
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setChartRange(state, action: PayloadAction<string>) {
      state.chartRange = action.payload;
    },
    setEmployeeChartRange(state, action: PayloadAction<string>) {
      state.employeeChartRange = action.payload;
    },
    setTableSearch(state, action: PayloadAction<string>) {
      state.tableSearch = action.payload;
    },
    setFilterOffice(state, action: PayloadAction<string>) {
      state.filterOffice = action.payload;
    },
    setFilterJobTitle(state, action: PayloadAction<string>) {
      state.filterJobTitle = action.payload;
    },
    setFilterStatus(state, action: PayloadAction<string>) {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  setChartRange,
  setEmployeeChartRange,
  setTableSearch,
  setFilterOffice,
  setFilterJobTitle,
  setFilterStatus,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
