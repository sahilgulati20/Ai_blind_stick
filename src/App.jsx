import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, Battery, ShieldAlert, Crosshair, 
  Eye, Navigation, Activity, Maximize 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Custom Clinical/Lab CSS ---
const cyberStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  
  .font-cyber {
    font-family: 'Share Tech Mono', monospace;
  }
  
  /* Subtle Grid Background */
  .bg-grid {
    background-size: 40px 40px;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  }

  .cyber-box {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #cbd5e1; /* slate-300 */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 0 15px rgba(37, 99, 235, 0.1);
    backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
  }

  /* Corner Accents - Blue */
  .cyber-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 8px; height: 8px;
    border-top: 2px solid #2563eb; /* blue-600 */
    border-left: 2px solid #2563eb;
    z-index: 10;
  }
  .cyber-box::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 8px; height: 8px;
    border-bottom: 2px solid #2563eb;
    border-right: 2px solid #2563eb;
    z-index: 10;
  }

  /* Map Filter for Clinical Mode (Grayscale) */
  .map-blueprint .leaflet-tile-pane {
    filter: grayscale(100%) contrast(110%);
  }

  /* Radar Animations */
  @keyframes radar-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .radar-sweep {
    animation: radar-spin 2s linear infinite;
  }

  /* Loading bar animation */
  @keyframes load {
    from { transform: translateX(-100%); }
    to { transform: translateX(0%); }
  }
