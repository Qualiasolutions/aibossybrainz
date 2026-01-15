import { revalidatePath } from "next/cache";
import { getAllUsers, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin, updateUserSubscription } from "@/lib/admin/queries";
import { UsersTable } from "@/components/admin/users-table";
import type { SubscriptionType } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

async function deleteUser(userId: string) {
	"use server";
	await deleteUserByAdmin(userId);
	revalidatePath("/admin/users");
}

async function toggleAdmin(userId: string, isAdmin: boolean) {
	"use server";
	await updateUserByAdmin(userId, { isAdmin });
	revalidatePath("/admin/users");
}

async function createUser(data: {
	email: string;
	displayName?: string;
	companyName?: string;
	subscriptionType?: SubscriptionType;
}) {
	"use server";
	await createUserByAdmin(data);
	revalidatePath("/admin/users");
}

async function changeSubscription(userId: string, subscriptionType: SubscriptionType) {
	"use server";
	await updateUserSubscription(userId, subscriptionType);
	revalidatePath("/admin/users");
}

export default async function UsersPage() {
	const users = await getAllUsers();

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
				<p className="text-neutral-500 mt-1">
					View and manage all users on the platform. {users.length} total users.
				</p>
			</div>

			<UsersTable
				users={users}
				onDeleteUser={deleteUser}
				onToggleAdmin={toggleAdmin}
				onCreateUser={createUser}
				onChangeSubscription={changeSubscription}
			/>
		</div>
	);
}
