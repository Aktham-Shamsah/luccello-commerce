import type { PaymentIntent, PaymentProvider } from "./payment.types.js";

const payments = new Map<string, PaymentIntent>();

export class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: {
    orderId: string;
    amount: number;
    currency: "ILS";
  }): Promise<PaymentIntent> {
    const payment: PaymentIntent = {
      id: `pay_${input.orderId}`,
      amount: input.amount,
      currency: input.currency,
      status: "requires_confirmation",
    };
    payments.set(payment.id, payment);
    return payment;
  }

  async verifyWebhook(payload: unknown): Promise<PaymentIntent> {
    const paymentId =
      typeof payload === "object" && payload != null && "paymentId" in payload
        ? String(payload.paymentId)
        : "unknown";
    const existing = payments.get(paymentId);
    if (!existing) throw new Error("payment_not_found");
    const updated = { ...existing, status: "succeeded" as const };
    payments.set(paymentId, updated);
    return updated;
  }

  async getPayment(paymentId: string): Promise<PaymentIntent> {
    const payment = payments.get(paymentId);
    if (!payment) throw new Error("payment_not_found");
    return payment;
  }

  async refundPayment(paymentId: string, amount: number): Promise<PaymentIntent> {
    const payment = await this.getPayment(paymentId);
    const refunded = { ...payment, amount, status: "refunded" as const };
    payments.set(paymentId, refunded);
    return refunded;
  }
}
