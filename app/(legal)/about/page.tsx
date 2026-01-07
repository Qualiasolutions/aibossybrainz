import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "About Us | Alecci Media AI",
	description:
		"Learn about Alecci Media AI - Your AI-powered executive consultants Alexandria and Kim",
};

export default function AboutPage() {
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
					About Alecci Media AI
				</h1>

				<div className="prose prose-neutral dark:prose-invert max-w-none">
					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
						<p className="text-lg text-muted-foreground">
							Alecci Media AI reimagines business consulting by putting
							world-class executive expertise at your fingertips. We believe
							that every entrepreneur and business leader deserves access to
							strategic guidance that was once reserved for Fortune 500
							companies.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							Meet Your Executive Team
						</h2>

						<div className="grid md:grid-cols-2 gap-8 mt-6">
							<div className="p-6 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20">
								<div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
									A
								</div>
								<h3 className="text-xl font-semibold mb-2 text-rose-400">
									Alexandria
								</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Chief Creative & Brand Strategist
								</p>
								<p>
									Alexandria brings visionary creativity and brand expertise to
									every conversation. She specializes in brand identity,
									creative campaigns, content strategy, and turning complex
									ideas into compelling narratives that resonate with audiences.
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="px-2 py-1 text-xs rounded-full bg-rose-500/20 text-rose-400">
										Brand Strategy
									</span>
									<span className="px-2 py-1 text-xs rounded-full bg-rose-500/20 text-rose-400">
										Creative Direction
									</span>
									<span className="px-2 py-1 text-xs rounded-full bg-rose-500/20 text-rose-400">
										Content
									</span>
								</div>
							</div>

							<div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
								<div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
									K
								</div>
								<h3 className="text-xl font-semibold mb-2 text-blue-400">
									Kim
								</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Chief Revenue & Growth Officer
								</p>
								<p>
									Kim drives results with data-driven strategies and relentless
									focus on growth. She specializes in sales optimization,
									revenue strategies, market analysis, and building scalable
									systems that turn prospects into loyal customers.
								</p>
								<div className="mt-4 flex flex-wrap gap-2">
									<span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
										Sales Strategy
									</span>
									<span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
										Revenue Growth
									</span>
									<span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
										Analytics
									</span>
								</div>
							</div>
						</div>

						<div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-600/5 border border-purple-500/20">
							<h3 className="text-xl font-semibold mb-2 text-purple-400">
								Collaborative Mode
							</h3>
							<p>
								When you need both perspectives, engage Collaborative Mode.
								Alexandria and Kim work together, debating strategies, combining
								creativity with analytics, and delivering comprehensive
								solutions that leverage both of their unique strengths.
							</p>
						</div>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
						<div className="grid sm:grid-cols-2 gap-4 mt-6">
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">Strategic Consulting</h4>
								<p className="text-sm text-muted-foreground">
									Get expert advice on branding, marketing, sales, and business
									growth strategies.
								</p>
							</div>
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">Document Generation</h4>
								<p className="text-sm text-muted-foreground">
									Create professional reports, presentations, and strategic
									documents instantly.
								</p>
							</div>
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">Voice Conversations</h4>
								<p className="text-sm text-muted-foreground">
									Speak directly with your AI executives for a more natural
									consulting experience.
								</p>
							</div>
							<div className="p-4 rounded-lg bg-muted/50">
								<h4 className="font-medium mb-2">Strategy Templates</h4>
								<p className="text-sm text-muted-foreground">
									Access proven frameworks and templates used by leading
									businesses worldwide.
								</p>
							</div>
						</div>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
						<p>
							Alecci Media AI is powered by state-of-the-art large language
							models, fine-tuned specifically for business consulting scenarios.
							Our executives are designed to understand context, remember your
							preferences, and provide increasingly personalized advice over
							time.
						</p>
						<p className="mt-4">
							We prioritize security and privacy, ensuring your business
							conversations and strategic documents remain confidential and
							protected.
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-2xl font-semibold mb-4">
							Built by Qualia Solutions
						</h2>
						<p>
							Alecci Media AI is a product of{" "}
							<a
								href="https://qualiasolutions.net"
								target="_blank"
								rel="noopener noreferrer"
								className="text-rose-500 hover:underline"
							>
								Qualia Solutions
							</a>
							, a company specializing in AI-powered applications, voice agents,
							and modern web development. We build intelligent solutions that
							transform how businesses operate.
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
							href="/terms"
							className="hover:text-foreground transition-colors"
						>
							Terms of Service
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
