import { OrderStatus } from '../constants/order-status.enum';

// Valid status transition
export const validStatusTransition = (
  from: OrderStatus,
  to: OrderStatus,
): boolean => {
  const validTransitions = {
    [OrderStatus.PENDING]: [
      OrderStatus.CONFIRMED,
      OrderStatus.CANCELLED,
      OrderStatus.REJECTED,
    ],
    [OrderStatus.CONFIRMED]: [OrderStatus.DELIVERING, OrderStatus.CANCELLED],
    [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.REJECTED]: [],
  };

  return validTransitions[from].includes(to);
};
