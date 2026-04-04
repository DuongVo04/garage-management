// src/pages/admin/components/ModalForm.jsx
import React, { useState, useEffect } from "react";

const ModalForm = ({ isOpen, onClose, onSubmit, fields, initialData, mode, title }) => {
	const [formData, setFormData] = useState({});

	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		} else {
			const defaultData = {};
			fields.forEach((field) => {
				if (field.type === "checkbox") defaultData[field.name] = false;
				else defaultData[field.name] = "";
			});
			setFormData(defaultData);
		}
	}, [initialData, fields]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(formData);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center border-b p-4">
					<h2 className="text-xl font-bold">{title}</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{fields.map((field) => (
							<div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
								<label className="block text-sm font-medium mb-1">
									{field.label} {field.required && <span className="text-red-500">*</span>}
								</label>

								{field.type === "textarea" ? (
									<textarea
										name={field.name}
										value={formData[field.name] || ""}
										onChange={handleChange}
										className="w-full border rounded px-3 py-2"
										rows={3}
									/>
								) : field.type === "select" ? (
									<select
										name={field.name}
										value={formData[field.name] || ""}
										onChange={handleChange}
										className="w-full border rounded px-3 py-2"
									>
										<option value="">-- Chọn --</option>
										{field.options?.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								) : field.type === "checkbox" ? (
									<input
										type="checkbox"
										name={field.name}
										checked={formData[field.name] || false}
										onChange={handleChange}
										className="w-5 h-5"
									/>
								) : (
									<input
										type={field.type || "text"}
										name={field.name}
										value={formData[field.name] || ""}
										onChange={handleChange}
										className="w-full border rounded px-3 py-2"
										required={field.required}
									/>
								)}
							</div>
						))}
					</div>

					<div className="flex justify-end gap-3 mt-6 border-t pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border rounded hover:bg-gray-100"
						>
							Hủy
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							{mode === "create" ? "Thêm mới" : "Cập nhật"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ModalForm;