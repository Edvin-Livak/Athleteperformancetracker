import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  videoUrl: string;
}

interface Comment {
  id: string;
  videoId: string;
  author: string;
  role: "athlete" | "coach";
  text: string;
  timestamp: string;
}

export function Compare() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const storedVideos: VideoEntry[] = JSON.parse(
      localStorage.getItem("athleteVideos") || "[]"
    );

    const selectedIds: string[] = JSON.parse(
      localStorage.getItem("compareVideos") || "[]"
    );

    let selectedVideos = storedVideos.filter((v) => selectedIds.includes(v.id));

    // ✅ Demo fallback: if user navigates here without selecting, pick first two
    if (selectedVideos.length !== 2 && storedVideos.length >= 2) {
      selectedVideos = storedVideos.slice(0, 2);
      localStorage.setItem(
        "compareVideos",
        JSON.stringify([selectedVideos[0].id, selectedVideos[1].id])
      );
    }

    setVideos(selectedVideos);

    const storedComments: Comment[] = JSON.parse(
      localStorage.getItem("videoComments") || "[]"
    );
    setComments(storedComments);
  }, []);

  const commentsByVideoId = useMemo(() => {
    const map: Record<string, Comment[]> = {};
    for (const c of comments) {
      if (!map[c.videoId]) map[c.videoId] = [];
      map[c.videoId].push(c);
    }
    // sort each list by time
    Object.values(map).forEach((list) =>
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    );
    return map;
  }, [comments]);

  if (videos.length !== 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <p className="text-gray-700 mb-4">Select two videos to compare.</p>
        <Link to="/videos">
          <Button className="bg-purple-600 hover:bg-purple-700">Go to Videos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center gap-3 p-4">
            <Link to="/videos">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl">Compare</h1>
              <p className="text-xs text-gray-500">Side-by-side analysis</p>
            </div>
          </div>
        </div>

        {/* 2-column panel */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {videos.map((video) => {
            const videoComments = commentsByVideoId[video.id] || [];

            return (
              <div key={video.id} className="space-y-3">
                {/* Video */}
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-black">
                      <video
                        src={video.videoUrl}
                        controls
                        className="w-full aspect-video object-cover"
                        controlsList="nodownload"
                      />
                    </div>

                    <div className="p-3">
                      <p className="text-sm font-semibold leading-snug line-clamp-2">
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-600 leading-snug line-clamp-2 mt-0.5">
                        {video.description || "—"}
                      </p>
                      <div className="flex items-center text-[11px] text-gray-500 mt-2">
                        <Calendar size={12} className="mr-1" />
                        {new Date(video.date).toLocaleDateString()}
                      </div>

                      <Link to={`/videos/${video.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                        >
                          Open Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments (read-only on compare screen) */}
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-700">
                        Comments ({videoComments.length})
                      </p>
                    </div>

                    {videoComments.length === 0 ? (
                      <p className="text-xs text-gray-500">
                        No comments for this video yet.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {videoComments.map((c) => (
                          <div
                            key={c.id}
                            className={`rounded-lg p-2 text-xs border ${
                              c.role === "coach"
                                ? "bg-blue-50 border-blue-100"
                                : "bg-purple-50 border-purple-100"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  c.role === "coach"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                <User size={14} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium truncate">
                                    {c.author}
                                  </span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                                      c.role === "coach"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    {c.role}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {new Date(c.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-800 whitespace-pre-wrap break-words">
                              {c.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom spacing for nav */}
        <div className="h-24" />
      </div>
    </div>
  );
}