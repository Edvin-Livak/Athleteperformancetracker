import { Outlet, useLocation, Link } from "react-router";
import { Home, Video, BookOpen, Trophy, Target } from "lucide-react";
import { useEffect, useState } from "react";

export function Root() {
  const location = useLocation();
  const [hideForDrawer, setHideForDrawer] = useState(false);

  useEffect(() => {
    const update = () => {
      setHideForDrawer(document.body.classList.contains("hide-bottom-nav"));
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const hideNav =
    location.pathname.startsWith("/compare") || hideForDrawer;

  return (
    <div className="flex flex-col h-screen bg-background">
      <main
        className="flex-1 overflow-y-auto"
        style={{
          paddingBottom: hideNav
            ? "0px"
            : "calc(7.5rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <Outlet />
      </main>

      {!hideNav && (
        <nav
          className="fixed left-4 right-4 max-w-md mx-auto bg-[#1A1A1A] rounded-full shadow-xl border border-[#2A2A2A] z-[1000]"
          style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="flex justify-between items-center p-3">
            <Link
              to="/videos"
              className={`flex items-center justify-center rounded-full transition-colors shrink-0 ${
                isActive("/videos")
                  ? "bg-white text-[#1A1A1A] size-10"
                  : "text-white/90 hover:text-white size-10"
              }`}
              aria-label="Videos"
            >
              <Video size={24} strokeWidth={1.8} />
            </Link>

            <Link
              to="/journal"
              className={`flex items-center justify-center rounded-full transition-colors shrink-0 ${
                isActive("/journal")
                  ? "bg-white text-[#1A1A1A] size-10"
                  : "text-white/90 hover:text-white size-10"
              }`}
              aria-label="Journal"
            >
              <BookOpen size={24} strokeWidth={1.8} />
            </Link>

            <Link
              to="/"
              className={`flex items-center justify-center rounded-full transition-colors shrink-0 ${
                isActive("/")
                  ? "bg-white text-[#1A1A1A] size-10"
                  : "text-white/90 hover:text-white size-10"
              }`}
              aria-label="Home"
            >
              <Home size={24} strokeWidth={1.8} />
            </Link>

            <Link
              to="/personal-bests"
              className={`flex items-center justify-center rounded-full transition-colors shrink-0 ${
                isActive("/personal-bests")
                  ? "bg-white text-[#1A1A1A] size-10"
                  : "text-white/90 hover:text-white size-10"
              }`}
              aria-label="Personal bests"
            >
              <Trophy size={24} strokeWidth={1.8} />
            </Link>

            <Link
              to="/goals"
              className={`flex items-center justify-center rounded-full transition-colors shrink-0 ${
                isActive("/goals")
                  ? "bg-white text-[#1A1A1A] size-10"
                  : "text-white/90 hover:text-white size-10"
              }`}
              aria-label="Goals"
            >
              <Target size={24} strokeWidth={1.8} />
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}