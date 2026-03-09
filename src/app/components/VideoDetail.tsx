import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Calendar, Send, Trash2, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

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

  const [athleteName, setAthleteName] = useState("Athlete");
  const [coachName, setCoachName] = useState("Coach");

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        window.clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
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

    const storedComments = localStorage.getItem(COMMENT_KEY);
    let allComments: Comment[] = storedComments
      ? JSON.parse(storedComments)
      : [];

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

    const currentVideoComments = allComments.filter((c) => c.videoId === id);
    setComments(currentVideoComments);
  }, [id, navigate]);

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments.filter((c) => c.videoId === id));

    const storedComments = localStorage.getItem(COMMENT_KEY);
    const allComments: Comment[] = storedComments
      ? JSON.parse(storedComments)
      : [];
    const otherComments = allComments.filter((c) => c.videoId !== id);

    localStorage.setItem(
      COMMENT_KEY,
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

      const stored = localStorage.getItem(COMMENT_KEY);
      const all: Comment[] = stored ? JSON.parse(stored) : [];
      const updatedAll = [...all, coachReply];
      localStorage.setItem(COMMENT_KEY, JSON.stringify(updatedAll));

      setComments((prev) => [...prev, coachReply]);
    }, 3000);
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    saveComments(updatedComments);
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <Link to="/videos">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl"
              >
                <ArrowLeft size={18} strokeWidth={1.8} />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-foreground truncate">
                Video details
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Review and discuss performance
              </p>
            </div>
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
        <div className="px-4 pt-3">
          <div className="pb-3 border-b border-border">
            <h2 className="text-[14px] font-semibold text-foreground leading-snug">
              {video.title}
            </h2>

            <div className="flex items-center text-[11px] text-muted-foreground mt-1">
              <Calendar size={11} className="mr-1" strokeWidth={1.8} />
              {new Date(video.date).toLocaleDateString()}
            </div>

            {video.description && (
              <p className="text-[12px] text-muted-foreground mt-1.5 leading-snug">
                {video.description}
              </p>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Comments</h3>
            <span className="text-xs text-muted-foreground">
              {comments.length}
            </span>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <Card className="border border-border rounded-2xl shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No comments yet. Be the first to comment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border border-border rounded-xl shadow-sm"
                >
                  <CardContent className="p-2.5">
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          comment.role === "Coach"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        <User size={16} strokeWidth={1.8} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 mb-0.5">
                          <span className="text-[13px] font-medium text-foreground">
                            {comment.author}
                          </span>

                          <span
                            className={`text-[9px] px-1 py-0.5 rounded ${
                              comment.role === "Coach"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-violet-100 text-violet-700"
                            }`}
                          >
                            {comment.role}
                          </span>

                          <span className="text-[9px] text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-[12px] text-foreground whitespace-pre-wrap break-words leading-relaxed">
                          {comment.text}
                        </p>
                      </div>

                      {comment.role === "Athlete" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0 rounded-lg flex-shrink-0"
                        >
                          <Trash2 size={13} strokeWidth={1.8} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {/* Add Comment */}
          <Card className="mb-3 border border-border rounded-xl shadow-sm">
            <CardContent className="p-3">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Commenting as{" "}
                  <span className="font-medium text-foreground">
                    {athleteName}
                  </span>
                </div>

                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="resize-none text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleAddComment();
                    }
                  }}
                />

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground"></p>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-violet-600 hover:bg-violet-700 rounded-xl h-7 px-3 text-xs"
                    size="sm"
                  >
                    <Send size={14} className="mr-1.0" strokeWidth={1.8} />
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
