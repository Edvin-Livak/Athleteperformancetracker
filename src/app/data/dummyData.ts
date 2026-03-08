/**
 * Realistic dummy data for the Athlete Performance Tracker.
 * Used to seed localStorage when the app is first loaded so it looks populated.
 */

const DEMO_ATHLETE_NAME = "Jordan";

export const dummyProfile = { name: DEMO_ATHLETE_NAME };

// --- Personal Bests ---
export interface PersonalBest {
  id: string;
  event: string;
  result: string;
  unit: string;
  date: string;
  notes?: string;
}

export const dummyPersonalBests: PersonalBest[] = [
  { id: "pb1", event: "100m Sprint", result: "11.82", unit: "seconds", date: "2024-07-14T14:00:00.000Z", notes: "State qualifier, slight tailwind" },
  { id: "pb2", event: "200m Sprint", result: "24.10", unit: "seconds", date: "2024-06-22T10:30:00.000Z", notes: "District meet" },
  { id: "pb3", event: "Long Jump", result: "5.94", unit: "meters", date: "2024-05-18T15:00:00.000Z", notes: "Personal best by 12cm" },
  { id: "pb4", event: "400m", result: "54.20", unit: "seconds", date: "2024-04-06T11:00:00.000Z" },
  { id: "pb5", event: "100m Sprint", result: "11.95", unit: "seconds", date: "2024-03-30T09:00:00.000Z", notes: "Season opener" },
  { id: "pb6", event: "High Jump", result: "1.72", unit: "meters", date: "2024-06-01T16:00:00.000Z" },
  { id: "pb7", event: "Shot Put", result: "10.2", unit: "meters", date: "2024-02-15T12:00:00.000Z" },
];

// --- Journal Entries ---
export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  result: string;
  wentWell: string;
  wentPoorly: string;
  conditions: string;
  improvement: string;
  mood?: string;
  content: string;
}

function buildJournalContent(entry: Omit<JournalEntry, "content">): string {
  return [
    `Result: ${entry.result}`,
    entry.mood ? `Mood: ${entry.mood}` : null,
    "",
    "What went well:",
    entry.wentWell || "—",
    "",
    "What could have gone better?:",
    entry.wentPoorly || "—",
    "",
    "Were the conditions optimal?",
    entry.conditions || "—",
    "",
    "What needs improvement?",
    entry.improvement || "—",
  ]
    .filter(Boolean)
    .join("\n");
}

export const dummyJournalEntries: JournalEntry[] = (() => {
  const raw = [
    {
      id: "j1",
      date: "2024-07-14T18:00:00.000Z",
      title: "State Championships – 100m Heat",
      result: "11.82s (PB) – 2nd in heat, qualified for semis",
      mood: "Focused, confident",
      wentWell: "Explosive start, held form through 80m. Coach said my drive phase was the best it's been all season.",
      wentPoorly: "Tightened up in the last 15m – need to stay relaxed. Lane 2 had a slight curve feel.",
      conditions: "Warm, light tailwind +0.8. Track was fast. Good crowd.",
      improvement: "Practice staying loose at 80–100m in training. One more session on finish-line drills.",
    },
    {
      id: "j2",
      date: "2024-06-22T14:00:00.000Z",
      title: "District Meet – 200m Final",
      result: "24.10s – 3rd place",
      mood: "Happy but tired",
      wentWell: "Strong curve, didn't get boxed in. Competed well against faster runners.",
      wentPoorly: "Could have pushed earlier off the bend. Legs felt heavy last 50m.",
      conditions: "Hot, no wind. Ran at 2pm – would prefer morning slot.",
      improvement: "More 200m race-pace reps in training. Work on closing speed.",
    },
    {
      id: "j3",
      date: "2024-06-01T20:00:00.000Z",
      title: "Invitational – Long Jump",
      result: "5.94m – 1st place, new PB",
      mood: "Pumped",
      wentWell: "Approach felt smooth. Hit the board clean on my second jump. Great support from the team.",
      wentPoorly: "First jump was a foul – rushed the last two steps.",
      conditions: "Perfect weather. Pit was well maintained.",
      improvement: "Keep the same approach rhythm. Don't change step pattern under pressure.",
    },
    {
      id: "j4",
      date: "2024-05-12T16:30:00.000Z",
      title: "League Meet – 100m Heat",
      result: "12.34s – 1st in heat",
      mood: "Nervous then relieved",
      wentWell: "Good reaction time. Clean block clearance.",
      wentPoorly: "Head came up a bit early. Could have been more patient in drive phase.",
      conditions: "Cool, overcast. Track slightly damp from morning rain.",
      improvement: "Stay in drive phase longer. Trust the start.",
    },
    {
      id: "j5",
      date: "2024-04-21T11:00:00.000Z",
      title: "Training Time Trial – 200m",
      result: "25.80s",
      mood: "Working",
      wentWell: "Consistent splits. Felt controlled.",
      wentPoorly: "Not race intensity – need to practice switching on.",
      conditions: "Training session, solo time trial. No competition.",
      improvement: "Add more race-simulation efforts in practice.",
    },
    {
      id: "j6",
      date: "2024-04-06T12:00:00.000Z",
      title: "Early Season – 400m",
      result: "54.20s – 4th in race",
      mood: "Gassed",
      wentWell: "First 200m felt strong. Didn't die as badly as last year.",
      wentPoorly: "Third 100m was slow. Need to work on lactate tolerance.",
      conditions: "Windy on the back straight. Good competition.",
      improvement: "More 300m and 350m reps. Build endurance.",
    },
  ];
  return raw.map((e) => ({
    ...e,
    content: buildJournalContent(e),
  })) as JournalEntry[];
})();

