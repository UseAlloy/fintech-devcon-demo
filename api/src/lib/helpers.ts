export const formatDate = (val: string) => {
  const date = new Date(val);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};
