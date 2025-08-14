import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

let client: Client | null = null;
const SERVER_NAME = "Bhayanak Roleplay"; // Configure this
const SERVER_ICON =
  "https://r2.fivemanage.com/BR7Q2n0nR3UkMtqZisSkc/brp-logo.png"; // Configure this
const FOOTER_TEXT = "© 2025 Bhayanak Roleplay - All rights reserved"; // Configure this

// IDs to configure
const GUILD_ID = "1355580524915327066";
const CHANNEL_ID = "1371111401892085931";
const WHITELIST_ROLE_ID = "1371111147645964308"; // <-- SET THIS!

export async function getDiscordClient(): Promise<Client> {
  if (client && client.isReady()) {
    return client;
  }
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is not set in the environment variables");
  }
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers, // Needed to manage/fetch members & add roles
    ],
  });
  client.on("ready", () => {
    console.log(`Logged in as ${client?.user?.tag}!`);
  });
  await client.login(process.env.DISCORD_BOT_TOKEN);
  await new Promise((resolve) => client?.once("ready", resolve));
  return client;
}

// export async function initializeDiscordBot() {
//   if (!process.env.DISCORD_BOT_TOKEN) {
//     console.error("DISCORD_BOT_TOKEN is not set in the environment variables");
//     return;
//   }
//   try {
//     client = await getDiscordClient();
//   } catch (error) {
//     console.error("Failed to initialize Discord bot:", error);
//   }
// }

export async function sendDirectMessage(
  userId: string,
  status: "approved" | "denied",
  reason?: string
) {
  const client = await getDiscordClient();
  if (!client) {
    console.error("Discord bot not initialized");
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const timestampLong = `<t:${timestamp}:F>`;

  const embed = new EmbedBuilder()
    .setColor(status === "approved" ? "#00FF00" : "#FF0000")
    .setAuthor({
      name: SERVER_NAME,
      iconURL: SERVER_ICON,
    })
    .setTitle("Whitelist Application Response")
    .setDescription(
      status === "approved"
        ? `Hello there,\n\nAfter reviewing your application, we're excited to let you know that your whitelist application has been **ACCEPTED**! 🎉\n\n${
            reason ? `**Staff Note:** ${reason}\n\n` : ""
          }Your responses demonstrated a strong understanding of roleplay and alignment with our community values. We believe you'll be a great addition!\n\n**Next Steps:**\n1. Join our Discord server if you haven't already\n2. Read the rules in #server-rules\n3. Connect to the server using your whitelisted Steam account`
        : `Hello there,\n\nAfter reviewing your application, we regret to inform you that your whitelist application has been **DENIED**.\nYou can Reapply.`
    )
    .addFields(
      {
        name: "Application Status",
        value: status === "approved" ? "✅ Accepted" : "❌ Denied",
        inline: true,
      },
      {
        name: "Decision Date",
        value: timestampLong,
        inline: true,
      }
    )
    .setFooter({
      text: FOOTER_TEXT,
      iconURL: SERVER_ICON,
    })
    .setTimestamp();

  if (status === "approved") {
    embed.addFields({
      name: "Important Information",
      value:
        "Please read our server rules before joining. Our staff are here to help with any queries!",
    });
  }

  if (reason) {
    embed.addFields({
      name: status === "approved" ? "Staff Note" : "Reason",
      value: reason,
      inline: false,
    });
  }

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = (await guild.channels.fetch(CHANNEL_ID)) as TextChannel;

    if (!channel || channel.type !== 0) {
      console.error("Channel not found or is not a text channel.");
      return;
    }

    // Send the ping with the embed
    await channel.send({
      content: `<@${userId}>`,
      embeds: [embed],
    });

    console.log(`Embed sent in channel ${CHANNEL_ID} pinging ${userId}`);

    // Auto-assign role if approved
    if (status === "approved") {
      await addWhitelistRole(userId);
    }
  } catch (error) {
    console.error("Failed to send message in channel:", error);
  }
}

/**
 * Adds the whitelisted role to a user in the guild.
 */
export async function addWhitelistRole(userId: string) {
  try {
    const client = await getDiscordClient();
    const guild = await client.guilds.fetch(GUILD_ID);

    // Fetch member to ensure we can add a role
    const member = await guild.members.fetch(userId);

    if (!member) {
      console.error(`Member with ID ${userId} not found in guild.`);
      return;
    }

    await member.roles.add(WHITELIST_ROLE_ID);

    console.log(
      `✅ Role ${WHITELIST_ROLE_ID} added to user ${userId} in guild ${GUILD_ID}`
    );
  } catch (error) {
    console.error(`❌ Failed to add role to user ${userId}:`, error);
  }
}
