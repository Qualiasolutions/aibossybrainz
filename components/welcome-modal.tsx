"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
	Brain,
	MessageSquare,
	Mic,
	Sparkles,
	Target,
	Play,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

const WELCOME_SEEN_KEY = "boss-brainz-welcome-seen";

interface WelcomeModalProps {
	forceOpen?: boolean;
	onClose?: () => void;
}

export function WelcomeModal({ forceOpen, onClose }: WelcomeModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		if (forceOpen) {
			setIsOpen(true);
			return;
		}

		const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
		if (!hasSeenWelcome) {
			setIsOpen(true);
		}
	}, [forceOpen]);

	const handleClose = () => {
		localStorage.setItem(WELCOME_SEEN_KEY, "true");
		setIsOpen(false);
		onClose?.();
	};

	const steps = [
		{
			title: "Welcome to Boss Brainz",
			description:
				"Your AI-powered sales and marketing executives, available 24/7.",
			icon: Brain,
			content: (
				<div className="space-y-4">
					<div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/50">
						<div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
							<div className="flex size-14 items-center justify-center rounded-full bg-red-500/20">
								<Play className="size-6 text-red-400" />
							</div>
							<p className="text-muted-foreground text-sm">
								Video tutorial coming soon
							</p>
						</div>
					</div>
				</div>
			),
		},
		{
			title: "Choose Your Executive",
			description:
				"Toggle between Alexandria (CMO), Kim (CSO), or work with both for a combined strategy.",
			icon: Target,
			content: (
				<div className="grid grid-cols-3 gap-3">
					{[
						{ name: "Alexandria", role: "CMO", color: "rose" },
						{ name: "Kim", role: "CSO", color: "blue" },
						{ name: "Both", role: "Combined", color: "purple" },
					].map((exec) => (
						<div
							key={exec.name}
							className={`rounded-xl border border-white/10 bg-white/5 p-4 text-center`}
						>
							<div
								className={`mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-${exec.color}-500/20`}
							>
								<Target className={`size-5 text-${exec.color}-400`} />
							</div>
							<p className="font-semibold text-foreground text-sm">
								{exec.name}
							</p>
							<p className="text-muted-foreground text-xs">{exec.role}</p>
						</div>
					))}
				</div>
			),
		},
		{
			title: "Be Specific for Better Results",
			description:
				"The more details you share, the more tailored strategies you'll receive.",
			icon: MessageSquare,
			content: (
				<div className="space-y-3">
					<div className="rounded-xl border border-white/10 bg-white/5 p-4">
						<p className="mb-2 font-medium text-red-400 text-xs uppercase">
							Instead of
						</p>
						<p className="text-muted-foreground text-sm">
							"How do I grow my business?"
						</p>
					</div>
					<div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
						<p className="mb-2 font-medium text-emerald-400 text-xs uppercase">
							Try this
						</p>
						<p className="text-foreground text-sm">
							"I run a SaaS company targeting small businesses. We have 500
							users and want to reach 2,000 in 6 months. What marketing
							strategies should I focus on?"
						</p>
					</div>
				</div>
			),
		},
		{
			title: "Talk or Type",
			description:
				"Use voice input to speak naturally, or type your questions. Listen to responses with adjustable speed.",
			icon: Mic,
			content: (
				<div className="grid grid-cols-2 gap-4">
					<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
						<div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-500/20">
							<Mic className="size-6 text-red-400" />
						</div>
						<p className="font-semibold text-foreground text-sm">Voice Input</p>
						<p className="mt-1 text-muted-foreground text-xs">
							Click the mic to speak
						</p>
					</div>
					<div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
						<div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-blue-500/20">
							<Sparkles className="size-6 text-blue-400" />
						</div>
						<p className="font-semibold text-foreground text-sm">
							Audio Response
						</p>
						<p className="mt-1 text-muted-foreground text-xs">
							1x - 3x speed control
						</p>
					</div>
				</div>
			),
		},
	];

	const currentStepData = steps[currentStep];

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="max-w-lg border-white/10 bg-background/95 p-0 backdrop-blur-xl">
				<div className="relative">
					{/* Header */}
					<DialogHeader className="border-white/5 border-b p-6 pb-4">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-xl bg-red-500/20">
								<currentStepData.icon className="size-5 text-red-400" />
							</div>
							<div>
								<DialogTitle className="text-foreground text-lg">
									{currentStepData.title}
								</DialogTitle>
								<p className="mt-0.5 text-muted-foreground text-sm">
									{currentStepData.description}
								</p>
							</div>
						</div>
					</DialogHeader>

					{/* Content */}
					<div className="p-6">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2 }}
							>
								{currentStepData.content}
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between border-white/5 border-t p-4">
						{/* Step indicators */}
						<div className="flex gap-1.5">
							{steps.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentStep(index)}
									className={`h-1.5 rounded-full transition-all ${
										index === currentStep
											? "w-6 bg-red-500"
											: "w-1.5 bg-white/20 hover:bg-white/40"
									}`}
								/>
							))}
						</div>

						{/* Navigation */}
						<div className="flex gap-2">
							{currentStep > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setCurrentStep(currentStep - 1)}
								>
									Back
								</Button>
							)}
							{currentStep < steps.length - 1 ? (
								<Button
									size="sm"
									className="bg-red-500 hover:bg-red-600"
									onClick={() => setCurrentStep(currentStep + 1)}
								>
									Next
								</Button>
							) : (
								<Button
									size="sm"
									className="bg-red-500 hover:bg-red-600"
									onClick={handleClose}
								>
									Get Started
								</Button>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
