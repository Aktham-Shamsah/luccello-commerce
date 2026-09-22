"use client";

import { useEffect, useState } from "react";
import { ensureBrowserSession, readConsent, setAnalyticsConsent } from "@/lib/analytics-client";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    void ensureBrowserSession();
    setVisible(readConsent() === null);
  }, []);

  if (!visible) return null;

  async function choose(enabled: boolean) {
    await setAnalyticsConsent(enabled);
    setVisible(false);
  }

  return (
    <aside className="cookie-consent" role="dialog" aria-label="إعدادات ملفات تعريف الارتباط">
      <div>
        <strong>خصوصيتك مهمة</strong>
        <p>
          نستخدم ملف جلسة آمن وضروري. تحليلات الاستخدام والإعلانات اختيارية ولا تُسجل إلا بعد
          موافقتك.
        </p>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="btn btn-outline" onClick={() => void choose(false)}>
          الضرورية فقط
        </button>
        <button type="button" className="btn btn-primary" onClick={() => void choose(true)}>
          السماح بالتحليلات
        </button>
      </div>
    </aside>
  );
}
