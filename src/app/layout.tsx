import "./styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ThemeToggle from "./components/theme-toggle";
import { SessionProvider } from "./components/providers/session-provider";
import { getDiscordClient } from "@/lib/discord-bot";
import FallingLogos from "./components/falling-logos";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "[Bhayanak Roleplay] Whitelist Application",
  description: "Apply to join our [Bhayanak Roleplay] roleplay server",
  authors: [{ name: "Naagu", url: "https://nextjs.org" }],
};

// Initialize the Discord bot on the server side
if (typeof window === "undefined") {
  await getDiscordClient();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link
        rel="icon"
        href="https://r2.fivemanage.com/BR7Q2n0nR3UkMtqZisSkc/brp-logo.png"
        sizes="any"
      />
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground relative">
              <FallingLogos />
              <div className="relative z-10">
                <header className="container mx-auto p-4">
                  <div className="flex justify-end">
                    <ThemeToggle />
                  </div>
                </header>
                {children}
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
