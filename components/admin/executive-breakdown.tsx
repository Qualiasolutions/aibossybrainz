"use client";

import { Sparkles, Crown, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExecutiveBreakdownProps {
	breakdown: { executive: string; count: number }[];
	topExecutive: string | null;
}

const executiveConfig: Record<
	string,
	{ name: string; color: string; icon: typeof Sparkles }
> = {
	alexandria: {
		name: "Alexandria (CMO)",
		color: "from-rose-500 to-pink-600",
		icon: Sparkles,
	},
	kim: {
		name: "Kim (CSO)",
		color: "from-red-500 to-orange-600",
		icon: Crown,
	},
	collaborative: {
		name: "Collaborative",
		color: "from-purple-500 to-indigo-600",
		icon: Users,
	},
};

export function ExecutiveBreakdown({
	breakdown,
	topExecutive,
}: ExecutiveBreakdownProps) {
	const total = breakdown.reduce((sum, b) => sum + b.count, 0);

	return (
		<div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
			<div className="border-b border-zinc-800 px-6 py-4">
				<h2 className="text-lg font-semibold text-white">
					Executive Usage
				</h2>
				<p className="text-sm text-zinc-500">
					Most popular:{" "}
					<span className="text-rose-400">
						{executiveConfig[topExecutive || ""]?.name || "None"}
					</span>
				</p>
			</div>
			<div className="p-6 space-y-4">
				{breakdown.length === 0 ? (
					<div className="text-center text-zinc-500">No usage data yet</div>
				) : (
					breakdown.map((item) => {
						const config = executiveConfig[item.executive] || {
							name: item.executive,
							color: "from-zinc-500 to-zinc-600",
							icon: Sparkles,
						};
						const percentage = total > 0 ? (item.count / total) * 100 : 0;
						const Icon = config.icon;

						return (
							<div key={item.executive} className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br",
												config.color,
											)}
										>
											<Icon className="h-3.5 w-3.5 text-white" />
										</div>
										<span className="text-sm font-medium text-zinc-200">
											{config.name}
										</span>
									</div>
									<span className="text-sm text-zinc-400">
										{item.count.toLocaleString()} (
										{percentage.toFixed(1)}%)
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-zinc-800">
									<div
										className={cn(
											"h-full rounded-full bg-gradient-to-r",
											config.color,
										)}
										style={{ width: `${percentage}%` }}
									/>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
