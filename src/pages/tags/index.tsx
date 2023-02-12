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
      <Meta
        title="Anto's blog Tags"
        description="Tags page"
        url="/tags"
        image="/og/tags.png"
      />
      <Container>
        <div className="divide-y">
          <div className="pt-6 pb-8">
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-6xl">
              Tags
            </h1>
          </div>
          <div className="flex flex-wrap pt-4">
            {Object.keys(tags).length === 0 && "No tags found."}
            {Object.keys(tags).sort().map((t) => {
              return (
                <div key={t} className="mt-2 mb-2 text-lg">
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
  var tags = await getAllTags();
  await generateOgImage({ slug: "tags", title: "Tags" });
  return {
    props: { tags },
  };
};
