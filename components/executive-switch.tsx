"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Crown, Sparkles, UserRound, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BOT_PERSONALITIES, type BotType } from "@/lib/bot-personalities";
import { cn } from "@/lib/utils";

interface ExecutiveSwitchProps {
	selectedExecutive: BotType;
	onExecutiveChange: (executive: BotType) => void;
	disabled?: boolean;
}

const getExecutiveIcon = (
	executive: BotType,
	size: "sm" | "md" | "lg" = "md",
) => {
	const personality = BOT_PERSONALITIES[executive];
	const sizeClasses = {
		sm: "size-6",
		md: "size-10",
		lg: "size-16",
	};
	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	const iconClass = cn(
		"overflow-hidden rounded-full border-2 border-white/50 shadow-lg transition-all duration-300",
		sizeClasses[size],
	);

	// If avatar exists, use it
	if (personality.avatar) {
		return (
			<motion.div
				className={iconClass}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<Image
					alt={`${personality.name} avatar`}
					className="size-full object-cover"
					height={size === "sm" ? 24 : size === "md" ? 40 : 64}
					src={personality.avatar}
					width={size === "sm" ? 24 : size === "md" ? 40 : 64}
				/>
			</motion.div>
		);
	}

	// Fallback to icons if no avatar
	switch (personality.icon) {
		case "Crown":
			return (
				<motion.div
					className={cn(
						iconClass,
						"flex items-center justify-center bg-gradient-to-br from-rose-400 to-red-600 text-white",
					)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<Crown className={iconSizes[size]} />
				</motion.div>
			);
		case "UserRound":
			return (
				<motion.div
					className={cn(
						iconClass,
						"flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 text-white",
					)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<UserRound className={iconSizes[size]} />
				</motion.div>
			);
		case "Users":
			return (
				<motion.div
					className={cn(
						iconClass,
						"flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-700 text-white",
					)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<Users className={iconSizes[size]} />
				</motion.div>
			);
		default:
			return (
				<motion.div
					className={cn(
						iconClass,
						"flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700 text-white",
					)}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<UserRound className={iconSizes[size]} />
				</motion.div>
			);
	}
};

export function ExecutiveSwitch({
	selectedExecutive,
	onExecutiveChange,
	disabled = false,
}: ExecutiveSwitchProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	// Close modal on ESC key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleExecutiveSelect = (executive: BotType) => {
		onExecutiveChange(executive);
		setIsOpen(false);
	};

	const selectedPersonality = BOT_PERSONALITIES[selectedExecutive];
	const otherExecutives = Object.entries(BOT_PERSONALITIES).filter(
		([key]) => key !== selectedExecutive,
	);

	return (
		<div className="relative">
			<Button
				className={cn(
					"group relative flex h-11 items-center gap-3 rounded-xl border-2 border-stone-200 bg-white px-4 text-left shadow-sm transition-all duration-200 sm:h-12 sm:gap-4 sm:px-5",
					"hover:border-rose-300 hover:shadow-md",
					"focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2",
					disabled && "cursor-not-allowed opacity-60",
				)}
				disabled={disabled}
				onClick={() => setIsOpen(!isOpen)}
				variant="outline"
			>
				<div className="flex items-center gap-3 sm:gap-4">
					<motion.div
						animate={{ scale: 1 }}
						className="flex-shrink-0"
						initial={{ scale: 0.8 }}
						key={selectedExecutive}
						transition={{ type: "spring", stiffness: 260, damping: 26 }}
					>
						{getExecutiveIcon(selectedExecutive, "sm")}
					</motion.div>

					<div className="flex flex-col">
						<span className="font-semibold text-sm text-stone-800 sm:text-base">
							{selectedPersonality.name.split(" ")[0]}
						</span>
						<span className="hidden text-stone-500 text-xs sm:block">
							{selectedPersonality.role.split("(")[0].trim()}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2 pl-2 sm:gap-3 sm:pl-4">
					<span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-700 text-xs sm:inline-flex">
						Active
					</span>

					<motion.div
						animate={{ rotate: isOpen ? 180 : 0 }}
						className="text-stone-400"
						transition={{ duration: 0.2 }}
					>
						<svg
							className="size-4 sm:size-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M19 9l-7 7-7-7"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
							/>
						</svg>
					</motion.div>
				</div>
			</Button>

			{/* Professional Modal Popup */}
			{mounted &&
				isOpen &&
				createPortal(
					<AnimatePresence>
						<div className="fixed inset-0 z-[99999]">
							{/* Modal Backdrop */}
							<motion.div
								animate={{ opacity: 1 }}
								className="absolute inset-0 bg-black/60 backdrop-blur-md"
								exit={{ opacity: 0 }}
								initial={{ opacity: 0 }}
								onClick={() => setIsOpen(false)}
								transition={{ duration: 0.3 }}
							/>

							{/* Modal Content */}
							<div className="absolute inset-0 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
								<motion.div
									animate={{ opacity: 1, scale: 1, y: 0 }}
									className="relative w-full max-w-4xl"
									exit={{ opacity: 0, scale: 0.95, y: 20 }}
									initial={{ opacity: 0, scale: 0.95, y: 20 }}
									transition={{
										duration: 0.4,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
								>
									{/* Modal Card */}
									<Card className="overflow-hidden border border-stone-200/60 bg-white shadow-2xl shadow-stone-200/50 backdrop-blur-xl">
										{/* Modal Header */}
										<div className="relative border-rose-100/40 border-b bg-gradient-to-r from-rose-50/80 via-white to-rose-50/80 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
											{/* Decorative Background */}
											<div className="absolute inset-0 bg-gradient-to-r from-rose-400/5 via-rose-400/10 to-rose-400/5" />

											<div className="relative z-10">
												<div className="flex items-start justify-between gap-3 sm:items-center">
													<div className="flex items-center gap-3 sm:gap-4">
														<div className="hidden sm:block">
															<Sparkles className="h-6 w-6 text-rose-500 sm:h-8 sm:w-8" />
														</div>
														<div>
															<h1 className="font-semibold text-lg text-stone-800 sm:text-2xl lg:text-3xl">
																Select Executive Advisor
															</h1>
															<p className="mt-1 text-sm text-stone-500 sm:mt-2 sm:text-base">
																Choose your AI consultant
															</p>
														</div>
													</div>

													{/* Close Button */}
													<Button
														className="h-9 w-9 flex-shrink-0 rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm transition-all duration-200 hover:bg-rose-50 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
														onClick={() => setIsOpen(false)}
														size="icon"
														variant="outline"
													>
														<svg
															className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																d="M6 18L18 6M6 6l12 12"
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
															/>
														</svg>
													</Button>
												</div>
											</div>
										</div>

										{/* Modal Body */}
										<div className="max-h-[60vh] overflow-y-auto p-4 sm:max-h-none sm:p-6 lg:p-8">
											<div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
												{/* Current Executive Section */}
												<div className="space-y-4 sm:space-y-6">
													<div className="flex items-center gap-2 sm:gap-3">
														<div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
														<div className="flex items-center gap-2">
															<Badge className="border-0 bg-rose-100 px-2 py-1 font-semibold text-rose-700 text-xs shadow-sm sm:px-3 sm:py-1.5 sm:text-sm">
																Active
															</Badge>
															<motion.div
																animate={{ scale: [1, 1.1, 1] }}
																className="h-2 w-2 rounded-full bg-rose-500 shadow sm:h-3 sm:w-3"
																transition={{
																	duration: 2,
																	repeat: Number.POSITIVE_INFINITY,
																}}
															/>
														</div>
														<div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
													</div>

													<motion.div
														animate={{ opacity: 1, x: 0 }}
														className="group"
														initial={{ opacity: 0, x: -20 }}
														transition={{ duration: 0.5 }}
													>
														<div className="rounded-2xl border border-stone-200/60 bg-gradient-to-br from-stone-50 via-white to-stone-50 p-4 shadow-sm transition-all duration-300 sm:rounded-3xl sm:p-6 lg:p-8">
															<div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
																<div className="relative flex-shrink-0">
																	{getExecutiveIcon(selectedExecutive, "md")}
																	<div className="-bottom-1 -right-1 sm:-bottom-2 sm:-right-2 absolute">
																		<div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 shadow sm:h-6 sm:w-6 lg:h-8 lg:w-8">
																			<svg
																				className="h-2.5 w-2.5 text-white sm:h-3 sm:w-3 lg:h-4 lg:w-4"
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
																		</div>
																	</div>
																</div>
																<div className="min-w-0 flex-1">
																	<h3 className="truncate font-semibold text-base text-stone-800 sm:text-lg lg:text-2xl">
																		{selectedPersonality.name}
																	</h3>
																	<p className="mt-0.5 truncate font-medium text-sm text-stone-500 sm:mt-1 sm:text-base">
																		{selectedPersonality.role}
																	</p>
																	<p className="mt-2 line-clamp-2 text-sm text-stone-600 leading-relaxed sm:mt-3 sm:line-clamp-none sm:text-base">
																		{selectedPersonality.description}
																	</p>
																</div>
															</div>
														</div>
													</motion.div>
												</div>

												{/* Other Executives Section */}
												<div className="space-y-4 sm:space-y-6">
													<div className="flex items-center gap-2 sm:gap-3">
														<div className="h-px flex-1 bg-gradient-to-r from-stone-200 to-transparent" />
														<Badge className="border-0 bg-stone-100 px-2 py-1 font-semibold text-stone-600 text-xs shadow-sm sm:px-3 sm:py-1.5 sm:text-sm">
															Available
														</Badge>
														<div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
													</div>

													<div className="space-y-2 sm:space-y-3">
														{otherExecutives.map(
															([key, personality], index) => (
																<motion.button
																	animate={{ opacity: 1, x: 0 }}
																	className="group w-full text-left transition-all duration-300"
																	exit={{ opacity: 0, x: -20 }}
																	initial={{ opacity: 0, x: 20 }}
																	key={key}
																	onClick={() =>
																		handleExecutiveSelect(key as BotType)
																	}
																	transition={{
																		duration: 0.4,
																		delay: 0.1 + index * 0.1,
																	}}
																	whileHover={{ scale: 1.01, y: -2 }}
																	whileTap={{ scale: 0.99 }}
																>
																	<div className="rounded-xl border border-stone-100 bg-white p-3 shadow-sm transition-all duration-300 hover:border-rose-200 hover:bg-rose-50/30 hover:shadow-md sm:rounded-2xl sm:p-4 lg:p-6">
																		<div className="flex items-center gap-3 sm:gap-4">
																			{getExecutiveIcon(key as BotType, "sm")}
																			<div className="min-w-0 flex-1">
																				<h4 className="truncate font-semibold text-sm text-stone-800 transition-colors duration-300 group-hover:text-stone-900 sm:text-base lg:text-lg">
																					{personality.name}
																				</h4>
																				<p className="truncate text-stone-500 text-xs sm:mt-0.5 sm:text-sm">
																					{personality.role}
																				</p>
																			</div>
																			<div className="flex-shrink-0 opacity-60 transition-all duration-300 group-hover:opacity-100">
																				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 transition-colors group-hover:bg-rose-500 sm:h-10 sm:w-10">
																					<svg
																						className="h-4 w-4 text-rose-500 transition-colors group-hover:text-white sm:h-5 sm:w-5"
																						fill="none"
																						stroke="currentColor"
																						viewBox="0 0 24 24"
																					>
																						<path
																							d="M13 7l5 5m0 0l-5 5m5-5H6"
																							strokeLinecap="round"
																							strokeLinejoin="round"
																							strokeWidth={2}
																						/>
																					</svg>
																				</div>
																			</div>
																		</div>
																	</div>
																</motion.button>
															),
														)}
													</div>
												</div>
											</div>

											{/* Modal Footer - Hidden on mobile, visible on larger screens */}
											<div className="mt-4 hidden items-center justify-between border-rose-100 border-t pt-4 sm:mt-6 sm:flex sm:pt-6">
												<p className="text-sm text-stone-400">
													Select an advisor to customize your conversation
												</p>
												<Button
													className="h-10 rounded-full border border-rose-200 bg-white px-6 font-medium text-rose-600 text-sm shadow-sm transition-all duration-200 hover:bg-rose-50"
													onClick={() => setIsOpen(false)}
													variant="outline"
												>
													Cancel
												</Button>
											</div>
										</div>
									</Card>
								</motion.div>
							</div>
						</div>
					</AnimatePresence>,
					document.body,
				)}
		</div>
	);
}
