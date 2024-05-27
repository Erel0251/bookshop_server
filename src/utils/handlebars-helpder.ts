export const showNum = (value?: number) => {
  return value ? '0' : value;
};

export const indexOne = (index: number) => {
  return index + 1;
};

export const formatDate = (date: Date) => {
  // Format date to dd/mm/yyyy
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const absoluteUrl = () => {
  const req = window.location;
  return `${req.protocol}:${req.port}//`;
};

// Format name to normal: '   nguyen van a  ' => 'Nguyen Van A'
export const formatName = (name: string) => {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPrice = (price: any = 0, currency: string = 'VND') => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency });
};
