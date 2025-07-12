import { PostHog } from "posthog-node"

// Feature flag to enable/disable PostHog - disabled by default
const POSTHOG_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true' || false;

export default function PostHogClient() {
  // Return null if PostHog is disabled
  if (!POSTHOG_ENABLED || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return null;
  }
  
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}
