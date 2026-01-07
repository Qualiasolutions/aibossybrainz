import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Terms of Service | Alecci Media AI",
	description:
		"Terms of Service for Alecci Media AI - Your AI-powered executive consultants",
};

export default function TermsOfServicePage() {
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
					Terms of Service
				</h1>

				<div className="prose prose-neutral dark:prose-invert max-w-none">
					<p className="text-muted-foreground text-lg mb-8">
						Last updated: January 5, 2026
					</p>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							1. Agreement to Terms
						</h2>
						<p>
							By accessing or using Alecci Media AI (&quot;Service&quot;), you
							agree to be bound by these Terms of Service (&quot;Terms&quot;).
							If you disagree with any part of these terms, you may not access
							the Service.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							2. Description of Service
						</h2>
						<p>
							Alecci Media AI provides AI-powered executive consultant personas
							(Alexandria and Kim) that assist users with business strategy,
							marketing, sales, and creative direction. The Service includes:
						</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>AI-powered conversational consulting</li>
							<li>Document and artifact generation</li>
							<li>Voice interaction capabilities</li>
							<li>Strategy templates and frameworks</li>
							<li>Export functionality for reports and documents</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
						<h3 className="text-xl font-medium mt-6 mb-3">
							3.1 Account Creation
						</h3>
						<p>
							You must create an account to use certain features of the Service.
							You are responsible for maintaining the confidentiality of your
							account credentials.
						</p>

						<h3 className="text-xl font-medium mt-6 mb-3">
							3.2 Account Responsibilities
						</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>Provide accurate and complete information</li>
							<li>Maintain the security of your account</li>
							<li>Notify us immediately of any unauthorized access</li>
							<li>
								Accept responsibility for all activities under your account
							</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
						<p>You agree not to use the Service to:</p>
						<ul className="list-disc pl-6 space-y-2 mt-4">
							<li>Violate any applicable laws or regulations</li>
							<li>Infringe upon the rights of others</li>
							<li>Generate harmful, misleading, or malicious content</li>
							<li>Attempt to bypass security measures</li>
							<li>Interfere with the proper functioning of the Service</li>
							<li>
								Use automated systems to access the Service without permission
							</li>
							<li>Reverse engineer or attempt to extract source code</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							5. AI-Generated Content
						</h2>
						<h3 className="text-xl font-medium mt-6 mb-3">
							5.1 Nature of AI Output
						</h3>
						<p>
							The AI executives (Alexandria and Kim) provide suggestions and
							recommendations based on their training. Their output should be
							considered as advisory only and not as professional advice.
						</p>

						<h3 className="text-xl font-medium mt-6 mb-3">
							5.2 Content Ownership
						</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								You retain ownership of content you input into the Service
							</li>
							<li>
								AI-generated artifacts and documents are licensed to you for use
							</li>
							<li>We may use anonymized data to improve our AI models</li>
						</ul>

						<h3 className="text-xl font-medium mt-6 mb-3">
							5.3 Accuracy Disclaimer
						</h3>
						<p>
							While we strive for accuracy, AI-generated content may contain
							errors or inconsistencies. You are responsible for reviewing and
							verifying all output before acting upon it.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							6. Intellectual Property
						</h2>
						<p>
							The Service, including its original content, features, and
							functionality, is owned by Alecci Media and protected by
							international copyright, trademark, and other intellectual
							property laws.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">7. Payment Terms</h2>
						<h3 className="text-xl font-medium mt-6 mb-3">
							7.1 Subscription Plans
						</h3>
						<p>
							Certain features may require a paid subscription. Pricing and
							features are subject to change with notice.
						</p>

						<h3 className="text-xl font-medium mt-6 mb-3">7.2 Billing</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>Subscriptions are billed in advance on a recurring basis</li>
							<li>
								You authorize us to charge your payment method automatically
							</li>
							<li>Refunds are handled on a case-by-case basis</li>
						</ul>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							8. Limitation of Liability
						</h2>
						<p>
							To the maximum extent permitted by law, Alecci Media shall not be
							liable for any indirect, incidental, special, consequential, or
							punitive damages, including loss of profits, data, or business
							opportunities, arising from your use of the Service.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							9. Disclaimer of Warranties
						</h2>
						<p>
							The Service is provided &quot;as is&quot; and &quot;as
							available&quot; without warranties of any kind, either express or
							implied, including but not limited to implied warranties of
							merchantability, fitness for a particular purpose, and
							non-infringement.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
						<p>
							We may terminate or suspend your account and access to the Service
							immediately, without prior notice, for conduct that we believe
							violates these Terms or is harmful to other users, us, or third
							parties.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
						<p>
							These Terms shall be governed by and construed in accordance with
							the laws of the State of Delaware, United States, without regard
							to its conflict of law provisions.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							12. Changes to Terms
						</h2>
						<p>
							We reserve the right to modify these Terms at any time. We will
							notify users of any material changes by posting the new Terms on
							this page and updating the &quot;Last updated&quot; date.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
						<p>
							If you have questions about these Terms, please contact us at:
						</p>
						<p className="mt-4">
							<strong>Email:</strong>{" "}
							<a
								href="mailto:legal@aleccimedia.com"
								className="text-rose-500 hover:underline"
							>
								legal@aleccimedia.com
							</a>
						</p>
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
