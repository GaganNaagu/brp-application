import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const applicationData = await req.json();

    const newApplication = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      username: applicationData.username,
      age: applicationData.age,
      steam_id: applicationData.steamId,
      cfx_account: applicationData.cfxAccount,
      experience: applicationData.experience,
      character: applicationData.character,
      discord_id: applicationData.discord.id,
      discord_username: applicationData.discord.username,
      discord_avatar: applicationData.discord.avatar,
      discord_email: applicationData.discord.email,
      status: "pending",
    };

    const { data, error } = await supabase
      .from("applications")
      .insert([newApplication])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      id: newApplication.id,
    });
  } catch (error) {
    console.error("Error saving application:", error);
    return NextResponse.json(
      { error: "Failed to save application" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .eq("status", "pending")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Transform data back to frontend format
    const transformedApplications =
      applications?.map((app) => ({
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
      })) || [];

    return NextResponse.json(transformedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json([], { status: 500 });
  }
}
