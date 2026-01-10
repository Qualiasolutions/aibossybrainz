"use client";

import { motion } from "framer-motion";
import { Shield, Database, Eye, Lock, Share2, Globe, Clock, Mail, UserCheck } from "lucide-react";

const sections = [
	{
		icon: Database,
		title: "1. Information We Collect",
		content: `We collect information you provide directly to us:

Account Information:
• Email address and name
• Password (securely hashed)
• Profile preferences and settings

Usage Information:
• Conversations with AI executives
• Documents and artifacts you create
• Feature usage and interaction patterns

Technical Information:
• Device type and browser information
• IP address and location data
• Cookies and similar technologies`,
	},
	{
		icon: Eye,
		title: "2. How We Use Your Information",
		content: `We use the information we collect to:

Provide Services:
• Deliver AI consulting conversations
• Generate and store documents
• Personalize your experience

Improve Our Platform:
• Analyze usage patterns
• Train and improve AI models
• Develop new features

Communicate With You:
• Send service updates
• Respond to inquiries
• Provide customer support`,
	},
	{
		icon: Shield,
		title: "3. AI and Machine Learning",
		content: `Our Service uses artificial intelligence:

Conversation Processing:
• Your conversations are processed by AI models to generate responses
• We may use anonymized conversation data to improve our AI systems
• You can request deletion of your conversation history

Model Training:
• Aggregated, anonymized data may be used for model improvement
• Personal identifying information is removed before any training use
• You can opt out of training data usage in your settings`,
	},
	{
		icon: Share2,
		title: "4. Information Sharing",
		content: `We do not sell your personal information. We may share data with:

Service Providers:
• Cloud hosting (Vercel, Supabase)
• AI model providers (OpenRouter)
• Analytics services

Legal Requirements:
• When required by law
• To protect our rights
• In response to valid legal requests

Business Transfers:
• In connection with mergers or acquisitions
• With your consent`,
	},
	{
		icon: Lock,
		title: "5. Data Security",
		content: `We implement industry-standard security measures:

Technical Safeguards:
• Encryption in transit (TLS/SSL)
• Encryption at rest for sensitive data
• Secure authentication protocols

Organizational Measures:
• Access controls and authentication
• Regular security audits
• Employee training on data protection

Incident Response:
• Monitoring for security threats
• Incident response procedures
• Breach notification protocols`,
	},
	{
		icon: UserCheck,
		title: "6. Your Rights",
		content: `You have the following rights regarding your data:

Access & Portability:
• Request a copy of your data
• Export your conversations and documents
• Receive data in a portable format

Correction & Deletion:
• Update inaccurate information
• Request deletion of your data
• Clear conversation history

Control:
• Manage marketing preferences
• Opt out of certain data uses
• Withdraw consent at any time`,
	},
	{
		icon: Globe,
		title: "7. International Transfers",
		content: `Your information may be transferred internationally:

Data Locations:
• Our servers are located in the United States
• We use global service providers

Safeguards:
• Standard contractual clauses
• Privacy Shield certification where applicable
• Adequate protection measures

GDPR Compliance:
• For EU residents, we comply with GDPR requirements
• You may contact our Data Protection Officer
• You have the right to lodge complaints with supervisory authorities`,
	},
	{
		icon: Clock,
		title: "8. Data Retention",
		content: `We retain your information based on:

Active Accounts:
• Account data retained while account is active
• Conversation history retained per your preferences
• Documents retained until you delete them

After Deletion:
• Data removed within 30 days of account deletion
• Backups purged within 90 days
• Anonymized data may be retained for analytics

Legal Requirements:
• Some data may be retained longer for legal compliance
• Financial records as required by law`,
	},
	{
		icon: Shield,
		title: "9. Children's Privacy",
		content: `Our Service is not intended for children under 13:

Age Restrictions:
• You must be 13 or older to use our Service
• We do not knowingly collect data from children

Parental Rights:
• Parents may contact us about children's data
• We will delete any data collected from children

If you believe we have collected information from a child under 13, please contact us immediately.`,
	},
];

export default function PrivacyPage() {
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
							<Shield className="size-8 text-white" />
						</div>
						<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							Privacy Policy
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
							At AI Boss Brainz, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI Executive Team platform. Please read this policy carefully.
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
									If you have questions about this Privacy Policy or our data practices, please contact us at{" "}
									<a
										href="mailto:privacy@bossybrainz.ai"
										className="font-medium text-red-600 hover:underline dark:text-red-400"
									>
										privacy@bossybrainz.ai
									</a>
								</p>
							</div>
						</div>
					</motion.div>

					{/* Updates Notice */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.7 }}
						className="mt-8 rounded-2xl border border-border/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-neutral-900/80 sm:p-8"
					>
						<div className="flex items-start gap-4">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
								<Clock className="size-5 text-amber-600 dark:text-amber-400" />
							</div>
							<div>
								<h2 className="mb-2 text-lg font-semibold text-foreground">
									Changes to This Policy
								</h2>
								<p className="text-muted-foreground">
									We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
								</p>
							</div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
