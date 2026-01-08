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
						"group relative my-1 flex h-10 items-center rounded-lg px-3",
						"border border-transparent transition-all duration-200",
						"hover:border-neutral-200 hover:bg-neutral-50",
						isActive && "border-red-200 bg-red-50",
						isPinned && "bg-red-50/50"
					)}
					href={`/chat/${chat.id}`}
					onClick={() => setOpenMobile(false)}
				>
					{/* Active state indicator */}
					{isActive && (
						<div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-red-500" />
					)}

					<div className="flex w-full items-center gap-2 min-w-0">
						{isPinned && (
							<Star className="size-3 shrink-0 fill-red-500 text-red-500" />
						)}
						<span className={cn(
							"truncate text-sm transition-colors",
							"text-neutral-700 group-hover:text-neutral-900",
							isActive && "text-red-700 font-medium"
						)}>
							{chat.title}
						</span>
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
							isPinned && "text-red-500",
						)}
						disabled={isPinLoading}
						onSelect={(e) => {
							e.preventDefault();
							handlePinToggle();
						}}
					>
						<Star
							className={cn("size-4", isPinned && "fill-red-500 text-red-500")}
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
