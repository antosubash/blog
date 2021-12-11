import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const PageTitle = ({ children }: Props) => {
  return (
    <h1 className="text-2xl px-5 md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left text-gray-900 dark:text-gray-100">
      {children}
    </h1>
  );
};

export default PageTitle;
