import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  searchParams: Promise<{ username: string }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const authToken = (await cookies()).get("auth_token")?.value;

  if (!authToken) {
    redirect("/");
  }

  let username = "";
  try {
    username = (await searchParams).username || "Demo User";
  } catch (error) {
    redirect("/");
  }

  // Sanitize username for display
  username = username.replace(/[^a-zA-Z0-9_]/g, "");

  const handleLogout = async () => {
    "use server";
    (await cookies()).delete("auth_token");
    redirect("/");
  };

  return (
    <div className="h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl mx-2 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700">
        <CardHeader className="border-b border-neutral-700">
          <CardTitle className="flex items-center gap-2 text-2xl text-neutral-100 font-semibold">
            <User className="h-5 w-5 text-blue-500" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-neutral-200">
              Authenticated as{" "}
              <span className="text-blue-500 font-semibold">{username}</span>
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Explore your account details and in-game progress.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-850 transition-colors">
              <h3 className="font-medium text-neutral-200">Game Data</h3>
              <p className="text-sm text-neutral-400 mt-1">
                View your in-game stats, such as gold, levels, etc.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700 hover:text-neutral-100 transition-all rounded-md"
              >
                <Link href={`/data?username=${encodeURIComponent(username)}`}>
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Data
                </Link>
              </Button>
            </Card>
            <Card className="p-4 bg-neutral-900 border border-neutral-700 rounded-md hover:bg-neutral-850 transition-colors">
              <h3 className="font-medium text-neutral-200">Account Settings</h3>
              <p className="text-sm text-neutral-400 mt-1">
                Manage your account linkage and preferences.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 w-full bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700 hover:text-neutral-100 transition-all rounded-md"
              >
                <Link href={`/settings?username=${encodeURIComponent(username)}`}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </Card>
          </div>

          <form action={handleLogout} className="flex justify-end cursor-pointer">
            <Button
              variant="outline"
              className="mt-4  bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700 hover:text-neutral-100 transition-all rounded-md"
              type="submit"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
