import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { seedDummyDataIfNeeded } from "./app/data/dummyData";

seedDummyDataIfNeeded();

createRoot(document.getElementById("root")!).render(<App />);