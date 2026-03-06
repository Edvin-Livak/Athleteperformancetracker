import { useState, useEffect } from "react";
import { Plus, Calendar, Trash2, BookOpen } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface JournalEntry {
  id: string;
  date: string;

  title: string; // Event title
  result: string; // Result summary

  wentWell: string;
  wentPoorly: string;
  conditions: string;
  improvement: string;

  notes?: string;

  mood?: string;

  // Optional: store a compiled string for list preview + "Read more"
  content: string;
}

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    setEntries(updatedEntries);
    localStorage.setItem("athleteJournal", JSON.stringify(updatedEntries));
  };

  const openNewEntry = () => {
    resetNewEntry();
    setIsDialogOpen(true);
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

  const cancelNewEntry = () => {
    resetNewEntry();
    setIsDialogOpen(false);
  };

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.result) return;

    const compiled = [
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
      notes: newEntry.notes,

      content: compiled,
    };

    saveEntries([entry, ...entries]);
    //setIsDialogOpen(false);
    cancelNewEntry();
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-6">
          <div>
            <h1 className="text-3xl mb-1">Journal</h1>
            <p className="text-gray-600">
              {entries.length} entr
              {entries.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Plus size={18} className="mr-2" />
            Add Entry
          </Button>
        </div>

        {/* Entries List */}
        {entries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg mb-2">Start Reflection</h3>
              <p className="text-gray-600 mb-4">
                Start documenting your journey
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={20} className="mr-2" />
                New Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{entry.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Calendar size={14} className="mr-1" />
                        {new Date(entry.date).toLocaleDateString()}
                        {entry.mood && (
                          <span className="ml-3 bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {entry.mood}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                  <div
                    className={`text-gray-700 ${expandedEntry === entry.id ? "" : "line-clamp-6"}`}
                  >
                    {/* Result + Mood */}
                    <div className="mb-3">
                      <div className="text-sm">
                        <span className="font-semibold">Result:</span>{" "}
                        <span>{entry.result || "—"}</span>
                      </div>
                      {entry.mood && (
                        <div className="text-sm">
                          <span className="font-semibold">Mood:</span>{" "}
                          <span>{entry.mood}</span>
                        </div>
                      )}
                    </div>

                    {/* Guided questions */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-semibold">What went well?</div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {entry.wentWell || "—"}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold">What went poorly?</div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {entry.wentPoorly || "—"}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold">
                          Were the conditions optimal?
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {entry.conditions || "—"}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold">
                          What needs improvement?
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {entry.improvement || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 mt-2"
                    onClick={() =>
                      setExpandedEntry(
                        expandedEntry === entry.id ? null : entry.id,
                      )
                    }
                  >
                    {expandedEntry === entry.id ? "Show less" : "Read more"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {step === 1 ? "New Entry" : "Reflection"}
              </DialogTitle>
              {/* Progress indicator */}
              <div className="mt-2 flex gap-2">
                <div
                  className={`h-1 flex-1 rounded ${step === 1 ? "bg-blue-600" : "bg-blue-200"}`}
                />
                <div
                  className={`h-1 flex-1 rounded ${step === 2 ? "bg-blue-600" : "bg-blue-200"}`}
                />
              </div>
              <DialogDescription>
                {step === 1
                  ? "Enter the details of your event."
                  : "Reflect on your performance."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
            <DialogFooter className="flex items-center justify-between">
              {step === 1 ? (
                <>
                  <Button variant="outline" onClick={() => cancelNewEntry()}>
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
                    Save Entry
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
