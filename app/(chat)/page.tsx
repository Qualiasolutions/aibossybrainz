import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user: sessionUser },
	} = await supabase.auth.getUser();

	if (!sessionUser) {
		redirect("/login");
	}

	const id = generateUUID();

	const cookieStore = await cookies();
	const modelIdFromCookie = cookieStore.get("chat-model");

	if (!modelIdFromCookie) {
		return (
			<>
				<Chat
					autoResume={false}
					id={id}
					initialChatModel={DEFAULT_CHAT_MODEL}
					initialMessages={[]}
					initialVisibilityType="private"
					isReadonly={false}
					key={id}
				/>
				<DataStreamHandler />
			</>
		);
	}

	return (
		<>
			<Chat
				autoResume={false}
				id={id}
				initialChatModel={modelIdFromCookie.value}
				initialMessages={[]}
				initialVisibilityType="private"
				isReadonly={false}
				key={id}
			/>
			<DataStreamHandler />
		</>
	);
}
