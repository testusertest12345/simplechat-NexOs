"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Home,
  Compass,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion } from "framer-motion";

const NavBase: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const updateFullscreenState = useCallback(() => {
    setIsFullscreen(Boolean(document.fullscreenElement));
  }, []);

  const toggleFullscreen = useCallback(async (e?: Event) => {
    if (e && (e as KeyboardEvent).type === "keydown") {
      try {
        (e as KeyboardEvent).preventDefault?.();
      } catch {}
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen toggle failed:", err);
    }
  }, []);
  useEffect(() => {
    const onFsChange = () => updateFullscreenState();
    window.addEventListener("resize", updateFullscreenState);
    document.addEventListener("fullscreenchange", onFsChange);
    updateFullscreenState();
    return () => {
      window.removeEventListener("resize", updateFullscreenState);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [updateFullscreenState]);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-4 right-4 flex gap-4 justify-center align-center z-50">
        <button className="keydet p-2 rounded-xl bg-black/50 backdrop-blur-md hover:bg-white/10 transition flex items-center gap-2">
          <Home size={22} />
          <div className="keypoardhelp">Home</div>
        </button>
        <button className="keydet p-2 rounded-xl bg-black/50 backdrop-blur-md hover:bg-white/10 transition flex items-center gap-2">
          <Compass size={22} />
          <div className="keypoardhelp">Navigation</div>
        </button>
        <button className="keydet p-2 rounded-xl bg-black/50 backdrop-blur-md hover:bg-white/10 transition flex items-center gap-2">
          <Settings size={22} />
          <div className="keypoardhelp">Preferences</div>
        </button>
        <button
          className="keydet p-2 rounded-xl bg-black/50 backdrop-blur-md hover:bg-white/10 transition flex items-center gap-2"
          onClick={() => toggleFullscreen()}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          <div className="keypoardhelp">{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</div>
        </button>
      </motion.div>
    </>
  );
};

export default NavBase;
