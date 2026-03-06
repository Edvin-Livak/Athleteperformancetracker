import { useState, useEffect } from "react";
import {
  Plus,
  Play,
  Trash2,
  Video,
} from "lucide-react";
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
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const SPORTS_FALLBACK_THUMBNAILS = [
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=640&h=360&fit=crop&q=85",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&h=360&fit=crop&q=85",
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=640&h=360&fit=crop&q=85",
  "https://images.unsplash.com/photo-1461896836934-14e5300c3a48?w=640&h=360&fit=crop&q=85",
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=640&h=360&fit=crop&q=85",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640&h=360&fit=crop&q=85",
  "https://images.unsplash.com/photo-1596495573069-2c8e0b60e47b?w=640&h=360&fit=crop&q=85",
];

/** Sports-related thumbnail – use stored URL or pick one by video id so each card looks different. */
function thumbnailForVideo(video: { id: string; thumbnailUrl: string }): string {
  if (video.thumbnailUrl?.trim()) return video.thumbnailUrl;
  const index = Math.abs([...video.id].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)) % SPORTS_FALLBACK_THUMBNAILS.length;
  return SPORTS_FALLBACK_THUMBNAILS[index];
}

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
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("athleteVideos");
    if (stored) {
      setVideos(JSON.parse(stored));
    }
  }, []);

  const saveVideos = (updatedVideos: VideoEntry[]) => {
    setVideos(updatedVideos);
    localStorage.setItem(
      "athleteVideos",
      JSON.stringify(updatedVideos),
    );
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

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">Videos</h1>
            <p className="text-muted-foreground text-sm">
              {videos.length} video{videos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="rounded-xl">
            <Plus size={20} strokeWidth={1.8} />
          </Button>
        </div>

        {videos.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video size={32} className="text-primary" strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No videos yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add your first training or race video
              </p>
              <Button onClick={() => setIsDialogOpen(true)} size="lg" className="rounded-xl">
                <Plus size={20} className="mr-2" strokeWidth={1.8} />
                Add video
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {videos.map((video) => (
              <Link to={`/videos/${video.id}`} key={video.id} className="block">
                <article className="group rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                  {/* Thumbnail – always show image (real or default) */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <ImageWithFallback
                      src={thumbnailForVideo(video)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100">
                        <Play size={28} className="ml-1" strokeWidth={2} fill="currentColor" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 bg-black/75 text-white text-[10px] font-medium tabular-nums">
                      Video
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(video.id);
                      }}
                      className="absolute top-1.5 right-1.5 h-8 w-8 p-0 rounded-lg bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} strokeWidth={1.8} />
                    </Button>
                  </div>
                  {/* Info – YouTube-style: title, then metadata line */}
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {video.description || "Performance video"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {new Date(video.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Add Video - bottom drawer */}
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent className="max-w-md mx-auto">
            <DrawerHeader>
              <DrawerTitle>Add New Video</DrawerTitle>
              <DrawerDescription>
                Add a new video to your collection.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-4 pb-4">
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
                  Note: This demo stores video URLs. In
                  production, you'd upload actual video files.
                </p>
              </div>
            </div>
            <DrawerFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddVideo}
                disabled={!newVideo.title || !newVideo.videoUrl}
                className="rounded-xl"
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