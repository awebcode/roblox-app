import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
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
import { User, Home, Settings } from "lucide-react";
import Link from "next/link";

interface DataProps {
  searchParams: Promise<{ username: string }>;
}

interface GameData {
  gold?: number;
  level?: number;
  [key: string]: any;
}

export default async function Data({ searchParams }: DataProps) {
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

  // Fetch game data
  let gameData: GameData = {};
  try {
    const universeId = process.env.ROBLOX_UNIVERSE_ID || "your_universe_id";
    const dataStoreName = "PlayerData";
    const key = `user_${username}`;

    const response = await axios.get(
      `https://apis.roblox.com/datastores/v1/universes/${universeId}/standard-datastores/datastore/entries?datastoreName=${dataStoreName}&entryKey=${key}`,
      {
        headers: {
          "x-api-key": process.env.ROBLOX_API_KEY!,
        },
      }
    );

    gameData = response.data || { gold: 100, level: 1 };
  } catch (error: any) {
    console.error("Data fetch error:", {
      message: error.message,
      response: error.response?.data,
    });
    gameData = { gold: 100, level: 1 };
  }

  return (
    <div className="h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl mx-2 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700">
        <CardHeader className="border-b border-neutral-700">
          <CardTitle className="flex items-center gap-2 text-2xl text-neutral-100 font-semibold">
            <User className="h-5 w-5 text-blue-500" />
            Game Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-8 space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-neutral-200">
              Authenticated as{" "}
              <span className="text-blue-500 font-semibold">{username}</span>
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Review your in-game statistics and progress below.
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-b border-neutral-700 hover:bg-transparent">
                <TableHead className="text-neutral-200 font-medium">Stat</TableHead>
                <TableHead className="text-neutral-200 font-medium">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(gameData).map(([key, value], index) => (
                <TableRow
                  key={key}
                  className={`${
                    index % 2 === 0 ? "bg-neutral-750" : "bg-neutral-800"
                  } hover:bg-neutral-700 transition-colors`}
                >
                  <TableCell className="font-medium capitalize text-neutral-200">
                    {key}
                  </TableCell>
                  <TableCell className="text-neutral-200">{value.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
              <Link href={`/settings?username=${encodeURIComponent(username)}`}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
