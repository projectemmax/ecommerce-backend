/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PaymentController } from './payment.controller';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentService } from './payment.service';
import { PayMongoProvider } from './providers/paymongo.provider';
import { CodProvider } from './providers/cod.provider';

@Module({
  imports: [ConfigModule],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [
    PaymentService,
    PayMongoProvider,
    CodProvider,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}