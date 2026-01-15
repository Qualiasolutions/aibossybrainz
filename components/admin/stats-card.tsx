import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
	title: string;
	value: string | number;
	change?: string;
	changeType?: "positive" | "negative" | "neutral";
	icon: LucideIcon;
	gradient?: string;
}

export function StatsCard({
	title,
	value,
	change,
	changeType = "neutral",
	icon: Icon,
	gradient = "from-zinc-800 to-zinc-900",
}: StatsCardProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br p-6",
				gradient,
			)}
		>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-medium text-zinc-400">{title}</p>
					<p className="mt-2 text-3xl font-bold text-white">{value}</p>
					{change && (
						<p
							className={cn(
								"mt-1 text-sm",
								changeType === "positive" && "text-emerald-400",
								changeType === "negative" && "text-rose-400",
								changeType === "neutral" && "text-zinc-400",
							)}
						>
							{change}
						</p>
					)}
				</div>
				<div className="rounded-lg bg-white/5 p-2">
					<Icon className="h-5 w-5 text-zinc-400" />
				</div>
			</div>
			{/* Decorative gradient */}
			<div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-rose-500/10 to-transparent blur-2xl" />
		</div>
	);
}
