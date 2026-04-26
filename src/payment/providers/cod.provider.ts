import { Injectable } from '@nestjs/common';

@Injectable()
export class CodProvider {
  async createPayment(order: any) {
    return {
      providerTransactionId: `COD-${order.orderNumber}`,
      redirectUrl: null,
      rawResponse: {
        type: 'COD',
      },
    };
  }
}