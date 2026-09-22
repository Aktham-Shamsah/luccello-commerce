# Reference Audit: luccello-bag.com

Observed on 2026-09-22 from `https://luccello-bag.com/`.

## Desktop Layout

- RTL Arabic Salla storefront with `html dir="rtl"` and body direction RTL.
- Header sits over/near the hero. Desktop navigation includes all products, offer categories, Handbags, Tote Bags, Shoulder Bags, CrossBody Bags, and discounts.
- Visual style uses large immersive campaign imagery, dark teal/blue tones, white Arabic display copy, and a floating WhatsApp action.
- Product sections use compact cards with square product images, product numbers as titles, sale price, struck regular price, discount badge, wishlist action, and add-to-cart.

## Mobile Layout

- Mobile header exposes cart/search/account/menu icon controls.
- Hero remains first viewport dominant with the campaign image filling the width.
- Announcement ticker follows/overlaps the hero rhythm with shipping and coupon copy such as free immediate shipping and coupon `L10`.
- Banners and sections stack vertically. Product cards form a dense two-column grid.

## Components And Behavior

- Header: brand/logo, cart count, account, search, hamburger/mobile menu.
- Announcement: promotional shipping/coupon strip.
- Navigation: category links for all products, 196 SAR offers, 296 SAR offers, Handbags, Tote Bags, Shoulder Bags, CrossBody Bags, discounts.
- Hero/banner: campaign photography with large Arabic promotional text. Our implementation uses original generated imagery and overlay text instead of copied reference assets.
- Product grids: square image cards, centered title, price presentation, discount badge, add-to-cart button.
- Product page: image gallery, product SKU/title, pricing, sale discount, stock state, quantity, options, notes, attachment slot, description/specifications/reviews, related products.
- Search: one input exposed from header and `/ar/search`.
- Cart/checkout: cart route exists; checkout must recompute totals and verify payments server-side.
- Footer: important links, about text, commercial/contact info, social links, payment/trust badge concept.
- WhatsApp: floating contact link.
- Popup: discount popup with title, description, coupon, delay, and frequency control.

## Design Direction To Reproduce

- Use RTL globally, not manual one-off reversals.
- Keep proportions close: full hero first, promotional banner below, titled sections, dense product grids, footer information blocks.
- Avoid copying logo, photography, reviews, customer names, or proprietary assets.
- Use fictional Arabic content and original assets while preserving UX shape.

## Visual Tokens

- Primary: deep teal.
- Accent: muted brass.
- Sale: warm red.
- Surface: warm white with restrained panel background.
- Radius: mostly 4-8 px, not heavily rounded cards.
- Typography: Arabic-friendly display/body stack; reference used El Messiri.

## Gaps To Recheck

- Salla-specific animation timing and carousel controls should be compared again after local screenshots.
- Real payment, shipping, and Cognito credentials are intentionally disabled until configured.
