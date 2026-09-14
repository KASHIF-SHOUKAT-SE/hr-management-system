"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCreateEmployeeMutation } from "@/features/employees/employeesApi";

interface EmployeeFormProps {
	isOpen: boolean;
	onClose: () => void;
}

const initialForm = { firstName: "", lastName: "", email: "", joinDate: "" };

export function EmployeeForm({ isOpen, onClose }: EmployeeFormProps) {
	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState("");
	const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const updateField = (field: keyof typeof form, value: string) => {
		setForm((current) => ({ ...current, [field]: value }));
		setError("");
	};

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			await createEmployee(form).unwrap();
			setForm(initialForm);
			onClose();
		} catch (requestError) {
			const message = requestError as { data?: { error?: string } };
			setError(message.data?.error || "Unable to create employee.");
		}
	}

	return (
		<>
			<button
				type="button"
				aria-label="Close add employee form"
				className="fixed inset-0 z-40 cursor-default bg-slate-950/45"
				onClick={onClose}
			/>
			<aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[360px] flex-col bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
					<h2 className="text-lg font-semibold text-gray-900">Add New Profile</h2>
					<button
						type="button"
						aria-label="Close"
						onClick={onClose}
						className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
					<div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
						{error && <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
						<div>
							<label htmlFor="employee-first-name" className="mb-1.5 block text-xs font-medium text-gray-700">
								First Name <span className="text-red-500">*</span>
							</label>
							<input id="employee-first-name" required value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
						</div>
						<div>
							<label htmlFor="employee-last-name" className="mb-1.5 block text-xs font-medium text-gray-700">Last Name</label>
							<input id="employee-last-name" required value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
						</div>
						<div>
							<label htmlFor="employee-email" className="mb-1.5 block text-xs font-medium text-gray-700">Email Address</label>
							<input id="employee-email" type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
						</div>
						<div>
							<label htmlFor="employee-join-date" className="mb-1.5 block text-xs font-medium text-gray-700">Join Date</label>
							<input id="employee-join-date" type="date" required value={form.joinDate} onChange={(event) => updateField("joinDate", event.target.value)} className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
						</div>
					</div>
					<div className="grid grid-cols-2 gap-3 border-t border-gray-100 px-6 py-5">
						<Button type="button" variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
						<Button type="submit" variant="dark" className="w-full" isLoading={isLoading}>Create</Button>
					</div>
				</form>
			</aside>
		</>
	);
}
