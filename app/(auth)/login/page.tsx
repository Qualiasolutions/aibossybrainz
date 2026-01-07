"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

const loginHighlights = [
	{
		title: "Executive Continuity",
		description:
			"Pick up every thread with Alexandria and Kim preserved exactly as you left it.",
	},
	{
		title: "Faster Launch Windows",
		description:
			"Deploy new GTM experiments in minutes with reusable playbooks and ready-made briefs.",
	},
	{
		title: "Enterprise Guardrails",
		description:
			"Role-based access plus tone control keeps every output on brand and on message.",
	},
];

export default function Page() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [isSuccessful, setIsSuccessful] = useState(false);
	const hasRedirected = useRef(false);

	const [state, formAction] = useActionState<LoginActionState, FormData>(
		login,
		{
			status: "idle",
		},
	);

	useEffect(() => {
		if (state.status === "failed") {
			toast({
				type: "error",
				description: "Invalid credentials!",
			});
		} else if (state.status === "invalid_data") {
			toast({
				type: "error",
				description: "Failed validating your submission!",
			});
		} else if (state.status === "success" && !hasRedirected.current) {
			hasRedirected.current = true;
			setIsSuccessful(true);
			// Navigate to home after successful login - session will be refreshed
			router.push("/");
		}
	}, [router, state.status]);

	const handleSubmit = (formData: FormData) => {
		setEmail(formData.get("email") as string);
		formAction(formData);
	};

	return (
		<AuthShell
			description="Sign in to continue orchestrating GTM experiments with Alexandria and Kim inside the secure Alecci Media workspace."
			highlights={loginHighlights}
			title="Welcome back to your AI executive suite"
		>
			<div className="space-y-2 text-center">
				<h2 className="font-semibold text-2xl text-slate-900">Sign in</h2>
				<p className="text-slate-500 text-sm">
					Use your Alecci Media credentials to rejoin the live workspace.
				</p>
			</div>
			<AuthForm
				action={handleSubmit}
				className="px-0 sm:px-0"
				defaultEmail={email}
			>
				<SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>

			</AuthForm>
		</AuthShell>
	);
}
