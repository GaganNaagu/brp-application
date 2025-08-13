import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendDirectMessage } from "@/lib/discord-bot";
import { isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.discord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(session.discord.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { status, reason } = await req.json();

    // Get the application
    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Archive the application
    const archivedApplication = {
      ...application,
      status,
      status_reason: reason,
      updated_at: new Date().toISOString(),
      archived_at: new Date().toISOString(),
    };

    // Insert into archive
    const { error: archiveError } = await supabase
      .from("archived_applications")
      .insert([archivedApplication]);

    if (archiveError) {
      console.error("Archive error:", archiveError);
      throw archiveError;
    }

    // Delete from active applications
    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      throw deleteError;
    }

    // Send Discord message
    try {
      await sendDirectMessage(
        application.discord_id,
        status as "approved" | "denied",
        reason
      );
      console.log(`Discord message sent to user ${application.discord_id}`);
    } catch (err) {
      console.error("Failed to send Discord message:", err);
    }

    return NextResponse.json({
      message: "Application status updated and archived successfully",
    });
  } catch (err) {
    console.error("Error updating application:", err);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
