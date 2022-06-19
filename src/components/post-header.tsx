import DateFormatter from "./date-formatter";
import Tag from "./tag";

type Props = {
  title: string;
  date: string;
  tags: string[];
  series: string;
  part: number;
};

const PostHeader = ({ title, date, tags, series, part }: Props) => {
  return (
    <article>
      <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
        <header className="pt-6 xl:pb-6">
          <div className="space-y-1 text-center">
            <dl className="space-y-10">
              <div>
                <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                  <time dateTime={date}>
                    <DateFormatter dateString={date} />
                  </time>
                </dd>
              </div>
            </dl>
            <div className="flex flex-row flex-wrap justify-center pb-2">
              {tags.map((tag) => (
                <div className="mt-3" id={tag}>
                  <Tag text={tag} />
                </div>
              ))}
            </div>

            {series && (
              <div className="pt-4">
                <dd className="text-2xl font-bold leading-6">
                  {series} <span>-</span>
                  <span className="pt-4 px-2 text-2xl font-bold leading-6">
                    Part : {part}
                  </span>
                </dd>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
                {title}
              </h1>
            </div>
          </div>
        </header>
      </div>
    </article>
  );
};

export default PostHeader;
