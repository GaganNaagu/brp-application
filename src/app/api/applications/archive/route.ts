import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.discord || !isAdmin(session.discord.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: archivedApplications, error } = await supabase
      .from("archived_applications")
      .select("*")
      .order("archived_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Transform data back to frontend format
    const transformedApplications =
      archivedApplications?.map((app) => ({
        id: app.id,
        timestamp: app.timestamp,
        username: app.username,
        age: app.age,
        steamId: app.steam_id,
        cfxAccount: app.cfx_account,
        experience: app.experience,
        character: app.character,
        discord: {
          id: app.discord_id,
          username: app.discord_username,
          avatar: app.discord_avatar,
          email: app.discord_email,
        },
        status: app.status,
        statusReason: app.status_reason,
        updatedAt: app.updated_at,
      })) || [];

    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error("Error fetching archived applications:", error);
    return NextResponse.json([], { status: 500 });
  }
}
