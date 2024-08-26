export enum OrderStatus {
  PENDING = 'PENDING', // when user create order
  CANCELLED = 'CANCELLED', // when user cancel order
  REJECTED = 'REJECTED', // when manager/admin reject order
  CONFIRMED = 'CONFIRMED', // when manager/admin confirm order
  // DELIVERING = 'DELIVERING', // when order is delivering
  // DELIVERED = 'DELIVERED', // when order is delivered
  // SUCCESS = 'SUCCESS', // when order is successs
  // REFUND = 'REFUND', // when user request refund
  // REFUSED = 'REFUSED', // when manager/admin refuse refund
  // ACCEPTED = 'ACCEPTED', // when manager/admin accept refund
  // REFUNDING = 'REFUNDING', // when refund is processing
  // COMPLETED = 'COMPLETED', // when order is completed
}
