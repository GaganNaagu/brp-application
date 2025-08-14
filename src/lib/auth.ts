// Add or update this file

export const ADMIN_DISCORD_IDS = [
  "485684006940311573",
  "1055889522677792880",
  "662966951546454036",
]; // Add all admin Discord IDs here

export function isAdmin(discordId: string | undefined): boolean {
  return !!discordId && ADMIN_DISCORD_IDS.includes(discordId);
}
