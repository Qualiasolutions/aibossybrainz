import { MessageSquare, Sparkles, TrendingUp, Users } from "lucide-react";
import { ConversationsPreview } from "@/components/admin/conversations-preview";
import {
  DashboardGrid,
  type WidgetConfig,
} from "@/components/admin/dashboard-grid";
import { ExecutiveBreakdown } from "@/components/admin/executive-breakdown";
import { RecentActivity } from "@/components/admin/recent-activity";
import { StatsCard } from "@/components/admin/stats-card";
import { SubscriptionStats } from "@/components/admin/subscription-stats";
import { SupportPreview } from "@/components/admin/support-preview";
import { UsersPreview } from "@/components/admin/users-preview";
import {
  getAdminStats,
  getRecentActivity,
  getRecentConversations,
  getRecentSupportTickets,
  getRecentUsers,
  getSubscriptionStats,
} from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch all data in parallel for performance
  const [
    stats,
    activity,
    subscriptionStats,
    recentUsers,
    recentConversations,
    recentTickets,
  ] = await Promise.all([
    getAdminStats(),
    getRecentActivity(15),
    getSubscriptionStats(),
    getRecentUsers(5),
    getRecentConversations(5),
    getRecentSupportTickets(5),
  ]);

  // Define all dashboard widgets
  const widgets: WidgetConfig[] = [
    // Row 1: Stats cards (4 small)
    {
      id: "total-users",
      title: "Total Users",
      size: "small",
      component: (
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          change={`${stats.activeUsers} onboarded`}
          changeType="neutral"
          icon={Users}
        />
      ),
    },
    {
      id: "total-conversations",
      title: "Total Conversations",
      size: "small",
      component: (
        <StatsCard
          title="Total Conversations"
          value={stats.totalChats}
          icon={MessageSquare}
        />
      ),
    },
    {
      id: "total-messages",
      title: "Total Messages",
      size: "small",
      component: (
        <StatsCard
          title="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          change={`${stats.messagesLast24h} in last 24h`}
          changeType="positive"
          icon={Sparkles}
        />
      ),
    },
    {
      id: "weekly-messages",
      title: "7-Day Messages",
      size: "small",
      component: (
        <StatsCard
          title="7-Day Messages"
          value={stats.messagesLast7d.toLocaleString()}
          icon={TrendingUp}
        />
      ),
    },
    // Row 2: Subscriptions and Executive breakdown (2 medium)
    {
      id: "subscriptions",
      title: "Subscriptions",
      size: "medium",
      component: <SubscriptionStats stats={subscriptionStats} />,
    },
    {
      id: "executive-usage",
      title: "Executive Usage",
      size: "medium",
      component: (
        <ExecutiveBreakdown
          breakdown={stats.executiveBreakdown}
          topExecutive={stats.topExecutive}
        />
      ),
    },
    // Row 3: Recent activity and Users preview (2 medium)
    {
      id: "recent-activity",
      title: "Recent Activity",
      size: "medium",
      component: <RecentActivity activity={activity} />,
    },
    {
      id: "recent-users",
      title: "Recent Users",
      size: "medium",
      component: <UsersPreview users={recentUsers} />,
    },
    // Row 4: Conversations and Support tickets (2 medium)
    {
      id: "recent-conversations",
      title: "Recent Conversations",
      size: "medium",
      component: <ConversationsPreview conversations={recentConversations} />,
    },
    {
      id: "support-tickets",
      title: "Support Tickets",
      size: "medium",
      component: <SupportPreview tickets={recentTickets} />,
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Welcome back. Drag widgets to customize your view.
        </p>
      </div>

      {/* Draggable Dashboard Grid */}
      <DashboardGrid initialWidgets={widgets} />
    </div>
  );
}
