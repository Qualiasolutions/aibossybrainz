"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Download, Loader2, Mic, Phone, PhoneOff, Volume2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { AutoSpeakToggle } from "@/components/auto-speak-toggle";
import { ExecutiveSwitch } from "@/components/executive-switch";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useArtifactSelector } from "@/hooks/use-artifact";
import { useAutoResume } from "@/hooks/use-auto-resume";
import { useAutoSpeak } from "@/hooks/use-auto-speak";
import { useChatVisibility } from "@/hooks/use-chat-visibility";
import { useIsMobile } from "@/hooks/use-mobile";
import { getVoiceForBot } from "@/lib/ai/voice-config";
import {
	BOT_PERSONALITIES,
	type BotType,
	type FocusMode,
} from "@/lib/bot-personalities";
import {
	exportConversationToExcel,
	exportConversationToPDF,
} from "@/lib/conversation-export";
import type { Vote } from "@/lib/supabase/types";
import { ChatSDKError } from "@/lib/errors";
import type { Attachment, ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { fetcher, fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { Artifact } from "./artifact";
import { ConversationAnalytics } from "./conversation-analytics";
import { useDataStream } from "./data-stream-provider";
import { ExecutiveLanding } from "./executive-landing";
import { FocusModeSelector } from "./focus-mode-selector";
import { PlusIcon } from "./icons";
import { Messages } from "./messages";
import { MultimodalInput } from "./multimodal-input";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import { toast } from "./toast";
import { useSidebar } from "./ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";

export function Chat({
	id,
	initialMessages,
	initialChatModel,
	initialVisibilityType,
	isReadonly,
	autoResume,
	initialLastContext,
	initialBotType = "alexandria",
}: {
	id: string;
	initialMessages: ChatMessage[];
	initialChatModel: string;
	initialVisibilityType: VisibilityType;
	isReadonly: boolean;
	autoResume: boolean;
	initialLastContext?: AppUsage;
	initialBotType?: BotType;
}) {
	const router = useRouter();
	const { open } = useSidebar();
	const isMobile = useIsMobile();
	const { visibilityType } = useChatVisibility({
		chatId: id,
		initialVisibilityType,
	});

	const { mutate } = useSWRConfig();
	const { setDataStream } = useDataStream();

	const [input, setInput] = useState<string>("");
	const [usage, setUsage] = useState<AppUsage | undefined>(initialLastContext);
	const [currentModelId, setCurrentModelId] = useState(initialChatModel);
	const [selectedBot, setSelectedBot] = useState<BotType>(initialBotType);
	const [focusMode, setFocusMode] = useState<FocusMode>("default");
	const [isVoiceCallSupported, setIsVoiceCallSupported] = useState(false);
	const currentModelIdRef = useRef(currentModelId);
	const selectedBotRef = useRef(initialBotType);

	// Check browser support for voice call (SSR-safe)
	useEffect(() => {
		setIsVoiceCallSupported(getSpeechRecognition() !== null);
	}, []);

	useEffect(() => {
		currentModelIdRef.current = currentModelId;
	}, [currentModelId]);

	useEffect(() => {
		selectedBotRef.current = selectedBot;
	}, [selectedBot]);

	// Handler for bot switching with toast notification
	const handleBotChange = (newBot: BotType) => {
		if (newBot !== selectedBot) {
			const personality = BOT_PERSONALITIES[newBot];
			setSelectedBot(newBot);
			toast({
				type: "success",
				description: `Now consulting with ${personality.name} - ${personality.role}`,
			});
		}
	};

	// Handler for suggestion selection - prefills input
	const handleSuggestionSelect = (text: string) => {
		setInput(text);
	};

	// Create a stable reference to the current bot type for message sending
	const getCurrentBotType = () => selectedBotRef.current;

	// Track the botType that was active when the last message was sent
	// This ensures assistant responses show the correct executive even during streaming
	const [activeBotTypeForStreaming, setActiveBotTypeForStreaming] =
		useState<BotType>(initialBotType);

	const {
		messages,
		setMessages,
		sendMessage: originalSendMessage,
		status,
		stop,
		regenerate,
		resumeStream,
	} = useChat<ChatMessage>({
		id,
		messages: initialMessages,
		experimental_throttle: 100,
		generateId: generateUUID,
		transport: new DefaultChatTransport({
			api: "/api/chat",
			fetch: fetchWithErrorHandlers,
			prepareSendMessagesRequest: (request) => {
				// Capture the current bot type at the exact moment of sending
				const currentBotType = selectedBotRef.current;
				// Store this for use during streaming
				setActiveBotTypeForStreaming(currentBotType);
				return {
					body: {
						id: request.id,
						message: request.messages.at(-1),
						selectedChatModel: currentModelIdRef.current,
						selectedVisibilityType: visibilityType,
						selectedBotType: currentBotType,
						focusMode: focusMode,
						...request.body,
					},
				};
			},
		}),
		onData: (dataPart) => {
			setDataStream((ds) => (ds ? [...ds, dataPart] : []));
			if (dataPart.type === "data-usage") {
				setUsage(dataPart.data);
			}
		},
		onFinish: () => {
			mutate(unstable_serialize(getChatHistoryPaginationKey));
		},
		onError: (error) => {
			if (error instanceof ChatSDKError) {
				toast({
					type: "error",
					description: error.message,
				});
			}
		},
	});

	// Wrap sendMessage to capture the botType at send time
	const sendMessage = (message: Parameters<typeof originalSendMessage>[0]) => {
		setActiveBotTypeForStreaming(selectedBot);
		return originalSendMessage(message);
	};

	// Sync selectedBot with incoming assistant messages
	useEffect(() => {
		const lastAssistantMessage = messages
			.filter((msg) => msg.role === "assistant")
			.at(-1);

		if (lastAssistantMessage?.metadata?.botType) {
			const messageBotType = lastAssistantMessage.metadata.botType as BotType;
			if (messageBotType !== selectedBot) {
				setSelectedBot(messageBotType);
			}
		}
	}, [messages, selectedBot]);

	const searchParams = useSearchParams();
	const query = searchParams.get("query");

	const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

	useEffect(() => {
		if (query && !hasAppendedQuery) {
			sendMessage({
				role: "user" as const,
				parts: [{ type: "text", text: query }],
			});

			setHasAppendedQuery(true);
			window.history.replaceState({}, "", `/chat/${id}`);
		}
	}, [query, sendMessage, hasAppendedQuery, id]);

	const { data: votes } = useSWR<Vote[]>(
		messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
		fetcher,
	);

	const [attachments, setAttachments] = useState<Attachment[]>([]);
	const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

	useAutoResume({
		autoResume,
		initialMessages,
		resumeStream,
		setMessages,
	});

	// Auto-speak functionality - speaks assistant responses when streaming completes
	const {
		isAutoSpeakEnabled,
		toggleAutoSpeak,
		stop: stopSpeaking,
		togglePause: toggleSpeakPause,
		isLoading: isSpeakLoading,
		isPlaying: isSpeakPlaying,
		isPaused: isSpeakPaused,
	} = useAutoSpeak({
		messages,
		status,
		botType: activeBotTypeForStreaming,
		enabled: true, // Enabled by default
	});

	// Export conversation handlers
	const [isExporting, setIsExporting] = useState(false);

	const handleExportPDF = async () => {
		if (messages.length === 0 || isExporting) return;
		setIsExporting(true);
		try {
			const chatTitle =
				messages[0]?.parts
					?.find((p) => p.type === "text")
					?.text?.slice(0, 50) || "Conversation";
			await exportConversationToPDF(messages, chatTitle, selectedBot);
			toast({ type: "success", description: "Conversation exported to PDF" });
		} catch (error) {
			console.error("Export failed:", error);
			toast({ type: "error", description: "Failed to export conversation" });
		} finally {
			setIsExporting(false);
		}
	};

	const handleExportExcel = async () => {
		if (messages.length === 0) return;
		try {
			const chatTitle =
				messages[0]?.parts
					?.find((p) => p.type === "text")
					?.text?.slice(0, 50) || "Conversation";
			await exportConversationToExcel(messages, chatTitle, selectedBot);
			toast({ type: "success", description: "Conversation exported to Excel" });
		} catch (error) {
			console.error("Export failed:", error);
			toast({ type: "error", description: "Failed to export conversation" });
		}
	};

	// Voice call state
	type VoiceCallStatus =
		| "idle"
		| "connecting"
		| "listening"
		| "processing"
		| "speaking"
		| "error";

	const [voiceCallOpen, setVoiceCallOpen] = useState(false);
	const [voiceCallStatus, setVoiceCallStatus] =
		useState<VoiceCallStatus>("idle");
	const [voiceTranscript, setVoiceTranscript] = useState("");
	const [voiceCallError, setVoiceCallError] = useState<string | null>(null);
	const [voiceCallDuration, setVoiceCallDuration] = useState(0);

	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
	const voiceCallStartRef = useRef<number>(0);
	const voiceDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const voiceCallActiveRef = useRef(false);
	const lastMessageCountRef = useRef(messages.length);
	const waitingForResponseRef = useRef(false);
	const voiceCallStatusRef = useRef<VoiceCallStatus>("idle");

	// Check for Web Speech API support
	const getSpeechRecognition = useCallback(():
		| typeof SpeechRecognition
		| null => {
		if (typeof window === "undefined") return null;
		return (
			window.SpeechRecognition ||
			(
				window as unknown as {
					webkitSpeechRecognition: typeof SpeechRecognition;
				}
			).webkitSpeechRecognition ||
			null
		);
	}, []);

	// Format duration as mm:ss
	const formatDuration = useCallback((seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}, []);

	// Cleanup voice call
	const cleanupVoiceCall = useCallback(() => {
		voiceCallActiveRef.current = false;
		waitingForResponseRef.current = false;

		if (recognitionRef.current) {
			try {
				recognitionRef.current.stop();
			} catch {
				// Ignore
			}
			recognitionRef.current = null;
		}

		if (voiceAudioRef.current) {
			voiceAudioRef.current.pause();
			voiceAudioRef.current.src = "";
			voiceAudioRef.current = null;
		}

		if (voiceDurationIntervalRef.current) {
			clearInterval(voiceDurationIntervalRef.current);
			voiceDurationIntervalRef.current = null;
		}

		voiceCallStatusRef.current = "idle";
		setVoiceCallStatus("idle");
		setVoiceTranscript("");
		setVoiceCallDuration(0);
	}, []);

	// Speak response using ElevenLabs TTS
	const speakVoiceResponse = useCallback(
		async (text: string): Promise<void> => {
			if (!text.trim() || !voiceCallActiveRef.current) return;

			voiceCallStatusRef.current = "speaking";
			setVoiceCallStatus("speaking");

			try {
				const voiceId = getVoiceForBot(selectedBot);
				const response = await fetch("/api/voice", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ text, voiceId }),
				});

				if (!response.ok) {
					throw new Error("Failed to generate speech");
				}

				const blob = await response.blob();
				const audioUrl = URL.createObjectURL(blob);

				return new Promise((resolve) => {
					const audio = new Audio(audioUrl);
					voiceAudioRef.current = audio;

					audio.onended = () => {
						URL.revokeObjectURL(audioUrl);
						voiceAudioRef.current = null;
						resolve();
					};

					audio.onerror = () => {
						URL.revokeObjectURL(audioUrl);
						voiceAudioRef.current = null;
						resolve();
					};

					audio.play().catch(() => resolve());
				});
			} catch (err) {
				console.error("TTS error:", err);
			}
		},
		[selectedBot],
	);

	// Start voice listening
	const startVoiceListening = useCallback(() => {
		if (!voiceCallActiveRef.current) return;

		const SpeechRecognitionClass = getSpeechRecognition();

		if (!SpeechRecognitionClass) {
			setVoiceCallError(
				"Speech recognition not supported. Please use Chrome, Edge, or Safari.",
			);
			voiceCallStatusRef.current = "error";
			setVoiceCallStatus("error");
			return;
		}

		const recognition = new SpeechRecognitionClass();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onstart = () => {
			if (voiceCallActiveRef.current) {
				voiceCallStatusRef.current = "listening";
				setVoiceCallStatus("listening");
				setVoiceTranscript("");
			}
		};

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			if (!voiceCallActiveRef.current) return;

			let interimTranscript = "";
			let finalTranscript = "";

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				if (result.isFinal) {
					finalTranscript += result[0].transcript;
				} else {
					interimTranscript += result[0].transcript;
				}
			}

			setVoiceTranscript(finalTranscript || interimTranscript);

			// If we have a final result, send it as a chat message
			if (finalTranscript.trim() && voiceCallActiveRef.current) {
				try {
					recognition.stop();
				} catch {
					// Ignore
				}

				voiceCallStatusRef.current = "processing";
				setVoiceCallStatus("processing");
				setVoiceTranscript(finalTranscript.trim());
				lastMessageCountRef.current = messages.length;
				waitingForResponseRef.current = true;

				// Send the message
				sendMessage({
					role: "user" as const,
					parts: [{ type: "text", text: finalTranscript.trim() }],
				});
			}
		};

		recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			if (!voiceCallActiveRef.current) return;

			if (event.error === "not-allowed") {
				setVoiceCallError("Microphone access denied.");
				voiceCallStatusRef.current = "error";
				setVoiceCallStatus("error");
				cleanupVoiceCall();
				return;
			}

			if (event.error === "no-speech" || event.error === "aborted") {
				if (voiceCallActiveRef.current && !waitingForResponseRef.current) {
					setTimeout(() => {
						if (voiceCallActiveRef.current && !waitingForResponseRef.current) {
							startVoiceListening();
						}
					}, 100);
				}
				return;
			}

			console.error("Speech recognition error:", event.error);
		};

		recognition.onend = () => {
			// Use ref to avoid stale closure - voiceCallStatus from state would be stale
			if (
				voiceCallActiveRef.current &&
				voiceCallStatusRef.current === "listening" &&
				!waitingForResponseRef.current
			) {
				setTimeout(() => {
					if (voiceCallActiveRef.current && !waitingForResponseRef.current) {
						startVoiceListening();
					}
				}, 100);
			}
		};

		recognitionRef.current = recognition;

		try {
			recognition.start();
		} catch (err) {
			console.error("Failed to start recognition:", err);
			if (voiceCallActiveRef.current) {
				setTimeout(() => {
					if (voiceCallActiveRef.current) {
						startVoiceListening();
					}
				}, 500);
			}
		}
	}, [getSpeechRecognition, messages.length, sendMessage, cleanupVoiceCall]);

	// Start voice call
	const startVoiceCall = useCallback(() => {
		setVoiceCallError(null);
		voiceCallActiveRef.current = true;
		voiceCallStatusRef.current = "connecting";
		setVoiceCallStatus("connecting");
		voiceCallStartRef.current = Date.now();

		voiceDurationIntervalRef.current = setInterval(() => {
			setVoiceCallDuration(
				Math.floor((Date.now() - voiceCallStartRef.current) / 1000),
			);
		}, 1000);

		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				for (const track of stream.getTracks()) {
					track.stop();
				}
				if (voiceCallActiveRef.current) {
					startVoiceListening();
				}
			})
			.catch((err) => {
				console.error("Microphone permission error:", err);
				setVoiceCallError("Microphone access denied.");
				voiceCallStatusRef.current = "error";
				setVoiceCallStatus("error");
				cleanupVoiceCall();
			});
	}, [startVoiceListening, cleanupVoiceCall]);

	// End voice call
	const endVoiceCall = useCallback(() => {
		cleanupVoiceCall();
		setVoiceCallOpen(false);
	}, [cleanupVoiceCall]);

	// Watch for AI response during voice call
	useEffect(() => {
		if (
			voiceCallActiveRef.current &&
			waitingForResponseRef.current &&
			status === "ready" &&
			messages.length > lastMessageCountRef.current
		) {
			// Find the latest assistant message
			const lastMessage = messages[messages.length - 1];
			if (lastMessage?.role === "assistant") {
				waitingForResponseRef.current = false;

				// Extract text from the message parts
				const textPart = lastMessage.parts?.find((p) => p.type === "text");
				const responseText =
					textPart && "text" in textPart ? textPart.text : "";

				if (responseText && voiceCallActiveRef.current) {
					// Speak the response, then resume listening
					speakVoiceResponse(responseText).then(() => {
						if (voiceCallActiveRef.current) {
							startVoiceListening();
						}
					});
				} else if (voiceCallActiveRef.current) {
					startVoiceListening();
				}
			}
		}
	}, [messages, status, speakVoiceResponse, startVoiceListening]);

	// Cleanup voice call on dialog close
	useEffect(() => {
		if (!voiceCallOpen) {
			cleanupVoiceCall();
		}
		return cleanupVoiceCall;
	}, [voiceCallOpen, cleanupVoiceCall]);

	const personality = BOT_PERSONALITIES[selectedBot];

	return (
		<>
			<div className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50/80">
				{/* Subtle ambient gradient orbs */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 overflow-hidden"
				>
					<div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-rose-100/30 blur-[120px]" />
					<div className="absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-amber-50/40 blur-[100px]" />
				</div>

				<div className="relative z-10 flex h-full w-full flex-col">
					{/* Refined Header */}
					<header className="flex-shrink-0 border-stone-200/60 border-b bg-white/95 backdrop-blur-sm">
						<div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:h-18 sm:px-6">
							{/* Left: Brand + Navigation */}
							<div className="flex items-center gap-3 sm:gap-4">
								<SidebarToggle />
								<div className="hidden items-center gap-2 sm:flex" />
								{(!open || isMobile) && (
									<Button
										className="h-9 gap-2 rounded-lg border-stone-200 bg-white px-3 font-medium text-sm text-stone-600 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50"
										onClick={() => {
											router.push("/");
											router.refresh();
										}}
										variant="outline"
									>
										<PlusIcon />
										<span className="hidden sm:inline">New Chat</span>
									</Button>
								)}
							</div>

							{/* Center: Executive Selector + Focus Mode */}
							<div className="flex flex-1 items-center justify-center gap-2">
								<ExecutiveSwitch
									onExecutiveChange={handleBotChange}
									selectedExecutive={selectedBot}
								/>
								<FocusModeSelector
									botType={selectedBot}
									currentMode={focusMode}
									onModeChange={setFocusMode}
								/>
							</div>

							{/* Right: Voice, Export & Visibility */}
							<div className="flex items-center gap-2">
								<AutoSpeakToggle
									isEnabled={isAutoSpeakEnabled}
									isLoading={isSpeakLoading}
									isPaused={isSpeakPaused}
									isPlaying={isSpeakPlaying}
									onStop={stopSpeaking}
									onToggle={toggleAutoSpeak}
									onTogglePause={toggleSpeakPause}
								/>
								{isVoiceCallSupported && (
									<Button
										className="h-9 gap-1.5 rounded-lg border-stone-200 bg-white px-3 font-medium text-sm text-stone-600 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
										onClick={() => setVoiceCallOpen(true)}
										title="Start voice call"
										type="button"
										variant="outline"
									>
										<Phone className="size-4" />
										<span className="hidden sm:inline">Call</span>
									</Button>
								)}
								{messages.length > 0 && (
									<Button
										className="h-9 gap-1.5 rounded-lg border-stone-200 bg-white px-3 font-medium text-sm text-stone-600 shadow-sm transition-all hover:border-stone-300 hover:bg-stone-50"
										disabled={isExporting}
										onClick={handleExportPDF}
										title="Export conversation as PDF"
										type="button"
										variant="outline"
									>
										{isExporting ? (
											<Loader2 className="size-4 animate-spin" />
										) : (
											<Download className="size-4" />
										)}
										<span className="hidden sm:inline">Export</span>
									</Button>
								)}
								{!isReadonly && (
									<VisibilitySelector
										chatId={id}
										selectedVisibilityType={visibilityType}
									/>
								)}
							</div>
						</div>
					</header>

					{/* Main Content */}
					<main className="relative flex-1 overflow-hidden">
						{messages.length === 0 ? (
							<div className="h-full overflow-auto">
								<ExecutiveLanding
									onSelect={handleBotChange}
									selectedBot={selectedBot}
								/>
							</div>
						) : (
							<div className="flex h-full w-full flex-col overflow-hidden">
								{/* Conversation Analytics Panel */}
								<div className="flex-shrink-0 px-4 py-2">
									<ConversationAnalytics
										messages={messages}
										currentBot={selectedBot}
									/>
								</div>
								{/* Messages */}
								<div className="flex-1 overflow-hidden">
									<Messages
										chatId={id}
										className="h-full"
										isArtifactVisible={isArtifactVisible}
										isReadonly={isReadonly}
										messages={messages}
										onSuggestionSelect={handleSuggestionSelect}
										regenerate={regenerate}
										selectedBotType={activeBotTypeForStreaming}
										selectedModelId={initialChatModel}
										setMessages={setMessages}
										status={status}
										votes={votes}
									/>
								</div>
							</div>
						)}
					</main>

					{/* Input Area - Floating */}
					{!isReadonly && (
						<div className="flex-shrink-0 border-stone-200/40 border-t bg-gradient-to-t from-white via-white to-transparent px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-6">
							<div className="w-full">
								<MultimodalInput
									attachments={attachments}
									chatId={id}
									input={input}
									messages={messages}
									onModelChange={setCurrentModelId}
									selectedModelId={currentModelId}
									selectedVisibilityType={visibilityType}
									sendMessage={sendMessage}
									setAttachments={setAttachments}
									setInput={setInput}
									setMessages={setMessages}
									status={status}
									stop={stop}
									usage={usage}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			<Artifact
				attachments={attachments}
				chatId={id}
				input={input}
				isReadonly={isReadonly}
				messages={messages}
				regenerate={regenerate}
				selectedBotType={selectedBot}
				selectedModelId={currentModelId}
				selectedVisibilityType={visibilityType}
				sendMessage={sendMessage}
				setAttachments={setAttachments}
				setInput={setInput}
				setMessages={setMessages}
				status={status}
				stop={stop}
				votes={votes}
			/>

			{/* Voice Call Dialog */}
			<Dialog onOpenChange={setVoiceCallOpen} open={voiceCallOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<div
								className={`size-8 rounded-full bg-gradient-to-br ${personality.color}`}
							/>
							<span>Voice Call with {personality.name}</span>
						</DialogTitle>
						<DialogDescription>{personality.role}</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col items-center gap-6 py-6">
						{/* Status indicator */}
						<div className="relative">
							<div
								className={`flex size-32 items-center justify-center rounded-full transition-all ${
									voiceCallStatus === "idle"
										? "bg-stone-100"
										: voiceCallStatus === "connecting"
											? "animate-pulse bg-amber-100"
											: voiceCallStatus === "listening"
												? "bg-emerald-100"
												: voiceCallStatus === "processing"
													? "animate-pulse bg-blue-100"
													: voiceCallStatus === "speaking"
														? "bg-purple-100"
														: "bg-red-100"
								}`}
							>
								{voiceCallStatus === "idle" && (
									<Phone className="size-12 text-stone-400" />
								)}
								{voiceCallStatus === "connecting" && (
									<Loader2 className="size-12 animate-spin text-amber-500" />
								)}
								{voiceCallStatus === "listening" && (
									<Mic className="size-12 text-emerald-500" />
								)}
								{voiceCallStatus === "processing" && (
									<Loader2 className="size-12 animate-spin text-blue-500" />
								)}
								{voiceCallStatus === "speaking" && (
									<Volume2 className="size-12 text-purple-500" />
								)}
								{voiceCallStatus === "error" && (
									<PhoneOff className="size-12 text-red-500" />
								)}
							</div>

							{/* Listening animation */}
							{voiceCallStatus === "listening" && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="size-32 animate-ping rounded-full border-2 border-emerald-400 opacity-30" />
								</div>
							)}
						</div>

						{/* Status text */}
						<div className="text-center">
							<p className="font-medium text-lg text-stone-700">
								{voiceCallStatus === "idle" && "Ready to call"}
								{voiceCallStatus === "connecting" && "Connecting..."}
								{voiceCallStatus === "listening" && "Listening..."}
								{voiceCallStatus === "processing" && "Thinking..."}
								{voiceCallStatus === "speaking" && "Speaking..."}
								{voiceCallStatus === "error" && "Error"}
							</p>
							{voiceCallStatus !== "idle" && voiceCallStatus !== "error" && (
								<p className="mt-1 text-sm text-stone-500">
									{formatDuration(voiceCallDuration)}
								</p>
							)}
						</div>

						{/* Transcript */}
						{voiceTranscript && (
							<div className="w-full rounded-lg bg-stone-50 p-3">
								<p className="text-center text-sm text-stone-600">
									{voiceTranscript}
								</p>
							</div>
						)}

						{/* Error message */}
						{voiceCallError && (
							<div className="w-full rounded-lg bg-red-50 p-3">
								<p className="text-center text-sm text-red-600">
									{voiceCallError}
								</p>
							</div>
						)}

						{/* Call controls */}
						<div className="flex gap-4">
							{voiceCallStatus === "idle" || voiceCallStatus === "error" ? (
								<Button
									className="gap-2 bg-emerald-500 hover:bg-emerald-600"
									onClick={startVoiceCall}
									size="lg"
									type="button"
								>
									<Phone className="size-5" />
									Start Call
								</Button>
							) : (
								<Button
									className="gap-2 bg-red-500 hover:bg-red-600"
									onClick={endVoiceCall}
									size="lg"
									type="button"
								>
									<PhoneOff className="size-5" />
									End Call
								</Button>
							)}
						</div>

						{/* Info text */}
						<p className="text-center text-xs text-stone-400">
							Speak naturally. {personality.name} will respond with their voice.
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
