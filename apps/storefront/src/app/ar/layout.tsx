import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { DiscountPopup } from "@/components/common/DiscountPopup";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { PromoBanner } from "@/components/common/PromoBanner";

export default function ArabicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <PromoBanner />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <DiscountPopup />
    </>
  );
}
