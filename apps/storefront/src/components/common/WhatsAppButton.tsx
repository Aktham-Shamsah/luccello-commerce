"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const SUPPORT_NUMBER = "966509827383";

export function WhatsAppButton() {
  const pathname = usePathname();
  const message = encodeURIComponent(`مرحباً LU'CHÉLO، لدي استفسار بخصوص هذه الصفحة: ${pathname}`);

  return (
    <a
      className="whatsapp"
      href={`https://wa.me/${SUPPORT_NUMBER}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="التحدث مع دعم LU'CHÉLO عبر واتساب"
    >
      <MessageCircle size={26} />
      <span>تحدث معنا</span>
    </a>
  );
}
