import { Crown, Mail, Target, TrendingUp, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BOT_PERSONALITIES } from "@/lib/bot-personalities";

export default function ExecutivesPage() {
	const alexandria = BOT_PERSONALITIES.alexandria;
	const kim = BOT_PERSONALITIES.kim;

	return (
		<div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
			{/* Header */}
			<header className="border-white/20 border-b bg-white/80 backdrop-blur-xl">
				<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<Link href="/">
							<img
								alt="Alecci Media Logo"
								className="h-8 w-auto object-contain sm:h-10"
								src="https://images.squarespace-cdn.com/content/v1/5ea759fa9e5575487ad28cd0/1591228238957-80Y8AGN1M9TTXTYNJ5QK/AM_Logo_Horizontal_4C+%281%29.jpg?format=1500w"
							/>
						</Link>
						<Link href="/">
							<Button className="text-sm sm:text-base" variant="outline">
								Back to Chat
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="py-12 sm:py-16 lg:py-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h1 className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text font-bold text-4xl text-transparent sm:text-5xl lg:text-6xl">
							Meet Your Executive Team
						</h1>
						<p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl">
							AI-powered strategic guidance from seasoned marketing and sales
							executives
						</p>
					</div>
				</div>
			</section>

			{/* Executive Profiles */}
			<section className="pb-12 sm:pb-16 lg:pb-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
						{/* Alexandria Alecci */}
						<Card className="overflow-hidden border-0 bg-gradient-to-br from-white via-rose-50/30 to-white shadow-xl">
							<CardContent className="p-6 sm:p-8 lg:p-10">
								<div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
									<div className="relative mb-6 flex-shrink-0 sm:mr-6 sm:mb-0">
										<div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-rose-400 to-orange-400 opacity-20 blur-xl" />
										<Image
											alt={alexandria.name}
											className="relative rounded-full border-4 border-white shadow-2xl"
											height={160}
											src={alexandria.avatar!}
											width={160}
										/>
										<div className="-bottom-3 -right-3 absolute flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg">
											<Crown className="h-6 w-6 text-white" />
										</div>
									</div>

									<div className="flex-1">
										<h2 className="font-bold text-2xl text-slate-900 sm:text-3xl">
											{alexandria.name}
										</h2>
										<p className="mt-1 font-semibold text-base text-rose-600 sm:text-lg">
											{alexandria.role}
										</p>
										<p className="mt-4 text-slate-600 text-sm leading-relaxed sm:text-base">
											{alexandria.personality}
										</p>
									</div>
								</div>

								<div className="mt-8">
									<h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700 text-sm uppercase tracking-wide sm:text-base">
										<Target className="h-4 w-4 text-rose-500 sm:h-5 sm:w-5" />
										Core Expertise
									</h3>
									<div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
										{alexandria.expertise.map((item, index) => (
											<div
												className="flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-left text-slate-700 text-sm shadow-sm"
												key={index}
											>
												<span className="mt-1.5 inline-block size-2 flex-shrink-0 rounded-full bg-rose-500" />
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>

								<div className="mt-6">
									<Link href="/">
										<Button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 sm:w-auto">
											<Mail className="mr-2 h-4 w-4" />
											Consult with Alexandria
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>

						{/* Kim Mylls */}
						<Card className="overflow-hidden border-0 bg-gradient-to-br from-white via-blue-50/30 to-white shadow-xl">
							<CardContent className="p-6 sm:p-8 lg:p-10">
								<div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
									<div className="relative mb-6 flex-shrink-0 sm:mr-6 sm:mb-0">
										<div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-xl" />
										<Image
											alt={kim.name}
											className="relative rounded-full border-4 border-white shadow-2xl"
											height={160}
											src={kim.avatar!}
											width={160}
										/>
										<div className="-bottom-3 -right-3 absolute flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg">
											<TrendingUp className="h-6 w-6 text-white" />
										</div>
									</div>

									<div className="flex-1">
										<h2 className="font-bold text-2xl text-slate-900 sm:text-3xl">
											{kim.name}
										</h2>
										<p className="mt-1 font-semibold text-base text-blue-600 sm:text-lg">
											{kim.role}
										</p>
										<p className="mt-4 text-slate-600 text-sm leading-relaxed sm:text-base">
											{kim.personality}
										</p>
									</div>
								</div>

								<div className="mt-8">
									<h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700 text-sm uppercase tracking-wide sm:text-base">
										<Target className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />
										Core Expertise
									</h3>
									<div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
										{kim.expertise.map((item, index) => (
											<div
												className="flex items-start gap-2 rounded-lg bg-blue-50 px-3 py-2 text-left text-slate-700 text-sm shadow-sm"
												key={index}
											>
												<span className="mt-1.5 inline-block size-2 flex-shrink-0 rounded-full bg-blue-500" />
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>

								<div className="mt-6">
									<Link href="/">
										<Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 sm:w-auto">
											<Mail className="mr-2 h-4 w-4" />
											Consult with Kim
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Collaborative Section */}
					<Card className="mt-8 overflow-hidden border-0 bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 shadow-xl lg:mt-12">
						<CardContent className="p-6 text-center sm:p-8 lg:p-10">
							<div className="mx-auto max-w-3xl">
								<h2 className="font-bold text-2xl text-slate-900 sm:text-3xl lg:text-4xl">
									Get the Full Executive Perspective
								</h2>
								<p className="mt-4 text-slate-600 text-sm leading-relaxed sm:text-base lg:text-lg">
									Work with both Alexandria and Kim simultaneously for
									integrated marketing and sales strategies that drive growth.
									Get aligned insights from both perspectives in one
									conversation.
								</p>
								<Link href="/">
									<Button
										className="mt-6 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:via-purple-700 hover:to-indigo-700"
										size="lg"
									>
										Start Collaborative Session
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