// --- Videos ---
export interface VideoEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const sampleVideoUrl = "https://samplelib.com/lib/preview/mp4/sample-5s.mp4";

// Sports/athletics thumbnails – Unsplash (track, running, stadium, gym, etc.)
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=360&fit=crop&q=85`;

const SPORTS_THUMBNAILS = [
  u("1552674605-db6ffd4facb5"),    // track / sprint
  u("1571019614242-c5c5dee9f50b"), // gym / training
  u("1571008887538-b36bb32f4571"),  // treadmill / run
  u("1461896836934-14e5300c3a48"),  // running
  u("1541534741688-6078c6bfb5c5"),  // runner stadium
  u("1517836357463-d25dfeac3438"), // crossfit / athlete
  u("1596495573069-2c8e0b60e47b"), // runner / athletics
];

export const dummyVideos: VideoEntry[] = [
  { id: "v1", title: "100m District Heat", description: "12.34s (PB)", date: "2024-05-12T14:00:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[0], videoUrl: sampleVideoUrl },
  { id: "v2", title: "100m Regional Final", description: "12.51s – 4th place", date: "2024-06-03T15:30:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[1], videoUrl: sampleVideoUrl },
  { id: "v3", title: "200m Training Session", description: "25.80s time trial", date: "2024-04-21T10:00:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[2], videoUrl: sampleVideoUrl },
  { id: "v4", title: "Start Technique Drill", description: "Block reaction focus", date: "2024-03-15T09:00:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[3], videoUrl: sampleVideoUrl },
  { id: "v5", title: "100m Nationals Heat", description: "12.29s – qualified", date: "2024-07-01T11:00:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[4], videoUrl: sampleVideoUrl },
  { id: "v6", title: "Long Jump – 5.94m PB", description: "Invitational winning jump", date: "2024-06-01T16:00:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[5], videoUrl: sampleVideoUrl },
  { id: "v7", title: "Warm-up & Strides", description: "Pre-meet routine", date: "2024-06-22T13:00:00.000Z", thumbnailUrl: SPORTS_THUMBNAILS[6], videoUrl: sampleVideoUrl },
];

// --- Video Comments ---
export interface Comment {
  id: string;
  videoId: string;
  author: string;
  role: "athlete" | "coach";
  text: string;
  timestamp: string;
}

export const dummyComments: Comment[] = [
  { id: "c1", videoId: "v1", author: "Coach Mike", role: "coach", text: "Drive phase looked much better this week. Let's keep the head down for another 5m next time.", timestamp: "2024-05-12T19:00:00.000Z" },
  { id: "c2", videoId: "v1", author: "Jordan", role: "athlete", text: "Felt strong. Will focus on staying low in the next session.", timestamp: "2024-05-12T20:15:00.000Z" },
  { id: "c3", videoId: "v2", author: "Coach Mike", role: "coach", text: "Tight in the last 20m. Add 2x80m relaxed runs at 90% to Thursday's session.", timestamp: "2024-06-03T18:00:00.000Z" },
  { id: "c4", videoId: "v5", author: "Jordan", role: "athlete", text: "Best start of the season. Need to replicate this in semis.", timestamp: "2024-07-01T14:00:00.000Z" },
  { id: "c5", videoId: "v5", author: "Coach Mike", role: "coach", text: "Agreed – that's the template. Rest up for tomorrow.", timestamp: "2024-07-01T15:30:00.000Z" },
  { id: "c6", videoId: "v6", author: "Coach Mike", role: "coach", text: "Approach was spot on. Same rhythm at State.", timestamp: "2024-06-01T18:00:00.000Z" },
];

// --- Goals ---
export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

export const dummyGoals: Goal[] = [
  { id: "g1", title: "Break 11.8s in 100m", description: "Target: sub-11.80 at State finals.", targetDate: "2024-07-20", category: "performance", completed: false, createdAt: "2024-01-15T10:00:00.000Z" },
  { id: "g2", title: "Qualify for State in 100m & 200m", description: "Top 2 in region or hit qualifying standard.", targetDate: "2024-06-10", category: "performance", completed: true, createdAt: "2024-01-10T10:00:00.000Z" },
  { id: "g3", title: "Long Jump 6.00m+", description: "Stretch goal for end of season.", targetDate: "2024-07-25", category: "performance", completed: false, createdAt: "2024-02-01T10:00:00.000Z" },
  { id: "g4", title: "Consistent block starts", description: "Hit reaction time under 0.18 in 8/10 practice starts.", targetDate: "2024-05-01", category: "skill", completed: true, createdAt: "2024-03-01T10:00:00.000Z" },
  { id: "g5", title: "Strength: 1.5x bodyweight squat", description: "Support sprint power and injury prevention.", targetDate: "2024-08-01", category: "fitness", completed: false, createdAt: "2024-04-01T10:00:00.000Z" },
  { id: "g6", title: "Weekly reflection in journal", description: "At least one journal entry per week during season.", targetDate: "2024-07-31", category: "other", completed: false, createdAt: "2024-01-20T10:00:00.000Z" },
];

// --- Seed helpers ---
const STORAGE_KEYS = {
  profile: "athleteProfile",
  bests: "athleteBests",
  journal: "athleteJournal",
  videos: "athleteVideos",
  comments: "videoComments",
  goals: "athleteGoals",
} as const;

function isEmptyArray(key: string): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return true;
    const parsed = JSON.parse(raw);
    return !Array.isArray(parsed) || parsed.length === 0;
  } catch {
    return true;
  }
}

const DUMMY_VIDEO_THUMB_URLS: Record<string, string> = {
  v1: SPORTS_THUMBNAILS[0],
  v2: SPORTS_THUMBNAILS[1],
  v3: SPORTS_THUMBNAILS[2],
  v4: SPORTS_THUMBNAILS[3],
  v5: SPORTS_THUMBNAILS[4],
  v6: SPORTS_THUMBNAILS[5],
  v7: SPORTS_THUMBNAILS[6],
};

/** Ensure dummy videos (v1–v7) in localStorage have sports thumbnails. */
function migrateVideoThumbnailsIfNeeded(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.videos);
    if (!raw) return;
    const videos: VideoEntry[] = JSON.parse(raw);
    if (!Array.isArray(videos) || videos.length === 0) return;
    let changed = false;
    const updated = videos.map((v) => {
      const url = DUMMY_VIDEO_THUMB_URLS[v.id];
      if (url && v.thumbnailUrl !== url) {
        changed = true;
        return { ...v, thumbnailUrl: url };
      }
      return v;
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(updated));
    }
  } catch (_) {
    // ignore
  }
}

/** Call on app init to seed any empty localStorage keys with realistic dummy data. */
export function seedDummyDataIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    if (!localStorage.getItem(STORAGE_KEYS.profile)) {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(dummyProfile));
    }
    if (isEmptyArray(STORAGE_KEYS.bests)) {
      localStorage.setItem(STORAGE_KEYS.bests, JSON.stringify(dummyPersonalBests));
    }
    if (isEmptyArray(STORAGE_KEYS.journal)) {
      localStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(dummyJournalEntries));
    }
    if (isEmptyArray(STORAGE_KEYS.videos)) {
      localStorage.setItem(STORAGE_KEYS.videos, JSON.stringify(dummyVideos));
    }
    if (isEmptyArray(STORAGE_KEYS.comments)) {
      localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(dummyComments));
    }
    if (isEmptyArray(STORAGE_KEYS.goals)) {
      localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(dummyGoals));
    }
    migrateVideoThumbnailsIfNeeded();
  } catch (_) {
    // ignore quota or parse errors
  }
}

/** Export for use in Home (e.g. display name). */
export function getDemoAthleteName(): string {
  return DEMO_ATHLETE_NAME;
}