import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Contact Us | Alecci Media AI",
	description:
		"Get in touch with the Alecci Media AI team - We're here to help",
};

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
			<div className="container mx-auto max-w-4xl px-4 py-16">
				<Link
					href="/"
					className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<span>&larr;</span>
					<span>Back to Home</span>
				</Link>

				<h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
					Contact Us
				</h1>

				<div className="prose prose-neutral dark:prose-invert max-w-none">
					<p className="text-lg text-muted-foreground mb-8">
						Have questions, feedback, or need assistance? We&apos;d love to hear
						from you. Choose the best way to reach us below.
					</p>

					<div className="grid md:grid-cols-2 gap-8 mb-12">
						<div className="p-6 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20">
							<div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-rose-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
							<p className="text-sm text-muted-foreground mb-4">
								For general questions about Alecci Media AI, partnerships, or
								media inquiries.
							</p>
							<a
								href="mailto:hello@aleccimedia.com"
								className="text-rose-400 hover:text-rose-300 hover:underline font-medium"
							>
								hello@aleccimedia.com
							</a>
						</div>

						<div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
							<div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-blue-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">Technical Support</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Need help with your account, features, or experiencing technical
								issues?
							</p>
							<a
								href="mailto:support@aleccimedia.com"
								className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
							>
								support@aleccimedia.com
							</a>
						</div>

						<div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
							<div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-green-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">Enterprise & Sales</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Interested in enterprise solutions, custom integrations, or
								volume licensing?
							</p>
							<a
								href="mailto:enterprise@aleccimedia.com"
								className="text-green-400 hover:text-green-300 hover:underline font-medium"
							>
								enterprise@aleccimedia.com
							</a>
						</div>

						<div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
							<div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-purple-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-semibold mb-2">Privacy & Legal</h3>
							<p className="text-sm text-muted-foreground mb-4">
								Data privacy requests, legal inquiries, or compliance questions.
							</p>
							<a
								href="mailto:legal@aleccimedia.com"
								className="text-purple-400 hover:text-purple-300 hover:underline font-medium"
							>
								legal@aleccimedia.com
							</a>
						</div>
					</div>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Response Times</h2>
						<div className="rounded-lg bg-muted/50 p-4">
							<ul className="space-y-2 text-sm">
								<li className="flex justify-between">
									<span>General Inquiries</span>
									<span className="text-muted-foreground">
										Within 24-48 hours
									</span>
								</li>
								<li className="flex justify-between">
									<span>Technical Support</span>
									<span className="text-muted-foreground">
										Within 12-24 hours
									</span>
								</li>
								<li className="flex justify-between">
									<span>Enterprise Sales</span>
									<span className="text-muted-foreground">
										Within 4-8 hours
									</span>
								</li>
								<li className="flex justify-between">
									<span>Privacy/Legal</span>
									<span className="text-muted-foreground">
										Within 48-72 hours
									</span>
								</li>
							</ul>
						</div>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
						<div className="flex flex-wrap gap-4">
							<a
								href="https://twitter.com/aleccimedia"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
								<span>Twitter/X</span>
							</a>
							<a
								href="https://linkedin.com/company/aleccimedia"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
								<span>LinkedIn</span>
							</a>
						</div>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							Frequently Asked Questions
						</h2>
						<div className="space-y-4">
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">
									How do I reset my password?
								</h4>
								<p className="text-sm text-muted-foreground">
									Click &quot;Forgot Password&quot; on the login page and follow
									the instructions sent to your email.
								</p>
							</div>
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">
									Can I export my conversation history?
								</h4>
								<p className="text-sm text-muted-foreground">
									Yes! Go to Chat History and use the export feature to download
									your conversations.
								</p>
							</div>
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">Is my data secure?</h4>
								<p className="text-sm text-muted-foreground">
									Absolutely. We use industry-standard encryption and security
									practices. See our{" "}
									<Link
										href="/privacy"
										className="text-rose-400 hover:underline"
									>
										Privacy Policy
									</Link>{" "}
									for details.
								</p>
							</div>
						</div>
					</section>
				</div>

				<div className="mt-12 pt-8 border-t border-border">
					<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
						<Link
							href="/privacy"
							className="hover:text-foreground transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-foreground transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							href="/about"
							className="hover:text-foreground transition-colors"
						>
							About Us
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
