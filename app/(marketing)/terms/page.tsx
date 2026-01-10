"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Scale, AlertTriangle, Users, Mail } from "lucide-react";

const sections = [
	{
		icon: Shield,
		title: "1. Acceptance of Terms",
		content: `By accessing or using the AI Boss Brainz AI Executive Team platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.

The Service provides AI-powered business consulting through virtual executive personas (Alexandria - CMO, Kim - CSO) that offer strategic guidance on sales and marketing matters.`,
	},
	{
		icon: Users,
		title: "2. User Accounts",
		content: `To access certain features of the Service, you must create an account. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized access
• Providing accurate and complete information during registration

We reserve the right to suspend or terminate accounts that violate these terms.`,
	},
	{
		icon: FileText,
		title: "3. Service Description",
		content: `The AI Boss Brainz AI Executive Team provides:

• AI-powered strategic consulting conversations
• Business document generation and analysis
• Strategic planning tools (SWOT, Business Model Canvas, etc.)
• Voice-enabled interactions

Our AI executives simulate human expertise but are artificial intelligence systems. While we strive for accuracy, the advice provided should be considered as guidance and not as a substitute for professional human consultation.`,
	},
	{
		icon: Scale,
		title: "4. Acceptable Use",
		content: `You agree NOT to use the Service to:

• Violate any applicable laws or regulations
• Infringe on intellectual property rights
• Transmit harmful, offensive, or illegal content
• Attempt to gain unauthorized access to our systems
• Interfere with the proper functioning of the Service
• Use automated systems to access the Service without permission
• Collect or harvest user information
• Engage in any activity that disrupts other users' experience`,
	},
	{
		icon: AlertTriangle,
		title: "5. Limitation of Liability",
		content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

The Service is provided "AS IS" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free.

We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.

Our total liability shall not exceed the amount you paid for the Service in the twelve months preceding the claim.`,
	},
	{
		icon: FileText,
		title: "6. Intellectual Property",
		content: `All content, features, and functionality of the Service are owned by AI Boss Brainz and are protected by copyright, trademark, and other intellectual property laws.

You retain ownership of content you submit to the Service. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and process that content to provide the Service.

The AI-generated content provided by our executives may be used by you for your business purposes, subject to these terms.`,
	},
	{
		icon: Scale,
		title: "7. Subscription & Payments",
		content: `Certain features require a paid subscription. By subscribing, you agree to:

• Pay all fees associated with your chosen plan
• Provide accurate billing information
• Authorize us to charge your payment method

Subscriptions automatically renew unless cancelled before the renewal date. Refunds are provided in accordance with our refund policy.`,
	},
	{
		icon: AlertTriangle,
		title: "8. Termination",
		content: `We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.

Upon termination:
• Your right to use the Service ceases immediately
• We may delete your account and associated data
• Provisions that should survive termination will remain in effect`,
	},
	{
		icon: Scale,
		title: "9. Governing Law",
		content: `These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.

Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.`,
	},
	{
		icon: Mail,
		title: "10. Changes to Terms",
		content: `We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service.

Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.`,
	},
];

export default function TermsPage() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Background */}
			<div className="fixed inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.05),transparent_50%)]" />
			</div>

			{/* Hero Section */}
			<section className="pt-32 pb-12 sm:pt-40 sm:pb-16">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center"
					>
						<div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-xl shadow-red-500/25">
							<FileText className="size-8 text-white" />
						</div>
						<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							Terms of Service
						</h1>
						<p className="mx-auto max-w-2xl text-muted-foreground">
							Last updated: January 2026
						</p>
					</motion.div>
				</div>
			</section>

			{/* Content */}
			<section className="pb-20">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="mb-8 rounded-2xl border border-border/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80 sm:p-8"
					>
						<p className="text-muted-foreground leading-relaxed">
							Welcome to AI Boss Brainz. These Terms of Service ("Terms") govern your use of our AI Executive Team platform and related services. Please read these terms carefully before using our Service.
						</p>
					</motion.div>

					<div className="space-y-6">
						{sections.map((section, index) => {
							const Icon = section.icon;
							return (
								<motion.div
									key={section.title}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
									className="rounded-2xl border border-border/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80 sm:p-8"
								>
									<div className="mb-4 flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
											<Icon className="size-5 text-red-600 dark:text-red-400" />
										</div>
										<h2 className="text-lg font-semibold text-foreground sm:text-xl">
											{section.title}
										</h2>
									</div>
									<div className="prose prose-neutral dark:prose-invert max-w-none">
										<p className="whitespace-pre-line text-muted-foreground leading-relaxed">
											{section.content}
										</p>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Contact Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className="mt-8 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-lg dark:border-red-900/50 dark:from-red-950/30 dark:to-neutral-900 sm:p-8"
					>
						<div className="flex items-start gap-4">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
								<Mail className="size-5 text-red-600 dark:text-red-400" />
							</div>
							<div>
								<h2 className="mb-2 text-lg font-semibold text-foreground">
									Contact Us
								</h2>
								<p className="text-muted-foreground">
									If you have any questions about these Terms, please contact us at{" "}
									<a
										href="mailto:legal@bossybrainz.ai"
										className="font-medium text-red-600 hover:underline dark:text-red-400"
									>
										legal@bossybrainz.ai
									</a>
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
