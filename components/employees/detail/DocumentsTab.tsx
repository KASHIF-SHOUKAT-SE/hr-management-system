import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { SectionCard } from "./DetailFields";
import type { EmployeeDocument } from "./employeeDetail.types";

type DocumentsTabProps = {
  documents: EmployeeDocument[];
  onUpload: (category: EmployeeDocument["category"], event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (documentId: string) => void;
};

function DocumentRow({ document, onRemove }: { document: EmployeeDocument; onRemove: (documentId: string) => void }) {
  return <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
    <div className="flex items-center gap-3 text-sm text-gray-700"><FileText className="h-4 w-4 text-gray-400" />{document.name}</div>
    <div className="flex items-center gap-2">
      <a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.name}`} className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"><ExternalLink className="h-3.5 w-3.5" /></a>
      <button type="button" onClick={() => onRemove(document.id)} aria-label={`Delete ${document.name}`} className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  </div>;
}

export function DocumentsTab({ documents, onUpload, onRemove }: DocumentsTabProps) {
  const personalDocuments = documents.filter((document) => document.category === "Personal Documents");
  const payslips = documents.filter((document) => document.category === "Payslips");
  return <div className="mt-5 space-y-5">
    <SectionCard title="Personal Documents" isEditing={false} onToggleEdit={() => undefined} onSave={() => undefined} onCancel={() => undefined}>
      <div className="space-y-3">
        {personalDocuments.map((document) => <DocumentRow key={document.id} document={document} onRemove={onRemove} />)}
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 text-center">
          <p className="text-sm font-medium text-gray-700">Drag &amp; Drop here to upload</p>
          <p className="mt-1 text-xs text-gray-500">Or select a file from your computer</p>
          <span className="mt-4 rounded-xl bg-[#111827] px-4 py-2 text-sm font-medium text-white">Upload File</span>
          <input type="file" className="hidden" onChange={(event) => onUpload("Personal Documents", event)} />
        </label>
      </div>
    </SectionCard>
    <SectionCard title="Payslips" isEditing={false} onToggleEdit={() => undefined} onSave={() => undefined} onCancel={() => undefined}>
      <div className="space-y-3">
        {payslips.map((document) => <DocumentRow key={document.id} document={document} onRemove={onRemove} />)}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-sm font-medium text-white hover:bg-black">
          <span>Upload Payslip</span>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(event) => onUpload("Payslips", event)} />
        </label>
      </div>
    </SectionCard>
  </div>;
}
