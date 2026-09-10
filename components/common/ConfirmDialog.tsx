export function ConfirmDialog({ message }: { message: string }) {
  return <div role="alertdialog" aria-label="Confirmation"><p>{message}</p></div>;
}
