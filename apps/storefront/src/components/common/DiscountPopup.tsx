"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

const popupConfig = {
  enabled: true,
  title: "خصم خاص لكِ",
  description: "استخدمي كود L10 للحصول على خصم إضافي على الطلب التجريبي.",
  coupon: "L10",
  delayMs: 1200,
};

export function DiscountPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!popupConfig.enabled || sessionStorage.getItem("discount-popup-seen")) return;
    const timer = window.setTimeout(() => setVisible(true), popupConfig.delayMs);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="popup" role="dialog" aria-modal="false" aria-labelledby="discount-title">
      <button
        className="icon-btn"
        type="button"
        onClick={() => {
          sessionStorage.setItem("discount-popup-seen", "true");
          setVisible(false);
        }}
        aria-label="إغلاق"
      >
        <X size={20} />
      </button>
      <h2 id="discount-title">{popupConfig.title}</h2>
      <p>{popupConfig.description}</p>
      <strong>{popupConfig.coupon}</strong>
    </div>
  );
}
