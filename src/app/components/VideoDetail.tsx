import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Calendar, Send, Trash2, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnailUrl: string;
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

export function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoEntry | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Athlete");
  const [commentRole, setCommentRole] = useState<"athlete" | "coach">("athlete");

  useEffect(() => {
    // Load video
    const stored = localStorage.getItem("athleteVideos");
    if (stored) {
      const videos: VideoEntry[] = JSON.parse(stored);
      const foundVideo = videos.find((v) => v.id === id);
      if (foundVideo) {
        setVideo(foundVideo);
      } else {
        // Video not found, redirect back
        navigate("/videos");
      }
    }

    // Load comments
    const storedComments = localStorage.getItem("videoComments");
    if (storedComments) {
      const allComments: Comment[] = JSON.parse(storedComments);
      setComments(allComments.filter((c) => c.videoId === id));
    }
  }, [id, navigate]);

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments.filter((c) => c.videoId === id));
    
    // Update global comments in localStorage
    const storedComments = localStorage.getItem("videoComments");
    const allComments: Comment[] = storedComments ? JSON.parse(storedComments) : [];
    const otherComments = allComments.filter((c) => c.videoId !== id);
    localStorage.setItem("videoComments", JSON.stringify([...otherComments, ...updatedComments]));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      videoId: id!,
      author: commentAuthor,
      role: commentRole,
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    saveComments(updatedComments);
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <Link to="/videos">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl">
                <ArrowLeft size={20} strokeWidth={1.8} />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Video details</h1>
          </div>
        </div>

        <div className="bg-black">
          <video
            src={video.videoUrl}
            controls
            className="w-full aspect-video"
            controlsList="nodownload"
          />
        </div>

        <div className="bg-card border-b border-border p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-2">{video.title}</h2>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar size={14} className="mr-1.5" strokeWidth={1.6} />
            {new Date(video.date).toLocaleDateString()}
          </div>
          {video.description && (
            <p className="text-muted-foreground text-sm">{video.description}</p>
          )}
        </div>

        <div className="p-4 pb-28">
          <h3 className="text-base font-semibold text-foreground mb-3">
            Comments ({comments.length})
          </h3>

          <Card className="mb-5 border border-border rounded-xl shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="author" className="text-xs text-muted-foreground">
                      Your Name
                    </Label>
                    <Input
                      id="author"
                      placeholder="Enter your name"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="role" className="text-xs text-muted-foreground">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={commentRole}
                      onChange={(e) =>
                        setCommentRole(e.target.value as "athlete" | "coach")
                      }
                      className="mt-1 w-full h-10 px-3 border border-border rounded-xl bg-input-background text-sm text-foreground"
                    >
                      <option value="athlete">Athlete</option>
                      <option value="coach">Coach</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleAddComment();
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Tip: Press Cmd/Ctrl + Enter to send
                  </p>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="rounded-xl"
                    size="sm"
                  >
                    <Send size={16} className="mr-2" strokeWidth={1.6} />
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground text-sm">
              <p>No comments yet. Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          comment.role === "coach"
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <User size={20} strokeWidth={1.6} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">
                            {comment.author}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                              comment.role === "coach"
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {comment.role}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0 flex-shrink-0 rounded-xl"
                      >
                        <Trash2 size={16} strokeWidth={1.6} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-20" />
      </div>
    </div>
  );
}
