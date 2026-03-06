import { useState, useEffect } from "react";
import { Plus, Calendar, Trash2, BookOpen } from "lucide-react";
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

  mood?: string;

  // Optional: store a compiled string for list preview + "Read more"
  content: string;
}

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<
    string | null
  >(null);

  const [step, setStep] = useState<1 | 2>(1);

  const [newEntry, setNewEntry] = useState({
    title: "",
    result: "",
    mood: "",
    wentWell: "",
    wentPoorly: "",
    conditions: "",
    improvement: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("athleteJournal");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    setEntries(updatedEntries);
    localStorage.setItem(
      "athleteJournal",
      JSON.stringify(updatedEntries),
    );
  };

  const openNewEntry = () => {
    setStep(1);
    setNewEntry({
      title: "",
      result: "",
      mood: "",
      wentWell: "",
      wentPoorly: "",
      conditions: "",
      improvement: "",
    });
    setIsDialogOpen(true);
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

      content: compiled,
    };

    saveEntries([entry, ...entries]);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">Journal</h1>
            <p className="text-muted-foreground text-sm">
              {entries.length} entr{entries.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="rounded-xl">
            <Plus size={20} strokeWidth={1.8} />
          </Button>
        </div>

        {entries.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-primary" strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Start reflecting</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Document your performances and how you felt
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl">
                <Plus size={18} className="mr-2" strokeWidth={1.8} />
                New entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="overflow-hidden border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {entry.title}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground mb-2 flex-wrap gap-x-2 gap-y-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} strokeWidth={1.6} />
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        {entry.mood && (
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-medium">
                            {entry.mood}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-destructive hover:bg-destructive/10 rounded-lg h-8 w-8 p-0"
                    >
                      <Trash2 size={18} strokeWidth={1.6} />
                    </Button>
                  </div>
                  <p
                    className={`text-muted-foreground text-sm leading-relaxed ${
                      expandedEntry === entry.id ? "" : "line-clamp-3"
                    }`}
                  >
                    {entry.content}
                  </p>
                  {entry.content.length > 150 && (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-primary mt-2 font-medium text-sm"
                      onClick={() =>
                        setExpandedEntry(expandedEntry === entry.id ? null : entry.id)
                      }
                    >
                      {expandedEntry === entry.id ? "Show less" : "Read more"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Entry - bottom drawer */}
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent className="max-w-md mx-auto">
            <DrawerHeader>
              <DrawerTitle>
                {step === 1 ? "New Entry" : "Reflection"}
              </DrawerTitle>
              {/* Progress indicator */}
              <div className="mt-2 flex gap-2">
                <div
                  className={`h-1 flex-1 rounded-full ${step === 1 ? "bg-primary" : "bg-primary/20"}`}
                />
                <div
                  className={`h-1 flex-1 rounded-full ${step === 2 ? "bg-primary" : "bg-primary/20"}`}
                />
              </div>
              <DrawerDescription>
                {step === 1
                  ? "Enter the details of your event."
                  : "Reflect on your performance."}
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-4 pb-4">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entry-title">
                      Event / Title
                    </Label>
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
                    <Label htmlFor="mood">
                      Mood (optional)
                    </Label>
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
                    <Label htmlFor="wentWell">
                      What went well?
                    </Label>
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
                    <Label htmlFor="wentPoorly">
                      What went poorly?
                    </Label>
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
                    <Label htmlFor="improvement">
                      What needs improvement?
                    </Label>
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
                </>
              )}
            </div>
            <DrawerFooter className="flex flex-row items-center gap-3">
              {step === 1 ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!newEntry.title || !newEntry.result}
                    className="flex-1 rounded-xl"
                  >
                    Next
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={handleAddEntry} className="flex-1 rounded-xl">
                    Save entry
                  </Button>
                </>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}