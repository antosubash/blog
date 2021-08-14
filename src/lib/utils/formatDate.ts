import { siteMetadata } from "../../data/siteMetadata";

const formatDate = (date: string | number | Date) => {
  const now = new Date(date).toLocaleDateString(siteMetadata.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return now;
};

export default formatDate;
