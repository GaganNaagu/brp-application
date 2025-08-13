import { NextResponse } from "next/server";
import { getDiscordClient } from "@/lib/discord-bot";

// // Constants as before
const GUILD_ID = "1355580524915327066";
const WHITELIST_ROLE_ID = "1371111147645964308";

export async function POST(req: Request) {
  try {
    const userId = await req.json();

    if (typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // Acquire the already logged in Discord client
    const client = await getDiscordClient();

    if (!client.isReady()) {
      return NextResponse.json(
        { error: "Discord client not ready" },
        { status: 503 }
      );
    }

    // Fetch the guild
    const guild = await client.guilds.fetch(GUILD_ID);
    // Fetch the guild member by userId
    const member = await guild.members.fetch(userId).catch(() => null);

    if (!member) {
      // Member not found in guild, so not whitelisted
      return NextResponse.json({ whitelisted: false });
    }

    // Check if member has the whitelisted role
    const hasRole = member.roles.cache.has(WHITELIST_ROLE_ID);

    return NextResponse.json({ whitelisted: hasRole });
  } catch (error) {
    console.error("Error checking whitelist status:", error);
    return NextResponse.json(
      { error: "Failed to check whitelist status" },
      { status: 500 }
    );
  }
}
