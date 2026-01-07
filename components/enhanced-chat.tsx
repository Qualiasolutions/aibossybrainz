"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { BotType } from "@/lib/bot-personalities";
import { EnhancedChatMessage } from "./enhanced-chat-message";
import { ExecutiveSwitch } from "./executive-switch";
import { ArrowUpIcon, StopIcon } from "./icons";

interface EnhancedChatProps {
	initialMessages?: any[];
	initialBotType?: BotType;
	onBotTypeChange?: (botType: BotType) => void;
}

type MessageLike = {
	content?: unknown;
	parts?: Array<{ type?: string; text?: unknown }>;
};

const getMessageContent = (message: MessageLike) => {
	if (typeof message.content === "string") {
		return message.content;
	}
	if (Array.isArray(message.parts)) {
		return message.parts
			.filter((part) => part?.type === "text" && typeof part?.text === "string")
			.map((part) => part.text as string)
			.join("\n\n");
	}
	return "";
};

export function EnhancedChat({
	initialMessages = [],
	initialBotType = "alexandria",
	onBotTypeChange,
}: EnhancedChatProps) {
	const [selectedBotType, setSelectedBotType] =
		useState<BotType>(initialBotType);
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { messages, sendMessage, status, stop } = useChat({
		messages: initialMessages,
	});

	const isLoading = status === "streaming" || status === "submitted";

	useEffect(() => {
		onBotTypeChange?.(selectedBotType);
	}, [selectedBotType, onBotTypeChange]);

	const handleExecutiveChange = useCallback(
		(executive: BotType) => {
			setSelectedBotType(executive);
			onBotTypeChange?.(executive);
		},
		[onBotTypeChange],
	);

	const onSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (!input.trim() || isLoading) {
				return;
			}

			sendMessage(
				{
					role: "user",
					parts: [{ type: "text", text: input }],
				},
				{
					body: {
						selectedBotType,
						selectedChatModel:
							selectedBotType === "kim" ? "chat-model-reasoning" : "chat-model",
					},
				},
			);
			setInput("");
		},
		[input, isLoading, sendMessage, selectedBotType],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				onSubmit(e);
			}
		},
		[onSubmit],
	);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [input]);

	return (
		<div className="flex h-full flex-col">
			{/* Executive Switch at Top */}
			<div className="flex-shrink-0 border-b bg-background p-4">
				<div className="mx-auto max-w-4xl">
					<ExecutiveSwitch
						disabled={isLoading}
						onExecutiveChange={handleExecutiveChange}
						selectedExecutive={selectedBotType}
					/>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				<div className="mx-auto max-w-4xl space-y-4">
					{messages.map((message, index) => (
						<EnhancedChatMessage
							botType={(message as any).metadata?.botType ?? selectedBotType}
							content={getMessageContent(message)}
							isTyping={
								isLoading &&
								index === messages.length - 1 &&
								message.role === "assistant"
							}
							key={message.id || index}
							role={message.role}
						/>
					))}
				</div>
			</div>

			{/* Input Area */}
			<div className="flex-shrink-0 border-t bg-background p-4">
				<form className="mx-auto max-w-4xl" onSubmit={onSubmit}>
					<div className="flex gap-2">
						<Textarea
							className="min-h-[60px] flex-1 resize-none border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
							disabled={isLoading}
							onChange={(e) => {
								setInput(e.target.value);
							}}
							onKeyDown={handleKeyDown}
							placeholder={
								selectedBotType === "alexandria"
									? "Ask Alexandria about marketing strategies..."
									: selectedBotType === "kim"
										? "Ask Kim about sales optimization..."
										: "Ask your executive team for business strategies..."
							}
							ref={textareaRef}
							value={input}
						/>
						{isLoading ? (
							<Button
								onClick={() => stop()}
								size="icon"
								type="button"
								variant="destructive"
							>
								<StopIcon />
							</Button>
						) : (
							<Button
								className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
								disabled={!input.trim()}
								size="icon"
								type="submit"
							>
								<ArrowUpIcon />
							</Button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
