import {
  CampaignBanner,
  CategoryNavigation,
  FeaturedCollection,
  HeroSlider,
  NewestProducts,
  NewsletterSection,
  TestimonialCarousel,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CampaignBanner />
      <CategoryNavigation />
      <FeaturedCollection />
      <NewestProducts />
      <TestimonialCarousel />
      <NewsletterSection />
    </>
  );
}
