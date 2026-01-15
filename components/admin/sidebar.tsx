"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Users,
	MessageSquare,
	BarChart3,
	Settings,
	ChevronLeft,
	Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: Users,
	},
	{
		title: "Conversations",
		href: "/admin/conversations",
		icon: MessageSquare,
	},
	{
		title: "Analytics",
		href: "/admin/analytics",
		icon: BarChart3,
	},
	{
		title: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-900">
			{/* Header */}
			<div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-4">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-red-600">
					<Sparkles className="h-4 w-4 text-white" />
				</div>
				<div>
					<h1 className="text-sm font-semibold text-white">Admin Panel</h1>
					<p className="text-xs text-zinc-400">Alecci Media AI</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 p-4">
				{navItems.map((item) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/admin" && pathname.startsWith(item.href));

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-400"
									: "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
							)}
						>
							<item.icon className="h-4 w-4" />
							{item.title}
						</Link>
					);
				})}
			</nav>

			{/* Footer */}
			<div className="border-t border-zinc-800 p-4">
				<Link href="/">
					<Button
						variant="ghost"
						className="w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100"
					>
						<ChevronLeft className="h-4 w-4" />
						Back to App
					</Button>
				</Link>
			</div>
		</div>
	);
}