`;

// --- Hooks ---
const useExternalResource = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);
};

// --- Components ---

const StatBadge = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 border-2 border-blue-200/60 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-br from-white to-blue-50/40 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap backdrop-blur-sm">
      <span className="text-blue-600 flex-shrink-0 animate-pulse">{icon}</span>
      <div className="flex flex-col">
        <div className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-wider">{label}</div>
        <div className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-800">{value}</div>
      </div>
    </div>
  );
};

const Radar = () => {
  const [blips, setBlips] = useState([]);

  useEffect(() => {
    // Generate random radar blips
    const interval = setInterval(() => {
      const id = Date.now();
      const angle = Math.floor(Math.random() * 360);
      const dist = 20 + Math.floor(Math.random() * 60); 
      
      setBlips(prev => [...prev, { id, angle, dist }]);

      // Remove blip after 2s
      setTimeout(() => {
        setBlips(prev => prev.filter(b => b.id !== id));
      }, 2000);

    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-56 h-56 bg-slate-50 rounded-full border border-blue-200 shadow-inner flex items-center justify-center overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 border border-blue-200/60 rounded-full scale-[0.75]"></div>
      <div className="absolute inset-0 border border-blue-200/60 rounded-full scale-[0.50]"></div>
      <div className="absolute inset-0 border border-blue-200/60 rounded-full scale-[0.25]"></div>
      
      {/* Crosshairs */}
      <div className="absolute w-full h-[1px] bg-blue-300/40"></div>
      <div className="absolute h-full w-[1px] bg-blue-300/40"></div>

      {/* Radar Sweep Animation - Blue Gradient */}
      <div className="absolute inset-0 rounded-full radar-sweep bg-[conic-gradient(from_0deg,transparent_0deg,rgba(37,99,235,0.0)_60deg,rgba(37,99,235,0.2)_360deg)] border-r border-blue-400/50"></div>
      
      {/* Active Blips - Red for Obstacles */}
      {blips.map(blip => (
        <div 
          key={blip.id}
          className="absolute w-2 h-2 bg-red-500 rounded-full shadow-sm animate-pulse"
          style={{
            transform: `rotate(${blip.angle}deg) translateX(${blip.dist/1.5}px) rotate(-${blip.angle}deg)`, 
          }} 
        />
      ))}
      
      {/* Center User Dot */}
      <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full z-10 border-2 border-white shadow-sm"></div>
    </div>
  );
};

const CameraFeed = () => {
  const [streamURL, setStreamURL] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const streamRef = ref(db, "live_camera/link");
    
    const unsubscribe = onValue(streamRef, (snap) => {
      if (snap.val()) {
        setStreamURL(snap.val());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-100 overflow-hidden">
      {streamURL ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <iframe
            src={streamURL}
            allow="autoplay"
            scrolling="no"
            className="border-0"
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              aspectRatio: "16 / 9",
              objectFit: "contain",
            }}
          />
        </div>
      ) : (

        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 p-4 text-center">
           {loading ? (
             <Activity className="w-8 h-8 animate-spin text-blue-500" />
           ) : (
             <>
               <Wifi className="w-8 h-8 opacity-50" />
               <span className="font-cyber text-xs">WAITING FOR CAMERA...</span>
             </>
           )}
        </div>
      )}
      
      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 left-4 z-20 bg-white/90 hover:bg-white border border-blue-200 text-blue-600 p-2 rounded shadow-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-95 pointer-events-auto"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        <Maximize className="w-4 h-4" />
      </button>

      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] text-blue-900 font-cyber uppercase tracking-widest bg-white/80 px-3 py-1 rounded border border-blue-100 backdrop-blur-sm shadow-sm">
           <span>SOURCE: {streamURL ? 'LIVE' : 'OFFLINE'}</span>
           <span>STATUS: {streamURL ? 'REC' : 'STANDBY'}</span>
           <span>MODE: EXT_FEED</span>
        </div>
      </div>
    </div>
  );
};

const BlueprintMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [gpsData, setGpsData] = useState({ latitude: 29.000784, longitude: 77.697562333 });
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    // Listen to GPS data from Firebase
    const gpsRef = ref(db, "blind_stick/gps");
    const unsubscribe = onValue(gpsRef, (snap) => {
      const data = snap.val();
      if (data && data.latitude && data.longitude && data.valid) {
        console.log('GPS Update:', data.latitude, data.longitude);
        setGpsData({ latitude: data.latitude, longitude: data.longitude });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkL = setInterval(() => {
      if (window.L && !mapRef.current) {
        clearInterval(checkL);
        try {
            mapRef.current = window.L.map('cyber-map', {
            zoomControl: false,
            attributionControl: false
            }).setView([gpsData.latitude, gpsData.longitude], 16);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

            const icon = window.L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#2563eb; width:14px; height:14px; border-radius:50%; box-shadow:0 0 0 4px rgba(37,99,235,0.2); border: 2px solid white;'></div>",
            iconSize: [14, 14],
            iconAnchor: [7, 7]
            });

            markerRef.current = window.L.marker([gpsData.latitude, gpsData.longitude], { icon }).addTo(mapRef.current);
            setMapInitialized(true);
        } catch (e) {
            console.log("Map init deferred");
        }
      }
    }, 100);
    return () => clearInterval(checkL);
  }, [gpsData.latitude, gpsData.longitude]);

  // Update marker position when GPS data changes
  useEffect(() => {
    if (mapInitialized && mapRef.current && markerRef.current && gpsData.latitude && gpsData.longitude) {
      console.log('Updating marker position:', gpsData.latitude, gpsData.longitude);
      markerRef.current.setLatLng([gpsData.latitude, gpsData.longitude]);
      mapRef.current.setView([gpsData.latitude, gpsData.longitude], 16);
    }
  }, [gpsData.latitude, gpsData.longitude, mapInitialized]);

  return <div id="cyber-map" className="w-full h-full map-blueprint opacity-90" />;
};

export default function App() {
  useExternalResource();
  const [booted, setBooted] = useState(false);
  const [gpsData, setGpsData] = useState({ speed_kmph: 0, satellites: 0 });

  useEffect(() => {
    setTimeout(() => setBooted(true), 1500);
  }, []);

  useEffect(() => {
    // Listen to GPS data for navbar
    const gpsRef = ref(db, "blind_stick/gps");
    const unsubscribe = onValue(gpsRef, (snap) => {
      const data = snap.val();
      if (data) {
        setGpsData({
          speed_kmph: data.speed_kmph || 0,
          satellites: data.satellites || 0
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!booted) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col justify-center items-center text-center font-mono text-blue-600 px-3 sm:px-4 py-4">
        <Activity className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 animate-pulse mb-4 sm:mb-6" />
        <h1 className="text-base sm:text-xl md:text-3xl tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-bold text-slate-800 leading-relaxed max-w-xs sm:max-w-md md:max-w-lg">
          INITIALIZING <br />
          <span className="text-blue-600">AI BLIND STICK</span>
        </h1>
        <p className="mt-3 sm:mt-4 text-[9px] sm:text-[10px] md:text-xs text-slate-500 tracking-widest animate-pulse">
          LOADING ASSISTIVE MODULES...
        </p>
        <div className="mt-6 sm:mt-8 w-40 sm:w-52 md:w-64 h-0.5 sm:h-1 bg-slate-200 rounded overflow-hidden">
          <div className="h-full w-full bg-blue-500 animate-[load_2.5s_linear_forwards]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-slate-50 bg-grid text-slate-800 font-sans selection:bg-blue-200 overflow-hidden flex flex-col relative">
      <style>{cyberStyles}</style>
      
      {/* Main Layout */}
      <div className="flex flex-col h-full w-full p-2 sm:p-3 md:p-4 gap-2 sm:gap-3 md:gap-4">
        
        {/* Header (Row 1) */}
        <header className="col-span-12 flex justify-between items-center bg-gradient-to-r from-white via-blue-50/30 to-white border-b-2 border-blue-200 shadow-lg px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 gap-2 sm:gap-3 md:gap-4 rounded-lg flex-shrink-0">
          {/* Left Branding */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-max flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-white p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl ring-2 ring-blue-400">
                <img src="/image.png" alt="AI Blind Stick Logo" className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 object-contain" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 sm:gap-2">
                <h1 className="font-black text-sm sm:text-lg md:text-2xl lg:text-3xl tracking-tight text-slate-900 whitespace-nowrap relative">
                  AI <span className="text-blue-600">BLIND</span> <span className="hidden sm:inline">STICK</span>
                  <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent"></div>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-600 font-semibold tracking-wide">
                  Smart Assistive Nav
                </p>
              </div>
            </div>
          </div>
          {/* System Info */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 text-[8px] sm:text-[9px] md:text-xs font-mono text-slate-700 flex-shrink-0">
            <StatBadge icon={<Wifi size={12} className="sm:w-4 sm:h-4" />} label="NET" value="ONLINE" />
            <StatBadge icon={<Navigation size={12} className="sm:w-4 sm:h-4" />} label="SPD" value={`${gpsData.speed_kmph.toFixed(1)}km`} />
            <StatBadge icon={<Activity size={12} className="sm:w-4 sm:h-4" />} label="SAT" value={gpsData.satellites} />
          </div>
        </header>

        {/* Main Feed - Video Section */}
        <div className="flex-1 min-h-[250px] sm:min-h-[350px] md:min-h-0 md:flex-1 relative">
           <div className="cyber-box w-full h-full p-0 bg-white">
             <CameraFeed />
           </div>
           
           {/* Integrated SOS Button */}
           <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 pointer-events-auto z-10">
              <button 
                onClick={() => alert("EMERGENCY BEACON ACTIVATED")}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-cyber tracking-widest transition-all hover:scale-105 active:scale-95 shadow-sm rounded flex items-center gap-1 sm:gap-2 backdrop-blur-sm"
              >
                 <ShieldAlert className="w-3 sm:w-4 md:w-4 h-3 sm:h-4 md:h-4" /> <span className="hidden sm:inline">SOS</span>
              </button>
           </div>
        </div>

        {/* Bottom Section - Radar & Map (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 flex-shrink-0 min-h-[250px] sm:min-h-[300px] md:min-h-0 md:flex-1">
          {/* Radar Module */}
          <div className="col-span-1">
            <div className="cyber-box p-3 sm:p-4 flex flex-col items-center justify-center h-full">
              <h3 className="absolute top-2 left-2 text-[8px] sm:text-[10px] font-cyber text-slate-400">RADAR</h3>
              <div className="scale-75 sm:scale-90 md:scale-100 origin-center">
                <Radar />
              </div>
              <div className="mt-2 sm:mt-4 w-full grid grid-cols-2 gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-cyber text-center">
                <div className="bg-red-50 text-red-600 py-0.5 sm:py-1 font-bold border border-red-100">S: OBSTACLE</div>
                <div className="bg-slate-100 py-0.5 sm:py-1 text-slate-500">CLR</div>
              </div>
            </div>
          </div>

          {/* Map Module */}
          <div className="col-span-1 md:col-span-2">
            <div className="cyber-box h-full relative">
               <div className="absolute top-2 right-2 z-10 bg-white/90 px-2 py-1 border border-slate-200 shadow-sm backdrop-blur">
                 <span className="text-[8px] sm:text-[10px] font-cyber text-blue-600 flex items-center gap-1 font-bold">
                   <Navigation className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> <span className="hidden sm:inline">GPS_LOCK</span>
                 </span>
               </div>
               <BlueprintMap />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-[8px] sm:text-[10px] text-slate-400 font-cyber border-t border-slate-200 pt-2 flex-shrink-0">
           A.I Blind Stick | SYSTEM READY | AWAITING COMMAND
        </footer>

      </div>
    </div>
  );
}