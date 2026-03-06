import { useState, useEffect } from "react";
import { Plus, Trophy, TrendingUp, Calendar, Trash2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PersonalBest {
  id: string;
  event: string;
  result: string;
  unit: string;
  date: string;
  notes?: string;
}

export function PersonalBests() {
  const [bests, setBests] = useState<PersonalBest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBest, setNewBest] = useState({
    event: "",
    result: "",
    unit: "seconds",
    notes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("athleteBests");
    if (stored) {
      setBests(JSON.parse(stored));
    }
  }, []);

  const saveBests = (updatedBests: PersonalBest[]) => {
    setBests(updatedBests);
    localStorage.setItem("athleteBests", JSON.stringify(updatedBests));
  };

  const handleAddBest = () => {
    if (!newBest.event || !newBest.result) return;

    const best: PersonalBest = {
      id: Date.now().toString(),
      event: newBest.event,
      result: newBest.result,
      unit: newBest.unit,
      date: new Date().toISOString(),
      notes: newBest.notes,
    };

    saveBests([best, ...bests]);
    setNewBest({ event: "", result: "", unit: "seconds", notes: "" });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    saveBests(bests.filter((b) => b.id !== id));
  };

  // Group bests by event
  const groupedBests = bests.reduce((acc, best) => {
    if (!acc[best.event]) {
      acc[best.event] = [];
    }
    acc[best.event].push(best);
    return acc;
  }, {} as Record<string, PersonalBest[]>);

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">Personal bests</h1>
            <p className="text-muted-foreground text-sm">{bests.length} record{bests.length !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="rounded-xl">
            <Plus size={20} strokeWidth={1.8} />
          </Button>
        </div>

        {bests.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy size={32} className="text-primary" strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No records yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Track your personal bests over time</p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl">
                <Plus size={18} className="mr-2" strokeWidth={1.8} />
                Add record
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {bests.map((record) => (
              <Card key={record.id} className="overflow-hidden border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary p-2.5 rounded-lg flex-shrink-0">
                      <Trophy size={20} strokeWidth={1.6} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{record.event}</h3>
                      <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                        <span className="text-lg font-semibold text-primary tabular-nums">{record.result}</span>
                        <span className="text-sm text-muted-foreground">{record.unit}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{record.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8 p-0 rounded-xl"
                    >
                      <Trash2 size={16} strokeWidth={1.6} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Best - bottom drawer */}
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent className="max-w-md mx-auto">
            <DrawerHeader>
              <DrawerTitle>Add Personal Best</DrawerTitle>
              <DrawerDescription>Enter your personal best details below.</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="event">Event</Label>
                <Input
                  id="event"
                  placeholder="e.g., 100m Sprint, Long Jump"
                  value={newBest.event}
                  onChange={(e) => setNewBest({ ...newBest, event: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <Input
                    id="result"
                    placeholder="e.g., 10.5"
                    value={newBest.result}
                    onChange={(e) => setNewBest({ ...newBest, result: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={newBest.unit}
                    onValueChange={(value) => setNewBest({ ...newBest, unit: value })}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">seconds</SelectItem>
                      <SelectItem value="minutes">minutes</SelectItem>
                      <SelectItem value="meters">meters</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="reps">reps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Any additional details..."
                  value={newBest.notes}
                  onChange={(e) => setNewBest({ ...newBest, notes: e.target.value })}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddBest}
                disabled={!newBest.event || !newBest.result}
                className="rounded-xl"
              >
                Add record
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}