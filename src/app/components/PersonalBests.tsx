import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Trophy, Trash2, Pencil, TrendingUp } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";

interface PersonalBestHistoryEntry {
  id: string;
  result: string;
  unit: string;
  date: string;
  notes?: string;
  linkedVideoId?: string;
}

interface PersonalBest {
  id: string;
  event: string;
  result: string;
  unit: string;
  date: string;
  notes?: string;
  linkedVideoId?: string;
  history: PersonalBestHistoryEntry[];
}

interface VideoEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnailUrl: string;
  videoUrl: string;
}

function parseResultToNumber(result: string, unit: string): number | null {
  const value = result.trim();

  if (unit === "mm:ss") {
    const parts = value.split(":");
    if (parts.length !== 2) return null;
    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);
    if (Number.isNaN(minutes) || Number.isNaN(seconds)) return null;
    return minutes * 60 + seconds;
  }

  if (unit === "hh:mm:ss") {
    const parts = value.split(":");
    if (parts.length !== 3) return null;
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Number(parts[2]);
    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
      return null;
    }
    return hours * 3600 + minutes * 60 + seconds;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
}

function formatValueForUnit(value: number, unit: string): string {
  if (unit === "mm:ss") {
    const minutes = Math.floor(value / 60);
    const seconds = Math.round(value % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  if (unit === "hh:mm:ss") {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.round(value % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

function normalizeBests(raw: any[]): PersonalBest[] {
  const grouped: Record<string, PersonalBestHistoryEntry[]> = {};

  for (const item of raw) {
    const eventKey = item.event;

    if (!grouped[eventKey]) grouped[eventKey] = [];

    if (Array.isArray(item.history) && item.history.length > 0) {
      grouped[eventKey].push(
        ...item.history.map((entry: any) => ({
          id: entry.id,
          result: entry.result,
          unit: entry.unit,
          date: entry.date,
          notes: entry.notes,
          linkedVideoId: entry.linkedVideoId,
        })),
      );
    } else {
      grouped[eventKey].push({
        id: item.id,
        result: item.result,
        unit: item.unit,
        date: item.date,
        notes: item.notes,
        linkedVideoId: item.linkedVideoId,
      });
    }
  }

  return Object.entries(grouped).map(([event, historyEntries]) => {
    const uniqueHistory = historyEntries.filter(
      (entry, index, arr) => arr.findIndex((e) => e.id === entry.id) === index,
    );

    const sortedHistory = [...uniqueHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const latest = sortedHistory[sortedHistory.length - 1];

    return {
      id: latest.id,
      event,
      result: latest.result,
      unit: latest.unit,
      date: latest.date,
      notes: latest.notes,
      linkedVideoId: latest.linkedVideoId,
      history: sortedHistory,
    };
  });
}

export function PersonalBests() {
  const [bests, setBests] = useState<PersonalBest[]>([]);
  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [selectedRecord, setSelectedRecord] = useState<PersonalBest | null>(
    null,
  );
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  const [newBest, setNewBest] = useState({
    event: "",
    result: "",
    unit: "seconds",
    notes: "",
    linkedVideoId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const stored = localStorage.getItem("athleteBests");
    if (stored) {
      const parsed = JSON.parse(stored);
      const normalized = normalizeBests(parsed);
      setBests(normalized);
      localStorage.setItem("athleteBests", JSON.stringify(normalized));
    }

    const storedVideos = localStorage.getItem("athleteVideos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  const saveBests = (updatedBests: PersonalBest[]) => {
    setBests(updatedBests);
    localStorage.setItem("athleteBests", JSON.stringify(updatedBests));
  };

  const resetNewBest = () => {
    setEditingId(null);
    setNewBest({
      event: "",
      result: "",
      unit: "seconds",
      notes: "",
      linkedVideoId: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const openAddDrawer = () => {
    resetNewBest();
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (record: PersonalBest) => {
    setEditingId(record.id);
    setNewBest({
      event: record.event,
      result: record.result,
      unit: record.unit,
      notes: record.notes || "",
      linkedVideoId: "",
      date: record.date.split("T")[0],
    });
    setIsDrawerOpen(true);
  };

  const closeBestDrawer = () => {
    resetNewBest();
    setIsDrawerOpen(false);
  };

  const openProgressDrawer = (record: PersonalBest) => {
    setSelectedRecord(record);
    setIsProgressOpen(true);
  };

  const handleSaveBest = () => {
    if (!newBest.event || !newBest.result) return;

    const newHistoryEntry: PersonalBestHistoryEntry = {
      id: Date.now().toString(),
      result: newBest.result,
      unit: newBest.unit,
      date: new Date(newBest.date).toISOString(),
      notes: newBest.notes || undefined,
      linkedVideoId: newBest.linkedVideoId || undefined,
    };

    if (editingId) {
      const updated = bests.map((b) =>
        b.id === editingId
          ? {
              ...b,
              event: newBest.event,
              result: newBest.result,
              unit: newBest.unit,
              date: new Date(newBest.date).toISOString(),
              notes: newBest.notes || undefined,
              linkedVideoId: newBest.linkedVideoId || undefined,
              history: [...(b.history || []), newHistoryEntry].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              ),
            }
          : b,
      );

      saveBests(updated);
      closeBestDrawer();
      return;
    }

    const existingForEvent = bests.find(
      (b) =>
        b.event.trim().toLowerCase() === newBest.event.trim().toLowerCase(),
    );

    if (existingForEvent) {
      const updated = bests.map((b) =>
        b.id === existingForEvent.id
          ? {
              ...b,
              event: newBest.event,
              result: newBest.result,
              unit: newBest.unit,
              date: new Date(newBest.date).toISOString(),
              notes: newBest.notes || undefined,
              linkedVideoId: newBest.linkedVideoId || undefined,
              history: [...(b.history || []), newHistoryEntry].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              ),
            }
          : b,
      );

      saveBests(updated);
      closeBestDrawer();
      return;
    }

    const best: PersonalBest = {
      id: Date.now().toString(),
      event: newBest.event,
      result: newBest.result,
      unit: newBest.unit,
      date: new Date(newBest.date).toISOString(),
      notes: newBest.notes || undefined,
      linkedVideoId: newBest.linkedVideoId || undefined,
      history: [newHistoryEntry],
    };

    saveBests([best, ...bests]);
    closeBestDrawer();
  };

  const handleDelete = (id: string) => {
    saveBests(bests.filter((b) => b.id !== id));
  };

  const resultPlaceholder =
    newBest.unit === "seconds"
      ? "e.g., 10.50"
      : newBest.unit === "mm:ss"
        ? "e.g., 04:32"
        : newBest.unit === "hh:mm:ss"
          ? "e.g., 01:12:45"
          : newBest.unit === "meters"
            ? "e.g., 6.85"
            : newBest.unit === "points"
              ? "e.g., 180"
              : "e.g., 10";

  const selectedEntries = selectedRecord
    ? [...(selectedRecord.history || [])].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )
    : [];

  const chartUnit = selectedEntries[0]?.unit || "";
  const parsedPoints = selectedEntries
    .map((entry, index) => ({
      index,
      entry,
      value: parseResultToNumber(entry.result, entry.unit),
    }))
    .filter(
      (
        point,
      ): point is {
        index: number;
        entry: PersonalBestHistoryEntry;
        value: number;
      } => point.value !== null,
    );

  const chartWidth = 300;
  const chartHeight = 180;
  const padding = 28;

  let pointsString = "";
  let yMinLabel = "";
  let yMaxLabel = "";

  let chartPoints: {
    id: string;
    x: number;
    y: number;
    label: string;
  }[] = [];

  if (parsedPoints.length > 0) {
    const values = parsedPoints.map((p) => p.value);
    let min = Math.min(...values);
    let max = Math.max(...values);

    if (min === max) {
      min = min - 1;
      max = max + 1;
    } else {
      const range = max - min;
      const extra = range * 0.15;
      min = min - extra;
      max = max + extra;
    }

    yMinLabel = formatValueForUnit(min, chartUnit);
    yMaxLabel = formatValueForUnit(max, chartUnit);

    chartPoints = parsedPoints.map((point, i) => {
      const x =
        parsedPoints.length === 1
          ? chartWidth / 2
          : padding +
            (i * (chartWidth - padding * 2)) / (parsedPoints.length - 1);

      const y =
        chartHeight -
        padding -
        ((point.value - min) / (max - min)) * (chartHeight - padding * 2);

      return {
        id: point.entry.id,
        x,
        y,
        label: `${point.entry.result}`,
      };
    });

    pointsString = chartPoints
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  }

  const latestEntry =
    selectedEntries.length > 0
      ? selectedEntries[selectedEntries.length - 1]
      : null;

  const firstEntry = selectedEntries.length > 0 ? selectedEntries[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">
              Personal bests
            </h1>
            <p className="text-muted-foreground text-sm">
              {bests.length} record{bests.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Button
              onClick={openAddDrawer}
              className="bg-orange-600 hover:bg-orange-700 rounded-full h-9 px-3 flex items-center gap-1 text-xs"
            >
              <Plus size={14} strokeWidth={2} />
              Add
            </Button>
          </div>
        </div>

        {bests.length === 0 ? (
          <Card>
            <Card className="border border-border rounded-2xl shadow-md">
              <CardContent className="p-10 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy
                    size={32}
                    className="text-orange-600"
                    strokeWidth={1.6}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No records yet
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Track your personal bests over time
                </p>
                <Button
                  onClick={openAddDrawer}
                  className="bg-orange-600 hover:bg-orange-700 rounded-xl"
                >
                  <Plus size={18} className="mr-2" strokeWidth={1.8} />
                  Add record
                </Button>
              </CardContent>
            </Card>
          </Card>
        ) : (
          <div className="space-y-2">
            {bests.map((record) => {
              const linkedVideo = videos.find(
                (video) => video.id === record.linkedVideoId,
              );

              return (
                <Card
                  key={record.id}
                  className="overflow-hidden border border-border rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
                >
                  <CardContent className="p-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-lg flex-shrink-0 self-start">
                        <Trophy size={16} strokeWidth={1.7} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-semibold text-foreground truncate leading-tight">
                          {record.event}
                        </h3>

                        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[15px] font-semibold text-orange-600 tabular-nums leading-none">
                            {record.result}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {record.unit}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                        </div>

                        {(record.notes || linkedVideo) && (
                          <div className="mt-0.5 space-y-0.5">
                            {record.notes && (
                              <p className="text-[11px] text-muted-foreground truncate leading-tight">
                                {record.notes}
                              </p>
                            )}

                            {linkedVideo && (
                              <Link
                                to={`/videos/${linkedVideo.id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="text-[11px] text-blue-600 truncate hover:underline leading-tight">
                                  Video: {linkedVideo.title}
                                </p>
                              </Link>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 flex-shrink-0 w-[58px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDrawer(record);
                          }}
                          className="h-6 rounded-md border-gray-200 px-1 text-[10px] text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <Pencil
                            size={10}
                            className="mr-1"
                            strokeWidth={1.8}
                          />
                          Log
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProgressDrawer(record);
                          }}
                          className="h-6 rounded-md border-orange-200 px-1 text-[10px] text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <TrendingUp
                            size={10}
                            className="mr-1"
                            strokeWidth={1.8}
                          />
                          View
                        </Button>

                        <ConfirmDeleteButton
                          onConfirm={() => handleDelete(record.id)}
                          title="Delete personal best?"
                          description="This personal best and its history will be permanently removed."
                          className="h-6 rounded-md text-destructive hover:bg-destructive/10 p-0"
                          iconOnly
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add / Log PB Drawer */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="max-w-md mx-auto max-h-[90vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>
                {editingId ? "Log New Personal Best" : "Add Personal Best"}
              </DrawerTitle>
              <DrawerDescription>
                {editingId
                  ? "Log a new result for this event. It will be added to your progress history."
                  : "Enter your personal best details below."}
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-4">
              {editingId ? (
                <div className="pb-2 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-orange-600 tracking-tight">
                    {newBest.event}
                  </h3>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="event">Event</Label>
                  <Input
                    id="event"
                    placeholder="e.g., 100m Sprint, Long Jump"
                    value={newBest.event}
                    onChange={(e) =>
                      setNewBest({ ...newBest, event: e.target.value })
                    }
                  />
                </div>
              )}

              {editingId ? (
                <div className="space-y-2">
                  <Label htmlFor="result">New Result</Label>
                  <Input
                    id="result"
                    placeholder={resultPlaceholder}
                    value={newBest.result}
                    onChange={(e) =>
                      setNewBest({ ...newBest, result: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="result">Result</Label>
                    <Input
                      id="result"
                      placeholder={resultPlaceholder}
                      value={newBest.result}
                      onChange={(e) =>
                        setNewBest({ ...newBest, result: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newBest.unit}
                      onValueChange={(value) =>
                        setNewBest({ ...newBest, unit: value })
                      }
                    >
                      <SelectTrigger id="unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">seconds</SelectItem>
                        <SelectItem value="mm:ss">mm:ss</SelectItem>
                        <SelectItem value="hh:mm:ss">hh:mm:ss</SelectItem>
                        <SelectItem value="meters">meters</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="reps">reps</SelectItem>
                        <SelectItem value="points">points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newBest.date}
                  onChange={(e) =>
                    setNewBest({ ...newBest, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedVideo">Linked Video (optional)</Label>
                <Select
                  value={newBest.linkedVideoId || "none"}
                  onValueChange={(value) =>
                    setNewBest({
                      ...newBest,
                      linkedVideoId: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger id="linkedVideo">
                    <SelectValue placeholder="Select a video" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No linked video</SelectItem>
                    {videos.map((video) => (
                      <SelectItem key={video.id} value={video.id}>
                        {video.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any additional details..."
                  value={newBest.notes}
                  onChange={(e) =>
                    setNewBest({ ...newBest, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DrawerFooter className="shrink-0 border-t border-border bg-background">
              <Button variant="outline" onClick={closeBestDrawer}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveBest}
                disabled={!newBest.event || !newBest.result}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {editingId ? "Update PB" : "Add Record"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Progress Drawer */}
        <Drawer open={isProgressOpen} onOpenChange={setIsProgressOpen}>
          <DrawerContent className="max-w-md mx-auto max-h-[90vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>{selectedRecord?.event || "Progress"}</DrawerTitle>
              <DrawerDescription>
                Track how your results have changed over time.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {selectedEntries.length === 0 ? (
                <div className="py-6 text-sm text-gray-500">
                  No data available for this event yet.
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={18} className="text-orange-600" />
                        <h3 className="text-sm font-semibold">
                          Performance Trend
                        </h3>
                      </div>

                      <div className="w-full overflow-hidden">
                        <svg
                          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                          className="w-full h-52"
                        >
                          <line
                            x1={padding}
                            y1={padding}
                            x2={padding}
                            y2={chartHeight - padding}
                            stroke="#d1d5db"
                            strokeWidth="1"
                          />
                          <line
                            x1={padding}
                            y1={chartHeight - padding}
                            x2={chartWidth - padding}
                            y2={chartHeight - padding}
                            stroke="#d1d5db"
                            strokeWidth="1"
                          />

                          {pointsString && (
                            <polyline
                              fill="none"
                              stroke="#ea580c"
                              strokeWidth="3"
                              points={pointsString}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {chartPoints.map((point) => {
                            const labelWidth = Math.max(
                              34,
                              point.label.length * 7 + 10,
                            );
                            const labelHeight = 20;
                            const labelX = point.x - labelWidth / 2;
                            const labelY = point.y - 30;

                            return (
                              <g key={point.id}>
                                <rect
                                  x={labelX}
                                  y={labelY}
                                  width={labelWidth}
                                  height={labelHeight}
                                  rx="10"
                                  fill="white"
                                  stroke="#ea580c"
                                  strokeWidth="1"
                                />
                                <text
                                  x={point.x}
                                  y={labelY + 13}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fontWeight="500"
                                  fill="#ea580c"
                                >
                                  {point.label}
                                </text>

                                <line
                                  x1={point.x}
                                  y1={labelY + labelHeight}
                                  x2={point.x}
                                  y2={point.y - 6}
                                  stroke="#ea580c"
                                  strokeWidth="1"
                                />

                                <circle
                                  cx={point.x}
                                  cy={point.y}
                                  r="4"
                                  fill="#ea580c"
                                />
                              </g>
                            );
                          })}

                          <text
                            x={padding - 4}
                            y={padding + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {yMaxLabel}
                          </text>

                          <text
                            x={padding - 4}
                            y={chartHeight - padding + 4}
                            textAnchor="end"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {yMinLabel}
                          </text>

                          <text
                            x={padding}
                            y={chartHeight - 8}
                            textAnchor="start"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            0
                          </text>

                          <text
                            x={chartWidth - padding}
                            y={chartHeight - 8}
                            textAnchor="end"
                            fontSize="10"
                            fill="#6b7280"
                          >
                            {selectedEntries.length - 1}
                          </text>
                        </svg>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>
                          First:{" "}
                          {firstEntry
                            ? new Date(firstEntry.date).toLocaleDateString()
                            : "—"}
                        </span>
                        <span>
                          Latest:{" "}
                          {latestEntry
                            ? new Date(latestEntry.date).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold">Summary</h3>
                      <div className="text-sm text-gray-700">
                        <p>
                          <span className="font-medium">First entry:</span>{" "}
                          {firstEntry
                            ? `${firstEntry.result} ${firstEntry.unit}`
                            : "—"}
                        </p>
                        <p>
                          <span className="font-medium">Latest entry:</span>{" "}
                          {latestEntry
                            ? `${latestEntry.result} ${latestEntry.unit}`
                            : "—"}
                        </p>
                        <p>
                          <span className="font-medium">Total entries:</span>{" "}
                          {selectedEntries.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold mb-3">History</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between text-sm border-b last:border-b-0 pb-2 last:pb-0"
                          >
                            <div>
                              <p className="font-medium">
                                {entry.result} {entry.unit}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(entry.date).toLocaleDateString()}
                              </p>
                            </div>
                            {entry.linkedVideoId && (
                              <Link to={`/videos/${entry.linkedVideoId}`}>
                                <p className="text-xs text-blue-600 hover:underline">
                                  Open video
                                </p>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <DrawerFooter className="shrink-0 border-t border-border bg-background">
              <Button
                variant="outline"
                onClick={() => setIsProgressOpen(false)}
              >
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
