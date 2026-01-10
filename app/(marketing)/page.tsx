"use client";

import { motion, useInView } from "framer-motion";
import {
	ArrowRight,
	CheckCircle2,
	Crown,
	MessageSquare,
	Mic,
	Paperclip,
	Play,
	Send,
	Sparkles,
	Target,
	TrendingUp,
	UserRound,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Chat Demo Component - Simulates real conversation
function ChatDemo() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isTyping, setIsTyping] = useState(false);

	const conversation = [
		{
			role: "user",
			content: "I need help creating a go-to-market strategy for our new SaaS product launch next quarter.",
		},
		{
			role: "assistant",
			bot: "alexandria",
			content: `Great question! Let me break down a comprehensive GTM strategy for your SaaS launch:

**Phase 1: Pre-Launch (4-6 weeks before)**
- Build anticipation with teaser content
- Develop case studies from beta users
- Create a waitlist with exclusive early access

**Phase 2: Launch Week**
- Coordinate PR push across relevant channels
- Activate influencer partnerships
- Run targeted paid campaigns

**Phase 3: Post-Launch**
- Nurture leads with automated sequences
- Gather and showcase social proof
- Optimize based on early metrics`,
		},
		{
			role: "user",
			content: "What about the sales strategy? How should my team approach the first customers?",
		},
		{
			role: "assistant",
			bot: "kim",
			content: `For early-stage SaaS sales, here's my proven approach:

**1. Focus on Design Partners First**
- Offer 3-5 companies discounted access for feedback
- Build case studies from their success stories

**2. Qualification Framework**
| Criteria | Must-Have | Nice-to-Have |
|----------|-----------|--------------|
| Budget | Confirmed | Flexible timeline |
| Authority | Decision maker | Champion identified |
| Need | Pain point clear | Urgency present |

**3. Demo Strategy**
- Lead with value, not features
- Show ROI in their specific context
- Always end with a clear next step`,
		},
	];

	useEffect(() => {
		if (currentStep >= conversation.length * 2) return;

		const timer = setTimeout(() => {
			if (currentStep % 2 === 0) {
				// Show message
				setCurrentStep((prev) => prev + 1);
			} else {
				// Start typing indicator
				setIsTyping(true);
				setTimeout(() => {
					setIsTyping(false);
					setCurrentStep((prev) => prev + 1);
				}, 1500);
			}
		}, currentStep === 0 ? 1000 : 2500);

		return () => clearTimeout(timer);
	}, [currentStep, conversation.length]);

	const visibleMessages = conversation.slice(0, Math.floor((currentStep + 1) / 2));

	return (
		<div className="relative mx-auto w-full max-w-2xl">
			{/* Browser Chrome */}
			<div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-2xl shadow-stone-900/10">
				{/* Window Controls */}
				<div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-4 py-3">
					<div className="flex gap-1.5">
						<div className="size-3 rounded-full bg-red-400" />
						<div className="size-3 rounded-full bg-yellow-400" />
						<div className="size-3 rounded-full bg-green-400" />
					</div>
					<div className="mx-auto flex items-center gap-2 rounded-lg bg-white px-4 py-1.5 shadow-sm">
						<div className="size-3 rounded bg-gradient-to-br from-red-500 to-red-600" />
						<span className="text-xs text-stone-500">aleccimedia.com</span>
					</div>
				</div>

				{/* Chat Interface */}
				<div className="h-[420px] overflow-hidden bg-gradient-to-b from-stone-50/50 to-white sm:h-[480px]">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-stone-100 bg-white/80 px-4 py-3 backdrop-blur-sm">
						<div className="flex items-center gap-3">
							<div className="flex -space-x-2">
								<div className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-rose-100 to-rose-200 shadow-sm">
									<img
										src="https://i.ibb.co/39XxGyN1/Chat-GPT-Image-Oct-22-2025-04-39-58-AM.png"
										alt="Alexandria"
										className="size-full object-cover"
									/>
								</div>
								<div className="relative size-8 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-red-100 to-red-200 shadow-sm">
									<img
										src="https://i.ibb.co/m7vk4JF/KIM-3.png"
										alt="Kim"
										className="size-full object-cover"
									/>
								</div>
							</div>
							<div>
								<span className="font-semibold text-sm text-stone-800">
									Executive Team
								</span>
								<div className="flex items-center gap-1.5">
									<span className="size-1.5 animate-pulse rounded-full bg-green-500" />
									<span className="text-xs text-stone-500">Online</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button type="button" className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600">
								<Mic className="size-4" />
							</button>
						</div>
					</div>

					{/* Messages */}
					<div className="h-[calc(100%-120px)] space-y-4 overflow-y-auto p-4">
						{visibleMessages.map((message, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								className={cn(
									"flex",
									message.role === "user" ? "justify-end" : "justify-start"
								)}
							>
								{message.role === "assistant" && (
									<div className="mr-2 flex flex-col items-center gap-1">
										<div className="relative size-8 overflow-hidden rounded-full border border-stone-200 shadow-sm">
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
										<span className="text-[10px] text-stone-400">
											{message.bot === "alexandria" ? "CMO" : "CSO"}
										</span>
									</div>
								)}
								<div
									className={cn(
										"max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
										message.role === "user"
											? "bg-stone-800 text-white"
											: "border border-stone-200 bg-white text-stone-700 shadow-sm"
									)}
								>
									{message.role === "assistant" ? (
										<div className="prose prose-sm prose-stone max-w-none">
											<div className="whitespace-pre-wrap text-xs leading-relaxed sm:text-sm">
												{message.content}
											</div>
										</div>
									) : (
										<span className="text-xs sm:text-sm">{message.content}</span>
									)}
								</div>
							</motion.div>
						))}

						{/* Typing Indicator */}
						{isTyping && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex items-start gap-2"
							>
								<div className="size-8 overflow-hidden rounded-full border border-stone-200 shadow-sm">
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
								<div className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
									{[0, 1, 2].map((i) => (
										<motion.div
											key={i}
											animate={{ y: [0, -4, 0] }}
											transition={{
												duration: 0.6,
												repeat: Infinity,
												delay: i * 0.15,
											}}
											className="size-1.5 rounded-full bg-rose-400"
										/>
									))}
								</div>
							</motion.div>
						)}
					</div>

					{/* Input */}
					<div className="border-t border-stone-100 bg-white/80 p-3 backdrop-blur-sm">
						<div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm">
							<button type="button" className="text-stone-400 transition-colors hover:text-stone-600">
								<Paperclip className="size-4" />
							</button>
							<button type="button" className="text-stone-400 transition-colors hover:text-stone-600">
								<Mic className="size-4" />
							</button>
							<input
								type="text"
								placeholder="Message your executive team..."
								className="flex-1 bg-transparent text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none"
								readOnly
							/>
							<button
								type="button"
								className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm"
							>
								<Send className="size-3.5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Floating Elements */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.5 }}
				className="absolute -right-4 top-20 hidden rounded-xl border border-stone-200 bg-white p-3 shadow-lg lg:block"
			>
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-green-100">
						<TrendingUp className="size-4 text-green-600" />
					</div>
					<div>
						<p className="font-semibold text-xs text-stone-800">Strategy Ready</p>
						<p className="text-[10px] text-stone-500">In seconds, not weeks</p>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.7 }}
				className="absolute -left-4 bottom-32 hidden rounded-xl border border-stone-200 bg-white p-3 shadow-lg lg:block"
			>
				<div className="flex items-center gap-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-purple-100">
						<Sparkles className="size-4 text-purple-600" />
					</div>
					<div>
						<p className="font-semibold text-xs text-stone-800">24/7 Available</p>
						<p className="text-[10px] text-stone-500">Unlimited access</p>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

