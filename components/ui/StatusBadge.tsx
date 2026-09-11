import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace("-", "");

  // Mapping based on screenshot design:
  // ACTIVE: green text, light green bg
  // ON BOARDING: yellow text, light yellow bg
  // PROBATION: purple text, light purple bg
  // ON LEAVE: red text, light red bg
  // TERMINATED: gray text, light gray bg (not in screenshot, but logical fallback)

  switch (normalizedStatus) {
    case "active":
      return <Badge variant="success">ACTIVE</Badge>;
    case "onboarding":
      return <Badge variant="warning">ON BOARDING</Badge>;
    case "probation":
      return (
        <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-600">
          PROBATION
        </span>
      );
    case "onleave":
      return <Badge variant="error">ON LEAVE</Badge>;
    default:
      return <Badge variant="default">{status.toUpperCase()}</Badge>;
  }
}
