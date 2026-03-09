import { useState, useEffect } from "react";
import {
  Plus,
  Target,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ConfirmDeleteButton } from "./ConfirmDeleteButton";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const resetNewGoal = () => {
    setNewGoal({
      title: "",
      description: "",
      targetDate: "",
      category: "performance",
    });
  };

  const openNewGoal = () => {
    resetNewGoal();
    setIsDrawerOpen(true);
  };

  const cancelNewGoal = () => {
    resetNewGoal();
    setIsDrawerOpen(false);
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
    cancelNewGoal();
  };

  const toggleComplete = (id: string) => {
    saveGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal,
      ),
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
      performance: "bg-green-100 text-green-700",
      fitness: "bg-blue-100 text-blue-700",
      skill: "bg-purple-100 text-purple-700",
      nutrition: "bg-orange-100 text-orange-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-5 pt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground mb-0.5">
              Goals
            </h1>
            <p className="text-muted-foreground text-sm">
              {activeCount} active · {completedCount} completed
            </p>
          </div>

          <Button
            onClick={openNewGoal}
            className="bg-green-600 hover:bg-green-700 rounded-full h-9 px-3 flex items-center gap-1 text-xs"
          >
            <Plus size={14} strokeWidth={2} />
            Add
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={
              filter === "all"
                ? "bg-green-600 hover:bg-green-700 rounded-full"
                : "rounded-full border-border"
            }
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={
              filter === "active"
                ? "bg-green-600 hover:bg-green-700 rounded-full"
                : "rounded-full border-border"
            }
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className={
              filter === "completed"
                ? "bg-green-600 hover:bg-green-700 rounded-full"
                : "rounded-full border-border"
            }
          >
            Completed
          </Button>
        </div>

        {filteredGoals.length === 0 ? (
          <Card className="border border-border rounded-2xl shadow-md">
            <CardContent className="p-10 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target
                  size={32}
                  className="text-green-600"
                  strokeWidth={1.6}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === "all" ? "No goals yet" : `No ${filter} goals`}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Set a goal and start your journey
              </p>
              <Button
                onClick={openNewGoal}
                className="bg-green-600 hover:bg-green-700 rounded-xl"
              >
                <Plus size={18} className="mr-2" strokeWidth={1.8} />
                Add goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredGoals.map((goal) => {
              const isOverdue =
                !goal.completed && new Date(goal.targetDate) < new Date();

              return (
                <Card
                  key={goal.id}
                  className={`overflow-hidden border rounded-xl shadow-sm transition-all ${
                    goal.completed
                      ? "bg-green-50 border-green-200 hover:border-green-300"
                      : "bg-card border-border hover:shadow-md hover:border-green-200"
                  }`}
                >
                  <CardContent className="p-2.5">
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => toggleComplete(goal.id)}
                        className="flex-shrink-0 self-start rounded-lg p-1 transition-colors text-green-600 hover:text-green-700"
                        aria-label={
                          goal.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {goal.completed ? (
                          <CheckCircle2 size={18} className="fill-current" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-[13px] font-semibold text-foreground truncate leading-tight ${
                            goal.completed ? "line-through opacity-70" : ""
                          }`}
                        >
                          {goal.title}
                        </h3>

                        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                          <span
                            className={`text-[11px] ${
                              isOverdue
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {new Date(goal.targetDate).toLocaleDateString()}
                            {isOverdue && " · overdue"}
                          </span>

                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${getCategoryColor(
                              goal.category,
                            )}`}
                          >
                            {goal.category}
                          </span>
                        </div>

                        {goal.description && (
                          <p
                            className={`text-[11px] text-muted-foreground truncate leading-tight mt-0.5 ${
                              goal.completed ? "opacity-70" : ""
                            }`}
                          >
                            {goal.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 flex-shrink-0 w-[58px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleComplete(goal.id)}
                          className={`h-6 rounded-md px-1 text-[10px] ${
                            goal.completed
                              ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                              : "border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                          }`}
                        >
                          {goal.completed ? "Undo" : "Done"}
                        </Button>

                        <div className="h-6 flex items-center justify-center text-[10px] text-muted-foreground rounded-md border border-border">
                          <Calendar size={10} className="mr-1" />
                          Date
                        </div>

                        <ConfirmDeleteButton
                          onConfirm={() => handleDelete(goal.id)}
                          title="Delete goal?"
                          description="This goal will be permanently removed."
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

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent className="max-w-md mx-auto max-h-[90vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Set New Goal</DrawerTitle>
              <DrawerDescription>
                Add a new goal to help guide your training.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto space-y-4 px-4 pb-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., Run 5k under 20 minutes"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, category: value })
                  }
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

            <DrawerFooter className="shrink-0 border-t border-border bg-background">
              <Button variant="outline" onClick={cancelNewGoal}>
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                disabled={!newGoal.title || !newGoal.targetDate}
                className="bg-green-600 hover:bg-green-700"
              >
                Set Goal
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
