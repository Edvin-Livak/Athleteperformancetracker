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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-6">
          <div>
            <h1 className="text-3xl mb-1">Personal Bests</h1>
            <p className="text-gray-600">{bests.length} record{bests.length !== 1 ? 's' : ''}</p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
            size="lg"
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Bests List */}
        {bests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={32} className="text-orange-600" />
              </div>
              <h3 className="text-lg mb-2">No records yet</h3>
              <p className="text-gray-600 mb-4">Track your personal bests</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus size={20} className="mr-2" />
                Add Record
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {bests.map((record) => (
              <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-2 rounded-lg text-white flex-shrink-0">
                      <Trophy size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-0.5 truncate">{record.event}</h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg">{record.result}</span>
                        <span className="text-sm text-gray-600">{record.unit}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-xs text-gray-600 mt-1 truncate">{record.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-8 w-8 p-0"
                    >
                      <Trash2 size={16} />
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
                className="bg-orange-600 hover:bg-orange-700"
              >
                Add Record
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}