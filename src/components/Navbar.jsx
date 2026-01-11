import { Wifi, Battery, Cpu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full px-2 sm:px-4 md:px-6 py-2 sm:py-3 flex justify-between items-center bg-white border-b border-slate-200 shadow-sm gap-2 sm:gap-4 overflow-x-auto">

      {/* Left Branding */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        <img src="/image.png" alt="AI Blind Stick Logo" className="w-8 sm:w-10 h-8 sm:h-10 object-contain flex-shrink-0" />

        <div className="hidden sm:block">
          <h1 className="font-mono text-sm sm:text-lg md:text-xl tracking-widest font-semibold text-slate-800 whitespace-nowrap">
            AI BLIND STICK
          </h1>
          <p className="text-[8px] sm:text-[10px] tracking-[0.25em] text-slate-400 uppercase">
            Smart Assistive Navigation
          </p>
        </div>
      </div>

      {/* System Info */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-[8px] sm:text-[10px] md:text-xs font-mono text-slate-600">
        <Stat icon={<Wifi size={14} className="sm:w-4 sm:h-4" />} label="NET" value="ONLINE" />
        <Stat icon={<Battery size={14} className="sm:w-4 sm:h-4" />} label="PWR" value="88%" />
        <Stat icon={<Cpu size={14} className="sm:w-4 sm:h-4" />} label="AI" value="READY" />
      </div>
    </header>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 border border-slate-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-slate-50 whitespace-nowrap">
      <span className="text-blue-600 flex-shrink-0">{icon}</span>
      <div className="hidden sm:block">
        <div className="text-[7px] sm:text-[8px] text-slate-400">{label}</div>
        <div className="font-semibold text-[8px] sm:text-xs">{value}</div>
      </div>
      <div className="sm:hidden">
        <div className="font-semibold text-[8px]">{value}</div>
      </div>
    </div>
  );
}
