export interface PaymentProviderInterface {
  createPayment(order: any): Promise<{
    providerTransactionId?: string;
    paymentIntentId?: string;
    redirectUrl?: string;
    rawResponse?: any;
  }>;

  handleWebhook(payload: any, signature?: string): Promise<void>;
}