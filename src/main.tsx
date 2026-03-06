import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { seedDummyDataIfNeeded } from "./app/data/dummyData";
import "./styles/index.css";

// Seed localStorage with dummy data before any component runs, so goals/bests/journal etc. show up
seedDummyDataIfNeeded();

createRoot(document.getElementById("root")!).render(<App />);
  