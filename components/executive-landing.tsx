import { motion } from "framer-motion";
import { Brain, Crown, UserRound, Users } from "lucide-react";
import Image from "next/image";
import { BOT_PERSONALITIES, type BotType } from "@/lib/bot-personalities";
import { cn } from "@/lib/utils";

type ExecutiveLandingProps = {
	selectedBot: BotType;
	onSelect: (bot: BotType) => void;
	className?: string;
};

const executives: { key: BotType; icon: typeof Crown }[] = [
	{ key: "alexandria", icon: Crown },
	{ key: "kim", icon: UserRound },
	{ key: "collaborative", icon: Users },
];

export function ExecutiveLanding({
	selectedBot,
	onSelect,
	className,
}: ExecutiveLandingProps) {
	return (
		<section
			className={cn(
				"relative flex h-full flex-col items-center justify-center overflow-hidden bg-background px-3 py-3 sm:px-6 sm:py-8",
				className,
			)}
		>
			{/* Subtle background pattern */}
			<div className="pointer-events-none absolute inset-0 opacity-[0.02]">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.3) 1px, transparent 0)",
						backgroundSize: "32px 32px",
					}}
				/>
			</div>

			{/* Ambient red glow */}
			<div className="pointer-events-none absolute top-1/4 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />

			<div className="relative z-10 w-full max-w-3xl space-y-4 text-center sm:space-y-8">
				{/* Logo/Brand Header */}
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="space-y-2 sm:space-y-3"
					initial={{ opacity: 0, y: 15 }}
					transition={{ duration: 0.5 }}
				>
					<div className="mx-auto flex items-center justify-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-xl border-2 border-red-500 bg-transparent sm:size-12">
							<Brain className="size-4 text-red-500 sm:size-6" />
						</div>
					</div>
					<h1 className="red-text font-bold text-xl tracking-tight sm:text-3xl lg:text-4xl">
						Your AI Boss Brainz
					</h1>
					<p className="mx-auto max-w-md text-xs text-muted-foreground sm:text-base">
						Strategic intelligence powered by Alexandria & Kim
					</p>
				</motion.div>

				{/* Executive Selection Cards */}
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="grid grid-cols-3 gap-2 sm:gap-4"
					initial={{ opacity: 0, y: 15 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					{executives.map(({ key, icon: Icon }) => {
						const personality = BOT_PERSONALITIES[key];
						const isSelected = selectedBot === key;
						return (
							<motion.button
								className={cn(
									"group relative flex flex-col items-center rounded-xl border-2 p-2 text-center transition-all duration-300 sm:rounded-2xl sm:p-5",
									isSelected
										? "border-red-500/50 bg-gradient-to-b from-neutral-950/30 to-neutral-900/10 shadow-xl shadow-red-500/20"
										: "border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/10",
								)}
								key={key}
								onClick={() => onSelect(key)}
								transition={{ type: "spring", stiffness: 400, damping: 25 }}
								whileHover={{ scale: 1.015, y: -3 }}
								whileTap={{ scale: 0.985 }}
							>
								{/* Avatar */}
								<div className="relative mb-2 sm:mb-3">
									{personality.avatar ? (
										<Image
											alt={personality.name}
											className={cn(
												"size-10 rounded-full border-2 object-cover transition-all sm:size-16 lg:size-18",
												isSelected
													? "border-red-500 shadow-md shadow-red-500/30"
													: "border-white/20",
											)}
											height={72}
											src={personality.avatar}
											width={72}
										/>
									) : (
										<div
											className={cn(
												"flex size-10 items-center justify-center rounded-full transition-all sm:size-16 lg:size-18",
												isSelected
													? "red-gradient text-black shadow-md shadow-red-500/30"
													: "bg-white/10 text-muted-foreground",
											)}
										>
											<Icon className="size-5 sm:size-7" />
										</div>
									)}
									{isSelected && (
										<motion.div
											animate={{ scale: 1 }}
											className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full red-gradient shadow-sm shadow-red-500/30 sm:size-6"
											initial={{ scale: 0 }}
										>
											<svg
												className="size-2.5 text-black sm:size-3.5"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													d="M5 13l4 4L19 7"
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={3}
												/>
											</svg>
										</motion.div>
									)}
								</div>

								{/* Name */}
								<h3
									className={cn(
										"font-semibold text-xs transition-colors sm:text-base px-2 py-0.5 rounded-lg border sm:px-3 sm:py-1",
										isSelected ? "text-red-400 border-red-500/30" : "text-foreground border-zinc-200",
									)}
								>
									{key === "collaborative"
										? "Both"
										: personality.name.split(" ")[0]}
								</h3>
							</motion.button>
						);
					})}
				</motion.div>

				</div>
		</section>
	);
}
