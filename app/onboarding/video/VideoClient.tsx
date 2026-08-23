"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignVideo } from "@/app/actions/campaign";
import type { CampaignVideo } from "@/lib/session/campaign";
import type { YouTubeVideo } from "@/lib/videos";

function formatViews(views: number) {
  return new Intl.NumberFormat().format(views);
}

function formatDuration(duration: string) {
  const match = duration.match(
    /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
  );

  if (!match) return duration;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function formatPrivacy(status: string) {
  switch (status) {
    case "public":
      return "Public";
    case "private":
      return "Private";
    case "unlisted":
      return "Unlisted";
    default:
      return status;
  }
}

export default function VideoClient({
  videos,
}: {
  videos: YouTubeVideo[];
}) {
  const [selectedVideo, setSelectedVideo] =
    useState<CampaignVideo | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");


  const filteredVideos = useMemo(() => {
    const filtered = videos.filter((video) =>
      video.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );


    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
        );
        break;


      case "views":
        filtered.sort(
          (a, b) =>
            b.viewCount - a.viewCount
        );
        break;


      case "az":
        filtered.sort(
          (a, b) =>
            a.title.localeCompare(b.title)
        );
        break;


      default:
        filtered.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
    }


    return filtered;

  }, [videos, search, sortBy]);


  function selectVideo(video: YouTubeVideo) {

    const campaignVideo: CampaignVideo = {
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      publishedAt: video.publishedAt,
      viewCount: video.viewCount,
      duration: video.duration,
      privacyStatus: video.privacyStatus,
    };


    setSelectedVideo(campaignVideo);
  }


  return (
    <main className="bg-white py-24 px-6">

      <div className="mx-auto max-w-6xl">


        <OnboardingProgress currentStep="video" />


        <h1 className="text-center text-5xl font-bold text-black">
          Choose Your Video
        </h1>


        <p className="mt-6 text-center text-lg text-gray-700">
          Select the YouTube video you'd like to promote.
        </p>



        {/* Search and Sort */}

        <div className="mt-10 flex flex-col gap-4 md:flex-row">


          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your videos..."
            className="flex-1 rounded-xl border border-gray-300 px-5 py-4 text-lg text-black outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
          />


          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-300 px-5 py-4 text-black outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
          >

            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="views">
              Most Views
            </option>

            <option value="az">
              A–Z
            </option>

          </select>


        </div>




        {/* Video Cards */}

        <div className="mt-14 grid gap-8 md:grid-cols-2">


          {filteredVideos.map((video) => (

            <div
              key={video.id}
              onClick={() => selectVideo(video)}
              className={`cursor-pointer overflow-hidden rounded-2xl border transition hover:scale-[1.02]
              ${
                selectedVideo?.id === video.id
                  ? "border-green-600 bg-green-50 shadow-xl"
                  : "border-gray-300 hover:border-green-600 hover:bg-green-50 hover:shadow-xl"
              }`}
            >


              <Image
                src={video.thumbnail}
                alt={video.title}
                width={480}
                height={270}
                className="w-full"
              />



              <div className="p-6">


                <h2 className="text-xl font-bold text-black">
                  {video.title}
                </h2>



                <div className="mt-4 space-y-3">


                  <p className="text-gray-700">
                    <span className="font-semibold">
                      Published:
                    </span>{" "}
                    {new Date(
                      video.publishedAt
                    ).toLocaleDateString()}
                  </p>



                  <p className="text-gray-700">
                    <span className="font-semibold">
                      Views:
                    </span>{" "}
                    {formatViews(video.viewCount)}
                  </p>



                  <p className="text-gray-700">
                    <span className="font-semibold">
                      Duration:
                    </span>{" "}
                    {formatDuration(video.duration)}
                  </p>



                  <p className="text-gray-700">
                    <span className="font-semibold">
                      Privacy:
                    </span>{" "}
                    {formatPrivacy(video.privacyStatus)}
                  </p>


                </div>


              </div>





              {/* Card Footer */}

              <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">


                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                >
                  Watch on YouTube ↗
                </a>



                {selectedVideo?.id === video.id && (

                  <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                    ✓ Selected
                  </span>

                )}


              </div>


            </div>

          ))}





          {filteredVideos.length === 0 && (

            <div className="col-span-full rounded-2xl border border-gray-300 p-10 text-center">

              <h2 className="text-xl font-semibold text-black">
                No videos found
              </h2>

              <p className="mt-3 text-gray-600">
                Try searching with a different title.
              </p>

            </div>

          )}


        </div>






        {/* Navigation */}

        <div className="mt-14 flex justify-between">


          <Link
            href="/onboarding/budget"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black hover:bg-gray-100"
          >
            Back
          </Link>





          <button
            type="button"
            disabled={!selectedVideo}
            onClick={async () => {

              if (!selectedVideo) return;


              await saveCampaignVideo(selectedVideo);


              window.location.href =
                "/onboarding/audience";

            }}
            className={`rounded-xl px-10 py-4 font-semibold transition
            ${
              selectedVideo
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-gray-300 text-white"
            }`}
          >
            Continue
          </button>



        </div>


      </div>


    </main>
  );
}