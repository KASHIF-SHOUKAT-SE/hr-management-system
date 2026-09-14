import { Badge } from "./Badge";

interface StatusBadgeProps {
  status: string;
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace("-", "");
  const label = text ?? status.toUpperCase();

  // Mapping based on screenshot design:
  // ACTIVE: green text, light green bg
  // ON BOARDING: yellow text, light yellow bg
  // PROBATION: purple text, light purple bg
  // ON LEAVE: red text, light red bg
  // TERMINATED: gray text, light gray bg (not in screenshot, but logical fallback)

  switch (normalizedStatus) {
    case "active":
      return <Badge variant="success">{label}</Badge>;
    case "onboarding":
      return <Badge variant="warning">{label}</Badge>;
    case "probation":
      return (
        <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-600">
          {label}
        </span>
      );
    case "onleave":
      return <Badge variant="error">{label}</Badge>;
    default:
      return <Badge variant="default">{label}</Badge>;
  }
}
