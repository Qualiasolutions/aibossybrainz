"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { type LoginActionState, login } from "../actions";

const loginHighlights = [
  {
    title: "You're Here to Build",
    description:
      "This isn't a content vault for 'someday.' Every tool, every prompt, every checklist is built to help your business grow.",
  },
  {
    title: "Your Prompt Matters",
    description:
      "The more detailed your prompts, the more detailed your responses. The more specific your ask, the better the strategy.",
  },
  {
    title: "Implement, Don't Hoard",
    description:
      "Clarity without action is just procrastination. Pick one thing and implement it to achieve better business outcomes.",
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
      // Navigate to chat app after successful login
      router.push("/new");
    }
  }, [router, state.status]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <AuthShell
      description="We're excited to talk to you. Don't forget, you can hear our voices too. Ask Alexandria and Kim anything when it comes to sales and marketing."
      highlights={loginHighlights}
      title="Welcome Back to Your Sales & Marketing Superheroes"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-semibold text-2xl text-slate-900">Sign in</h2>
        <p className="text-slate-500 text-sm">
          The AI Boss Brainz Workspace — Powered by Alecci Media
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
