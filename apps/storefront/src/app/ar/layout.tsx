import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { DiscountPopup } from "@/components/common/DiscountPopup";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";
import { ManagedBanner } from "@/components/common/ManagedBanner";

export default function ArabicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <ManagedBanner />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <DiscountPopup />
    </>
  );
}
