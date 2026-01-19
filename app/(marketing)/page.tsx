import { getLandingPageContent } from "@/lib/cms/landing-page";
import { LandingPageClient } from "./landing-page-client";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const content = await getLandingPageContent();

  return <LandingPageClient content={content} />;
}
