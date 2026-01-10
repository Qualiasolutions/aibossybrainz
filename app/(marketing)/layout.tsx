"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/contact", label: "Contact" },
];

function Header() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.nav
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/80 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-xl dark:bg-black/80 sm:px-6"
				>
					{/* Logo */}
					<Link href="/" className="flex items-center">
						<img
							src="/images/AM_Logo_Horizontal_4C+(1).webp"
							alt="AI Boss Brainz"
							className="h-8 w-auto sm:h-10"
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden items-center gap-1 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"relative px-4 py-2 text-sm font-medium transition-colors",
									pathname === link.href
										? "text-red-600"
										: "text-muted-foreground hover:text-foreground"
								)}
							>
								{link.label}
								{pathname === link.href && (
									<motion.div
										layoutId="nav-indicator"
										className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-red-600 to-red-700"
									/>
								)}
							</Link>
						))}
					</div>

					{/* CTA Buttons */}
					<div className="flex items-center gap-2 sm:gap-3">
						<Link href="/login" className="hidden sm:block">
							<Button variant="ghost" size="sm" className="text-muted-foreground">
								Sign In
							</Button>
						</Link>
						<Link href="/login">
							<Button size="sm" className="shadow-lg shadow-red-500/20">
								Get Started
							</Button>
						</Link>

						{/* Mobile Menu Button */}
						<button
							type="button"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
						>
							<svg
								className="size-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{mobileMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</motion.nav>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/95 shadow-xl backdrop-blur-xl dark:bg-black/95 md:hidden"
					>
						<div className="flex flex-col p-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										"rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
										pathname === link.href
											? "bg-red-50 text-red-600 dark:bg-red-950/50"
											: "text-muted-foreground hover:bg-muted hover:text-foreground"
									)}
								>
									{link.label}
								</Link>
							))}
							<Link
								href="/login"
								onClick={() => setMobileMenuOpen(false)}
								className="mt-1 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								Sign In
							</Link>
						</div>
					</motion.div>
				)}
			</div>
		</header>
	);
}

function Footer() {
	return (
		<footer className="border-t border-border/50 bg-muted/30">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<Link href="/" className="flex items-center">
							<img
								src="/images/AM_Logo_Horizontal_4C+(1).webp"
								alt="AI Boss Brainz"
								className="h-8 w-auto"
							/>
						</Link>
						<p className="mt-4 max-w-xs text-sm text-muted-foreground">
							Executive consulting for sales and marketing strategy.
							Available 24/7.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="mb-4 font-semibold text-sm text-foreground">
							Quick Links
						</h4>
						<ul className="space-y-2.5">
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="mb-4 font-semibold text-sm text-foreground">Legal</h4>
						<ul className="space-y-2.5">
							<li>
								<Link
									href="/terms"
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									Privacy Policy
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h4 className="mb-4 font-semibold text-sm text-foreground">
							Contact
						</h4>
						<ul className="space-y-2.5">
							<li>
								<a
									href="mailto:hello@bossybrainz.ai"
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									hello@bossybrainz.ai
								</a>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									Contact Form
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} AI Boss Brainz. All rights reserved.
					</p>
					<div className="flex gap-4">
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							<svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground transition-colors hover:text-foreground"
						>
							<svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
