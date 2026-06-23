import type { AuthViewMode } from "@/features/auth/ui/authViewMode";

export const authHeroContent = {
  brand: "CampaignGate",
  description:
    "Enter a control center for planning campaigns, tracking sessions, managing characters, and shaping every chapter of your party's story.",
  highlights: ["Plan", "Create", "Play"],
} as const;

export const authViewContent: Record<
  AuthViewMode,
  {
    eyebrow: string;
    subtitle: string;
    title: string;
  }
> = {
  login: {
    eyebrow: "Adventurer access",
    subtitle: "Return to the world of StormGate and continue your campaign.",
    title: "Sign in",
  },
  register: {
    eyebrow: "Start your journey",
    subtitle: "Create an account and gather your party in a single command center.",
    title: "Create account",
  },
};
