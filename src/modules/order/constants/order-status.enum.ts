export enum OrderStatus {
  PENDING = 'PENDING', // when user create order
  CONFIRMED = 'CONFIRMED', // when manager/admin confirm order
  DELIVERING = 'DELIVERING', // when order is delivering
  DELIVERED = 'DELIVERED', // when order is delivered
  CANCELLED = 'CANCELLED', // when user cancel order
  REJECTED = 'REJECTED', // when manager/admin reject order
}
