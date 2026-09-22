export type PaymentIntent = {
  id: string;
  amount: number;
  currency: "ILS";
  status: "requires_confirmation" | "succeeded" | "failed" | "refunded";
};

export interface PaymentProvider {
  createPayment(input: {
    orderId: string;
    amount: number;
    currency: "ILS";
  }): Promise<PaymentIntent>;
  verifyWebhook(payload: unknown, signature: string | undefined): Promise<PaymentIntent>;
  getPayment(paymentId: string): Promise<PaymentIntent>;
  refundPayment(paymentId: string, amount: number): Promise<PaymentIntent>;
}
