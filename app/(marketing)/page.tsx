"use client";

import { motion, useInView } from "framer-motion";
import {
	ArrowRight,
	MessageSquare,
	Mic,
	Paperclip,
	Send,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Compact Chat Demo Component
function ChatDemo() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isTyping, setIsTyping] = useState(false);

	const conversation = [
		{
			role: "user",
			content: "I need a go-to-market strategy for our SaaS launch.",
		},
		{
			role: "assistant",
			bot: "alexandria",
			content: `Here's your GTM roadmap:

**Pre-Launch** - Build waitlist, create case studies
**Launch Week** - PR push, influencer activation
**Post-Launch** - Nurture leads, gather social proof`,
		},
		{
			role: "user",
			content: "What's the sales approach for first customers?",
		},
		{
			role: "assistant",
			bot: "kim",
			content: `Focus on design partners first:

1. **Offer 3-5 companies** discounted access
2. **Qualify with BANT** - Budget, Authority, Need
3. **Lead demos with value**, not features`,
		},
	];

	useEffect(() => {
		if (currentStep >= conversation.length * 2) return;

		const timer = setTimeout(() => {
			if (currentStep % 2 === 0) {
				setCurrentStep((prev) => prev + 1);
			} else {
				setIsTyping(true);
				setTimeout(() => {
					setIsTyping(false);
					setCurrentStep((prev) => prev + 1);
				}, 1200);
			}
		}, currentStep === 0 ? 800 : 2000);

		return () => clearTimeout(timer);
	}, [currentStep, conversation.length]);

	const visibleMessages = conversation.slice(0, Math.floor((currentStep + 1) / 2));

	return (
		<div className="relative w-full">
			{/* Browser Chrome */}
			<div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/10">
				{/* Window Controls */}
				<div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-4 py-2.5">
					<div className="flex gap-1.5">
						<div className="size-2.5 rounded-full bg-red-400" />
						<div className="size-2.5 rounded-full bg-yellow-400" />
						<div className="size-2.5 rounded-full bg-green-400" />
					</div>
					<div className="mx-auto flex items-center gap-2 rounded-md bg-white px-3 py-1 shadow-sm">
						<img src="/images/AM_Logo_Horizontal_4C+(1).webp" alt="Bossy Brainz" className="h-4 w-auto" />
						<span className="text-[11px] text-stone-500">bossybrainz.ai</span>
					</div>
				</div>

				{/* Chat Interface */}
				<div className="h-[400px] overflow-hidden bg-gradient-to-b from-stone-50/50 to-white lg:h-[450px]">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-stone-100 bg-white/80 px-4 py-2.5 backdrop-blur-sm">
						<div className="flex items-center gap-2.5">
							<div className="flex -space-x-1.5">
								<div className="relative size-7 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-rose-200 shadow-sm">
									<img
										src="https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
										alt="Alexandria"
										className="size-full object-cover"
									/>
								</div>
								<div className="relative size-7 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-red-100 to-red-200 shadow-sm">
									<img
										src="https://i.ibb.co/m7vk4JF/KIM-3.png"
										alt="Kim"
										className="size-full object-cover"
									/>
								</div>
							</div>
							<div>
								<span className="font-semibold text-xs text-stone-800">Executive Team</span>
								<div className="flex items-center gap-1">
									<span className="size-1.5 animate-pulse rounded-full bg-green-500" />
									<span className="text-[10px] text-stone-500">Online</span>
								</div>
							</div>
						</div>
						<button type="button" className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600">
							<Mic className="size-3.5" />
						</button>
					</div>

					{/* Messages */}
					<div className="h-[calc(100%-100px)] space-y-3 overflow-y-auto p-3">
						{visibleMessages.map((message, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.25 }}
								className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
							>
								{message.role === "assistant" && (
									<div className="mr-2 flex flex-col items-center gap-0.5">
										<div className="relative size-6 overflow-hidden rounded-full border border-stone-200 shadow-sm">
											<img
												src={
													message.bot === "alexandria"
														? "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
														: "https://i.ibb.co/m7vk4JF/KIM-3.png"
												}
												alt={message.bot === "alexandria" ? "Alexandria" : "Kim"}
												className="size-full object-cover"
											/>
										</div>
										<span className="text-[9px] text-stone-400">
											{message.bot === "alexandria" ? "CMO" : "CSO"}
										</span>
									</div>
								)}
								<div
									className={cn(
										"max-w-[85%] rounded-xl px-3 py-2 text-xs",
										message.role === "user"
											? "bg-stone-800 text-white"
											: "border border-stone-200 bg-white text-stone-700 shadow-sm"
									)}
								>
									{message.role === "assistant" ? (
										<div className="whitespace-pre-wrap leading-relaxed">
											{message.content}
										</div>
									) : (
										<span>{message.content}</span>
									)}
								</div>
							</motion.div>
						))}

						{isTyping && (
							<motion.div
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex items-start gap-2"
							>
								<div className="size-6 overflow-hidden rounded-full border border-stone-200 shadow-sm">
									<img
										src={
											visibleMessages.length % 2 === 0
												? "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
												: "https://i.ibb.co/m7vk4JF/KIM-3.png"
										}
										alt="Executive"
										className="size-full object-cover"
									/>
								</div>
								<div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm">
									{[0, 1, 2].map((i) => (
										<motion.div
											key={i}
											animate={{ y: [0, -3, 0] }}
											transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
											className="size-1.5 rounded-full bg-rose-400"
										/>
									))}
								</div>
							</motion.div>
						)}
					</div>

					{/* Input */}
					<div className="border-t border-stone-100 bg-white/80 p-2.5 backdrop-blur-sm">
						<div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-1.5 shadow-sm">
							<Paperclip className="size-3.5 text-stone-400" />
							<Mic className="size-3.5 text-stone-400" />
							<input
								type="text"
								placeholder="Message your executive team..."
								className="flex-1 bg-transparent text-xs text-stone-600 placeholder:text-stone-400 focus:outline-none"
								readOnly
							/>
							<button
								type="button"
								className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm"
							>
								<Send className="size-3" />
							</button>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
}

