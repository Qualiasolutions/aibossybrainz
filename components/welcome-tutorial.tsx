"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Menu,
	Phone,
	Users,
	Send,
	Sparkles,
	ChevronRight,
	ChevronLeft,
	X,
	Target,
	ArrowRight,
} from "lucide-react";

const TUTORIAL_COMPLETED_KEY = "alecci_tutorial_completed";
const TOS_ACCEPTED_KEY = "alecci_tos_accepted";

interface TutorialStep {
	id: number;
	title: string;
	description: string;
	icon: React.ReactNode;
	highlight?: string;
	position: "center" | "top-left" | "top-right" | "bottom-center";
}

const tutorialSteps: TutorialStep[] = [
	{
		id: 1,
		title: "Welcome to Alecci Media",
		description:
			"Your AI executive team is ready to help with brand strategy, sales optimization, and business growth. Let's take a quick tour of your command center.",
		icon: <Sparkles className="size-6" />,
		position: "center",
	},
	{
		id: 2,
		title: "Navigation Sidebar",
		description:
			"Click the menu icon to open your sidebar. Access chat history, analytics, strategy canvas, and meet your executive team.",
		icon: <Menu className="size-6" />,
		highlight: "sidebar-toggle",
		position: "top-left",
	},
	{
		id: 3,
		title: "Choose Your Executive",
		description:
			"Select who you want to consult: Alexandria (Brand Strategy), Kim (Sales & Revenue), or both working together collaboratively.",
		icon: <Users className="size-6" />,
		highlight: "executive-switch",
		position: "top-left",
	},
	{
		id: 4,
		title: "Quick Actions",
		description:
			"Start a new conversation anytime with New Chat. Use the Call button for real-time voice conversations with your executives.",
		icon: <Phone className="size-6" />,
		highlight: "chat-header",
		position: "top-right",
	},
	{
		id: 5,
		title: "Smart Input",
		description:
			"Attach files for analysis, use voice input for hands-free messaging, or simply type your questions. Your executives understand context from your conversation.",
		icon: <Send className="size-6" />,
		highlight: "multimodal-input",
		position: "bottom-center",
	},
	{
		id: 6,
		title: "You're Ready!",
		description:
			"Start by asking about your brand positioning, sales pipeline, or any strategic challenge. Your AI executives are here 24/7.",
		icon: <Target className="size-6" />,
		position: "center",
	},
];

