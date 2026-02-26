import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  videoUrl: string;
}

export function Compare() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);

  useEffect(() => {
    const storedVideos = JSON.parse(
      localStorage.getItem("athleteVideos") || "[]"
    );

    const selectedIds = JSON.parse(
      localStorage.getItem("compareVideos") || "[]"
    );

    const selectedVideos = storedVideos.filter((v: VideoEntry) =>
      selectedIds.includes(v.id)
    );

    setVideos(selectedVideos);
  }, []);

  if (videos.length !== 2) {
    return (
      <div className="p-6 text-center">
        <p>Select two videos to compare.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6">

        <h1 className="text-2xl font-semibold text-center">Performance Comparison</h1>

        {/* Side by side comparison */}
        <div className="grid grid-cols-2 gap-3">
          {videos.map((video) => (
            <Card key={video.id}>
              <CardContent className="p-3 space-y-2">

                <div className="aspect-square bg-black flex items-center justify-center">
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium">{video.title}</p>
                  <p className="text-xs text-gray-600">{video.description}</p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytical comparison section */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold">Analysis</h2>

            <div className="text-sm">
              <p>
                <span className="font-medium">Result Difference:</span>{" "}
                (Manual analysis)
              </p>

              <p>
                <span className="font-medium">Start Reaction:</span>{" "}
                Compare block exit timing
              </p>

              <p>
                <span className="font-medium">Stride Pattern:</span>{" "}
                Observe mid-race posture
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}