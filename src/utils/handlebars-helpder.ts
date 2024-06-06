import * as hbs from 'hbs';
import { OrderDetail } from '../modules/order/entities/order-detail.entity';
import { Review } from '../modules/review/entities/review.entity';

const formatDate = (req: Date) => {
  // Format date to dd/mm/yyyy
  const date = new Date(req);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Format name to normal: '   nguyen van a  ' => 'Nguyen Van A'
const formatName = (name: string) => {
  return (
    name &&
    name
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  );
};

const formatPrice = (price: any = 0, currency: string = 'VND') => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency });
};

const formatCategory = (children: string, parent?: string) => {
  if (!parent) {
    return formatName(children);
  }
  return `${formatName(parent)} > ${formatName(children)}`;
};

const formatAddress = (
  address: string,
  ward: string,
  district: string,
  province: string,
) => {
  return `${address}, ${ward}, ${district}, ${province}`;
};

const totalPrice = (orderDetail: OrderDetail[], shipping: number = 0) => {
  if (!orderDetail) {
    return 0;
  } else {
    const total = orderDetail.reduce(
      (total, item) => total + item.total_price,
      shipping || 0,
    );
    return formatPrice(total);
  }
};

const formatPublished = (published: boolean) => {
  return published ? 'Published' : 'Unpublished';
};

const avgRating = (reviews: Review[]) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  const total = reviews.reduce((total, review) => total + review.rating, 0);
  return (total / reviews.length).toFixed(1);
};

export function registerHelpers() {
  hbs.registerHelper('showNum', (value) => (value ? value : '0'));
  hbs.registerHelper('inc', (index) => index + 1);
  hbs.registerHelper('formatDate', formatDate);
  hbs.registerHelper('lowerCase', (str: string) => str.toLowerCase());
  hbs.registerHelper('formatName', formatName);
  hbs.registerHelper('json', (context) => JSON.stringify(context));
  hbs.registerHelper('formatPrice', formatPrice);
  hbs.registerHelper('formatCategory', formatCategory);
  hbs.registerHelper('formatDiscount', (discount) =>
    discount ? discount * 100 + '%' : '0%',
  );
  hbs.registerHelper('parentName', (parent) =>
    parent ? parent.name : 'No parent',
  );
  hbs.registerHelper('formatAddress', formatAddress);
  hbs.registerHelper('totalPrice', totalPrice);
  hbs.registerHelper('isPending', (status) => status === 'PENDING');
  hbs.registerHelper('formatPublished', formatPublished);
  hbs.registerHelper('avgRating', avgRating);
}
