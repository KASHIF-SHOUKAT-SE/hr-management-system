export function EmptyState({ message = "No records yet." }: { message?: string }) {
  return <p className="placeholder">{message}</p>;
}
