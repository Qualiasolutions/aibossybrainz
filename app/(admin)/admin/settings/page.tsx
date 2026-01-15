import { Settings, Database, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white">Settings</h1>
				<p className="text-zinc-400 mt-1">
					Manage platform configuration and preferences.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Platform Settings */}
				<Card className="bg-zinc-900/50 border-zinc-800">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-rose-500/20 p-2">
								<Settings className="h-5 w-5 text-rose-400" />
							</div>
							<div>
								<CardTitle className="text-white">Platform Settings</CardTitle>
								<CardDescription className="text-zinc-400">
									General platform configuration
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div>
								<p className="text-sm font-medium text-zinc-200">Maintenance Mode</p>
								<p className="text-xs text-zinc-500">Temporarily disable access</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
								Off
							</div>
						</div>
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div>
								<p className="text-sm font-medium text-zinc-200">Rate Limiting</p>
								<p className="text-xs text-zinc-500">Message limits per user</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
								Enabled
							</div>
						</div>
						<div className="flex items-center justify-between py-2">
							<div>
								<p className="text-sm font-medium text-zinc-200">New Registrations</p>
								<p className="text-xs text-zinc-500">Allow new user signups</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
								Open
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Security */}
				<Card className="bg-zinc-900/50 border-zinc-800">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-purple-500/20 p-2">
								<Shield className="h-5 w-5 text-purple-400" />
							</div>
							<div>
								<CardTitle className="text-white">Security</CardTitle>
								<CardDescription className="text-zinc-400">
									Access and authentication settings
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div>
								<p className="text-sm font-medium text-zinc-200">Two-Factor Auth</p>
								<p className="text-xs text-zinc-500">Require 2FA for admins</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-zinc-500/20 text-zinc-400 text-xs font-medium">
								Optional
							</div>
						</div>
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div>
								<p className="text-sm font-medium text-zinc-200">Session Timeout</p>
								<p className="text-xs text-zinc-500">Auto-logout after inactivity</p>
							</div>
							<span className="text-sm text-zinc-300">24 hours</span>
						</div>
						<div className="flex items-center justify-between py-2">
							<div>
								<p className="text-sm font-medium text-zinc-200">API Keys</p>
								<p className="text-xs text-zinc-500">Manage external integrations</p>
							</div>
							<Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
								Manage
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Database */}
				<Card className="bg-zinc-900/50 border-zinc-800">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-emerald-500/20 p-2">
								<Database className="h-5 w-5 text-emerald-400" />
							</div>
							<div>
								<CardTitle className="text-white">Database</CardTitle>
								<CardDescription className="text-zinc-400">
									Supabase database information
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div>
								<p className="text-sm font-medium text-zinc-200">Project</p>
								<p className="text-xs text-zinc-500">Supabase project ID</p>
							</div>
							<span className="text-sm text-zinc-400 font-mono">esymbjpzjjkffpfqukxw</span>
						</div>
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div>
								<p className="text-sm font-medium text-zinc-200">Region</p>
								<p className="text-xs text-zinc-500">Database location</p>
							</div>
							<span className="text-sm text-zinc-300">US East</span>
						</div>
						<div className="flex items-center justify-between py-2">
							<div>
								<p className="text-sm font-medium text-zinc-200">Dashboard</p>
								<p className="text-xs text-zinc-500">Open Supabase dashboard</p>
							</div>
							<Link
								href="https://supabase.com/dashboard/project/esymbjpzjjkffpfqukxw"
								target="_blank"
							>
								<Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
									Open
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				{/* Branding */}
				<Card className="bg-zinc-900/50 border-zinc-800">
					<CardHeader>
						<div className="flex items-center gap-3">
							<div className="rounded-lg bg-blue-500/20 p-2">
								<Palette className="h-5 w-5 text-blue-400" />
							</div>
							<div>
								<CardTitle className="text-white">Executive Personas</CardTitle>
								<CardDescription className="text-zinc-400">
									AI executive configuration
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600" />
								<p className="text-sm font-medium text-zinc-200">Alexandria (CMO)</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
								Active
							</div>
						</div>
						<div className="flex items-center justify-between py-2 border-b border-zinc-800">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-600" />
								<p className="text-sm font-medium text-zinc-200">Kim (CSO)</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
								Active
							</div>
						</div>
						<div className="flex items-center justify-between py-2">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600" />
								<p className="text-sm font-medium text-zinc-200">Collaborative</p>
							</div>
							<div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
								Active
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="mt-8 p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
				<h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
				<div className="flex flex-wrap gap-3">
					<Link href="/admin/users">
						<Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							Manage Users
						</Button>
					</Link>
					<Link href="/admin/conversations">
						<Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							View Conversations
						</Button>
					</Link>
					<Link href="/admin/analytics">
						<Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							View Analytics
						</Button>
					</Link>
					<Link href="/">
						<Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
							Back to App
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
