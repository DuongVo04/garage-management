// src/pages/admin/components/StatsCards.jsx
import React from "react";

const StatsCards = ({ stats }) => {
	const cards = [
		{ label: "Tổng xe", value: stats.totalVehicles || 0, icon: "🚗", color: "bg-blue-500" },
		{ label: "Dịch vụ", value: stats.totalServices || 0, icon: "🔧", color: "bg-green-500" },
		{ label: "Voucher", value: stats.totalVouchers || 0, icon: "🎫", color: "bg-yellow-500" },
		{ label: "Nhân viên", value: stats.totalEmployees || 0, icon: "👥", color: "bg-purple-500" },
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
			{cards.map((card, idx) => (
				<div key={idx} className={`${card.color} text-white rounded-lg shadow p-4`}>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm opacity-80">{card.label}</p>
							<p className="text-2xl font-bold">{card.value}</p>
						</div>
						<span className="text-3xl">{card.icon}</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default StatsCards;