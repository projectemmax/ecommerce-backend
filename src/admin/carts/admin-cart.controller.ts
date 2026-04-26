import {
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminCartService } from './admin-cart.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/carts')
export class AdminCartController {
  constructor(private readonly adminCartService: AdminCartService) {}

  // --------------------------------
  // GET /admin/carts
  // List all active carts (DRAFT)
  // --------------------------------
  @Get()
  getAllDraftCarts() {
    return this.adminCartService.getAllDraftCarts();
  }

  // --------------------------------
  // GET /admin/carts/:orderId
  // View a specific cart
  // --------------------------------
  @Get(':orderId')
  getCartById(@Param('orderId') orderId: string) {
    return this.adminCartService.getCartById(orderId);
  }

  // --------------------------------
  // GET /admin/carts/user/:userId
  // View a user's active cart
  // --------------------------------
  @Get('user/:userId')
  getCartByUser(@Param('userId') userId: string) {
    return this.adminCartService.getCartByUser(userId);
  }

  // --------------------------------
  // PATCH /admin/carts/:orderId/clear
  // Force clear a cart
  // --------------------------------
  @Patch(':orderId/clear')
  clearCart(@Param('orderId') orderId: string) {
    return this.adminCartService.clearCart(orderId);
  }
}