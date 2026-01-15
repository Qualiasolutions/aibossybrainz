import { Users, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { getAdminStats, getRecentActivity } from "@/lib/admin/queries";
import { StatsCard } from "@/components/admin/stats-card";
import { RecentActivity } from "@/components/admin/recent-activity";
import { ExecutiveBreakdown } from "@/components/admin/executive-breakdown";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
	const [stats, activity] = await Promise.all([
		getAdminStats(),
		getRecentActivity(15),
	]);

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">Dashboard</h1>
				<p className="text-zinc-400 mt-1">
					Welcome back, here's what's happening with your AI consultants.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<StatsCard
					title="Total Users"
					value={stats.totalUsers}
					change={`${stats.activeUsers} onboarded`}
					changeType="neutral"
					icon={Users}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
				<StatsCard
					title="Total Conversations"
					value={stats.totalChats}
					icon={MessageSquare}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
				<StatsCard
					title="Total Messages"
					value={stats.totalMessages.toLocaleString()}
					change={`${stats.messagesLast24h} in last 24h`}
					changeType="positive"
					icon={Sparkles}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
				<StatsCard
					title="7-Day Messages"
					value={stats.messagesLast7d.toLocaleString()}
					icon={TrendingUp}
					gradient="from-zinc-800/80 to-zinc-900"
				/>
			</div>

			{/* Two columns */}
			<div className="grid gap-6 lg:grid-cols-2">
				<RecentActivity activity={activity} />
				<ExecutiveBreakdown
					breakdown={stats.executiveBreakdown}
					topExecutive={stats.topExecutive}
				/>
			</div>
		</div>
	);
}
