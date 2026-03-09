import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  User,
  Smartphone,
  RotateCw,
  Play,
  Pause,
  RotateCcw,
  Bookmark,
  X,
} from "lucide-react";
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
  const [isLandscape, setIsLandscape] = useState(false);

  const [startMarkers, setStartMarkers] = useState<{
    left: number;
    right: number;
  }>({
    left: 0,
    right: 0,
  });

  const leftVideoRef = useRef<HTMLVideoElement | null>(null);
  const rightVideoRef = useRef<HTMLVideoElement | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const storedVideos: VideoEntry[] = JSON.parse(
      localStorage.getItem("athleteVideos") || "[]",
    );

    const selectedIds: string[] = JSON.parse(
      localStorage.getItem("compareVideos") || "[]",
    );

    let selectedVideos = storedVideos.filter((v) => selectedIds.includes(v.id));

    if (selectedVideos.length !== 2 && storedVideos.length >= 2) {
      selectedVideos = storedVideos.slice(0, 2);
      localStorage.setItem(
        "compareVideos",
        JSON.stringify([selectedVideos[0].id, selectedVideos[1].id]),
      );
    }

    setVideos(selectedVideos);

    const storedComments: Comment[] = JSON.parse(
      localStorage.getItem("videoComments") || "[]",
    );
    setComments(storedComments);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const commentsByVideoId = useMemo(() => {
    const map: Record<string, Comment[]> = {};

    for (const c of comments) {
      if (!map[c.videoId]) map[c.videoId] = [];
      map[c.videoId].push(c);
    }

    Object.values(map).forEach((list) =>
      list.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    );

    return map;
  }, [comments]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);

    if (mins > 0) {
      return `${mins}:${String(secs).padStart(2, "0")}.${tenths}`;
    }

    return `${secs}.${tenths}s`;
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getResultFromTitle = (title: string) => {
    const match = title.match(/\(([^)]+)\)/);
    return match ? `(${match[1]})` : "";
  };

  const getMainTitle = (title: string) => {
    return title.replace(/\s*\([^)]+\)\s*/g, "").trim();
  };

  const applyStartMarkers = () => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;

    if (!left || !right) return;

    left.currentTime = startMarkers.left;
    right.currentTime = startMarkers.right;
  };

  const playBoth = async () => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;

    if (!left || !right) return;

    try {
      isSyncingRef.current = true;
      await Promise.allSettled([left.play(), right.play()]);
    } finally {
      isSyncingRef.current = false;
    }
  };

  const pauseBoth = () => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;

    if (!left || !right) return;

    isSyncingRef.current = true;
    left.pause();
    right.pause();
    isSyncingRef.current = false;
  };

  const resetToMarkers = () => {
    pauseBoth();
    applyStartMarkers();
  };

  const playFromMarkers = async () => {
    resetToMarkers();
    await playBoth();
  };

  const handleVideoPlay = async (source: "left" | "right") => {
    if (isSyncingRef.current) return;

    const otherVideo =
      source === "left" ? rightVideoRef.current : leftVideoRef.current;

    if (!otherVideo) return;

    try {
      isSyncingRef.current = true;
      if (otherVideo.paused) {
        await otherVideo.play();
      }
    } finally {
      isSyncingRef.current = false;
    }
  };

  const handleVideoPause = (source: "left" | "right") => {
    if (isSyncingRef.current) return;

    const otherVideo =
      source === "left" ? rightVideoRef.current : leftVideoRef.current;

    if (!otherVideo) return;

    isSyncingRef.current = true;
    otherVideo.pause();
    isSyncingRef.current = false;
  };

  const setMarkerHere = (side: "left" | "right") => {
    const video = side === "left" ? leftVideoRef.current : rightVideoRef.current;
    if (!video) return;

    setStartMarkers((prev) => ({
      ...prev,
      [side]: video.currentTime,
    }));
  };

  const clearMarker = (side: "left" | "right") => {
    setStartMarkers((prev) => ({
      ...prev,
      [side]: 0,
    }));
  };

  const setBothMarkersHere = () => {
    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    setStartMarkers({
      left: left.currentTime,
      right: right.currentTime,
    });
  };

  if (videos.length !== 2) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center flex items-center justify-center">
        <div>
          <p className="text-gray-700 mb-4">Select two videos to compare.</p>
          <Link to="/videos">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Go to Videos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const leftVideo = videos[0];
  const rightVideo = videos[1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-none mx-auto">
        <div className="bg-white border-b sticky top-0 z-20">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Link to="/videos">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <ArrowLeft size={16} />
              </Button>
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-gray-900 leading-none">
                Compare
              </h1>
              <p className="text-[10px] text-gray-500 leading-none mt-0.5">
                Side-by-side performance analysis
              </p>
            </div>
          </div>
        </div>

        {!isLandscape && (
          <div className="p-2">
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-3 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <RotateCw size={16} />
                </div>

                <h2 className="text-xs font-semibold text-gray-900 mb-1">
                  Rotate your phone for compare mode
                </h2>

                <p className="text-xs text-gray-600 mb-2">
                  Compare works best in landscape so both videos stay visible
                  together.
                </p>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                  <Smartphone size={12} />
                  Turn your phone sideways
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 p-2">
          {[leftVideo, rightVideo].map((video, index) => {
            const side = index === 0 ? "left" : "right";
            const marker = startMarkers[side];
            const resultText = getResultFromTitle(video.title);
            const mainTitle = getMainTitle(video.title);

            return (
              <div key={video.id} className="flex flex-col gap-1.5">
                <Card className="overflow-hidden border shadow-sm">
                  <CardContent className="p-0">
                    <div className="bg-black">
                      <video
                        ref={(el) => {
                          if (side === "left") leftVideoRef.current = el;
                          if (side === "right") rightVideoRef.current = el;
                        }}
                        src={video.videoUrl}
                        controls
                        className={`w-full object-cover ${
                          isLandscape ? "aspect-video" : "aspect-[9/14]"
                        }`}
                        controlsList="nodownload"
                        onPlay={() => handleVideoPlay(side)}
                        onPause={() => handleVideoPause(side)}
                      />
                    </div>

                    <div className="px-1.5 pt-1.5 pb-0">
                      <div className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-0.5 items-start">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-gray-900 truncate leading-tight">
                            {mainTitle}
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-500 leading-tight whitespace-nowrap">
                          {formatShortDate(video.date)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-700 truncate leading-tight">
                            {resultText || "—"}
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-600 leading-tight whitespace-nowrap">
                          Video {index + 1} · {formatTime(marker)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 mt-1.5 items-stretch">
                        <Button
                          size="sm"
                          onClick={() => setMarkerHere(side)}
                          variant="outline"
                          className="h-6 text-[9px] px-1.5"
                        >
                          <Bookmark size={10} className="mr-1" />
                          Mark
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => clearMarker(side)}
                          variant="outline"
                          className="h-6 text-[9px] px-1.5"
                        >
                          <X size={10} className="mr-1" />
                          Clear
                        </Button>

                        <Link to={`/videos/${video.id}`} className="block">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-full text-[9px] px-1.5"
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="px-2 pb-2">
          <div className="grid grid-cols-5 gap-1">
            <Button
              size="sm"
              onClick={playBoth}
              className="h-6 text-[9px] px-1.5 bg-purple-600 hover:bg-purple-700"
            >
              <Play size={10} className="mr-1" />
              Play
            </Button>

            <Button
              size="sm"
              onClick={pauseBoth}
              variant="outline"
              className="h-6 text-[9px] px-1.5"
            >
              <Pause size={10} className="mr-1" />
              Pause
            </Button>

            <Button
              size="sm"
              onClick={resetToMarkers}
              variant="outline"
              className="h-6 text-[9px] px-1.5"
            >
              <RotateCcw size={10} className="mr-1" />
              Reset
            </Button>

            
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-2 pb-2">
          {[leftVideo, rightVideo].map((video) => {
            const videoComments = commentsByVideoId[video.id] || [];

            return (
              <Card
                key={video.id}
                className={`border shadow-sm ${
                  isLandscape ? "min-h-[180px]" : ""
                }`}
              >
                <CardContent
                  className={isLandscape ? "p-2 h-full flex flex-col" : "p-2"}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-semibold text-gray-700 text-[10px]">
                      Comments ({videoComments.length})
                    </p>
                  </div>

                  {videoComments.length === 0 ? (
                    <p className="text-gray-500 text-[10px]">
                      No comments for this video yet.
                    </p>
                  ) : (
                    <div
                      className={`space-y-1.5 pr-1 overflow-y-auto ${
                        isLandscape ? "flex-1 min-h-0 max-h-none" : "max-h-44"
                      }`}
                    >
                      {videoComments.map((c) => (
                        <div
                          key={c.id}
                          className={`rounded-lg border p-1.5 ${
                            c.role === "coach"
                              ? "bg-blue-50 border-blue-100"
                              : "bg-purple-50 border-purple-100"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <div
                              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${
                                c.role === "coach"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              <User size={10} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium truncate text-[10px]">
                                  {c.author}
                                </span>
                                <span
                                  className={`px-1 py-0.5 rounded text-[8px] ${
                                    c.role === "coach"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {c.role}
                                </span>
                              </div>

                              <div className="text-gray-500 text-[8px]">
                                {new Date(c.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-800 whitespace-pre-wrap break-words text-[10px] leading-tight">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className={isLandscape ? "h-1" : "h-4"} />
      </div>
    </div>
  );
}