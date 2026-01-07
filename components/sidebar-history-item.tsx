import { Star } from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import type { VisibilityType } from "@/components/visibility-selector";
import type { Chat } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import {
	CheckCircleFillIcon,
	GlobeIcon,
	LockIcon,
	MoreHorizontalIcon,
	ShareIcon,
	TrashIcon,
} from "./icons";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";

const PureChatItem = ({
	chat,
	isActive,
	onDelete,
	setOpenMobile,
	onPinToggle,
}: {
	chat: Chat;
	isActive: boolean;
	onDelete: (chatId: string) => void;
	setOpenMobile: (open: boolean) => void;
	onPinToggle?: (chatId: string, isPinned: boolean) => void;
}) => {
	const { visibilityType, setVisibilityType } = useChatVisibility({
		chatId: chat.id,
		initialVisibilityType: chat.visibility as VisibilityType,
	});
	const [isPinned, setIsPinned] = useState(chat.isPinned ?? false);
	const [isPinLoading, setIsPinLoading] = useState(false);

	const handlePinToggle = async () => {
		if (isPinLoading) return;
		setIsPinLoading(true);
		const newPinState = !isPinned;

		try {
			const response = await fetch("/api/chat", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: chat.id, isPinned: newPinState }),
			});

			if (response.ok) {
				setIsPinned(newPinState);
				onPinToggle?.(chat.id, newPinState);
			}
		} catch (_error) {
			// Silently fail
		} finally {
			setIsPinLoading(false);
		}
	};

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive}>
				<Link
					className={cn(
						"group relative my-2 flex min-h-[56px] flex-col justify-center rounded-xl px-3 py-3",
						"border border-transparent transition-all duration-300",
						"hover:border-white/10 hover:bg-white/5",
						isActive && "border-amber-500/30 bg-white/5",
						isPinned && "bg-gradient-to-r from-amber-950/20 to-transparent"
					)}
					href={`/chat/${chat.id}`}
					onClick={() => setOpenMobile(false)}
				>
					{/* Active state indicator - gold gradient */}
					{isActive && (
						<div className="-translate-y-1/2 absolute top-1/2 left-0 h-8 w-1 rounded-r-full bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30" />
					)}

					{/* Pinned glow effect */}
					{isPinned && (
						<div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-amber-500/20 blur-md" />
					)}

					<div className="flex w-full items-start justify-between gap-2">
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								{isPinned && (
									<Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400 drop-shadow-sm" />
								)}
								<span className={cn(
									"line-clamp-2 font-medium text-sm transition-colors",
									"text-foreground/90 group-hover:text-foreground",
									isActive && "text-amber-400"
								)}>
									{chat.title}
								</span>
							</div>
							<div className="mt-1.5 flex flex-wrap items-center gap-1.5">
								<span
									className={cn(
										"rounded-full px-2 py-0.5 font-medium text-xs transition-colors",
										visibilityType === "public"
											? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
											: "bg-white/5 text-muted-foreground border border-white/10",
									)}
								>
									{visibilityType === "public" ? "Public" : "Private"}
								</span>
								{chat.topic && (
									<span
										className={cn(
											"flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-xs border",
											chat.topicColor || "bg-slate-500/20 border-slate-500/30 text-slate-300",
										)}
									>
										{chat.topic}
									</span>
								)}
							</div>
						</div>

						<div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
							<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 transition-colors duration-200 group-hover:bg-amber-500/20">
								<svg
									className="h-3 w-3 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M9 5l7 7-7 7"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
							</div>
						</div>
					</div>
				</Link>
			</SidebarMenuButton>

			<DropdownMenu modal={true}>
				<DropdownMenuTrigger asChild>
					<SidebarMenuAction
						className="mr-1 rounded-lg transition-colors duration-200 hover:bg-white/10 data-[state=open]:bg-white/10 data-[state=open]:text-foreground"
						showOnHover={!isActive}
					>
						<div className="flex h-4 w-4 items-center justify-center">
							<MoreHorizontalIcon size={16} />
						</div>
						<span className="sr-only">More</span>
					</SidebarMenuAction>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="end"
					side="bottom"
				>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="cursor-pointer">
							<div className="mr-2 flex h-4 w-4 items-center justify-center">
								<ShareIcon size={16} />
							</div>
							<span className="font-medium text-sm">Share</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem
									className="flex-row justify-between"
									onClick={() => {
										setVisibilityType("private");
									}}
								>
									<div className="flex flex-row items-center gap-2">
										<LockIcon size={14} />
										<span className="font-medium text-sm">Private</span>
									</div>
									{visibilityType === "private" ? (
										<CheckCircleFillIcon
											className="text-emerald-400"
											size={16}
										/>
									) : null}
								</DropdownMenuItem>
								<DropdownMenuItem
									className="flex-row justify-between"
									onClick={() => {
										setVisibilityType("public");
									}}
								>
									<div className="flex flex-row items-center gap-2">
										<GlobeIcon size={16} />
										<span className="font-medium text-sm">Public</span>
									</div>
									{visibilityType === "public" ? (
										<CheckCircleFillIcon
											className="text-emerald-400"
											size={16}
										/>
									) : null}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuItem
						className={cn(
							isPinned && "text-amber-400",
						)}
						disabled={isPinLoading}
						onSelect={(e) => {
							e.preventDefault();
							handlePinToggle();
						}}
					>
						<Star
							className={cn("size-4", isPinned && "fill-amber-400 text-amber-400")}
						/>
						<span className="font-medium text-sm">
							{isPinned ? "Unpin" : "Pin"}
						</span>
					</DropdownMenuItem>

					<DropdownMenuItem
						className="text-red-400 focus:text-red-400"
						onSelect={() => onDelete(chat.id)}
					>
						<TrashIcon size={16} />
						<span className="font-medium text-sm">Delete</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
	if (prevProps.isActive !== nextProps.isActive) {
		return false;
	}
	if (prevProps.chat.isPinned !== nextProps.chat.isPinned) {
		return false;
	}
	if (prevProps.chat.topic !== nextProps.chat.topic) {
		return false;
	}
	if (prevProps.chat.topicColor !== nextProps.chat.topicColor) {
		return false;
	}
	return true;
});
