"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollProgressButton() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setProgress(next);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <button
      className="scroll-progress"
      type="button"
      aria-label={`العودة إلى أعلى الصفحة - تم تمرير ${Math.round(progress)}%`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="scroll-progress__track" cx="22" cy="22" r="19" />
        <circle
          className="scroll-progress__value"
          cx="22"
          cy="22"
          r="19"
          pathLength="100"
          strokeDasharray={`${progress} 100`}
        />
      </svg>
      <ArrowUp size={19} />
    </button>
  );
}
