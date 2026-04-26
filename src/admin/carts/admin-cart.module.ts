import { Module } from '@nestjs/common';
import { AdminCartController } from './admin-cart.controller';
import { AdminCartService } from './admin-cart.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCartController],
  providers: [AdminCartService],
})
export class AdminCartModule {}