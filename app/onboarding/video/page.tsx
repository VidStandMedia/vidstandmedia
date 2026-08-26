import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getYouTubeVideos } from "@/lib/videos";
import { getCampaign } from "@/app/actions/campaign";
import VideoClient from "./VideoClient";

export default async function VideoPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const videos = await getYouTubeVideos();

  const campaign = await getCampaign();

  return (
    <VideoClient
      videos={videos}
      initialVideo={campaign.video}
    />
  );
}