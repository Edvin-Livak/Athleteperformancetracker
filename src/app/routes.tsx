import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Videos } from "./components/Videos";
import { VideoDetail } from "./components/VideoDetail";
import { Journal } from "./components/Journal";
import { PersonalBests } from "./components/PersonalBests";
import { Goals } from "./components/Goals";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "videos", Component: Videos },
      { path: "videos/:id", Component: VideoDetail },
      { path: "journal", Component: Journal },
      { path: "personal-bests", Component: PersonalBests },
      { path: "goals", Component: Goals },
    ],
  },
]);