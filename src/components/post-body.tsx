type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
      <div className="pt-10 pb-8 prose dark:prose-dark max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default PostBody;
