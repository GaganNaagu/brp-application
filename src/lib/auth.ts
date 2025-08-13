// Add or update this file

// export const ADMIN_DISCORD_IDS = ["485684006940311573", "1055889522677792880"]; // Add all admin Discord IDs here

// export function isAdmin(discordId: string | undefined): boolean {
//   return !!discordId && ADMIN_DISCORD_IDS.includes(discordId);
// }

import { getDiscordClient } from "@/lib/discord-bot";

// Replace user IDs with role IDs
export const ADMIN_ROLE_IDS = [
  "1371111074350366893", // Replace with your actual admin role ID
  // "YOUR_MODERATOR_ROLE_ID", // Add other admin roles if needed
];

export const GUILD_ID = "1355580524915327066"; // Your guild ID

export async function isAdmin(discordId: string | undefined): Promise<boolean> {
  if (!discordId) return false;

  try {
    const client = await getDiscordClient();

    if (!client.isReady()) {
      console.error("Discord client not ready");
      return false;
    }

    // Fetch the guild
    const guild = await client.guilds.fetch(GUILD_ID);

    // Fetch the member
    const member = await guild.members.fetch(discordId).catch(() => null);

    if (!member) {
      console.log(`Member ${discordId} not found in guild`);
      return false;
    }

    // Check if member has any of the admin roles
    const hasAdminRole = ADMIN_ROLE_IDS.some((roleId) =>
      member.roles.cache.has(roleId)
    );

    return hasAdminRole;
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

// Synchronous fallback for emergency access (optional)
export const EMERGENCY_ADMIN_IDS = ["485684006940311573"]; // Keep as backup

export function isEmergencyAdmin(discordId: string | undefined): boolean {
  return !!discordId && EMERGENCY_ADMIN_IDS.includes(discordId);
}
