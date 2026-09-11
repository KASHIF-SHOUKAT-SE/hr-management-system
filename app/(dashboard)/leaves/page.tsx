"use client";

import { useState, useMemo } from "react";
import { LeaveBalanceCards } from "@/components/time-off/LeaveBalanceCards";
import { RequestTimeList } from "@/components/time-off/RequestTimeList";
import { BalanceHistory } from "@/components/time-off/BalanceHistory";
import { TimeOffDrawer } from "@/components/time-off/TimeOffDrawer";
import {
  useGetLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
  useGetBalanceHistoryQuery,
  useGetTimeOffTypesQuery,
} from "@/features/time-off/timeOffApi";

export default function MyTimeOffPage() {
  // State for Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"view" | "create" | "edit">("create");

  // State for RequestTimeList
  const [requestType, setRequestType] = useState("All Type");
  const [requestStatus, setRequestStatus] = useState("All Status");
  const [requestPage, setRequestPage] = useState(1);
  const requestLimit = 5;

  // State for BalanceHistory
  const [historyType, setHistoryType] = useState("All Type");

  // Fetch Data
  const { data: balancesData, isLoading: isLoadingBalances } = useGetLeaveBalancesQuery();
  const { data: requestsData, isLoading: isLoadingRequests, isFetching: isFetchingRequests } = useGetLeaveRequestsQuery({
    page: requestPage,
    limit: requestLimit,
    type: requestType,
    status: requestStatus,
  });
  const { data: historyData, isLoading: isLoadingHistory, isFetching: isFetchingHistory } = useGetBalanceHistoryQuery({
    type: historyType,
  });
  const { data: typesData } = useGetTimeOffTypesQuery();

  // Prepare Filter Options
  const typeOptions = useMemo(() => {
    const base = [{ label: "All Type", value: "All Type" }];
    if (!typesData?.types) return base;
    return [...base, ...typesData.types.map((t) => ({ label: t, value: t }))];
  }, [typesData]);

  // Handlers for Requests
  const handleRequestTypeChange = (val: string) => {
    setRequestType(val);
    setRequestPage(1);
  };
  const handleRequestStatusChange = (val: string) => {
    setRequestStatus(val);
    setRequestPage(1);
  };
  
  const handleAddNewRequest = () => {
    setDrawerMode("create");
    setIsDrawerOpen(true);
  };
  
  const handleViewRequest = () => {
    setDrawerMode("view");
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <LeaveBalanceCards 
          balances={balancesData?.data || []} 
          isLoading={isLoadingBalances} 
        />
        
        <RequestTimeList
          rows={requestsData?.data || []}
          isLoading={isLoadingRequests || isFetchingRequests}
          typeOptions={typeOptions}
          type={requestType}
          onTypeChange={handleRequestTypeChange}
          status={requestStatus}
          onStatusChange={handleRequestStatusChange}
          page={requestsData?.page || 1}
          totalPages={requestsData?.totalPages || 0}
          onPageChange={setRequestPage}
          onAddNewRequest={handleAddNewRequest}
          onViewRequest={handleViewRequest}
        />

        <BalanceHistory
          rows={historyData?.data || []}
          isLoading={isLoadingHistory || isFetchingHistory}
          typeOptions={typeOptions}
          type={historyType}
          onTypeChange={setHistoryType}
        />
      </div>

      <TimeOffDrawer 
        isOpen={isDrawerOpen} 
        mode={drawerMode}
        onClose={() => setIsDrawerOpen(false)} 
        onEditClick={() => setDrawerMode("edit")}
      />
    </>
  );
}
