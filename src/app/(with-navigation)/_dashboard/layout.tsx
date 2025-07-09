import { PostHogProvider } from "../../../components/PostHogProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostHogProvider>
      {children}
    </PostHogProvider>
  );
}
