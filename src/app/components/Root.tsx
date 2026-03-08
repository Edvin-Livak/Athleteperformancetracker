import { Outlet, useLocation, Link } from "react-router";
import { Home, Video, BookOpen, Trophy, Target } from "lucide-react";

export function Root() {
  const location = useLocation();
  const hideBottomNav = location.pathname === "/";

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto ${hideBottomNav ? "" : "pb-20"}`}
      >
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-4 pb-2 safe-area-inset-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link
              to="/videos"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/videos")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Video size={24} />
              <span className="text-xs">Videos</span>
            </Link>

            <Link
              to="/journal"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/journal")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen size={24} />
              <span className="text-xs">Journal</span>
            </Link>

            <Link to="/" className="flex flex-col items-center gap-1 px-3">
              <div
                className={`-mt-6 h-14 w-14 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  isActive("/")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                <Home size={26} />
              </div>
              <span
                className={`text-xs ${
                  isActive("/") ? "text-blue-600" : "text-gray-600"
                }`}
              >
                Home
              </span>
            </Link>

            <Link
              to="/personal-bests"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/personal-bests")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Trophy size={24} />
              <span className="text-xs">Best</span>
            </Link>

            <Link
              to="/goals"
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive("/goals")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Target size={24} />
              <span className="text-xs">Goals</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
