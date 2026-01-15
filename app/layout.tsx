import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";


export const metadata: Metadata = {
	metadataBase: new URL("https://aleccinew.vercel.app"),
	title: {
		default: "AI Boss Brainz - Executive AI Consulting",
		template: "%s | AI Boss Brainz",
	},
	description:
		"Get strategic business guidance from AI executives Alexandria Alecci (CMO) and Kim Mylls (CSO). Professional AI consulting for marketing and sales strategy.",
	keywords: ["AI consulting", "marketing strategy", "sales strategy", "business AI", "executive coaching"],
	authors: [{ name: "Alecci Media" }, { name: "Qualia Solutions" }],
	creator: "Qualia Solutions",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://aleccinew.vercel.app",
		siteName: "AI Boss Brainz",
		title: "AI Boss Brainz - Executive AI Consulting",
		description: "Get strategic business guidance from AI executives Alexandria (CMO) and Kim (CSO).",
		images: [
			{
				url: "/opengraph-image.png",
				width: 1200,
				height: 630,
				alt: "AI Boss Brainz - Executive AI Consulting",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Boss Brainz - Executive AI Consulting",
		description: "Get strategic business guidance from AI executives Alexandria (CMO) and Kim (CSO).",
		images: ["/twitter-image.png"],
		creator: "@aleccimedia",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport = {
	maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist",
	adjustFontFallback: false,
	preload: false, // Disable preload to prevent browser warnings
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-mono",
	adjustFontFallback: false,
	preload: false, // Disable preload to prevent browser warnings
});

const LIGHT_THEME_COLOR = "hsl(0 0% 100%)";
const DARK_THEME_COLOR = "hsl(240deg 10% 3.92%)";
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={`${geist.variable} ${geistMono.variable}`}
			// `next-themes` injects an extra classname to the body element to avoid
			// visual flicker before hydration. Hence the `suppressHydrationWarning`
			// prop is necessary to avoid the React hydration mismatch warning.
			// https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
			lang="en"
			suppressHydrationWarning
		>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: "Required"
					dangerouslySetInnerHTML={{
						__html: THEME_COLOR_SCRIPT,
					}}
				/>
			</head>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
					enableSystem={false}
				>
					<Toaster position="top-center" />
					{children}
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
