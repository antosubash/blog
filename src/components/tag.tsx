import Link from "next/link";
import kebabCase from "../lib/utils/kebabCase";

const Tag = ({ text }: any) => {
  return (
    <Link href={`/tags/${text}`}>
      <a className="text-sm mr-3 font-bold uppercase px-3 py-1 bg-gray-400 dark:bg-gray-600 rounded-full">
        {text}
      </a>
    </Link>
  );
};

export default Tag;
