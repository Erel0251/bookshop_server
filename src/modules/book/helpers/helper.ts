// generate auto 13 digit ISBN
export const generateISBN = () => {
  const isbn = Math.floor(
    1000000000000 + Math.random() * 9000000000000,
  ).toString();
  return isbn;
};
