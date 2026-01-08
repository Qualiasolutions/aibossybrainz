"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckCircleFillIcon } from "./icons";

type Highlight = {
	title: string;
	description: string;
};

type AuthShellProps = {
	eyebrow?: string;
	title: string;
	description: string;
	children: ReactNode;
	highlights?: Highlight[];
	className?: string;
};

const staggeredFade = {
	hidden: { opacity: 0, y: 16 },
	visible: (index: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: 0.2 + index * 0.06,
			duration: 0.4,
			ease: [0.16, 1, 0.3, 1],
		},
	}),
};

export function AuthShell({
	eyebrow = "Alecci Media Platform",
	title,
	description,
	highlights = [],
	children,
	className,
}: AuthShellProps) {
	return (
		<div
			className={cn(
				"relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-white text-neutral-900",
				className,
			)}
		>
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute top-[-5%] left-[-10%] h-[28rem] w-[28rem] rounded-full bg-red-500/5 blur-3xl md:h-[32rem] md:w-[32rem]" />
				<div className="absolute top-[20%] right-[-12%] h-[24rem] w-[24rem] rounded-full bg-neutral-200/30 blur-[140px] md:h-[28rem] md:w-[28rem]" />
				<div className="-translate-x-1/2 absolute bottom-[-15%] left-[40%] h-[20rem] w-[20rem] rounded-full bg-red-500/3 blur-[120px]" />
			</div>

			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="relative z-10 grid w-full max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:px-10"
				initial={{ opacity: 0, y: 24 }}
				transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
			>
				<div className="space-y-8">
					<motion.span
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1 font-semibold text-red-600 text-xs uppercase tracking-widest shadow-sm ring-1 ring-neutral-200 backdrop-blur"
						initial={{ opacity: 0, y: -12 }}
						transition={{ duration: 0.4 }}
					>
						<div className="flex h-3.5 w-3.5 items-center justify-center text-red-500">
							<CheckCircleFillIcon size={14} />
						</div>
						{eyebrow}
					</motion.span>

					<motion.h1
						animate={{ opacity: 1, y: 0 }}
						className="font-semibold text-4xl text-slate-900 leading-tight tracking-tight sm:text-[2.75rem]"
						initial={{ opacity: 0, y: -16 }}
						transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
					>
						{title}
					</motion.h1>

					<motion.p
						animate={{ opacity: 1, y: 0 }}
						className="max-w-xl text-lg text-slate-600 leading-relaxed"
						initial={{ opacity: 0, y: -14 }}
						transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
					>
						{description}
					</motion.p>

					{highlights.length > 0 ? (
						<motion.ul animate="visible" className="space-y-4" initial="hidden">
							{highlights.map(
								(
									{ title: highlightTitle, description: highlightDescription },
									index,
								) => (
									<motion.li
										className="group hover:-translate-y-1 flex items-start gap-3 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-lg shadow-red-100/30 backdrop-blur transition duration-300 hover:shadow-2xl"
										custom={index}
										key={highlightTitle}
										variants={staggeredFade}
									>
										<div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-red-500/10 text-red-600 transition duration-300 group-hover:bg-red-500 group-hover:text-white">
											<div className="flex h-3.5 w-3.5 items-center justify-center">
												<CheckCircleFillIcon size={14} />
											</div>
										</div>
										<div className="space-y-1">
											<h3 className="font-semibold text-red-500 text-sm uppercase tracking-wider">
												{highlightTitle}
											</h3>
											<p className="text-slate-600 text-sm">
												{highlightDescription}
											</p>
										</div>
									</motion.li>
								),
							)}
						</motion.ul>
					) : null}
				</div>

				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="relative rounded-[32px] border border-neutral-200 bg-white p-8 shadow-2xl shadow-neutral-200/40 backdrop-blur-xl"
					initial={{ opacity: 0, y: 24 }}
					transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
				>
					<div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
					<div className="flex flex-col gap-6">{children}</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
