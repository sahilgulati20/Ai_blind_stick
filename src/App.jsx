import { useEffect, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 2500);
  }, []);

  if (!ready) return <LoadingScreen />;

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-grid"></div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-blue-600 font-mono tracking-widest text-xs sm:text-sm md:text-base lg:text-lg px-4 overflow-auto">
          CORE SYSTEM READY
        </main>
      </div>
    </div>
  );
}
