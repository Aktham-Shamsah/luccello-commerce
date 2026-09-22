import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ActivityTracker } from "@/components/common/ActivityTracker";
import { CookieConsent } from "@/components/common/CookieConsent";
import { DiscountPopup } from "@/components/common/DiscountPopup";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ManagedBanner } from "@/components/common/ManagedBanner";
import { ScrollProgressButton } from "@/components/common/ScrollProgressButton";
import { WhatsAppButton } from "@/components/common/WhatsAppButton";

export default function ArabicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ActivityTracker />
      <AnnouncementBar />
      <Header />
      <ManagedBanner />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <ScrollProgressButton />
      <CookieConsent />
      <DiscountPopup />
    </>
  );
}
