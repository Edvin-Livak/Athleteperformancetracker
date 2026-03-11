import { useState, useEffect } from "react";
import { Plus, Calendar, Trash2, BookOpen, Pencil, MoreVertical } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  result: string;
  wentWell: string;
  wentPoorly: string;
  conditions: string;
  improvement: string;
  notes?: string;
  mood?: string;
  content: string;
}

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const [newEntry, setNewEntry] = useState({
    title: "",
    result: "",
    mood: "",
    wentWell: "",
    wentPoorly: "",
    conditions: "",
    improvement: "",
    notes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("athleteJournal");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
  if (isDialogOpen) {
    document.body.classList.add("hide-bottom-nav");
  } else {
    document.body.classList.remove("hide-bottom-nav");
  }

  return () => {
    document.body.classList.remove("hide-bottom-nav");
  };
}, [isDialogOpen]);

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    setEntries(updatedEntries);
    localStorage.setItem("athleteJournal", JSON.stringify(updatedEntries));
  };

  const resetNewEntry = () => {
    setStep(1);
    setNewEntry({
      title: "",
      result: "",
      mood: "",
      wentWell: "",
      wentPoorly: "",
      conditions: "",
      improvement: "",
      notes: "",
    });
  };

  const openNewEntry = () => {
    setEditingEntryId(null);
    resetNewEntry();
    setIsDialogOpen(true);
  };

  const cancelNewEntry = () => {
    resetNewEntry();
    setEditingEntryId(null);
    setIsDialogOpen(false);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setNewEntry({
      title: entry.title,
      result: entry.result,
      mood: entry.mood || "",
      wentWell: entry.wentWell,
      wentPoorly: entry.wentPoorly,
      conditions: entry.conditions,
      improvement: entry.improvement,
      notes: entry.notes || "",
    });
    setStep(1);
    setIsDialogOpen(true);
  };

  const buildContent = () =>
    [
      `Result: ${newEntry.result}`,
      newEntry.mood ? `Mood: ${newEntry.mood}` : null,
      "",
      "What went well:",
      newEntry.wentWell || "—",
      "",
      "What could have gone better?:",
      newEntry.wentPoorly || "—",
      "",
      "Were the conditions optimal?",
      newEntry.conditions || "—",
      "",
      "What needs improvement?",
      newEntry.improvement || "—",
      "",
      "Notes:",
      newEntry.notes || "—",
    ]
      .filter(Boolean)
      .join("\n");

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.result) return;

    const compiled = buildContent();

    if (editingEntryId) {
      const existing = entries.find((e) => e.id === editingEntryId);
      if (!existing) {
        cancelNewEntry();
        return;
      }
      const updated: JournalEntry = {
        ...existing,
        title: newEntry.title,
        result: newEntry.result,
        mood: newEntry.mood || undefined,
        wentWell: newEntry.wentWell,
        wentPoorly: newEntry.wentPoorly,
        conditions: newEntry.conditions,
        improvement: newEntry.improvement,
        notes: newEntry.notes || undefined,
        content: compiled,
      };
      saveEntries(
        entries.map((e) => (e.id === editingEntryId ? updated : e))
      );
      if (expandedEntry === editingEntryId) {
        setExpandedEntry(null);
      }
    } else {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: newEntry.title,
        result: newEntry.result,
        mood: newEntry.mood || undefined,
        wentWell: newEntry.wentWell,
        wentPoorly: newEntry.wentPoorly,
        conditions: newEntry.conditions,
        improvement: newEntry.improvement,
        notes: newEntry.notes || undefined,
        content: compiled,
      };
      saveEntries([entry, ...entries]);
    }
    cancelNewEntry();
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
    if (expandedEntry === id) {
      setExpandedEntry(null);
    }
    setDeleteConfirmId(null);
  };

  const getPreview = (entry: JournalEntry) => {
    return (
      entry.wentWell ||
      entry.improvement ||
      entry.notes ||
      entry.wentPoorly ||
      entry.conditions ||
      entry.result
    );
  };

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">
              Journal
            </h1>
            <p className="text-muted-foreground text-sm">
              {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
            </p>
          </div>

          <Button
            onClick={openNewEntry}
            className="bg-blue-600 hover:bg-blue-700 rounded-full h-9 px-3 flex items-center gap-1 text-xs"
          >
            <Plus size={14} strokeWidth={2} />
            Add
          </Button>
        </div>

        {entries.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen
                  size={32}
                  className="text-blue-600"
                  strokeWidth={1.6}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Start reflection
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start documenting your journey
              </p>
              <Button
                onClick={openNewEntry}
                className="rounded-xl bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={18} className="mr-2" strokeWidth={1.8} />
                Add entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const isExpanded = expandedEntry === entry.id;

              return (
                <Card
                  key={entry.id}
                  className="overflow-hidden border border-border rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <CardContent className="p-4">
                    {!isExpanded ? (
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg flex-shrink-0">
                          <BookOpen size={20} strokeWidth={1.6} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h3 className="text-base font-semibold text-foreground truncate min-w-0">
                              {entry.title}
                            </h3>
                            <Popover
                              open={openMenuId === entry.id}
                              onOpenChange={(open) => setOpenMenuId(open ? entry.id : null)}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted -mt-1"
                                  aria-label="Entry options"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenMenuId((id) => (id === entry.id ? null : entry.id));
                                  }}
                                >
                                  <MoreVertical size={18} strokeWidth={1.6} />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-1" align="end" sideOffset={4}>
                                <button
                                  type="button"
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    openEditEntry(entry);
                                  }}
                                >
                                  <Pencil size={16} strokeWidth={1.6} />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-destructive/10"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeleteConfirmId(entry.id);
                                  }}
                                >
                                  <Trash2 size={16} strokeWidth={1.6} />
                                  Delete
                                </button>
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar
                                size={12}
                                className="mr-1"
                                strokeWidth={1.6}
                              />
                              {new Date(entry.date).toLocaleDateString()}
                            </div>

                            {entry.mood && (
                              <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                                {entry.mood}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium text-blue-600">
                              Result:
                            </span>{" "}
                            {entry.result}
                          </p>

                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {getPreview(entry)}
                          </p>

                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600 mt-2"
                            onClick={() => setExpandedEntry(entry.id)}
                          >
                            Read more
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg flex-shrink-0">
                            <BookOpen size={20} strokeWidth={1.6} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="text-base font-semibold text-foreground truncate min-w-0">
                                {entry.title}
                              </h3>
                              <Popover
                                open={openMenuId === entry.id}
                                onOpenChange={(open) => setOpenMenuId(open ? entry.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted -mt-1"
                                    aria-label="Entry options"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setOpenMenuId((id) => (id === entry.id ? null : entry.id));
                                    }}
                                  >
                                    <MoreVertical size={18} strokeWidth={1.6} />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1" align="end" sideOffset={4}>
                                  <button
                                    type="button"
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      openEditEntry(entry);
                                    }}
                                  >
                                    <Pencil size={16} strokeWidth={1.6} />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-destructive/10"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setDeleteConfirmId(entry.id);
                                    }}
                                  >
                                    <Trash2 size={16} strokeWidth={1.6} />
                                    Delete
                                  </button>
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar
                                  size={12}
                                  className="mr-1"
                                  strokeWidth={1.6}
                                />
                                {new Date(entry.date).toLocaleDateString()}
                              </div>

                              {entry.mood && (
                                <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                                  {entry.mood}
                                </span>
                              )}
                            </div>

                            <p className="text-sm mb-3">
                              <span className="font-medium text-blue-600">
                                Result:
                              </span>{" "}
                              <span className="text-foreground">
                                {entry.result}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              What went well?
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.wentWell || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-foreground">
                              What went poorly?
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.wentPoorly || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Were the conditions optimal?
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.conditions || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-foreground">
                              What needs improvement?
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.improvement || "—"}
                            </p>
                          </div>

                          {entry.notes && (
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                Notes
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="link"
                          className="p-0 h-auto text-blue-600 mt-3"
                          onClick={() => setExpandedEntry(null)}
                        >
                          Show less
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Entry - bottom drawer */}
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent className="max-w-md mx-auto flex flex-col">
            <DrawerHeader>
              <DrawerTitle>
                {editingEntryId
                  ? step === 1
                    ? "Edit Entry"
                    : "Edit Reflection"
                  : step === 1
                    ? "New Entry"
                    : "Reflection"}
              </DrawerTitle>
              <DrawerDescription>
                {step === 1
                  ? editingEntryId
                    ? "Update the details of your event."
                    : "Enter the details of your event."
                  : "Reflect on your performance."}
              </DrawerDescription>

              <div className="mt-2 flex gap-2">
                <div
                  className={`h-1 flex-1 rounded ${
                    step === 1 ? "bg-blue-600" : "bg-blue-200"
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded ${
                    step === 2 ? "bg-blue-600" : "bg-blue-200"
                  }`}
                />
              </div>
            </DrawerHeader>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-4 px-4 pb-4 overscroll-contain">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entry-title">Event / Title</Label>
                    <Input
                      id="entry-title"
                      placeholder="e.g., 100m Heat at Districts"
                      value={newEntry.title}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          title: e.target.value,
                        })
                      }
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="result">Result</Label>
                    <Input
                      id="result"
                      placeholder="e.g., 12.34s (PB) / Won / 2nd place"
                      value={newEntry.result}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          result: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood (optional)</Label>
                    <Input
                      id="mood"
                      placeholder="e.g., Nervous, Focused"
                      value={newEntry.mood}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          mood: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="wentWell">What went well?</Label>
                    <Textarea
                      id="wentWell"
                      placeholder="What should you repeat next time?"
                      value={newEntry.wentWell}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          wentWell: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wentPoorly">What went poorly?</Label>
                    <Textarea
                      id="wentPoorly"
                      placeholder="What got in the way?"
                      value={newEntry.wentPoorly}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          wentPoorly: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conditions">
                      Were the conditions optimal?
                    </Label>
                    <Textarea
                      id="conditions"
                      placeholder="Weather, venue, equipment, warm-up, schedule, etc."
                      value={newEntry.conditions}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          conditions: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="improvement">What needs improvement?</Label>
                    <Textarea
                      id="improvement"
                      placeholder="One or two concrete actions for next time."
                      value={newEntry.improvement}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          improvement: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Anything else you want to remember?"
                      value={newEntry.notes}
                      onChange={(e) =>
                        setNewEntry({
                          ...newEntry,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>

            <DrawerFooter className="shrink-0 border-t border-border bg-background">
              {step === 1 ? (
                <>
                  <Button variant="outline" onClick={cancelNewEntry}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!newEntry.title || !newEntry.result}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleAddEntry}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingEntryId ? "Save changes" : "Save Entry"}
                  </Button>
                </>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete journal entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This journal entry will be permanently removed and cannot be recovered.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
