import { Link } from "react-router";
import {
  Video,
  BookOpen,
  Trophy,
  Target,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Home() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 pt-6 flex flex-col items-center text-center">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1606335544053-c43609e6155d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxOTQ3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl mb-2">
            Welcome Back, Athlete
          </h1>
          <p className="text-gray-600">
            Track your journey to greatness
          </p>
        </div>

        {/* Big button (full width, same height as one tile) */}
        <div className="mb-4">
          <Link to="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-0">
              <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Plus size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg">Video Learning</h3>
                    <p className="text-xs text-white/80 mt-1">
                      Analyse your recent performances
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link to="/videos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                <div className="bg-white/20 p-3 rounded-full mb-3">
                  <Video size={32} />
                </div>
                <h3 className="text-lg">Videos</h3>
                <p className="text-xs text-white/80 mt-1">
                  Upload & review
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                <div className="bg-white/20 p-3 rounded-full mb-3">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-lg">Journal</h3>
                <p className="text-xs text-white/80 mt-1">
                  Write & reflect
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/personal-bests">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
              <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                <div className="bg-white/20 p-3 rounded-full mb-3">
                  <Trophy size={32} />
                </div>
                <h3 className="text-lg">Best</h3>
                <p className="text-xs text-white/80 mt-1">
                  Personal records
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/goals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
              <CardContent className="p-6 flex flex-col items-center justify-center h-40">
                <div className="bg-white/20 p-3 rounded-full mb-3">
                  <Target size={32} />
                </div>
                <h3 className="text-lg">Goals</h3>
                <p className="text-xs text-white/80 mt-1">
                  Set targets
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}