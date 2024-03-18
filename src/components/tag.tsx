import { useRouter } from "next/router";

const Tag = ({ text, count }: any) => {
  var router = useRouter();
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        router.push(`/tags/${text}`);
      }}
      className="text-sm mr-3 font-bold uppercase px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full cursor-pointer"
    >
      {text} {count ? `(${count})` : null}
    </div>
  );
};

export default Tag;
