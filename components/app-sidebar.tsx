"use client";

import { motion } from "framer-motion";
import { BarChart3, Plus, Trash2 } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function AppSidebar({ user }: { user: User | undefined }) {
	const router = useRouter();
	const { setOpenMobile, state } = useSidebar();
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

	return (
		<>
			<Sidebar className="w-80 border-r border-zinc-200 bg-white shadow-xl">
				<SidebarHeader className="border-b border-zinc-200 bg-white px-4 py-4">
					<SidebarMenu>
						<div className="flex flex-col gap-4">
							{/* Logo with white background */}
							<Link
								className="flex items-center justify-center"
								href="/"
								onClick={handleNewChat}
							>
								<motion.div
									className="flex items-center justify-center p-2"
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<Image
										src="/images/AM_Logo_Horizontal_4C+(1).webp"
										alt="Alecci Media"
										width={200}
										height={65}
										className="h-auto w-full max-w-[200px]"
									/>
								</motion.div>
							</Link>

							<div className="flex gap-2">
								{user && (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												className="h-10 flex-1"
												onClick={() => setShowDeleteAllDialog(true)}
												variant="destructive"
												size="sm"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												<span className="font-medium text-sm">Clear All</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Delete all chats</p>
										</TooltipContent>
									</Tooltip>
								)}

								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className="h-10 flex-1"
											onClick={handleNewChat}
										>
											<Plus className="mr-2 h-4 w-4" />
											<span className="font-medium text-sm">New Chat</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Start new conversation</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent className="flex-1 overflow-hidden bg-white px-4 py-6">
					<div className="h-full overflow-y-auto">
						<SidebarHistory user={user} />
					</div>
				</SidebarContent>

				<SidebarFooter className="border-t border-zinc-200 bg-white px-6 py-4">
					{/* Navigation Links */}
					<div className="mt-2 flex flex-col gap-1 rounded-xl bg-zinc-100 p-2">
						<Link href="/executives" onClick={() => setOpenMobile(false)}>
							<Button
								className="w-full justify-start text-left text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200"
								variant="ghost"
							>
								<svg
									className="mr-2 h-4 w-4 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
								Meet the Team
							</Button>
						</Link>
						<Link href="/history" onClick={() => setOpenMobile(false)}>
							<Button
								className="w-full justify-start text-left text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200"
								variant="ghost"
							>
								<svg
									className="mr-2 h-4 w-4 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
								Chat History
							</Button>
						</Link>
						<Link href="/analytics" onClick={() => setOpenMobile(false)}>
							<Button
								className="w-full justify-start text-left text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200"
								variant="ghost"
							>
								<BarChart3 className="mr-2 h-4 w-4 text-amber-400" />
								Analytics
							</Button>
						</Link>
						<Link href="/strategy-canvas" onClick={() => setOpenMobile(false)}>
							<Button
								className="w-full justify-start text-left text-sm text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200"
								variant="ghost"
							>
								<svg
									className="mr-2 h-4 w-4 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
								Strategy Canvas
							</Button>
						</Link>
					</div>
					{user && <SidebarUserNav user={user} />}
				</SidebarFooter>
			</Sidebar>

			{/* Mobile Sidebar - using Sheet */}
			<div className="lg:hidden">
				<Sheet onOpenChange={setIsMobileSidebarOpen} open={isMobileSidebarOpen}>
					<SheetContent
						className="w-80 border-r border-zinc-200 bg-white p-0"
						side="left"
					>
						<SheetHeader className="border-b border-zinc-200 bg-white px-4 py-4">
							<SheetTitle className="sr-only">Navigation Menu</SheetTitle>
							<div className="flex flex-col gap-4">
								{/* Logo with white background */}
								<Link
									className="flex items-center justify-center"
									href="/"
									onClick={handleNewChat}
								>
									<div className="flex items-center justify-center p-2">
										<Image
											src="/images/AM_Logo_Horizontal_4C+(1).webp"
											alt="Alecci Media"
											width={180}
											height={55}
											className="h-auto w-full max-w-[180px]"
										/>
									</div>
								</Link>

								<div className="flex gap-2">
									{user && (
										<Button
											className="h-10 flex-1"
											onClick={() => setShowDeleteAllDialog(true)}
											variant="destructive"
											size="sm"
										>
											<Trash2 className="mr-1 h-4 w-4" />
											Clear
										</Button>
									)}

									<Button
										className="h-10 flex-1"
										onClick={handleNewChat}
									>
										<Plus className="mr-1 h-4 w-4" />
										New
									</Button>
								</div>
							</div>
						</SheetHeader>

						<div className="flex-1 overflow-hidden px-4 py-6">
							<div className="h-full overflow-y-auto">
								<SidebarHistory user={user} />
							</div>
						</div>

						<div className="border-white/10 border-t bg-gradient-to-r from-white/5 to-transparent px-6 py-4 backdrop-blur">
							{user && <SidebarUserNav user={user} />}
						</div>
					</SheetContent>
				</Sheet>
			</div>

			<AlertDialog
				onOpenChange={setShowDeleteAllDialog}
				open={showDeleteAllDialog}
			>
				<AlertDialogContent className="mx-4 max-w-md glass-dark border-white/10">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-semibold text-lg text-foreground">
							Delete all chats?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-muted-foreground">
							This action cannot be undone. This will permanently delete all
							your chats and remove them from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="rounded-xl">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white transition-all duration-200 hover:from-red-500 hover:to-red-600"
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
