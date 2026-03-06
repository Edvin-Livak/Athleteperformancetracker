import { useState, useEffect } from "react";
import { Plus, Play, Trash2, Calendar, Video, Columns2, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Link, useNavigate, useLocation } from "react-router";

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export function Videos() {
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  useEffect(() => {
    const startCompare = (location.state as any)?.startCompare;

    if (startCompare) {
      setCompareMode(true);
      setSelected([]);

      // optional: clear state so it doesn't re-trigger on back/refresh
      navigate("/videos", { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem("athleteVideos");

    if (stored) {
      setVideos(JSON.parse(stored));
    } else {
      // 👇 Hardcoded demo videos
      const demoVideos: VideoEntry[] = [
        {
          id: "1",
          title: "100m District Heat",
          description: "12.34s (PB)",
          date: new Date("2024-05-12").toISOString(),
          thumbnailUrl: "",
          videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        },
        {
          id: "2",
          title: "100m Regional Final",
          description: "12.51s",
          date: new Date("2024-06-03").toISOString(),
          thumbnailUrl: "",
          videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        },
        {
          id: "3",
          title: "200m Training Session",
          description: "25.80s",
          date: new Date("2024-04-21").toISOString(),
          thumbnailUrl: "",
          videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        },
        {
          id: "4",
          title: "Start Technique Drill",
          description: "Block reaction focus",
          date: new Date("2024-03-15").toISOString(),
          thumbnailUrl: "",
          videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        },
        {
          id: "5",
          title: "100m Nationals",
          description: "12.29s",
          date: new Date("2024-07-01").toISOString(),
          thumbnailUrl: "",
          videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        },
      ];

      setVideos(demoVideos);
      localStorage.setItem("athleteVideos", JSON.stringify(demoVideos));
    }
  }, []);

  const saveVideos = (updatedVideos: VideoEntry[]) => {
    setVideos(updatedVideos);
    localStorage.setItem("athleteVideos", JSON.stringify(updatedVideos));
  };

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.videoUrl) return;

    const video: VideoEntry = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description,
      date: new Date().toISOString(),
      thumbnailUrl: "",
      videoUrl: newVideo.videoUrl,
    };

    saveVideos([video, ...videos]);
    setNewVideo({ title: "", description: "", videoUrl: "" });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    saveVideos(videos.filter((v) => v.id !== id));
  };

  const toggleCompareMode = () => {
    setCompareMode((prev) => {
      const next = !prev;
      if (!next) setSelected([]); // leaving compare mode clears selection
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // limit to 2
      return [...prev, id];
    });
  };

  const goToCompare = () => {
    if (selected.length !== 2) return;
    localStorage.setItem("compareVideos", JSON.stringify(selected));
    navigate("/compare");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-6">
          <div>
            <h1 className="text-3xl mb-1">Videos</h1>
            <p className="text-gray-600">
              {videos.length} video
              {videos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={toggleCompareMode}
              variant="outline"
              className={`border-gray-500 flex items-center gap-2 ${
    compareMode ? "text-gray-700 bg-gray-200 border-gray-500" : "text-gray-700"
  }`}
              size="lg"
            >
              {compareMode ? <X size={20} /> : <Columns2 size={20} />}
              Compare Videos
            </Button>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              <Plus size={20}className="mr-2" />
            Add Entry
            </Button>
          </div>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg mb-2">No videos yet</h3>
              <p className="text-gray-600 mb-4">
                Upload your first training video
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={20} className="mr-2" />
                Add Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {videos.map((video) => {
              const isSelected = selected.includes(video.id);

              const Tile = (
                <div className="group">
                  <Card
                    className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow ${
                      compareMode && isSelected ? "ring-4 ring-purple-600" : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <Play size={32} className="text-purple-600" />

                        {/* subtle overlay */}
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Selected badge */}
                        {compareMode && isSelected && (
                          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            Selected
                          </div>
                        )}

                        {/* Delete button overlay */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(video.id);
                          }}
                          className="absolute top-1.5 right-1.5 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white text-red-600 hover:text-red-700 shadow"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {/* Text under thumbnail */}
                      <div className="px-2.5 py-2">
                        <p className="text-sm font-medium leading-snug line-clamp-1">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-600 leading-snug line-clamp-1">
                          {video.description ? video.description : "—"}
                        </p>
                        <div className="mt-1 flex items-center text-[11px] text-gray-500">
                          <Calendar size={12} className="mr-1" />
                          {new Date(video.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );

              // Normal mode: link to details
              if (!compareMode) {
                return (
                  <Link to={`/videos/${video.id}`} key={video.id}>
                    {Tile}
                  </Link>
                );
              }

              // Compare mode: click selects
              return (
                <div
                  key={video.id}
                  onClick={() => toggleSelect(video.id)}
                  className="cursor-pointer"
                >
                  {Tile}
                </div>
              );
            })}
          </div>
        )}
        {compareMode && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20">
            <Button
              onClick={goToCompare}
              disabled={selected.length !== 2}
              className="bg-purple-600 hover:bg-purple-700 shadow-lg px-6"
            >
              Compare ({selected.length}/2)
            </Button>
          </div>
        )}

        {/* Add Video Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>
                Add a new video to your collection.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Sprint Training Session"
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({
                      ...newVideo,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Notes about this video..."
                  value={newVideo.description}
                  onChange={(e) =>
                    setNewVideo({
                      ...newVideo,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://..."
                  value={newVideo.videoUrl}
                  onChange={(e) =>
                    setNewVideo({
                      ...newVideo,
                      videoUrl: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500">
                  Note: This demo stores video URLs. In production, you'd upload
                  actual video files.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={!newVideo.title || !newVideo.videoUrl}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
