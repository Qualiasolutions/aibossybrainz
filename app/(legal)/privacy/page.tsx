import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Privacy Policy | Alecci Media AI",
	description:
		"Privacy Policy for Alecci Media AI - Your AI-powered executive consultants",
};

export default function PrivacyPolicyPage() {
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
					Privacy Policy
				</h1>

				<div className="prose prose-neutral dark:prose-invert max-w-none">
					<p className="text-muted-foreground text-lg mb-8">
						Last updated: January 5, 2026
					</p>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
						<p>
							Welcome to Alecci Media AI (&quot;we,&quot; &quot;our,&quot; or
							&quot;us&quot;). We respect your privacy and are committed to
							protecting your personal data. This privacy policy explains how we
							collect, use, disclose, and safeguard your information when you
							use our AI-powered executive consultant platform.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							2. Information We Collect
						</h2>
						<h3 className="text-xl font-medium mt-6 mb-3">
							2.1 Personal Information
						</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>Email address (when you create an account)</li>
							<li>Account preferences and settings</li>
							<li>Usage data and analytics</li>
						</ul>

						<h3 className="text-xl font-medium mt-6 mb-3">
							2.2 Conversation Data
						</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>Messages exchanged with our AI executives</li>
							<li>Documents and artifacts created during sessions</li>
							<li>Voice recordings (if voice features are used)</li>
						</ul>

						<h3 className="text-xl font-medium mt-6 mb-3">
							2.3 Technical Information
						</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>IP address and geolocation (approximate)</li>
							<li>Browser type and device information</li>
							<li>Usage patterns and feature interactions</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							3. How We Use Your Information
						</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>Provide and maintain our AI consulting services</li>
							<li>
								Personalize your experience with our executive AI personalities
							</li>
							<li>Improve our AI models and service quality</li>
							<li>Send important service updates and notifications</li>
							<li>Analyze usage patterns to enhance features</li>
							<li>Ensure security and prevent fraud</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
						<p>
							We implement industry-standard security measures to protect your
							data, including:
						</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>Encryption of data in transit and at rest</li>
							<li>Secure authentication mechanisms</li>
							<li>Regular security audits and updates</li>
							<li>Access controls and monitoring</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
						<p>
							We retain your conversation history and account data for as long
							as your account is active or as needed to provide you services.
							You can request deletion of your data at any time by contacting
							us.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							6. Third-Party Services
						</h2>
						<p>
							We use the following third-party services to provide our platform:
						</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>OpenRouter (AI model provider)</li>
							<li>Vercel (hosting and infrastructure)</li>
							<li>ElevenLabs (voice synthesis)</li>
						</ul>
						<p className="mt-4">
							Each of these providers has their own privacy policies governing
							their use of data.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
						<p>You have the right to:</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>Access your personal data</li>
							<li>Correct inaccurate data</li>
							<li>Request deletion of your data</li>
							<li>Export your conversation history</li>
							<li>Opt-out of non-essential communications</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
						<p>
							If you have questions about this Privacy Policy or our data
							practices, please contact us at:
						</p>
						<p className="mt-4">
							<strong>Email:</strong>{" "}
							<a
								href="mailto:privacy@aleccimedia.com"
								className="text-rose-500 hover:underline"
							>
								privacy@aleccimedia.com
							</a>
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							9. Changes to This Policy
						</h2>
						<p>
							We may update this Privacy Policy from time to time. We will
							notify you of any changes by posting the new Privacy Policy on
							this page and updating the &quot;Last updated&quot; date.
						</p>
					</section>
				</div>

				<div className="mt-12 pt-8 border-t border-border">
					<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
						<Link
							href="/contact"
							className="hover:text-foreground transition-colors"
						>
							Contact
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