// Executive Cards
function ExecutiveCards() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	const executives = [
		{
			name: "Alexandria Alecci",
			role: "Chief Marketing Officer",
			image: "https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png",
			expertise: ["Brand Strategy", "Go-to-Market", "Digital Campaigns"],
			color: "from-rose-500 to-red-600",
		},
		{
			name: "Kim Mylls",
			role: "Chief Sales Officer",
			image: "https://i.ibb.co/m7vk4JF/KIM-3.png",
			expertise: ["Enterprise Sales", "Pipeline Growth", "Deal Closing"],
			color: "from-red-600 to-red-700",
		},
	];

	return (
		<section ref={ref} className="py-16 sm:py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="mb-12 text-center"
				>
					<h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
						Meet Your <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Executive Team</span>
					</h2>
					<p className="mt-3 text-stone-600">35+ years of combined Fortune 500 experience</p>
				</motion.div>

				<div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
					{executives.map((exec, i) => (
						<motion.div
							key={exec.name}
							initial={{ opacity: 0, y: 30 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.15 }}
							className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="relative flex items-start gap-4">
								<div className="relative size-16 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-lg">
									<img src={exec.image} alt={exec.name} className="size-full object-cover" />
									<div className={cn("absolute inset-0 bg-gradient-to-t opacity-20", exec.color)} />
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-lg text-stone-900">{exec.name}</h3>
									<p className="font-medium text-sm text-red-600">{exec.role}</p>
									<div className="mt-3 flex flex-wrap gap-1.5">
										{exec.expertise.map((skill) => (
											<span
												key={skill}
												className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600"
											>
												{skill}
											</span>
										))}
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

// Benefits Grid
function BenefitsGrid() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	const benefits = [
		{ icon: Zap, title: "Instant Advice", desc: "Get answers in seconds, not weeks" },
		{ icon: MessageSquare, title: "Natural Chat", desc: "Voice & text supported" },
		{ icon: Target, title: "Actionable Plans", desc: "Ready-to-use frameworks" },
		{ icon: TrendingUp, title: "Proven Tactics", desc: "Real-world experience" },
	];

	return (
		<section ref={ref} className="bg-stone-50 py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					className="mb-12 text-center"
				>
					<h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
						Why Leaders Choose Us
					</h2>
				</motion.div>

				<div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{benefits.map((b, i) => (
						<motion.div
							key={b.title}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.1 }}
							className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
						>
							<div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md shadow-red-500/20">
								<b.icon className="size-5" />
							</div>
							<h3 className="font-semibold text-stone-900">{b.title}</h3>
							<p className="mt-1 text-sm text-stone-600">{b.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

// CTA Section
function CTASection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-50px" });

	return (
		<section ref={ref} className="py-16 sm:py-20 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, scale: 0.98 }}
					animate={isInView ? { opacity: 1, scale: 1 } : {}}
					className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 px-6 py-12 text-center sm:rounded-3xl sm:px-12 sm:py-16"
				>
					<div className="absolute -left-20 -top-20 size-60 rounded-full bg-red-500/20 blur-3xl" />
					<div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-rose-500/20 blur-3xl" />

					<div className="relative z-10">
						<h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
							Ready to Transform Your Strategy?
						</h2>
						<p className="mx-auto mt-4 max-w-lg text-sm text-stone-300 sm:text-base">
							Join thousands of leaders getting executive-level guidance at a fraction of the cost.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
							<Link href="/login">
								<Button size="lg" className="w-full gap-2 shadow-xl shadow-red-500/20 sm:w-auto">
									Start Free Trial
									<ArrowRight className="size-4" />
								</Button>
							</Link>
							<Link href="/pricing">
								<Button
									variant="outline"
									size="lg"
									className="w-full gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
								>
									View Pricing
								</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

export default function LandingPage() {
	return (
		<>
			{/* Hero - Full Width Split Layout */}
			<section className="relative overflow-hidden">
				{/* Background */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-white to-stone-50" />
					<div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-red-50/40 to-transparent" />
				</div>

				<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
					<div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
						{/* Left - Content */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="flex flex-col"
						>
							<h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
								Your AI{" "}
								<span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
									CMO & CSO
								</span>{" "}
								Team
							</h1>

							<p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">
								Strategic marketing and sales consulting powered by AI. Get actionable strategies and expert guidance on demand.
							</p>

							<div className="mt-8 flex flex-wrap gap-4">
								<Link href="/login">
									<Button size="lg" className="gap-2 px-8 shadow-xl shadow-red-500/20">
										Get Started
										<ArrowRight className="size-4" />
									</Button>
								</Link>
								<Link href="/pricing">
									<Button variant="outline" size="lg" className="gap-2 border-stone-300 px-8">
										View Pricing
									</Button>
								</Link>
							</div>
						</motion.div>

						{/* Right - Demo */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="flex items-center justify-center"
						>
							<div className="w-full max-w-xl lg:max-w-none">
								<ChatDemo />
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<ExecutiveCards />
			<BenefitsGrid />
			<CTASection />
		</>
	);
}
