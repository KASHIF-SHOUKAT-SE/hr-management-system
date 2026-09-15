"use client";

import { useState, useMemo } from "react";
import { useGetTeamLeaveRequestsQuery, useGetTimeOffTypesQuery } from "@/features/time-off/timeOffApi";
import { TimeOffDataGrid } from "@/components/time-off/TimeOffDataGrid";

export default function EmployeeTimeOffPage() {
  const [requestType, setRequestType] = useState("All Type");
  const [requestStatus, setRequestStatus] = useState("All Status");
  const [requestPage, setRequestPage] = useState(1);
  const requestLimit = 8;

  // We are reusing the team requests query here as it conceptually fetches all requests.
  const { data: requestsData, isLoading: isLoadingRequests, isFetching: isFetchingRequests } = useGetTeamLeaveRequestsQuery({
    page: requestPage,
    limit: requestLimit,
    type: requestType,
    status: requestStatus,
  });

  const { data: typesData } = useGetTimeOffTypesQuery();

  const typeOptions = useMemo(() => {
    const base = [{ label: "All Type", value: "All Type" }];
    if (!typesData?.types) return base;
    return [...base, ...typesData.types.map((t) => ({ label: t, value: t }))];
  }, [typesData]);

  const handleTypeChange = (val: string) => {
    setRequestType(val);
    setRequestPage(1);
  };

  const handleStatusChange = (val: string) => {
    setRequestStatus(val);
    setRequestPage(1);
  };

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
      <TimeOffDataGrid
        title="Employee Requests"
        rows={requestsData?.data || []}
        isLoading={isLoadingRequests || isFetchingRequests}
        typeOptions={typeOptions}
        type={requestType}
        onTypeChange={handleTypeChange}
        status={requestStatus}
        onStatusChange={handleStatusChange}
        page={requestsData?.page || 1}
        totalPages={requestsData?.totalPages || 0}
        onPageChange={setRequestPage}
      />
    </div>
  );
}
