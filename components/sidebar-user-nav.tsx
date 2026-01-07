"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { guestRegex } from "@/lib/constants";
import { LoaderIcon } from "./icons";

export function SidebarUserNav({ user }: { user: User }) {
	const router = useRouter();
	const supabase = createClient();
    // Assuming user is always provided if rendered, or we handle null.
    // Assuming loading state is handled by parent or suspense.
    const isLoading = false; // Simplified for now since we rely on passed user prop

	const isGuest = guestRegex.test(user?.email ?? "");

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/login");
    };

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
					    <SidebarMenuButton
                            className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            data-testid="user-nav-button"
                        >
                            <Image
                                alt={user.email ?? "User Avatar"}
                                className="rounded-full"
                                height={24}
                                src={`https://avatar.vercel.sh/${user.email}`}
                                width={24}
                            />
                            <span className="truncate" data-testid="user-email">
                                {isGuest ? "Guest" : user?.email}
                            </span>
                            <ChevronUp className="ml-auto" />
                        </SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-popper-anchor-width)"
						data-testid="user-nav-menu"
						side="top"
					>
						<DropdownMenuItem asChild data-testid="user-nav-item-auth">
							<button
								className="w-full cursor-pointer"
								onClick={() => {
									if (isGuest) {
										router.push("/login");
									} else {
										handleSignOut();
									}
								}}
								type="button"
							>
								{isGuest ? "Login to your account" : "Sign out"}
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
