import { Eye, Wifi, Battery, Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full px-4 md:px-6 py-3 flex justify-between items-center bg-white border-b border-slate-200 shadow-sm">

      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <img src="/image.png" alt="AI Blind Stick Logo" className="w-10 h-10 object-contain" />

        <div>
          <h1 className="font-mono text-lg md:text-xl tracking-widest font-semibold text-slate-800">
            AI BLIND STICK
          </h1>
          <p className="text-[10px] tracking-[0.25em] text-slate-400 uppercase">
            Smart Assistive Navigation
          </p>
        </div>
      </div>

      {/* System Info */}
      <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-slate-600">
        <Stat icon={<Wifi />} label="NET" value="ONLINE" />
        <Stat icon={<Battery />} label="PWR" value="88%" />
        <Stat icon={<Cpu />} label="AI" value="READY" />
      </div>
    </header>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 border border-slate-200 px-2 py-1 rounded-md bg-slate-50">
      <span className="text-blue-600">{icon}</span>
      <div>
        <div className="text-[8px] text-slate-400">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
