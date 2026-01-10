import { Activity } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col justify-center items-center text-center font-mono text-blue-600 px-4">

      <Activity className="w-16 md:w-20 h-16 md:h-20 animate-pulse mb-6" />

      <h1 className="text-xl md:text-3xl tracking-[0.3em] md:tracking-[0.4em] font-bold text-slate-800 leading-relaxed">
        INITIALIZING <br />
        <span className="text-blue-600">AI BLIND STICK</span>
      </h1>

      <p className="mt-4 text-[10px] md:text-xs text-slate-500 tracking-widest animate-pulse">
        LOADING ASSISTIVE MODULES...
      </p>

      <div className="mt-8 w-52 md:w-64 h-1 bg-slate-200 rounded overflow-hidden">
        <div className="h-full w-full bg-blue-500 animate-[load_2.5s_linear_forwards]"></div>
      </div>
    </div>
  );
}
