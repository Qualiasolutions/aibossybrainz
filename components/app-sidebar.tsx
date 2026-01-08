"use client";

import { motion } from "framer-motion";
import {
	BarChart3,
	ChevronUp,
	Clock,
	LayoutGrid,
	Plus,
	Trash2,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { useMobileSidebar } from "@/components/mobile-sidebar-context";
import {
	getChatHistoryPaginationKey,
	SidebarHistory,
} from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

const navItems = [
	{ href: "/executives", label: "Meet the Team", icon: Users },
	{ href: "/history", label: "Chat History", icon: Clock },
	{ href: "/analytics", label: "Analytics", icon: BarChart3 },
	{ href: "/strategy-canvas", label: "Strategy Canvas", icon: LayoutGrid },
];

export function AppSidebar({ user }: { user: User | undefined }) {
	const router = useRouter();
	const { setOpenMobile } = useSidebar();
	const { mutate } = useSWRConfig();
	const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
	const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useMobileSidebar();

	const handleDeleteAll = () => {
		const deletePromise = fetch("/api/history", {
			method: "DELETE",
		});

		toast.promise(deletePromise, {
			loading: "Deleting all chats...",
			success: () => {
				mutate(unstable_serialize(getChatHistoryPaginationKey));
				router.push("/");
				setShowDeleteAllDialog(false);
				setIsMobileSidebarOpen(false);
				return "All chats deleted successfully";
			},
			error: "Failed to delete all chats",
		});
	};

	const handleNewChat = () => {
		setOpenMobile(false);
		setIsMobileSidebarOpen(false);
		router.push("/");
		router.refresh();
	};

	const handleNavClick = () => {
		setOpenMobile(false);
		setIsMobileSidebarOpen(false);
	};

	return (
		<>
			<Sidebar className="w-72 border-r border-neutral-200 bg-white">
				<SidebarHeader className="border-b border-neutral-100 bg-white px-4 py-3">
					<SidebarMenu>
						<div className="flex flex-col gap-3">
							{/* Logo */}
							<Link
								className="flex items-center justify-center"
								href="/"
								onClick={handleNewChat}
							>
								<motion.div
									className="flex items-center justify-center"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Image
										src="/images/AM_Logo_Horizontal_4C+(1).webp"
										alt="Alecci Media"
										width={160}
										height={50}
										className="h-auto w-full max-w-[160px]"
									/>
								</motion.div>
							</Link>

							{/* Action buttons - consistent height */}
							<div className="flex gap-2">
								{user && (
									<Button
										className="h-9 flex-1 rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
										onClick={() => setShowDeleteAllDialog(true)}
										variant="ghost"
										size="sm"
									>
										<Trash2 className="mr-1.5 h-3.5 w-3.5" />
										<span className="text-xs font-medium">Clear</span>
									</Button>
								)}
								<Button
									className="h-9 flex-1 rounded-lg"
									onClick={handleNewChat}
									size="sm"
								>
									<Plus className="mr-1.5 h-3.5 w-3.5" />
									<span className="text-xs font-medium">New Chat</span>
								</Button>
							</div>
						</div>
					</SidebarMenu>
				</SidebarHeader>

				{/* Expanded chat history area */}
				<SidebarContent className="flex-1 overflow-hidden bg-white px-3 py-4">
					<div className="h-full overflow-y-auto">
						<SidebarHistory user={user} />
					</div>
				</SidebarContent>

				{/* Compact footer with dropup menu */}
				<SidebarFooter className="border-t border-neutral-100 bg-white px-3 py-2">
					<div className="flex flex-col gap-2">
						{/* Navigation dropup */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-9 w-full justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-neutral-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
								>
									<span className="flex items-center gap-2">
										<LayoutGrid className="h-3.5 w-3.5" />
										<span className="text-xs font-medium">Navigate</span>
									</span>
									<ChevronUp className="h-3.5 w-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								side="top"
								className="w-[200px] rounded-xl border-neutral-200 bg-white p-1 shadow-lg"
							>
								{navItems.map((item) => (
									<DropdownMenuItem
										key={item.href}
										asChild
										className="rounded-lg px-3 py-2.5 text-neutral-700 focus:bg-red-50 focus:text-red-600 cursor-pointer"
									>
										<Link href={item.href} onClick={handleNavClick}>
											<item.icon className="mr-2.5 h-4 w-4 text-red-500" />
											<span className="text-sm font-medium">{item.label}</span>
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* User nav */}
						{user && (
							<div className="w-full">
								<SidebarUserNav user={user} />
							</div>
						)}
					</div>
				</SidebarFooter>
			</Sidebar>

			{/* Mobile Sidebar */}
			<div className="lg:hidden">
				<Sheet onOpenChange={setIsMobileSidebarOpen} open={isMobileSidebarOpen}>
					<SheetContent
						className="w-72 border-r border-neutral-200 bg-white p-0"
						side="left"
					>
						<SheetHeader className="border-b border-neutral-100 bg-white px-4 py-3">
							<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							<div className="flex flex-col gap-3">
								<Link
									className="flex items-center justify-center"
									href="/"
									onClick={handleNewChat}
								>
									<Image
										src="/images/AM_Logo_Horizontal_4C+(1).webp"
										alt="Alecci Media"
										width={140}
										height={45}
										className="h-auto w-full max-w-[140px]"
									/>
								</Link>

								<div className="flex gap-2">
									{user && (
										<Button
											className="h-9 flex-1 rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
											onClick={() => setShowDeleteAllDialog(true)}
											variant="ghost"
											size="sm"
										>
											<Trash2 className="mr-1 h-3.5 w-3.5" />
											<span className="text-xs">Clear</span>
										</Button>
									)}
									<Button
										className="h-9 flex-1 rounded-lg"
										onClick={handleNewChat}
										size="sm"
									>
										<Plus className="mr-1 h-3.5 w-3.5" />
										<span className="text-xs">New</span>
									</Button>
								</div>
							</div>
						</SheetHeader>

						<div className="flex-1 overflow-hidden px-3 py-4">
							<div className="h-full overflow-y-auto">
								<SidebarHistory user={user} />
							</div>
						</div>

						<div className="border-t border-neutral-100 bg-white px-3 py-2">
							<div className="flex flex-col gap-2">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="h-9 w-full justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-neutral-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
										>
											<span className="flex items-center gap-2">
												<LayoutGrid className="h-3.5 w-3.5" />
												<span className="text-xs font-medium">Navigate</span>
											</span>
											<ChevronUp className="h-3.5 w-3.5" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="start"
										side="top"
										className="w-[200px] rounded-xl border-neutral-200 bg-white p-1 shadow-lg"
									>
										{navItems.map((item) => (
											<DropdownMenuItem
												key={item.href}
												asChild
												className="rounded-lg px-3 py-2.5 text-neutral-700 focus:bg-red-50 focus:text-red-600 cursor-pointer"
											>
												<Link href={item.href} onClick={handleNavClick}>
													<item.icon className="mr-2.5 h-4 w-4 text-red-500" />
													<span className="text-sm font-medium">{item.label}</span>
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>

								{user && (
									<div className="w-full">
										<SidebarUserNav user={user} />
									</div>
								)}
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<AlertDialog
				onOpenChange={setShowDeleteAllDialog}
				open={showDeleteAllDialog}
			>
				<AlertDialogContent className="mx-4 max-w-md rounded-2xl border-neutral-200 bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-semibold text-lg text-neutral-900">
							Delete all chats?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-neutral-500">
							This action cannot be undone. This will permanently delete all
							your chats and remove them from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="rounded-lg bg-red-600 text-white hover:bg-red-700"
							onClick={handleDeleteAll}
						>
							Delete All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
