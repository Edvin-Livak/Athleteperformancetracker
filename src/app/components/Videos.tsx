import { useState, useEffect } from "react";
import { Plus, Play, Trash2, Calendar, Video, Columns2, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Link, useNavigate, useLocation } from "react-router";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";

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
      navigate("/videos", { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem("athleteVideos");

    if (stored) {
      setVideos(JSON.parse(stored));
    } /**else {
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
    }*/
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
    setSelected((prev) => prev.filter((x) => x !== id));
  };

  const toggleCompareMode = () => {
    setCompareMode((prev) => {
      const next = !prev;
      if (!next) setSelected([]);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const goToCompare = () => {
    if (selected.length !== 2) return;
    localStorage.setItem("compareVideos", JSON.stringify(selected));
    navigate("/compare");
  };

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">
              Videos
            </h1>
            <p className="text-muted-foreground text-sm">
              {videos.length} video{videos.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={toggleCompareMode}
              variant={compareMode ? "default" : "outline"}
              size="sm"
              className={`rounded-xl ${
                compareMode
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "border-border/60"
              }`}
            >
              {compareMode ? (
                <X size={16} strokeWidth={1.8} />
              ) : (
                <Columns2 size={16} strokeWidth={1.8} />
              )}
              compare
            </Button>

            <Button
              onClick={() => setIsDialogOpen(true)}
              size="lg"
              className="rounded-xl bg-violet-600 hover:bg-violet-700"
            >
              <Plus size={20} strokeWidth={1.8} />
            </Button>
          </div>
        </div>

        {videos.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-violet-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video
                  size={32}
                  className="text-violet-600"
                  strokeWidth={1.6}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No videos yet
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload your first training video
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="rounded-xl bg-violet-600 hover:bg-violet-700"
              >
                <Plus size={18} className="mr-2" strokeWidth={1.8} />
                Add video
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
                    className={`overflow-hidden border border-border rounded-xl shadow-sm hover:shadow-md hover:border-violet-200 transition-all ${
                      compareMode && isSelected
                        ? "ring-2 ring-violet-500 border-violet-300"
                        : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-violet-100 flex items-center justify-center">
                        <Play
                          size={28}
                          className="text-violet-600"
                          strokeWidth={1.8}
                        />

                        {compareMode && isSelected && (
                          <div className="absolute top-1.5 left-1.5 bg-violet-600 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                            Selected
                          </div>
                        )}

                        <ConfirmDeleteButton
                          onConfirm={() => handleDelete(video.id)}
                          title="Delete video?"
                          description="This video will be permanently removed and cannot be recovered."
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="absolute top-1.5 right-1.5 h-7 w-7 p-0 rounded-lg bg-white/85 hover:bg-white text-destructive hover:text-destructive shadow-sm inline-flex items-center justify-center"
                          >
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        </ConfirmDeleteButton>
                      </div>

                      <div className="px-2 py-2">
                        <p className="text-[12px] font-semibold text-foreground leading-tight line-clamp-1">
                          {video.title}
                        </p>

                        <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1 mt-0.5">
                          {video.description ? video.description : "—"}
                        </p>

                        <div className="mt-1 flex items-center text-[10px] text-muted-foreground">
                          <Calendar
                            size={10}
                            className="mr-1"
                            strokeWidth={1.8}
                          />
                          {new Date(video.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );

              if (!compareMode) {
                return (
                  <Link to={`/videos/${video.id}`} key={video.id}>
                    {Tile}
                  </Link>
                );
              }

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
              className="bg-violet-600 hover:bg-violet-700 shadow-lg px-6 rounded-xl"
            >
              Compare ({selected.length}/2)
            </Button>
          </div>
        )}

        {/* Add Video - bottom drawer */}
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent className="max-w-md mx-auto flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Add New Video</DrawerTitle>
              <DrawerDescription>
                Add a new video to your collection.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-4 px-4 pb-4 overscroll-contain">
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
                <p className="text-xs text-muted-foreground">
                  Note: This demo stores video URLs. In production, you would
                  upload actual video files.
                </p>
              </div>
            </div>

            <DrawerFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={!newVideo.title || !newVideo.videoUrl}
                className="rounded-xl bg-violet-600 hover:bg-violet-700"
              >
                Add video
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
