export class OrderStatsDto {
  total: number;
  pending: number;
  shipped: number;
  delivered: number;
}

export class CartSummaryDto {
  items: number;
  total: number;
}

export class DashboardResponseDto {
  orderStats: OrderStatsDto;
  recentOrders: any[];
  defaultAddress: any | null;
  cartSummary: CartSummaryDto;
}