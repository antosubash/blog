import Tag from "@components/tag";
import { getTags } from "@lib/content";

const Index = () => {
  const tags = getTags();
  return (
    <div className="divide-y">
      <div className="pt-6 pb-8">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-6xl">
          Tags
        </h1>
      </div>
      <div className="flex flex-wrap pt-4">
        {tags &&
          tags.length > 0 &&
          tags.map((t) => {
            return (
              <div key={t.name} className="mt-2 mb-2 text-lg">
                <Tag key={t} text={t.name} count={t.count} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Index;
