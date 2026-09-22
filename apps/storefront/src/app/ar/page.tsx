import {
  CampaignBanner,
  CategoryNavigation,
  CategoryShowcaseSections,
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
      <CategoryShowcaseSections />
      <FeaturedCollection />
      <NewestProducts />
      <TestimonialCarousel />
      <NewsletterSection />
    </>
  );
}
