import Script from "next/script";
import { AppSidebar } from "@/components/app-sidebar";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { MobileSidebarProvider } from "@/components/mobile-sidebar-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TosPopup } from "@/components/tos-popup";
import { WelcomeTutorial } from "@/components/welcome-tutorial";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Check if user is admin
	let isAdmin = false;
	if (user) {
		const serviceClient = createServiceClient();
		const { data: userData } = await serviceClient
			.from("User")
			.select("isAdmin")
			.eq("id", user.id)
			.single();
		isAdmin = userData?.isAdmin === true;
	}

	return (
		<>
			<Script
				src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
				strategy="lazyOnload"
			/>
			<TosPopup />
			<WelcomeTutorial />
			<DataStreamProvider>
				<MobileSidebarProvider>
					<SidebarProvider defaultOpen={true}>
						<AppSidebar user={user || undefined} isAdmin={isAdmin} />
						<SidebarInset>{children}</SidebarInset>
					</SidebarProvider>
				</MobileSidebarProvider>
			</DataStreamProvider>
		</>
	);
}
