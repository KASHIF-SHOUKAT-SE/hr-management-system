interface AccountBadgeProps {
  status: string;
}

export function AccountBadge({ status }: AccountBadgeProps) {
  const normalized = status.toLowerCase();

  if (normalized === "activated") {
    return <span className="text-sm font-medium text-gray-900">Activated</span>;
  }

  return <span className="text-sm font-medium text-gray-400">Need Invitation</span>;
}
