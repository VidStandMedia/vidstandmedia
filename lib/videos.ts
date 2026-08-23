import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
  privacyStatus: string;
};

export async function getYouTubeVideos(): Promise<YouTubeVideo[]> {
  const session: any = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return [];
  }

  // Step 1: Get the user's uploaded videos
  const searchResponse = await fetch(
    "https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=25",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!searchResponse.ok) {
    return [];
  }

  const searchData = await searchResponse.json();

  const ids = searchData.items
    .map((item: any) => item.id.videoId)
    .join(",");

  if (!ids) {
    return [];
  }

  // Step 2: Get statistics and content details
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status,contentDetails&id=${ids}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    }
  );

  if (!videosResponse.ok) {
    return [];
  }

  const videosData = await videosResponse.json();

  return videosData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.high.url,
    publishedAt: video.snippet.publishedAt,
    viewCount: Number(video.statistics.viewCount ?? 0),
    duration: video.contentDetails.duration,
    privacyStatus: video.status.privacyStatus,
  }));
}