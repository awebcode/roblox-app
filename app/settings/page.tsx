import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Home, BarChart2 } from "lucide-react";
import Link from "next/link";

interface SettingsProps {
  searchParams: Promise<{ username: string }>;
}

interface SettingsData {
  notifications?: boolean;
  theme?: string;
  [key: string]: any;
}

export default async function Settings({ searchParams }: SettingsProps) {
  const authToken = (await cookies()).get("auth_token")?.value;

  if (!authToken) {
    redirect("/");
  }

  let username = "";
  try {
    username = (await searchParams).username || "User";
  } catch (error) {
    username = "User";
  }

  // Sanitize username
  username = username.replace(/[^a-zA-Z0-9_]/g, "") || "User";

  // Dummy settings data (since no DB or API)
  const settingsData: SettingsData = {
    notifications: true,
    theme: "light",
  };

  return (
    <div className="h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl mx-2 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700">
        <CardHeader className="border-b border-neutral-700">
          <CardTitle className="flex items-center gap-2 text-2xl text-neutral-100 font-semibold">
            <User className="h-5 w-5 text-blue-500" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-neutral-200">
              Authenticated as{" "}
              <span className="text-blue-500 font-semibold">{username}</span>
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Manage your account preferences below.
            </p>
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-neutral-900 border border-neutral-700 rounded-md">
              <h3 className="font-medium text-neutral-200 mb-3">Preferences</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-neutral-700 hover:bg-transparent">
                    <TableHead className="text-neutral-200 font-medium">
                      Setting
                    </TableHead>
                    <TableHead className="text-neutral-200 font-medium">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(settingsData).map(([key, value], index) => (
                    <TableRow
                      key={key}
                      className={`${
                        index % 2 === 0 ? "bg-neutral-850" : "bg-neutral-900"
                      } hover:bg-neutral-800 transition-colors`}
                    >
                      <TableCell className="font-medium capitalize text-neutral-200">
                        {key}
                      </TableCell>
                      <TableCell className="text-neutral-200">
                        {value.toString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="outline"
                className="mt-4 bg-neutral-800 text-neutral-400 border-neutral-600 cursor-not-allowed rounded-md"
                disabled
              >
                Update Preferences (Coming Soon)
              </Button>
            </Card>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              asChild
              variant="outline"
              className="bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700 hover:text-neutral-100 transition-all rounded-md"
            >
              <Link href={`/dashboard?username=${encodeURIComponent(username)}`}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-neutral-800 text-neutral-200 border-neutral-600 hover:bg-neutral-700 hover:text-neutral-100 transition-all rounded-md"
            >
              <Link href={`/data?username=${encodeURIComponent(username)}`}>
                <BarChart2 className="h-4 w-4 mr-2" />
                Data
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
