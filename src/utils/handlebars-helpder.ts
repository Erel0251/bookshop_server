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

export const absoluteUrl = (path: string) => {
  const req = window.location;
  return `${req.protocol}:${req.port}//${req.host}${path}`;
};
