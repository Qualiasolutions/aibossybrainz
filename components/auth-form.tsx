import Form from "next/form";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function AuthForm({
	action,
	children,
	defaultEmail = "",
	className,
}: {
	action: NonNullable<
		string | ((formData: FormData) => void | Promise<void>) | undefined
	>;
	children: React.ReactNode;
	defaultEmail?: string;
	className?: string;
}) {
	return (
		<Form action={action} className={cn("flex flex-col gap-5", className)}>
			<div className="flex flex-col gap-2">
				<Label className="font-medium text-slate-600 text-sm" htmlFor="email">
					Work Email
				</Label>

				<Input
					autoComplete="email"
					autoFocus
					className="h-12 rounded-2xl border-transparent bg-white/80 px-4 text-base text-slate-700 shadow-[inset_0_2px_12px_rgba(244,114,182,0.12)] shadow-inner transition-all placeholder:text-slate-400 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-rose-400/60 md:text-sm"
					defaultValue={defaultEmail}
					id="email"
					name="email"
					placeholder="you@company.com"
					required
					type="email"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label
					className="font-medium text-slate-600 text-sm"
					htmlFor="password"
				>
					Password
				</Label>

				<Input
					autoComplete="current-password"
					className="h-12 rounded-2xl border-transparent bg-white/80 px-4 text-base text-slate-700 shadow-[inset_0_2px_12px_rgba(244,114,182,0.12)] shadow-inner transition-all focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-rose-400/60 md:text-sm"
					id="password"
					name="password"
					placeholder="********"
					required
					type="password"
				/>
			</div>

			{children}
		</Form>
	);
}
