import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Trophy,
  Target,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getDemoAthleteName } from "../data/dummyData";

function useStorageCounts() {
  const [counts, setCounts] = useState({ journal: 0, bests: 0, goals: 0, goalsActive: 0, videos: 0 });
  useEffect(() => {
    try {
      const j = localStorage.getItem("athleteJournal");
      const b = localStorage.getItem("athleteBests");
      const g = localStorage.getItem("athleteGoals");
      const v = localStorage.getItem("athleteVideos");
      setCounts({
        journal: j ? JSON.parse(j).length : 0,
        bests: b ? JSON.parse(b).length : 0,
        goals: g ? (JSON.parse(g) as { completed: boolean }[]).length : 0,
        goalsActive: g ? (JSON.parse(g) as { completed: boolean }[]).filter((x) => !x.completed).length : 0,
        videos: v ? JSON.parse(v).length : 0,
      });
    } catch {
      // ignore
    }
  }, []);
  return counts;
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=500&fit=crop&crop=center&q=85";

export function Home() {
  const [athleteName, setAthleteName] = useState<string>(getDemoAthleteName());
  const counts = useStorageCounts();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("athleteProfile");
      if (raw) {
        const profile = JSON.parse(raw) as { name?: string };
        if (profile?.name) setAthleteName(profile.name);
      }
    } catch {
      // keep default
    }
  }, []);

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-2">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1606335544053-c43609e6155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=85"
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-border"
            />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Hello,</p>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">{athleteName}</h1>
            </div>
          </div>
          <button
            type="button"
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Date */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            type="button"
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <span className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground min-w-[100px] text-center shadow-sm">
            {monthLabel}
          </span>
          <button
            type="button"
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} strokeWidth={2} />
          </button>
        </div>

        {/* This week – single accent card */}
        <Card className="mb-6 rounded-2xl border-0 bg-primary text-primary-foreground shadow-lg shadow-primary/20 overflow-hidden">
          <CardContent className="p-5">
            <p className="text-xs font-medium opacity-90 mb-1">This week</p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold tracking-tight">{counts.journal + counts.bests}</p>
                <p className="text-xs opacity-85 mt-0.5">Entries & records</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {counts.goals > 0 ? Math.round((counts.goals - counts.goalsActive) / counts.goals * 100) : 0}%
                </p>
                <p className="text-xs opacity-85">Goals done</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${counts.goals > 0 ? ((counts.goals - counts.goalsActive) / counts.goals) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Metrics – cards with subtle primary tint */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link to="/journal">
            <Card className="rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all h-full">
              <CardContent className="pt-4 px-4 pb-3 flex flex-col gap-2 [&:last-child]:pb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-primary" strokeWidth={1.8} />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Journal</p>
                <p className="text-xl font-semibold text-primary tabular-nums">{counts.journal}</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/personal-bests">
            <Card className="rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all h-full">
              <CardContent className="pt-4 px-4 pb-3 flex flex-col gap-2 [&:last-child]:pb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy size={18} className="text-primary" strokeWidth={1.8} />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Bests</p>
                <p className="text-xl font-semibold text-primary tabular-nums">{counts.bests}</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/goals">
            <Card className="rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all h-full">
              <CardContent className="pt-4 px-4 pb-3 flex flex-col gap-2 [&:last-child]:pb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target size={18} className="text-primary" strokeWidth={1.8} />
                </div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Goals</p>
                <p className="text-xl font-semibold text-primary tabular-nums">{counts.goalsActive}</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Primary CTA – image on top so it doesn’t crop badly */}
        <div className="mb-8">
          <Link to="/journal">
            <Card className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-md hover:shadow-lg transition-all group">
              <CardContent className="p-0">
                <div className="relative aspect-[2/1] w-full overflow-hidden">
                  <ImageWithFallback
                    src={HERO_IMAGE}
                    alt="Training"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                    Reflect & learn
                  </p>
                  <h3 className="text-base font-semibold text-foreground">Video learning</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Review performances and add notes
                  </p>
                  <span className="mt-3 inline-flex w-fit px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium group-hover:opacity-95 transition-opacity">
                    Start
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

      </div>
    </div>
  );
}
