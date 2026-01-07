import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://aleccimedia.vercel.app";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/chat/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
