import Link from "next/link";

const Tag = ({ text, count }: any) => {
  return (
    <Link href={`/tags/${text}`}>
      <a className="text-sm mr-3 font-bold uppercase px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full">
        {text} {count ? `(${count})` : null}
      </a>
    </Link>
  );
};

export default Tag;
