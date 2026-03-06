import { useState, useEffect } from "react";
import { Plus, Target, CheckCircle2, Circle, Trash2, Calendar } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: "",
    category: "performance",
  });

  useEffect(() => {
    const stored = localStorage.getItem("athleteGoals");
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem("athleteGoals", JSON.stringify(updatedGoals));
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      category: newGoal.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveGoals([goal, ...goals]);
    setNewGoal({ title: "", description: "", targetDate: "", category: "performance" });
    setIsDialogOpen(false);
  };

  const toggleComplete = (id: string) => {
    saveGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const handleDelete = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === "active") return !goal.completed;
    if (filter === "completed") return goal.completed;
    return true;
  });

  const activeCount = goals.filter((g) => !g.completed).length;
  const completedCount = goals.filter((g) => g.completed).length;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      performance: "bg-primary/10 text-primary",
      fitness: "bg-primary/10 text-primary",
      skill: "bg-primary/10 text-primary",
      nutrition: "bg-primary/10 text-primary",
      other: "bg-muted text-muted-foreground",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-background p-5 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">Goals</h1>
            <p className="text-muted-foreground text-sm">
              {activeCount} active · {completedCount} completed
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} size="lg" className="rounded-xl">
            <Plus size={20} strokeWidth={1.8} />
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={`rounded-xl ${filter === "all" ? "" : "border-border/60"}`}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={`rounded-xl ${filter === "active" ? "" : "border-border/60"}`}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className={`rounded-xl ${filter === "completed" ? "" : "border-border/60"}`}
          >
            Completed
          </Button>
        </div>

        {filteredGoals.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-primary" strokeWidth={1.6} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === "all" ? "No goals yet" : `No ${filter} goals`}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">Set an intention and take small steps</p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl">
                <Plus size={18} className="mr-2" strokeWidth={1.8} />
                New goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const isOverdue =
                !goal.completed && new Date(goal.targetDate) < new Date();

              return (
                <Card
                  key={goal.id}
                  className={`overflow-hidden border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all ${goal.completed ? "opacity-75" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(goal.id)}
                        className="mt-0.5 text-primary hover:underline transition-colors"
                      >
                        {goal.completed ? (
                          <CheckCircle2 size={24} className="fill-current" strokeWidth={1.6} />
                        ) : (
                          <Circle size={24} strokeWidth={1.6} />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className={`text-base font-semibold text-foreground ${
                              goal.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {goal.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                            className="text-destructive hover:bg-destructive/10 -mt-1 rounded-lg h-8 w-8 p-0"
                          >
                            <Trash2 size={18} strokeWidth={1.6} />
                          </Button>
                        </div>
                        {goal.description && (
                          <p className="text-muted-foreground text-sm mb-2">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(
                              goal.category
                            )}`}
                          >
                            {goal.category}
                          </span>
                          <div
                            className={`flex items-center text-xs ${
                              isOverdue ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            <Calendar size={12} className="mr-1" strokeWidth={1.6} />
                            {new Date(goal.targetDate).toLocaleDateString()}
                            {isOverdue && " (overdue)"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add Goal - bottom drawer */}
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent className="max-w-md mx-auto">
            <DrawerHeader>
              <DrawerTitle>Set New Goal</DrawerTitle>
              <DrawerDescription>
                Add a new goal to help you achieve your fitness objectives.
              </DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 px-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., Run 5k under 20 minutes"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="skill">Skill</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-date">Target Date</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-description">Description (optional)</Label>
                <Textarea
                  id="goal-description"
                  placeholder="Add more details about your goal..."
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                disabled={!newGoal.title || !newGoal.targetDate}
                className="rounded-xl"
              >
                Set goal
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}