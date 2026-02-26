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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center gap-3 p-4">
            <Link to="/videos">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl">Video Details</h1>
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-black">
          <video
            src={video.videoUrl}
            controls
            className="w-full aspect-video"
            controlsList="nodownload"
          />
        </div>

        {/* Video Info */}
        <div className="bg-white p-4 border-b">
          <h2 className="text-2xl mb-2">{video.title}</h2>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Calendar size={14} className="mr-1" />
            {new Date(video.date).toLocaleDateString()}
          </div>
          {video.description && (
            <p className="text-gray-700">{video.description}</p>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-4">
          <h3 className="text-lg mb-4">
            Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="author" className="text-xs text-gray-600">
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
                    <Label htmlFor="role" className="text-xs text-gray-600">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={commentRole}
                      onChange={(e) =>
                        setCommentRole(e.target.value as "athlete" | "coach")
                      }
                      className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
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
                  <p className="text-xs text-gray-500">
                    Tip: Press Cmd/Ctrl + Enter to send
                  </p>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    <Send size={16} className="mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          comment.role === "coach"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        <User size={20} />
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              comment.role === "coach"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {comment.role}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap break-words">
                          {comment.text}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0"
                      >
                        <Trash2 size={16} />
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