export function WelcomeTutorial() {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Wait for TOS to be accepted before showing tutorial
		const tosAccepted = localStorage.getItem(TOS_ACCEPTED_KEY);
		const tutorialCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY);

		if (tosAccepted && !tutorialCompleted) {
			// Small delay to let TOS modal close
			const timer = setTimeout(() => {
				setIsOpen(true);
			}, 500);
			return () => clearTimeout(timer);
		}
	}, []);

	const handleNext = useCallback(() => {
		if (currentStep < tutorialSteps.length - 1) {
			setCurrentStep((prev) => prev + 1);
		} else {
			handleComplete();
		}
	}, [currentStep]);

	const handlePrevious = useCallback(() => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	}, [currentStep]);

	const handleComplete = useCallback(() => {
		localStorage.setItem(TUTORIAL_COMPLETED_KEY, new Date().toISOString());
		setIsOpen(false);
	}, []);

	const handleSkip = useCallback(() => {
		handleComplete();
	}, [handleComplete]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			switch (e.key) {
				case "ArrowRight":
				case "Enter":
					handleNext();
					break;
				case "ArrowLeft":
					handlePrevious();
					break;
				case "Escape":
					handleSkip();
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, handleNext, handlePrevious, handleSkip]);

	if (!mounted || !isOpen) return null;

	const step = tutorialSteps[currentStep];
	const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[200] flex items-center justify-center"
				>
					{/* Backdrop - soft white overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-white/95 backdrop-blur-sm"
					/>

					{/* Tutorial Card */}
					<motion.div
						key={step.id}
						initial={{ opacity: 0, y: 30, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -30, scale: 0.95 }}
						transition={{ type: "spring", duration: 0.5 }}
						className="relative z-10 mx-4 w-full max-w-md"
					>
						{/* Card */}
						<div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-200/50">
							{/* Progress bar */}
							<div className="h-1 bg-neutral-100">
								<motion.div
									className="h-full bg-gradient-to-r from-red-500 to-red-400"
									initial={{ width: 0 }}
									animate={{ width: `${progress}%` }}
									transition={{ duration: 0.3 }}
								/>
							</div>

							{/* Header */}
							<div className="border-b border-neutral-100 p-6 pb-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-4">
										{/* Icon with pulse animation */}
										<motion.div
											className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-500"
											animate={{
												boxShadow: [
													"0 0 0 0 rgba(239, 68, 68, 0)",
													"0 0 0 8px rgba(239, 68, 68, 0.08)",
													"0 0 0 0 rgba(239, 68, 68, 0)",
												],
											}}
											transition={{ duration: 2, repeat: Infinity }}
										>
											{step.icon}
										</motion.div>
										<div>
											<p className="mb-1 text-xs font-medium text-red-500">
												Step {currentStep + 1} of {tutorialSteps.length}
											</p>
											<h2 className="text-xl font-semibold text-neutral-900">
												{step.title}
											</h2>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleSkip}
										className="size-8 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
									>
										<X className="size-4" />
									</Button>
								</div>
							</div>

							{/* Content */}
							<div className="p-6">
								<motion.p
									key={step.id}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 }}
									className="text-base leading-relaxed text-neutral-600"
								>
									{step.description}
								</motion.p>

								{/* Visual hint for highlighted element */}
								{step.highlight && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.2 }}
										className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
									>
										<ArrowRight className="size-4" />
										<span>Look for this feature in your interface</span>
									</motion.div>
								)}
							</div>

							{/* Footer with navigation */}
							<div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50 p-4">
								<Button
									variant="ghost"
									onClick={handleSkip}
									className="text-sm text-neutral-500 hover:text-neutral-700"
								>
									Skip Tour
								</Button>

								<div className="flex items-center gap-2">
									{/* Step indicators */}
									<div className="mr-4 flex items-center gap-1.5">
										{tutorialSteps.map((_, index) => (
											<motion.button
												key={index}
												onClick={() => setCurrentStep(index)}
												className={`h-1.5 rounded-full transition-all ${
													index === currentStep
														? "w-6 bg-red-500"
														: index < currentStep
															? "w-1.5 bg-red-300"
															: "w-1.5 bg-neutral-200"
												}`}
												whileHover={{ scale: 1.2 }}
												whileTap={{ scale: 0.9 }}
											/>
										))}
									</div>

									{currentStep > 0 && (
										<Button
											variant="outline"
											size="sm"
											onClick={handlePrevious}
											className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
										>
											<ChevronLeft className="mr-1 size-4" />
											Back
										</Button>
									)}

									<Button
										size="sm"
										onClick={handleNext}
										className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
									>
										{currentStep === tutorialSteps.length - 1 ? (
											<>
												Get Started
												<Sparkles className="ml-1 size-4" />
											</>
										) : (
											<>
												Next
												<ChevronRight className="ml-1 size-4" />
											</>
										)}
									</Button>
								</div>
							</div>
						</div>

						{/* Keyboard hint */}
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="mt-4 text-center text-xs text-neutral-500"
						>
							Use arrow keys to navigate • Press Esc to skip
						</motion.p>
					</motion.div>

					{/* Spotlight effect for highlighted elements */}
					{step.highlight && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="pointer-events-none absolute inset-0"
						>
							<SpotlightOverlay position={step.position} />
						</motion.div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Spotlight component to highlight specific UI elements
function SpotlightOverlay({
	position,
}: {
	position: string;
}) {
	const getSpotlightPosition = () => {
		switch (position) {
			case "top-left":
				return "top-4 left-4";
			case "top-right":
				return "top-4 right-4";
			case "bottom-center":
				return "bottom-20 left-1/2 -translate-x-1/2";
			default:
				return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
		}
	};

	return (
		<motion.div
			className={`absolute ${getSpotlightPosition()}`}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			{/* Pulsing ring indicator */}
			<motion.div
				className="relative size-16"
				animate={{
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
				}}
			>
				<div className="absolute inset-0 rounded-full border-2 border-red-500/50 bg-red-500/10" />
				<motion.div
					className="absolute inset-0 rounded-full border-2 border-red-500"
					animate={{
						scale: [1, 1.5, 1.5],
						opacity: [0.8, 0, 0],
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
					}}
				/>
			</motion.div>
		</motion.div>
	);
}

// Hook to check if tutorial was completed
export function useTutorialCompleted() {
	const [completed, setCompleted] = useState<boolean | null>(null);

	useEffect(() => {
		const value = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
		setCompleted(!!value);
	}, []);

	return completed;
}

// Function to reset tutorial (for testing or re-showing)
export function resetTutorial() {
	if (typeof window !== "undefined") {
		localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
	}
}
