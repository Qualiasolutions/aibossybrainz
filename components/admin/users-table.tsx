"use client";

import { useState, useTransition } from "react";
import {
	MoreHorizontal,
	Trash2,
	Shield,
	ShieldOff,
	Eye,
	Search,
	UserPlus,
} from "lucide-react";
import type { AdminUser } from "@/lib/admin/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UsersTableProps {
	users: AdminUser[];
	onDeleteUser: (userId: string) => Promise<void>;
	onToggleAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
	onCreateUser: (data: {
		email: string;
		displayName?: string;
		companyName?: string;
	}) => Promise<void>;
}

export function UsersTable({
	users,
	onDeleteUser,
	onToggleAdmin,
	onCreateUser,
}: UsersTableProps) {
	const [search, setSearch] = useState("");
	const [isPending, startTransition] = useTransition();
	const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [newUser, setNewUser] = useState({
		email: "",
		displayName: "",
		companyName: "",
	});

	const filteredUsers = users.filter(
		(user) =>
			user.email.toLowerCase().includes(search.toLowerCase()) ||
			user.displayName?.toLowerCase().includes(search.toLowerCase()) ||
			user.companyName?.toLowerCase().includes(search.toLowerCase()),
	);

	const handleDelete = () => {
		if (!deleteUserId) return;
		startTransition(async () => {
			await onDeleteUser(deleteUserId);
			setDeleteUserId(null);
		});
	};

	const handleToggleAdmin = (userId: string, currentIsAdmin: boolean) => {
		startTransition(async () => {
			await onToggleAdmin(userId, !currentIsAdmin);
		});
	};

	const handleCreateUser = () => {
		if (!newUser.email) return;
		startTransition(async () => {
			await onCreateUser(newUser);
			setShowCreateDialog(false);
			setNewUser({ email: "", displayName: "", companyName: "" });
		});
	};

	return (
		<div className="space-y-4">
			{/* Search and Actions */}
			<div className="flex items-center justify-between gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
					<Input
						placeholder="Search users..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
					/>
				</div>
				<Button
					onClick={() => setShowCreateDialog(true)}
					className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
				>
					<UserPlus className="h-4 w-4 mr-2" />
					Add User
				</Button>
			</div>

			{/* Table */}
			<div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
				<table className="w-full">
					<thead>
						<tr className="border-b border-zinc-800 bg-zinc-800/50">
							<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
								User
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
								Company
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
								Activity
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-zinc-800">
						{filteredUsers.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-8 text-center text-zinc-500"
								>
									No users found
								</td>
							</tr>
						) : (
							filteredUsers.map((user) => (
								<tr
									key={user.id}
									className="hover:bg-zinc-800/30 transition-colors"
								>
									<td className="px-6 py-4">
										<div>
											<p className="text-sm font-medium text-white">
												{user.displayName || "No name"}
											</p>
											<p className="text-sm text-zinc-500">{user.email}</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<p className="text-sm text-zinc-300">
											{user.companyName || "-"}
										</p>
										<p className="text-xs text-zinc-500">
											{user.industry || "No industry"}
										</p>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											<p className="text-sm text-zinc-300">
												{user.chatCount} chats
											</p>
											<p className="text-xs text-zinc-500">
												{user.messageCount} messages
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-col gap-1">
											{user.isAdmin && (
												<span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-rose-500/20 text-rose-400">
													<Shield className="h-3 w-3" />
													Admin
												</span>
											)}
											{user.onboardedAt ? (
												<span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400">
													Onboarded
												</span>
											) : (
												<span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-500/20 text-zinc-400">
													Pending
												</span>
											)}
										</div>
									</td>
									<td className="px-6 py-4 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
												>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="bg-zinc-900 border-zinc-800"
											>
												<DropdownMenuItem
													onClick={() =>
														window.open(`/admin/users/${user.id}`, "_self")
													}
													className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
												>
													<Eye className="h-4 w-4 mr-2" />
													View Details
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleToggleAdmin(user.id, user.isAdmin || false)
													}
													className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer"
												>
													{user.isAdmin ? (
														<>
															<ShieldOff className="h-4 w-4 mr-2" />
															Remove Admin
														</>
													) : (
														<>
															<Shield className="h-4 w-4 mr-2" />
															Make Admin
														</>
													)}
												</DropdownMenuItem>
												<DropdownMenuSeparator className="bg-zinc-800" />
												<DropdownMenuItem
													onClick={() => setDeleteUserId(user.id)}
													className="text-rose-400 focus:bg-rose-500/20 focus:text-rose-400 cursor-pointer"
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete User
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={!!deleteUserId}
				onOpenChange={() => setDeleteUserId(null)}
			>
				<DialogContent className="bg-zinc-900 border-zinc-800">
					<DialogHeader>
						<DialogTitle className="text-white">Delete User</DialogTitle>
						<DialogDescription className="text-zinc-400">
							This will permanently delete the user and all their data including
							chats, messages, and documents. This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setDeleteUserId(null)}
							className="text-zinc-400 hover:text-white"
						>
							Cancel
						</Button>
						<Button
							onClick={handleDelete}
							disabled={isPending}
							className="bg-rose-600 hover:bg-rose-700"
						>
							{isPending ? "Deleting..." : "Delete User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Create User Dialog */}
			<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
				<DialogContent className="bg-zinc-900 border-zinc-800">
					<DialogHeader>
						<DialogTitle className="text-white">Add New User</DialogTitle>
						<DialogDescription className="text-zinc-400">
							Create a new user account. They will be able to login via email.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-zinc-300">
								Email *
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="user@example.com"
								value={newUser.email}
								onChange={(e) =>
									setNewUser({ ...newUser, email: e.target.value })
								}
								className="bg-zinc-800/50 border-zinc-700 text-white"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="displayName" className="text-zinc-300">
								Display Name
							</Label>
							<Input
								id="displayName"
								placeholder="John Doe"
								value={newUser.displayName}
								onChange={(e) =>
									setNewUser({ ...newUser, displayName: e.target.value })
								}
								className="bg-zinc-800/50 border-zinc-700 text-white"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="companyName" className="text-zinc-300">
								Company Name
							</Label>
							<Input
								id="companyName"
								placeholder="Acme Inc"
								value={newUser.companyName}
								onChange={(e) =>
									setNewUser({ ...newUser, companyName: e.target.value })
								}
								className="bg-zinc-800/50 border-zinc-700 text-white"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setShowCreateDialog(false)}
							className="text-zinc-400 hover:text-white"
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateUser}
							disabled={isPending || !newUser.email}
							className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
						>
							{isPending ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
