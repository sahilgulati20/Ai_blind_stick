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

  useEffect(() => {
    const streamRef = ref(db, "live_camera/link");
    onValue(streamRef, snap => {
      if (snap.val()) setStreamURL(snap.val());
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">

      {streamURL ? (
        <iframe
          src={streamURL}
          allow="autoplay"
          className="absolute inset-0 w-full h-full border-0"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            margin: 0,
            padding: 0
          }}
        />
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
        <span>MODE: EXT_FEED</span>
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
