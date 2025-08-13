import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isAdmin } from "@/lib/auth";

const archiveFilePath = path.join(
  process.cwd(),
  "data",
  "archived_applications.json"
);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.discord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(session.discord.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create the data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Try to read the archive file, create it if it doesn't exist
    try {
      const data = await fs.readFile(archiveFilePath, "utf8");
      return NextResponse.json(JSON.parse(data));
    } catch (error) {
      console.log("No existing archive file, creating a new one", error);
      // If file doesn't exist, create it with an empty array
      await fs.writeFile(archiveFilePath, "[]", "utf8");
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error in archive route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