// Feature Section
function FeatureSection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const features = [
		{
			icon: Crown,
			title: "Alexandria Alecci",
			subtitle: "Chief Marketing Officer",
			description:
				"15+ years of marketing leadership. Expert in brand strategy, digital campaigns, and go-to-market execution.",
			color: "from-rose-500 to-red-600",
			bgColor: "bg-rose-50",
		},
		{
			icon: UserRound,
			title: "Kim Mylls",
			subtitle: "Chief Sales Officer",
			description:
				"20+ years closing enterprise deals. Master of pipeline optimization, negotiations, and revenue growth.",
			color: "from-red-600 to-red-700",
			bgColor: "bg-red-50",
		},
		{
			icon: Users,
			title: "Collaborative Mode",
			subtitle: "Both Executives Together",
			description:
				"Get integrated strategies that align marketing and sales for maximum business impact.",
			color: "from-red-700 to-rose-600",
			bgColor: "bg-gradient-to-br from-rose-50 to-red-50",
		},
	];

	return (
		<section ref={ref} className="py-20 sm:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="mx-auto max-w-2xl text-center"
				>
					<span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
						<Sparkles className="size-4" />
						Meet Your Executive Team
					</span>
					<h2 className="mt-6 font-bold text-3xl tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
						Two World-Class Executives.{" "}
						<span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
							One Powerful Platform.
						</span>
					</h2>
					<p className="mt-6 text-lg text-stone-600">
						Get strategic advice from AI executives with combined 35+ years of experience
						in Fortune 500 companies and high-growth startups.
					</p>
				</motion.div>

				<div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-lg sm:p-8"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="relative">
								<div
									className={cn(
										"mb-4 inline-flex size-12 items-center justify-center rounded-xl",
										feature.bgColor
									)}
								>
									<feature.icon
										className={cn(
											"size-6 bg-gradient-to-br bg-clip-text",
											feature.color
										)}
										style={{
											color: "transparent",
											backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
										}}
									/>
									<feature.icon className="absolute size-6 text-red-600" />
								</div>
								<h3 className="font-bold text-lg text-stone-900">{feature.title}</h3>
								<p className="mt-0.5 font-medium text-sm text-red-600">
									{feature.subtitle}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-stone-600">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

// Benefits Section
function BenefitsSection() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const benefits = [
		{
			icon: Zap,
			title: "Instant Strategic Advice",
			description: "Get executive-level guidance in seconds, not weeks of waiting for consultants.",
		},
		{
			icon: MessageSquare,
			title: "Natural Conversations",
			description: "Chat naturally like you would with a real executive. Voice input supported.",
		},
		{
			icon: Target,
			title: "Actionable Frameworks",
			description: "Receive structured strategies, templates, and step-by-step playbooks.",
		},
		{
			icon: TrendingUp,
			title: "Data-Driven Insights",
			description: "Recommendations backed by real-world experience and market intelligence.",
		},
	];

	return (
		<section ref={ref} className="bg-stone-50/50 py-20 sm:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="mx-auto max-w-2xl text-center"
				>
					<h2 className="font-bold text-3xl tracking-tight text-stone-900 sm:text-4xl">
						Why Leaders Choose Alecci Media
					</h2>
					<p className="mt-4 text-lg text-stone-600">
						Transform how you approach business strategy with AI-powered executive consulting.
					</p>
				</motion.div>

				<div className="mt-16 grid gap-8 sm:grid-cols-2">
					{benefits.map((benefit, index) => (
						<motion.div
							key={benefit.title}
							initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
							animate={isInView ? { opacity: 1, x: 0 } : {}}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							className="flex gap-4"
						>
							<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20">
								<benefit.icon className="size-6" />
							</div>
							<div>
								<h3 className="font-semibold text-lg text-stone-900">
									{benefit.title}
								</h3>
								<p className="mt-1 text-stone-600">{benefit.description}</p>
							</div>
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
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section ref={ref} className="py-20 sm:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={isInView ? { opacity: 1, scale: 1 } : {}}
					transition={{ duration: 0.6 }}
					className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-8 sm:p-12 lg:p-16"
				>
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

					{/* Gradient Orbs */}
					<div className="absolute -left-20 -top-20 size-60 rounded-full bg-red-500/20 blur-3xl" />
					<div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-rose-500/20 blur-3xl" />

					<div className="relative z-10 mx-auto max-w-2xl text-center">
						<h2 className="font-bold text-3xl tracking-tight text-white sm:text-4xl lg:text-5xl">
							Ready to Transform Your Strategy?
						</h2>
						<p className="mx-auto mt-6 max-w-lg text-lg text-stone-300">
							Join thousands of business leaders getting executive-level guidance
							at a fraction of the cost.
						</p>
						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link href="/pricing">
								<Button
									size="lg"
									className="w-full gap-2 shadow-xl shadow-red-500/20 sm:w-auto"
								>
									View Pricing
									<ArrowRight className="size-4" />
								</Button>
							</Link>
							<Link href="/login">
								<Button
									variant="outline"
									size="lg"
									className="w-full gap-2 border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 sm:w-auto"
								>
									<Play className="size-4" />
									Try Free Demo
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
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
				{/* Background */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute inset-0 bg-gradient-to-b from-red-50/50 via-white to-white" />
					<div className="absolute left-1/2 top-0 -translate-x-1/2">
						<div className="size-[800px] rounded-full bg-gradient-to-br from-red-100/40 via-rose-50/30 to-transparent blur-3xl" />
					</div>
				</div>

				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-1.5 text-sm font-medium text-red-700 shadow-sm">
								<Sparkles className="size-4" />
								AI-Powered Executive Consulting
							</span>
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="mt-8 font-bold text-4xl tracking-tight text-stone-900 sm:text-5xl lg:text-6xl"
						>
							Your Personal{" "}
							<span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
								CMO & CSO
							</span>
							<br />
							Available 24/7
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl"
						>
							Get strategic marketing and sales advice from AI executives with
							35+ years of combined Fortune 500 experience. Instant answers,
							actionable strategies.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
						>
							<Link href="/login">
								<Button
									size="lg"
									className="w-full gap-2 shadow-xl shadow-red-500/20 sm:w-auto"
								>
									Start Free Trial
									<ArrowRight className="size-4" />
								</Button>
							</Link>
							<Link href="/pricing">
								<Button
									variant="outline"
									size="lg"
									className="w-full gap-2 border-stone-300 sm:w-auto"
								>
									View Pricing
								</Button>
							</Link>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500"
						>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								No credit card required
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								Cancel anytime
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle2 className="size-4 text-green-500" />
								Instant access
							</div>
						</motion.div>
					</div>

					{/* Chat Demo */}
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.5 }}
						className="mt-16 sm:mt-20"
					>
						<ChatDemo />
					</motion.div>
				</div>
			</section>

			<FeatureSection />
			<BenefitsSection />
			<CTASection />
		</>
	);
}
