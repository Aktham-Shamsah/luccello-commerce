export type ShippingQuote = {
  provider: "mock";
  serviceLevel: "standard" | "express";
  amount: number;
  currency: "ILS";
  etaDays: number;
};

export interface ShippingProvider {
  quote(input: { city: string; subtotal: number }): Promise<ShippingQuote[]>;
  createShipment(input: {
    orderId: string;
    serviceLevel: ShippingQuote["serviceLevel"];
  }): Promise<{ trackingCode: string }>;
  getTracking(trackingCode: string): Promise<{ status: "created" | "in_transit" | "delivered" }>;
  cancelShipment(trackingCode: string): Promise<{ cancelled: true }>;
}

export class MockShippingProvider implements ShippingProvider {
  async quote(input: { city: string; subtotal: number }): Promise<ShippingQuote[]> {
    return [
      {
        provider: "mock",
        serviceLevel: "standard",
        amount: input.subtotal >= 196 ? 0 : 30,
        currency: "ILS",
        etaDays: 3,
      },
      { provider: "mock", serviceLevel: "express", amount: 45, currency: "ILS", etaDays: 1 },
    ];
  }

  async createShipment(input: { orderId: string; serviceLevel: ShippingQuote["serviceLevel"] }) {
    return { trackingCode: `MOCK-${input.serviceLevel}-${input.orderId}` };
  }

  async getTracking() {
    return { status: "created" as const };
  }

  async cancelShipment() {
    return { cancelled: true as const };
  }
}
