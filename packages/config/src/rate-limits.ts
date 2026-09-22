export const rateLimits = {
  catalogRead: { limit: 100, windowMs: 60_000 },
  search: { limit: 40, windowMs: 60_000 },
  login: { limit: 5, windowMs: 60_000 },
  registration: { limit: 3, windowMs: 60_000 },
  passwordReset: { limit: 3, windowMs: 15 * 60_000 },
  cartMutation: { limit: 60, windowMs: 60_000 },
  couponValidation: { limit: 15, windowMs: 60_000 },
  checkout: { limit: 10, windowMs: 60_000 },
  paymentCreation: { limit: 5, windowMs: 60_000 },
  reviews: { limit: 5, windowMs: 60 * 60_000 },
  contact: { limit: 5, windowMs: 60 * 60_000 },
  adminLogin: { limit: 5, windowMs: 60_000 },
  adminMutation: { limit: 60, windowMs: 60_000 },
} as const;

export type RateLimitPolicy = (typeof rateLimits)[keyof typeof rateLimits];
