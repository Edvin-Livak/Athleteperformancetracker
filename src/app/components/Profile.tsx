import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Search,
  UserPlus,
  Settings,
  Mail,
  User,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Coach = {
  id: string;
  name: string;
  sport: string;
  club?: string;
};

type ProfileInfo = {
  name: string;
  username: string;
  email: string;
};

const DEMO_PROFILE: ProfileInfo = {
  name: "Athlete Name",
  username: "athlete01",
  email: "athlete@email.com",
};

const DEMO_COACHES: Coach[] = [
  {
    id: "c1",
    name: "Coach Lina Andersson",
    sport: "Sprinting",
    club: "IFK Track",
  },
  {
    id: "c2",
    name: "Coach Johan Nilsson",
    sport: "Strength & Conditioning",
    club: "Performance Lab",
  },
  {
    id: "c3",
    name: "Coach Sara Berg",
    sport: "Starts & Acceleration",
    club: "Sprint Academy",
  },
  {
    id: "c4",
    name: "Coach Emil Karlsson",
    sport: "Technique",
    club: "Athletics Club",
  },
  {
    id: "c5",
    name: "Coach Maya Lind",
    sport: "Mental Performance",
    club: "Mindset Studio",
  },
];

const STORAGE_KEY = "athleteCoaches";
const PROFILE_KEY = "athleteProfile";

export function Profile() {
  const [profile] = useState<ProfileInfo>(DEMO_PROFILE);

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isCoachDialogOpen, setIsCoachDialogOpen] = useState(false);

  // 0 = "Your coaches", 1 = "Find coaches"
  const [tab, setTab] = useState<0 | 1>(0);
  const [search, setSearch] = useState("");

  // Simple swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCoaches(JSON.parse(stored));
    } else {
      // Seed with 1 coach for demo
      const seeded = [DEMO_COACHES[0]];
      setCoaches(seeded);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    }
  }, []);

  useEffect(() => {
    const storedProfile = localStorage.getItem(PROFILE_KEY);
    if (!storedProfile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEMO_PROFILE));
    }
  }, []);

  const saveCoaches = (updated: Coach[]) => {
    setCoaches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const yourCoachIds = useMemo(
    () => new Set(coaches.map((c) => c.id)),
    [coaches],
  );

  const filteredFindCoaches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DEMO_COACHES.filter((c) => {
      const hay = `${c.name} ${c.sport} ${c.club || ""}`.toLowerCase();
      return q ? hay.includes(q) : true;
    });
  }, [search]);

  const addCoach = (coach: Coach) => {
    if (yourCoachIds.has(coach.id)) return;
    saveCoaches([coach, ...coaches]);
  };

  const removeCoach = (id: string) => {
    saveCoaches(coaches.filter((c) => c.id !== id));
  };

  const openCoachDialog = () => {
    setTab(0);
    setSearch("");
    setIsCoachDialogOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX == null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - touchStartX;

    // Swipe threshold
    if (dx < -50) {
      // swiped left -> go to Find
      setTab(1);
    } else if (dx > 50) {
      // swiped right -> go to Your coaches
      setTab(0);
    }
    setTouchStartX(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center gap-3 p-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl">Profile</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <BadgeCheck size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-snug">
                    {profile.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    @{profile.username}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail size={16} className="text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{profile.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={16} className="text-gray-500" />
                  <span className="font-medium">Username:</span>
                  <span className="truncate">@{profile.username}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coaches */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Your Coaches</p>
                  <p className="text-xs text-gray-600">
                    {coaches.length} connected
                  </p>
                </div>
                <Button
                  onClick={openCoachDialog}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Search size={16} className="mr-2" />
                  Your coaches
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardContent className="p-4">
              <Button variant="outline" className="w-full justify-center">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                (Demo: settings can be added later)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coaches Dialog */}
        <Dialog open={isCoachDialogOpen} onOpenChange={setIsCoachDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Coaches</DialogTitle>

              {/* Tabs (also swipeable) */}
              <div className="mt-3 flex gap-2">
                <button
                  className={`flex-1 h-9 rounded-lg text-sm font-medium border transition-colors ${
                    tab === 0
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                  onClick={() => setTab(0)}
                >
                  Your coaches
                </button>
                <button
                  className={`flex-1 h-9 rounded-lg text-sm font-medium border transition-colors ${
                    tab === 1
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                  onClick={() => setTab(1)}
                >
                  Find coaches
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Tip: Swipe left/right to switch tabs.
              </p>
            </DialogHeader>

            <div
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: tab === 0 ? "translateX(0%)" : "translateX(-100%)",
                }}
              >
                {/* Your Coaches */}
                <div className="w-full flex-shrink-0 py-2 space-y-3">
                  {coaches.length === 0 ? (
                    <div className="text-sm text-gray-600 text-center py-8">
                      No coaches yet. Swipe left to find one.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {coaches.map((c) => (
                        <Card key={c.id}>
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {c.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {c.sport}
                                  {c.club ? ` • ${c.club}` : ""}
                                </p>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => removeCoach(c.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Find Coaches */}
                <div className="w-full flex-shrink-0 py-2 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="coach-search">Search</Label>
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        id="coach-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Name, sport, club..."
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredFindCoaches.map((c) => {
                      const already = yourCoachIds.has(c.id);
                      return (
                        <Card key={c.id}>
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {c.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {c.sport}
                                  {c.club ? ` • ${c.club}` : ""}
                                </p>
                              </div>

                              <Button
                                size="sm"
                                disabled={already}
                                onClick={() => addCoach(c)}
                                className={`${
                                  already
                                    ? "bg-gray-200 text-gray-600 hover:bg-gray-200"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                              >
                                <UserPlus size={16} className="mr-2" />
                                {already ? "Added" : "Add"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {filteredFindCoaches.length === 0 && (
                      <div className="text-sm text-gray-600 text-center py-8">
                        No results.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* bottom padding for nav */}
        <div className="h-24" />
      </div>
    </div>
  );
}
