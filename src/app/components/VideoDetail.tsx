import { useState, useEffect, useRef } from "react";
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
  role: "Athlete" | "Coach";
  text: string;
  timestamp: string;
}

const PROFILE_KEY = "athleteProfile";
const COACHES_KEY = "athleteCoaches";
const COMMENT_KEY = "videoComments";

const SEEDED_COACH_VIDEO_IDS = ["1", "2", "5"];

const COACH_SEED_TEXT: Record<string, string> = {
  "1": "First look: your posture rises a bit early. Try staying low for the first 6–8 steps.",
  "2": "Good race. Mark where you feel you lose relaxation and we’ll compare timing.",
  "5": "Strong finish. Let’s compare your first 30m with your district heat video.",
};

// 5 pre-generated coach responses
const COACH_QUICK_REPLIES = [
  "Good note. Next time: focus on one cue only and rewatch the first 3 seconds.",
  "Nice. Can you timestamp where you think the key change happens?",
  "Agree. Compare the first 10m — your hips are slightly higher in one run.",
  "That’s a solid observation. Try to link it to a single action for next session.",
  "Good reflection. Watch your arm swing symmetry after 30m.",
];

const getRandomCoachName = () => {
  try {
    const stored = localStorage.getItem(COACHES_KEY);
    const coaches = stored ? JSON.parse(stored) : [];

    if (Array.isArray(coaches) && coaches.length > 0) {
      const names = coaches
        .map((c: any) => c?.name)
        .filter((n: any) => typeof n === "string" && n.trim().length > 0);

      if (names.length > 0) {
        return names[Math.floor(Math.random() * names.length)];
      }
    }
  } catch {
    // ignore parse errors
  }
  return "Coach";
};

export function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoEntry | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const replyTimeoutRef = useRef<number | null>(null);
  const getAutoKey = (videoId: string) => `videoAutoReplyIndex:${videoId}`;

  const [athleteName, setAthleteName] = useState("Athlete");
  const [coachName, setCoachName] = useState("Coach");

  const resetAndSeedComments = () => {
    // 1) delete all comments
    localStorage.removeItem(COMMENT_KEY);

    // 2) seed 3 videos with coach comments
    const seedTime = new Date().toISOString();
    const seeded: Comment[] = SEEDED_COACH_VIDEO_IDS.map((videoId) => ({
      id: `seed-${videoId}`,
      videoId,
      author: getRandomCoachName(),
      role: "Coach",
      text:
        COACH_SEED_TEXT[videoId] ||
        "Initial note: focus on one improvement cue.",
      timestamp: seedTime,
    }));

    localStorage.setItem(COMMENT_KEY, JSON.stringify(seeded));

    // 3) reload to show changes immediately
    window.location.reload();
  };

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Load video
    const stored = localStorage.getItem("athleteVideos");
    const storedProfile = localStorage.getItem(PROFILE_KEY);
    const storedCoaches = localStorage.getItem(COACHES_KEY);

    let initialCoachName = "Coach";
    if (storedCoaches) {
      const coaches = JSON.parse(storedCoaches);
      if (Array.isArray(coaches) && coaches.length > 0) {
        initialCoachName = coaches[0]?.name || "Coach";
        setCoachName(initialCoachName);
      }
    }

    if (stored) {
      const videos: VideoEntry[] = JSON.parse(stored);
      const foundVideo = videos.find((v) => v.id === id);
      if (foundVideo) {
        setVideo(foundVideo);
      } else {
        // Video not found, redirect back
        navigate("/videos");
      }
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setAthleteName(profile?.name || "Athlete");
      }
      if (storedCoaches) {
        const coaches = JSON.parse(storedCoaches);
        if (Array.isArray(coaches) && coaches.length > 0) {
          setCoachName(coaches[0]?.name || "Coach");
        }
      }
    }

    // Load comments
    // Load comments
    // Load comments (and seed demo coach comments once)
    const storedComments = localStorage.getItem(COMMENT_KEY);
    let allComments: Comment[] = storedComments
      ? JSON.parse(storedComments)
      : [];

    // Seed only if there are no comments at all yet
    if (allComments.length === 0) {
      const seedTime = new Date().toISOString();

      allComments = SEEDED_COACH_VIDEO_IDS.map((videoId) => ({
        id: `seed-${videoId}`,
        videoId,
        author: getRandomCoachName(),
        role: "Coach" as const,
        text:
          COACH_SEED_TEXT[videoId] ||
          "Initial note: focus on one improvement cue.",
        timestamp: seedTime,
      }));

      localStorage.setItem(COMMENT_KEY, JSON.stringify(allComments));
    }

    // Now show only comments for this video
    const currentVideoComments = allComments.filter((c) => c.videoId === id);
    setComments(currentVideoComments);
  }, [id, navigate]);

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments.filter((c) => c.videoId === id));

    // Update global comments in localStorage
    const storedComments = localStorage.getItem("videoComments");
    const allComments: Comment[] = storedComments
      ? JSON.parse(storedComments)
      : [];
    const otherComments = allComments.filter((c) => c.videoId !== id);
    localStorage.setItem(
      "videoComments",
      JSON.stringify([...otherComments, ...updatedComments]),
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !id) return;

    const comment: Comment = {
      id: Date.now().toString(),
      videoId: id,
      author: athleteName,
      role: "Athlete",
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment("");

    // Auto coach reply after athlete comment (3 seconds)
    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = window.setTimeout(() => {
      const replyText =
        COACH_QUICK_REPLIES[
          Math.floor(Math.random() * COACH_QUICK_REPLIES.length)
        ];

      const coachReply: Comment = {
        id: `${Date.now().toString()}-coach`,
        videoId: id,
        author: getRandomCoachName(),
        role: "Coach",
        text: replyText,
        timestamp: new Date().toISOString(),
      };

      // Update global storage
      const stored = localStorage.getItem(COMMENT_KEY);
      const all: Comment[] = stored ? JSON.parse(stored) : [];
      const updatedAll = [...all, coachReply];
      localStorage.setItem(COMMENT_KEY, JSON.stringify(updatedAll));

      // Update screen state for this video
      setComments((prev) => [...prev, coachReply]);
    }, 3000);
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
        {/*<Button variant="outline" size="sm" onClick={resetAndSeedComments}>
  Reset & Seed
</Button>

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
          <h3 className="text-lg mb-4">Comments ({comments.length})</h3>

          {/* Add Comment */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-xs text-gray-500">
                  Commenting as{" "}
                  <span className="font-medium text-gray-700">
                    {athleteName}
                  </span>
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
                          comment.role === "Coach"
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
                              comment.role === "Coach"
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
                      {comment.role === "Athlete" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
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
