import * as hbs from 'hbs';

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
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatPrice = (price: any = 0, currency: string = 'VND') => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency });
};

const formatCategory = (children: string, parent?: string) => {
  if (!parent) {
    return children;
  }
  return `${parent} > ${children}`;
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
    discount ? discount + '%' : '0%',
  );
}
