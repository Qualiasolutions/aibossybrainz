import {
	Users,
	MessageSquare,
	TrendingUp,
	Activity,
} from "lucide-react";
import { getAdminStats, getAllUsers } from "@/lib/admin/queries";
import { StatsCard } from "@/components/admin/stats-card";
import { ExecutiveBreakdown } from "@/components/admin/executive-breakdown";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
	const [stats, users] = await Promise.all([
		getAdminStats(),
		getAllUsers(),
	]);

	// Calculate additional metrics
	const avgMessagesPerUser =
		stats.totalUsers > 0
			? Math.round(stats.totalMessages / stats.totalUsers)
			: 0;
	const avgMessagesPerChat =
		stats.totalChats > 0
			? Math.round(stats.totalMessages / stats.totalChats)
			: 0;
	const conversionRate =
		stats.totalUsers > 0
			? Math.round((stats.activeUsers / stats.totalUsers) * 100)
			: 0;

	// Calculate daily message trend (last 7 days)
	const last7dAvg = stats.messagesLast7d > 0 ? Math.round(stats.messagesLast7d / 7) : 0;

	// User engagement breakdown
	const activeUsersWithChats = users.filter((u) => u.chatCount > 0).length;
	const usersWithManyMessages = users.filter((u) => u.messageCount > 10).length;

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">Analytics</h1>
				<p className="text-zinc-400 mt-1">
					Platform usage statistics and insights.
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<StatsCard
					title="Avg Messages/User"
					value={avgMessagesPerUser}
					icon={Users}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
				<StatsCard
					title="Avg Messages/Chat"
					value={avgMessagesPerChat}
					icon={MessageSquare}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
				<StatsCard
					title="Onboarding Rate"
					value={`${conversionRate}%`}
					change={`${stats.activeUsers} of ${stats.totalUsers} users`}
					changeType="neutral"
					icon={TrendingUp}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
				<StatsCard
					title="Daily Avg (7d)"
					value={last7dAvg}
					change="messages per day"
					changeType="neutral"
					icon={Activity}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2 mb-8">
				{/* Executive Usage */}
				<ExecutiveBreakdown
					breakdown={stats.executiveBreakdown}
					topExecutive={stats.topExecutive}
				/>

				{/* User Engagement */}
				<div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
					<div className="border-b border-zinc-800 px-6 py-4">
						<h2 className="text-lg font-semibold text-white">
							User Engagement
						</h2>
					</div>
					<div className="p-6 space-y-6">
						{/* Engagement Stats */}
						<div className="grid grid-cols-2 gap-4">
							<div className="rounded-lg bg-zinc-800/50 p-4">
								<p className="text-2xl font-bold text-white">
									{activeUsersWithChats}
								</p>
								<p className="text-sm text-zinc-400">Users with chats</p>
							</div>
							<div className="rounded-lg bg-zinc-800/50 p-4">
								<p className="text-2xl font-bold text-white">
									{usersWithManyMessages}
								</p>
								<p className="text-sm text-zinc-400">Power users (10+ msgs)</p>
							</div>
						</div>

						{/* Engagement Bars */}
						<div className="space-y-4">
							<div>
								<div className="flex justify-between mb-2">
									<span className="text-sm text-zinc-400">
										Users with conversations
									</span>
									<span className="text-sm text-zinc-300">
										{stats.totalUsers > 0
											? Math.round(
													(activeUsersWithChats / stats.totalUsers) * 100,
												)
											: 0}
										%
									</span>
								</div>
								<div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
										style={{
											width: `${stats.totalUsers > 0 ? (activeUsersWithChats / stats.totalUsers) * 100 : 0}%`,
										}}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between mb-2">
									<span className="text-sm text-zinc-400">
										Power users (10+ messages)
									</span>
									<span className="text-sm text-zinc-300">
										{stats.totalUsers > 0
											? Math.round(
													(usersWithManyMessages / stats.totalUsers) * 100,
												)
											: 0}
										%
									</span>
								</div>
								<div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full"
										style={{
											width: `${stats.totalUsers > 0 ? (usersWithManyMessages / stats.totalUsers) * 100 : 0}%`,
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Top Users */}
			<div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
				<div className="border-b border-zinc-800 px-6 py-4">
					<h2 className="text-lg font-semibold text-white">Top Users by Activity</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-zinc-800 bg-zinc-800/30">
								<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
									User
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
									Company
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
									Chats
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
									Messages
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800">
							{users
								.sort((a, b) => b.messageCount - a.messageCount)
								.slice(0, 10)
								.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-zinc-800/30 transition-colors"
									>
										<td className="px-6 py-4">
											<div>
												<p className="text-sm font-medium text-white">
													{user.displayName || "No name"}
												</p>
												<p className="text-xs text-zinc-500">{user.email}</p>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-zinc-300">
											{user.companyName || "-"}
										</td>
										<td className="px-6 py-4 text-sm text-zinc-300">
											{user.chatCount}
										</td>
										<td className="px-6 py-4 text-sm text-zinc-300">
											{user.messageCount}
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
