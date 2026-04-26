// payment.entity.ts
export class Payment {
    id: string;
    orderId: string;

    attemptNo: number;

    status: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

    paymentMethod: string;
    amount: number;

    redirectUrl?: string;

    createdAt: Date;
    updatedAt: Date;
    paidAt?: Date;
    expiredAt?: Date;
}