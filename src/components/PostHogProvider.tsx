"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Feature flag to enable/disable PostHog - disabled by default
const POSTHOG_ENABLED = process.env.NEXT_PUBLIC_POSTHOG_ENABLED === 'true' || false;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if enabled via environment variable
    if (POSTHOG_ENABLED && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        capture_pageview: false, // We capture pageviews manually
        capture_pageleave: true, // Enable pageleave capture
      })
    }
  }, [])

  // If PostHog is disabled, just return children without provider
  if (!POSTHOG_ENABLED) {
    return <>{children}</>
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  )
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    // Only capture pageviews if PostHog is enabled and initialized
    if (POSTHOG_ENABLED && pathname && posthog) {
      let url = window.origin + pathname
      const search = searchParams.toString()
      if (search) {
        url += "?" + search
      }
      posthog.capture("$pageview", { "$current_url": url })
    }
  }, [pathname, searchParams, posthog])

  return null
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
