"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp"
      href="#"
      onClick={(event) => event.preventDefault()}
      aria-label="دعم واتساب - الرابط غير مفعّل حالياً"
      aria-disabled="true"
    >
      <MessageCircle size={26} />
      <span>تحدث معنا</span>
    </a>
  );
}
