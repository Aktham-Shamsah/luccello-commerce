import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp"
      href="https://wa.me/966500000000?text=مرحبا%20لدي%20استفسار"
      aria-label="واتساب"
    >
      <MessageCircle size={30} />
    </a>
  );
}
