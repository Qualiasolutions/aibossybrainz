"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTicketList } from "./support-ticket-list";
import { SupportTicketConversation } from "./support-ticket-conversation";
import { SupportNewTicket } from "./support-new-ticket";

type WidgetView = "list" | "conversation" | "new";

interface SupportWidgetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SupportWidget({ open, onOpenChange }: SupportWidgetProps) {
	const [view, setView] = useState<WidgetView>("list");
	const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

	const handleSelectTicket = (ticketId: string) => {
		setSelectedTicketId(ticketId);
		setView("conversation");
	};

	const handleBack = () => {
		if (view === "conversation" || view === "new") {
			setView("list");
			setSelectedTicketId(null);
		}
	};

	const handleNewTicket = () => {
		setView("new");
	};

	const handleTicketCreated = (ticketId: string) => {
		setSelectedTicketId(ticketId);
		setView("conversation");
	};

	const handleClose = () => {
		onOpenChange(false);
		// Reset view after animation completes
		setTimeout(() => {
			setView("list");
			setSelectedTicketId(null);
		}, 200);
	};

	// Reset view when opening
	useEffect(() => {
		if (open) {
			setView("list");
			setSelectedTicketId(null);
		}
	}, [open]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed top-16 right-4 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
					initial={{ opacity: 0, y: -10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{ duration: 0.2 }}
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b border-neutral-100 bg-gradient-to-r from-rose-500 to-red-600 px-4 py-3 text-white">
						<div className="flex items-center gap-2">
							{view !== "list" && (
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-white hover:bg-white/20"
									onClick={handleBack}
								>
									<ChevronLeft className="h-5 w-5" />
								</Button>
							)}
							<h3 className="font-semibold">
								{view === "list" && "Support"}
								{view === "conversation" && "Ticket"}
								{view === "new" && "New Ticket"}
							</h3>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-white hover:bg-white/20"
							onClick={handleClose}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-hidden">
						{view === "list" && (
							<SupportTicketList
								onSelectTicket={handleSelectTicket}
								onNewTicket={handleNewTicket}
							/>
						)}
						{view === "conversation" && selectedTicketId && (
							<SupportTicketConversation ticketId={selectedTicketId} />
						)}
						{view === "new" && (
							<SupportNewTicket onTicketCreated={handleTicketCreated} />
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
