"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordActivity } from "@/lib/analytics-client";

export function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void recordActivity("page_view", pathname);
  }, [pathname]);

  return null;
}
