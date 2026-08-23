import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getYouTubeChannel } from "@/lib/youtube";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const channel = await getYouTubeChannel();

  return (
    <OnboardingClient
      session={session}
      channel={channel}
    />
  );
}