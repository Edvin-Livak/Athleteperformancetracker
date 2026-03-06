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
      performance: "bg-green-100 text-green-700",
      fitness: "bg-blue-100 text-blue-700",
      skill: "bg-purple-100 text-purple-700",
      nutrition: "bg-orange-100 text-orange-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-6">
          <div>
            <h1 className="text-3xl mb-1">Goals</h1>
            <p className="text-gray-600">
              {activeCount} active · {completedCount} completed
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-green-600" : ""}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={filter === "active" ? "bg-green-600" : ""}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "bg-green-600" : ""}
          >
            Completed
          </Button>
        </div>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg mb-2">
                {filter === "all" ? "No goals yet" : `No ${filter} goals`}
              </h3>
              <p className="text-gray-600 mb-4">Set a goal and start your journey</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus size={20} className="mr-2" />
                New Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map((goal) => {
              const isOverdue =
                !goal.completed && new Date(goal.targetDate) < new Date();
              
              return (
                <Card
                  key={goal.id}
                  className={`overflow-hidden ${
                    goal.completed ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(goal.id)}
                        className="mt-1 text-green-600 hover:text-green-700 transition-colors"
                      >
                        {goal.completed ? (
                          <CheckCircle2 size={24} className="fill-current" />
                        ) : (
                          <Circle size={24} />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className={`text-lg ${
                              goal.completed ? "line-through" : ""
                            }`}
                          >
                            {goal.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(goal.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 -mt-1"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                        {goal.description && (
                          <p className="text-gray-600 text-sm mb-3">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-1 rounded ${getCategoryColor(
                              goal.category
                            )}`}
                          >
                            {goal.category}
                          </span>
                          <div
                            className={`flex items-center text-xs ${
                              isOverdue ? "text-red-600" : "text-gray-500"
                            }`}
                          >
                            <Calendar size={12} className="mr-1" />
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
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