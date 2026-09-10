import { PageHeader } from "./PageHeader";
import { EmptyState } from "./EmptyState";

export function ModulePage({ title, description }: { title: string; description: string }) {
  return <><PageHeader title={title} description={description} /><EmptyState message={`${title} records will appear here.`} /></>;
}
