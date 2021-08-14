const formatDate = (date: string | number | Date) => {
  const now = new Date(date).toLocaleDateString();
  return now;
};

export default formatDate;
