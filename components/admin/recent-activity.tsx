"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User, Heart, Sparkles } from "lucide-react";
import type { ActivityLogEntry } from "@/lib/admin/queries";
import { cn } from "@/lib/utils";

const typeIcons = {
	message: MessageSquare,
	chat: MessageSquare,
	user: User,
	reaction: Heart,
};

const typeColors = {
	message: "text-blue-400",
	chat: "text-purple-400",
	user: "text-emerald-400",
	reaction: "text-rose-400",
};

interface RecentActivityProps {
	activity: ActivityLogEntry[];
}

export function RecentActivity({ activity }: RecentActivityProps) {
	return (
		<div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
			<div className="border-b border-zinc-800 px-6 py-4">
				<h2 className="text-lg font-semibold text-white">Recent Activity</h2>
			</div>
			<div className="divide-y divide-zinc-800">
				{activity.length === 0 ? (
					<div className="p-6 text-center text-zinc-500">
						No recent activity
					</div>
				) : (
					activity.map((item) => {
						const Icon = typeIcons[item.type];
						const colorClass = typeColors[item.type];

						return (
							<div
								key={item.id}
								className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-zinc-800/50"
							>
								<div
									className={cn(
										"mt-0.5 rounded-lg bg-zinc-800 p-2",
										colorClass,
									)}
								>
									<Icon className="h-4 w-4" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-zinc-100">{item.description}</p>
									<div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
										<span className="truncate">{item.userEmail}</span>
										{typeof item.metadata?.botType === "string" && (
											<>
												<span className="text-zinc-700">|</span>
												<span className="flex items-center gap-1">
													<Sparkles className="h-3 w-3" />
													{item.metadata.botType as string}
												</span>
											</>
										)}
									</div>
								</div>
								<span className="text-xs text-zinc-500 whitespace-nowrap">
									{formatDistanceToNow(new Date(item.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
