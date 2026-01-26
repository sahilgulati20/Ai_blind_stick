import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { ShieldAlert, Wifi } from "lucide-react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function LiveVideo() {
  const [streamURL, setStreamURL] = useState("");
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    const streamRef = ref(db, "live_camera/link");
    const unsubscribe = onValue(streamRef, snap => {
      if (snap.val()) {
        setStreamURL(snap.val());
        setImageKey(Date.now()); // Force image refresh when URL updates
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-refresh image every 2 seconds
  useEffect(() => {
    if (streamURL) {
      const interval = setInterval(() => {
        setImageKey(Date.now());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [streamURL]);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">

      {streamURL ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            key={imageKey}
            src={`${streamURL}?t=${imageKey}`}
            alt="Live Camera Feed"
            className="w-full h-full object-cover"
            style={{
              display: 'block'
            }}
            onError={(e) => {
              console.error('Image load error');
              e.target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Wifi className="w-8 h-8 opacity-50" />
          <span className="font-mono text-xs">WAITING FOR CAMERA…</span>
        </div>
      )}

      {/* HUD BAR */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/90 border border-blue-200
                      text-[11px] font-mono text-blue-700 tracking-widest flex justify-between px-4 py-1">
        <span>SOURCE: {streamURL ? "LIVE" : "OFFLINE"}</span>
        <span>REC: LIVE</span>
        <span>MODE: IMG_FEED</span>
      </div>

      {/* SOS */}
      <button className="absolute top-4 right-4 bg-red-50 border border-red-200 text-red-600 
                         px-4 py-1 text-xs font-mono tracking-widest">
        <ShieldAlert size={14}/> SOS
      </button>
    </div>
  );
}

export default LiveVideo;
