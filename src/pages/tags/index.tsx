import Container from "@components/container";
import Layout from "@components/layout";
import Meta from "@components/meta";
import Tag from "@components/tag";
import { getAllTags } from "@lib/api";
import { generateOgImage } from "@lib/generateOgImage";

type Props = {
  tags: string[];
};

const Index = ({ tags }: Props) => {
  return (
    <Layout>
      <Meta title="Anto's blog Tags" description="Tags page" url="/tags" image="/og/tags.png" />
      <Container>
        <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:justify-center md:items-center md:divide-y-0 md:flex-row md:space-x-6 md:mt-24">
          <div className="pt-6 pb-8 space-x-2 md:space-y-5">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 md:border-r-2 md:px-6">
              Tags
            </h1>
          </div>
          <div className="flex flex-wrap max-w-lg">
            {Object.keys(tags).length === 0 && "No tags found."}
            {Object.keys(tags).map((t) => {
              return (
                <div key={t} className="mt-2 mb-2">
                  <Tag key={t} text={t} count={tags[t as any]} />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default Index;

export const getStaticProps = async () => {
  var tags = getAllTags();
  await generateOgImage({ slug: "tags", title: "Tags" });
  return {
    props: { tags },
  };
};
