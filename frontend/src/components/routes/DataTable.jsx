// src/pages/admin/components/DataTable.jsx
import React from "react";

const DataTable = ({ data, columns, loading, onEdit, onDelete }) => {
	if (loading) {
		return <div className="text-center py-10">Đang tải dữ liệu...</div>;
	}

	if (!data || data.length === 0) {
		return <div className="text-center py-10 text-gray-500">Không có dữ liệu</div>;
	}

	return (
		<div className="overflow-x-auto bg-white rounded shadow">
			<table className="min-w-full border-collapse">
				<thead className="bg-gray-200">
					<tr>
						{columns.map((col) => (
							<th key={col.key} className="px-4 py-2 text-left border">
								{col.label}
							</th>
						))}
						<th className="px-4 py-2 text-center border">Thao tác</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item, idx) => (
						<tr key={item.id || idx} className="hover:bg-gray-50">
							{columns.map((col) => (
								<td key={col.key} className="px-4 py-2 border">
									{col.format ? col.format(item[col.key]) : item[col.key] || "--"}
								</td>
							))}
							<td className="px-4 py-2 border text-center space-x-2">
								<button
									onClick={() => onEdit(item)}
									className="text-blue-600 hover:underline mr-2"
								>
									Sửa
								</button>
								<button
									onClick={() => onDelete(item.id)}
									className="text-red-600 hover:underline"
								>
									Xóa
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DataTable;