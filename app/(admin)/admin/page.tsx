import { MessageSquare, Sparkles, TrendingUp, Users } from "lucide-react";
import { ExecutiveBreakdown } from "@/components/admin/executive-breakdown";
import { RecentActivity } from "@/components/admin/recent-activity";
import { StatsCard } from "@/components/admin/stats-card";
import { getAdminStats, getRecentActivity } from "@/lib/admin/queries";

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
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-1">
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
        />
        <StatsCard
          title="Total Conversations"
          value={stats.totalChats}
          icon={MessageSquare}
        />
        <StatsCard
          title="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          change={`${stats.messagesLast24h} in last 24h`}
          changeType="positive"
          icon={Sparkles}
        />
        <StatsCard
          title="7-Day Messages"
          value={stats.messagesLast7d.toLocaleString()}
          icon={TrendingUp}
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
