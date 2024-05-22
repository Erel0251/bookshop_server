import { OrderStatus } from '../constants/order-status.enum';

// Valid status transition
export const validStatusTransition = (
  from: OrderStatus,
  to: OrderStatus,
): boolean => {
  const validTransitions = {
    [OrderStatus.PENDING]: [
      OrderStatus.CONFIRMED,
      OrderStatus.CANCELED,
      OrderStatus.REJECTED,
    ],
    [OrderStatus.CONFIRMED]: [OrderStatus.DELIVERING, OrderStatus.CANCELED],
    [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELED]: [],
    [OrderStatus.REJECTED]: [],
  };

  return validTransitions[from].includes(to);
};
