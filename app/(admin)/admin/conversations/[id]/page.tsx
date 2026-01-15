import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, User, Sparkles, Crown, Users } from "lucide-react";
import { getChatWithMessages } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Json } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const executiveConfig: Record<
	string,
	{ name: string; color: string; bgColor: string; icon: typeof Sparkles }
> = {
	alexandria: {
		name: "Alexandria",
		color: "text-rose-400",
		bgColor: "bg-rose-500/20",
		icon: Sparkles,
	},
	kim: {
		name: "Kim",
		color: "text-red-400",
		bgColor: "bg-red-500/20",
		icon: Crown,
	},
	collaborative: {
		name: "Collaborative",
		color: "text-purple-400",
		bgColor: "bg-purple-500/20",
		icon: Users,
	},
};

function extractTextFromParts(parts: Json): string {
	if (!Array.isArray(parts)) return "";
	return parts
		.filter((part): part is { type: string; text: string } =>
			typeof part === "object" &&
			part !== null &&
			"type" in part &&
			part.type === "text" &&
			"text" in part
		)
		.map((part) => part.text)
		.join("\n");
}

export default async function ConversationDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const data = await getChatWithMessages(id);

	if (!data) {
		notFound();
	}

	const { chat, messages } = data;

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<Link href="/admin/conversations">
					<Button
						variant="ghost"
						className="mb-4 text-zinc-400 hover:text-white -ml-2"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Conversations
					</Button>
				</Link>
				<h1 className="text-2xl font-bold text-white">
					{chat.title || "Untitled Conversation"}
				</h1>
				<div className="mt-2 flex items-center gap-4 text-sm text-zinc-400">
					<span>User: {chat.userEmail}</span>
					<span>|</span>
					<span>
						Created{" "}
						{formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
					</span>
					{chat.topic && (
						<>
							<span>|</span>
							<span
								className="px-2 py-0.5 rounded-full text-xs font-medium"
								style={{
									backgroundColor: chat.topicColor
										? `${chat.topicColor}20`
										: undefined,
									color: chat.topicColor || undefined,
								}}
							>
								{chat.topic}
							</span>
						</>
					)}
				</div>
			</div>

			{/* Messages */}
			<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
				<div className="border-b border-zinc-800 px-6 py-4 bg-zinc-800/50">
					<h2 className="text-lg font-semibold text-white">
						Messages ({messages.length})
					</h2>
				</div>
				<div className="divide-y divide-zinc-800 max-h-[600px] overflow-y-auto">
					{messages.length === 0 ? (
						<div className="p-6 text-center text-zinc-500">
							No messages in this conversation
						</div>
					) : (
						messages.map((message) => {
							const isUser = message.role === "user";
							const exec = executiveConfig[message.botType || ""] || {
								name: "Assistant",
								color: "text-zinc-400",
								bgColor: "bg-zinc-500/20",
								icon: Sparkles,
							};
							const Icon = isUser ? User : exec.icon;
							const text = extractTextFromParts(message.parts);

							return (
								<div
									key={message.id}
									className={cn(
										"px-6 py-4",
										isUser ? "bg-zinc-900/50" : "bg-zinc-800/20",
									)}
								>
									<div className="flex items-start gap-4">
										<div
											className={cn(
												"flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
												isUser ? "bg-zinc-700" : exec.bgColor,
											)}
										>
											<Icon
												className={cn(
													"h-4 w-4",
													isUser ? "text-zinc-300" : exec.color,
												)}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<span
													className={cn(
														"text-sm font-medium",
														isUser ? "text-zinc-300" : exec.color,
													)}
												>
													{isUser ? "User" : exec.name}
												</span>
												<span className="text-xs text-zinc-500">
													{formatDistanceToNow(new Date(message.createdAt), {
														addSuffix: true,
													})}
												</span>
											</div>
											<div className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
												{text || (
													<span className="text-zinc-500 italic">
														[No text content]
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
